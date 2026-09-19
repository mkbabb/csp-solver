#!/bin/zsh
# C11 acceptance battery. One window per arm at a time, b,c,b,c…, so host drift cancels.
# RUN from the w8-bake worktree's web/frontend:
#   zsh <this file> <engine> <cpu> <cache> <vp> <windows> <tag>
# Ports: base 4252 (dist-base) · cured 4253 (dist). The instrument is the banked
# attribution/A1/bake-census.mjs, unmodified; only --port differs between the arms.
set -u
ENGINE=$1; CPU=$2; CACHE=$3; VP=$4; N=$5; TAG=$6
D=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8
CENSUS=$D/attribution/A1/bake-census.mjs
OUT=$D/cures/C11/raw/$TAG
mkdir -p $OUT
echo "loadavg start: $(sysctl -n vm.loadavg)" > $OUT/loadavg.txt
for i in $(seq 1 $N); do
  for ARM in base cured; do
    if [ "$ARM" = "base" ]; then PORT=4252; else PORT=4253; fi
    node $CENSUS --engine $ENGINE --cpu $CPU --net none --cache $CACHE --vp $VP \
      --port $PORT --windows 1 --toggle 0 --out $OUT/$ARM-$i.jsonl 2>>$OUT/driver.log
  done
done
echo "loadavg end: $(sysctl -n vm.loadavg)" >> $OUT/loadavg.txt
cat $OUT/loadavg.txt
