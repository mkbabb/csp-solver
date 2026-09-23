#!/bin/bash
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend
CTL=$SP/nlcrit6-ctl/web/frontend; L=$SP/nlcrit6-logs/battery; mkdir -p $L
for g in lint:lanes lint:theme-tokens lint:sleep test:e2e:projects lint:copy lint:ink lint:motion lint:live-regions test:font-coverage lint:eslint lint; do
  (cd $W && npm run -s $g > $L/tree-$g.log 2>&1); a=$?
  (cd $CTL && npm run -s $g > $L/ctl-$g.log 2>&1); b=$?
  echo "$g tree=$a control=$b"
done
(cd $W && node scripts/check-pw-projects.mjs > $L/tree-cpp.log 2>&1); a=$?; (cd $CTL && node scripts/check-pw-projects.mjs > $L/ctl-cpp.log 2>&1); b=$?; echo "check-pw-projects(bare) tree=$a control=$b"
(cd $W && node scripts/check-copy-register.mjs > $L/tree-ccr.log 2>&1); a=$?; (cd $CTL && node scripts/check-copy-register.mjs > $L/ctl-ccr.log 2>&1); b=$?; echo "check-copy-register(bare) tree=$a control=$b"
(cd $W && npx vue-tsc --noEmit -p tsconfig.json > $L/tree-vuetsc.log 2>&1); a=$?; (cd $CTL && npx vue-tsc --noEmit -p tsconfig.json > $L/ctl-vuetsc.log 2>&1); b=$?; echo "vue-tsc tree=$a control=$b"
echo BATTERY-DONE
