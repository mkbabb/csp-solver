#!/bin/bash
# pw.sh <label> <spec|probe> <port-or-modes...> : runs from the ts copy; logs to logs/pw-<label>.txt
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/lcrit8
LB=$1; K=$2; shift 2; LOG=$SP/logs/pw-$LB.txt
cd $SP/ts/web/frontend
if [ $K = spec ]; then PT=$1; shift; echo "load $(uptime | sed 's/.*averages: //') $(date +%T) served $(curl -s http://127.0.0.1:$PT/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1) spec-sha $(shasum e2e/note-reserve.spec.ts | cut -c1-12)" > $LOG
  PLAYWRIGHT_BASE_URL=http://127.0.0.1:$PT npx playwright test --config .lcrit8/pw.spec.config.ts note-reserve.spec.ts "$@" >> $LOG 2>&1; echo "exit=$? load $(uptime | sed 's/.*averages: //') $(date +%T)" >> $LOG
else export MODES=$1; shift; echo "load $(uptime | sed 's/.*averages: //') $(date +%T) arm $(curl -s http://127.0.0.1:4249/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1) ctl $(curl -s http://127.0.0.1:4250/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1)" > $LOG
  npx playwright test --config .lcrit8/pw.probe.config.ts "$@" >> $LOG 2>&1; echo "exit=$? load $(uptime | sed 's/.*averages: //') $(date +%T)" >> $LOG; fi
