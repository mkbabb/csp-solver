#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg5
export TREE_ARMS='[["second-11",".game-cell:has(input:focus-visible) .cell-ghost-retrace{stroke-width:11 !important}"],["second-10",".game-cell:has(input:focus-visible) .cell-ghost-retrace{stroke-width:10 !important}"],["inset-84",".game-cell:has(input:focus-visible) .cell-ghost svg{transform:scale(.84) !important;transform-origin:50% 50% !important}.game-cell:has(input:focus-visible) .cell-ghost-path,.game-cell:has(input:focus-visible) .cell-ghost-retrace{stroke-width:16.2 !important}"]]'
for proj in chromium webkit; do
  OUTDIR=$S/ring npx playwright test --config .accg5/pw.config.ts --project $proj -g crit- > $S/ring-$proj.log 2>&1
  echo "$proj exit $?" >> $S/ring-battery.done
done
echo ALLDONE >> $S/ring-battery.done
