#!/usr/bin/env python3
"""Summarise probe-rate logs: G1 moves/min per arm per engine (n, each, mean, min–max), the slow control, G4."""
import sys, re, json, collections
rows = collections.defaultdict(list); other = []
for path in sys.argv[1:]:
    arm = re.search(r'rate-(\d+)', path).group(1)
    pending = []  # the list reporter prints a test's result line AFTER its console output
    for l in open(path):
        m = re.match(r'PLC\|(g1\.\w+|g4\.\w+)\|(.*)', l.strip())
        if m: pending.append((m.group(1), json.loads(m.group(2)))); continue
        m = re.search(r'[✓✘].*\[(chromium|webkit)\]', l)
        if not m: continue
        for k, d in pending:
            if k in ('g1.ordinary', 'g1.sweep'): rows[(arm, k, m.group(1))].append(d['movesPerMin'])
            else: other.append((arm, m.group(1), k, d))
        pending = []
for (arm, k, eng), v in sorted(rows.items()):
    print(f"{arm} {k:12} {eng:8} n={len(v)} each={v} mean={sum(v)/len(v):.1f} range={min(v)}–{max(v)}")
for arm, eng, k, d in other:
    print(arm, eng, k, {x: d[x] for x in d if x in ('movesPerMin', 'frames', 'jumps', 'headMutations', 'spanMin', 'sheetOpenDuring')})
