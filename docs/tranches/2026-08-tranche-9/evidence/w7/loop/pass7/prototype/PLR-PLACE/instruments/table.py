import json,collections,sys
N=sys.argv[1]
d=collections.defaultdict(dict); meta=set()
for l in open(N+'/census/census.txt'):
    p=l.rstrip('\n').split('|'); eng,arm,cell=p[1],p[2],p[3]; g=json.loads(p[-1]); d[(cell)][(arm,eng)]=g; meta.add((p[4],p[5]))
print('meta',meta)
def f(g):
    if not g: return '—'
    s=f"{g['H']} · {g['lap']} · {g['lapped']}c · {'chart' if g['chart'] else 'nochart'} · {g['rows']}r"+(f" +'{g['more']}'" if g['more'] else '')
    return s
for cell,v in d.items():
    print(cell)
    for arm in ('chart','list','yield'):
        c,w=v.get((arm,'chromium')),v.get((arm,'webkit'))
        same = c and w and {k:c[k] for k in ('lapped','chart','rows','H')}=={k:w[k] for k in ('lapped','chart','rows','H')}
        print(f"   {arm:6} cr {f(c)} | wk lap {w['lap'] if w else '-'} {w['lapped'] if w else ''}c {'(same shape)' if same else '(DIFF: '+f(w)+')'}")
    y=v.get(('yield','chromium')); l=v.get(('list','chromium')); ch=v.get(('chart','chromium'))
    if y and l and ch:
        print('     yield==list' if (y['lapped'],y['chart'],y['rows'])==(l['lapped'],l['chart'],l['rows']) else ('     yield==chart' if (y['lapped'],y['chart'],y['rows'])==(ch['lapped'],ch['chart'],ch['rows']) else '     yield OTHER'), '| yield lapped<=list', all(v[('yield',e)]['lapped']<=v[('list',e)]['lapped'] for e in ('chromium','webkit') if ('yield',e) in v and ('list',e) in v))
