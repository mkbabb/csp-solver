#!/bin/zsh
# PAL-WALK pass 5 · the 144-hand core-median sweep at the chair's pair, one engine, dpr 1/2/3.
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend || exit 1
eng=$1
for d in 2 1 3; do
  PLAYWRIGHT_BASE_URL=http://127.0.0.1:4246 WALK_SWEEP=1 WALK_DPR=$d WALK_OUT=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk5/tr-$eng-$d \
    npx playwright test --config .palwalk5/pw.mts --project $eng -g "§B" > .palwalk5/logs/sweep-$eng-dpr$d.log 2>&1
  echo "EXIT=$?" >> .palwalk5/logs/sweep-$eng-dpr$d.log
done
echo SWEEP_DONE > .palwalk5/logs/sweep-$eng.done
