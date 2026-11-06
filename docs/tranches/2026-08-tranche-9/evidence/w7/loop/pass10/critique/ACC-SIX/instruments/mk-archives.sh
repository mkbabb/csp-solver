#!/bin/bash
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-ACC-SIX
L=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45
P=$L/pass10/prototype/ACC-SIX
mk() { d=$S/$1; mkdir -p $d; (cd $W && git archive 74a2b5d9) | tar -x -C $d; cd $d && git init -q && git add -A >/dev/null && git -c user.email=x@x -c user.name=x write-tree; echo "$1 gitdir=$(git rev-parse --absolute-git-dir) base-tree=$(git write-tree)"; }
chk() { cd $S/$1; git apply --check $2; rc=$?; echo "CHECK $1 $(basename $2) exit=$rc gitdir=$(git rev-parse --absolute-git-dir) paths=$(grep -c '^diff --git' $2)"; }
app() { cd $S/$1; git apply $2; rc=$?; git add -A >/dev/null; echo "APPLY $1 $(basename $2) exit=$rc gitdir=$(git rev-parse --absolute-git-dir) tree=$(git write-tree) changed=$(git diff --cached --name-only HEAD 2>/dev/null | wc -l)"; }
mk a-base
chk a-base $P/pass10.diff
chk a-base $P/pass10.delta.on-WAVE.diff
mk a-wave
app a-wave $L/pass9/integrate/WAVE.diff
chk a-wave $P/pass10.delta.on-WAVE.diff
chk a-wave $P/pass10.diff
app a-wave $L/pass10/instruments/homes.on-WAVE.diff
chk a-wave $P/pass10.delta.on-WAVE.diff
mk a-s13
app a-s13 $L/pass9/integrate/s13-s7-s3.diff
chk a-s13 $P/pass10.delta.on-WAVE.diff
chk a-s13 $P/pass10.diff
app a-s13 $L/pass10/instruments/homes.on-WAVE.diff
chk a-s13 $P/pass10.delta.on-WAVE.diff
cd $S/a-base; git apply $L/pass10/instruments/homes.diff; echo "homes on base exit=$?"; git add -A >/dev/null; echo base+homes tree=$(git write-tree); chk a-base $P/pass10.diff
echo DONE
