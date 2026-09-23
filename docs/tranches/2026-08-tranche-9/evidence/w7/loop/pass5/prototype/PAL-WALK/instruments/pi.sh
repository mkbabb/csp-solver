#!/bin/zsh
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend || exit 1
for eng in chromium webkit; do
PROTO_URL=http://127.0.0.1:4230 HEAD_URL=http://127.0.0.1:4245 PLAYWRIGHT_BASE_URL=http://127.0.0.1:4230 WALK_DPR=1 WALK_DIR=./inst WALK_MATCH='pi\.spec\.ts$' WALK_OUT=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk5/tr-pi-$eng npx playwright test --config .palwalk5/pw.mts --project $eng > .palwalk5/logs/pi-$eng.log 2>&1; echo "EXIT=$?" >> .palwalk5/logs/pi-$eng.log
done
