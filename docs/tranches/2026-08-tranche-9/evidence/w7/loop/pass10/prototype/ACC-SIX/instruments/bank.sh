#!/bin/bash
# bank.sh: cut pass10.diff (74a2b5d9 + homes v3 -> the tree) and pass10.delta.on-WAVE.diff (954bbbab + homes.on-WAVE
# -> + the lane's pass-10 step), through temporary indexes; apply-check each on fresh git-inited archives. no rm, no set -e, no commit.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/ACC-SIX
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45
D=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop
E=$D/pass10/prototype/ACC-SIX; H=$D/pass10/instruments
mkdir -p $E; cd $W
export GIT_INDEX_FILE=$S/bank-home.index; git read-tree 74a2b5d9; git apply --cached $H/homes.diff; HB=$(git write-tree); echo "base 74a2b5d9+homes v3 = $HB"
export GIT_INDEX_FILE=$S/bank.index; git read-tree 74a2b5d9; git add -A -- . ':(exclude)web/frontend/.acc6p10'; P10=$(git write-tree); echo "tree $P10"
git diff --binary $HB $P10 > $E/pass10.diff; echo "pass10.diff $(wc -c < $E/pass10.diff) B sha1 $(shasum $E/pass10.diff | cut -c1-40)"; git diff --shortstat $HB $P10; git diff --name-only $HB $P10 > $S/bank-paths.txt
git diff --binary df69e7d8ef7f354ba68341fa019a3b9210b328c2 $P10 > $S/step10.diff; echo "step (pass-9 tree + homes v3 -> tree) $(git diff --shortstat df69e7d8 $P10)"
unset GIT_INDEX_FILE
echo $P10 > $S/bank.tree; echo $HB > $S/bank-home.tree
echo BANK-TREE-DONE
