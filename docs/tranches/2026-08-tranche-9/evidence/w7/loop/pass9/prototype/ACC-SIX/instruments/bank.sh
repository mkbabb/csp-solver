#!/bin/bash
# bank.sh: cut pass9.diff (74a2b5d9 -> tree), the on-WAVE and on-s13-s7-s3 deltas, through temporary indexes; apply-check
# each on fresh archives (git discovery ceilinged); grep for contaminants. no rm, no set -e, no commit.
S=<SCRATCH>
W=<TREE>
E=<REPO>/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass9/prototype/ACC-SIX
D=<REPO>/docs/tranches/2026-08-tranche-9/evidence/w7/loop
mkdir -p $E; cd $W
export GIT_INDEX_FILE=$S/bank.index
git read-tree 74a2b5d9; git add -A -- . ':(exclude)web/frontend/<HELPER>'; P9=$(git write-tree)
git diff --binary 74a2b5d9 $P9 > $E/pass9.diff
echo "P9 $P9"; git diff --shortstat 74a2b5d9 $P9
# the delta net of homes: P8H (pass-8 bank tree with homes v2 substituted) -> P9
git diff --binary $(cat $S/p8h.tree) $P9 > $S/delta9.diff
for b in wavehomes s3h; do
  export GIT_INDEX_FILE=$S/bank-$b.index; git read-tree $(cat $S/$b.tree)
  git apply --cached --3way $S/delta9.diff > $S/bank-$b-3way.log 2>&1
  f=$([ $b = wavehomes ] && echo wave || echo s3)
  if git ls-files -u | grep -q check-theme-tokens; then blob=$(git hash-object -w $S/merge/$f-resolved-final.mjs); git update-index --cacheinfo 100644,$blob,web/frontend/scripts/check-theme-tokens.mjs; fi
  echo "$b unmerged $(git ls-files -u | wc -l)"; T=$(git write-tree); echo "$b+p9 $T"
  out=$([ $b = wavehomes ] && echo pass9.delta.on-WAVE.diff || echo pass9.delta.on-s13-s7-s3.diff)
  git diff --binary $(cat $S/$b.tree) $T > $E/$out; echo "$out $(git diff --shortstat $(cat $S/$b.tree) $T)"
  echo $T > $S/bank-$b-p9.tree
done
unset GIT_INDEX_FILE
echo BANK-CUT-DONE
