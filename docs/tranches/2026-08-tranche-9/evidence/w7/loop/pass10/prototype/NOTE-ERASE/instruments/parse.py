# parse.py <log>: per console-line label, the ms range, connected range, visible range, n
import re, sys, collections
rows = collections.OrderedDict()
pat = re.compile(r"^(?P<label>.+?): (?:held )?(?P<ms>[\d.]+) ms(?:, (?P<c>\d+) connected / (?P<v>\d+) visible frames)?")
for line in open(sys.argv[1], errors="replace"):
    line = line.strip()
    if line.startswith(("✓", "✘", "[", "Running", "-")): continue
    m = pat.match(line)
    if not m: continue
    r = rows.setdefault(m["label"], {"ms": [], "c": [], "v": []})
    r["ms"].append(float(m["ms"]))
    if m["c"] is not None: r["c"].append(int(m["c"])); r["v"].append(int(m["v"]))
rng = lambda a, f="{:g}": "-" if not a else (f.format(min(a)) if min(a) == max(a) else f"{f.format(min(a))}–{f.format(max(a))}")
for k, r in rows.items():
    print(f"{k} | n={len(r['ms'])} | {rng(r['ms'])} ms | conn {rng(r['c'])} | vis {rng(r['v'])}")
