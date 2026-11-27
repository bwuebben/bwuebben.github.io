# /// script
# requires-python = ">=3.11,<3.14"
# dependencies = ["mitsuba==3.9.1", "numpy", "pillow"]
# ///
"""Render the three local models for the smoothability guide.

Run with uv run tools/build-conifold-cycles.py. The smoothing uses the Hopf
coordinates of conifold-lab/model.js and stereographic projection from S³.
"""
from pathlib import Path
from tempfile import TemporaryDirectory

import mitsuba as mi
import numpy as np
from PIL import Image

mi.set_variant("scalar_rgb")
OUTPUT = Path(__file__).resolve().parents[1] / "assets/illustrations"
ANGLE = np.arange(160) * (2 * np.pi / 160)
JADE = (.13, .49, .43)
GOLD = (.82, .43, .14)
COPPER = (.73, .32, .23)
TRANSFORM = mi.ScalarTransform4f


def rgb(value):
    return {"type": "rgb", "value": value}


def metal(color):
    return {"type": "principled", "base_color": rgb(color), "metallic": .60, "roughness": .28}


def tilt(points, degrees):
    angle = np.deg2rad(degrees)
    c, s = np.cos(angle), np.sin(angle)
    return points @ np.array([[c, 0, -s], [0, 1, 0], [s, 0, c]])


def smoothing():
    # Each (theta, phi) fixes a base point of the Hopf map. The phase t
    # runs once along the fibre. The selected fibres avoid the projection pole.
    bands = [
        (1.57, np.linspace(0, 2 * np.pi, 24, endpoint=False), JADE, .027),
        (2.06, np.linspace(-1.22, 1.35, 11), GOLD, .026),
        (.91, np.linspace(1.14, 5.8, 15), COPPER, .028),
    ]
    groups = []
    for theta, angles, color, radius in bands:
        a, b = np.cos(theta / 2), np.sin(theta / 2)
        divisor = 1 - b * np.sin(ANGLE)
        fibres = []
        for phi in angles:
            xyz = np.column_stack((a * np.cos(ANGLE + phi), a * np.sin(ANGLE + phi),
                                   b * np.cos(ANGLE))) / divisor[:, None]
            fibres.append(tilt(xyz, 18))
        groups.append((fibres, color, radius, True))
    return groups, {}


def latitude(radius, height):
    return np.column_stack((radius * np.cos(ANGLE), radius * np.sin(ANGLE),
                            np.full_like(ANGLE, height)))


def resolution():
    # The exceptional projective line CP¹ is a two-sphere.
    r = 1.6
    parallels = [tilt(latitude(r * np.cos(t), r * np.sin(t)), -23)
                 for t in np.deg2rad([-72, -54, -36, -18, 18, 36, 54, 72])]
    meridians = []
    for phi in np.linspace(0, np.pi, 14, endpoint=False):
        circle = r * np.column_stack((np.cos(phi) * np.cos(ANGLE),
                                      np.sin(phi) * np.cos(ANGLE), np.sin(ANGLE)))
        meridians.append(tilt(circle, -23))
    equator = [tilt(latitude(r, 0), -23)]
    sphere = {"type": "sphere", "radius": r - .025, "bsdf": metal((.043, .18, .17))}
    return [(parallels, JADE, .014, True), (meridians, JADE, .012, True),
            (equator, GOLD, .025, True)], {"surface": sphere}


def node():
    # A real slice of sum z_j² = 0: z = (x, y, iz, 0), hence x²+y² = z².
    groups = []
    for sign, color in [(1, GOLD), (-1, JADE)]:
        levels = np.linspace(.13, 1.55, 12)
        rings = [tilt(latitude(r, sign * r), -13) for r in levels]
        rays = []
        for phi in np.linspace(0, 2 * np.pi, 32, endpoint=False):
            end = levels[-1] * np.array([np.cos(phi), np.sin(phi), sign])
            rays.append(tilt(np.linspace(np.zeros(3), end, 5), -13))
        groups.extend([(rings, color, .012, True), (rays, color, .012, False)])
    return groups, {}


def curve_file(path, curves, radius, closed):
    # Cubic B-splines need periodic end controls or extrapolated end tangents.
    with path.open("w", encoding="ascii") as stream:
        for points in curves:
            if closed:
                controls = np.vstack((points[-1], points, points[:2]))
            else:
                controls = np.vstack((2 * points[0] - points[1], points,
                                      2 * points[-1] - points[-2]))
            for x, y, z in controls:
                stream.write(f"{x:.7f} {y:.7f} {z:.7f} {radius}\n")
            stream.write("\n")


def softbox(position, width, height, power):
    orientation = TRANSFORM.look_at(origin=position, target=[0, 0, 0], up=[0, 0, 1])
    return {"type": "rectangle", "to_world": orientation @ TRANSFORM.scale([width, height, 1]),
            "emitter": {"type": "area", "radiance": rgb(power)}}


def camera(points):
    direction = np.array([5., -9., 6.])
    direction /= np.linalg.norm(direction)
    right = np.cross([0., 0., 1.], direction)
    right /= np.linalg.norm(right)
    up = np.cross(direction, right)
    center = (points.min(axis=0) + points.max(axis=0)) / 2
    u, v = (points - center) @ right, (points - center) @ up
    center += right * (u.max() + u.min()) / 2 + up * (v.max() + v.min()) / 2
    half_width = max(np.ptp(u), np.ptp(v)) * .55
    view = TRANSFORM.look_at(origin=center + 14 * direction, target=center, up=[0, 0, 1])
    return {"type": "orthographic", "to_world": view @ TRANSFORM.scale([half_width, half_width, 1]),
            "sampler": {"type": "independent", "sample_count": 96},
            "film": {"type": "hdrfilm", "width": 1200, "height": 1200,
                     "rfilter": {"type": "tent"}}}


def render(name, groups, surfaces):
    points = np.concatenate([curve for curves, _, _, _ in groups for curve in curves])
    floor = TRANSFORM.translate([0, 0, points[:, 2].min() - .08]) @ TRANSFORM.scale(200)
    scene = {"type": "scene", "integrator": {"type": "path", "max_depth": 6},
             "camera": camera(points), **surfaces,
             "floor": {"type": "rectangle", "to_world": floor,
                       "bsdf": {"type": "diffuse", "reflectance": rgb((.015, .031, .04))}},
             "world": {"type": "constant", "radiance": rgb((.48, .53, .55))},
             "key": softbox([-8, -5, 10], 5, 3, [7.4, 6.6, 5.6]),
             "rim": softbox([5, 7, 9], 4, 5, [7., 6., 4.8]),
             "fill": softbox([9, 2, 3], 1, 4, [3.7, 4.2, 4.6])}
    with TemporaryDirectory() as scratch:
        for i, (curves, color, radius, closed) in enumerate(groups):
            path = Path(scratch) / f"group-{i}.txt"
            curve_file(path, curves, radius, closed)
            scene[f"curves-{i}"] = {"type": "bsplinecurve", "filename": str(path), "bsdf": metal(color)}
        image = mi.render(mi.load_dict(scene), seed=11)
        pixels = mi.Bitmap(image).convert(mi.Bitmap.PixelFormat.RGB, mi.Struct.Type.UInt8, True)
        result = OUTPUT / f"conifold-cycle-{name}.webp"
        Image.fromarray(np.array(pixels)).save(result, quality=92, method=6)
        print(result.name, flush=True)


if __name__ == "__main__":
    for name, model in [("smoothing", smoothing), ("node", node), ("resolution", resolution)]:
        render(name, *model())
