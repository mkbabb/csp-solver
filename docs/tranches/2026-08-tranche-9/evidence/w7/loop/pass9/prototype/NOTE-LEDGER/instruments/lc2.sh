#!/bin/bash
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-LEDGER
cd $S/lc2/web/frontend; echo "load $(uptime | sed 's/.*averages: //') $(date +%T)"
node scripts/check-ink-pressure.mjs > $S/logs/lc2-bare.txt 2>&1; echo "collapsed (final bytes) bare exit $? $(date +%T)"
node scripts/check-ink-pressure.mjs --self-test --plants > $S/logs/lc2-st.txt 2>&1; echo "collapsed (final bytes) self-test+plants exit $? · plants ok $(grep -c 'plant ok' $S/logs/lc2-st.txt) $(date +%T)"
echo DONE
