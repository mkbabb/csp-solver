"""G-DRAWIN photo reads: G-D5 (the bead), G-D6 (handoff band Δ), G-D9 (rubbing front).
usage: python3 photo_an.py <shots.json> [<rest-logo-shots.json>]"""
import json, sys, math
import numpy as np
from PIL import Image

def load(path):
    return np.asarray(Image.open(path).convert("RGB")).astype(np.float64)

def luma(a):
    return 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]

def rel_lum(rgb):
    c = np.asarray(rgb, dtype=np.float64) / 255.0
    c = np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]

def contrast(a, b):
    la, lb = rel_lum(a), rel_lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

shots = json.load(open(sys.argv[1]))
dpr = 3 if "-m" in sys.argv[1].split("/")[-1] else 2
by = {s["cond"]: s for s in shots if not s.get("miss")}
out = {}

# ── G-D5: the bead at mid frame-side (top side runs left→right, second side runs down) ──
if "frame375" in by:
    s = by["frame375"]; img = load(s["file"]); L = luma(img)
    paper = np.median(L[5:40, 5:40])
    fr = next(l for l in s["lines"] if l["i"] == 0)
    fx, fy = fr["front"]; bx, by_ = fr["back"]
    # direction of travel in css px
    dx, dy = fx - bx, fy - by_; n = math.hypot(dx, dy) or 1; ux, uy = dx / n, dy / n
    px, py = -uy, ux  # perpendicular
    def cross_width(cx, cy):
        # darkness profile across the line at css point (cx, cy), in device px
        prof = []
        for k in np.arange(-14, 14.01, 0.5):
            X = int(round((cx + px * k) * dpr)); Y = int(round((cy + py * k) * dpr))
            prof.append(abs(paper - L[Y, X]))
        prof = np.array(prof); pk = prof.max()
        return float((prof > 0.5 * pk).sum() * 0.5), float(pk)
    tip_len = 2.5 * 12 * fr["unit"]  # css px
    tw = [cross_width(fx - ux * t, fy - uy * t) for t in (tip_len * 0.35, tip_len * 0.5, tip_len * 0.65)]
    bw = [cross_width(fx - ux * t, fy - uy * t) for t in (tip_len * 2.5, tip_len * 3.0, tip_len * 3.5)]
    tip_w = float(np.median([w for w, _ in tw])); body_w = float(np.median([w for w, _ in bw]))
    tip_pk = float(np.median([p for _, p in tw])); body_pk = float(np.median([p for _, p in bw]))
    # the darkest bead pixel vs paper, for the core contrast
    X = int(round((fx - ux * tip_len * 0.5) * dpr)); Y = int(round((fy - uy * tip_len * 0.5) * dpr))
    win = img[Y - 6:Y + 7, X - 6:X + 7].reshape(-1, 3); core = win[np.argmin(luma(win))]
    out["G-D5 frame"] = {"tip_width_css": tip_w, "body_width_css": body_w, "width_ratio": round(tip_w / body_w, 3) if body_w else None,
                         "tip_peak_dark": round(tip_pk, 1), "body_peak_dark": round(body_pk, 1), "density_ratio": round(tip_pk / body_pk, 3) if body_pk else None,
                         "core_rgb": core.tolist(), "paper_luma": round(float(paper), 1),
                         "core_contrast_vs_paper": round(contrast(core, img[20, 20]), 2), "front_css": [fx, fy], "frame_progress": fr["pr"]}

# ── G-D5 cell tier: the bead on a cell line mid-stroke (two fronts at a lift-and-land) ──
if "twofronts" in by:
    s = by["twofronts"]; img = load(s["file"]); L = luma(img); paper = np.median(L[5:40, 5:40])
    rows = []
    for ln in s["lines"]:
        if "cell-line" not in ln["cls"] or not (0.15 < ln["pr"] < 0.97): continue
        fx, fy = ln["front"]; bx, by_ = ln["back"]; dx, dy = fx - bx, fy - by_; n = math.hypot(dx, dy) or 1; ux, uy = dx / n, dy / n
        tip_len = 2.5 * 5 * ln["unit"]
        def dens(t):
            vals = []
            for k in np.arange(-1.0, 1.01, 0.5):
                X = int(round((fx - ux * t - uy * k) * dpr)); Y = int(round((fy - uy * t + ux * k) * dpr))
                vals.append(abs(paper - L[Y, X]))
            return float(np.max(vals))
        tip = np.median([dens(tip_len * f) for f in (0.35, 0.5, 0.65)]); body = np.median([dens(tip_len * f) for f in (2.5, 3.0, 3.5)])
        X = int(round((fx - ux * tip_len * 0.5) * dpr)); Y = int(round((fy - uy * tip_len * 0.5) * dpr))
        win = img[Y - 4:Y + 5, X - 4:X + 5].reshape(-1, 3); core = win[np.argmax(np.abs(luma(win) - paper))]
        rows.append({"line": ln["i"], "pr": ln["pr"], "tip_ink": round(float(tip), 1), "body_ink": round(float(body), 1), "ratio": round(float(tip / body), 3) if body else None, "core_contrast_vs_paper": round(contrast(core, img[20, 20]), 2)})
    out["G-D5 cell"] = rows

# ── G-D6: last drawing frame vs first settled frame, over the board ──
if "predrawn" in by and "settled" in by:
    a = by["predrawn"]; b = by["settled"]; A = luma(load(a["file"])); B = luma(load(b["file"]))
    x, y, w, h = a["board"]; X0, Y0, X1, Y1 = [int(round(v * dpr)) for v in (x - 8, y - 8, x + w + 8, y + h + 8)]
    A = A[Y0:Y1, X0:X1]; B = B[Y0:Y1, X0:X1]
    paper = np.median(np.concatenate([A[:20].ravel(), B[:20].ravel()]))
    inkA = np.abs(paper - A); inkB = np.abs(paper - B)
    band = (inkA > 8) | (inkB > 8)  # the ink band: pixels either photograph inked
    d = np.abs(A - B)[band]
    out["G-D6 handoff"] = {"band_px": int(band.sum()), "median_abs_delta_255": round(float(np.median(d)), 3), "p95": round(float(np.percentile(d, 95)), 2), "p99": round(float(np.percentile(d, 99)), 2), "max": round(float(d.max()), 1),
                           "ink_ratio_settled_over_drawing": round(float(inkB.sum() / max(1.0, inkA.sum())), 4), "px_over_16": int((d > 16).sum()), "hit_t": [a["hit"]["t"], b["hit"]["t"]]}
    diff = np.clip(np.abs(A - B) * 8, 0, 255).astype(np.uint8)
    Image.fromarray(255 - diff).save(a["file"].replace("-predrawn.png", "-handoff-diff-x8.png"))

# ── G-D9: the rubbing front, from the mid-rub photograph vs the word at rest ──
if "rub50" in by and "rest" in by:
    a = by["rub50"]; b = by["rest"]; A = luma(load(a["file"])); B = luma(load(b["file"]))
    x, y, w, h = b["logo"]; X0, Y0, X1, Y1 = [int(round(v * dpr)) for v in (x, y, x + w, y + h)]
    A = A[Y0:Y1, X0:X1]; B = B[Y0:Y1, X0:X1]
    paper = float(np.median(B[:, -4:]))
    inkA = np.abs(paper - A); inkB = np.abs(paper - B)
    colA = inkA.sum(0); colB = inkB.sum(0); inked = colB > colB.max() * 0.05
    R = np.where(inked, colA / np.maximum(colB, 1e-6), np.nan)
    xs = np.arange(len(R))
    part = inked & (R > 0.05) & (R < 0.95)
    vbw = float(a["vb"].split(" ")[2]); unit_px = (w * dpr) / vbw; em_px = 52 * unit_px
    span_px = float(xs[part].max() - xs[part].min()) if part.any() else 0.0
    # slant: per row, the column where revealed ink falls through half (rows with ink both sides)
    rows = []
    for r_ in range(0, A.shape[0], 2):
        ra = inkA[r_]; rb = inkB[r_]
        if rb.sum() < 50: continue
        cum_a = np.cumsum(ra); cum_b = np.cumsum(rb)
        ratio = np.where(cum_b > 0, cum_a / np.maximum(cum_b, 1e-6), 1)
        idx = np.where((ratio < 0.5) & (cum_b > rb.sum() * 0.05))[0]
        if len(idx): rows.append((r_, idx[0]))
    slant = None
    if len(rows) > 6:
        rr = np.array(rows, dtype=float); k, _ = np.polyfit(rr[:, 0], rr[:, 1], 1)
        slant = round(90 + math.degrees(math.atan(-k)), 1)  # 90 = vertical front; >90 leans like "/"
    hard_cols = int(((R[inked] > 0.05) & (R[inked] < 0.95)).sum())
    out["G-D9 rubbing"] = {"front_span_px": span_px, "front_span_em": round(span_px / em_px, 3) if em_px else None, "em_px": round(em_px, 1),
                           "partial_columns": hard_cols, "slant_deg_est": slant, "rx": a["rx"], "hit_t": a["hit"]["t"]}

print(json.dumps(out, indent=1))
