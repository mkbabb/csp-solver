#!/bin/bash
shopt -s nullglob
L=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/PLR-COUNT/logs
SEEN=$L/../watch.seen; touch $SEEN
while true; do
  for f in $L/*.exit $L/*.load $L/chain-ch.log $L/chain-2.log $L/gates-stk.exit; do
    k="$(basename $f):$(wc -l < $f | tr -d ' ')"
    grep -qxF "$k" $SEEN || { echo "$k" >> $SEEN; echo "$(basename $f): $(tail -1 $f | cut -c1-160)"; }
  done
  sleep 20
done
