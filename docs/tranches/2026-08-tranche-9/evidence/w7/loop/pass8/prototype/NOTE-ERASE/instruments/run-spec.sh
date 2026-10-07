#!/bin/bash
# usage: run-spec.sh <copy> <port> <label> [playwright args…]
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erase8
c=$1 port=$2 label=$3; shift 3
cd $S/$c/web/frontend
L0=$(uptime | sed 's/.*averages: //')
PLAYWRIGHT_BASE_URL=http://127.0.0.1:$port npx playwright test --config .erase8/pw.config.ts "$@" > $S/logs/spec-$label.log 2>&1; x=$?
echo "SPEC $label exit=$x load0=$L0 load1=$(uptime | sed 's/.*averages: //') $(grep -E '^\s+[0-9]+ (passed|failed|skipped|flaky)' $S/logs/spec-$label.log | tr -s ' ' | tr '\n' ' ')" >> $S/logs/spec-summary.txt
