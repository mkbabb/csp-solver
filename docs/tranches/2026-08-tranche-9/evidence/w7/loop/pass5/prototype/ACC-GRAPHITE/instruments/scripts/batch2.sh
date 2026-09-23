#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg5
FV='.game-cell:has(input:focus-visible)'
OUT="$FV .cell-ghost svg{transform:scale(1.1) !important;transform-origin:50% 50% !important}$FV .cell-ghost-path,$FV .cell-ghost-retrace{stroke-width:10 !important}"
export TREE_ARMS="[[\"second-9\",\"$FV .cell-ghost-retrace{stroke-width:9 !important}\"],[\"second-8.5\",\"$FV .cell-ghost-retrace{stroke-width:8.5 !important}\"],[\"outset-110\",\"$OUT\"]]"
export CHIP_ARMS="[[\"outset-110\",\"$OUT\"],[\"inset-92\",\"$FV .cell-ghost svg{transform:scale(.92) !important;transform-origin:50% 50% !important}$FV .cell-ghost-path,$FV .cell-ghost-retrace{stroke-width:13.9 !important}\"]]"
for proj in chromium webkit; do
  REGIMES=desk-light,phone-light OUTDIR=$S/ring2 npx playwright test --config .accg5/pw.config.ts --project $proj -g crit- > $S/ring2-$proj.log 2>&1; echo "ring2 $proj $?" >> $S/batch2.done
  OUTDIR=$S/chip npx playwright test --config .accg5/pw.config.ts --project $proj -g chip-393 > $S/chip-$proj.log 2>&1; echo "chip $proj $?" >> $S/batch2.done
done
echo ALLDONE >> $S/batch2.done
