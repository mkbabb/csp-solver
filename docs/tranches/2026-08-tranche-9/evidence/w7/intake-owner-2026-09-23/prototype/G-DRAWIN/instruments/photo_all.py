"""Run photo_an.py over every shots JSON in photos/r1 and photos/r2; print the gate numbers,
plus arm B's mid-crossfade ink ratio (G-D6 arm B: ink never < 0.97× rest)."""
import glob, json, os, subprocess, sys
import numpy as np
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__))
for f in sorted(glob.glob(os.path.join(D, "photos", "r*", "*.json"))):
    r = subprocess.run([sys.executable, os.path.join(D, "photo_an.py"), f], capture_output=True, text=True)
    try:
        out = json.loads(r.stdout)
    except Exception:
        print(os.path.relpath(f, D), "ERR", r.stderr.strip().splitlines()[-1:] ); continue
    row = {}
    if "G-D5 frame" in out: v = out["G-D5 frame"]; row["D5 frame w/d/contrast"] = (v["width_ratio"], v["density_ratio"], v["core_contrast_vs_paper"])
    if "G-D5 cell" in out: row["D5 cell ratio/contrast"] = [(c["ratio"], c["core_contrast_vs_paper"]) for c in out["G-D5 cell"]]
    if "G-D6 handoff" in out: v = out["G-D6 handoff"]; row["D6 med/p95/p99/inkratio/px>16"] = (v["median_abs_delta_255"], v["p95"], v["p99"], v["ink_ratio_settled_over_drawing"], v["px_over_16"])
    if "G-D9 rubbing" in out: v = out["G-D9 rubbing"]; row["D9 span_em"] = v["front_span_em"]
    shots = {s["cond"]: s for s in json.load(open(f)) if not s.get("miss")}
    if "midfade" in shots and "settled" in shots:
        dpr = 2; a = shots["midfade"]; b = shots["settled"]; x, y, w, h = a["board"]
        box = [int(round(v * dpr)) for v in (x - 8, y - 8, x + w + 8, y + h + 8)]
        A = np.asarray(Image.open(a["file"]).convert("L")).astype(float)[box[1]:box[3], box[0]:box[2]]
        B = np.asarray(Image.open(b["file"]).convert("L")).astype(float)[box[1]:box[3], box[0]:box[2]]
        paper = np.median(B[:20]); ia = np.abs(paper - A); ib = np.abs(paper - B)
        row["B midfade ink/rest"] = round(float(ia.sum() / max(1.0, ib.sum())), 4)
        band = (ia > 8) | (ib > 8); d = np.abs(A - B)[band]
        row["B midfade vs rest med/p95"] = (round(float(np.median(d)), 2), round(float(np.percentile(d, 95)), 2))
    print(os.path.relpath(f, D), json.dumps(row))
