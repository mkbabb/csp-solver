#!/bin/bash
N=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrplace7c-work
B=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrplace7c-build/web/frontend
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE/web/frontend
O=$N/estate.txt
sh() { echo "sha1 $1 served-copy PlayerMark $(shasum $B/src/pencil/chrome/PlayerMark/PlayerMark.vue | cut -c1-12) App $(shasum $B/src/App.vue | cut -c1-12) HeadSheet $(shasum $B/src/pencil/chrome/AttributionCard/HeadSheet.vue | cut -c1-12) | specs place $(shasum e2e/player-place.spec.ts | cut -c1-12) mark $(shasum e2e/player-mark.spec.ts | cut -c1-12)" >> $O; }
cnt() { grep -E '^\s+[0-9]+ (passed|failed|skipped|flaky|did not run)' $1 | tr -s ' ' | tr '\n' ' '; }
sh start
for pr in chromium webkit; do
  echo "load $(uptime | sed 's/.*averages: //') procs $(ps aux | grep -cE '[n]ode|[p]laywright|[v]itest')" >> $O
  PLC_PORT=4245 npx playwright test -c .plr-place/pw.config.ts e2e/player-place.spec.ts --project=$pr > $N/est-place-$pr.log 2>&1; echo "player-place.spec.ts $pr exit=$? $(cnt $N/est-place-$pr.log)" >> $O
  echo "load $(uptime | sed 's/.*averages: //')" >> $O
  PLC_PORT=4245 npx playwright test -c .plr-place/pw.config.ts e2e/player-mark.spec.ts e2e/session-substrate.spec.ts e2e/presence.spec.ts e2e/join-language-prm.spec.ts e2e/multiplayer.spec.ts --project=$pr > $N/est-other-$pr.log 2>&1; echo "player-mark+session-substrate+presence+join-language-prm+multiplayer $pr exit=$? $(cnt $N/est-other-$pr.log)" >> $O
done
echo "load $(uptime | sed 's/.*averages: //')" >> $O
PLC_PORT=4245 npx playwright test -c .plr-place/pw.config.ts e2e/player-place.spec.ts -g "(7 · a tapped|15 ·)" --repeat-each 5 > $N/rep-7-15.log 2>&1; echo "rows 7 + 15 x5 both engines exit=$? $(cnt $N/rep-7-15.log)" >> $O
sh end
echo DONE >> $O
