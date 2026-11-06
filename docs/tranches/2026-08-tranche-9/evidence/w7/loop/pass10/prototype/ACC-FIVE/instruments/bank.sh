#!/bin/zsh
# ACC-FIVE pass-10 bank: every cut through a TEMPORARY index (no commit, no ref, no stash).
R=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion
S=$R/.claude/t9-scratch/work/pass10/ACC-FIVE
W=$R/.claude/worktrees/wf_f72f3b5a-83a-41
E=$R/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass10/prototype/ACC-FIVE
I9=$R/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass9/integrate
H=$R/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass10/instruments
O=$S/logs/bank.log; : > $O
cd $W
echo "git dir $(git rev-parse --git-dir) HEAD $(git rev-parse HEAD)" >> $O
X=(':!web/frontend/.acc5p10.vitest.mts' ':!web/frontend/.acc5p10.vite.mts')
# T10: the tree now
export GIT_INDEX_FILE=$S/b-t10.idx; git read-tree HEAD; git add -A . $X; T10=$(git write-tree); unset GIT_INDEX_FILE
# the 13 home paths are homes v3 by sha (homes.diff 07257854), never a second copy in the bank (LAWS P9 §A)
HP=($(git apply --numstat $H/homes.diff | awk '{print $3}'))
HX=(); for p in $HP; do HX+=(":!$p"); done
echo "home paths ${#HP} ; residual home edit vs homes v3 (74a2b5d9 + homes.diff): $(git diff --name-only ac862f1e173f711ac214a8ade6a9de56ee746de8 $T10 -- $HP | wc -l | tr -d ' ') paths" >> $O
git diff --binary 74a2b5d9 $T10 -- . $HX > $E/pass10.diff
echo "T10 tree $T10" >> $O
echo "pass10.diff (74a2b5d9 -> T10, home paths excluded) sha1 $(shasum $E/pass10.diff | cut -d' ' -f1) bytes $(wc -c < $E/pass10.diff | tr -d ' ') :: $(git diff --shortstat 74a2b5d9 $T10 -- . $HX)" >> $O
# OPEN: pass-9 tree + homes v3 (the tree after the on-WAVE homes step, before any pass-10 edit)
export GIT_INDEX_FILE=$S/b-open.idx; git read-tree 2d13eaf131547594109d6d8dfd2f478cad6900b5; git apply --cached $H/homes.on-WAVE.diff; echo "open apply homes v3 exit $?" >> $O; OPEN=$(git write-tree); unset GIT_INDEX_FILE
echo "OPEN tree $OPEN" >> $O
git diff --binary $OPEN $T10 > $S/b-adv.diff
echo "advance $OPEN -> $T10 :: $(git diff --shortstat $OPEN $T10) :: $(git diff --name-only $OPEN $T10 | tr '\n' ' ')" >> $O
# base check: pass10.diff on 74a2b5d9
export GIT_INDEX_FILE=$S/b-base.idx; git read-tree 74a2b5d9; git apply --cached --check $E/pass10.diff; echo "CHECK pass10.diff on 74a2b5d9 exit $? (git dir $(git rev-parse --git-dir), paths $(git apply --numstat $E/pass10.diff | wc -l | tr -d ' '))" >> $O
git apply --cached $E/pass10.diff; echo "applied on 74a2b5d9 alone -> $(git write-tree) (the lane's paths without the homes)" >> $O; unset GIT_INDEX_FILE
export GIT_INDEX_FILE=$S/b-base2.idx; git read-tree 74a2b5d9; git apply --cached $H/homes.diff; echo "homes.diff on 74a2b5d9 exit $? -> $(git write-tree)" >> $O
git apply --cached --check $E/pass10.diff; echo "CHECK pass10.diff on 74a2b5d9 + homes v3 exit $?" >> $O; git apply --cached $E/pass10.diff; echo "applied -> $(git write-tree) (must equal T10 $T10)" >> $O; unset GIT_INDEX_FILE
# WAVE + homes v3 = the declared base of the on-WAVE delta
export GIT_INDEX_FILE=$S/b-wave.idx; git read-tree 74a2b5d9; git apply --cached $I9/WAVE.diff; echo "WAVE.diff on 74a2b5d9 exit $? -> $(git write-tree)" >> $O
git apply --cached $H/homes.on-WAVE.diff; echo "homes.on-WAVE on WAVE exit $?" >> $O; WH=$(git write-tree); echo "WAVE+homes v3 tree $WH" >> $O
git apply --cached --3way $S/b-adv.diff >> $O 2>&1; echo "advance 3way onto WAVE+homes exit $?" >> $O; WD=$(git write-tree); unset GIT_INDEX_FILE
git diff --binary $WH $WD > $E/pass10.delta.on-WAVE.diff
echo "pass10.delta.on-WAVE.diff $WH -> $WD sha1 $(shasum $E/pass10.delta.on-WAVE.diff | cut -d' ' -f1) bytes $(wc -c < $E/pass10.delta.on-WAVE.diff | tr -d ' ') :: $(git diff --shortstat $WH $WD) :: $(git diff --name-only $WH $WD | tr '\n' ' ')" >> $O
# checks of the on-WAVE delta: WAVE+homes v3 (declared), bare WAVE, s13-s7-s3 (+homes v3 and bare)
for B in wave-homes wave s13-homes s13; do
  export GIT_INDEX_FILE=$S/b-chk-$B.idx; git read-tree 74a2b5d9
  case $B in wave*) git apply --cached $I9/WAVE.diff;; s13*) git apply --cached $I9/s13-s7-s3.diff;; esac
  case $B in *-homes) git apply --cached $H/homes.on-WAVE.diff;; esac
  bt=$(git write-tree); git apply --cached --check $E/pass10.delta.on-WAVE.diff 2>> $O; echo "CHECK on-WAVE delta on $B ($bt) exit $? (git dir $(git rev-parse --git-dir), paths $(git apply --numstat $E/pass10.delta.on-WAVE.diff | wc -l | tr -d ' '))" >> $O
  git apply --cached --check $E/pass10.diff 2>/dev/null; echo "   (pass10.diff whole on $B: exit $?, expected 1: it carries the pass-9 bank too)" >> $O
  unset GIT_INDEX_FILE
done
for f in $E/pass10.diff $E/pass10.delta.on-WAVE.diff; do
  echo "grep $(basename $f): scratchpad $(grep -c scratchpad $f) /private/tmp $(grep -c /private/tmp $f) /tmp/ $(grep -c '/tmp/' $f) .claude/t9-scratch $(grep -c '.claude/t9-scratch' $f) dot-dir-paths $(grep -E '^\+\+\+ b/(.*/)?\.' $f | wc -l | tr -d ' ') acc5p10 $(grep -c acc5p10 $f)" >> $O
done
echo "gridPaths.ts blob $(git rev-parse ${T10}:web/frontend/src/pencil/grid/gridPaths.ts)" >> $O
echo "DONE $(date +%T)" >> $O
