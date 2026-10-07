#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critic-plrself8
cd $S/ct2/web/frontend
for g in lint:copy test:e2e:projects typecheck:e2e; do npm run -s $g > $S/logs/g.$g.log 2>&1; echo "GATE $g exit $? $(date +%T) LOAD $(sysctl -n vm.loadavg)"; done
npx eslint e2e/player-mark.spec.ts src/pencil/chrome/PlayerMark/PlayerMark.vue e2e/lib/edge-bands.d.mts --max-warnings 0 > $S/logs/g.eslint.log 2>&1; echo "GATE eslint(3 files) exit $?"
echo GATES-DONE
