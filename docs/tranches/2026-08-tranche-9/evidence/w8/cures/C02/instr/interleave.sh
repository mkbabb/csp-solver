#!/bin/zsh
# RUN: zsh interleave.sh <tag> <windows/arm> <base-port> <cured-port> [toggle-probe args…]
#
# T9-W8 §8.2 cure C02 — the reading harness, C01's shape. One window per invocation of A5's
# banked `toggle-probe.mjs` (copied VERBATIM into instr/ — only `--port` differs between the
# arms), alternating BASE, CURED, BASE, CURED … so host drift falls on both arms equally.
# Each window lands in its own JSONL; `toggle-stats.mjs` reads a directory of them.
# `sysctl -n vm.loadavg` is stamped before and after the whole set, and `dist-identity` for
# BOTH arms at both ends — 8.2 rebuilds, so each arm names its own entry hash every time.
set -e
TAG=$1; N=$2; BP=$3; CP=$4; shift 4
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C02
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-bake/web/frontend
mkdir -p $E/raw/$TAG
cd $W
echo "SET $TAG · windows $N/arm · base :$BP · cured :$CP · args $@"
echo "loadavg start: $(sysctl -n vm.loadavg)"
echo "identity start base : $(node scripts/dist-identity.mjs --dist dist-base)"
echo "identity start cured: $(node scripts/dist-identity.mjs --dist dist)"
for i in $(seq 1 $N); do
  node $E/instr/toggle-probe.mjs "$@" --port $BP --windows 1 --out $E/raw/$TAG/base-w$i.jsonl 2>&1 | grep -E "^win " | sed "s/^/  base  w$i: /"
  node $E/instr/toggle-probe.mjs "$@" --port $CP --windows 1 --out $E/raw/$TAG/cured-w$i.jsonl 2>&1 | grep -E "^win " | sed "s/^/  cured w$i: /"
done
echo "identity end base : $(node scripts/dist-identity.mjs --dist dist-base)"
echo "identity end cured: $(node scripts/dist-identity.mjs --dist dist)"
echo "loadavg end:   $(sysctl -n vm.loadavg)"
