import re,sys
for f in sys.argv[1:]:
    txt=open(f).read()
    print("==",f.split('/')[-1], "EXIT", re.findall(r'EXIT=(\d+)',txt), txt.splitlines()[0])
    clean=[];plants=[]
    for l in txt.splitlines():
        m=re.match(r'\[(\w+)/(\w+)/dpr(\d)\] B p-0*([0-9a-f]+) cell (\d+).*?(?:(PLANT|READING) (\w+) · )?pop (\d+) median ([\d.]+) <4.5 ([\d.]+) · core (\d+) median ([\d.]+).*?(?:core ×([\d.]+) )?→ (GREEN \(a hole\)|GREEN|RED)(.*)',l)
        if not m: continue
        eng,th,dpr,pid,cell,kind,name,pop,med,frac,cpx,core,x,verdict,why=m.groups()
        if ' in oklch' in l and not kind:
            clean.append(f"{th[:1]} {pid[-4:]} c{cell} core {core} pop {med} frac {frac} {verdict}")
        elif kind:
            plants.append(f"{th[:1]} c{cell} {kind[0]} {name:13s} pop {pop:>4} med {med:>6} frac {frac} core {core:>6} x{x} {verdict} {why[:70]}")
    print(" clean:", len(clean), "GREEN", sum('GREEN' in c for c in clean)); [print("  ",c) for c in clean]
    [print("  ",p) for p in plants]
