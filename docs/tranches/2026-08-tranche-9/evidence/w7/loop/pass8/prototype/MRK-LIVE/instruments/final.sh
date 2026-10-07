#!/bin/bash
N=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklive8b
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend
echo "=== FINAL whole spec, sha $(shasum e2e/focus-ring.spec.ts | cut -c1-40) load $(sysctl -n vm.loadavg)"
PWOUT=record npx playwright test --config $N/pw.lane.mjs > $N/logs/spec-record.log 2>&1; echo "RECORD EXIT $?"
grep -E '^\s+[0-9]+ (passed|failed|flaky)' $N/logs/spec-record.log
grep '✘' $N/logs/spec-record.log | sed -E 's/.*› (G-LIVE-[^(]*).*/  RED \1/'
for c in B1 B2 B3 B4; do
  echo "=== EDGE_SABOTAGE=$c G-LIVE-23 [reduce] chromium load $(sysctl -n vm.loadavg)"
  EDGE_SABOTAGE=$c PWOUT=sab-$c npx playwright test --config $N/pw.lane.mjs --project chromium -g "G-LIVE-23 · the ring is visible on all four sides \[reduce\]" > $N/logs/sab-$c.log 2>&1; echo "SAB $c EXIT $?"
  grep -E 'GREEN \(a hole\)' $N/logs/sab-$c.log | sed -E 's/.*PLANT (light|dark) ([^:]*):.*/  hole: \1 \2/' | sort -u
done
echo FINALDONE
