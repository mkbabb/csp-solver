#!/bin/zsh
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2/web/frontend || exit 1
for eng in chromium webkit; do
  PI_PROTO=http://127.0.0.1:4248 PI_CONTROL=http://127.0.0.1:4246 PI_PROTO_DEV=http://127.0.0.1:4245 PI_CONTROL_DEV=http://127.0.0.1:4247 TIN_DIR=./inst TIN_MATCH='pi\.spec\.ts$' TIN_OUT=/tmp/tin5-pi-$eng \
    npx playwright test --config .paltin5/pw.mts --project $eng > .paltin5/logs/pi-$eng.log 2>&1
  echo "EXIT=$?" >> .paltin5/logs/pi-$eng.log
done
echo done > .paltin5/logs/pi.done
