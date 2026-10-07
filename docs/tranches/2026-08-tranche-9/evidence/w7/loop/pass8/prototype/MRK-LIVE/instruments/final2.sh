#!/bin/bash
N=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklive8b
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend
echo "spec sha $(shasum e2e/focus-ring.spec.ts | cut -c1-40)"
echo "=== G-LIVE-16 x3 both engines load $(sysctl -n vm.loadavg)"
PWOUT=g16b npx playwright test --config $N/pw.lane.mjs -g "G-LIVE-16" --repeat-each=3 > $N/logs/g16-rep2.log 2>&1; echo "G16 EXIT $?"
grep -E '^\s+[0-9]+ (passed|failed|flaky)' $N/logs/g16-rep2.log
grep -ho 'X2b[^|]*' $N/logs/g16-rep2.log | sort | uniq -c
echo "=== EDGE_SABOTAGE=B4 load $(sysctl -n vm.loadavg)"
EDGE_SABOTAGE=B4 PWOUT=sab-B4b npx playwright test --config $N/pw.lane.mjs --project chromium -g "G-LIVE-23 · the ring is visible on all four sides \[reduce\]" > $N/logs/sab-B4b.log 2>&1; echo "SAB B4 EXIT $?"
grep -E 'GREEN \(a hole\)' $N/logs/sab-B4b.log | sed -E 's/.*PLANT (light|dark) ([^:]*):.*/  hole: \1 \2/' | sort -u
echo "=== RECORD whole spec load $(sysctl -n vm.loadavg)"
PWOUT=record2 npx playwright test --config $N/pw.lane.mjs > $N/logs/spec-record2.log 2>&1; echo "RECORD EXIT $?"
grep -E '^\s+[0-9]+ (passed|failed|flaky)' $N/logs/spec-record2.log
grep '✘' $N/logs/spec-record2.log | sed -E 's/.*› (G-LIVE-[^(]*).*/  RED \1/'
echo "load $(sysctl -n vm.loadavg)"
echo FINAL2DONE
