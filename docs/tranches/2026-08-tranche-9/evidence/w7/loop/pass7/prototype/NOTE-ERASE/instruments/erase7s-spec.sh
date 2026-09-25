#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad; F=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend
cd $F; echo "spec sha1=$(shasum e2e/affordances.spec.ts | cut -c1-12) load=$(uptime | sed 's/.*averages: //')"
for arm in "tree 4248" "control 4249"; do set -- $arm
  PLAYWRIGHT_BASE_URL=http://127.0.0.1:$2 npx playwright test --config .erase7/pw.e2e.config.ts > $S/erase7s-logs/spec-$1.log 2>&1; EX=$?
  echo "SPEC $1 ($(curl -s http://127.0.0.1:$2/ | grep -oE 'index-[A-Za-z0-9_-]+\.js' | head -1)) exit=$EX :: $(grep -E '^\s+[0-9]+ (passed|failed|skipped|flaky)' $S/erase7s-logs/spec-$1.log | tr -s ' ' | tr '\n' ' ') load=$(uptime | sed 's/.*averages: //')"
  grep -E '✘' $S/erase7s-logs/spec-$1.log | sed 's/^ *//' | cut -c1-170
done
echo SPECDONE
