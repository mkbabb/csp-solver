#!/bin/bash
# cut the tree's full diff (tracked + untracked product paths) through a TEMPORARY index; the real index is not touched
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46
OUT=${1:-$S/ledger7-work/full.diff}
export GIT_INDEX_FILE=$S/ledger7-work/tmp.idx
cd $W
git read-tree HEAD
git add -A web/frontend/src web/frontend/scripts web/frontend/e2e web/frontend/package.json
git diff --cached --binary HEAD > $OUT
git diff --cached --shortstat HEAD
echo "sha1 $(shasum $OUT | cut -c1-40) bytes $(wc -c < $OUT)"
