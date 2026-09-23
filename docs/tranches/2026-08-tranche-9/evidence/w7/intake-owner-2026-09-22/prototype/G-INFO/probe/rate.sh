#!/bin/sh
P=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-17/docs/tranches/2026-08-tranche-9/evidence/w7/intake-owner-2026-09-22/prototype/G-INFO/probe
O=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-17/web/frontend/.intake/out
cd "$O" || exit 1
uptime
node $P/rate.mjs webkit 10 $O/rate-webkit.json; echo "rate-webkit $?"
uptime
node $P/rate.mjs chromium 10 $O/rate-chromium.json; echo "rate-chromium $?"
uptime
echo DONE
