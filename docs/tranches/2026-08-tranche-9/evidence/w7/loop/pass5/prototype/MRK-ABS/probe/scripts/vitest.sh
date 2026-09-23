#!/bin/zsh
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-39/web/frontend
LOG=$S/logs/vitest.log; : > $LOG
for d in $(ls -d src/* src/games/* | grep -v '^src/games$'); do
  n=$(find $d -name '*.test.ts' 2>/dev/null | wc -l | tr -d ' '); [[ $n == 0 ]] && continue
  echo "== $d ($n files)" >> $LOG; npx vitest run $d > $S/logs/vitest-chunk.log 2>&1; rc=$?
  grep -E 'Test Files|Tests ' $S/logs/vitest-chunk.log >> $LOG; echo "EXIT[$d] $rc" >> $LOG
done
echo VITEST-DONE >> $LOG
