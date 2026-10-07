#!/bin/bash
# spec8.sh <label> <port> [pw args] : a product spec from the L8 copy against a served dist
P=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger8/p8
L=$1; PT=$2; shift 2
cd $P/${COPY:-L8}/web/frontend
echo "load $(uptime | sed 's/.*averages: //') $(date +%T) served $(curl -s http://127.0.0.1:$PT/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1) spec-sha $(shasum e2e/note-reserve.spec.ts | cut -c1-12)" > $P/q/spec-$L.log
PLAYWRIGHT_BASE_URL=http://127.0.0.1:$PT npx playwright test --config .l8probe/pw.spec.config.ts "$@" >> $P/q/spec-$L.log 2>&1
echo "exit=$? load $(uptime | sed 's/.*averages: //') $(date +%T)" >> $P/q/spec-$L.log
