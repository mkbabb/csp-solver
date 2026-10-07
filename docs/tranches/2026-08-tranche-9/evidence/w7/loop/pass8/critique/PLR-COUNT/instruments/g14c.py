import sys,json
for l in open(sys.argv[1]):
    if l.startswith("G14 "):
        d=json.loads(l[4:])
        out=[]
        for q,v in d["lines"].items():
            unseen=[n for n,p in v["plants"].items() if not p["why"] and not (n=="X1b" and q==".pl-qual")]
            out.append(f"{q} gated={['|'.join(x[:60] for x in v['gated'])] if v['gated'] else 'GREEN'} med={v['clean'].split('median ')[1].split(' ')[0]} unseen={unseen}")
        print(d["engine"][:2],d["cell"]," ;; ".join(out))
