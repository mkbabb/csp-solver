#!/bin/bash
# ktree.sh <snap> <tag> [full-plants...] : the critic's K plants, the TREE half of lint:bands (the gate without --self-test)
# for every plant, and CI's whole `npm run lint:bands` for the named plants. Exits bare to a TSV. No rm, no set -e.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-LADDER
FE=$S/$1/web/frontend; TAG=$2; shift 2; FULL=" $* "; PR=$S/pristine-${FE#$S/}; PR=$S/pristine-$(echo $FE | sed "s#$S/##; s#/web/frontend##"); L=$S/logs/kt-$TAG; mkdir -p $L
FILES="src/assets/index.css src/App.vue src/main.ts src/games/shared/DigitCell.vue src/pencil/chrome/AttributionCard/AttributionCard.vue"
restore() { for f in $FILES; do cp $PR/$f $FE/$f; done; }
OUT=$L/battery.tsv; printf "plant\tapply\ttree-half\tlint:bands(CI)\tload\n" > $OUT
run() { restore; python3 $S/bin/$1 $FE $2 > $L/$2.apply 2>&1; ap=$?; cd $FE
  node scripts/check-motion-bands.mjs --list > $L/$2.tree 2>&1; t=$?; c=-
  case "$FULL" in *" $2 "*) npm run --silent lint:bands > $L/$2.bands 2>&1; c=$?;; esac
  printf "%s\t%s\t%s\t%s\t%s\n" $2 $ap $t $c "$(sysctl -n vm.loadavg | awk '{print $2}')" >> $OUT; }
for p in NONE K1 K2 K2b K3 K4 K5 K6 K7 K8 K9 K10 K11 K12 K13 K14 K15 K16 K17 K18 K23; do run plantk.py $p; done
for p in K7r K7s; do run plantk2.py $p; done
restore; for f in $FILES; do cmp -s $PR/$f $FE/$f || echo "NOT RESTORED $f" >> $OUT; done; echo DONE >> $OUT
