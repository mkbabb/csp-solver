#!/bin/zsh
# PAL-TIN pass 6 · the WHOLE spec file (or a -g filter), one engine per call; exit per engine logged.
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2/web/frontend || exit 1
d=${1:-1}; tag=${2:-tree}; g=${3:-}
for eng in ${=ENGINES:-chromium webkit}; do
  if [ -n "$g" ]; then extra=(-g "$g"); else extra=(); fi
  PLAYWRIGHT_BASE_URL=${BASE:-http://127.0.0.1:4245} TIN_DPR=$d TIN_OUT=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/paltin6-out/tr-$tag-$eng \
    npx playwright test --config .paltin6/pw.mts --project $eng "${extra[@]}" > .paltin6/logs/spec-$tag-$eng-dpr$d.log 2>&1
  echo "EXIT=$?" >> .paltin6/logs/spec-$tag-$eng-dpr$d.log
done
echo done > .paltin6/logs/spec-$tag-dpr$d.done
