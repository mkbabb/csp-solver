import json,sys
rows=[]
for f in sys.argv[1:]: rows+=json.load(open(f))
from collections import defaultdict
g=defaultdict(list)
for r in rows:
    if r["on"]!="frame": continue
    g[(r["engine"],r["arm"],r["theme"])].append((r["L"]["sides"]["left"]["worst"],r["L"]["whole"]["under"]))
for k,v in sorted(g.items()):
    lw=[x[0] for x in v]; wu=[x[1] for x in v]
    print(k, "left worst", lw, "spread", round(max(lw)-min(lw),3), "| whole under/240", wu)
