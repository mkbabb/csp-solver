#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-ladder8
cd $S/snap/web/frontend
npm run --silent lint:bands > $S/base-bands.log 2>&1; echo "bands $?" >> $S/base.out
node scripts/check-motion-bands.mjs --sabotage-battery > $S/base-gsab.log 2>&1; echo "gate-sabotage $?" >> $S/base.out
node scripts/shape-census.mjs --self-test > $S/base-lib.log 2>&1; echo "lib-selftest $?" >> $S/base.out
node scripts/shape-census.mjs --sabotage-battery > $S/base-lsab.log 2>&1; echo "lib-sabotage $?" >> $S/base.out
echo DONE >> $S/base.out
