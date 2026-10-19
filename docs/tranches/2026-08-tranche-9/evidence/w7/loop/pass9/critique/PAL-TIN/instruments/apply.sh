#!/bin/bash
# crit-PAL-TIN apply-check script. no rm, no git writes beyond init in own scratch roots.
W=$WORKTREES/wf_308fa864-c94-2
E=$REPO/docs/tranches/2026-08-tranche-9/evidence/w7/loop
S=$SCRATCH
cd $S
shasum $E/pass9/prototype/PAL-TIN/pass9.diff $E/pass9/prototype/PAL-TIN/pass9.delta.on-WAVE.diff $E/pass8/prototype/PAL-TIN/pass8.diff $E/pass9/instruments/homes.diff $E/pass9/instruments/homes.on-WAVE.diff $E/pass8/integrate/WAVE.diff
for t in 74a2b5d9:b74 acb9c08e:wave acde977b:acde 74a2b5d9:b74p8 74a2b5d9:b74h; do
  sha=${t%%:*}; d=${t##*:}; mkdir -p $S/$d
  git -C $W archive $sha | tar -x -C $S/$d; echo "archive $sha -> $d exit=$?"
  (cd $S/$d && git init -q && git rev-parse --show-toplevel)
done
cd $S/b74 && git apply --check --binary $E/pass9/prototype/PAL-TIN/pass9.diff; echo "pass9.diff --check on 74a2b5d9: $?"
cd $S/b74 && git apply --check --reverse --binary $E/pass9/prototype/PAL-TIN/pass9.diff; echo "NEG reverse --check on 74a2b5d9: $?"
cd $S/wave && git apply --check --binary $E/pass9/prototype/PAL-TIN/pass9.delta.on-WAVE.diff; echo "delta --check on acb9c08e: $?"
cd $S/acde && git apply --check --binary $E/pass9/prototype/PAL-TIN/pass9.delta.on-WAVE.diff; echo "delta --check on acde977b: $?"
cd $S/b74 && git apply --binary $E/pass9/prototype/PAL-TIN/pass9.diff; echo "pass9.diff applied b74: $?"
cd $S/acde && git apply --binary $E/pass9/prototype/PAL-TIN/pass9.delta.on-WAVE.diff; echo "delta applied acde: $?"
cd $S/b74p8 && git apply --binary $E/pass8/prototype/PAL-TIN/pass8.diff; echo "pass8.diff applied b74p8: $?"
cd $S/b74h && git apply --binary $E/pass9/instruments/homes.diff; echo "homes.diff applied b74h: $?"
echo DONE
