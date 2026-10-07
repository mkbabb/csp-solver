import json
S='/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself8'
CELLS=[[w,800,1,3] for w in [680,692,700,704,708,712,716,720,724,730,736,748,760,768,780,800,820,844,900]]+[[1024,768,1,3],[1180,820,1,3],[768,1024,1,3],[820,1180,1,3],[744,1133,1,3],[700,1024,1,3],[844,390,1,3],[812,375,1,3],[844,390,1,4],[812,375,1,4],[1280,800,0,3],[1280,720,0,3],[900,640,0,3],[800,700,0,3],[1024,768,0,3],[1280,800,0,4],[390,664,1,3],[390,800,1,3],[390,844,1,3],[390,664,1,4],[390,844,1,4],[430,932,1,4]]
def load(p): return [json.loads(l) for l in open(p)]
ch=load(S+'/logs/sweep-base-chromium.jsonl'); wk=load(S+'/logs/sweep-base-webkit.jsonl')
print('| cell | pointer | board | board left · top (ch) | added rows over the board (ch / wk) | pass 7 (names) | pass 8 (names) | one row (cells arm) | engines |')
print('|---|---|---|---|---|---|---|---|---|')
for c,a,b in zip(CELLS,ch,wk):
  def fr(d):
    if d.get('shortBoxArea') is None or d.get('tallArea') is None: return None
    return (d['tallArea']-d['shortArea'])/(d['tallBoxArea']-d['shortBoxArea'])
  fa,fb=fr(a),fr(b)
  p7=f"{a['rows']}/{a['lapped']}"
  if a['tallLap'] is None: p8=p7; one='—'
  else:
    short_clear = a['shortArea']==0
    p8 = f"1/{a['shortLap']}" if (short_clear or fa>0.7) else f"4/{a['tallLap']}"
    one=f"1/{a['shortLap']}"
  agree = 'same' if (a['rows'],a['lapped'])==(b['rows'],b['lapped']) and (fa is None or abs(fa-fb)<0.01) else f"wk {b['rows']}/{b['lapped']}"
  print(f"| {c[0]}×{c[1]} | {'coarse' if c[2] else 'fine'} | {'16×16' if c[3]==4 else '9×9'} | {a['boardL'] if a['boardL'] is not None else '—'} · {a['boardT'] if a['boardT'] is not None else '—'} | {'—' if fa is None else f'{fa:.3f} / {fb:.3f}'} | {p7} | {'**'+p8+'**' if p8!=p7 else p8} | {one} | {agree} |")
