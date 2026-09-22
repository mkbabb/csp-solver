import json,os,sys
from collections import defaultdict
D='/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/MRK-ABS/logs'
d={e:json.load(open(f'{D}/board-search-{e}.json')) for e in ['chromium','webkit'] if os.path.exists(f'{D}/board-search-{e}.json')}
t=defaultdict(dict)
for e in d:
  print(e,'pinned',d[e]['pinnedAfterLoad'])
  for r in d[e]['rows']:
    t[(r['theme'],r['arm'])][(e,r['on'])]=(r['worst'],r['median'],r['painted'],r['ground'])
for k in sorted(t):
  v=t[k]
  def g(e,o):
    x=v.get((e,o)); return f"{x[0]}/{x[1]}" if x else '-'
  mins=[v[(e,o)][0] for e in d for o in ['FRAME','paper'] if (e,o) in v]
  print(k[0],k[1].ljust(14),'FRAME c',g('chromium','FRAME'),'w',g('webkit','FRAME'),'| paper c',g('chromium','paper'),'w',g('webkit','paper'),'| min-worst',min(mins))
for th in ['light','dark']:
  x=t[(th,'#3a7bc4')]; print(th,'grounds', {k:x[k][3] for k in x}, 'painted', {k:x[k][2] for k in x})
