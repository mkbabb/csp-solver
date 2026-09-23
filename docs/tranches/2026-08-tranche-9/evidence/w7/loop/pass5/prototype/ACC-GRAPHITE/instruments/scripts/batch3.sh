#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg5
until grep -q ALLDONE $S/batch2.done; do sleep 5; done
FV='.game-cell:has(input:focus-visible)'
export TREE_ARMS="[[\"second-8.75\",\"$FV .cell-ghost-retrace{stroke-width:8.75 !important}\"]]"
: > $S/batch3.done
for proj in chromium webkit; do
  REGIMES=desk-light,phone-light,desk-dark,phone-dark OUTDIR=$S/ring3 npx playwright test --config .accg5/pw.config.ts --project $proj -g crit- > $S/ring3-$proj.log 2>&1; echo "ring3 $proj $?" >> $S/batch3.done
  OUTDIR=$S/caret npx playwright test --config .accg5/pw.config.ts --project $proj -g caret- > $S/caret-$proj.log 2>&1; echo "caret $proj $?" >> $S/batch3.done
  OUTDIR=$S/deck npx playwright test --config .accg5/pw.config.ts --project $proj -g deck > $S/deck-$proj.log 2>&1; echo "deck $proj $?" >> $S/batch3.done
done
echo ALLDONE >> $S/batch3.done
