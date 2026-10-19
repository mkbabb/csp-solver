#!/bin/bash
# PAL-TIN pass 9 · the bank: pass9.diff through a temporary index on 74a2b5d9 (product paths only), the on-WAVE delta
# through a second temporary index on acde977b (WAVE union acb9c08e + homes.on-WAVE) with the wave copy's bytes, then
# apply --check of each on a fresh `git archive` of its base in its own `git init` root (no commits). No rm, no set -e.
R=$REPO
W=$R/$WORKTREES/wf_308fa864-c94-2; S=$R/$SCRATCH; T=$S/wavetree
V=$R/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass9/prototype/PAL-TIN; L=$S/logs/bank.txt; ts=$(date +%s)
for f in bank.index idx-onwave base74-bank base-acde base-acb9; do [ -e $S/$f ] && mv $S/$f $S/trash/$f.$ts; done
cd $W; echo "bank cut $(date +%T) · HEAD $(git rev-parse --short=8 HEAD)" > $L
export GIT_INDEX_FILE=$S/bank.index; git read-tree 74a2b5d9; git add -A .github web/frontend
echo "tree $(git write-tree)" >> $L; git diff --cached --binary 74a2b5d9 > $V/pass9.diff; echo "cut exit $?" >> $L
git diff --cached --shortstat 74a2b5d9 >> $L; echo "bytes $(wc -c < $V/pass9.diff) · sha1 $(shasum $V/pass9.diff | cut -c1-40)" >> $L
git diff --cached --name-only 74a2b5d9 > $S/bank.paths
export GIT_INDEX_FILE=$S/idx-onwave; git read-tree acde977b
while read p; do m=$(GIT_INDEX_FILE=$S/bank.index git ls-files -s -- "$p" | cut -d' ' -f1); git update-index --add --cacheinfo $m,$(git hash-object -w "$T/$p"),"$p"; done < $S/bank.paths
echo "on-WAVE tree $(git write-tree)" >> $L; git diff --cached --binary acde977b > $V/pass9.delta.on-WAVE.diff; echo "delta cut exit $?" >> $L
git diff --cached --shortstat acde977b >> $L; echo "delta bytes $(wc -c < $V/pass9.delta.on-WAVE.diff) · sha1 $(shasum $V/pass9.delta.on-WAVE.diff | cut -c1-40)" >> $L
unset GIT_INDEX_FILE
ck() { local base=$1 dir=$2 diff=$3; mkdir -p $dir; git -C $W archive $base | tar -x -C $dir; (cd $dir && git init -q && git apply --check $diff); local e=$?; echo "apply --check $(basename $diff) on fresh $base archive ($(basename $dir) own root): exit $e" >> $L; }
ck 74a2b5d9 $S/base74-bank $V/pass9.diff
ck acde977b $S/base-acde $V/pass9.delta.on-WAVE.diff
ck acb9c08e $S/base-acb9 $V/pass9.delta.on-WAVE.diff
(cd $S/base74-bank && git apply --check --reverse $V/pass9.diff >/dev/null 2>&1); e=$?; echo "negative control: apply --check --reverse of pass9.diff on the fresh 74a2b5d9 archive: exit $e (must be non-0)" >> $L
(cd $S/base-acde && git apply $V/pass9.delta.on-WAVE.diff; echo "applied for real on acde977b: exit $?" >> $L; n=0; d=0; while read p; do n=$((n+1)); cmp -s "$p" "$T/$p" || { d=$((d+1)); echo "  DIFFERS $p" >> $L; }; done < $S/bank.paths; echo "  $n paths, $d differ from the wave copy" >> $L)
(cd $S/base74-bank && git apply $V/pass9.diff; echo "applied for real on 74a2b5d9: exit $?" >> $L; n=0; d=0; while read p; do n=$((n+1)); cmp -s "$p" "$W/$p" || { d=$((d+1)); echo "  DIFFERS $p" >> $L; }; done < $S/bank.paths; echo "  $n paths, $d differ from the lane tree" >> $L)
echo "end $(date +%T)" >> $L
