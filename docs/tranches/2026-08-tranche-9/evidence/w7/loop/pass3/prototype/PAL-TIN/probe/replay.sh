#!/bin/sh
set -u
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
P2=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-58
WT=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2
FILES="e2e/multiplayer.spec.ts package.json src/assets/index.css src/games/posters.test.ts src/games/shared/BoardHost.vue src/games/shared/DifficultyTally.vue src/games/shared/DigitCell.vue src/games/shared/GameControlPanel.vue src/games/shared/PosterBoard.test.ts src/games/shared/defineGame.ts src/games/shared/playerIdentity.ts src/games/shared/useGameState.ts src/games/shared/useSession.test.ts src/games/shared/useSession.ts src/games/shared/useStagingBridge.test.ts src/pencil/config/pencilConfig.ts src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue"
for f in $FILES; do
  git merge-file -L fold-74a2b5d9 -L base-a8fee1f5 -L pass2 \
    "$WT/web/frontend/$f" "$SP/base-a8fee1f5/web/frontend/$f" "$P2/web/frontend/$f"
  echo "$? $f"
done
cp "$P2/web/frontend/src/games/shared/PlayerTick.vue" "$WT/web/frontend/src/games/shared/PlayerTick.vue"
cp "$P2/web/frontend/scripts/check-peer-tin.mjs" "$WT/web/frontend/scripts/check-peer-tin.mjs"
echo "new files copied"
