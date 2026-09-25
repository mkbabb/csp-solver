#!/bin/bash
# pre-return battery, bare, tree snapshot vs control archive; exit codes only
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
I=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments
for arm in tree ctl; do
  if [ $arm = tree ]; then D=$S/ladder7crit-snap/web/frontend; else D=$S/ladder7crit-ctl/web/frontend; fi
  cd $D
  for s in lint:bands lint:verbs lint:motion lint:copy lint:lanes lint:theme-tokens lint:sleep test:e2e:projects lint:knip; do
    npm run --silent $s > $S/ladder7crit-bat-$arm-${s/:/_}.log 2>&1; echo "$arm $s $?"
  done
  node scripts/check-pw-projects.mjs > /dev/null 2>&1; echo "$arm check-pw-projects $?"
  FE=$D node $I/undefined-token-census.mjs > $S/ladder7crit-bat-$arm-census.log 2>&1; echo "$arm census $?"
  node $I/check-property-block.mjs --fe $D > $S/ladder7crit-bat-$arm-propblock.log 2>&1; echo "$arm check-property-block(source) $?"
  npm run --silent lint > $S/ladder7crit-bat-$arm-lint.log 2>&1; echo "$arm npm-run-lint $?"
  npx eslint . > $S/ladder7crit-bat-$arm-eslint.log 2>&1; echo "$arm eslint. $?"
done
echo DONE
