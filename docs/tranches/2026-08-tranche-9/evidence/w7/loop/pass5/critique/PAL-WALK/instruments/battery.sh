#!/bin/zsh
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit
out=$SP/logs/battery.txt; : > $out
for arm in tree control; do
  if [ $arm = tree ]; then cd $SP/tree/web/frontend; else cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend; fi
  for s in lint:lanes lint:theme-tokens lint:sleep test:e2e:projects lint:arcs lint:copy lint:motion lint:theme-selectors lint:ink lint:catch lint:live-regions; do
    npm run -s $s > $SP/logs/b-$arm-$s.log 2>&1; echo "$arm $s exit $?" >> $out
  done
  node scripts/check-pw-projects.mjs > $SP/logs/b-$arm-pwproj.log 2>&1; echo "$arm check-pw-projects exit $?" >> $out
  node scripts/check-copy-register.mjs > $SP/logs/b-$arm-copyreg.log 2>&1; echo "$arm check-copy-register(bare) exit $?" >> $out
  npm run -s lint > $SP/logs/b-$arm-prettier.log 2>&1; echo "$arm prettier(npm run lint) exit $?" >> $out
  npx eslint . > $SP/logs/b-$arm-eslint.log 2>&1; echo "$arm eslint . exit $?" >> $out
  npx knip > $SP/logs/b-$arm-knip.log 2>&1; echo "$arm knip exit $?" >> $out
done
echo BATTERY_DONE >> $out
