import json,sys
for l in open(sys.argv[1]):
  d=json.loads(l); g=d['geo']; cols=d['cols']; dpr=d['dpr']
  full=max(c['max'] for c in cols)
  # pass-7 slicing: 16 slices over the run (css px), p95 of pooled pixels is not recoverable here; print per-column p95 around x 33-36 css
  sel=[c for c in cols if 32*dpr<=c['x']<36*dpr]
  low=[(c['x']/dpr,c['n'],c['p95']) for c in cols if c['n']>=2 and c['p95']<3.0]
  print(d['eng'],d['scheme'],'dpr',dpr,'full-cover max',full,'| cols 32-36css',[(round(c['x']/dpr,1),c['n'],c['p95']) for c in sel],'| every column under 3.0:',low)
