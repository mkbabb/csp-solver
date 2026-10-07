#!/bin/bash
# PLR-PLACE pass 8 · whole-file e2e on the TREE (dev :4243, unedited during the run), the relay arm,
# π on a room (tree dev vs 74a2b5d9-archive dev :4251), the control roster's AA. No set -e.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/place8
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE/web/frontend
L=$S/logs/estate.txt; export P8_PORT=4243 P8_WK=1
cd $T
sha() { shasum $T/src/pencil/chrome/PlayerMark/PlayerMark.vue $T/src/App.vue $T/src/pencil/chrome/PlayerMark/PlayerLobby.vue $T/e2e/player-place.spec.ts $T/e2e/player-mark.spec.ts | cut -c1-12 | tr '\n' ' '; }
echo "== start $(date +%T) load $(uptime | sed 's/.*averages: //') sha $(sha)" >> $L
npx playwright test -c .place8/pw.config.ts e2e/player-place.spec.ts > $S/logs/es-place.log 2>&1; echo "player-place exit=$?" >> $L; grep -E "passed|failed|skipped|flaky" $S/logs/es-place.log | tail -4 >> $L
npx playwright test -c .place8/pw.config.ts e2e/player-mark.spec.ts e2e/session-substrate.spec.ts e2e/presence.spec.ts e2e/join-language-prm.spec.ts e2e/multiplayer.spec.ts > $S/logs/es-estate.log 2>&1; echo "estate exit=$?" >> $L; grep -E "passed|failed|skipped|flaky|✘" $S/logs/es-estate.log | tail -20 >> $L
T62_REAL_RELAY=1 npx playwright test -c .place8/pw.config.ts e2e/multiplayer.spec.ts -g "the real relay carries the board" > $S/logs/es-relay.log 2>&1; echo "relay exit=$?" >> $L; grep -E "✓|✘|passed|failed|skipped" $S/logs/es-relay.log | tail -4 >> $L
OUT=$S/readings/pi-room.jsonl MINE=http://127.0.0.1:4243 CTRL=http://127.0.0.1:4251 P8_PI=room npx playwright test -c .place8/pw.config.ts .place8/p8-pi.spec.ts > $S/logs/es-piroom.log 2>&1; echo "pi-room exit=$?" >> $L; grep P8PIROOM $S/logs/es-piroom.log >> $L
P8_PORT=4251 P8_OUT=$S/readings P8_WHAT=aa-roster P8_ARM=control-74a2b5d9 npx playwright test -c .place8/pw.config.ts .place8/p8-census.spec.ts > $S/logs/es-aaroster.log 2>&1; echo "aa-roster exit=$?" >> $L
echo "DONE $(date +%T) load $(uptime | sed 's/.*averages: //') sha $(sha)" >> $L
