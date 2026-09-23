#!/bin/zsh
# PAL-WALK pass 5 · the fold re-read: the same instrument on PAL-TIN's tree (five arms) and on this tree (i=0..4), dpr 1/2/3, both engines.
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend || exit 1
for src in tin walk; do
  url=$([ $src = tin ] && echo http://127.0.0.1:4247 || echo http://127.0.0.1:4246)
  for d in 1 2 3; do
    RING_SRC=$src PLAYWRIGHT_BASE_URL=$url WALK_DPR=$d WALK_DIR=./inst WALK_MATCH='ring-core\.spec\.ts$' WALK_OUT=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk5/tr-ring-$src-$d \
      npx playwright test --config .palwalk5/pw.mts > .palwalk5/logs/ring-$src-dpr$d.log 2>&1
    echo "EXIT=$?" >> .palwalk5/logs/ring-$src-dpr$d.log
  done
done
echo RING_DONE > .palwalk5/logs/ring.done
