"""P3 settled-board SSIM: same injected board, before vs after builds.

The steady-state boil cycles 4 pre-baked frames; each side's 10 shots (spaced
~110ms + capture overhead) cover the cycle. Cross-build max-SSIM over all pairs
compares like boil frames; the before/before cross-frame band is the noise floor
(what SSIM between *different* boil frames of the identical build looks like).
Structural SSIM on grayscale — the same metric class as the W8/W9 soul gates.
"""
import sys, itertools, json
import numpy as np
from PIL import Image
from skimage.metrics import structural_similarity as ssim

d = sys.argv[1]

def load(p):
    return np.asarray(Image.open(p).convert("L"), dtype=np.float64)

before = [load(f"{d}/settled-before-{i:02d}.png") for i in range(10)]
after = [load(f"{d}/settled-after-{i:02d}.png") for i in range(10)]

def s(a, b):
    return ssim(a, b, data_range=255.0)

cross = [(i, j, s(a, b)) for (i, a), (j, b) in itertools.product(enumerate(before), enumerate(after))]
self_bb = [(i, j, s(before[i], before[j])) for i, j in itertools.combinations(range(10), 2)]

cx = sorted((v for *_, v in cross), reverse=True)
sb = sorted((v for *_, v in self_bb), reverse=True)
best = max(cross, key=lambda t: t[2])

out = {
    "cross_max": round(cx[0], 5),
    "cross_top5": [round(v, 5) for v in cx[:5]],
    "cross_median": round(float(np.median(cx)), 5),
    "cross_min": round(cx[-1], 5),
    "best_pair": {"before": best[0], "after": best[1]},
    "selfBB_max": round(sb[0], 5),
    "selfBB_median": round(float(np.median(sb)), 5),
    "selfBB_min": round(sb[-1], 5),
    "shape": list(before[0].shape),
}
print(json.dumps(out, indent=2))
