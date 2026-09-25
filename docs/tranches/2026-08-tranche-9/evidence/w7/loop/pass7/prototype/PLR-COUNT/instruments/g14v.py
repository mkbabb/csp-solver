import sys,json
for l in open(sys.argv[1]):
  if not l.startswith("G14 "): continue
  d=json.loads(l[4:])
  out=[d["engine"],d["cell"],"ship:"+",".join(q[4:]+("=OK" if not d["breaches"][q] else "=RED "+";".join(d["breaches"][q])) for q in d["read"])]
  for n,pl in d["plants"].items():
    g=[q[4:] for q,v in pl.items() if not v["why"]]
    out.append(n+("" if not g else " GREEN:"+",".join(g)))
  print(" | ".join(out))
