#!/usr/bin/env python3
# r5sum.py <log>...: one row per G14 cell x line (control frac, clean frac, bound, margin, printed, gated, unseen plants,
# G5-alone and G2-alone sets recomputed from the printed JSON exactly as the spec computes them), plus the run's tallies.
import json, sys
def clause(w): return w[:2]
for path in sys.argv[1:]:
    print(f"## {path.split('/')[-1]}")
    for line in open(path, errors="replace"):
        if not line.startswith("G14 "): continue
        d = json.loads(line[4:])
        cell = f"{d['engine'][:2]} {d['cell']}"
        g5a, g2a = [], []
        for q, v in d["lines"].items():
            pr = set(v["printed"])
            unseen = [n for n, p in v["plants"].items()
                      if not n.startswith(("G5one_", "G2win_")) and not p["seenBy"] and not (n == "X1b" and q == ".pl-qual")]
            g5 = [n for n, p in v["plants"].items() if n.startswith("G5one_") and p["seenBy"] == ["G5"]]
            g2 = [n for n, p in v["plants"].items() if n.startswith("G2win_") and p["seenBy"] == ["G2"]]
            if "G5" not in pr: g5a += [f"{q}:{n[6:]}" for n in g5]
            if "G2" not in pr and (v["bound"] or 0) > 0.5: g2a += [f"{q}:{n[6:]}" for n in g2]
            ctlu = v["control"].split("<4.5 ")[1].split()[0]
            clu = v["clean"].split("<4.5 ")[1].split()[0]
            print(f"{cell:10} {q:9} rows={d['rows']} foot={d['foot']!r:14} ctl<4.5={ctlu} clean<4.5={clu} bound={v['bound']:.3f} "
                  f"margin={v['edge']['margin']} edge-={','.join(v['edge']['under'])} edge+={','.join(v['edge']['over'])} "
                  f"printed={','.join(v['printed']) or '-'} gated={v['gated'] or '[]'} unseen={unseen or '-'} slack={d['slack']} drop={d['drop']}")
        print(f"{cell:10} G5-alone[{len(g5a)}]={' '.join(g5a[:6])}{' …' if len(g5a) > 6 else ''}  G2-alone[{len(g2a)}]={' '.join(g2a[:4])}")
    tail = [l.strip() for l in open(path, errors="replace") if l.strip().endswith(("passed", "failed", "flaky", "skipped")) or " passed (" in l or " failed" in l[:12]]
    print("tally:", " | ".join(tail[-3:]))
