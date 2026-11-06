#!/bin/bash
# bank.sh : cut pass10.diff (tree vs 74a2b5d9, temp index, --binary) + pass10.delta.on-WAVE.diff (stk -> uni), apply-check
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/PLR-COUNT
TREE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52
O=$S/bank; mkdir -p $O; R=$O/bank.txt; : > $R
cd $TREE
export GIT_INDEX_FILE=$S/idx-bank; git read-tree HEAD; git add -A web/frontend; T=$(git write-tree); unset GIT_INDEX_FILE
X=$(sed "s|^|:(exclude)|" $S/home.paths | tr "\n" " ")
git diff --binary 74a2b5d9 $T -- web/frontend $X > $O/pass10.diff
echo "tree $T frontend $(git rev-parse "${T}:web/frontend")" >> $R
echo "pass10.diff sha1 $(shasum $O/pass10.diff | cut -c1-40) bytes $(wc -c < $O/pass10.diff | tr -d ' ') $(git diff --shortstat 74a2b5d9 $T -- web/frontend $X)" >> $R
git diff --name-only 74a2b5d9 $T -- web/frontend $X > $O/pass10.paths
echo "home paths in pass10.diff: $(grep -cxF -f $S/home.paths $O/pass10.paths)" >> $R
echo "non-product paths: $(grep -vc '^web/frontend/' $O/pass10.paths)" >> $R
# the on-WAVE delta: uni (stk + this lane's pass-10 bytes) against stk (954bbbab + homes v3 on-WAVE + SELF's on-WAVE delta)
cd $S/ac/uni && git add -A && U=$(git write-tree)
K=b399b8a25a0fc80ddc2b6f9d98a3509210d4fe77   # stk = 8c46d9de archive + SELF on-WAVE delta (written before uni was copied from it)
cd $S/ac/uni && git diff --binary $K $U > $O/pass10.delta.on-WAVE.diff
echo "delta base stk tree $K (frontend $(git rev-parse "${K}:web/frontend")) -> uni $U (frontend $(git rev-parse "${U}:web/frontend"))" >> $R
echo "delta sha1 $(shasum $O/pass10.delta.on-WAVE.diff | cut -c1-40) bytes $(wc -c < $O/pass10.delta.on-WAVE.diff | tr -d ' ') $(git diff --shortstat $K $U)" >> $R
for f in $O/pass10.diff $O/pass10.delta.on-WAVE.diff $O/../*.md; do :; done
echo "grep: $(grep -c 'scratchpad\|/private/tmp\|/tmp/\|\.claude/t9-scratch' $O/pass10.diff) $(grep -c 'scratchpad\|/private/tmp\|/tmp/\|\.claude/t9-scratch' $O/pass10.delta.on-WAVE.diff) dotdir+++: $(grep -c '^+++ b/\.\|^+++ b/.*/\.[a-z]' $O/pass10.diff) $(grep -c '^+++ b/\.\|^+++ b/.*/\.[a-z]' $O/pass10.delta.on-WAVE.diff)" >> $R
cat $R
