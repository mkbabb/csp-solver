#!/bin/zsh
# the D10 row re-read on FINAL bytes (after the eslint cure of the row's loop), with its born-RED; unit file + typecheck.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/ACC-FIVE
FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend
F=$FE/src/pencil/grid/gridPaths.ts; P=$S/plants; T=http://127.0.0.1:4236; O=$S/logs/final.log
echo "OPEN $(date +%T) $(uptime | sed 's/.*averages: //')" >> $O
cmp -s $F $P/gridPaths.clean.ts || { echo "TREE NOT CLEAN" >> $O; exit 1; }
zsh $S/run.sh fin-d10-tree $T 1 front-rate.spec.ts D10-stallrun "chromium webkit"
cp $P/gp.p8file.ts $F; sleep 5
zsh $S/run.sh fin-d10-p8file $T 1 front-rate.spec.ts D10-stallrun "chromium webkit"
cp $P/gridPaths.clean.ts $F; sleep 5; cmp -s $F $P/gridPaths.clean.ts && echo "RESTORED $(date +%T)" >> $O
zsh $S/run.sh fin-d10-tree2 $T 1 front-rate.spec.ts D10-stallrun "chromium webkit"
cd $FE
npx vitest run --config .acc5p9.vitest.mts src/pencil/grid > $S/logs/fin-unit.raw 2>&1; echo $? > $S/logs/fin-unit.exit
echo "unit src/pencil/grid exit $(cat $S/logs/fin-unit.exit) :: $(grep -E 'Test Files|Tests ' $S/logs/fin-unit.raw | tr -s ' ' | tr '\n' ' ')" >> $O
npm run typecheck:e2e > $S/logs/fin-tsce2e.raw 2>&1; echo $? > $S/logs/fin-tsce2e.exit; echo "typecheck:e2e exit $(cat $S/logs/fin-tsce2e.exit)" >> $O
npx vue-tsc -b > $S/logs/fin-vuetsc.raw 2>&1; echo $? > $S/logs/fin-vuetsc.exit; echo "vue-tsc -b exit $(cat $S/logs/fin-vuetsc.exit)" >> $O
npx eslint e2e/front-rate.spec.ts e2e/tally-flash.spec.ts e2e/progress-corridor.spec.ts e2e/node.d.ts src/pencil/grid/gridPaths.ts src/pencil/grid/gridPaths.poseFronts.test.ts src/games/shared/DifficultyTally.vue > $S/logs/fin-eslint.raw 2>&1; echo $? > $S/logs/fin-eslint.exit; echo "eslint exit $(cat $S/logs/fin-eslint.exit)" >> $O
npx prettier --check src/pencil/grid/gridPaths.ts src/pencil/grid/gridPaths.poseFronts.test.ts src/games/shared/DifficultyTally.vue > $S/logs/fin-prettier.raw 2>&1; echo $? > $S/logs/fin-prettier.exit; echo "prettier --check exit $(cat $S/logs/fin-prettier.exit)" >> $O
echo "DONE $(date +%T) $(uptime | sed 's/.*averages: //')" >> $O
