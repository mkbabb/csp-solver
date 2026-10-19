#!/bin/bash
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-LEDGER
cd $S/lc/web/frontend; echo "load $(uptime | sed 's/.*averages: //') $(date +%T)"
node scripts/check-ink-pressure.mjs > $S/logs/lc-bare.txt 2>&1; echo "collapsed bare exit $? $(date +%T)"
node scripts/check-ink-pressure.mjs --self-test --plants --sabotage-battery > $S/logs/lc-st.txt 2>&1; echo "collapsed self-test+plants+sabotage exit $? $(date +%T)"
echo DONE
