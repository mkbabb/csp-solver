#!/bin/zsh
# RUN: zsh interleave-readiness.sh <tag> <windows/arm> <base-port> <cured-port> <cells>
# A6's banked `readiness-timeline.mjs`, VERBATIM (it takes --base, so nothing in it changed),
# one window per invocation, BASE/CURED alternating. `tbt3000Ms` is the mark repair round 1
# exists for: sum over longtask entries starting inside the first 3,000 ms of everything past
# 50 ms. `firstBoilTickMs` is B1's boardDrawn. REPAIR ROUND 2 — raws under fix-r2/raw/<tag>.
set -e
TAG=$1; N=$2; BP=$3; CP=$4; CELLS=$5
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C02
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-bake/web/frontend
mkdir -p $E/fix-r2/raw/$TAG
cd $W
echo "SET $TAG · windows $N/arm · base :$BP · cured :$CP · cells $CELLS"
echo "loadavg start: $(sysctl -n vm.loadavg)"
: > $E/fix-r2/raw/$TAG/base.jsonl
: > $E/fix-r2/raw/$TAG/cured.jsonl
for i in $(seq 1 $N); do
  echo "  pair $i loadavg: $(sysctl -n vm.loadavg)"
  node $E/instr/readiness-timeline.mjs --base http://127.0.0.1:$BP --windows 1 --cells $CELLS --out $E/fix-r2/raw/$TAG/b$i.jsonl 2>&1 | tail -2 | sed "s/^/  base  w$i: /"
  cat $E/fix-r2/raw/$TAG/b$i.jsonl >> $E/fix-r2/raw/$TAG/base.jsonl
  node $E/instr/readiness-timeline.mjs --base http://127.0.0.1:$CP --windows 1 --cells $CELLS --out $E/fix-r2/raw/$TAG/c$i.jsonl 2>&1 | tail -2 | sed "s/^/  cured w$i: /"
  cat $E/fix-r2/raw/$TAG/c$i.jsonl >> $E/fix-r2/raw/$TAG/cured.jsonl
done
echo "loadavg end:   $(sysctl -n vm.loadavg)"
