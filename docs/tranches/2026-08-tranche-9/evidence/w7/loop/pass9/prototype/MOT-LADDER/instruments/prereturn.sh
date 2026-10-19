#!/bin/bash
# prereturn.sh : the pre-return battery BARE on the tree and on a control archive (74a2b5d9). Exits to TSV.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-LADDER
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59
L=$S/logs/prereturn; mkdir -p $L
if [ ! -d $S/ctl ]; then mkdir -p $S/ctl && (cd $W && git archive 74a2b5d9 web/frontend web/relay scripts .github csp-solver/data | tar -x -C $S/ctl); ln -s /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules $S/ctl/web/frontend/node_modules; (cd $S/ctl && git init -q); fi
run() { # $1 arm $2 fe
  O=$L/$1.tsv; printf "gate\texit\n" > $O; cd $2
  for g in lint:eslint lint:knip lint test:font-coverage lint:ink lint:catch lint:theme-selectors lint:theme-tokens lint:tdz lint:lanes lint:sleep lint:motion lint:bands lint:verbs lint:copy lint:live-regions test:support-floor test:e2e:projects lint:boundary; do
    npm run --silent $g > $L/$1-$g.log 2>&1; printf "%s\t%s\n" $g $? >> $O; done
  node scripts/check-pw-projects.mjs > $L/$1-check-pw-projects.log 2>&1; printf "check-pw-projects\t%s\n" $? >> $O
  npx eslint . --max-warnings 0 > $L/$1-eslint.log 2>&1; printf "eslint-max-warnings-0\t%s\n" $? >> $O
  echo DONE >> $O
}
run tree $W/web/frontend
run control $S/ctl/web/frontend
