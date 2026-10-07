#!/bin/bash
# probe.sh <label> <ARM> <ARM_PORT> <MODES> [pw args] : the L8 probe against a served arm + the control (:4250)
P=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger8/p8
L=$1; export ARM=$2 ARM_PORT=$3 MODES=$4 CTL_PORT=4250 PANELS=$P/panels; shift 4
cd $P/${COPY:-L8}/web/frontend
echo "load $(uptime | sed 's/.*averages: //') $(date +%T) arm $(curl -s http://127.0.0.1:$ARM_PORT/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1) ctl $(curl -s http://127.0.0.1:4250/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1)" > $P/q/probe-$L.log
npx playwright test --config .l8probe/pw.probe.config.ts "$@" >> $P/q/probe-$L.log 2>&1
echo "exit=$? load $(uptime | sed 's/.*averages: //') $(date +%T)" >> $P/q/probe-$L.log
