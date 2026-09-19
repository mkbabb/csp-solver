#!/bin/zsh
# T9-W8 C02 repair round 3 — three MORE interleaved drawer windows per arm (w4-w6), so the
# finding being repaired is read off six windows per arm rather than the three the verifier
# had. Same instrument, same regime, same directory; `drawer-stats.mjs` then reads all six.
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C02
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-bake/web/frontend
BP=4252; CP=4253
cd $W
echo "loadavg open: $(sysctl -n vm.loadavg)"
for i in 4 5 6; do
  node $E/instr/drawer-trace.mjs --engine chromium --regime mobile --cpu 6 --cycles 3 --port $BP --out $E/fix-r3/raw/drawer/base-w$i.jsonl > /dev/null 2>&1
  node $E/instr/drawer-trace.mjs --engine chromium --regime mobile --cpu 6 --cycles 3 --port $CP --out $E/fix-r3/raw/drawer/cured-w$i.jsonl > /dev/null 2>&1
  echo "  pair $i loadavg $(sysctl -n vm.loadavg)"
done
node $E/fix-r2/drawer-stats.mjs $E/fix-r3/raw/drawer "chromium 6x · mobile 390x844 dpr1 (A4 sets no scale factor) · cold · 6 windows x 3 cycles, interleaved" > $E/fix-r3/stats-drawer.txt
echo "loadavg close: $(sysctl -n vm.loadavg)"
echo "DRAWER-MORE COMPLETE"
