import json,sys
D='/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/MRK-ABS/logs'
tag=sys.argv[1]
for e in ['chromium','webkit']:
  try: d=json.load(open(f'{D}/census-{tag}-{e}.json'))
  except Exception as x: print(e,'missing',x); continue
  for th in ['light','dark']:
    rows=[]
    for scope in ['home','deck','guard']:
      v=d[th][scope]
      if isinstance(v,dict): rows.append((scope,'ERROR',v.get('error','')[:80])); continue
      for r in v:
        k=r['key'].split('[')[0].split('.')[-1] + ('[tok]' if 'PROPOSED' in r['key'] else '')
        u3=sum((s.get('under3') or 0) for s in r.get('sides',{}).values()); n=sum((s.get('changed') or 0) for s in r.get('sides',{}).values())
        wg=None
        if r.get('worstSide'): wg=r['sides'][r['worstSide']].get('worstGround')
        rows.append((scope,k,r.get('outline','')[-22:],r.get('worst'),r.get('worstSide'),f'{u3}/{n}',wg))
    print(e,th)
    for x in rows: print('   ',x)
