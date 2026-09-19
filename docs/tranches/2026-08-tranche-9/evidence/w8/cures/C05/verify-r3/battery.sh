#!/bin/sh
# T9-W8 C05 ROUND 3 — the NON-AUTHOR's own battery. A7's fold-frames.mjs verbatim (only --port
# differs, as the charter's acceptance allows), interleaved b,c,b,c, 6 windows per arm.
# Arms: base = dist-base :4252 (index-CS-Vym5OZcaO.js), cured = dist :4253 (index-LjRNU9f7iIUb.js).
# RUN from the worktree's web/frontend.
set -u
EV=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C05
V=$EV/verify-r3
OUT=$V/raw/c4x-desk
mkdir -p "$OUT"

echo "LOAD START: $(sysctl -n vm.loadavg)" | tee "$OUT/load.txt"
i=1
while [ "$i" -le 6 ]; do
  node "$EV/fold-frames.mjs" --engine chromium --throttle 4 --viewport desk \
    --cycles 3 --port 4252 --out "$OUT/base-w$i.jsonl" >>"$OUT/console.txt" 2>&1
  echo "base w$i exit=$?" >>"$OUT/console.txt"
  node "$EV/fold-frames.mjs" --engine chromium --throttle 4 --viewport desk \
    --cycles 3 --port 4253 --out "$OUT/cured-w$i.jsonl" >>"$OUT/console.txt" 2>&1
  echo "cured w$i exit=$?" >>"$OUT/console.txt"
  i=$((i + 1))
done
echo "LOAD END: $(sysctl -n vm.loadavg)" | tee -a "$OUT/load.txt"
echo "BATTERY DONE"
