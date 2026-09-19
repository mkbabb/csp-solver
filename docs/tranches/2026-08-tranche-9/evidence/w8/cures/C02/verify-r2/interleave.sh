#!/bin/zsh
# RUN: zsh interleave.sh <tag> <windows/arm> <base-port> <cured-port> [toggle-probe args…]
# T9-W8 §8.2 cure C02, NON-AUTHOR VERIFY ROUND 2. The author's own harness, unchanged but for
# the raw path (verify-r2/raw/<tag>). One window per invocation of A5's banked toggle-probe.mjs
# (diff vs the A5 bank exits 0), alternating BASE, CURED, BASE, CURED so host drift falls on
# both arms equally. loadavg and both arms' dist-identity stamped at both ends of every set.
set -e
TAG=$1; N=$2; BP=$3; CP=$4; shift 4
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C02
V=$E/verify-r2
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-bake/web/frontend
mkdir -p $V/raw/$TAG
cd $W
echo "SET $TAG · windows $N/arm · base :$BP · cured :$CP · args $@"
echo "loadavg start: $(sysctl -n vm.loadavg)"
echo "identity start base : $(node scripts/dist-identity.mjs --dist dist-base)"
echo "identity start cured: $(node scripts/dist-identity.mjs --dist dist)"
for i in $(seq 1 $N); do
  echo "  pair $i loadavg: $(sysctl -n vm.loadavg)"
  node $E/instr/toggle-probe.mjs "$@" --port $BP --windows 1 --out $V/raw/$TAG/base-w$i.jsonl 2>&1 | grep -E "^win " | sed "s/^/  base  w$i: /"
  node $E/instr/toggle-probe.mjs "$@" --port $CP --windows 1 --out $V/raw/$TAG/cured-w$i.jsonl 2>&1 | grep -E "^win " | sed "s/^/  cured w$i: /"
done
echo "identity end base : $(node scripts/dist-identity.mjs --dist dist-base)"
echo "identity end cured: $(node scripts/dist-identity.mjs --dist dist)"
echo "loadavg end:   $(sysctl -n vm.loadavg)"
