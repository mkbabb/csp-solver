#!/bin/bash
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
L=$1
run() {
  local n=$1 d=$2 arm=$3; shift 3
  (cd $d && "$@" > $L/bat2-$n-$arm.log 2>&1)
  local rc=$?
  echo "$n $arm $rc"
}
for arm in tree ctl; do
  if [ $arm = tree ]; then D=$W; else D=$C; fi
  run copy $D $arm node scripts/check-copy-register.mjs --self-test
  run lanes $D $arm node scripts/check-lane-membership.mjs --self-test
  run themetokens $D $arm node scripts/check-theme-tokens.mjs --self-test
  run sleep $D $arm node scripts/check-sleep-lint.mjs --self-test
  run pwproj-self $D $arm node scripts/check-pw-projects.mjs --self-test
  run pwproj $D $arm node scripts/check-pw-projects.mjs
  run motion $D $arm npm run -s lint:motion
  run bands $D $arm npm run -s lint:bands
  run verbs $D $arm npm run -s lint:verbs
  run eslint $D $arm npx eslint .
  run prettier $D $arm npm run -s lint
done
