#!/usr/bin/env node
// Pre-render the poem's four formulas with KaTeX and write them into poem.html.
// Each formula lands in the `.pmath` block whose data-formula attribute matches
// its key. Output is HTML for sighted readers plus MathML for screen readers.
//
//   npm install katex            # once, anywhere on NODE_PATH
//   node tools/render-poem-math.js
const fs = require('fs');
const path = require('path');
const katex = require('katex');

const FORMULAS = {
  eta:  String.raw`\eta_{\mathrm{intel}} \;=\; \dfrac{dI_{\mathrm{useful}}}{dE}`,
  ebit: String.raw`E_{\mathrm{erase}} \;\ge\; k_{\!B}\, T \,\ln 2`,
  flow: String.raw`\dfrac{dS_{\mathrm{int}}}{dt} \;+\; \dfrac{dS_{\mathrm{env}}}{dt} \;\ge\; 0`,
  iaw:  String.raw`I_{\mathrm{aware}} \;=\; \int_{0}^{\,\tau}\!\eta_{\mathrm{intel}}(t)\;\dfrac{dE}{dt}\;dt`,
};

// The shipped stylesheet prefixes a few of KaTeX's generic class names
// (base, strut, sizing, ...) with "katex-" so they cannot collide with the
// site's own classes. Derive that list from the stylesheet itself: a name is
// renamed when ".katex-<name>" is styled and a bare ".<name>" is not.
const css = fs.readFileSync(path.join(__dirname, '..', 'assets/katex/katex.min.css'), 'utf8');
const prefixed = new Set([...css.matchAll(/\.katex-([a-z][a-z0-9-]*)/g)].map((m) => m[1]));
const bare = new Set([...css.matchAll(/(?<![\w-])\.([a-z][a-z0-9-]*)/g)].map((m) => m[1]));
const renamed = [...prefixed].filter((name) => !bare.has(name));
for (const required of ['base', 'strut', 'sizing']) {
  if (!renamed.includes(required)) throw new Error(`stylesheet no longer prefixes "${required}"`);
}
const adapt = (markup) => markup.replace(/class="([^"]*)"/g, (_, classes) =>
  'class="' + classes.split(/\s+/).map((c) => (renamed.includes(c) ? `katex-${c}` : c)).join(' ') + '"');

const page = path.join(__dirname, '..', 'poem.html');
let html = fs.readFileSync(page, 'utf8');
let count = 0;
for (const [key, tex] of Object.entries(FORMULAS)) {
  const rendered = adapt(katex.renderToString(tex, {
    displayMode: true, output: 'htmlAndMathml', throwOnError: true,
  }));
  const block = new RegExp(
    `(<div class="pmath" data-formula="${key}">\\s*)[\\s\\S]*?(\\n\\s*<p class="pcaption">)`);
  if (!block.test(html)) throw new Error(`poem.html has no .pmath block for "${key}"`);
  html = html.replace(block, (_, open, close) => open + rendered + close);
  count += 1;
}
fs.writeFileSync(page, html);
console.log(`rendered ${count} formulas into poem.html (KaTeX ${katex.version}, HTML + MathML; `
  + `prefixed classes: ${renamed.join(', ')})`);
