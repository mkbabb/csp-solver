#!/bin/bash
# ACC-SIX pass 7 · G10 on THIS tree with FIVE's A.6 cure by sha (gridPaths frontGate, HandDrawnGrid, DifficultyTally,
# pencilConfig MOTION.hand.stepMs, e2e/front-rate.spec.ts): gated x N per engine on the tree's dev (:4237), the
# FRONT_MIN_MS -> 0 plant on :4239 (an in-memory rewrite, no tree file written), CLOCK=60 on the tree. Bare exits.
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend
O=${O:-/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6p7-g10}
N=${N:-6}; cd $W
run() { local label=$1 port=$2; shift 2
  for eng in ${ENGS:-chromium webkit}; do
    local ld=$(uptime | sed 's/.*averages: //' | cut -d' ' -f1) sib=$(ps aux | grep -c "[p]laywright\|[v]itest")
    env "$@" BASE=http://127.0.0.1:$port PWOUT=$O/pw-$label-$eng npx playwright test -c .acc6p7/pw.config.ts e2e/front-rate.spec.ts --project=$eng > $O/g10-$label-$eng.log 2>&1
    local rc=$?
    echo "$label $eng exit $rc · load $ld · sib $sib · gridPaths $(shasum src/pencil/grid/gridPaths.ts | cut -c1-12) spec $(shasum e2e/front-rate.spec.ts | cut -c1-12) :: $(grep -o 'G10 [a-z]* .*' $O/g10-$label-$eng.log | sed 's/^G10 //' | tr '\n' '|') :: $(grep -m1 'Error: ' $O/g10-$label-$eng.log | sed 's/^ *//' | cut -c1-160)"
  done
}
for i in $(seq 1 $N); do run gated$i 4237 CLOCK=driven; done
[ -z "$NOPLANT" ] && run ablated 4239 CLOCK=driven
[ -z "$NOPLANT" ] && run clock60 4237 CLOCK=60
echo ALLDONE $(date +%T)
