import re, sys, numpy as np
from scipy.spatial import cKDTree
def parse(d):
    t=[float(x) for x in re.findall(r'-?\d*\.?\d+',d)]
    p0=(t[0],t[1]); segs=[]; i=2
    while i+6<=len(t):
        c=[p0,(t[i],t[i+1]),(t[i+2],t[i+3]),(t[i+4],t[i+5])]; segs.append(np.array(c)); p0=c[3]; i+=6
    return segs
def bez(c,u):
    u=u[:,None]; return (1-u)**3*c[0]+3*(1-u)**2*u*c[1]+3*(1-u)*u**2*c[2]+u**3*c[3]
def pts(segs,n=400): return np.vstack([bez(c,np.linspace(0,1,n)) for c in segs])
def bbox(segs):
    P=pts(segs,4000); return P[:,0].min(),P[:,1].min(),P[:,0].max(),P[:,1].max()
def cover(segs,sw,size,ss=16):
    P=pts(segs,3000); tr=cKDTree(P); N=size*ss; s=32/N
    g=(np.arange(N)+0.5)*s; X,Y=np.meshgrid(g,g); d,_=tr.query(np.c_[X.ravel(),Y.ravel()])
    m=(d<=sw/2).reshape(N,N).astype(float); return m.reshape(size,ss,size,ss).mean((1,3))
if __name__=='__main__':
    d=sys.argv[1]; sw=float(sys.argv[2]) if len(sys.argv)>2 else 4
    S=parse(d); x0,y0,x1,y1=bbox(S)
    print(f'centreline bbox x {x0:.2f}-{x1:.2f} y {y0:.2f}-{y1:.2f}; outer x {x0-sw/2:.2f}-{x1+sw/2:.2f} y {y0-sw/2:.2f}-{y1+sw/2:.2f}')
    W=x1-x0+sw; H=y1-y0+sw
    print(f'outer {W:.2f}x{H:.2f} occ {W/32:.3f}x{H/32:.3f} centre ({(x0+x1)/2:.2f},{(y0+y1)/2:.2f}) stroke/H {sw/H:.3f} aspect {W/H:.2f}')
    c=cover(S,sw,64); print('ink frac (64 ss)',round(c.mean(),4))
    c16=cover(S,sw,16); m=c16>=0.5; ys,xs=np.nonzero(m); cx=int((xs.min()+xs.max())/2)
    col=c16[:,cx]; print('16px centre col',cx,' '.join(f'{v:.2f}' for v in col)); print('ink rows',ys.min(),ys.max(),'cols',xs.min(),xs.max())
    for r in range(16): print(''.join('#' if v>=0.75 else ('+' if v>=0.5 else ('.' if v>0.1 else ' ')) for v in c16[r]))
