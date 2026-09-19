#!/bin/zsh
# RUN: zsh interleave.sh <tag> <windows> <base-port> <cured-port> [bake-census args…]
# T9-W8 §8.2 cure C01 — the reading harness. One window per invocation of A1's banked
# `bake-census.mjs`, alternating BASE, CURED, BASE, CURED … so host drift falls on both arms
# equally. Each window lands in its own JSONL (the instrument rewrites its meta line per run);
# `merge.mjs` then stitches an arm's windows into one file with the window numbers restored.
# `sysctl -n vm.loadavg` is stamped before and after the whole set.
set -e
TAG=$1; N=$2; BP=$3; CP=$4; shift 4
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C01
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
