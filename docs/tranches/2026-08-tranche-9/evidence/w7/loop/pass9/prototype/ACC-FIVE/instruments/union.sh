#!/bin/zsh
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/ACC-FIVE
GD=$(cat $S/worktree-gitdir.txt); cd $S/wave9/web/frontend; O=$S/logs/union.log; : > $O
echo "OPEN $(date +%T) $(uptime | sed 's/.*averages: //') tree ff4cac9f (WAVE acb9c08e + homes.on-WAVE + this delta)" >> $O
GIT_DIR=$GD GIT_WORK_TREE=$S/wave9 node scripts/check-motion-bands.mjs --self-test > $S/logs/un-bands.raw 2>&1; echo $? > $S/logs/un-bands.exit; echo "lint:bands exit $(cat $S/logs/un-bands.exit) :: $(tail -1 $S/logs/un-bands.raw | cut -c1-160)" >> $O
cat > .acc5u.vitest.mts <<EOF
import base from './vitest.config.ts'
export default { ...base, cacheDir: '$S/vite-cache-union' }
EOF
npx vitest run --config .acc5u.vitest.mts src/pencil/grid > $S/logs/un-unit.raw 2>&1; echo $? > $S/logs/un-unit.exit; echo "unit src/pencil/grid exit $(cat $S/logs/un-unit.exit) :: $(grep -E 'Test Files|Tests ' $S/logs/un-unit.raw | tr -s ' ' | tr '\n' ' ')" >> $O
npx vitest run --config .acc5u.vitest.mts src/games/shared > $S/logs/un-unit2.raw 2>&1; echo $? > $S/logs/un-unit2.exit; echo "unit src/games/shared exit $(cat $S/logs/un-unit2.exit) :: $(grep -E 'Test Files|Tests ' $S/logs/un-unit2.raw | tr -s ' ' | tr '\n' ' ')" >> $O
npx vue-tsc -b > $S/logs/un-vuetsc.raw 2>&1; echo $? > $S/logs/un-vuetsc.exit; echo "vue-tsc -b exit $(cat $S/logs/un-vuetsc.exit) lines $(wc -l < $S/logs/un-vuetsc.raw)" >> $O
npx vue-tsc --noEmit -p tsconfig.e2e.json > $S/logs/un-tsce2e.raw 2>&1; echo $? > $S/logs/un-tsce2e.exit; echo "typecheck:e2e exit $(cat $S/logs/un-tsce2e.exit) :: $(grep -c 'error TS' $S/logs/un-tsce2e.raw) errors, in: $(grep -o '^e2e/[^(]*' $S/logs/un-tsce2e.raw | sort -u | tr '\n' ' ')" >> $O
for l in lint:motion lint:copy lint:sleep; do k=${l//:/-}; npm run $l > $S/logs/un-$k.raw 2>&1; echo $? > $S/logs/un-$k.exit; echo "$l exit $(cat $S/logs/un-$k.exit)" >> $O; done
mv .acc5u.vitest.mts $S/trash/acc5u.vitest.mts.$(date +%H%M%S)
echo "DONE $(date +%T) $(uptime | sed 's/.*averages: //')" >> $O
