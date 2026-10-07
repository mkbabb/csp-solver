import re,sys,collections
rows=collections.OrderedDict()
for line in open(sys.argv[1]):
    m=re.match(r'\[G-LIVE-23 (\w+) ([\w-]+)\] (ok |RED) (light|dark) (.+?): (top .*)',line)
    if not m: continue
    eng,reg,v,th,subj,rest=m.groups()
    meds=re.findall(r'(top|right|bottom|left) ([\d.]+)/(\d+) u(\d+) t([\d.]+)',rest)
    lo=min(float(x[1]) for x in meds); th_=min(float(x[4]) for x in meds); u=sum(int(x[3]) for x in meds)
    key=(subj,reg,th,eng)
    rows.setdefault(key,[]).append((v.strip(),lo,th_,u))
for (subj,reg,th,eng),vs in rows.items():
    if subj.startswith('tier 2') or subj in ('button.tuner-toggle','button.info-btn','button.attribution-trigger','deck div.gallery-viewport','guard button.guard-btn','deck button.staging-btn'):
        print(f"{subj:28s} {reg:14s} {th:5s} {eng:8s} " + " | ".join(f"{v} min-median {lo} min-depth {t} under3 {u}" for v,lo,t,u in vs))
