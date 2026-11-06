#!/bin/zsh
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/ACC-FIVE
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend
O=$S/logs/static.log; : > $O; echo "OPEN $(date +%T) $(uptime | sed 's/.*averages: //')" >> $O
G="$HOME/.claude/guard/guarded --light --"
${=G} npx vue-tsc -b > $S/logs/st-vuetsc.raw 2>&1; echo $? > $S/logs/st-vuetsc.exit; echo "VUE-TSC -b exit $(cat $S/logs/st-vuetsc.exit) lines $(wc -l < $S/logs/st-vuetsc.raw)" >> $O
${=G} npm run typecheck:e2e > $S/logs/st-tsce2e.raw 2>&1; echo $? > $S/logs/st-tsce2e.exit; echo "TYPECHECK:E2E exit $(cat $S/logs/st-tsce2e.exit)" >> $O
for l in lint:copy lint:motion lint:sleep lint:catch lint:theme-tokens lint:ink test:e2e:projects lint:knip; do
  k=${l//:/-}; ${=G} npm run $l > $S/logs/st-$k.raw 2>&1; echo $? > $S/logs/st-$k.exit; echo "$l exit $(cat $S/logs/st-$k.exit) :: $(tail -2 $S/logs/st-$k.raw | tr -s ' ' | tr '\n' ' ' | cut -c1-220)" >> $O
done
${=G} npx eslint e2e/front-rate.spec.ts src/pencil/grid/gridPaths.ts src/pencil/grid/gridPaths.poseFronts.test.ts > $S/logs/st-eslint.raw 2>&1; echo $? > $S/logs/st-eslint.exit; echo "eslint (changed files) exit $(cat $S/logs/st-eslint.exit)" >> $O
${=G} npx prettier --check e2e/front-rate.spec.ts src/pencil/grid/gridPaths.ts src/pencil/grid/gridPaths.poseFronts.test.ts > $S/logs/st-prettier.raw 2>&1; echo $? > $S/logs/st-prettier.exit; echo "prettier --check exit $(cat $S/logs/st-prettier.exit) :: $(tail -3 $S/logs/st-prettier.raw | tr '\n' ' ')" >> $O
echo "DONE $(date +%T) $(uptime | sed 's/.*averages: //')" >> $O
