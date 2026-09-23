import numpy as np, json
from PIL import Image
from scipy import ndimage
from skimage.morphology import skeletonize
def load(f): return np.asarray(Image.open(f).convert('RGB'),float)
def lin(c):
    c=c/255.0; return np.where(c<=0.04045,c/12.92,((c+0.055)/1.055)**2.4)
def L(rgb): l=lin(rgb); return 0.2126*l[...,0]+0.7152*l[...,1]+0.0722*l[...,2]
def cr(a,b): return (np.maximum(a,b)+0.05)/(np.minimum(a,b)+0.05)
FAV_S_H32=28.97  # favicon s ink height at 32 px (hi-res geometry)
rows=[]
for en in ['chromium','webkit']:
  for m in json.load(open(f'wm_{en}.json')):
    t=m['tag']; d=m['dpr']; ink=np.array([float(x) for x in m['color'][4:-1].split(',')])
    a=load(f'shots/wm_{t}_a.png'); b=load(f'shots/wm_{t}_b.png'); g=load(f'shots/wm_{t}_ground.png')
    u=m['rect']['h']/60*d   # device px per viewBox unit
    x0=int(round(3.0*u)); x1=int(round((4+m['sExt']['w'])*u))
    A=a[:,x0:x1]; G=g[:,x0:x1]; B=b[:,x0:x1]
    den=ink-G; c=np.clip(np.nanmean(np.where(np.abs(den)<1,np.nan,(A-G)/np.where(np.abs(den)<1,1,den)),-1),0,1)
    c=np.nan_to_num(c)
    mk=c>=0.5; dt=ndimage.distance_transform_edt(mk); sk=skeletonize(mk); w=2*dt[sk]
    ys,xs=np.nonzero(mk); h=(ys.max()-ys.min()+1)/d
    area=c.sum()/d/d; Ls=sk.sum()/d
    k=(np.abs(A-G).max(-1)>8); k1=cr(L(A),L(G)); k2=cr(L(B),L(G)); kk=np.minimum(k1,k2)[k]
    core=mk; kc=np.minimum(k1,k2)[core]
    f=FAV_S_H32/h
    rows.append(dict(tag=t,baked=m['baked'],s_ink_h_css=h,skel_med_css=float(np.median(w))/d,skel_mean_css=float(w.mean())/d,area_len_css=area/Ls,
      scaled_to_fav32=dict(factor=f,skel_med=float(np.median(w))/d*f,skel_mean=float(w.mean())/d*f,area_len=area/Ls*f),
      stroke_over_h=dict(med=float(np.median(w))/d/h,mean=float(w.mean())/d/h),
      contrast_core_median=float(np.median(kc)),frac_glyph_under_4_5=float((kk<4.5).mean()),n_key=int(k.sum()),ab_max_delta=float(np.abs(A-B).max())))
json.dump(rows,open('wordmark.json','w'),indent=1)
for r in rows:
  s=r['scaled_to_fav32']; print(f"{r['tag']:20s} baked={r['baked']} s_h={r['s_ink_h_css']:.2f} skel med/mean {r['skel_med_css']:.2f}/{r['skel_mean_css']:.2f} a/l {r['area_len_css']:.2f} | @fav32 x{s['factor']:.3f}: med {s['skel_med']:.2f} mean {s['skel_mean']:.2f} a/l {s['area_len']:.2f} | w/h med {r['stroke_over_h']['med']:.3f} mean {r['stroke_over_h']['mean']:.3f} | core CR {r['contrast_core_median']:.2f} f<4.5 {r['frac_glyph_under_4_5']:.3f} | a/b Δmax {r['ab_max_delta']}")
