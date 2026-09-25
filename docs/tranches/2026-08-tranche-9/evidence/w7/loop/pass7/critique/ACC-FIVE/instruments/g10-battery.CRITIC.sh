#!/bin/bash
# ACC-FIVE pass-7 CRITIC · G10: gated x N per engine on the tree (:4243) + plants on :4245; bare exit codes.
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend
CS=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc5crit7
PT=$CS/plant-ablate/web/frontend
TAG=${TAG:-a}; N=${N:-5}
cd $W
run() { # label port env...
  local label=$1 port=$2; shift 2
  for eng in ${ENGS:-chromium webkit}; do
    local ld=$(uptime | sed 's/.*averages: //' | cut -d' ' -f1) sib=$(ps aux | grep -c "[p]laywright\|[v]itest")
    env "$@" BASE=http://127.0.0.1:$port PWOUT=$CS/pw-out-$TAG npx playwright test -c .acc5crit7/pw.config.ts front-rate --project=$eng > $CS/logs/g10-$TAG-$label-$eng.log 2>&1
    local rc=$?
    echo "$label $eng exit $rc · load $ld · sib $sib · tree gridPaths $(shasum src/pencil/grid/gridPaths.ts | cut -c1-12) plant $(shasum $PT/src/pencil/grid/gridPaths.ts | cut -c1-12) :: $(grep -o 'G10 [a-z]* .*' $CS/logs/g10-$TAG-$label-$eng.log | sed 's/^G10 [a-z]* //' | tr '\n' '|') :: $(grep -m1 'Error: ' $CS/logs/g10-$TAG-$label-$eng.log | sed 's/^ *//' | cut -c1-160)"
  done
}
MODE=${MODE:-gated}
if [ "$MODE" = slow ]; then run slow49 4245 CLOCK=driven; fi
if [ "$MODE" = gated ]; then
  for i in $(seq 1 $N); do run gated$i 4243 CLOCK=driven; done
  run ablated 4245 CLOCK=driven
elif [ "$MODE" = floor16 ]; then
  for i in $(seq 1 $N); do ENGS=webkit run floor16-$i 4245 CLOCK=driven; done
  ENGS=webkit run floor16-hz60 4245 CLOCK=driven HZ=60 TESTDIR=$CS/spec
  ENGS=webkit run tree-hz60 4243 CLOCK=driven HZ=60 TESTDIR=$CS/spec
  ENGS=webkit run tree-hz60b 4243 CLOCK=driven HZ=60 TESTDIR=$CS/spec
  ENGS=chromium run tree-hz60 4243 CLOCK=driven HZ=60 TESTDIR=$CS/spec
fi
echo ALLDONE $(date +%T)
