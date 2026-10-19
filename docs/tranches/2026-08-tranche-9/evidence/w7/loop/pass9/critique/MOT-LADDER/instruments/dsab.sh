S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-MOT-LADDER
FE=$S/dsnap/web/frontend; O=$S/logs/dsab; mkdir -p $O; GT=$FE/scripts/check-motion-bands.mjs; cp $GT $O/gate.orig
printf 'id\tmut\tselftest\trestored\tload\n' > $O/dsab.tsv
for i in D1-bound-eps D2-longhand D3-famanim D4-term D5-scoped D6-carried D7-catch D8-fam; do
  python3 $S/inst/dsab.py $GT $i > $O/$i.mut 2>&1; m=$?
  (cd $FE && node scripts/check-motion-bands.mjs --self-test > $O/$i.log 2>&1); t=$?
  cp $O/gate.orig $GT; cmp -s $O/gate.orig $GT; r=$?
  printf '%s\t%s\t%s\t%s\t%s\n' $i $m $t $r "$(uptime | sed 's/.*averages: //')" >> $O/dsab.tsv
done
echo DONE >> $O/dsab.tsv
