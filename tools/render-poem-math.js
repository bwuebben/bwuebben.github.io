const katex = require('katex');
const F = [
  ['eta',  String.raw`\eta_{\mathrm{intel}} \;=\; \dfrac{dI_{\mathrm{useful}}}{dE}`],
  ['ebit', String.raw`E_{\mathrm{bit}} \;=\; k_{\!B}\, T \,\ln 2`],
  ['flow', String.raw`\dfrac{dS_{\mathrm{int}}}{dt} \;+\; \dfrac{dS_{\mathrm{env}}}{dt} \;=\; 0`],
  ['iaw',  String.raw`I_{\mathrm{aware}} \;=\; \int_{0}^{\,\tau}\!\eta_{\mathrm{intel}}(t)\;\dfrac{dE}{dt}\;dt`],
];
const out = {};
for (const [k, tex] of F) {
  out[k] = katex.renderToString(tex, {displayMode: true, output: 'html', throwOnError: true});
}
require('fs').writeFileSync('math.json', JSON.stringify(out, null, 1));
// which font families does the output actually need?
const all = Object.values(out).join(' ');
const fams = new Set();
for (const m of all.matchAll(/class="[^"]*\b(mathnormal|mathrm|mathit|mainrm|amsrm|size\d)\b[^"]*"/g)) fams.add(m[1]);
console.log('rendered ok; class families seen:', [...fams].join(', '));
