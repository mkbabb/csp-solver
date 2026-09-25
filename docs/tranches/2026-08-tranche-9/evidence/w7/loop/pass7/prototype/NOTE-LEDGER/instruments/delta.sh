#!/bin/bash
# the pass-7 delta over the pass-6 bank, through a TEMPORARY index (real index untouched)
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46
B=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/prototype/NOTE-LEDGER/pass6.diff
export GIT_INDEX_FILE=$S/ledger7-work/tmp2.idx
cd $W
git read-tree HEAD
git apply --cached --binary $B || exit 9
git add -N web/frontend/scripts/shape
for u in 3 1; do git diff --binary -U$u -- web/frontend > $S/ledger7-work/delta.U$u.diff; done
git diff --shortstat -- web/frontend
git diff --stat -- web/frontend | tail -12
