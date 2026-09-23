# G-TAB-2, the painted instrument: the census's an2.py/analyze.py statistics per arm, per engine, DPR,
# scheme strip and size, two bare photographs per cell (Delta stated, the minimum taken).
# usage (cwd = the shots' parent): python3 analyze.py <shots dir> <geo.py dir> <out.json> <out.tsv>
import sys, json, glob, os, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
from skimage.morphology import skeletonize
SH, GEO, OUTJ, OUTT = sys.argv[1:5]
sys.path.insert(0, GEO); import geo
HEX = lambda h: np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], float)
LIGHT = dict(ink=HEX('#0a0a0a'), paper=HEX('#fbfaf9')); DARK = dict(ink=HEX('#edece9'), paper=HEX('#110f0e'))
MAIN = dict(ink=HEX('#1a1a1a'), paper=HEX('#faf8f5'))
PATHS = {  # pen-line arms: the geometry raster for blurfit
    'W': ("M22.6,9.6C21.4,7.1 18.6,6 15.8,6C12,6 9.6,7.9 9.6,10.6C9.6,13.4 12.4,14.6 16.2,15.8C21,17.3 24,18.4 24,21.2C24,24.4 20.4,26 15.8,26C11.6,26 8,24.6 8,22.6", 4),
    'fable': ("M22,8.6 C21,4.6 12,4.2 11,9.4 C10.2,14.4 21.6,15.6 22,21 C22.4,27 12.4,28.6 10,24.6", 4),
    'opus': ("M24.4,10.2 C24.2,7.6 21.4,6 17.8,6 C13,6 10,7.8 10,10.5 C10,13.3 13.2,14.1 16.8,14.8 C22,15.8 26,17.1 26,19.9 C26,22.8 21.6,24 16.6,24 C11.8,24 8.4,22.6 7.1,20.2 C6.8,19.8 6.9,19.3 7.5,18.9", 4)}
PATHS['B'] = (PATHS['W'][0], 5)
def lin(c): c = c / 255.0; return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
def L(rgb): l = lin(rgb); return 0.2126 * l[..., 0] + 0.7152 * l[..., 1] + 0.0722 * l[..., 2]
def cr(a, b): hi = np.maximum(a, b); lo = np.minimum(a, b); return (hi + 0.05) / (lo + 0.05)
def load(f): return np.asarray(Image.open(f).convert('RGB'), float)
def crop(a, d, s): m = 4 * d; return a[m:m + s * d, m:m + s * d]
def coverage(img, g, ink):
    den = g - ink; den[np.abs(den) < 1] = np.nan
    return np.clip(np.nan_to_num(np.nanmean((g - img) / den, axis=-1)), 0, 1)
def skel(c):
    m = c >= 0.5; dt = ndimage.distance_transform_edt(m); w = 2 * dt[skeletonize(m)]
    ys, _ = np.nonzero(m); H = ys.max() - ys.min() + 1
    return float(np.median(w)), float(w.max()), H
def apertures(c):
    m = c >= 0.5; ys, xs = np.nonzero(m); cx = int((xs.min() + xs.max()) / 2); hw = max(0, int(0.03 * c.shape[1]))
    prof = c[:, cx - hw:cx + hw + 1].mean(1)[ys.min():ys.max() + 1]
    runs, k = [], 0
    for v in prof:
        if v < 0.5: k += 1
        elif k: runs.append(k); k = 0
    return runs
def blurfit(c, ref):
    res = []
    for s in [0, 0.15, 0.25, 0.35, 0.5, 0.7, 1.0, 1.4]:
        u = Image.fromarray((ref * 255).astype(np.uint8))
        u = np.asarray(u.filter(ImageFilter.GaussianBlur(s)) if s else u, float) / 255
        res.append((s, float(np.sqrt(((u - c) ** 2).mean()))))
    return min(res, key=lambda t: t[1])[0]
out = []
for f in sorted(glob.glob(f'{SH}/*_n1.png')):
    en, dp, strip, arm, size, _ = os.path.basename(f)[:-4].split('_')
    if arm.endswith('-ng') or arm.endswith('-nf'): continue
    d = int(dp[3:]); size = int(size); N = size * d; pre = f'{SH}/{en}_{dp}_{strip}_'
    img, img2 = (crop(load(pre + f'{arm}_{size}_n{k}.png'), d, size) for k in (1, 2))
    g, g2 = (crop(load(pre + f'{arm}-ng_{size}_n{k}.png'), d, size) for k in (1, 2))
    tile = g[N // 2, max(1, int(0.08 * N))]
    pal = MAIN if arm == 'main' else (DARK if L(tile) < 0.5 else LIGHT)
    c1, c2 = coverage(img, g, pal['ink']), coverage(img2, g2, pal['ink'])
    c = np.minimum(c1, c2)  # the minimum of the two photographs
    delta = float(np.abs(img - img2).max())
    med, mx, H = skel(c)
    key = np.abs(img - g).max(-1) > 8
    k = np.minimum(cr(L(img), L(g)), cr(L(img2), L(g2)))
    kk = k[key]; core = np.abs(img - g).max(-1) > 0.5 * np.abs(pal['ink'] - pal['paper']).max(); kc = k[core]
    strip_px = load(pre + f'{arm}-ng_{size}_n1.png')[d, d]
    lab, ncomp = ndimage.label(c < 0.5)
    row = dict(engine=en, dpr=d, strip=strip, arm=arm, size=size, device_px=N, photo_delta=delta,
               cov=float(c.mean()), skel_med_dev=med, skel_max_dev=mx, max_over_med=mx / med if med else None,
               ink_h_dev=int(H), stroke_over_h=med / H, apertures=apertures(c) if size == 16 else None,
               paper_regions=int(ncomp), tile_rgb=[int(v) for v in tile], strip_rgb=[int(v) for v in strip_px],
               tile_on_strip=float(cr(L(tile), L(strip_px))), core_median=float(np.median(kc)) if kc.size else None,
               keyed_n=int(key.sum()), sub45_n=int((kk < 4.5).sum()), frac_under45=float((kk < 4.5).mean()),
               frac_under3=float((kk < 3).mean()))
    if arm in PATHS and size in (16, 32):
        ref = geo.cover(geo.parse(PATHS[arm][0]), PATHS[arm][1], N, 8); row['blur_sigma'] = blurfit(c, ref)
    elif arm == 'main' and size in (16, 32):
        nf = coverage(crop(load(pre + f'main-nf_{size}_n1.png'), d, size), g, pal['ink']); row['blur_sigma'] = blurfit(c, nf)
    out.append(row)
json.dump(out, open(OUTJ, 'w'), indent=0)
cols = ['engine', 'dpr', 'strip', 'arm', 'size', 'photo_delta', 'cov', 'skel_med_dev', 'max_over_med', 'stroke_over_h', 'apertures',
        'paper_regions', 'tile_rgb', 'tile_on_strip', 'core_median', 'sub45_n', 'frac_under45', 'frac_under3', 'blur_sigma']
with open(OUTT, 'w') as t:
    t.write('\t'.join(cols) + '\n')
    for r in out:
        t.write('\t'.join((f'{r[k]:.3f}' if isinstance(r.get(k), float) else str(r.get(k, ''))) for k in cols) + '\n')
print(len(out), 'rows')
