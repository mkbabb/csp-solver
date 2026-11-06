#!/bin/bash
# bank.sh <outdir> - cut pass10.diff (tree, homes stripped) and pass10.delta.on-WAVE.diff (u10f vs WAVE+homes v3) through temporary indexes; no commit.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47
O=$1; mkdir -p $O; L=$S/logs/bank.txt; : > $L
HOMES=$(grep '^diff --git' $S/homes.v3.diff | sed 's/.* b\///')
# 1 · the tree
cd $W; export GIT_INDEX_FILE=$S/bank.index
git read-tree 74a2b5d9; git apply --cached $S/homes.v3.diff; echo "base+homes v3 tree $(git write-tree) (homes.diff apply --cached exit $?)" >> $L
git add -A web/frontend; git rm -r -q --cached --ignore-unmatch web/frontend/.erase10 web/frontend/.erase10-build.mts
echo "stray (non-product) paths: $(git diff --cached --name-only 74a2b5d9 | grep -v '^web/frontend/\(src\|e2e\|scripts\)/\|^web/frontend/knip.json$' | wc -l | tr -d ' ')" >> $L
TREE=$(git write-tree); echo "tree (tree + homes v3) $TREE" >> $L
for h in $HOMES; do a=$(git ls-files -s $h | awk '{print $2}'); b=$(GIT_INDEX_FILE=$S/v3check.index git ls-files -s $h | awk '{print $2}'); [ "$a" = "$b" ] || echo "RESIDUAL HOME EDIT $h" >> $L; done
echo "residual home edits: $(grep -c RESIDUAL $L)" >> $L
# pass10.diff = 74a2b5d9 -> tree, the 13 home paths EXCLUDED (applied by sha, never carried)
git diff --cached --binary 74a2b5d9 -- web/frontend $(for h in $HOMES; do printf ":(exclude)%s " $h; done) > $O/pass10.diff
echo "pass10.diff sha1 $(shasum $O/pass10.diff | cut -c1-40) bytes $(wc -c < $O/pass10.diff | tr -d ' ') $(git diff --cached --shortstat 74a2b5d9 -- web/frontend $(for h in $HOMES; do printf ":(exclude)%s " $h; done))" >> $L
git diff --cached --name-only 74a2b5d9 -- web/frontend $(for h in $HOMES; do printf ":(exclude)%s " $h; done) > $S/bank-paths.txt
unset GIT_INDEX_FILE
# 2 · the on-WAVE delta, in u10f's own repo: 72b7ad67 (WAVE + homes v3, archive tree) -> u10f's worktree
U=$S/copies/u10f; cd $U; export GIT_INDEX_FILE=$S/u10f-base.index
git read-tree 243fbf573f125376314dbc88e55dfba0376e3936; git apply --cached $S/WAVE9.diff; a1=$?; git apply --cached $S/homes.on-WAVE.v3.diff; a2=$?
WB=$(git write-tree); echo "WAVE + homes v3 base, built in u10f's repo: $WB (WAVE.diff --cached exit $a1, homes.on-WAVE --cached exit $a2; want 72b7ad67)" >> $L
export GIT_INDEX_FILE=$S/u10f-bank.index
git read-tree $WB; git add -A web/frontend; git rm -r -q --cached --ignore-unmatch web/frontend/.erase10 web/frontend/.erase10-build.mts web/frontend/node_modules
echo "u10f gitdir $(git rev-parse --absolute-git-dir); stray: $(git diff --cached --name-only $WB | grep -v '^web/frontend/\(src\|e2e\|scripts\)/' | wc -l | tr -d ' ')" >> $L
echo "u10f tree $(git write-tree)" >> $L
git diff --cached --binary $WB > $O/pass10.delta.on-WAVE.diff
echo "on-WAVE sha1 $(shasum $O/pass10.delta.on-WAVE.diff | cut -c1-40) bytes $(wc -c < $O/pass10.delta.on-WAVE.diff | tr -d ' ') $(git diff --cached --shortstat $WB)" >> $L
git diff --cached --name-only $WB >> $L
unset GIT_INDEX_FILE
echo FIN >> $L
