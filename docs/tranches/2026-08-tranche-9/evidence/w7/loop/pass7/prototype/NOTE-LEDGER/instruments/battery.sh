#!/bin/bash
# the pre-return battery, each gate bare (exit read unpiped), tree vs control archive
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
TREE=$1; CTRL=$S/ledger7-base/web/frontend; LOG=$2; : > $LOG
gates=("npm run lint:lanes" "npm run lint:theme-tokens" "npm run lint:sleep" "npm run lint:bands" "npm run lint:verbs" "npm run test:e2e:projects" "node scripts/check-pw-projects.mjs" "npm run lint:ink" "npm run test:font-coverage" "npm run lint:copy" "node scripts/check-copy-register.mjs" "npm run lint:motion" "npm run lint:live-regions" "npm run lint:boundary" "npm run lint:knip" "npx eslint ." "npm run lint")
for g in "${gates[@]}"; do
  (cd $TREE && $g > $S/ledger7-work/bat.out 2>&1); a=$?
  (cd $CTRL && $g > $S/ledger7-work/bat-c.out 2>&1); b=$?
  echo "$g :: tree $a · control $b :: $(tail -1 $S/ledger7-work/bat.out | cut -c1-120)" >> $LOG
done
P6=$S/ledger7-instr
(cd $P6 && node check-property-block.mjs --fe $TREE > $S/ledger7-work/bat.out 2>&1); a=$?; (cd $P6 && node check-property-block.mjs --fe $CTRL > /dev/null 2>&1); b=$?
echo "check-property-block source :: tree $a · control $b :: $(grep -m1 RED $S/ledger7-work/bat.out)" >> $LOG
(cd $P6 && FE=$TREE node undefined-token-census.mjs > $S/ledger7-work/bat.out 2>&1); a=$?; (cd $P6 && FE=$CTRL node undefined-token-census.mjs > /dev/null 2>&1); b=$?
echo "undefined-token census :: tree $a · control $b :: $(grep 'TIMING' $S/ledger7-work/bat.out)" >> $LOG
echo BATTERY-DONE >> $LOG
