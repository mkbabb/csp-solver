#!/bin/zsh
# RUN: zsh gap-interleave.sh <tag> <windows-per-arm> <base-port> <cured-port> <mode-args…>
# T9-W8 §8.2 cure C03 — the reading harness for A6's refuter probe. ONE window per invocation,
# alternating BASE, CURED, BASE, CURED … so host drift falls on both arms equally. `--windows 1`
# makes each invocation one window per POSE (the probe's gapsplit plan is mob then desk), so a
# set of N gives N windows per pose per arm. loadavg is stamped at both ends.
set -e
TAG=$1; N=$2; BP=$3; CP=$4; shift 4
C3=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C03
mkdir -p $C3/raw/$TAG
echo "SET $TAG · $N windows/arm/pose · base :$BP · cured :$CP · $@"
echo "loadavg start: $(sysctl -n vm.loadavg)"
for i in $(seq 1 $N); do
  node $C3/instr/refute-probes.mjs --base http://127.0.0.1:$BP --out $C3/raw/$TAG/base-w$i.jsonl --windows 1 "$@" 2>&1 | sed "s/^/  base  w$i: /"
  node $C3/instr/refute-probes.mjs --base http://127.0.0.1:$CP --out $C3/raw/$TAG/cured-w$i.jsonl --windows 1 "$@" 2>&1 | sed "s/^/  cured w$i: /"
done
echo "loadavg end:   $(sysctl -n vm.loadavg)"
cat $C3/raw/$TAG/base-w*.jsonl > $C3/raw/$TAG/base.jsonl
cat $C3/raw/$TAG/cured-w*.jsonl > $C3/raw/$TAG/cured.jsonl
echo "merged: $C3/raw/$TAG/{base,cured}.jsonl"
