# geo.py — the intake's pen-geometry instrument (intake-owner-2026-09-23/prototype/G-FAVICON/instruments/geo.py),
# COPIED and EXTENDED for pass 7 (TAB-PEN): absolute M/L/C (L as a degenerate cubic), so arm H's flat top and
# hard join read. cover() rasterises the pen as a 16x supersampled disc sweep; apertures() reads the painted
# centre column exactly as analyze.py does (runs of coverage < 0.5 between ink).
import re, sys, numpy as np
from scipy.spatial import cKDTree
def parse(d):
    tok = re.findall(r'[MLC]|-?\d*\.?\d+', d); segs = []; i = 0; p0 = None; cmd = None
    while i < len(tok):
        if tok[i] in 'MLC': cmd = tok[i]; i += 1
        n = lambda k: (float(tok[i + 2 * k]), float(tok[i + 2 * k + 1]))
        if cmd == 'M': p0 = n(0); i += 2
        elif cmd == 'L': p1 = n(0); segs.append(np.array([p0, p0, p1, p1])); p0 = p1; i += 2
        elif cmd == 'C': c = [p0, n(0), n(1), n(2)]; segs.append(np.array(c)); p0 = c[3]; i += 6
    return segs
def bez(c, u): u = u[:, None]; return (1-u)**3*c[0] + 3*(1-u)**2*u*c[1] + 3*(1-u)*u**2*c[2] + u**3*c[3]
def pts(segs, n=400): return np.vstack([bez(c, np.linspace(0, 1, n)) for c in segs])
def bbox(segs): P = pts(segs, 4000); return P[:, 0].min(), P[:, 1].min(), P[:, 0].max(), P[:, 1].max()
def cover(segs, sw, size, ss=16):
    P = pts(segs, 3000); tr = cKDTree(P); N = size * ss; s = 32 / N
    g = (np.arange(N) + 0.5) * s; X, Y = np.meshgrid(g, g); d, _ = tr.query(np.c_[X.ravel(), Y.ravel()])
    return (d <= sw / 2).reshape(N, N).astype(float).reshape(size, ss, size, ss).mean((1, 3))
def apertures(c):
    m = c >= 0.5; ys, xs = np.nonzero(m); cx = int((xs.min() + xs.max()) / 2); hw = max(0, int(0.03 * c.shape[1]))
    prof = c[:, cx - hw:cx + hw + 1].mean(1)[ys.min():ys.max() + 1]; runs, k = [], 0
    for v in prof:
        if v < 0.5: k += 1
        elif k: runs.append(k); k = 0
    return runs
def joins(segs):
    # tangent turn at every segment boundary, degrees (a hard join is a turn the pen doesn't round)
    out = []
    for a, b in zip(segs, segs[1:]):
        ta = a[3] - (a[2] if np.hypot(*(a[3] - a[2])) > 1e-9 else a[0]); tb = (b[1] if np.hypot(*(b[1] - b[0])) > 1e-9 else b[3]) - b[0]
        ang = np.degrees(np.arctan2(ta[0] * tb[1] - ta[1] * tb[0], ta @ tb)); out.append(round(float(abs(ang)), 1))
    return out
if __name__ == '__main__':
    d = sys.argv[1]; sw = float(sys.argv[2]) if len(sys.argv) > 2 else 4
    S = parse(d); x0, y0, x1, y1 = bbox(S); W = x1 - x0 + sw; H = y1 - y0 + sw
    print(f'centreline x {x0:.2f}-{x1:.2f} y {y0:.2f}-{y1:.2f} · outer {W:.2f}x{H:.2f} occ {W/32:.3f}x{H/32:.3f} · centre ({(x0+x1)/2:.2f},{(y0+y1)/2:.2f}) · stroke/H {sw/H:.3f}')
    print('joins (deg)', joins(S))
    for size in (16, 32): c = cover(S, sw, size); print(f'{size}px: ink {c.mean():.3f} apertures {apertures(c)}')
    c16 = cover(S, sw, 16)
    for r in range(16): print(''.join('#' if v >= 0.75 else ('+' if v >= 0.5 else ('.' if v > 0.1 else ' ')) for v in c16[r]))
