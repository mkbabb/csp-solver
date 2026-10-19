#!/usr/bin/env python3
# r5table.py <logdir> [jobs...]: the born-RED / sabotage battery as markdown rows. Per job x engine: the row's exit (from
# the job's own .exit file), cells failed / run, and per cell the CLEAN verdict's gated clause ids (union over the 3 lines),
# the G5-alone and G2-alone set sizes, and whether the payload/edge assertions were what threw.
import json, re, sys, os
L = sys.argv[1]
jobs = sys.argv[2:] or ["OPA80F", "COMB", "FADE80F", "HEAD12F", "C1", "C2", "C3", "C4", "C5", "SLACK-eps", "SLACK+eps", "PLUSF2"]
def cells(txt):
    out = []
    for line in txt.splitlines():
        if not line.startswith("G14 "): continue
        d = json.loads(line[4:]); ids = set(); g5 = g2 = 0
        for q, v in d["lines"].items():
            ids |= {w[:2] for w in v["gated"]}
            pr = set(v["printed"])
            if "G5" not in pr: g5 += sum(1 for n, p in v["plants"].items() if n.startswith("G5one_") and p["seenBy"] == ["G5"])
            if "G2" not in pr and (v["bound"] or 0) > 0.5: g2 += sum(1 for n, p in v["plants"].items() if n.startswith("G2win_") and p["seenBy"] == ["G2"])
        out.append((d["cell"], "+".join(sorted(ids)) or "clean", g5, g2))
    return out
for j in jobs:
    for e in ("chromium", "webkit"):
        lp, xp = f"{L}/b13-{j}.{e}.log", f"{L}/b13-{j}.{e}.exit"
        if not os.path.exists(lp): continue
        txt = open(lp, errors="replace").read()
        ex = open(xp).read().strip() if os.path.exists(xp) else "exit=?"
        failed = len(re.findall(r"^\s+✘", txt, re.M)); passed = len(re.findall(r"^\s+✓", txt, re.M))
        errs = sorted(set(re.findall(r"\n\s+Error: ([^\n]{0,70})", txt)))
        cs = " · ".join(f"{c} {ids} g5a{g5} g2a{g2}" for c, ids, g5, g2 in cells(txt))
        load = open(f"{L}/b13-{j}.{e}.load").read().split("\n")[0][5:40] if os.path.exists(f"{L}/b13-{j}.{e}.load") else "?"
        print(f"| {j} | {e} | {ex} | {failed} red / {passed} green | {cs} | {'; '.join(e2[:60] for e2 in errs[:3])} | {load} |")
