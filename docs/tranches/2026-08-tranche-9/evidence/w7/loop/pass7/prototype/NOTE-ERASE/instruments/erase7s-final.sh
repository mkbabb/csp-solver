#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad; F=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend
cd $F; echo "FINAL sha1 MarginNote=$(shasum src/pencil/chrome/MarginNote.vue | cut -c1-12) spec=$(shasum e2e/affordances.spec.ts | cut -c1-12) served=$(curl -s http://127.0.0.1:4248/ | grep -oE 'index-[A-Za-z0-9_-]+\.js' | head -1) load=$(uptime | sed 's/.*averages: //')"
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4248 npx playwright test --config .erase7/pw.e2e.config.ts > $S/erase7s-logs/spec-final.log 2>&1; echo "SPEC final exit=$? :: $(grep -E '^\s+[0-9]+ (passed|failed)' $S/erase7s-logs/spec-final.log | tr -s ' ' | tr '\n' ' ')"
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4247 npx playwright test --config .erase7/pw.e2e.config.ts -g "drop clock" > $S/erase7s-logs/spec-plant2.log 2>&1; echo "DROP plant (same run) exit=$? :: $(grep -E '^\s+[0-9]+ (passed|failed)' $S/erase7s-logs/spec-plant2.log | tr -s ' ' | tr '\n' ' ')"
mkdir -p $S/erase7s-out-final; OUT=$S/erase7s-out-final npx playwright test --config .erase7/pw.probe.config.ts glyph.probe.ts > $S/erase7s-logs/glyph-final.log 2>&1; echo "GLYPH final exit=$?"
echo "FINALDONE load=$(uptime | sed 's/.*averages: //')"
