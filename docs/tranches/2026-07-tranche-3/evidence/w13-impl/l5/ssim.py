# L5 soul gate — pose-matched SSIM: for each AFTER frame, max SSIM over all BEFORE
# frames of the same surface (both sides cycle the same 4-pose set, so the best
# pairing is the like-pose comparison). Grayscale structural SSIM (the T2 p3-ssim
# discipline: never report mean-channel deltas as SSIM).
import sys
from pathlib import Path
import numpy as np
from PIL import Image
from skimage.metrics import structural_similarity as ssim

before_dir, after_dir, prefix = sys.argv[1], sys.argv[2], sys.argv[3]

def load(p):
    return np.asarray(Image.open(p).convert("L"), dtype=np.float64)

befores = sorted(Path(before_dir).glob(f"{prefix}*.png"))
afters = sorted(Path(after_dir).glob(f"{prefix}*.png"))
if not befores or not afters:
    print(f"{prefix}: NO FRAMES (before={len(befores)} after={len(afters)})")
    sys.exit(1)

bimgs = [load(p) for p in befores]
results = []
for ap in afters:
    a = load(ap)
    best, best_ref = -1.0, None
    for bp, b in zip(befores, bimgs):
        if a.shape != b.shape:
            h, w = min(a.shape[0], b.shape[0]), min(a.shape[1], b.shape[1])
            aa, bb = a[:h, :w], b[:h, :w]
        else:
            aa, bb = a, b
        s = ssim(aa, bb, data_range=255.0)
        if s > best:
            best, best_ref = s, bp.name
    results.append((ap.name, best, best_ref))
    print(f"{ap.name}: SSIM={best:.4f} (vs {best_ref})")

vals = [r[1] for r in results]
print(f"{prefix}: min={min(vals):.4f} mean={sum(vals)/len(vals):.4f} n={len(vals)}")
