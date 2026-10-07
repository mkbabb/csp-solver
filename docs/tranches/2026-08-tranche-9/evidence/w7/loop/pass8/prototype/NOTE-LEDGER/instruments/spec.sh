#!/bin/bash
# spec.sh <copy root> <tag> <port> [extra pw args] : run the copy's scratch PW config against a served dist
P=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger8/p8
C=$1; T=$2; PT=$3; shift 3
cd $C/web/frontend
echo "load $(uptime | sed 's/.*averages: //') $(date +%T) served $(curl -s http://127.0.0.1:$PT/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1)" > $P/logs/spec-$T.log
PLAYWRIGHT_BASE_URL=http://127.0.0.1:$PT npx playwright test --config .ledger8p/pw.config.mts "$@" >> $P/logs/spec-$T.log 2>&1
echo "exit=$? load $(uptime | sed 's/.*averages: //') $(date +%T)" >> $P/logs/spec-$T.log
