# TAB-PEN pass-7 critic's statistic (own code): coverage vs the arm's own paper-only twin, the keyed
# fringe's fraction under 4.5:1 against the twin, the core median, the two-photograph delta.
import sys, glob, os, numpy as np
from PIL import Image
D = sys.argv[1]
def lin(c): c = c/255.0; return np.where(c <= 0.04045, c/12.92, ((c+0.055)/1.055)**2.4)
def L(a): l = lin(a); return l[...,0]*0.2126 + l[...,1]*0.7152 + l[...,2]*0.0722
def cr(a, b): return (np.maximum(a,b)+0.05)/(np.minimum(a,b)+0.05)
ld = lambda f: np.asarray(Image.open(f).convert('RGB'), float)
INK = {'light': np.array([10,10,10.]), 'dark': np.array([237,236,233.])}
MAINK = np.array([26,26,26.])
print('engine scheme arm   photoΔ cov    fringe<4.5 (n/keyed)  core_med')
for en in ['chromium','webkit']:
  for sc in ['light','dark']:
    for arm in ['main','W','H','B']:
      a1, a2 = ld(f'{D}/{en}_{sc}_{arm}_n1.png'), ld(f'{D}/{en}_{sc}_{arm}_n2.png')
      g = ld(f'{D}/{en}_{sc}_{arm}-ng_n1.png')
      ink = MAINK if arm == 'main' else INK[sc]
      den = g - ink; den[np.abs(den) < 1] = np.nan
      cov = np.clip(np.nan_to_num(np.nanmean((g - a1)/den, axis=-1)), 0, 1).mean()
      key = np.abs(a1 - g).max(-1) > 8
      k = cr(L(a1), L(g)); kk = k[key]
      core = np.abs(a1 - g).max(-1) > 0.5*np.abs(ink - g).max(-1)
      print(f'{en:8s} {sc:5s} {arm:5s} {np.abs(a1-a2).max():4.0f}  {cov:.3f}  {(kk<4.5).mean():.3f} ({(kk<4.5).sum()}/{key.sum()})   {np.median(k[core]):.2f}')
