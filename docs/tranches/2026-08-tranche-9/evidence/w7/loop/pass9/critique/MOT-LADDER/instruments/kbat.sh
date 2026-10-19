# usage: kbat.sh <frontend-dir> <tag> <plants...>   writes logs/kb-<tag>/battery.tsv
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-MOT-LADDER
FE=$1; TAG=$2; shift 2; O=$S/logs/kb-$TAG; mkdir -p $O $O/bak
FILES="src/pencil/chrome/AttributionCard/AttributionCard.vue src/assets/index.css src/App.vue src/games/shared/BoardHost.vue src/games/shared/DigitCell.vue src/main.ts index.html"
for f in $FILES; do mkdir -p $O/bak/$(dirname $f); cp $FE/$f $O/bak/$f; done
printf 'plant\tplantexit\tbands\tmotion\tverbs\trestored\tload\n' > $O/battery.tsv
for p in "$@"; do
  cd $FE; case $p in C*|NONE) PS=plantc.py;; K7r|K7s) PS=plantk2.py;; *) PS=plantk.py;; esac; python3 $S/inst/$PS $FE $p > $O/$p.plant 2>&1; pe=$?
  node scripts/check-motion-bands.mjs --self-test > $O/$p.bands 2>&1; b=$?
  node scripts/check-motion-contract.mjs --self-test > $O/$p.motion 2>&1; m=$?
  (node scripts/publish-verbs.mjs --check && node scripts/check-pencil-verbs.mjs --self-test) > $O/$p.verbs 2>&1; v=$?
  r=0; for f in $FILES; do cp $O/bak/$f $FE/$f; cmp -s $O/bak/$f $FE/$f || r=1; done
  l=$(uptime | sed 's/.*averages: //')
  printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\n' $p $pe $b $m $v $r "$l" >> $O/battery.tsv
done
B=$S/bank/web/frontend; diff -rq $B/src $FE/src > $O/final-treediff.txt 2>&1; echo "treediff $?" >> $O/battery.tsv; echo DONE >> $O/battery.tsv
