#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad; F=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend
cd $F; echo "load0=$(uptime | sed 's/.*averages: //') sibs=$(pgrep -f 'node|playwright|vitest' | wc -l | tr -d ' ')"
npx playwright test --config .erase7/pw.probe.config.ts clock.probe.ts > $S/erase7s-logs/clock-probe.log 2>&1; echo "CLOCK exit=$? load1=$(uptime | sed 's/.*averages: //')"
