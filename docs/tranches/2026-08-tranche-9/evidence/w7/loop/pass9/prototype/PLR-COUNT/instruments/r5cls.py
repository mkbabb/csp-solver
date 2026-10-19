#!/usr/bin/env python3
# r5cls.py <log>...: per G14 cell, the CLEAN verdict's gated clause ids per line (what a FILE plant must red), the in-run
# plants left unseen, the G5-/G2-alone set sizes, and the first assertion the row threw (its message, from the log).
import json, re, sys
for path in sys.argv[1:]:
    txt = open(path, errors="replace").read()
    cells = []
    for line in txt.splitlines():
        if not line.startswith("G14 "): continue
        d = json.loads(line[4:]); out = []; g5 = g2 = 0
        for q, v in d["lines"].items():
            ids = sorted({w[:2] for w in v["gated"]})
            unseen = [n for n, p in v["plants"].items() if not n.startswith(("G5one_", "G2win_")) and not p["seenBy"] and not (n == "X1b" and q == ".pl-qual")]
            pr = set(v["printed"])
            if "G5" not in pr: g5 += sum(1 for n, p in v["plants"].items() if n.startswith("G5one_") and p["seenBy"] == ["G5"])
            if "G2" not in pr and (v["bound"] or 0) > 0.5: g2 += sum(1 for n, p in v["plants"].items() if n.startswith("G2win_") and p["seenBy"] == ["G2"])
            out.append(f"{q}:{'+'.join(ids) or 'clean'}{'(unseen ' + ','.join(unseen) + ')' if unseen else ''}")
        cells.append(f"{d['engine'][:2]} {d['cell']}: {' '.join(out)} | G5alone {g5} G2alone {g2}")
    errs = re.findall(r"Error: (?:expect\(received\)\.[^\n]*\n\n)?([^\n]*\(\w+-\d\)[^\n]*)", txt)
    msgs = re.findall(r"\n\s+Error: ([^\n]{0,140})", txt)
    tally = re.findall(r"\n\s+(\d+ (?:passed|failed|skipped|flaky)[^\n]*)", txt)
    print(f"## {path.split('/')[-1]}")
    for c in cells: print("  ", c)
    for m in msgs[:8]: print("   err:", m)
    print("   tally:", " | ".join(tally))
