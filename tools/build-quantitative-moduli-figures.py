#!/usr/bin/env python3
"""Build the two opening illustrations for the quantitative moduli guide.

Regenerate with: uv run --with matplotlib python tools/build-quantitative-moduli-figures.py
The wall crossing is schematic. The flow plot evaluates the signed two-factor
profile in dimensionless variables u = d tau and P/d, for delta = d, 0, -d.
"""
from io import StringIO
from math import cos, pi, sin, sqrt
from pathlib import Path
import re

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets/illustrations"
PALETTE = """<style>
svg { --green: #40685b; --gold: #a17b44; --accent: #7a2e2e;
      --ink: #55524c; --rule: #ddd9d1; --bg: #fbfaf8; }
@media (prefers-color-scheme: dark) {
  svg { --green: #91b7a7; --gold: #d0ac76; --accent: #d98a8a;
        --ink: #a9a49b; --rule: #2e2e35; --bg: #16161a; }
}
text { font-family: system-ui, sans-serif; }
</style>"""


def path(points):
    return "M" + " L".join(f"{x:.2f},{y:.2f}" for x, y in points)


def wall_crossing():
    parts = ["""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" role="img" aria-labelledby="title desc">
<title id="title">From a singular wall to nearby chamber geometry</title>
<desc id="desc">Schematic smooth regions on either side map to a singular central region. Highlighted central loci contract to the wall point. The surfaces symbolize local moduli geometry, not an embedding of a particular moduli space.</desc>""", PALETTE,
             """<defs><marker id="arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1L6 4L1 7" fill="none" stroke="var(--ink)" stroke-width="1.2"/></marker></defs>"""]
    for cx, waist, color, label in [(100, 22, "green", "M₋"), (300, 0, "gold", "M₀"), (500, 22, "accent", "M₊")]:
        def point(z, theta):
            r = sqrt((.72 * z) ** 2 + waist ** 2)
            return cx + r * cos(theta), 143 + z + .32 * r * sin(theta)

        # A wireframe symbol: the middle waist collapses, while the two chamber
        # symbols retain a highlighted locus. No dimension or topology is encoded.
        outline = [point(z, 0) for z in np.linspace(-72, 72, 100)]
        outline += [point(z, pi) for z in np.linspace(72, -72, 100)]
        parts.append(f'<path d="{path(outline)}Z" fill="var(--{color})" fill-opacity=".055"/>')
        parts.append(f'<g fill="none" stroke="var(--{color})" stroke-width="1.1">')
        for theta in np.linspace(0, 2 * pi, 12, endpoint=False):
            points = [point(z, theta) for z in np.linspace(-72, 72, 100)]
            opacity = ".24" if sin(theta) < 0 else ".55"
            parts.append(f'<path d="{path(points)}" opacity="{opacity}"/>')
        for z in [-72, -54, -36, -18, 18, 36, 54, 72]:
            points = [point(z, theta) for theta in np.linspace(0, 2 * pi, 120)]
            parts.append(f'<path d="{path(points)}" opacity=".45"/>')
        parts.append("</g>")
        if waist:
            points = [point(0, theta) for theta in np.linspace(0, 2 * pi, 120)]
            parts.append(f'<path d="{path(points)}" fill="var(--{color})" fill-opacity=".13" stroke="var(--{color})" stroke-width="2.5"/>')
        else:
            parts.append('<circle cx="300" cy="143" r="12" fill="var(--gold)" fill-opacity=".13"/><circle cx="300" cy="143" r="3.8" fill="var(--gold)"/>')
        parts.append(f'<text x="{cx}" y="33" text-anchor="middle" fill="var(--{color})" style="font: italic 28px Georgia, serif">{label}</text>')
    parts.append('''<g stroke="var(--ink)" stroke-width="1.2" fill="none" marker-end="url(#arrow)">
<path d="M170 143H230"/><path d="M430 143H370"/>
</g>
<g fill="var(--ink)" text-anchor="middle" font-size="17">
<text x="100" y="263">chamber</text><text x="300" y="263">wall</text><text x="500" y="263">chamber</text>
</g></svg>''')
    (OUT / "moduli-wall-crossing.svg").write_text("\n".join(parts) + "\n")


def flow_profile():
    plt.rcParams.update({"svg.fonttype": "none", "svg.hashsalt": "hym-flow-profile",
                         "font.size": 15, "font.family": "DejaVu Sans"})
    fig, ax = plt.subplots(figsize=(6.4, 4.25))
    fig.subplots_adjust(left=.10, right=.97, bottom=.18, top=.89)
    u = np.linspace(.23, 4, 600)
    stable = -1 / np.expm1(-2 * u)
    wall = 1 / (2 * u)
    unstable = 1 / np.expm1(2 * u)
    for y, color, dash in [(stable, "#40685b", "-"), (wall, "#a17b44", (0, (6, 3))),
                           (unstable, "#7a2e2e", (0, (2, 3)))]:
        ax.plot(u, y, color=color, lw=2.6, linestyle=dash, solid_capstyle="round")
    ax.set(xlim=(0, 4.1), ylim=(0, 2.4), xticks=[0, 1, 2, 3, 4], yticks=[0, 1, 2])
    ax.set_xlabel("scaled time", fontsize=14, color="#55524c", labelpad=9)
    ax.text(0, 1.07, "weak spectral scale", transform=ax.transAxes,
            fontsize=14, color="#55524c")
    ax.text(2.25, 1.14, "stable", fontsize=15, color="#40685b")
    ax.text(2.25, .43, "wall", fontsize=15, color="#a17b44")
    ax.annotate("unstable", xy=(1.8, 1 / np.expm1(3.6)), xytext=(.78, .69),
                fontsize=15, color="#7a2e2e", arrowprops={"arrowstyle": "-", "color": "#7a2e2e", "lw": .8})
    ax.set_axisbelow(True)
    ax.grid(axis="y", color="#ddd9d1", linewidth=.65)
    ax.tick_params(length=0, pad=7, labelsize=13, colors="#55524c")
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    for side in ("bottom", "left"):
        ax.spines[side].set_color("#ddd9d1")
        ax.spines[side].set_linewidth(.8)
    stream = StringIO()
    fig.savefig(stream, format="svg", transparent=True, metadata={"Date": None})
    plt.close(fig)
    svg = stream.getvalue()
    svg = svg[svg.index("<svg"):]
    svg = re.sub(r'<metadata>.*?</metadata>\s*', '', svg, flags=re.S)
    svg = svg.replace('version="1.1"', 'version="1.1" role="img" aria-labelledby="title desc"', 1)
    end = svg.index(">") + 1
    svg = svg[:end] + '''
<title id="title">The signed two-factor flow profile</title>
<desc id="desc">With time and spectral scale normalized by a positive slope-gap magnitude, the stable profile tends to one, the wall profile decays reciprocally, and the unstable profile decays exponentially to zero. These are exact model curves, not simulated Hermitian Yang–Mills trajectories.</desc>
''' + PALETTE + svg[end:]
    for color, variable in {"#40685b": "green", "#a17b44": "gold", "#7a2e2e": "accent",
                            "#55524c": "ink", "#ddd9d1": "rule"}.items():
        # Preserve the palette declarations themselves.
        svg = svg.replace(f"stroke: {color}", f"stroke: var(--{variable})")
        svg = svg.replace(f"fill: {color}", f"fill: var(--{variable})")
    svg = svg.replace("'DejaVu Sans'", "system-ui, sans-serif")
    svg = "\n".join(line.rstrip() for line in svg.splitlines()) + "\n"
    (OUT / "hym-flow-profile.svg").write_text(svg)


if __name__ == "__main__":
    wall_crossing()
    flow_profile()
    print("Built moduli-wall-crossing.svg and hym-flow-profile.svg")
