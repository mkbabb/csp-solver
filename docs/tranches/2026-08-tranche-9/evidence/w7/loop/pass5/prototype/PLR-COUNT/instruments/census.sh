#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend
export NODE_PATH=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend/node_modules PLRC_DIR=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/count-rig/inst PLRC_PWOUT=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/count-rig/pw-out-census PLRC_WORKERS=3
export PROTO_DIST=http://127.0.0.1:4245 CONTROL_DIST=http://127.0.0.1:4243 PROTO_DEV=http://127.0.0.1:4242 CONTROL_DEV=http://127.0.0.1:4244 OUT=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/count-rig/readings
for proj in chromium webkit; do
  npx playwright test --config .plr-count/pw.config.ts --project=$proj p5-census.spec.ts
  echo "EXIT[census-$proj]=$?"
done
echo "### DONE"
