#!/bin/bash
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-LEDGER
LOG=$S/logs/prop.txt; : > $LOG
for arm in tree union control; do
  case $arm in tree) FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend; D=$S/dist-tree;;
    union) FE=$S/wL/web/frontend; D=$S/dist-union;;
    control) FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend; D=$FE/dist;; esac
  cd $FE
  node $S/bin/check-property-block.mjs --fe . > $S/logs/prop-$arm-src.txt 2>&1; a=$?
  node $S/bin/check-property-block.mjs --fe . --dist $D > $S/logs/prop-$arm-dist.txt 2>&1; b=$?
  env FE=$PWD node $S/bin/undefined-token-census.mjs > $S/logs/prop-$arm-census.txt 2>&1; c=$?
  echo "$arm cpb-source $a · cpb-dist $b · census $c · load $(uptime | sed 's/.*averages: //')" >> $LOG
done; echo DONE >> $LOG
