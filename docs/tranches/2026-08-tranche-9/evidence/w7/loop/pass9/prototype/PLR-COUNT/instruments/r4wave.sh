#!/bin/bash
# fresh on-WAVE build: wave = 74a2b5d9 + WAVE.diff + homes.on-WAVE.diff; w1 = wave + SELF's pass9 on-WAVE delta; w2 = w1 + this tree (onwave2.py)
S=$LANE
W=$TREE
E=$REPO/docs/tranches/2026-08-tranche-9/evidence/w7/loop
R=$S/r4w; mkdir -p $R; export GIT_CEILING_DIRECTORIES=$S
for d in wave w1 w2; do mkdir -p $R/$d; (cd $W && git archive 74a2b5d9) | tar -x -C $R/$d; done
for d in wave w1 w2; do (cd $R/$d && git apply -v $E/pass8/integrate/WAVE.diff > $R/$d.WAVE.log 2>&1; echo "exit=$?" > $R/$d.WAVE.exit; git apply -v $E/pass9/instruments/homes.on-WAVE.diff > $R/$d.homes.log 2>&1; echo "exit=$?" > $R/$d.homes.exit); done
for d in w1 w2; do (cd $R/$d && git apply -v $E/pass9/prototype/PLR-SELF/pass9.delta.on-WAVE.diff > $R/$d.self.log 2>&1; echo "exit=$?" > $R/$d.self.exit); done
cd $R/wave && GIT_DIR=$(cd $W && git rev-parse --absolute-git-dir) GIT_WORK_TREE=$R/wave GIT_INDEX_FILE=$R/idx.wave sh -c 'git read-tree --empty && git add -A . && git write-tree' > $R/wave.tree 2>&1
cd $W && git diff --name-only 74a2b5d9 -- web/frontend > /dev/null
W1=$R/w2 python3 $S/bin/onwave2.py $E/pass9/instruments/homes.on-WAVE.diff $E/pass9/prototype/PLR-SELF/pass9.delta.on-WAVE.diff $S/mine2.list > $R/overlay.txt 2>&1; echo "exit=$?" > $R/overlay.exit
echo R2WAVE-DONE
