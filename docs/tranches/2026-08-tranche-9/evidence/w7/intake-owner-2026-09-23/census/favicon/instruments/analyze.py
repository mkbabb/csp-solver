import numpy as np, glob, os, json, sys
from PIL import Image
INK=np.array([0x1a]*3,float); TILE=np.array([0xfa,0xf8,0xf5],float)
def lin(c):
    c=c/255.0; return np.where(c<=0.04045,c/12.92,((c+0.055)/1.055)**2.4)
def L(rgb): l=lin(rgb); return 0.2126*l[...,0]+0.7152*l[...,1]+0.0722*l[...,2]
def cr(a,b): hi=np.maximum(a,b); lo=np.minimum(a,b); return (hi+0.05)/(lo+0.05)
def load(f): return np.asarray(Image.open(f).convert('RGB'),float)
def crop(a,dpr,size): m=4*dpr; return a[m:m+size*dpr, m:m+size*dpr]
def coverage(img,ground):
    # per-channel sRGB-encoded coverage of ink over the painted ground
    den=ground-INK; den[np.abs(den)<1]=np.nan
    c=np.nanmean((ground-img)/den,axis=-1); return np.clip(np.nan_to_num(c),0,1)
def runs(c,thr=0.08):
    H,W=c.shape; hr=np.zeros_like(c); vr=np.zeros_like(c)
    for arr,out,T in ((c,hr,False),(c.T,vr,True)):
        o=out.T if T else out
        for y in range(arr.shape[0]):
            row=arr[y]; x=0
            while x<len(row):
                if row[x]>thr:
                    s=x
                    while x<len(row) and row[x]>thr: x+=1
                    o[y,s:x]=row[s:x].sum()
                else: x+=1
    return hr,vr
def stroke(c):
    hr,vr=runs(c); m=c>=0.5
    w=np.minimum(hr,vr)[m]
    if w.size==0: return dict(n=0)
    return dict(n=int(m.sum()),mean=float(w.mean()),median=float(np.median(w)),p90=float(np.percentile(w,90)))
def blurfit(filt,unf):
    from PIL import ImageFilter
    best=None; res=[]
    for s in [0,0.15,0.25,0.35,0.5,0.7,1.0,1.4]:
        u=Image.fromarray((unf*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(s)) if s>0 else Image.fromarray((unf*255).astype(np.uint8))
        u=np.asarray(u,float)/255; e=float(np.sqrt(((u-filt)**2).mean())); res.append((s,e))
    return min(res,key=lambda t:t[1]), res[0][1]
def grad(c): gy,gx=np.gradient(c); return float(np.hypot(gx,gy).sum())
if __name__=='__main__':
    D='shots'; out=[]
    for f in sorted(glob.glob(f'{D}/*_favicon_*_n1.png')):
        b=os.path.basename(f)[:-4].split('_'); en,dp,strip,_,size,_=b; dpr=int(dp[3:]); size=int(size)
        pre=f'{D}/{en}_{dp}_{strip}_'
        img=crop(load(f),dpr,size); img2=crop(load(pre+f'favicon_{size}_n2.png'),dpr,size)
        g=crop(load(pre+f'fav-noglyph_{size}_n1.png'),dpr,size); g2=crop(load(pre+f'fav-noglyph_{size}_n2.png'),dpr,size)
        unf=crop(load(pre+f'fav-nofilter_{size}_n1.png'),dpr,size)
        r52=crop(load(pre+f'ref-opsz52_{size}_n1.png'),dpr,size)
        det=float(np.abs(img-img2).max()); detg=float(np.abs(g-g2).max())
        c=coverage(img,g); cu=coverage(unf,g); c52=coverage(r52,g)
        N=size*dpr
        # glyph-keyed contrast: changed pixels between glyph and no-glyph photographs
        key=np.abs(img-g).max(-1)>8
        # two photographs: minimum over the pair per pixel (worse = lower contrast)
        k1=cr(L(img),L(g)); k2=cr(L(img2),L(g2)); kk=np.minimum(k1,k2)[key]
        core=np.abs(img-g).max(-1)>0.5*np.abs(INK-TILE).max()   # core: >=50% coverage
        kc=np.minimum(k1,k2)[core]
        # tile vs strip: painted strip (margin) vs painted tile ground (noglyph, center-ish ring away from glyph)
        full=load(pre+f'fav-noglyph_{size}_n1.png'); strip_px=full[1*dpr,1*dpr]
        tile_px=g[N//2, max(1,int(0.08*N))] # left inner edge of tile
        bf,e0=blurfit(c,cu)
        out.append(dict(engine=en,dpr=dpr,strip=strip,size=size,device_px=N,
            deterministic_max_delta=det, noglyph_det=detg,
            stroke_css_px={k:(v/dpr if isinstance(v,float) else v) for k,v in stroke(c).items()},
            stroke_css_px_nofilter={k:(v/dpr if isinstance(v,float) else v) for k,v in stroke(cu).items()},
            stroke_css_px_opsz52={k:(v/dpr if isinstance(v,float) else v) for k,v in stroke(c52).items()},
            coverage=float(c.sum()/(N*N)), coverage_nofilter=float(cu.sum()/(N*N)), coverage_opsz52=float(c52.sum()/(N*N)),
            filter_vs_nofilter=dict(mean_abs_cov=float(np.abs(c-cu).mean()), max_abs_cov=float(np.abs(c-cu).max()),
               changed_frac=float((np.abs(c-cu)>0.02).mean()), grad_ratio=grad(c)/max(grad(cu),1e-9),
               best_blur_sigma_dev_px=bf[0], rmse_at_best=bf[1], rmse_at_0=e0),
            glyph_key_n=int(key.sum()), contrast_all_median=float(np.median(kk)), contrast_core_median=float(np.median(kc)) if kc.size else None,
            core_n=int(core.sum()), frac_all_under_3=float((kk<3).mean()), frac_all_under_4_5=float((kk<4.5).mean()),
            frac_core_under_4_5=float((kc<4.5).mean()) if kc.size else None,
            strip_rgb=strip_px.tolist(), tile_rgb=tile_px.tolist(), tile_on_strip=float(cr(L(tile_px),L(strip_px)))))
    json.dump(out,open('census.json','w'),indent=1); print(len(out),'rows')
