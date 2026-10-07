import re,sys,collections
# per regime x theme x engine: lowest non-admitted chrome median, tier2 cell40 min median, 9x9 cell0 left + count, 16x16 cell0 min + count
D=collections.defaultdict(lambda: collections.defaultdict(list))
for line in open(sys.argv[1]):
    m=re.match(r'\[G-LIVE-23 (\w+) ([\w-]+)\] (ok |RED) (light|dark) (.+?): (top .*)',line)
    if not m: continue
    eng,reg,v,th,subj,rest=m.groups()
    meds=re.findall(r'(top|right|bottom|left) ([\d.]+)/(\d+) u(\d+) t([\d.]+)',rest)
    lo=min(float(x[1]) for x in meds); u=sum(int(x[3]) for x in meds); dep=min(float(x[4]) for x in meds)
    k=(reg,th,eng)
    if subj.startswith('tier 2 on 9×9 cell 40'): D[k]['c40'].append((lo,dep))
    elif subj.startswith('tier 2 on 9×9 cell 0'): D[k]['c0_9'].append((lo,u))
    elif subj.startswith('tier 2 on 16×16 cell 0'): D[k]['c0_16'].append((lo,u))
    elif subj=='deck div.gallery-viewport': D[k]['deck'].append(lo)
    else: D[k]['chrome'].append((lo,dep,subj))
    if v.strip()=='RED': D[k]['red'].append(subj)
for k in sorted(D):
    d=D[k]
    ch=min(d['chrome']) if d['chrome'] else None
    f=lambda L: (min(x[0] for x in L), max(x[1] for x in L)) if L else '-'
    print(k, 'chrome lowest', (ch[0],ch[2]) if ch else '-', 'min depth', min(x[1] for x in d['chrome']) if d['chrome'] else '-', '| c40', f(d['c40']), '| 9x9 c0 (min,maxcount)', f(d['c0_9']), '| 16x16 c0', f(d['c0_16']), '| deck', min(d['deck']) if d['deck'] else '-', '| RED', d['red'] or 0)
