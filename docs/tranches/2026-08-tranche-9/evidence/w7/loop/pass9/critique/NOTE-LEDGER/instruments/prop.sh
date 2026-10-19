#!/bin/zsh
LOG=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-NOTE-LEDGER/logs/prop.txt; : > $LOG
for arm in tree union; do
  if [ $arm = tree ]; then FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-NOTE-LEDGER/t9/web/frontend; D=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-NOTE-LEDGER/dist-tree; else FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-NOTE-LEDGER/waveE/web/frontend; D=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-NOTE-LEDGER/dist-waveE; fi
  cd $FE
  node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-NOTE-LEDGER/bin/check-property-block.mjs --fe . > /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-NOTE-LEDGER/logs/prop-$arm-src.txt 2>&1; a=$?
  node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-NOTE-LEDGER/bin/check-property-block.mjs --fe . --dist $D > /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-NOTE-LEDGER/logs/prop-$arm-dist.txt 2>&1; b=$?
  env FE=$PWD node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-NOTE-LEDGER/bin/undefined-token-census.mjs > /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-NOTE-LEDGER/logs/prop-$arm-census.txt 2>&1; c=$?
  echo "$arm cpb-source $a · cpb-dist $b · census $c · load $(uptime | sed 's/.*averages: //')" >> $LOG
done; echo DONE >> $LOG
