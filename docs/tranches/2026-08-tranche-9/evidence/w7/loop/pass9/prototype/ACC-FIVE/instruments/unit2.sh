#!/bin/zsh
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/ACC-FIVE
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend
O=$S/logs/unit2.log; : > $O; echo "OPEN $(date +%T) $(uptime | sed 's/.*averages: //')" >> $O
echo "test files by top dir: $(find src scripts -name '*.test.ts' -not -path '*/node_modules/*' | cut -d/ -f1-2 | sort | uniq -c | tr -s ' ' | tr '\n' ';')" >> $O
for d in src/composables src/games src/pencil; do
  n=$(basename $d)
  npx vitest run --config .acc5p9.vitest.mts $d > $S/logs/u2-$n.raw 2>&1; echo $? > $S/logs/u2-$n.exit
  echo "CHUNK $d exit $(cat $S/logs/u2-$n.exit) :: $(grep -E 'Test Files|Tests ' $S/logs/u2-$n.raw | tr -s ' ' | tr '\n' ' ')" >> $O
done
npx vue-tsc -b > $S/logs/u2-vuetsc.raw 2>&1; echo $? > $S/logs/u2-vuetsc.exit; echo "VUE-TSC -b exit $(cat $S/logs/u2-vuetsc.exit) lines $(wc -l < $S/logs/u2-vuetsc.raw)" >> $O
npm run typecheck:e2e > $S/logs/u2-tsce2e.raw 2>&1; echo $? > $S/logs/u2-tsce2e.exit; echo "TYPECHECK:E2E exit $(cat $S/logs/u2-tsce2e.exit)" >> $O
for l in lint:copy lint:motion lint:sleep lint:catch lint:theme-tokens lint:ink test:e2e:projects lint:knip; do
  k=${l//:/-}; npm run $l > $S/logs/u2-$k.raw 2>&1; echo $? > $S/logs/u2-$k.exit; echo "$l exit $(cat $S/logs/u2-$k.exit) :: $(tail -2 $S/logs/u2-$k.raw | tr -s ' ' | tr '\n' ' ' | cut -c1-200)" >> $O
done
npx eslint e2e/front-rate.spec.ts e2e/tally-flash.spec.ts e2e/progress-corridor.spec.ts e2e/node.d.ts src/pencil/grid/gridPaths.ts src/pencil/grid/gridPaths.poseFronts.test.ts src/games/shared/DifficultyTally.vue > $S/logs/u2-eslint.raw 2>&1; echo $? > $S/logs/u2-eslint.exit; echo "eslint (changed files) exit $(cat $S/logs/u2-eslint.exit)" >> $O
npx prettier --check e2e/front-rate.spec.ts src/pencil/grid/gridPaths.ts src/pencil/grid/gridPaths.poseFronts.test.ts src/games/shared/DifficultyTally.vue e2e/node.d.ts > $S/logs/u2-prettier.raw 2>&1; echo $? > $S/logs/u2-prettier.exit; echo "prettier --check (changed product files) exit $(cat $S/logs/u2-prettier.exit)" >> $O
echo "DONE $(date +%T) $(uptime | sed 's/.*averages: //')" >> $O
