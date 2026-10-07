import sys,json
CELLS=json.load(open(sys.argv[2]))
rows=[json.loads(l) for l in open(sys.argv[1])]
for c,d in zip(CELLS,rows):
  if 'err' in d: print(c,'ERR',d['err'][:100]); continue
  ta,sa=d['tallArea'],d['shortArea']; add=(ta-sa) if ta is not None and sa is not None else None
  addbox=(d['tallBoxArea']-d['shortBoxArea']) if d.get('shortBoxArea') else None
  fr='-' if add is None or not addbox else f"{add/addbox:.3f}"
  print(f"{c[0]}x{c[1]:<5} {'crs' if c[2] else 'fin'} {16 if c[3]==4 else 9:>2} | {d['rows']}/{d['lapped']:<3} | bL {d['boardL']!s:6} bT {d['boardT']!s:7} | tall {d['tallLap']!s:>3} short {d['shortLap']!s:>3} | frac {fr}")
