#!/bin/bash
# union.sh — the §13+§7+§3 union with the homes and LADDER's pass-8 delta, through a temporary index; then VERB's delta on it.
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59
export GIT_INDEX_FILE=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb8/r2/idx-union
git read-tree 74a2b5d9
git apply --cached --binary /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/integrate/s13-s7-s3.diff; echo "s13-s7-s3 $? $(git write-tree)"
git apply --cached --binary /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass8/instruments/homes.on-s13-s7-s3.diff; echo "homes-on-union $? $(git write-tree)"
git apply --cached --binary /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass8/prototype/MOT-LADDER/pass8.delta.on-s13-s7-s3.diff; echo "ladder-on-union $? $(git write-tree)"
