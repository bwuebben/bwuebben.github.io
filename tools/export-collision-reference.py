#!/usr/bin/env python3
"""Regenerate the independent SymPy oracle for When Walls Collide.

Pass the released check_two_label_endpoint.py as the sole argument.
Requires SymPy; routine site checks use the committed JSON and Node only.
"""
import contextlib
import hashlib
import io
import json
from pathlib import Path
import runpy
import sys

SOURCE_HASH = "3e4d63b6e92fb16b984bbd1d6ead5fd77a0e8084e4257ec4d90c056f3a0d6223"
SOURCE_URL = "https://github.com/bwuebben/open-fjrw-scattering/blob/754425f/fjrw-annular-scattering/src/check_two_label_endpoint.py"


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Usage: export-collision-reference.py PATH/TO/check_two_label_endpoint.py")
    source = Path(sys.argv[1])
    digest = hashlib.sha256(source.read_bytes()).hexdigest()
    if digest != SOURCE_HASH:
        raise SystemExit("Source differs from the pinned release; review the source map before changing the fixture.")
    with contextlib.redirect_stdout(io.StringIO()):
        d = runpy.run_path(str(source))
    sp = d["sp"]
    t1, t2, x, y = [d[n] for n in ["t1", "t2", "x", "y"]]

    def encode(p):
        return {f"{i+2*j},{a},{b}": str(c)
                for (i, j, a, b), c in sp.Poly(p, t1, t2, x, y).terms() if c}

    cases = []
    for tick in [-6, -3, -1, 0, 1, 4]:
        c = sp.Rational(tick, 4)
        for name, p in [("x", x), ("y", y), ("xy", x*y),
                        ("higher", x**3*y**2*(1+t1+t2+t1*t2)), ("Wmin", d["Wmin"])]:
            upper = d["S2"](d["U"](c, d["S1"](p)))
            lower = d["S1"](d["S2"](p))
            cases.append(dict(tick=tick, name=name, input=encode(p),
                              upper=encode(upper), lower=encode(lower)))
    output = dict(source=SOURCE_URL, source_sha256=digest,
                  coefficient_ring="Q[x,y,t1,t2]/(t1^2,t2^2)", cases=cases)
    destination = Path(__file__).resolve().parents[1]/"when-walls-collide/reference.json"
    destination.write_text(json.dumps(output, indent=2)+"\n")
    print(f"Exported {len(cases)} source cases after {d['checks']} independent symbolic checks.")


if __name__ == "__main__":
    main()
