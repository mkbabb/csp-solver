#!/bin/sh
# T9-W8 C05 REPAIR ROUND 1 — the re-measure the repair owes.
# Same instrument (A7's fold-frames.mjs, verbatim, only --port differs), same arms:
# base = dist-base :4252 (index-CS-Vym5OZcaO.js), cured = dist :4253 (index-LjRNU9f7iIUb.js).
# Interleaved b,c,b,c… so host drift cancels. RUN from the worktree's web/frontend.
set -u
EV=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C05
F=$EV/fix-r1
ENGINE=$1; THROTTLE=$2; VIEW=$3; CYCLES=$4; N=$5; TAG=$6
OUT=$F/raw/$TAG
mkdir -p "$OUT"
echo "LOAD START: $(sysctl -n vm.loadavg)" | tee "$OUT/load.txt"
i=1
while [ "$i" -le "$N" ]; do
  node "$EV/fold-frames.mjs" --engine "$ENGINE" --throttle "$THROTTLE" --viewport "$VIEW" \
    --cycles "$CYCLES" --port 4252 --out "$OUT/base-w$i.jsonl" >>"$OUT/console.txt" 2>&1
  echo "base w$i exit=$?" >>"$OUT/console.txt"
  node "$EV/fold-frames.mjs" --engine "$ENGINE" --throttle "$THROTTLE" --viewport "$VIEW" \
    --cycles "$CYCLES" --port 4253 --out "$OUT/cured-w$i.jsonl" >>"$OUT/console.txt" 2>&1
  echo "cured w$i exit=$?" >>"$OUT/console.txt"
  i=$((i + 1))
done
echo "LOAD END: $(sysctl -n vm.loadavg)" | tee -a "$OUT/load.txt"
