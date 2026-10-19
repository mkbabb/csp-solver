#!/bin/zsh
R=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion
S=$R/.claude/t9-scratch/work/pass9/crit-NOTE-LEDGER
export GIT_CEILING_DIRECTORIES=$S
E=$R/docs/tranches/2026-08-tranche-9/evidence/w7/loop
L=$E/pass9/prototype/NOTE-LEDGER
cd $S
for d in base wave s7 waveE; do mkdir -p $d; git -C /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46 archive 74a2b5d9 | tar -x -C $S/$d; done
echo "archives done"
cd $S/base; git apply -v --check --binary $L/pass9.diff > $S/chk-base.txt 2>&1; echo "pass9.diff on 74a2b5d9: $?" >> $S/chk.txt
cd $S/wave; git apply --binary $E/pass8/integrate/WAVE.diff > $S/chk-wave-apply.txt 2>&1; echo "WAVE.diff apply on base: $?" >> $S/chk.txt
git apply -v --check --binary $L/pass9.delta.on-WAVE.diff > $S/chk-onwave.txt 2>&1; echo "delta on acb9c08e (WAVE): $?" >> $S/chk.txt
cd $S/s7; git apply --binary $E/pass8/integrate/s13-s7-s3.diff > /dev/null 2>&1; echo "s13-s7-s3 apply: $?" >> $S/chk.txt
git apply -v --check --binary $L/pass9.delta.on-WAVE.diff > $S/chk-s7.txt 2>&1; echo "delta on f1c9c3fe (s13-s7-s3): $?" >> $S/chk.txt
cd $S/waveE; git apply --binary $E/pass8/integrate/WAVE.diff >/dev/null 2>&1; echo "waveE WAVE apply: $?" >> $S/chk.txt
git apply --binary $E/pass9/instruments/homes.on-WAVE.diff > /dev/null 2>&1; echo "waveE homes.on-WAVE apply: $?" >> $S/chk.txt
git apply --binary $E/pass9/prototype/NOTE-ERASE/pass9.delta.on-WAVE.diff > /dev/null 2>&1; echo "waveE ERASE9 apply: $?" >> $S/chk.txt
git apply -v --check --binary $L/pass9.delta.on-WAVE.diff > $S/chk-waveE.txt 2>&1; echo "delta on acde977b+ERASE9 check: $?" >> $S/chk.txt
git apply --binary $L/pass9.delta.on-WAVE.diff > $S/chk-waveE-apply.txt 2>&1; echo "delta on acde977b+ERASE9 applied: $?" >> $S/chk.txt
echo DONE >> $S/chk.txt
