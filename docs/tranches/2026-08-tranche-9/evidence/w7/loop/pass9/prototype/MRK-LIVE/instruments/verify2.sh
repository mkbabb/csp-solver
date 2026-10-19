#!/bin/bash
# Re-cut both banks at the final spec and verify each by a real apply on fresh copies of the archives.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MRK-LIVE
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass9/prototype/MRK-LIVE
P8=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass8/integrate/WAVE.diff
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend
C=$S/chk2
[ -e $C ] && mv $C $S/trash/chk2.$(date +%H%M%S)
mkdir -p $C/base $C/wave $C/bare
echo "== bank"; $S/inst/bank.sh
echo "== delta"; $S/inst/cut-wave.sh
export GIT_CEILING_DIRECTORIES=$C
cp -R $S/base/web $C/base/web
cp -R $S/wave/web $C/wave/web
cp -R $S/base/web $C/bare/web
cd $C/base && git apply --check $E/pass9.diff; echo "base check exit $? paths $(grep -c '^diff --git' $E/pass9.diff)"
git apply $E/pass9.diff; echo "base apply exit $?"
r=0; for d in src e2e scripts; do diff -rq $C/base/web/frontend/$d $W/$d || r=1; done; cmp -s $C/base/web/frontend/knip.json $W/knip.json || r=1
echo "bank reproduces tree: $r (0 = equal)"
cd $C/wave && git apply --check $E/pass9.delta.on-WAVE.diff; echo "WAVE+homes check exit $? paths $(grep -c '^diff --git' $E/pass9.delta.on-WAVE.diff)"
git apply $E/pass9.delta.on-WAVE.diff; echo "WAVE+homes apply exit $?"
r=0; for d in src e2e scripts; do diff -rq $C/wave/web/frontend/$d $S/wavelane/web/frontend/$d || r=1; done
echo "delta reproduces WAVE copy: $r (0 = equal)"
cd $C/bare && git apply --include='web/*' $P8; echo "bare WAVE build-up exit $?"
git apply --check $E/pass9.delta.on-WAVE.diff; echo "bare WAVE check exit $?"
echo "grep scratch/tmp: $(grep -cE 'scratchpad|/private/tmp|/tmp/|\.claude/t9-scratch' $E/pass9.diff $E/pass9.delta.on-WAVE.diff | awk -F: '{s+=$2} END {print s}')"
echo "dot-path +++: $(grep -hE '^\+\+\+ b/(\.|.*/\.)' $E/pass9.diff $E/pass9.delta.on-WAVE.diff | wc -l | tr -d ' ')"
