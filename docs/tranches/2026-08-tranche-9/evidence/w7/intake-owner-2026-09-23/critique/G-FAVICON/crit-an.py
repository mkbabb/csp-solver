import glob, os, numpy as np
from PIL import Image
S=os.path.dirname(os.path.abspath(__file__))+'/shots'
def lin(c): c=c/255.0; return np.where(c<=0.04045,c/12.92,((c+0.055)/1.055)**2.4)
def L(a): l=lin(a); return 0.2126*l[...,0]+0.7152*l[...,1]+0.0722*l[...,2]
def cr(a,b): return (np.maximum(a,b)+0.05)/(np.minimum(a,b)+0.05)
H=lambda h: np.array([int(h[i:i+2],16) for i in (1,3,5)],float)
STR={'light-active':'#ffffff','light-strip':'#dee1e6','dark-active':'#35363a','dark-strip':'#202124'}
print('engine dpr strip arm size | delta tile tile/strip | cov | apert(16dpr1) | core | frac<4.5 n<4.5 | frac<3')
for f in sorted(glob.glob(S+'/*_n1.png')):
    en,dp,sk,arm,size,_=os.path.basename(f)[:-4].split('_')
    a=np.asarray(Image.open(f).convert('RGB'),float); a2=np.asarray(Image.open(f.replace('_n1','_n2')).convert('RGB'),float)
    delta=np.abs(a-a2).max(); N=a.shape[0]
    # tile paper: the pixel at (mid-row, 8% col) as the census reads it
    tile=a[N//2, max(1,int(0.08*N))]
    strip=H(STR[sk])
    dark=L(tile)<0.5
    if arm=='W': ink=H('#edece9') if dark else H('#0a0a0a')
    else: ink=H('#1a1a1a')
    den=tile-ink; den[np.abs(den)<1]=np.nan
    cov=np.clip(np.nan_to_num(np.nanmean((tile-np.minimum(a,a2) if not dark else np.maximum(a,a2)-tile)/np.abs(den),axis=-1)),0,1)
    # restrict to tile region (exclude strip-coloured corners for main)
    notstrip=np.abs(a-strip).max(-1)>3
    c=np.where(notstrip,cov,0)
    ap=''
    if size=='16' and dp=='dpr1':
        m=c>=0.5; ys,xs=np.nonzero(m); cx=int((xs.min()+xs.max())/2); prof=c[ys.min():ys.max()+1,cx]
        runs=[];k=0
        for v in prof:
            if v<0.5:k+=1
            elif k: runs.append(k);k=0
        ap=str(runs)
    key=(np.abs(a-tile).max(-1)>8)&notstrip
    k=cr(L(a),L(tile)); kk=k[key]
    core=(np.abs(a-tile).max(-1)>0.5*np.abs(ink-tile).max())&notstrip
    print(f"{en:8s} {dp} {sk:12s} {arm:4s} {size:>3s} | {delta:3.0f} {tuple(int(v) for v in tile)} {float(cr(L(tile),L(strip))):.2f} | {c[notstrip].mean():.3f} | {ap:8s} | {np.median(k[core]):5.2f} | {(kk<4.5).mean():.3f} {(kk<4.5).sum():3d} | {(kk<3).mean():.3f}")
