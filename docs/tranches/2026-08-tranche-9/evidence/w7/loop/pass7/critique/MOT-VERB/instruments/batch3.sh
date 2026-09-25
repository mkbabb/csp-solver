#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verbcrit7
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend
P=ATMuMDM0NjA4OTEyNjAyMTk1MzQ4MTk4MzAyNTY3ODU5NzYxNDIzMDI2ODAzNzkxNzEzOTI0ODU2OTAxNTM3MjA0Mjg3NDE5NjM1MzA1Mjg2MTcw
cd $S/inst
for eng in chromium webkit; do TS=95,122,150 P=$P node flip-painted.mjs $eng tree=http://127.0.0.1:4236 control=http://127.0.0.1:4237; echo "EXIT-fine-$eng $?"; done
cd $W; uptime
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4236 npx playwright test -c .verbcrit7/pw.config.ts .verbcrit7/pi7crit.spec.ts; echo "EXIT-pi $?"
echo ALLDONE3
