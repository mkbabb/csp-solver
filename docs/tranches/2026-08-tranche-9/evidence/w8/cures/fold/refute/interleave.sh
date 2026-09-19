#!/bin/zsh
# T9-W8 FOLD REFUTER — C01's banked harness (C01/verify-r3/interleave.sh) with the evidence
# root moved to this dir and the ports moved to 4257 (base) / 4256 (cured). The instrument is
# C01/instr/bake-census.mjs, untouched, invoked one window per call, b,c,b,c.
set -e
TAG=$1; N=$2; BP=$3; CP=$4; shift 4
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C01
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/fold/refute
mkdir -p $E/raw/$TAG
echo "SET $TAG · windows $N/arm · base :$BP · cured :$CP · args $@"
echo "loadavg start: $(sysctl -n vm.loadavg)"
for i in $(seq 1 $N); do
  node $C/instr/bake-census.mjs "$@" --port $BP --windows 1 --out $E/raw/$TAG/base-w$i.jsonl 2>&1 | sed "s/^/  base  w$i: /"
  node $C/instr/bake-census.mjs "$@" --port $CP --windows 1 --out $E/raw/$TAG/cured-w$i.jsonl 2>&1 | sed "s/^/  cured w$i: /"
done
echo "loadavg end:   $(sysctl -n vm.loadavg)"
node $C/instr/merge.mjs $E/raw/$TAG/base-w*.jsonl > $E/raw/$TAG/base.jsonl
node $C/instr/merge.mjs $E/raw/$TAG/cured-w*.jsonl > $E/raw/$TAG/cured.jsonl
echo "merged: $E/raw/$TAG/{base,cured}.jsonl"
