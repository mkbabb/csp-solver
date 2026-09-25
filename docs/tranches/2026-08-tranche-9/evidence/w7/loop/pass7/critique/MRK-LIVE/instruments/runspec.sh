#!/bin/bash
# usage: runspec.sh <port> <label> [grep]
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklivecrit7
cd $S/copy/web/frontend
echo "load $(sysctl -n vm.loadavg) spec $(shasum e2e/focus-ring.spec.ts | cut -c1-8) port $1 label $2 grep '${3:-ALL}'"
if [ -n "$3" ]; then G=(-g "$3"); else G=(); fi
PASS7_INSTRUMENTS=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/instruments PWOUT=$2 PLAYWRIGHT_BASE_URL=http://127.0.0.1:$1 npx playwright test --config .crit/pw.config.ts focus-ring.spec.ts "${G[@]}" --reporter=list > $S/logs/spec-$2.log 2>&1
echo "EXIT $?"
grep -E '✘|✓|passed|failed|Error:' $S/logs/spec-$2.log | cut -c1-200
echo "load $(sysctl -n vm.loadavg)"
