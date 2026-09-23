#!/bin/zsh
# the WHOLE spec file, both engines, on the lane's dev server (4244), dpr from arg.
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend || exit 1
d=${1:-3}; tag=${2:-tree}
for eng in chromium webkit; do
  PLAYWRIGHT_BASE_URL=${BASE:-http://127.0.0.1:4244} WALK_DPR=$d WALK_OUT=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk5/tr-spec-$tag-$eng \
    npx playwright test --config .palwalk5/pw.mts --project $eng > .palwalk5/logs/spec-$tag-$eng-dpr$d.log 2>&1
  echo "EXIT=$?" >> .palwalk5/logs/spec-$tag-$eng-dpr$d.log
done
echo done > .palwalk5/logs/spec-$tag-dpr$d.done
