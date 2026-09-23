import json,sys,re,collections
for f in sys.argv[1:]:
    d=json.load(open(f)); print("==", f.split('/')[-1], d.get('payload'))
    for k,v in d.items():
        if k=='payload': continue
        n=v['noise']; p=v['proto']
        print(f" {k:32s} regime c={v['regime']['control']} p={v['regime']['proto']} givens={v['givensN']} noise shut/open={len(n['shut'])}/{len(n['open'])} proto shut/open={len(p['shut'])}/{len(p['open'])}")
        # classify proto deltas by element#key
        keys=collections.Counter(re.sub(r':.*','',r) for r in p['shut']+p['open'])
        for kk,c in sorted(keys.items()): print("     ", c, kk)
