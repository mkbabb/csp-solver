#!/usr/bin/env python3
# r5iso.py <log>: per cell x line, the smallest (plant fraction under 4.5 - control fraction) among the G5one_/G2win_
# plants G5/G2 sees on a gated line: the slack below which G3 also sees every such plant and the clause loses its isolation
import json,sys
for line in open(sys.argv[1]):
    if not line.startswith("G14 "): continue
    d=json.loads(line[4:])
    for q,v in d["lines"].items():
        ctl=float(v["control"].split("<4.5 ")[1].split()[0])
        g5=[(p["under"]-ctl,n) for n,p in v["plants"].items() if n.startswith("G5one_") and "G5" in p["why"] and "G5" not in v["printed"]]
        g2=[(p["under"]-ctl,n) for n,p in v["plants"].items() if n.startswith("G2win_") and "G2" in p["why"] and "G2" not in v["printed"]]
        if g5 or g2: print(d["engine"][:2],d["cell"],q,("G5 min dfrac %.3f (n=%d)"%(min(g5)[0],len(g5))) if g5 else "",("| G2 min dfrac %.3f"%min(g2)[0]) if g2 else "")
