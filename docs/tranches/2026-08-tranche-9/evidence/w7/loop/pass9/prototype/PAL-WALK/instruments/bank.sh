#!/bin/bash
# PAL-WALK pass-9 bank: pass9.diff (on 74a2b5d9) + pass9.delta.on-WAVE.diff (on acde977b) through temporary indexes; every apply --check read bare. No commit, no rm (index entries leave by update-index --force-remove).
S=<lane-scratch>
R=<repo>/.claude/worktrees/wf_308fa864-c94-1
E=<repo>/docs/tranches/2026-08-tranche-9/evidence/w7/loop
OUT=$E/pass9/prototype/PAL-WALK
GD=$(git -C $R rev-parse --git-dir)
export GIT_CEILING_DIRECTORIES=$S
# 1. the tree
export GIT_INDEX_FILE=$S/idx.bank
git -C $R read-tree HEAD; (cd $R && git add -A web/frontend .github)
for p in $(git -C $R diff --cached --name-only HEAD | grep '/\.'); do git -C $R update-index --force-remove -- "$p"; echo "stripped $p"; done
T=$(git -C $R write-tree); echo "tree $T"
git -C $R diff --binary --cached HEAD > $OUT/pass9.diff
git -C $R diff --cached --shortstat HEAD > $S/bank.shortstat
# 2. the on-WAVE tree (acde977b = the WAVE union + homes v2 on-WAVE)
export GIT_INDEX_FILE=$S/idx.bankwave
git --git-dir=$GD --work-tree=$S/wave-tree-b read-tree acde977b
git --git-dir=$GD --work-tree=$S/wave-tree-b add -A .
for p in $(git --git-dir=$GD --work-tree=$S/wave-tree-b diff --cached --name-only acde977b | grep '/\.'); do git --git-dir=$GD --work-tree=$S/wave-tree-b update-index --force-remove -- "$p"; echo "stripped $p"; done
TW=$(git --git-dir=$GD write-tree); echo "wave-tree $TW"
git --git-dir=$GD diff --binary --cached acde977b > $OUT/pass9.delta.on-WAVE.diff
git --git-dir=$GD diff --cached --shortstat acde977b > $S/bankwave.shortstat
unset GIT_INDEX_FILE
echo done
