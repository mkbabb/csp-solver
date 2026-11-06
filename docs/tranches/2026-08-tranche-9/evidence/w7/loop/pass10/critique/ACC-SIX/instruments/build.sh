#!/bin/bash
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-ACC-SIX
U=$S/a-wave/web/frontend; T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend
for what in "$@"; do rig=${what%%-*}; p=${what#*-}; R=$U; [ $rig = tree ] && R=$T
  (cd $R && PLANT=$p npx vite build --config $S/b-$rig.mts) > $S/logs/build-$what.log 2>&1; rc=$?
  js=$(ls $S/dist/$what/assets 2>/dev/null | grep '^index-.*\.js$'); css=$(ls $S/dist/$what/assets 2>/dev/null | grep '^index-.*\.css$')
  echo "BUILD $what exit=$rc js=$js css=$css $(stat -f %z $S/dist/$what/assets/$css 2>/dev/null) B hits=$(grep -c PLANT-HIT $S/logs/build-$what.log)"
done; echo BUILD-DONE
