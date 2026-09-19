#!/bin/zsh
# T9-W8 C02 VERIFY r1 — the non-author's reading harness. Same shape as the author's
# instr/interleave.sh: one window per invocation of A5's banked toggle-probe.mjs (copied
# VERBATIM from evidence/w8/attribution/A5/ — diff exit 0 against the author's copy too),
# alternating BASE(:4252) CURED(:4253) so host drift falls on both arms equally.
set -e
TAG=$1; N=$2; BP=$3; CP=$4; shift 4
V=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C02/verify-r1
P=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C02/instr/toggle-probe.mjs
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-bake/web/frontend
mkdir -p $V/raw/$TAG
cd $W
echo "SET $TAG · windows $N/arm · base :$BP · cured :$CP · args $@"
echo "loadavg start: $(sysctl -n vm.loadavg)"
