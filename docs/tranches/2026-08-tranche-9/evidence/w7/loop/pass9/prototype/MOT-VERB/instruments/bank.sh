#!/bin/bash
# bank.sh : cut pass9.diff (on 74a2b5d9), pass9-verb-delta.diff (on LADDER's cut 7b2e2839) and
# pass9.delta.on-WAVE.diff through TEMPORARY indexes in the §13 tree; every apply --check exit to BANKED.txt.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-VERB
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass9/prototype/MOT-VERB
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59
B=$E/BANKED.txt; I=$S/idx.bank
{
echo "worktree .claude/worktrees/wf_f72f3b5a-83a-59 (the §13 tree, shared with MOT-LADDER; VERB ran second)"
echo "base 74a2b5d9317e7795cee6bf63e861bd44f54ae80e"
echo "opened-at 7b2e283989d2377abc10735239d8a58289263e9c (= LADDER's pass9-ladder.txt cut; no difference declared)"
} > $B
GIT_INDEX_FILE=$I git read-tree 74a2b5d9; GIT_INDEX_FILE=$I git add -A .
# product paths only: a scratch vite config is never banked (LAWS P8 §A); the home is homes v2's to the byte
GIT_INDEX_FILE=$I git rm --cached --ignore-unmatch -q web/frontend/.vite-verb9.config.mts
# the PROPOSED library edit is STRIPPED: the index takes homes v2's bytes for the two home files, whatever the
# work tree holds while the self-tests run (the tree is restored before return and re-checked against this tree)
for f in postpaint.mjs postpaint.d.mts; do h=$(git hash-object -w $S/homes-v2/$f); GIT_INDEX_FILE=$I git update-index --cacheinfo 100644,$h,web/frontend/e2e/lib/$f; cmp -s $S/homes-v2/$f web/frontend/e2e/lib/$f || echo "home file $f: work tree holds the PROPOSED edit; the bank holds homes v2 ($h)" >> $B; done
T=$(GIT_INDEX_FILE=$I git write-tree); echo "tree $T" >> $B
GIT_INDEX_FILE=$I git diff --cached --name-only 7b2e283989d2377abc10735239d8a58289263e9c > $S/logs/bank-paths.txt; echo "delta paths $(wc -l < $S/logs/bank-paths.txt | tr -d ' ')" >> $B
GIT_INDEX_FILE=$I git diff --cached --binary 74a2b5d9 > $E/pass9.diff
GIT_INDEX_FILE=$I git diff --cached --binary 7b2e283989d2377abc10735239d8a58289263e9c > $E/pass9-verb-delta.diff
for f in pass9.diff pass9-verb-delta.diff; do echo "$f bytes $(wc -c < $E/$f | tr -d ' ') sha1 $(shasum $E/$f | cut -c1-40) shortstat $(git apply --stat --summary $E/$f >/dev/null; GIT_INDEX_FILE=$I git diff --cached --shortstat $( [ $f = pass9.diff ] && echo 74a2b5d9 || echo 7b2e283989d2377abc10735239d8a58289263e9c))" >> $B; done
chk() { # $1 diff $2 base-tree $3 label
  GIT_INDEX_FILE=$S/idx.chk git read-tree $2; GIT_INDEX_FILE=$S/idx.chk git apply --cached --check $1 > $S/logs/chk-$3.log 2>&1; x=$?
  t="-"; if [ $x = 0 ]; then GIT_INDEX_FILE=$S/idx.chk git apply --cached $1 > /dev/null 2>&1; t=$(GIT_INDEX_FILE=$S/idx.chk git write-tree); fi
  echo "apply --check $(basename $1)@$3($2) exit $x -> $t" >> $B
}
chk $E/pass9.diff 74a2b5d9 base
chk $E/pass9-verb-delta.diff 7b2e283989d2377abc10735239d8a58289263e9c ladder-cut
chk $E/pass9-verb-delta.diff f1c9c3fe s13-s7-s3
chk $E/pass9-verb-delta.diff 2250db29 s13-s7-s3+ladder-own-gate
# on the WAVE: the delta onto the union + homes.on-WAVE + LADDER's on-WAVE (babea79d), then the on-WAVE diff is cut
# plain apply reds on the union's pencilConfig.ts context (other sections' hunks beside the hand block); the
# three-way apply merges every file cleanly (0 unmerged entries), and the on-WAVE delta is cut from its result
GIT_INDEX_FILE=$S/idx.wave git read-tree babea79d; GIT_INDEX_FILE=$S/idx.wave git apply --cached --3way $E/pass9-verb-delta.diff > $S/logs/wave-apply.log 2>&1; echo "apply --3way pass9-verb-delta.diff@babea79d exit $? unmerged $(GIT_INDEX_FILE=$S/idx.wave git ls-files -u | wc -l | tr -d ' ')" >> $B
# the §13 section tree (s13-s7-s3, f1c9c3fe): the same three-way cut, banked as its own delta
GIT_INDEX_FILE=$S/idx.s13 git read-tree f1c9c3fe; GIT_INDEX_FILE=$S/idx.s13 git apply --cached --3way $E/pass9-verb-delta.diff > $S/logs/s13-apply.log 2>&1; echo "apply --3way pass9-verb-delta.diff@f1c9c3fe exit $? unmerged $(GIT_INDEX_FILE=$S/idx.s13 git ls-files -u | wc -l | tr -d ' ')" >> $B
ST=$(GIT_INDEX_FILE=$S/idx.s13 git write-tree); git diff --binary f1c9c3fe $ST > $E/pass9.delta.on-s13-s7-s3.diff
echo "pass9.delta.on-s13-s7-s3.diff bytes $(wc -c < $E/pass9.delta.on-s13-s7-s3.diff | tr -d ' ') sha1 $(shasum $E/pass9.delta.on-s13-s7-s3.diff | cut -c1-40) -> $ST" >> $B
WT=$(GIT_INDEX_FILE=$S/idx.wave git write-tree); echo "on-WAVE tree $WT" >> $B
git diff --binary babea79d $WT > $E/pass9.delta.on-WAVE.diff
echo "pass9.delta.on-WAVE.diff bytes $(wc -c < $E/pass9.delta.on-WAVE.diff | tr -d ' ') sha1 $(shasum $E/pass9.delta.on-WAVE.diff | cut -c1-40) shortstat $(git diff --shortstat babea79d $WT)" >> $B
chk $E/pass9.delta.on-WAVE.diff babea79d wave+homes+ladder
chk $E/pass9.delta.on-WAVE.diff acde977b wave+homes
chk $E/pass9.delta.on-WAVE.diff acb9c08e wave
chk $E/pass9.delta.on-s13-s7-s3.diff f1c9c3fe s13-s7-s3
# the section's ONE delta on the union + homes v2 (LADDER's on-WAVE + this lane's), cut from the same on-WAVE tree
git diff --binary acde977b $WT > $E/pass9.s13.on-WAVE.diff
echo "pass9.s13.on-WAVE.diff bytes $(wc -c < $E/pass9.s13.on-WAVE.diff | tr -d ' ') sha1 $(shasum $E/pass9.s13.on-WAVE.diff | cut -c1-40) shortstat $(git diff --shortstat acde977b $WT)" >> $B
chk $E/pass9.s13.on-WAVE.diff acde977b s13-on-wave+homes
echo "contamination grep (scratchpad|/private/tmp|/tmp/|.claude/t9-scratch|+++ dot-path):" >> $B
for f in pass9.diff pass9-verb-delta.diff pass9.delta.on-WAVE.diff pass9.delta.on-s13-s7-s3.diff pass9.s13.on-WAVE.diff; do n=$(grep -c -E 'scratchpad|/private/tmp|/tmp/|\.claude/t9-scratch|^\+\+\+ b/(.*/)?\.[^/]+/' $E/$f); echo "  $f $n" >> $B; done
echo BANK-DONE >> $B
