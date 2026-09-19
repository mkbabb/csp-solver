#!/usr/bin/env bash
# The estate's roster-touching specs, run ONCE against this lane's server, both engines, as a
# background shell script with its log polled (the stall law). Never inline.
set -u
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-51/web/frontend || exit 2
LOG=/tmp/claude-504/logs/estate-battery.log
: > "$LOG"
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4241 npx playwright test \
  --config /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-51/.plr-probe/estate.config.ts \
  join-language.spec.ts join-language-prm.spec.ts multiplayer.spec.ts access.spec.ts \
  follow-still-authorship.spec.ts presence.spec.ts session-substrate.spec.ts \
  player-mark.spec.ts >> "$LOG" 2>&1
echo "ESTATE EXIT $?" >> "$LOG"
