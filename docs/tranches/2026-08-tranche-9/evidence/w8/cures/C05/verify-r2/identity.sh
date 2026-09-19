#!/bin/sh
# T9-W8 C05 — NON-AUTHOR VERIFIER, ROUND 2. My own capture-identity census, interleaved.
# It tests the repair round's two central claims: (a) the live re-key's four encodes do NOT move
# between arms, (b) the unfold's four DO move past GESTURE_QUIET_MS — and it re-reads the cured
# cycle-1 entry bake the round-1 verifier found.
# Instrument: attrib/fold-identity.mjs, the cure's own, unmodified; only --port differs.
# RUN from the worktree's web/frontend:  sh identity.sh <n>
set -u
EV=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C05
V=$EV/verify-r2
N=${1:-3}
OUT=$V/identity
mkdir -p "$OUT"
echo "LOAD START: $(sysctl -n vm.loadavg)" >>"$OUT/load.txt"
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
echo "LOAD END: $(sysctl -n vm.loadavg)" >>"$OUT/load.txt"
