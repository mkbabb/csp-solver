#!/bin/bash
# bank2.sh <n>: fresh git-inited archives; apply-check pass10.diff on 74a2b5d9 (bare and +homes v3), the on-WAVE delta cut on
# WAVE+homes v3 and checked there, on bare WAVE, on s13+homes and bare s13. Every apply line prints its git dir and path count.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/ACC-SIX
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45
D=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop
E=$D/pass10/prototype/ACC-SIX; H=$D/pass10/instruments; n=$1; F=$S/fresh$n
mkdir -p $F; cd $W
for d in b74 b74h wave waveh wavehc s13 s13h; do mkdir -p $F/$d; git archive 74a2b5d9 | tar -x -C $F/$d; (cd $F/$d && git init -q && git add -A); done
ap() { (cd $F/$1 && git apply $3 $2 > $F/$1.apply.log 2>&1; e=$?; echo "  apply $4 on $1: exit $e · gitdir $(git rev-parse --absolute-git-dir) · paths $(git apply --numstat $2 | wc -l | tr -d ' ')"; git add -A; echo "  $1 tree $(git write-tree)"); }
ap b74h $H/homes.diff "" homes.diff
for d in wave waveh wavehc; do ap $d $D/pass9/integrate/WAVE.diff --binary WAVE.diff; done
for d in s13 s13h; do ap $d $D/pass9/integrate/s13-s7-s3.diff --binary s13-s7-s3.diff; done
for d in waveh wavehc s13h; do ap $d $H/homes.on-WAVE.diff "" homes.on-WAVE; done
for d in b74 b74h; do (cd $F/$d && git apply --check $E/pass10.diff; echo "CHECK pass10.diff on $d: exit $? · gitdir $(git rev-parse --absolute-git-dir) · paths $(git apply --numstat $E/pass10.diff | wc -l | tr -d ' ')"); done
# the on-WAVE delta: the lane's step (pass-9 tree + homes v3 -> the tree) applied on WAVE+homes v3, then cut there
(cd $F/waveh && git apply --binary $S/step10.diff; echo "  step on waveh: exit $?"; git add -A; T=$(git write-tree); echo "  waveh+step tree $T"; git diff --binary 72b7ad67ef8cf43589d276621478cd11283fb180 $T > $E/pass10.delta.on-WAVE.diff; echo "pass10.delta.on-WAVE.diff $(wc -c < $E/pass10.delta.on-WAVE.diff) B sha1 $(shasum $E/pass10.delta.on-WAVE.diff | cut -c1-40) $(git diff --shortstat 72b7ad67 $T)")
for d in wavehc wave s13h s13; do (cd $F/$d && git apply --check $E/pass10.delta.on-WAVE.diff; echo "CHECK on-WAVE delta on $d: exit $? · gitdir $(git rev-parse --absolute-git-dir) · paths $(git apply --numstat $E/pass10.delta.on-WAVE.diff | wc -l | tr -d ' ')"); done
echo BANK2-DONE
