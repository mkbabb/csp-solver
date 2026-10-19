#!/bin/bash
# union.sh : extract the on-WAVE tree (babea79d + this pass's on-WAVE delta, written by bank.sh) and run the
# pre-return battery there, B6's history through the §13 tree's gitdir (read-only), then the unit battery's vitest.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-VERB
G=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.git/worktrees/wf_f72f3b5a-83a-59
WT=$(grep '^on-WAVE tree' /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass9/prototype/MOT-VERB/BANKED.txt | awk '{print $3}')
[ -e $S/union ] && mv $S/union $S/trash/union.$(date +%s)
mkdir -p $S/union && cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59 && git archive $WT | tar -x -C $S/union
ln -s /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules $S/union/web/frontend/node_modules
echo "union tree $WT extracted $(date +%T)" > $S/logs/union.txt
$S/bin/prereturn.sh union $S/union/web/frontend $G
cd $S/union/web/frontend
npx vitest run src/pencil > $S/logs/union-vitest-pencil.log 2>&1; printf "vitest src/pencil\t%s\n" $? >> $S/logs/prereturn/union.tsv
npx vue-tsc --noEmit -p tsconfig.e2e.json > $S/logs/union-tsc-e2e.log 2>&1; printf "typecheck:e2e\t%s\n" $? >> $S/logs/prereturn/union.tsv
echo UNION-DONE >> $S/logs/prereturn/union.tsv
