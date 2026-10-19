#!/bin/bash
# cut-wave.sh <copy dir> <out.diff> — the on-WAVE delta: tree acde977b (WAVE union + homes.on-WAVE) with the
# copy's product files (every path that differs from acde977b, product paths only) laid in through a temporary index.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-ERASE
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47
C=$1 OUT=$2 BASE=acde977b007c7470f4e26c3f184d96c1b3a88637
cd $W || exit 9
export GIT_INDEX_FILE=$S/tmp.wave.idx.$$
git read-tree $BASE
n=0
# walk the copy's files against the base tree: changed or added product files only
(cd $C && find . -type f ! -path '*/node_modules/*' ! -path '*/.erase9*' ! -name '.erase9*' ! -path '*/.face-engine/*' ! -path './web/frontend/dist/*' ! -name '*.tsbuildinfo' | sed 's|^\./||') > $S/cut-wave.files
while read -r f; do
  b=$(git hash-object "$C/$f")
  o=$(git rev-parse -q --verify "$BASE:$f" 2>/dev/null)
  if [ "$b" != "$o" ]; then git hash-object -w "$C/$f" >/dev/null; git update-index --add --cacheinfo 100644,$b,"$f"; n=$((n+1)); echo "  $f" >> $S/cut-wave.changed; fi
done < $S/cut-wave.files
T=$(git write-tree)
git diff --cached --binary $BASE > $OUT
echo "base $BASE tree $T changed $n bytes $(wc -c < $OUT) sha1 $(shasum -a 1 $OUT | cut -d' ' -f1)"
echo "shortstat $(git diff --cached --shortstat $BASE)"
mv $GIT_INDEX_FILE $S/trash/
