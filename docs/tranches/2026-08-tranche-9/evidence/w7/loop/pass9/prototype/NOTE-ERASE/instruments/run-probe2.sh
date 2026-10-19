#!/bin/bash
# run-probe2.sh <frontend dir> <probe file> <label> [args] — probe + config into <fe>/.erase9; exit written to logs/probe-<label>.exit
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-ERASE
F=$1 pf=$2 label=$3; shift 3; mkdir -p $F/.erase9
cp $S/instruments/pw.probe.config.ts $F/.erase9/pw.probe.config.ts; cp $pf $F/.erase9/
L0=$(uptime | sed 's/.*averages: //')
(cd $F && npx playwright test --config .erase9/pw.probe.config.ts "$@" > $S/logs/probe-$label.log 2>&1); x=$?
echo "PROBE $label fe=$F exit=$x load0=$L0 load1=$(uptime | sed 's/.*averages: //')" > $S/logs/probe-$label.exit
