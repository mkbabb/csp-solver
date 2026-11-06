#!/bin/zsh
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-MOT-LADDER
FE=$S/dx/web/frontend; G=$FE/scripts/check-motion-bands.mjs; O=$S/logs/dsabx; mkdir -p $O; cp $G $O/gate.orig; shasum -a1 $G > $O/gate.sha
printf 'id\tmut\tselftest\trestored\tload\n' > $O/d.tsv
cd $FE
for id in M1-hole M2-tmpl M3-stale M4-owners M5-neg M7-count M8-secs; do
  python3 $S/inst/dsabx.py $G $id > $O/$id.mut 2>&1; m=$?
  ~/.claude/guard/guarded --light -- node scripts/check-motion-bands.mjs --self-test > $O/$id.log 2>&1; t=$?
  cp $O/gate.orig $G; cmp -s $O/gate.orig $G; r=$?
  printf '%s\t%s\t%s\t%s\t%s\n' $id $m $t $r "$(sysctl -n vm.loadavg)" >> $O/d.tsv
done
for c in component-reach element-clock local-token script-time keyframes-ratchet roster-types fit-one-writer; do
  MOTION_SABOTAGE=$c ~/.claude/guard/guarded --light -- node scripts/check-motion-bands.mjs --self-test > $O/sab-$c.log 2>&1; t=$?
  printf 'SAB:%s\t-\t%s\t-\t%s\n' $c $t "$(sysctl -n vm.loadavg)" >> $O/d.tsv
done
echo DONE >> $O/d.tsv
