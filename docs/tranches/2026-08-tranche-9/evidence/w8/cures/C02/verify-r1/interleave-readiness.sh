#!/bin/zsh
# T9-W8 C02 VERIFY r1 — A6's banked readiness-timeline.mjs (VERBATIM; it takes --base),
# one window per invocation, BASE(:4252)/CURED(:4253) alternating. TBT(3000) and boardDrawn.
set -e
TAG=$1; N=$2; BP=$3; CP=$4; CELLS=$5
V=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C02/verify-r1
I=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C02/instr
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-bake/web/frontend
mkdir -p $V/raw/$TAG
cd $W
echo "SET $TAG · windows $N/arm · base :$BP · cured :$CP · cells $CELLS"
echo "loadavg start: $(sysctl -n vm.loadavg)"
: > $V/raw/$TAG/base.jsonl
: > $V/raw/$TAG/cured.jsonl
for i in $(seq 1 $N); do
  node $I/readiness-timeline.mjs --base http://127.0.0.1:$BP --windows 1 --cells $CELLS --out $V/raw/$TAG/b$i.jsonl 2>&1 | tail -2 | sed "s/^/  base  w$i: /"
  cat $V/raw/$TAG/b$i.jsonl >> $V/raw/$TAG/base.jsonl
  node $I/readiness-timeline.mjs --base http://127.0.0.1:$CP --windows 1 --cells $CELLS --out $V/raw/$TAG/c$i.jsonl 2>&1 | tail -2 | sed "s/^/  cured w$i: /"
  cat $V/raw/$TAG/c$i.jsonl >> $V/raw/$TAG/cured.jsonl
done
echo "loadavg end:   $(sysctl -n vm.loadavg)"
