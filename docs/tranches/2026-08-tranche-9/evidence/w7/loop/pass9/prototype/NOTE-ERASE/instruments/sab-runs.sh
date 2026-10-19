#!/bin/bash
# sab-runs.sh — the union spec (u9's affordances.spec.ts) against each sabotage/born-RED dist on :4240, then the tree's
# spec against the pass-8 hook; every server up/down through the guard; summary to logs/sab-runs.txt
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-ERASE
SV=$S/instruments/erase9-serve.sh; R=$S/instruments/run-spec2.sh; O=$S/logs/sab-runs.txt
WT=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend
$SV down u9 >> $O 2>&1
for n in u9sa waveh; do
  $SV up $n 4240 $S/$n/web/frontend $S/dist-$n .erase9-build.mts >> $O 2>&1 || { echo "UP $n failed" >> $O; continue; }
  $R $S/u9/web/frontend 4240 sab-$n -g "SWAP|line two" --repeat-each 2; cat $S/logs/spec-sab-$n.exit >> $O
  [ $n = waveh ] && { PI_TREE=4240 PI_TAG=waveh $S/instruments/run-probe2.sh $S/u9/web/frontend $S/instruments/pi2.probe.ts pi-waveh pi2.probe.ts; cat $S/logs/probe-pi-waveh.exit >> $O; }
  $SV down $n >> $O 2>&1
done
$SV up p8hook 4240 $S/p8hook/web/frontend $S/dist-p8hook .erase9-build.mts >> $O 2>&1
$R $WT 4240 sab-p8hook -g "drop clock" --repeat-each 2; cat $S/logs/spec-sab-p8hook.exit >> $O
$SV down p8hook >> $O 2>&1
$SV up u9 4240 $S/u9/web/frontend $S/dist-u9 .erase9-build.mts >> $O 2>&1
echo SAB-DONE >> $O
