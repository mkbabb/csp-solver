#!/bin/bash
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend
O=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6p7-yield
cd $W; echo "spec sha1 $(shasum e2e/count-yield.spec.ts | cut -c1-12) MarginNote $(shasum src/pencil/chrome/MarginNote.vue | cut -c1-12) GameBoard $(shasum src/games/shared/GameBoard.vue | cut -c1-12) load $(uptime | sed 's/.*averages: //' | cut -d' ' -f1)"
for e in chromium webkit; do BASE=http://127.0.0.1:4237 PWOUT=$O/pw-tree-$e npx playwright test -c .acc6p7/pw.config.ts e2e/count-yield.spec.ts --project=$e > $O/tree-$e.log 2>&1; echo "tree $e exit $? :: $(grep -o 'YIELD .*' $O/tree-$e.log | tr '\n' '|')"; done
$O/neg.sh
