#!/bin/bash
# cut pass9.diff from the work tree through a temporary index; product paths only
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MRK-LIVE
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass9/prototype/MRK-LIVE
cd $W || exit 9
cp "$(git rev-parse --git-dir)/index" $S/tidx.bank
GIT_INDEX_FILE=$S/tidx.bank git add -A -- web/frontend/src web/frontend/e2e web/frontend/scripts web/frontend/knip.json
echo "TREE $(GIT_INDEX_FILE=$S/tidx.bank git write-tree)"
GIT_INDEX_FILE=$S/tidx.bank git diff --cached --binary 74a2b5d9 > $E/pass9.diff
echo "UNTRACKED-OUTSIDE $(git ls-files --others --exclude-standard | grep -v -E '^web/frontend/(src|e2e|scripts)/' | tr '\n' ' ')"
GIT_INDEX_FILE=$S/tidx.bank git diff --cached --shortstat 74a2b5d9
wc -c < $E/pass9.diff; shasum $E/pass9.diff
