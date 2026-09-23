#!/bin/bash
# ACC-SIX pass 6 · G10 on THIS tree (charter row 7, registry-v5 §2.3): FIVE's landed row (e2e/front-rate.spec.ts +
# e2e/rate-clock.ts, grafted verbatim) run BARE, both engines, with its negative controls in the same batch:
# gated·driven (must be 0) · gated·CLOCK=60 (must red on the precondition) · FRONT_MIN_MS→0·driven (must red on
# the rate) · FRONT_MIN_MS→0·CLOCK=60·PRECOND=0 (the pass-5 hole, shown). The ablation edits gridPaths.ts in place
# on the lane's own dev server (HMR) and is restored by a trap with a sha1 check (FIVE's g10-battery.sh form).
# usage: p6-g10-battery.sh <dev base url> <out dir>   (no rm; lane scratch only)
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend
BASEURL=$1; OUT=$2; GP=$W/src/pencil/grid/gridPaths.ts
cd $W
cp $GP $OUT/gp.orig; shasum $GP > $OUT/gp.sha
restore() { cp $OUT/gp.orig $GP; shasum -c $OUT/gp.sha; }
trap restore EXIT
run() { local label=$1; shift
  for eng in chromium webkit; do
    env "$@" BASE=$BASEURL npx playwright test -c .acc6p6/pw.config.ts front-rate.spec.ts --project=$eng > $OUT/g10-$label-$eng.log 2>&1
    local rc=$?
    echo "$label $eng exit $rc :: $(grep -o 'G10 [a-z]* .*' $OUT/g10-$label-$eng.log | sed 's/^G10 [a-z]* //' | tr '\n' '|') :: $(grep -m1 -o 'Error: .*' $OUT/g10-$label-$eng.log | cut -c1-160)"
  done
}
run gated-driven CLOCK=driven
run gated-60 CLOCK=60
sed -i '' 's/^export const FRONT_MIN_MS = 16;/export const FRONT_MIN_MS = 0;/' $GP
grep -n '^export const FRONT_MIN_MS' $GP
sleep 4
run ablated-driven CLOCK=driven
run ablated-60-off CLOCK=60 PRECOND=0
echo ALLDONE
