import re,sys,collections
t=open(sys.argv[1]).read()
print([l.strip() for l in t.splitlines() if re.match(r'\s*\d+ (passed|failed|flaky|skipped)',l)])
fails=collections.Counter(re.sub(r'\s*\(\d.*$','',m) for m in re.findall(r'✘\s+\d+ \[\w+\] › \S+ › (.+)',t))
for k,v in fails.items(): print("FAIL x%d %s"%(v,k))
groups=collections.defaultdict(list)
for m in re.finditer(r'^(.*?): (?:name=.*? dur=(\S+) )?(?:held )?([\d.]+) ms, (\d+) connected / (\d+) visible',t,re.M):
    k=m.group(1).strip(); groups[k].append((float(m.group(3)),int(m.group(4)),int(m.group(5)),m.group(2)))
for k,v in groups.items():
    ms=[x[0] for x in v]; c=[x[1] for x in v]; vi=[x[2] for x in v]; d=set(x[3] for x in v if x[3])
    print(f"{k} | n={len(v)} ms {min(ms)}-{max(ms)} | conn {min(c)}-{max(c)} | vis {min(vi)}-{max(vi)} {('dur '+','.join(d)) if d else ''}")
