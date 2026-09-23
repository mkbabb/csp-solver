import numpy as np, json
from analyze import load, crop, coverage
from scipy import ndimage
from skimage.morphology import skeletonize
from scipy.signal import find_peaks
def skel(c,d):
    m=c>=0.5; dt=ndimage.distance_transform_edt(m); sk=skeletonize(m); w=2*dt[sk]
    return float(np.median(w))/d, float(w.mean())/d, float(w.max())/d
def counters(c):
    m=c>=0.5; ys,xs=np.nonzero(m); cx=(xs.min()+xs.max())/2; hw=max(0,int(0.03*c.shape[1]))
    col=c[:,int(cx)-hw:int(cx)+hw+1].mean(1)
    y0,y1=ys.min(),ys.max()+1; prof=col[y0:y1]
    v,_=find_peaks(-prof,prominence=0.1)
    return [round(float(prof[i]),3) for i in v], int((prof<0.5).sum())
out=[]
for en in ['chromium','webkit']:
  for d in [1,2]:
    for size in [16,32,48,180]:
      pre=f'shots/{en}_dpr{d}_light-active_'
      g=crop(load(pre+f'fav-noglyph_{size}_n1.png'),d,size)
      row=dict(engine=en,dpr=d,size=size)
      for arm,f in [('shipped','favicon'),('nofilter','fav-nofilter'),('opsz52','ref-opsz52')]:
        c=coverage(crop(load(pre+f'{f}_{size}_n1.png'),d,size),g)
        row[arm]=dict(skel=skel(c,d),counters=counters(c))
      out.append(row)
json.dump(out,open('persize.json','w'),indent=1)
for r in out:
  s=r['shipped'];u=r['nofilter'];q=r['opsz52']
  print(f"{r['engine'][:2]} dpr{r['dpr']} {r['size']:3d} | shipped skel med/mean/max {s['skel'][0]:.2f}/{s['skel'][1]:.2f}/{s['skel'][2]:.2f} counters {s['counters']} | nofilter {u['skel'][0]:.2f}/{u['skel'][1]:.2f}/{u['skel'][2]:.2f} {u['counters']} | opsz52 {q['skel'][0]:.2f}/{q['skel'][1]:.2f} {q['counters']}")
