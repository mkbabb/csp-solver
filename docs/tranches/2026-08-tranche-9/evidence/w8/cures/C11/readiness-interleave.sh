#!/bin/zsh
# C11: the charter's Accept marks (warm boardDrawn = A6's firstBoilTickMs, warm TBT(3000)),
# one window per arm at a time. RUN from the w8-bake worktree's web/frontend:
#   zsh <this file> <cell> <windows> <tag>
set -u
CELL=$1; N=$2; TAG=$3
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C11
OUT=$C/raw/$TAG
mkdir -p $OUT
echo "loadavg start: $(sysctl -n vm.loadavg)" > $OUT/loadavg.txt
for i in $(seq 1 $N); do
  for ARM in base cured; do
    if [ "$ARM" = "base" ]; then PORT=4252; else PORT=4253; fi
    node $C/readiness-timeline-c11.mjs --base http://127.0.0.1:$PORT --cells $CELL \
      --windows 1 --out $OUT/$ARM-$i.jsonl >>$OUT/driver.log 2>&1
  done
done
echo "loadavg end: $(sysctl -n vm.loadavg)" >> $OUT/loadavg.txt
cat $OUT/loadavg.txt
