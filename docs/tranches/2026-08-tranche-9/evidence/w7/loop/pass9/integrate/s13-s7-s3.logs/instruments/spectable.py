import sys, re, collections
rows = collections.OrderedDict()
for f in sys.argv[1:]:
    for line in open(f):
        c = line.rstrip("\n").split("\t")
        if len(c) < 4: continue
        spec, eng, arm, rc = c[0], c[1], c[2], c[3]
        load = c[5].replace("load ", "") if len(c) > 5 else "-"
        summ = c[6].strip() if len(c) > 6 else ""
        p = re.search(r"(\d+) passed", summ); fl = re.search(r"(\d+) failed", summ)
        n = (int(p.group(1)) if p else 0) + (int(fl.group(1)) if fl else 0)
        cell = f"{int(p.group(1)) if p else 0}/{n} rc {rc}" if n else f"rc {rc} ({summ or '-'})"
        rows.setdefault(spec, {})[(eng, arm)] = (cell, load)
print("| spec | chromium tree | chromium ctrl | webkit tree | webkit ctrl | load (1-min, tree rows) |")
print("|---|---|---|---|---|---|")
for spec, d in rows.items():
    g = lambda k: d.get(k, ("UNREAD", ""))[0]
    loads = " / ".join(x for x in [d.get(("chromium","tree"),("",""))[1], d.get(("webkit","tree"),("",""))[1]] if x)
    print(f"| {spec} | {g(('chromium','tree'))} | {g(('chromium','ctrl'))} | {g(('webkit','tree'))} | {g(('webkit','ctrl'))} | {loads} |")
