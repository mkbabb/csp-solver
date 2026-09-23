import re,sys
def parse(f):
    d={}
    for l in open(f):
        m=re.search(r'\[(\w+)/(light|dark)\] B (p-\w+) cell (\d+).*?worst ([\d.]+) \((\d+)/(\d+) px.*?core median ([\d.]+) \((\d+)/(\d+) core',l)
        if m:
            e,t,b,c,w,u,n,med,cu,cn=m.groups(); d[(e,t,b,int(c))]=(float(w),int(u),float(med),int(cu)/max(1,int(cn)))
    return d
S=sys.argv[1]
for eng,tree,ctl in [('chromium','neg-d1-chromium-dpr1','ctl-d1-chromium-dpr1'),('webkit','neg-d1-webkit-dpr1','ctl-d1-webkit-dpr1')]:
    T=parse(f'{S}/logs/{tree}.log'); C=parse(f'{S}/logs/{ctl}.log')
    print(f'== {eng} dpr1: theme slug cell | tree median frac<4.5 | control median frac<4.5 | tree-minus-control median')
    for k in sorted(T):
        if k in C:
            t=T[k]; c=C[k]; print(f'{k[1]:5} {k[2][-4:]} c{k[3]:<2} | {t[2]:.3f} {t[3]:.3f} | {c[2]:.3f} {c[3]:.3f} | {t[2]-c[2]:+.3f}{"  LOSES" if t[2]<c[2] else ""}{"  <4.5" if t[2]<4.5 else ""}')
print()
for eng in ['chromium','webkit']:
    T=parse(f'{S}/logs/neg-cr1-chromium-dpr3.log' if eng=='chromium' else f'{S}/logs/neg-wk1-webkit-dpr3.log'); C=parse(f'{S}/logs/ctl-d3-{eng}-dpr3.log'); A=parse(f'{S}/logs/pa-{eng}-dpr3.log')
    print(f'== {eng} dpr3: theme slug cell | tree(b) median frac | arm(a) translucent median frac [min] | control median frac [min]')
    for k in sorted(T):
        t=T[k]; c=C.get(k); a=A.get(k)
        f=lambda v: f'{v[2]:.3f} {v[3]:.3f} [{v[0]:.3f}]' if v else '—'
        print(f'{k[1]:5} {k[2][-4:]} c{k[3]:<2} | {t[2]:.3f} {t[3]:.3f} [{t[0]:.3f}] | {f(a)} | {f(c)}{"  b LOSES to ctl" if c and t[2]<c[2] else ""}')
