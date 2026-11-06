#!/bin/zsh
# usage: dsab10.sh <snapdir>  -> logs/dsab10/dsab.tsv (id, mut exit, --self-test exit, restored cmp, load)
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/MOT-LADDER
# (pass 10: the chain holds here until the final gate is swapped into the snapshot and verified)
case $1 in *ksnap-new) until [ -f $S/logs/swap.ok ]; do sleep 2; done;; esac
FE=$1/web/frontend; O=$S/logs/dsab10; mkdir -p $O; GT=$FE/scripts/check-motion-bands.mjs; cp $GT $O/gate.orig
printf 'id\tmut\tselftest\trestored\tload\n' > $O/dsab.tsv
for i in D1-bound-eps D2-longhand D3-famanim D4-term D5-root D5b-noreach D6-carried D7-catch D8-fam E1-deep-off E2-deep-any E3-fallthrough E5-prm E6-house E7-csswide E8-negmul E9-negshort E10-steps E11-retune E12-clockfam E13-keyframes E14-lowest E14b-own E16-count E17-hole E18-template E19-stale E20-neg-text E21-consumer E22-fit-row E23-dip E24-door E25-types E26-kf-cite E27-kf-sig E28-kf-terms E29-kf-equal; do
  python3 $S/inst/dsab10.py $GT $i > $O/$i.mut 2>&1; m=$?
  (cd $FE && node scripts/check-motion-bands.mjs --self-test > $O/$i.log 2>&1); t=$?
  cp $O/gate.orig $GT; cmp -s $O/gate.orig $GT; r=$?
  printf '%s\t%s\t%s\t%s\t%s\n' $i $m $t $r "$(sysctl -n vm.loadavg)" >> $O/dsab.tsv
done
# the D4 door: the D4-mutated gate on the C28y-planted tree (intact gate first)
cp $FE/src/assets/index.css $O/index.css.orig
python3 $S/inst/plantc.py $FE C28y > $O/c28y.plant 2>&1
(cd $FE && node scripts/check-motion-bands.mjs --self-test > $O/c28y-intact.log 2>&1); a=$?
python3 $S/inst/dsab10.py $GT D4-term > /dev/null 2>&1
(cd $FE && node scripts/check-motion-bands.mjs > $O/c28y-d4-tree.log 2>&1); b=$?
(cd $FE && node scripts/check-motion-bands.mjs --self-test > $O/c28y-d4-self.log 2>&1); c=$?
cp $O/gate.orig $GT; cp $O/index.css.orig $FE/src/assets/index.css; cmp -s $O/gate.orig $GT; r1=$?; cmp -s $O/index.css.orig $FE/src/assets/index.css; r2=$?
printf 'C28y-door\tintact-selftest=%s\tD4-tree=%s\tD4-selftest=%s\trestored=%s/%s\n' $a $b $c $r1 $r2 >> $O/dsab.tsv
echo DONE >> $O/dsab.tsv
