import json,sys,re
for f in sys.argv[1:]:
    for line in open(f):
        for tag in ('ROW ','LAW39 '):
            i=line.find(tag)
            if i<0: continue
            try: r=json.loads(line[i+len(tag):])
            except Exception: continue
            v=r.get('vsOff') or {}
            vi=r.get('vsIn') or {}
            subj=r.get('on') or r.get('subject') or r.get('form')
            op=r.get('op',''); hx=r.get('hex','')
            print(f"{tag.strip():5} {r.get('tag','')[:14]:14} {r.get('prm','reduce')[:6]:6} {r['engine'][:6]:6} {r['theme']:5} {str(op):4} {hx:8} {str(subj)[:22]:22} run{r.get('run','')} n={r.get('n')} med={v.get('median')} worst={v.get('worst')} p30={v.get('p30')} frac={v.get('fracUnder3')} fracAll={r.get('fracAll')} vsIn med={vi.get('median')} worst={vi.get('worst')} ring={r.get('isTheRing')} d={r.get('d')} | {r.get('sens','')}")
