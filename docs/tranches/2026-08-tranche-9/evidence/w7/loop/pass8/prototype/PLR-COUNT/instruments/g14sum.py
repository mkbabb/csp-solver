import sys,json
for l in open(sys.argv[1]):
    if not l.startswith("G14 "): continue
    d=json.loads(l[4:])
    for q,v in d["lines"].items():
        miss=[n for n,p in v["plants"].items() if not p["why"] and not (n=="X1b" and q==".pl-qual")]
        print(d["engine"],d["cell"],q,"bound",round(v["bound"] or 0,3),"clean-gated",v["gated"],"UNSEEN",miss)
        print("   ",v["clean"][:260])
