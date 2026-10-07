#!/bin/bash
# PLR-SELF pass 8 (resumed) · the key sweep on the HOOKED SCRATCH COPY (:4250), one engine per invocation.
e=$1
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend
echo "LOAD start $(sysctl -n vm.loadavg)"
BASE=http://127.0.0.1:4250 CELLS="$(cat /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself8r/cells.json)" OUT=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself8r/readings/sweep-$e.jsonl TM=p8-sweep npx playwright test --config /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself8r/probe/pw.mts --project $e --timeout 3600000 > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself8r/logs/sweep-$e.log 2>&1
echo "SWEEP $e exit $? LOAD $(sysctl -n vm.loadavg)"
echo SWEEP-DONE
