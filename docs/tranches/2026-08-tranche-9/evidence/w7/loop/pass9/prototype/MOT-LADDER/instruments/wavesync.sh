#!/bin/bash
# wavesync.sh : re-cut LADDER's own gate delta (vs 8c12b15c) and land it on the WAVE+homes scratch (waveP)
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-LADDER
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59
G=web/frontend/scripts/check-motion-bands.mjs
cd $W
GIT_INDEX_FILE=$S/cur.idx git read-tree HEAD && GIT_INDEX_FILE=$S/cur.idx git add -A && GIT_INDEX_FILE=$S/cur.idx git write-tree > $S/cur-tree.txt
GIT_INDEX_FILE=$S/cur.idx git diff --cached --binary --full-index 8c12b15c -- $G > $S/own.diff
blob=$(GIT_INDEX_FILE=$S/wave.idx git ls-files -s $G | awk '{print $2}')
git cat-file -p $blob > $S/waveP/$G
cd $S/waveP && git apply $S/own.diff; echo "wavesync apply=$? tree=$(cat $S/cur-tree.txt) own=$(wc -c < $S/own.diff)"
python3 $S/bin/wave-extra.py $S/waveP/$G
