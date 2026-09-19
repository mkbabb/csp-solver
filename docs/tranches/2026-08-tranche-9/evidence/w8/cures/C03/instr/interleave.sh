#!/bin/zsh
# RUN: zsh interleave.sh <tag> <windows> <base-port> <cured-port> [bake-census args…]
# T9-W8 §8.2 cure C03 — A1's banked `bake-census.mjs`, one window per invocation, alternating
# BASE, CURED, BASE, CURED … so host drift falls on both arms equally. `merge.mjs` stitches an
# arm's windows back into one file with the window numbers restored. loadavg at both ends.
set -e
TAG=$1; N=$2; BP=$3; CP=$4; shift 4
C3=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C03
mkdir -p $C3/raw/$TAG
echo "SET $TAG · windows $N/arm · base :$BP · cured :$CP · args $@"
echo "loadavg start: $(sysctl -n vm.loadavg)"
for i in $(seq 1 $N); do
  node $C3/instr/bake-census.mjs "$@" --port $BP --windows 1 --out $C3/raw/$TAG/base-w$i.jsonl 2>&1 | sed "s/^/  base  w$i: /"
  node $C3/instr/bake-census.mjs "$@" --port $CP --windows 1 --out $C3/raw/$TAG/cured-w$i.jsonl 2>&1 | sed "s/^/  cured w$i: /"
done
echo "loadavg end:   $(sysctl -n vm.loadavg)"
node $C3/instr/merge.mjs $C3/raw/$TAG/base-w*.jsonl > $C3/raw/$TAG/base.jsonl
node $C3/instr/merge.mjs $C3/raw/$TAG/cured-w*.jsonl > $C3/raw/$TAG/cured.jsonl
echo "merged: $C3/raw/$TAG/{base,cured}.jsonl"
