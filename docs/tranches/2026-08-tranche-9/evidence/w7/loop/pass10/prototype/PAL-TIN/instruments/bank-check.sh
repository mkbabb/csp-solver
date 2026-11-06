#!/bin/bash
# PAL-TIN pass 10 · apply --check of the bank on fresh archives, each with its own .git (exits read bare)
S=${SCRATCH:?set SCRATCH to the lane scratch dir}
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop
B=$E/pass10/prototype/PAL-TIN; out=$S/logs/bank-check.txt; : > $out
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2
mk() { mkdir -p $1; (cd $T && git archive 74a2b5d9) | tar -x -C $1; (cd $1 && git init -q); }
mk $S/chk-base; cd $S/chk-base
git apply --check --binary $B/pass10.diff; echo "pass10.diff on fresh 74a2b5d9: exit $?" >> $out
git apply --check --reverse --binary $B/pass10.diff; echo "negative control (--reverse on fresh 74a2b5d9, must be non-0): exit $?" >> $out
git apply --binary $B/pass10.diff; echo "applied for real on 74a2b5d9: exit $?" >> $out
d=0; for p in $(cat $S/bank10.paths); do cmp -s $p $T/$p || d=$((d+1)); done; echo "  $(wc -l < $S/bank10.paths | tr -d ' ') paths, $d differ from the lane tree" >> $out
mk $S/chk-wave; cd $S/chk-wave
git apply --binary $E/pass9/integrate/WAVE.diff; echo "WAVE.diff on fresh 74a2b5d9: exit $?" >> $out
git apply --check --binary $B/pass10.delta.on-WAVE.diff; echo "pass10.delta.on-WAVE.diff on the plain WAVE (74a2b5d9 + WAVE.diff): exit $?" >> $out
git apply --binary $E/pass10/instruments/homes.on-WAVE.diff; echo "homes.on-WAVE.diff (0723d508) on it: exit $?" >> $out
git apply --check --binary $B/pass10.delta.on-WAVE.diff; echo "pass10.delta.on-WAVE.diff on the WAVE + homes v3 (its declared base): exit $?" >> $out
git apply --check --reverse --binary $B/pass10.delta.on-WAVE.diff; echo "negative control (--reverse there, must be non-0): exit $?" >> $out
git apply --binary $B/pass10.delta.on-WAVE.diff; echo "applied for real: exit $?" >> $out
for p in web/frontend/scripts/check-peer-tin.mjs; do cmp -s $p $T/$p && echo "  $p equals the lane tree's" >> $out || echo "  $p DIFFERS from the lane tree's" >> $out; done
echo DONE >> $out
