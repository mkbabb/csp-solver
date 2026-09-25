import sys,json
for line in open(sys.argv[1]):
  if not line.startswith("G14 "): continue
  d=json.loads(line[4:])
  print(d["engine"],d["cell"],"gated",d["floorGated"])
  for q,r in d["read"].items(): print("  ship",q,"pop",r["pop"],"med",r["median"],r["median2"],"under",r["under"],"core",r["core"],r["coreMedian"],"p95",r["p95"],"why",d["breaches"][q])
  for n,pl in d["plants"].items():
    parts=[]
    for q,v in pl.items():
      parts.append("%s pop%s med%s u%s core%s %s %s"%(q,v["pop"],v["median"],v["under"],v["core"],"RED" if v["why"] else "GREEN",";".join(w[:2] for w in v["why"])))
    print("   ",n," | ".join(parts))
