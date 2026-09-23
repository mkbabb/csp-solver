#!/bin/bash
C=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc5crit6
cd /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc5crit6
run() { local label=$1 port=$2; shift 2
  for eng in chromium webkit; do
    env "$@" BASE=http://127.0.0.1:$port npx playwright test -c /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc5crit6/pw.config.ts front-rate.spec.ts --project=$eng > $C/logs/g10-$label-$eng.log 2>&1
    local rc=$?
    echo "$label $eng exit $rc :: $(grep -o 'G10 [a-z]* .*' $C/logs/g10-$label-$eng.log | sed 's/^G10 [a-z]* //' | tr '\n' '|') :: $(grep -m1 -o 'Error: .*' $C/logs/g10-$label-$eng.log | cut -c1-150)"
  done
}
run gated-driven 4241 CLOCK=driven
run ablated-driven 4243 CLOCK=driven
run gated-60 4241 CLOCK=60
run ablated-60-off 4243 CLOCK=60 PRECOND=0
echo G10-DONE
