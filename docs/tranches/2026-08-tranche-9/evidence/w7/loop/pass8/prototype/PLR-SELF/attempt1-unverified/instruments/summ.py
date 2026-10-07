import sys,json
CELLS=[[w,800,1,3] for w in [680,692,700,704,708,712,716,720,724,730,736,748,760,768,780,800,820,844,900]]+[[1024,768,1,3],[1180,820,1,3],[768,1024,1,3],[820,1180,1,3],[744,1133,1,3],[700,1024,1,3],[844,390,1,3],[812,375,1,3],[844,390,1,4],[812,375,1,4],[1280,800,0,3],[1280,720,0,3],[900,640,0,3],[800,700,0,3],[1024,768,0,3],[1280,800,0,4],[390,664,1,3],[390,800,1,3],[390,844,1,3],[390,664,1,4],[390,844,1,4],[430,932,1,4]]
rows=[json.loads(l) for l in open(sys.argv[1])]
print("cell            ptr  N  | pose r/lap | bL    rS  bT    | tallLap shortLap | tallA/cell2 shortA/cell2 addA/cell2 | addFrac | cellpx")
for c,d in zip(CELLS,rows):
  if 'err' in d: print(c,'ERR',d['err'][:80]); continue
  cp=d['cell']; c2=cp*cp
  ta,sa=d['tallArea'],d['shortArea']
  add = (ta-sa) if (ta is not None and sa is not None) else None
  addbox = (d['tallBoxArea']-d['shortBoxArea']) if d.get('shortBoxArea') else None
  f=lambda x: '-' if x is None else f"{x/c2:6.2f}"
  print(f"{c[0]}x{c[1]:<5} {'crs' if c[2] else 'fin'} {16 if c[3]==4 else 9:>2} | {d['rows']}/{d['lapped']:<3}     | {d['boardL']!s:5} {d['rowsStart']!s:3} {d['boardT']!s:6} | {d['tallLap']!s:>4} {d['shortLap']!s:>5}    | {f(ta)} {f(sa)} {f(add)} | {'-' if add is None or not addbox else f'{add/addbox:.3f}'} | {cp}")
