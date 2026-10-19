S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-MOT-LADDER
FE=$S/dsnap/web/frontend; O=$S/logs/dsab; GT=$FE/scripts/check-motion-bands.mjs; cp $FE/src/assets/index.css $O/index.css.orig
python3 $S/inst/plantc.py $FE C28 > $O/c28.plant 2>&1
(cd $FE && node scripts/check-motion-bands.mjs --self-test > $O/c28-intact.log 2>&1); echo "c28 intact $?" >> $O/c28.tsv
python3 $S/inst/dsab.py $GT D4-term >> $O/c28.plant 2>&1
(cd $FE && node scripts/check-motion-bands.mjs --self-test > $O/c28-D4.log 2>&1); echo "c28 D4-term $?" >> $O/c28.tsv
cp $O/gate.orig $GT; cp $O/index.css.orig $FE/src/assets/index.css; cmp -s $O/gate.orig $GT && cmp -s $O/index.css.orig $FE/src/assets/index.css; echo "restored $? $(uptime | sed 's/.*averages: //')" >> $O/c28.tsv
