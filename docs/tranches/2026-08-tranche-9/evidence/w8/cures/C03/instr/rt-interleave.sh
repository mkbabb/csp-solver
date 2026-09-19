#!/bin/zsh
# RUN: zsh rt-interleave.sh <tag> <windows> <base-port> <cured-port> <cell> [extra args…]
# T9-W8 §8.2 cure C03 — A6's readiness timeline, one window per invocation, alternating BASE,
# CURED, … so host drift falls on both arms equally. loadavg at both ends.
set -e
TAG=$1; N=$2; BP=$3; CP=$4; CELL=$5; shift 5
C3=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C03
mkdir -p $C3/raw/$TAG
echo "SET $TAG · windows $N/arm · cell $CELL · base :$BP · cured :$CP · $@"
echo "loadavg start: $(sysctl -n vm.loadavg)"
for i in $(seq 1 $N); do
  node $C3/instr/readiness-timeline.mjs --base http://127.0.0.1:$BP --cells $CELL --windows 1 --out $C3/raw/$TAG/base-w$i.jsonl "$@" > /dev/null 2>&1
  node $C3/instr/readiness-timeline.mjs --base http://127.0.0.1:$CP --cells $CELL --windows 1 --out $C3/raw/$TAG/cured-w$i.jsonl "$@" > /dev/null 2>&1
  echo "  w$i done · load $(sysctl -n vm.loadavg)"
done
echo "loadavg end:   $(sysctl -n vm.loadavg)"
cat $C3/raw/$TAG/base-w*.jsonl > $C3/raw/$TAG/base.jsonl
cat $C3/raw/$TAG/cured-w*.jsonl > $C3/raw/$TAG/cured.jsonl
echo "merged: $C3/raw/$TAG/{base,cured}.jsonl"
