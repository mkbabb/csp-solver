#!/bin/zsh
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad; L=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MRK-ABS/logs/final
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-39/web/frontend
$S/battery.sh lane $W; cp $S/logs/battery-lane.log $L/battery-lane.log
$S/battery.sh control $S/ctl/web/frontend; cp $S/logs/battery-control.log $L/battery-control-74a2b5d9.log
( cd $W && npx prettier --check --config .prettierrc.json src/ scripts/ > $L/prettier-lane-src-scripts.log 2>&1; echo "EXIT $?" >> $L/prettier-lane-src-scripts.log )
$S/vitest.sh; cp $S/logs/vitest.log $L/vitest-lane.log
echo FINAL-BATTERY-DONE >> $L/battery-lane.log
