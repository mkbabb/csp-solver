# G-TOGGLE painted board contrast per screencast frame (chromium CDP, PNG, 1 px = 1 CSS px).
# For each frame in [-20, +1100] ms of the click: crop the board (inset 6%), paper = median
# RGB, ink = the pixels whose WCAG contrast vs that paper is in the top 1% (P99) and 0.2%
# (P99.8); report both per frame. A dip is the ink crossing its paper. Also recorder gaps.
# python3 paint.py runs/s-*.json -> one JSON line per (file, flip)
import json, sys
from PIL import Image
import numpy as np

# a digit-free window: empty cells (0,2)+(0,3) of the payload, straddling the box rule between
# them (subgrid stroke 8/1000 at 0.9) — from the π census's cell rects (identical both trees)
GRIDWIN = {"1280x800": (288, 139, 400, 180), "390x844": (102, 230, 167, 254)}

def inkc(crop):
    paper = np.median(crop, axis=0)
    Lp = lum(paper[None, :])[0]
    L = lum(crop)
    c = (np.maximum(L, Lp) + 0.05) / (np.minimum(L, Lp) + 0.05)
    return paper, c

def lin(c):
    c = c / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)

def lum(a):
    l = lin(a.astype(np.float64))
    return 0.2126 * l[..., 0] + 0.7152 * l[..., 1] + 0.0722 * l[..., 2]

for path in sys.argv[1:]:
    J = json.load(open(path))
    bx, by, bw, bh = J["boardBox"]
    for r in J["runs"]:
        act = r["clicks"][0] if r.get("clicks") else r["actAt"]
        rows = []
        for s in r.get("shots", []):
            t = s["t"] - act
            if t < -20 or t > 1100:
                continue
            im = np.asarray(Image.open(s["f"]).convert("RGB"))
            H, W = im.shape[:2]
            sx = W / (J["vp"] and int(J["vp"].split("x")[0]))
            x0, y0 = int((bx + bw * 0.06) * sx), int((by + bh * 0.06) * sx)
            x1, y1 = int((bx + bw * 0.94) * sx), int((by + bh * 0.94) * sx)
            crop = im[max(0, y0):min(H, y1), max(0, x0):min(W, x1)].reshape(-1, 3)
            paper, c = inkc(crop)
            gx0, gy0, gx1, gy1 = [int(v * sx) for v in GRIDWIN[J["vp"]]]
            _, cg = inkc(im[gy0:gy1, gx0:gx1].reshape(-1, 3))
            rows.append({"t": round(t), "p99": round(float(np.percentile(c, 99)), 2), "p998": round(float(np.percentile(c, 99.8)), 2), "grid": round(float(np.max(cg)), 2), "paper": [int(v) for v in paper]})
        if not rows:
            continue
        ts = [x["t"] for x in rows]
        gaps = sorted(b - a for a, b in zip(ts, ts[1:]))
        rest = rows[0]
        mn = min(rows, key=lambda x: x["p998"])
        under3 = [x["t"] for x in rows if x["p998"] < 3]
        gmn = min(rows, key=lambda x: x["grid"])
        gu3 = [x["t"] for x in rows if x["grid"] < 3]
        print(json.dumps({"file": path.split("/")[-1], "flip": r["label"], "dir": r["direction"], "painted": len(rows),
                          "gap": {"median": gaps[len(gaps) // 2] if gaps else None, "max": gaps[-1] if gaps else None, "over34": sum(g > 34 for g in gaps)},
                          "rest": {"p99": rest["p99"], "p998": rest["p998"]}, "min_p998": mn["p998"], "min_p99": min(x["p99"] for x in rows), "minAt": mn["t"],
                          "under3_p998": f"{len(under3)}f +{under3[0]}…+{under3[-1]}" if under3 else 0,
                          "grid": {"rest": rest["grid"], "min": gmn["grid"], "minAt": gmn["t"], "under3": f"{len(gu3)}f +{gu3[0]}…+{gu3[-1]}" if gu3 else 0},
                          "series": [(x["t"], x["p998"], x["grid"]) for x in rows if -20 <= x["t"] <= 400]}))
