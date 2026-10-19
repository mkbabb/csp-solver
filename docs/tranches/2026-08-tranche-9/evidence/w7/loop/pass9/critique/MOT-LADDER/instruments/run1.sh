S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-MOT-LADDER
uptime > $S/logs/run1.load
cd $S/bank/web/frontend; node scripts/check-motion-bands.mjs --self-test > $S/logs/bank-bands.log 2>&1; echo "bank-bands $?" >> $S/logs/run1.exits
cd $S/wave/web/frontend; node scripts/check-motion-bands.mjs --self-test > $S/logs/wave-bands.log 2>&1; echo "wave-bands $?" >> $S/logs/run1.exits
cd $S/bank/web/frontend; node scripts/check-motion-bands.mjs --sabotage-battery > $S/logs/bank-sab.log 2>&1; echo "bank-sab $?" >> $S/logs/run1.exits
uptime >> $S/logs/run1.load; echo DONE >> $S/logs/run1.exits
