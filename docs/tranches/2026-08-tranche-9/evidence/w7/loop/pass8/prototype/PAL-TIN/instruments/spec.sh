#!/bin/bash
# PAL-TIN pass 8 · the spec (or a -g filter), one engine per call; exit per engine logged. No rm, no set -e.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tin8
FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2/web/frontend
cd $FE || exit 9
d=${1:-1}; tag=${2:-tree}; g=${3:-}; engines=${ENGINES:-chromium webkit}
for eng in $engines; do
  lg=$S/logs/spec-$tag-$eng-dpr$d.log
  echo "spec sha1 $(shasum e2e/peer-tin.spec.ts | cut -c1-8) · glyph-pop $(shasum e2e/lib/glyph-pop.mjs | cut -c1-8) · load $(uptime | sed 's/.*averages*: //') · siblings $(pgrep -f 'playwright' | wc -l | tr -d ' ')" > $lg
  if [ -n "$g" ]; then
    PLAYWRIGHT_BASE_URL=${BASE:-http://127.0.0.1:4245} TIN_DPR=$d TIN_OUT=$S/pw-out/$tag-$eng-$d npx playwright test --config .paltin8/pw.mts --project $eng -g "$g" >> $lg 2>&1
  else
    PLAYWRIGHT_BASE_URL=${BASE:-http://127.0.0.1:4245} TIN_DPR=$d TIN_OUT=$S/pw-out/$tag-$eng-$d npx playwright test --config .paltin8/pw.mts --project $eng >> $lg 2>&1
  fi
  echo "EXIT=$? · load after $(uptime | sed 's/.*averages*: //')" >> $lg
done
echo done > $S/logs/spec-$tag-dpr$d.done
