#!/bin/bash
# CRITIC pass-8 CTRL-RULE battery: each gate bare, exit recorded; tree (bank bytes, out-of-tree) | control (git archive 74a2b5d9). No set -e, no rm.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/rulecrit8
OUT=$S/battery; mkdir -p $OUT; : > $OUT/summary.txt
echo "START $(date +%T) load $(sysctl -n vm.loadavg)" >> $OUT/summary.txt
for arm in tree ctrl; do
  if [ $arm = tree ]; then D=$S/cum/web/frontend; DIST=$S/dist-cum; URL=http://127.0.0.1:4231; else D=$S/ctl/web/frontend; DIST=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend/dist; URL=http://127.0.0.1:4252; fi
  cd $D
  for g in lint:lanes lint:theme-tokens lint:sleep lint:motion lint:copy lint:ink test:e2e:projects lint; do
    npm run -s $g > $OUT/$arm-${g//:/_}.log 2>&1; echo "$arm $g EXIT $?" >> $OUT/summary.txt
  done
  node scripts/check-pw-projects.mjs > $OUT/$arm-check-pw-projects.log 2>&1; echo "$arm check-pw-projects EXIT $?" >> $OUT/summary.txt
  node scripts/check-copy-register.mjs > $OUT/$arm-check-copy-register.log 2>&1; echo "$arm check-copy-register EXIT $?" >> $OUT/summary.txt
  node $S/probe/check-property-block.mjs --fe $D --dist /nonexistent-rulecrit8 > $OUT/$arm-pb-src.log 2>&1; echo "$arm property-block src EXIT $?" >> $OUT/summary.txt
  node $S/probe/check-property-block.mjs --fe $D --dist $DIST --served $URL > $OUT/$arm-pb-served.log 2>&1; echo "$arm property-block served EXIT $?" >> $OUT/summary.txt
  FE=$D node $S/probe/undefined-token-census.mjs > $OUT/$arm-utc.log 2>&1; echo "$arm undefined-token-census EXIT $?" >> $OUT/summary.txt
  [ -f scripts/shape-census.mjs ] && { node scripts/shape-census.mjs --self-test > $OUT/$arm-shape-selftest.log 2>&1; echo "$arm shape-census self-test EXIT $?" >> $OUT/summary.txt; }
  npx eslint . --max-warnings 0 --ignore-pattern '.rulecrit8/**' > $OUT/$arm-eslint.log 2>&1; echo "$arm eslint(max-warnings 0) EXIT $?" >> $OUT/summary.txt
  npx knip > $OUT/$arm-knip.log 2>&1; echo "$arm knip EXIT $?" >> $OUT/summary.txt
done
echo "DONE $(date +%T) load $(sysctl -n vm.loadavg)" >> $OUT/summary.txt
