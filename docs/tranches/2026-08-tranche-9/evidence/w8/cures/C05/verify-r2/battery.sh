#!/bin/sh
# T9-W8 C05 — NON-AUTHOR VERIFIER, ROUND 2. My own interleaved battery.
# Instrument: the cure's fold-frames.mjs, byte-identical to attribution/A7/fold-frames.mjs
# (diffed; the only thing I change is --port, which the instrument takes as an argument).
# Arms: base = dist-base :4252 (index-CS-Vym5OZcaO.js), cured = dist :4253 (index-LjRNU9f7iIUb.js),
# both verified over HTTP at both ends. Interleaved b,c,b,c… so host drift cancels.
# A window that dies on a host fact is retried up to 3 times and named if it never reads.
# RUN from the worktree's web/frontend:  sh battery.sh <first> <last> <tag>
set -u
EV=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C05
V=$EV/verify-r2
FIRST=$1; LAST=$2; TAG=$3
OUT=$V/raw/$TAG
mkdir -p "$OUT"
echo "LOAD START ($FIRST..$LAST): $(sysctl -n vm.loadavg)" >>"$OUT/load.txt"
run_one() {
  arm=$1; port=$2; idx=$3
  a=1
  while [ "$a" -le 3 ]; do
    rm -f "$OUT/$arm-w$idx.jsonl"
    node "$EV/fold-frames.mjs" --engine chromium --throttle 4 --viewport desk \
      --cycles 3 --port "$port" --out "$OUT/$arm-w$idx.jsonl" >>"$OUT/console.txt" 2>&1
    code=$?
    echo "$arm w$idx attempt$a exit=$code" >>"$OUT/console.txt"
    [ "$code" -eq 0 ] && return 0
    rm -f "$OUT/$arm-w$idx.jsonl"
    a=$((a + 1))
    sleep 5
  done
  echo "$arm w$idx GAVE UP (no reading)" >>"$OUT/console.txt"
  return 1
}
i=$FIRST
while [ "$i" -le "$LAST" ]; do
  run_one base 4252 "$i"
  run_one cured 4253 "$i"
  i=$((i + 1))
done
echo "LOAD END: $(sysctl -n vm.loadavg)" >>"$OUT/load.txt"
