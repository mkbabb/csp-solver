#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend
python3 - <<'PY'
import subprocess, sys
sys.argv=['x']
PY
# the remainder arm, re-shot after the plus got its air (arms.py filtered to one arm)
python3 -c "
import runpy,sys
src=open('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/PLR-COUNT/instruments/arms.py').read().replace('for arm, f, old, new, grep in ARMS:','for arm, f, old, new, grep in [a for a in ARMS if a[0]==\"remainder\"]:')
exec(compile(src,'arms-remainder','exec'))
"
export NODE_PATH=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend/node_modules PLRC_DIR=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/count-rig/inst PLRC_PWOUT=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/count-rig/pw-out-b2 PLRC_WORKERS=2
export PROTO_DIST=http://127.0.0.1:4245 CONTROL_DIST=http://127.0.0.1:4243 PROTO_DEV=http://127.0.0.1:4242 CONTROL_DEV=http://127.0.0.1:4244 OUT=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/count-rig/readings
for proj in chromium webkit; do
  npx playwright test --config .plr-count/pw.config.ts --project=$proj p5-census.spec.ts -g "filters|landscape"
  echo "EXIT[census2-$proj]=$?"
  npx playwright test --config .plr-count/pw.config.ts --project=$proj r0-I3-moved.PROPOSED.spec.ts
  echo "EXIT[I3-$proj]=$?"
done
echo "### DONE"
