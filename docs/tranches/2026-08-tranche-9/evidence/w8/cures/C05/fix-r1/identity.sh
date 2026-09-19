#!/bin/sh
# T9-W8 C05 REPAIR ROUND 1 — the capture-identity census, interleaved, 3 runs per arm.
# It answers the verifier's finding (1): does the CURED arm re-bake the wordmark's gallery box
# inside the cycle-1 entry window, where the base bakes it zero times?
# Instrument: attrib/fold-identity.mjs (this cure's own). RUN from the worktree's web/frontend.
set -u
EV=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C05
F=$EV/fix-r1
N=${1:-3}
OUT=$F/identity
mkdir -p "$OUT"
echo "LOAD START: $(sysctl -n vm.loadavg)" | tee "$OUT/load.txt"
i=1
while [ "$i" -le "$N" ]; do
  node "$EV/attrib/fold-identity.mjs" --engine chromium --throttle 4 --viewport desk \
    --cycles 3 --port 4252 --out "$OUT/base-$i.jsonl" >"$OUT/base-$i.txt" 2>&1
  echo "base $i exit=$?" >>"$OUT/console.txt"
  node "$EV/attrib/fold-identity.mjs" --engine chromium --throttle 4 --viewport desk \
    --cycles 3 --port 4253 --out "$OUT/cured-$i.jsonl" >"$OUT/cured-$i.txt" 2>&1
  echo "cured $i exit=$?" >>"$OUT/console.txt"
  i=$((i + 1))
done
echo "LOAD END: $(sysctl -n vm.loadavg)" | tee -a "$OUT/load.txt"
