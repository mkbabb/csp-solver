#!/bin/bash
# bank.sh : cut the three banks through temporary indexes; every apply --check exit read bare into BANKED.txt. No commit.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-LADDER
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass9/prototype/MOT-LADDER
G=web/frontend/scripts/check-motion-bands.mjs
B=$E/BANKED.txt; cd $W
export GIT_INDEX_FILE=$S/bank.idx
git read-tree HEAD && git add -A && T=$(git write-tree)
git diff --cached --binary --full-index 74a2b5d9 > $E/pass9.diff
git diff --cached --binary --full-index 8c12b15c > $E/pass9-ladder-delta.diff
git diff --cached --name-only 74a2b5d9 > $S/bank-paths.txt
# on-WAVE: acde977b (WAVE acb9c08e + homes.on-WAVE) + the gate as waveP holds it
export GIT_INDEX_FILE=$S/bankw.idx
git read-tree acde977b && BL=$(git hash-object -w $S/waveP/$G) && git update-index --cacheinfo 100644,$BL,$G && TW=$(git write-tree)
git diff --cached --binary --full-index acde977b > $E/pass9.delta.on-WAVE.diff
unset GIT_INDEX_FILE
{
echo "worktree .claude/worktrees/wf_f72f3b5a-83a-59 (the §13 tree, shared with MOT-VERB; LADDER ran first)"
echo "base 74a2b5d9317e7795cee6bf63e861bd44f54ae80e"
echo "opened-at 8c12b15c2d3caa591861d45d8a98be35810e882e (= VERB's pass-8 BANKED tree; no difference declared)"
echo "tree $T"
for f in pass9.diff pass9-ladder-delta.diff pass9.delta.on-WAVE.diff; do echo "$f bytes $(wc -c < $E/$f | tr -d ' ') sha1 $(shasum $E/$f | cut -c1-40)"; done
echo "pass9.diff shortstat $(GIT_INDEX_FILE=$S/bank.idx git diff --cached --shortstat 74a2b5d9)"
echo "pass9-ladder-delta.diff shortstat $(GIT_INDEX_FILE=$S/bank.idx git diff --cached --shortstat 8c12b15c)"
echo "pass9.delta.on-WAVE.diff shortstat $(GIT_INDEX_FILE=$S/bankw.idx git diff --cached --shortstat acde977b) (on-WAVE tree $TW)"
} > $B
ck() { # $1 label $2 base-tree $3 diff
  GIT_INDEX_FILE=$S/ck.idx git read-tree $2; GIT_INDEX_FILE=$S/ck.idx git apply --cached --check $3 2> $S/ck-$1.err; e=$?
  t=-; [ $e = 0 ] && { GIT_INDEX_FILE=$S/ck.idx git apply --cached $3; t=$(GIT_INDEX_FILE=$S/ck.idx git write-tree); }
  echo "apply --check $1 exit $e -> $t $(head -c 160 $S/ck-$1.err | tr '\n' ' ')" >> $B
}
ck pass9.diff@74a2b5d9 74a2b5d9 $E/pass9.diff
ck pass9-ladder-delta.diff@8c12b15c 8c12b15c $E/pass9-ladder-delta.diff
ck pass9.delta.on-WAVE.diff@acde977b acde977b $E/pass9.delta.on-WAVE.diff
ck pass9.delta.on-WAVE.diff@acb9c08e acb9c08e $E/pass9.delta.on-WAVE.diff
ck own-gate.diff@s13-s7-s3:f1c9c3fe f1c9c3fe $S/own.diff
echo "contamination grep (scratchpad|/private/tmp|/tmp/|.claude/t9-scratch|+++ dot-path): $(grep -c -E 'scratchpad|/private/tmp|/tmp/|\.claude/t9-scratch|^\+\+\+ b/(.*/)?\.' $E/pass9.diff $E/pass9-ladder-delta.diff $E/pass9.delta.on-WAVE.diff | tr '\n' ' ')" >> $B
echo BANK-DONE >> $B
