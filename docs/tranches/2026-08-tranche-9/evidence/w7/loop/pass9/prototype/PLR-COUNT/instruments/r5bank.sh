#!/bin/bash
# bank: pass9.diff (tree vs 74a2b5d9) + pass9.delta.on-WAVE.diff (r2w/w2 vs acde977b), then every apply --check on fresh archives; exits bare to files
S=$LANE
W=$TREE
I=$REPO/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass8/integrate
H=$REPO/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass9/instruments
B=$S/r5bank; C=$S/r5ck; mkdir -p $B $C; export GIT_CEILING_DIRECTORIES=$S
$S/bin/cut.sh $B > /dev/null
cd $W || exit 9
GD=$(git rev-parse --absolute-git-dir)
( export GIT_DIR=$GD GIT_WORK_TREE=$S/r5w/w2 GIT_INDEX_FILE=$B/idx.w2
  git read-tree --empty; git add -A web/frontend ':!web/frontend/node_modules' ':!web/frontend/tsconfig.tsbuildinfo'; git write-tree --prefix=web/frontend/ > $B/w2-frontend-tree.txt
  git diff --cached --binary acde977b -- web/frontend > $B/pass9.delta.on-WAVE.diff; echo "exit=$?" > $B/wave-diff.exit
  git diff --cached --shortstat acde977b -- web/frontend > $B/wave-shortstat.txt
  git diff --cached --name-status acde977b -- web/frontend > $B/wave-names.txt )
shasum $B/pass9.delta.on-WAVE.diff > $B/wave-sha.txt; wc -c < $B/pass9.delta.on-WAVE.diff > $B/wave-bytes.txt
for f in pass9.diff pass9.delta.on-WAVE.diff; do grep -c -E 'scratchpad|/private/tmp|/tmp/|\.claude/t9-scratch' $B/$f > $B/$f.grep-paths; grep -c -E '^\+\+\+ .*/\.' $B/$f > $B/$f.grep-dotdirs; done
mk() { [ -d $C/$1 ] && mv $C/$1 $S/trash/r5ck-$1-$(date +%s); mkdir -p $C/$1 && (cd $W && git archive 74a2b5d9) | tar -x -C $C/$1; }
for d in base s10 s13 wave acde; do mk $d; done
(cd $C/s10 && git apply $I/s10.diff; echo "exit=$?" > $C/s10.prep.exit)
(cd $C/s13 && git apply $I/s13-s7-s3.diff; echo "exit=$?" > $C/s13.prep.exit)
(cd $C/wave && git apply $I/WAVE.diff; echo "exit=$?" > $C/wave.prep.exit)
(cd $C/acde && git apply $I/WAVE.diff && git apply $H/homes.on-WAVE.diff; echo "exit=$?" > $C/acde.prep.exit)
for d in base s10 s13 wave acde; do (cd $C/$d && git apply --check -v $B/pass9.diff > $C/p9-on-$d.log 2>&1; echo "exit=$?" > $C/p9-on-$d.exit); done
for d in wave acde; do (cd $C/$d && git apply --check -v $B/pass9.delta.on-WAVE.diff > $C/dw-on-$d.log 2>&1; echo "exit=$?" > $C/dw-on-$d.exit); done
echo R5BANK-DONE > $B/DONE
