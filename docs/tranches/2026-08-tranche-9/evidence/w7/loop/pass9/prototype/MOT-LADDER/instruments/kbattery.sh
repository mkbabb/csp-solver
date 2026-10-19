#!/bin/bash
# kbattery.sh <snap> <tag> : the pass-8 critic's K plants on <snap>, CI invocations, exits bare to a TSV. No rm, no set -e.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-LADDER
FE=$S/$1/web/frontend; TAG=$2; PR=$S/pristine-$1; L=$S/logs/k-$TAG; mkdir -p $L $PR
FILES="src/assets/index.css src/App.vue src/main.ts src/games/shared/DigitCell.vue src/pencil/chrome/AttributionCard/AttributionCard.vue"
for f in $FILES; do mkdir -p $PR/$(dirname $f); [ -e $PR/$f ] || cp $FE/$f $PR/$f; done
restore() { for f in $FILES; do cp $PR/$f $FE/$f; done; }
OUT=$L/battery.tsv
printf "plant\tapply\tbands\tverbs\tmotion\ttokens\teslint\tprettier\n" > $OUT
run() { # $1 applier $2 plant
  restore
  python3 $S/bin/$1 $FE $2 > $L/$2.apply 2>&1; ap=$?
  cd $FE
  npm run --silent lint:bands > $L/$2.bands 2>&1; b=$?
  npm run --silent lint:verbs > $L/$2.verbs 2>&1; v=$?
  npm run --silent lint:motion > $L/$2.motion 2>&1; m=$?
  npm run --silent lint:theme-tokens > $L/$2.tokens 2>&1; t=$?
  npx eslint --max-warnings 0 src/App.vue src/main.ts src/games/shared/DigitCell.vue src/pencil/chrome/AttributionCard/AttributionCard.vue > $L/$2.eslint 2>&1; e=$?
  npx prettier --check --config .prettierrc.json $FILES > $L/$2.prettier 2>&1; p=$?
  printf "%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n" $2 $ap $b $v $m $t $e $p >> $OUT
}
for p in NONE K1 K2 K2b K3 K4 K5 K6 K7 K8 K9 K10 K11 K12 K13 K14 K15 K16 K17 K18 K23; do run plantk.py $p; done
for p in K7r K7s; do run plantk2.py $p; done
restore
for f in $FILES; do cmp -s $PR/$f $FE/$f || echo "NOT RESTORED $f" >> $OUT; done
echo DONE >> $OUT
