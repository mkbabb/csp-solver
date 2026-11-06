#!/bin/bash
# multi.sh <label> <eng> <spec> [grep] -- <what1> <what2> ...: ONE spec x ONE project per guarded call, over several served
# builds in turn (each its own preview, identity asserted, stopped). Run as: guarded [--exclusive webkit] -- multi.sh ...
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/ACC-SIX
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend
label=$1; eng=$2; spec=$3; g=$4; shift 5
for what in "$@"; do
  rig=${what%%-*}; case $rig in tree|control) R=$W;; *) R=$S/arch/$rig/web/frontend;; esac
  port=$([ $what = control ] && echo 4250 || echo 4237)
  if [ -n "$g" ]; then
    $S/inner.sh $what $port $label-$what-$eng -- env PWOUT=$S/pw/$label-$what-$eng bash -c "cd $R && npx playwright test -c .acc6p10/pw.config.ts e2e/$spec --project=$eng --grep \"$g\""
  else
    $S/inner.sh $what $port $label-$what-$eng -- env PWOUT=$S/pw/$label-$what-$eng bash -c "cd $R && npx playwright test -c .acc6p10/pw.config.ts e2e/$spec --project=$eng"
  fi
done
echo MULTI-DONE $label $eng
