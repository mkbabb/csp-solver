import json,sys
d=sys.argv[1]; eng=sys.argv[2]
F=json.load(open(f'{d}/filters-{eng}.json'))
for k,row in F.items():
    s=[]
    for arm,v in row.items():
        o=v['open']; s.append(f"{arm}: shut {v['shut']['n']}/{v['shut']['inMark']} open {o['n'] if isinstance(o,dict) else o}/{o['inMark'] if isinstance(o,dict) else '-'} ids {len(v['shut']['ids'])} [{v['label']}]")
    print(f"{eng} {k:24s}", ' | '.join(s))
L=json.load(open(f'{d}/landscape-{eng}.json'))
for k,v in L.items():
    if k=='payload': continue
    c=v['card']; sh=v['sheet']
    print(f"{eng} {k:18s} card client {c['clientHeight']} scroll {c['scrollHeight']} wells {[(w['name'],w['h'],w['reachable']) for w in c['wells']]}")
    if isinstance(sh,dict): print(f"      sheet rows {sh['rows']} '{sh['more']}' box {sh['box']} lapped {sh['lapped']} markHit {sh['markHit']}")
