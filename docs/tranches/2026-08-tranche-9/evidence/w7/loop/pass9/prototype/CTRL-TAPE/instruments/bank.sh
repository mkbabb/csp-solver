#!/bin/bash
# bank: cut pass9.diff (tree vs 74a2b5d9), the on-WAVE and on-s10 deltas, grep them, apply --check each on fresh archives
S=${S:?scratch dir}
R=${R:?repo root}
LEAK=${LEAK:?path-leak regex from the bank law}
W=${W:?lane work tree}
GD=${GD:?the lane worktree git dir}
D=$R/docs/tranches/2026-08-tranche-9/evidence/w7/loop
OUT=$S/bank; mkdir -p $OUT; L=$OUT/bank.log; : > $L
cutd() { # name worktree base [pathspec] (named cutd: a function called cut shadows coreutils cut below)
  ( export GIT_DIR=$GD GIT_WORK_TREE=$2 GIT_INDEX_FILE=$S/idx-bank-$1; cd $2 && git read-tree 74a2b5d9 && git add -A . && T=$(git write-tree) && git diff --binary $3 $T -- ${4:-.} > $OUT/$1.diff && echo "$1 base $3 tree $T bytes $(wc -c < $OUT/$1.diff | tr -d ' ') sha1 $(shasum $OUT/$1.diff | cut -c1-40) shortstat$(git diff --shortstat $3 $T -- ${4:-.})" >> $L )
}
cutd pass9 $W 74a2b5d9
cutd on-WAVE $S/wave acde977b
cutd on-s10 $S/s10 a15da8e6 web/frontend  # the s10 scratch holds README + web/ only
for f in pass9 on-WAVE on-s10; do echo "grep $f: $(grep -cE "$LEAK" $OUT/$f.diff) path-hits, dot-dirs $(grep -cE '^\+\+\+ b/(.*/)?\.[^/]+/' $OUT/$f.diff), dot-files-under-frontend $(grep -cE '^\+\+\+ b/web/frontend/\.' $OUT/$f.diff)" >> $L; done
fresh() { # dir patches...
  d=$1; shift; [ -e $d ] && mv $d $S/trash/$(basename $d).$(date +%s); mkdir -p $d
  (cd $W && git --git-dir=$GD archive 74a2b5d9) | tar -x -C $d
  for p in "$@"; do (cd $d && GIT_CEILING_DIRECTORIES=$S git apply $p) || echo "SETUP FAIL $d $p" >> $L; done
}
chk() { # label dir patch
  (cd $2 && GIT_CEILING_DIRECTORIES=$S git apply --check -v $3 > $OUT/chk-$1.log 2>&1; echo "check $1 exit=$? paths=$(grep -c '^Checking patch' $OUT/chk-$1.log)" >> $L)
}
fresh $S/chk-base
chk pass9@74a2b5d9 $S/chk-base $OUT/pass9.diff
fresh $S/chk-s10 $D/pass8/integrate/s10.diff
chk on-s10@s10 $S/chk-s10 $OUT/on-s10.diff
chk pass9@s10 $S/chk-s10 $OUT/pass9.diff
fresh $S/chk-wave $D/pass8/integrate/WAVE.diff $D/pass9/instruments/homes.on-WAVE.diff
chk on-WAVE@WAVE+homes $S/chk-wave $OUT/on-WAVE.diff
chk on-s10@WAVE+homes $S/chk-wave $OUT/on-s10.diff
chk pass9@WAVE+homes $S/chk-wave $OUT/pass9.diff
fresh $S/chk-wave0 $D/pass8/integrate/WAVE.diff
chk on-WAVE@WAVE-bare $S/chk-wave0 $OUT/on-WAVE.diff
echo BANK-DONE >> $L
