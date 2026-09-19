#!/bin/sh
# T9-W8 C05 REPAIR ROUND 1 — top up the interleaved battery to N windows per arm.
# Same instrument and arms as battery.sh. A window is RETRIED (up to 3 attempts) when the
# instrument dies on a host fact — "Target page, context or browser has been closed" under this
# box's load. A window that never produces a file is named in console.txt and is not a reading.
# The pair stays interleaved: base w_i then cured w_i, in order.
# RUN from the worktree's web/frontend:  sh topup.sh <firstIndex> <lastIndex> <tag>
set -u
EV=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C05
F=$EV/fix-r1
FIRST=$1; LAST=$2; TAG=$3
OUT=$F/raw/$TAG
mkdir -p "$OUT"
echo "LOAD TOPUP START ($FIRST..$LAST): $(sysctl -n vm.loadavg)" >>"$OUT/load.txt"
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
echo "LOAD TOPUP END: $(sysctl -n vm.loadavg)" >>"$OUT/load.txt"
