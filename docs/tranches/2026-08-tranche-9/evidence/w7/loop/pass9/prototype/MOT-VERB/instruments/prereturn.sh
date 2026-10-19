#!/bin/bash
# prereturn.sh <arm> <fe-dir> [GIT_DIR, lint:bands only (B6 reads 74a2b5d9 through it, read-only)] : the pre-return battery BARE; exits to <arm>.tsv, each from its own run
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-VERB
L=$S/logs/prereturn; mkdir -p $L; O=$L/$1.tsv; printf "gate\texit\n" > $O; cd $2
for g in lint:eslint lint:knip lint test:font-coverage lint:ink lint:catch lint:theme-selectors lint:theme-tokens lint:tdz lint:lanes lint:sleep lint:motion lint:bands lint:verbs lint:copy lint:live-regions test:support-floor test:e2e:projects lint:boundary; do
  if [ "$g" = lint:bands ] && [ -n "$3" ]; then GIT_DIR=$3 npm run --silent $g > $L/$1-$g.log 2>&1; else npm run --silent $g > $L/$1-$g.log 2>&1; fi
  printf "%s\t%s\n" $g $? >> $O; done
node scripts/check-pw-projects.mjs > $L/$1-check-pw-projects.log 2>&1; printf "check-pw-projects\t%s\n" $? >> $O
npx eslint . --max-warnings 0 > $L/$1-eslint.log 2>&1; printf "eslint-max-warnings-0\t%s\n" $? >> $O
echo DONE >> $O
