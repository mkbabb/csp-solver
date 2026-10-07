#!/bin/bash
# PLR-SELF pass 8 (resumed) · the bank: cut through a TEMPORARY index (GIT_INDEX_FILE), verify every apply on a fresh archive.
R=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself8r
WT=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop
D=$E/pass8/prototype/PLR-SELF
cd $WT
export GIT_INDEX_FILE=$R/idx-bank; git read-tree HEAD; git add -A; TREE=$(git write-tree); unset GIT_INDEX_FILE
echo "tree $TREE"
git diff --binary 74a2b5d9 $TREE -- . ':(exclude)docs/tranches/LEDGER.md' > $D/pass8.diff
git diff --binary 74a2b5d9 $TREE > $D/pass8-substrate.diff
export GIT_INDEX_FILE=$R/idx-base8; git read-tree 74a2b5d9; git apply --cached $E/pass7/prototype/PLR-SELF/pass7.diff; a=$?; git apply --cached $E/pass8/instruments/homes.diff; b=$?; BASE=$(git write-tree); unset GIT_INDEX_FILE
echo "delta base $BASE (pass7 apply $a, homes apply $b)"
git diff --binary $BASE $TREE -- . ':(exclude)docs/tranches/LEDGER.md' > $D/pass8.delta.diff
for f in pass8.diff pass8-substrate.diff pass8.delta.diff; do
  echo "$f bytes $(wc -c < $D/$f | tr -d ' ') sha1 $(shasum $D/$f | cut -c1-40) :: $(git apply --stat $D/$f | tail -1)"
done
mkdir -p $R/chk-a $R/chk-b $R/chk-c
git archive 74a2b5d9 | tar -x -C $R/chk-a; (cd $R/chk-a && git apply --check $D/pass8.diff); echo "apply --check pass8.diff on fresh 74a2b5d9 exit $?"
(cd $R/chk-a && git apply $D/pass8.diff); echo "apply pass8.diff exit $?"
git archive 74a2b5d9 | tar -x -C $R/chk-b; (cd $R/chk-b && git apply --check $D/pass8-substrate.diff); echo "apply --check pass8-substrate.diff on fresh 74a2b5d9 exit $?"
git archive $BASE | tar -x -C $R/chk-c; (cd $R/chk-c && git apply --check $D/pass8.delta.diff); echo "apply --check pass8.delta.diff on $BASE exit $?"
n=0; m=0; for f in $(git diff --name-only 74a2b5d9 $TREE -- web/frontend); do n=$((n+1)); cmp -s $WT/$f $R/chk-a/$f || { m=$((m+1)); echo "DIFFERS $f"; }; done; echo "applied bytes vs tree: $n files, $m differ"
for f in web/frontend/src/pencil/chrome/PlayerMark/PlayerMark.vue web/frontend/e2e/player-mark.spec.ts web/frontend/e2e/lib/edge-bands.d.mts web/frontend/src/pencil/chrome/AttributionCard/HeadSheet.vue; do echo "sha1 $(shasum $WT/$f | cut -c1-40) blob $(git hash-object $WT/$f | cut -c1-8) $f"; done
echo BANK-DONE
