// Run against a locally served build or the deployed version of this checkout.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const base = new URL(process.argv[2] || 'http://127.0.0.1:8000');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
const viewports = [[1440, 900], [781, 900], [780, 900], [768, 900], [621, 768], [620, 768], [545, 760], [544, 760],
  [390, 844], [375, 760], [374, 760], [320, 568]];

// Resolve document-relative assets and group routes that load the same layout.
// All paper records, for example, use one template and one set of stylesheets.
function layoutSignature(route) {
  const file = route.endsWith('/') ? route + 'index.html' : route;
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  assert.equal(source.split('<!-- site:navigation -->').length, 2, route + ' shared header');
  const head = source.slice(0, source.indexOf('</head>'));
  const styles = [...head.matchAll(/<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"/gi)];
  const scripts = [...source.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/gi)];
  const assets = [...styles, ...scripts].map(match => new URL(match[1], new URL(route, base)).href);
  assert.ok(assets.some(url => new URL(url).pathname === '/assets/style.css'), route + ' shared stylesheet');
  return JSON.stringify([source.match(/<html\b[^>]*>/i)[0], source.match(/<body\b[^>]*>/i)[0],
    assets, head.match(/<style\b[^>]*>[\s\S]*?<\/style>/gi) || []]);
}

function headerSnapshot() {
  const nav = document.querySelector('body > .site-header > .site-nav');
  const controls = [...nav.querySelectorAll(':scope > ul > li > a, :scope > ul > li > details > summary')];
  function box(element) {
    const r = element.getBoundingClientRect();
    return [r.x, r.y, r.width, r.height].map(n => Math.round(n * 100) / 100);
  }
  function label(element) {
    const s = getComputedStyle(element);
    return [element.textContent.trim(), box(element), s.fontFamily, s.fontSize, s.fontWeight,
      s.lineHeight, s.letterSpacing, s.textTransform, s.padding];
  }
  const labels = controls.map(label);
  const menus = [];
  for (const control of controls.filter(element => element.tagName === 'SUMMARY')) {
    control.click();
    if (controls.some((item, i) => box(item).some((n, j) => n !== labels[i][1][j]))) {
      throw Error(control.textContent + ' moved the header when opened');
    }
    const menu = control.nextElementSibling;
    const r = menu.getBoundingClientRect();
    if (r.width === 0 || r.left < -0.5 || r.right > innerWidth + 0.5) {
      throw Error(control.textContent + ' menu extends outside the viewport');
    }
    const first = menu.querySelector('a').getBoundingClientRect();
    const hit = document.elementFromPoint(first.x + first.width / 2, first.y + first.height / 2);
    if (!menu.contains(hit)) throw Error(control.textContent + ' menu is covered');
    menus.push([control.textContent, box(menu), getComputedStyle(menu).backgroundColor,
      [...menu.querySelectorAll('li')].map(item => label(item.firstElementChild || item))]);
    control.click();
  }
  return { header: box(nav.parentElement), nav: box(nav), labels, menus };
}

async function main() {
  const groups = new Map();
  for (const route of routes) {
    const signature = layoutSignature(route);
    if (!groups.has(signature)) groups.set(signature, route);
  }
  const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
  try {
    const page = await browser.newPage();
    const reference = new Map();
    for (const route of new Set(['/', ...groups.values()])) {
      const response = await page.goto(new URL(route, base).href, { waitUntil: 'load' });
      assert.equal(response.status(), 200, route);
      await page.evaluate(() => document.fonts.ready);
      for (const [width, height] of viewports) {
        await page.emulateMedia({ colorScheme: width === 390 ? 'dark' : 'light' });
        await page.setViewportSize({ width, height });
        const snapshot = await page.evaluate(headerSnapshot).catch(error => {
          throw Error(route + ' at ' + width + 'px: ' + error.message);
        });
        if (route === '/') reference.set(width, snapshot);
        else for (const [part, actual] of Object.entries(snapshot)) {
          assert.deepEqual(actual, reference.get(width)[part], route + ' at ' + width + 'px: ' + part);
        }
      }
    }
    console.log(routes.length + ' sitemap pages checked. All ' + groups.size +
      ' layout families match the homepage header and dropdowns at ' + viewports.length + ' viewport sizes.');
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
