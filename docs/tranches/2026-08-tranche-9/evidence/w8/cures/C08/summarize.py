import sys,json,statistics as st
from collections import defaultdict
rows=[json.loads(l) for l in open(sys.argv[1]) if l.strip()]
sel=sys.argv[2] if len(sys.argv)>2 else 'steady'   # steady | first
def pick(r):
    return (r['cycle']>0) if sel=='steady' else (r['cycle']==0)
g=defaultdict(list)
for r in rows:
    if r.get('tainted'): continue
    if not pick(r): continue
    t=r.get('trace') or {}
    key=(r['engine'],r['cpu'],r['build'])
    g[key].append({
      'openWorst': r['open']['worst'], 'openLong33': r['open']['long33'],
      'closeWorst': r['close']['worst'], 'closeLong33': r['close']['long33'],
      'openOnsetEls': (t.get('openOnset') or {}).get('restyledElements'),
      'openOnsetMs': (t.get('openOnset') or {}).get('recalcStyle'),
      'settleFrameWinEls': (t.get('closeSettleFrame') or {}).get('restyledElements'),
      'settleFrameWinMs': (t.get('closeSettleFrame') or {}).get('recalcStyle'),
      'settleAfterEls': (t.get('closeSettleAfter') or {}).get('restyledElements'),
      'worstCloseRecalcMs': (t.get('worstRecalcFrame') or {}).get('recalcMs'),
      'worstCloseRecalcEls': (t.get('worstRecalcFrame') or {}).get('els'),
      'worstCloseRecalcD': (t.get('worstRecalcFrame') or {}).get('d'),
      'openWorstRecalcEls': (t.get('openWorstRecalcFrame') or {}).get('els'),
      'openWorstRecalcD': (t.get('openWorstRecalcFrame') or {}).get('d'),
    })
keys=sorted(g)
fields=list(g[keys[0]][0].keys())
print(f"{sel}: n windows per arm: " + ", ".join(f"{k}={len(g[k])}" for k in keys))
hdr=f"{'metric':22s}" + "".join(f"{'/'.join(k):>26s}" for k in keys)
print(hdr)
for f in fields:
    line=f"{f:22s}"
    for k in keys:
        v=[x[f] for x in g[k] if x[f] is not None]
        if not v: line+=f"{'--':>26s}"; continue
        line+=f"{st.median(v):>10.2f} [{min(v):.1f},{max(v):.1f}]".rjust(26)
    print(line)
