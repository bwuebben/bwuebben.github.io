"""Inline, accessible SVG for the leading three-scale example in Paper 28."""
from math import log10, sqrt

def spectral_hero():
    def xy(h, value):
        return 60 + 197 * (-log10(h) - 1), 34 - 20 * log10(value)
    def path(coefficient, power):
        points = [xy(h, coefficient * h**power) for h in (0.1, 0.001)]
        return 'M%.2f %.2f L%.2f %.2f' % (*points[0], *points[1])
    ticks = []
    for power, label in ((2, '10⁻²'), (4, '10⁻⁴'), (6, '10⁻⁶'), (8, '10⁻⁸'), (10, '10⁻¹⁰'), (12, '10⁻¹²')):
        y = 34 + 20 * power
        ticks.append(f'<path class="spectrum-grid" d="M60 {y}H454"/><text class="spectrum-tick" x="48" y="{y+5}" text-anchor="end">{label}</text>')
    for power, label in ((1, '10⁻¹'), (2, '10⁻²'), (3, '10⁻³')):
        x = 60 + 197 * (power - 1)
        ticks.append(f'<path class="spectrum-grid" d="M{x} 34V274"/><text class="spectrum-tick" x="{x}" y="299" text-anchor="middle">{label}</text>')
    band = [xy(.1, (2-sqrt(2))*.1), xy(.001, (2-sqrt(2))*.001), xy(.001, (2+sqrt(2))*.001), xy(.1, (2+sqrt(2))*.1)]
    band_path = 'M' + ' L'.join(f'{x:.2f} {y:.2f}' for x, y in band) + ' Z'
    gap = [xy(.1, .1**2/2), xy(.001, .001**2/2), xy(.001, .001**4), xy(.1, .1**4)]
    gap_path = 'M' + ' L'.join(f'{x:.2f} {y:.2f}' for x, y in gap) + ' Z'
    families = [('fast-low', 2-sqrt(2), 1, 'fast'), ('fast-middle', 2, 1, 'fast'), ('fast-high', 2+sqrt(2), 1, 'fast'), ('middle', .5, 2, 'middle'), ('slow', 1, 4, 'slow')]
    curves = '\n'.join(f'<path class="spectrum-curve spectrum-{kind}" d="{path(c, power)}"/>' for _, c, power, kind in families)
    markers = []
    for name, c, power, kind in families:
        x, y = xy(.01, c*.01**power)
        markers.append(f'<circle id="spectral-{name}" class="spectrum-marker spectrum-{kind}" cx="{x:.2f}" cy="{y:.2f}" r="3.3"/>')
    return f'''<figure class="spectral-hero" aria-labelledby="spectral-title" aria-describedby="spectral-caption">
<p class="eyebrow">A phenomenon behind the papers</p><h2 id="spectral-title">One limit. Three clocks.</h2>
<svg class="spectral-plot" viewBox="0 0 520 330" role="img" aria-labelledby="spectral-chart-title spectral-chart-desc">
<title id="spectral-chart-title">Twelve weak eigenvalues separate into three scales</title>
<desc id="spectral-chart-desc">Logarithmic axes show h decreasing from one tenth to one thousandth. Three leading rates of order h, each with multiplicity three, lie in the upper band. Two modes have leading rate h squared over two; one has leading rate h to the fourth. Smaller eigenvalues correspond to longer inverse-rate scales.</desc>
<text class="spectrum-axis-label" x="60" y="17">WEAK EIGENVALUE λ</text>
{''.join(ticks)}
<path class="spectrum-separation" d="{gap_path}"/><path class="spectrum-band" d="{band_path}"/>
{curves}
<text class="spectrum-end-label spectrum-fast" x="470" y="94">h</text>
<text class="spectrum-end-label spectrum-middle" x="470" y="164">h²</text>
<text class="spectrum-end-label spectrum-slow" x="470" y="278">h⁴</text>
<line id="spectral-cursor" class="spectrum-cursor" x1="257" x2="257" y1="34" y2="274"/>
{''.join(markers)}
<text class="spectrum-axis-label" x="257" y="325" text-anchor="middle">h → 0 · LOGARITHMIC AXES</text>
</svg>
<div class="spectral-legend" aria-label="Mode multiplicities"><span class="spectral-fast-key">9 modes · order h</span><span class="spectral-middle-key">2 modes · order h²</span><span class="spectral-slow-key">1 mode · order h⁴</span></div>
<div class="spectral-control"><label for="spectral-parameter">Approach the limit →</label><output id="spectral-h-value" for="spectral-parameter">h = 0.0100</output><input id="spectral-parameter" type="range" min="1" max="3" step="0.02" value="2" disabled aria-label="Approach degeneration by decreasing h" aria-valuetext="h = 0.0100; inverse slowest model rate 10⁸"><span class="spectral-range-end">h = 0.1</span><span class="spectral-range-end spectral-range-right">h = 0.001</span></div>
<dl class="spectral-readouts"><div><dt>Inverse slowest rate · h⁻⁴</dt><dd id="spectral-inverse">10⁸</dd></div><div><dt>Fastest / slowest rate</dt><dd id="spectral-spread">3.41 × 10⁶</dd></div></dl>
<figcaption id="spectral-caption">Leading terms from <a href="/papers/all-time-hym-curves/">Paper 28’s stable curve family</a>. The weak modes separate into very different relaxation scales. This is an asymptotic spectral model, not a simulation of nonlinear flow.</figcaption>
<details class="spectral-formulas"><summary>The rates behind the picture</summary><p>The fast band contains h(2 − √2), 2h and h(2 + √2), each three times. The remaining leading rates are h²/2 twice and h⁴ once. The actual eigenvalues have higher-order corrections; the all-time nonlinear comparison requires its separate fixed-constraint, small-basin hypotheses.</p></details>
<span id="spectral-live" class="spectral-sr-only" aria-live="polite"></span>
</figure>'''
