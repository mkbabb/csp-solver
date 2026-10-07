import json, sys
R='/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself8r'
cells=json.load(open(R+'/cells.json'))
def load(e):
  d={}
  for l in open(f'{R}/readings/sweep-{e}.jsonl'):
    j=json.loads(l); d[(j['cell'],j.get('ptr','coarse' if True else ''),j['size'])]=j
  return d
ch,wk=load('chromium'),load('webkit')
def key(c): return (f'{c[0]}x{c[1]}','coarse' if c[2] else 'fine',c[3])
def fr(d):
  if not d or d.get('err') or d.get('shortBoxArea') is None or d.get('tallArea') is None: return None
  den=d['tallBoxArea']-d['shortBoxArea']
  return (d['tallArea']-d['shortArea'])/den if den else None
print('| cell | pointer | board | board left · top (ch) | added rows over the board (ch / wk) | pose ch (rows/lapped) | pose wk | four rows | one row | engines |')
print('|---|---|---|---|---|---|---|---|---|---|')
errs=0
for c in sorted(cells,key=lambda c:(c[2]==False,c[3],c[1],c[0])):
  k=key(c); a=ch.get(k); b=wk.get(k)
  if not a or not b or a.get('err') or b.get('err'):
    errs+=1; print(f"| {c[0]}×{c[1]} | {k[1]} | {'16×16' if c[3]==4 else '9×9'} | ERR ch={a and a.get('err')} wk={b and b.get('err')} |"); continue
  fa,fb=fr(a),fr(b)
  pa=f"{a['rows']}/{a['lapped']}"; pb=f"{b['rows']}/{b['lapped']}"
  four='—' if a['tallLap'] is None else f"4/{a['tallLap']}"
  one='—' if a['shortLap'] is None else f"1/{a['shortLap']}"
  same='same' if pa==pb and (fa is None or fb is None or abs(fa-fb)<0.01) else 'DIFF'
  bl='—' if a['boardL'] is None else f"{a['boardL']} · {a['boardT']}"
  print(f"| {c[0]}×{c[1]} | {k[1]} | {'16×16' if c[3]==4 else '9×9'} | {bl} | {'—' if fa is None else f'{fa:.3f} / {fb:.3f}'} | {pa} | {pb} | {four} | {one} | {same} |")
print(f'\ncells {len(cells)} errs {errs}', file=sys.stderr)
