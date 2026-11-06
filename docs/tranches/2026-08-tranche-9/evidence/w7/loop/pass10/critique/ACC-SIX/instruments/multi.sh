#!/bin/bash
# multi.sh <label> <eng> <spec> <grep|-> -- <what...> : ONE spec x ONE project per guarded call, rigs in turn
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-ACC-SIX
U=$S/a-wave/web/frontend
label=$1; eng=$2; spec=$3; g=$4; shift 5
for what in "$@"; do
  if [ "$g" = "-" ]; then
    $S/inner.sh $what $label-$what-$eng -- bash -c "cd $U && npx playwright test -c .critsix/pw.config.ts e2e/$spec --project=$eng --workers=1"
  else
    $S/inner.sh $what $label-$what-$eng -- bash -c "cd $U && npx playwright test -c .critsix/pw.config.ts e2e/$spec --project=$eng --workers=1 --grep '$g'"
  fi
done
echo MULTI-DONE $label $eng
