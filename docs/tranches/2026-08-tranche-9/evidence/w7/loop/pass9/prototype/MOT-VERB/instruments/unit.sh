#!/bin/bash
# unit.sh : vue-tsc (app + e2e) and vitest chunked by src directory; exits to a TSV (each read from its own run)
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-VERB
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend
L=$S/logs/unit; mkdir -p $L; O=$L/unit.tsv; printf "row\texit\ttests\n" > $O; cd $W
npx vue-tsc -b > $L/vue-tsc-b.log 2>&1; printf "vue-tsc -b\t%s\n" $? >> $O
npx vue-tsc --noEmit -p tsconfig.e2e.json > $L/tsc-e2e.log 2>&1; printf "typecheck:e2e\t%s\n" $? >> $O
for d in src/games src/pencil src/composables; do
  npx vitest run $d > $L/vitest-$(echo $d | tr / _).log 2>&1; printf "vitest %s\t%s\t%s\n" $d $? "$(grep -E 'Tests +[0-9]' $L/vitest-$(echo $d | tr / _).log | tail -1 | tr -s ' ')" >> $O
done
echo DONE >> $O
