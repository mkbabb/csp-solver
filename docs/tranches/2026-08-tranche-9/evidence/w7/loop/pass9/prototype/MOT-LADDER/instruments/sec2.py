#!/usr/bin/env python3
"""Build README §2 (K table + sabotage) and insert it before §3. Reads bare TSVs only."""
import sys, re
S, E = sys.argv[1], sys.argv[2]
def tsv(p):
    rows = {}
    for ln in open(p):
        f = ln.rstrip("\n").split("\t")
        if len(f) > 2 and f[0] not in ("plant",):
            rows[f[0]] = f
    return rows
op = tsv(f"{E}/logs/k-battery-open-8c12b15c+homes-v2.tsv")
kb = tsv(f"{S}/logs/kt-bank/battery.tsv")
kp = tsv(f"{S}/logs/kt-prop/battery.tsv")
def red(x): return "**1**" if x == "1" else x
out = ["## 2 · The critic's K plants, bare exits (`instruments/ktree.sh`; `logs/kt-bank/`, `logs/kt-prop/`)", "",
       "Open state = 8c12b15c + homes v2, every gate (`logs/k-battery-open-*.tsv`). Final = this bank's gate, the TREE half",
       "(`check-motion-bands.mjs --list`, no self-test) for every plant, plus CI's whole `npm run lint:bands` for the",
       "headline plants (`-` = not run there). Only the gate file moved between open and final, so the open state's",
       "verbs/motion/tokens/eslint/prettier columns stand for the final tree. Every plant applied (exit 0) and every",
       "planted file was restored byte-equal (`cmp` 0) on both arms.", "",
       "| plant | open: bands verbs motion tokens eslint prettier | bank: tree-half | bank: CI | PROPOSED: tree-half | PROPOSED: CI |",
       "|---|---|---|---|---|---|"]
order = ["NONE","K1","K2","K2b","K3","K4","K5","K6","K7","K8","K9","K10","K11","K12","K13","K14","K15","K16","K17","K18","K23","K7r","K7s"]
for k in order:
    o = op.get(k); b = kb.get(k); p = kp.get(k)
    os_ = " ".join(o[2:8]) if o else "-"
    out.append(f"| {k} | {os_} | {red(b[2]) if b else '-'} | {red(b[3]) if b else '-'} | {red(p[2]) if p else '-'} | {red(p[3]) if p else '-'} |")
esc_b = [k for k in order[1:] if kb.get(k, [0,0,'0'])[2] == "0" and (not op.get(k) or "1" not in op[k][2:8])]
esc_p = [k for k in order[1:] if kp.get(k, [0,0,'0'])[2] == "0" and (not op.get(k) or "1" not in op[k][2:8])]
out += ["", f"Escapes every gate on the bank: **{', '.join(esc_b)}**. Escapes with PROPOSED: **{', '.join(esc_p)}**.",
        "K12, K14 and K17 red only prettier on the bank (the plant's spelling, not a closure); they are counted as bank misses",
        "in §0. **K23** (a keyframe stop pulled from 60 % to 6 %, the phase's effective time shortened while the duration",
        "holds) escapes both arms: the ratchet values durations, never keyframe offsets (§0 gap 8).", "",
        "### 2b · Clause sabotage (`--sabotage-battery`, `logs/tree-sabotage.log`)", ""]
sab = [l.rstrip() for l in open(f"{S}/logs/final/tree-sabotage.log") if l.startswith("SABOTAGE")]
for l in sab:
    m = re.match(r"SABOTAGE (\S+)\s+→ (\w+) \((\d+): \[([^\]]+)\]", l)
    if m: out.append(f"- `{m.group(1)}` → {m.group(2)} ({m.group(3)} self-test rows, first `{m.group(4)}`)")
    elif "BATTERY" in l: out.append(f"\n**{l}**, exit 0.")
out += ["", "The battery deletes each clause and re-runs `--self-test`; a clause no row reds would print HELD. The four new",
        "clauses (`element-reach`, `css-arith`, `script-durations`, `rung-publishers`) each red on their own verbatim plant.",
        "The earliest clauses ran on gate sha1 `da0c89d1`, before the last edit (`let hit`, the `LIB_CTX` row text) moved",
        "it to `0dffc87c`. Both edits are null on the bank arm (self-test 140 RED / 40 HELD on both shas).",
        "Numeric edges: K7r bound−ε 299 ms RED / 300 HELD; K3 −1 ms RED, at bound HELD, +1 ms HELD; `clamp` floor RED.", ""]
R = open(f"{E}/README.md").read()
assert "## 2 ·" not in R
i = R.index("## 3 ·")
R = R[:i] + "\n".join(out) + "\n" + R[i:]
open(f"{E}/README.md", "w").write(R)
print("\n".join(out[:3]), "...", esc_b, esc_p, len(sab))
