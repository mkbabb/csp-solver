#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend
echo "load $(sysctl -n vm.loadavg)"; shasum e2e/player-tally.spec.ts e2e/player-mark.spec.ts src/pencil/chrome/PlayerMark/PlayerMark.vue
npx playwright test -c .plrc7crit/pw.config.ts player-tally.spec.ts > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrc7crit/logs/tally-whole.log 2>&1; echo "EXIT[tally]=$? load $(sysctl -n vm.loadavg)"
npx playwright test -c .plrc7crit/pw.config.ts player-mark.spec.ts > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrc7crit/logs/mark-whole.log 2>&1; echo "EXIT[mark]=$? load $(sysctl -n vm.loadavg)"
PLRC_DIR=. npx playwright test -c .plrc7crit/pw.config.ts crit7.spec.ts -g "quiet lines paint" > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrc7crit/logs/crit-g14.log 2>&1; echo "EXIT[critg14]=$? load $(sysctl -n vm.loadavg)"
echo RUN1-DONE
