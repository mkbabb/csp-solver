#!/bin/bash
# ACC-FIVE pass 6 · G10 re-cut battery: the gate and its three negative controls, same batch, both engines.
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc5-p6
GP=$W/src/pencil/grid/gridPaths.ts
cd $W
shasum $GP > $SP/gp.sha
restore() { cp $SP/gp.orig $GP; shasum -c $SP/gp.sha; }
cp $GP $SP/gp.orig
trap restore EXIT
run() { # label env... 
  local label=$1; shift
  for eng in chromium webkit; do
    env "$@" BASE=http://127.0.0.1:4236 npx playwright test -c .acc-five/pw.config.ts front-rate.spec.ts --project=$eng > $SP/logs/g10-$label-$eng.log 2>&1
    local rc=$?
    echo "$label $eng exit $rc :: $(grep -o 'G10 [a-z]* .*' $SP/logs/g10-$label-$eng.log | sed 's/^G10 [a-z]* //' | tr '\n' '|') :: $(grep -m1 -o 'Error: [^\n]*' $SP/logs/g10-$label-$eng.log | cut -c1-140)"
  done
}
run gated-driven CLOCK=driven
run gated-60 CLOCK=60
run gated-easy CLOCK=driven DEAL=EASY
run gated-native CLOCK=native
sed -i '' 's/^export const FRONT_MIN_MS = 16;/export const FRONT_MIN_MS = 0;/' $GP
grep -n '^export const FRONT_MIN_MS' $GP
sleep 3
run ablated-driven CLOCK=driven
run ablated-60-off CLOCK=60 PRECOND=0
run ablated-60 CLOCK=60
echo ALLDONE
