# /// script
# dependencies = ["matplotlib"]
# ///
"""Draw representatives in the lattice of the faces of the thirty-point example."""
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
from matplotlib import pyplot as plt
from matplotlib.patches import Polygon

output = Path(__file__).resolve().parents[1] / "assets/illustrations/smoothability-faces.png"
hexagon = [(1, 0), (1, 1), (0, 1), (-1, 0), (-1, -1), (0, -1)]
faces = [
    ([(0, 0), (1, 0), (1, 1), (0, 1)], "#833d39"),
    (hexagon[1:], "#78592f"),
    (hexagon, "#336655"),
]

fig = plt.figure(figsize=(12, 3.58), dpi=100, facecolor="#f3f1ec")
for index, (vertices, color) in enumerate(faces):
    ax = fig.add_axes([index / 3, 0, 1 / 3, 1])
    ax.set_aspect("equal")
    ax.axis("off")
    xs, ys = zip(*vertices)
    cx, cy = (max(xs) + min(xs)) / 2, (max(ys) + min(ys)) / 2
    ax.set_xlim(cx - 1.9, cx + 1.9)
    ax.set_ylim(cy - 1.7, cy + 1.7)
    for k in range(-3, 4):
        ax.axvline(k, color="#dedbd2", linewidth=0.8, zorder=0)
        ax.axhline(k, color="#dedbd2", linewidth=0.8, zorder=0)
    for x in range(-3, 4):
        ax.scatter([x] * 7, range(-3, 4), s=7, color="#bdb7aa", linewidths=0)
    ax.add_patch(Polygon(vertices, facecolor=color, alpha=0.11, edgecolor="none"))
    ax.add_patch(Polygon(vertices, facecolor="none", edgecolor=color, linewidth=3.8, joinstyle="round"))
    ax.scatter(xs, ys, s=60, color=color, linewidths=0, zorder=4)
    if len(vertices) > 4:
        ax.scatter([0], [0], s=40, color=color, linewidths=0, zorder=4)

fig.savefig(output, dpi=100)
plt.close(fig)
