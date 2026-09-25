#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklive-p7; W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend; I6=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments; P7=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/prototype/MRK-LIVE/instruments
sleep 8
echo "served: $(curl -s http://127.0.0.1:4246/ | grep -o 'index-[A-Za-z0-9_-]*\.js') load $(sysctl -n vm.loadavg)"
node $I6/check-property-block.mjs --fe $W --dist $S/dist-lane2 --served http://127.0.0.1:4246 > $S/logs/cpb2.log 2>&1; echo "cpb served EXIT $?"; tail -3 $S/logs/cpb2.log | cut -c1-200
cd $W
PWOUT=fc2 PLAYWRIGHT_BASE_URL=http://127.0.0.1:4246 npx playwright test --config .mrklive7/pw.p7.config.ts filter-census.spec.ts > $S/logs/fc2-light.log 2>&1; echo "fc light EXIT $?"; grep -E 'passed|failed' $S/logs/fc2-light.log
PWOUT=fc2d PLAYWRIGHT_BASE_URL=http://127.0.0.1:4246 npx playwright test --config .mrklive7/pw.dark.config.ts filter-census.spec.ts > $S/logs/fc2-dark.log 2>&1; echo "fc dark EXIT $?"; grep -E 'passed|failed' $S/logs/fc2-dark.log; grep -oE 'crayon-heart[^"]{0,30}' $S/logs/fc2-dark.log | sort | uniq -c
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend
node $P7/pi-ring-d.mjs http://127.0.0.1:4246 http://127.0.0.1:4239 > $S/logs/pi-d2.log 2>&1; echo "pi-d EXIT $?"
PRM=1 node $P7/pi-wholedom.mjs http://127.0.0.1:4246 http://127.0.0.1:4239 $S/pi-wholedom2.txt > $S/logs/pi-wholedom2.log 2>&1; echo "pi-wholedom EXIT $?"
echo ALLDONE
