#!/bin/zsh
# ACC-FIVE pass-9 bank: temporary indexes in the worktree's git only (no commit, no ref, no stash).
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/ACC-FIVE
D=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop
E=$D/pass9/prototype/ACC-FIVE; mkdir -p $E
O=$S/logs/bank.txt; : > $O
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41
HOMES="web/frontend/e2e/lib web/frontend/knip.json web/frontend/scripts/shape-census.mjs web/frontend/scripts/shape-census.d.mts"
# 1. the tree through a temporary index, product paths only (the scratch serve config excluded)
export GIT_INDEX_FILE=$S/idx.bank
git read-tree 74a2b5d9 && git add -A . && git rm -q --cached --ignore-unmatch web/frontend/.acc5p9.vite.mts web/frontend/.acc5p9.vitest.mts
TREE=$(git write-tree); echo "tree $TREE" >> $O
git diff --cached --binary 74a2b5d9 > $E/pass9.diff
echo "pass9.diff sha1 $(shasum $E/pass9.diff | cut -d' ' -f1) bytes $(wc -c < $E/pass9.diff | tr -d ' ') shortstat $(git diff --cached --shortstat 74a2b5d9)" >> $O
git diff --cached --name-status 74a2b5d9 >> $O
# 2. the delta: pass-8 bank tree c3a863f7 -> this tree, home paths excluded (homes v2 rides homes.on-WAVE.diff)
git diff --binary c3a863f7 $TREE -- web/frontend ':!web/frontend/e2e/lib' ':!web/frontend/knip.json' ':!web/frontend/scripts/shape-census.mjs' ':!web/frontend/scripts/shape-census.d.mts' > $E/pass9.delta.on-WAVE.diff
echo "pass9.delta.on-WAVE.diff sha1 $(shasum $E/pass9.delta.on-WAVE.diff | cut -d' ' -f1) bytes $(wc -c < $E/pass9.delta.on-WAVE.diff | tr -d ' ') shortstat $(git diff --shortstat c3a863f7 $TREE -- web/frontend ':!web/frontend/e2e/lib' ':!web/frontend/knip.json' ':!web/frontend/scripts/shape-census.mjs' ':!web/frontend/scripts/shape-census.d.mts')" >> $O
# 3. apply --check, each on its own temporary index
export GIT_INDEX_FILE=$S/idx.c74; git read-tree 74a2b5d9; git apply --cached --check $E/pass9.diff; echo "check pass9.diff on 74a2b5d9 exit $?" >> $O
git apply --cached $E/pass9.diff; echo "  applied -> $(git write-tree) (expect $TREE)" >> $O
export GIT_INDEX_FILE=$S/idx.c8; git read-tree c3a863f7; git apply --cached --check $E/pass9.delta.on-WAVE.diff; echo "check delta on the pass-8 bank tree c3a863f7 exit $?" >> $O
export GIT_INDEX_FILE=$S/idx.s13; git read-tree 74a2b5d9; git apply --cached --binary $D/pass8/integrate/s13-s7-s3.diff; echo "s13-s7-s3 -> $(git write-tree) (expect f1c9c3fe)" >> $O
git apply --cached $D/pass9/instruments/homes.on-WAVE.diff 2>/dev/null; echo "  homes.on-WAVE on s13 exit $?" >> $O
git apply --cached --check $E/pass9.delta.on-WAVE.diff; echo "check delta on s13-s7-s3 (+homes) exit $?" >> $O
export GIT_INDEX_FILE=$S/idx.wave; git read-tree 74a2b5d9; git apply --cached --binary $D/pass8/integrate/WAVE.diff; echo "WAVE -> $(git write-tree) (expect acb9c08e)" >> $O
git apply --cached $D/pass9/instruments/homes.on-WAVE.diff; echo "  homes.on-WAVE exit $? -> $(git write-tree)" >> $O
git apply --cached --check $E/pass9.delta.on-WAVE.diff; echo "check delta on WAVE+homes exit $?" >> $O
git apply --cached $E/pass9.delta.on-WAVE.diff; echo "  WAVE+homes+delta -> $(git write-tree)" >> $O
export GIT_INDEX_FILE=$S/idx.wave0; git read-tree 74a2b5d9; git apply --cached --binary $D/pass8/integrate/WAVE.diff; git apply --cached --check $E/pass9.delta.on-WAVE.diff; echo "check delta on bare WAVE (no homes) exit $?" >> $O
unset GIT_INDEX_FILE
# 4. cleanliness
for b in pass9.diff pass9.delta.on-WAVE.diff; do echo "grep $b: scratchpad $(grep -c scratchpad $E/$b) /private/tmp $(grep -c /private/tmp $E/$b) /tmp/ $(grep -c '/tmp/' $E/$b) t9-scratch $(grep -c '.claude/t9-scratch' $E/$b) dot-dir-paths $(grep -cE '^\+\+\+ b/.*/\.' $E/$b)" >> $O; done
echo BANK DONE >> $O
