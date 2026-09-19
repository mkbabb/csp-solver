#!/bin/zsh
# RUN: zsh interleave.sh <tag> <windows> <base-port> <cured-port> [bake-census args…]
# VERIFIER round 2, track bake. Identical to the author's harness except for the evidence
# root (verify-r2/) and the ports handed on the command line (4252 base / 4253 cured).
set -e
TAG=$1; N=$2; BP=$3; CP=$4; shift 4
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C01/verify-r2
mkdir -p $E/raw/$TAG
echo "SET $TAG · windows $N/arm · base :$BP · cured :$CP · args $@"
echo "loadavg start: $(sysctl -n vm.loadavg)"
for i in $(seq 1 $N); do
  node $E/instr/bake-census.mjs "$@" --port $BP --windows 1 --out $E/raw/$TAG/base-w$i.jsonl 2>&1 | sed "s/^/  base  w$i: /"
  node $E/instr/bake-census.mjs "$@" --port $CP --windows 1 --out $E/raw/$TAG/cured-w$i.jsonl 2>&1 | sed "s/^/  cured w$i: /"
done
echo "loadavg end:   $(sysctl -n vm.loadavg)"
node $E/instr/merge.mjs $E/raw/$TAG/base-w*.jsonl > $E/raw/$TAG/base.jsonl
node $E/instr/merge.mjs $E/raw/$TAG/cured-w*.jsonl > $E/raw/$TAG/cured.jsonl
echo "merged: $E/raw/$TAG/{base,cured}.jsonl"
