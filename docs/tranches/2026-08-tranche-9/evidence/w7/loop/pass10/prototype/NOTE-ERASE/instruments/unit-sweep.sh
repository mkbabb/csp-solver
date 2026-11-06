#!/bin/bash
# unit-sweep.sh <label> <frontend dir> - the whole vitest battery chunked by top-level directory, --maxWorkers=2, each chunk its own guarded call.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE
n=$1 F=$2; O=$S/logs/unit-$n.txt; : > $O
cd $F
for d in $(find src -name '*.test.ts' -not -path '*/node_modules/*' | awk -F/ '{print $1"/"$2"/"$3}' | sort -u); do
  ~/.claude/guard/guarded --light --timeout 10 -- npx vitest run --maxWorkers=2 $d > $S/logs/unit-$n-$(echo $d | tr / _).log 2>&1; x=$?
  echo "$d exit=$x $(grep -E 'Test Files|Tests ' $S/logs/unit-$n-$(echo $d | tr / _).log | tr -s ' ' | tr '\n' ' ')" >> $O
done
echo "FIN $(date +%T)" >> $O
