# parse-leaves.py <spec log> — each console reading paired with the engine of the result line after it; min–max per (engine, row)
import sys, re, collections
lines = open(sys.argv[1]).read().splitlines()
pend = []; agg = collections.defaultdict(lambda: {"ms": [], "conn": [], "vis": []})
fails = []
for l in lines:
    m = re.match(r"\s*([✓✘×]|ok|x)\s+\d+\s+\[(\w+)\]\s+›\s+(.*)", l)
    if m:
        for (key, ms, c, v) in pend:
            a = agg[(m.group(2), key)]; a["ms"].append(ms)
            if c is not None: a["conn"].append(c)
            if v is not None: a["vis"].append(v)
        pend = []
        if m.group(1) in "✘×x": fails.append(m.group(2) + " " + m.group(3)[:120])
        continue
    r = re.match(r"(.*?):? (?:held )?([\d.]+) ms(?:, (\d+) connected / (\d+) visible frames| over (\d+) painted frames|, (\d+) painted frames)?", l.strip())
    if r and ("leave" in l or "negative" in l or "swap" in l or "line two" in l):
        c = r.group(3) or r.group(5) or r.group(6)
        pend.append((r.group(1).strip(), float(r.group(2)), int(c) if c else None, int(r.group(4)) if r.group(4) else None))
for (eng, key), a in sorted(agg.items()):
    rng = lambda x: (f"{min(x):g}–{max(x):g}" if x else "—")
    print(f"{eng:8} | {key[:90]:90} | n={len(a['ms'])} | {rng(a['ms'])} ms | conn {rng(a['conn'])} | vis {rng(a['vis'])}")
print("FAILED:", len(fails)); [print("  ", f) for f in fails]
