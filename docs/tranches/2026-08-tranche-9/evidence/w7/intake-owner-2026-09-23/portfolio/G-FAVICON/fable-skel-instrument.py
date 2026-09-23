import numpy as np, sys
from PIL import Image
from scipy import ndimage
from skimage.morphology import skeletonize
S=sys.argv[1]
def load(f): return np.asarray(Image.open(f).convert('RGB'),float)
def coverage(img,ground,ink):
    den=ground-ink; den[np.abs(den)<1]=np.nan
    c=np.nanmean((ground-img)/den,axis=-1); return np.clip(np.nan_to_num(c),0,1)
def skel(c,d):
    m=c>=0.5; dt=ndimage.distance_transform_edt(m); sk=skeletonize(m); w=2*dt[sk]
    return round(float(np.median(w))/d,2), round(float(w.mean())/d,2), round(float(w.max())/d,2)
for tag,ink in (('cand',(10,10,10)),('ship',(26,26,26))):
    for size in (16,32,48,180):
        for dpr in (1,2):
            g=load(f'{S}/shots/{tag}_{size}_dpr{dpr}_glyph.png'); n=load(f'{S}/shots/{tag}_{size}_dpr{dpr}_noglyph.png')
            c=coverage(g,n,np.array(ink,float)); s=skel(c,dpr)
            ys,xs=np.nonzero(c>=0.5); H=(ys.max()-ys.min()+1)/dpr
            print(tag,size,dpr,'skel median/mean/max css',s,'inkH css',H,'stroke/H median',round(s[0]/H,3),'mean',round(s[1]/H,3))
