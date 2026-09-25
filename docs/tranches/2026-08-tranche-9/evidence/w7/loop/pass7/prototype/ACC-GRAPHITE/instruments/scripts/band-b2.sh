#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg7
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend
for proj in chromium webkit; do
  GATE=1 OUTDIR=$S/band-stamped-b2 TREE_URL=http://127.0.0.1:4235 CONTROL_URL=http://127.0.0.1:4236 MATCH=band.crit.ts npx playwright test --config .accg7/pw.config.ts --project $proj > $S/logs/band-stamped-b2-$proj.log 2>&1
  echo "EXIT $proj $? load $(sysctl -n vm.loadavg)" >> $S/logs/band-stamped-b2-$proj.log
done
B=.accg7/band.sh
$B lr4-b2 GATE=1 STAT=lr RIGS=desk,desk1440,phone,phone812
$B lrdpr2-b2 GATE=1 STAT=lr RIGS=desk,phone DPR=2
$B narrow-b2 STAT=lr RIGS=desknarrow
echo ALL > $S/logs/band-b2.done
