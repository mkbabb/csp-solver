#!/bin/bash
# critic plant battery: pass-7 plants FIRST (plant8.py), then the critic's K plants. No rm, no set -e.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-ladder8
FE=$S/snap2/web/frontend; PR=$S/pristine/web/frontend
FILES="src/assets/index.css index.html src/games/shared/scene.css src/pencil/sheet/AnswerKeyLaminate.vue src/App.vue src/pencil/grid/HandDrawnGrid/usePathAnimation.ts src/main.ts src/pencil/chrome/GameGallery/GameCard.vue src/games/shared/DigitCell.vue src/pencil/chrome/AttributionCard/AttributionCard.vue"
restore() { for f in $FILES; do cp $PR/$f $FE/$f; done; [ -e $FE/public/plant-l4p.css ] && mv $FE/public/plant-l4p.css $S/trash/plant-l4p.css.$RANDOM; }
OUT=$S/battery.tsv
printf "plant\tapply\tbands\tverbs\tmotion\ttokens\teslint\n" > $OUT
run() { # $1 applier $2 plant $3 eslint(0/1)
  restore
  python3 $S/$1 $FE $2 > $S/pl-$2.apply 2>&1; ap=$?
  cd $FE
  npm run --silent lint:bands > $S/pl-$2.bands 2>&1; b=$?
  npm run --silent lint:verbs > $S/pl-$2.verbs 2>&1; v=$?
  npm run --silent lint:motion > $S/pl-$2.motion 2>&1; m=$?
  npm run --silent lint:theme-tokens > $S/pl-$2.tokens 2>&1; t=$?
  e=-
  if [ "$3" = 1 ]; then npx eslint --max-warnings 0 src/App.vue src/main.ts src/games/shared/DigitCell.vue src/pencil/chrome/AttributionCard/AttributionCard.vue src/pencil/sheet/AnswerKeyLaminate.vue src/pencil/grid/HandDrawnGrid/usePathAnimation.ts > $S/pl-$2.eslint 2>&1; e=$?; fi
  printf "%s\t%s\t%s\t%s\t%s\t%s\t%s\n" $2 $ap $b $v $m $t $e >> $OUT
}
for p in L7a L7f L4 L4p L1 L3; do run plant8.py $p 0; done
for p in L5 L6 M1 M2 M3 E1; do run plant8.py $p 1; done
run plant8.py F1 0
for p in NONE K2 K2b K3 K4 K7 K8 K9 K10 K18; do run plantk.py $p 0; done
for p in K1 K5 K6 K11 K12 K13 K14 K15; do run plantk.py $p 1; done
restore
for f in $FILES; do cmp -s $PR/$f $FE/$f || echo "NOT RESTORED $f" >> $OUT; done
echo DONE >> $OUT
