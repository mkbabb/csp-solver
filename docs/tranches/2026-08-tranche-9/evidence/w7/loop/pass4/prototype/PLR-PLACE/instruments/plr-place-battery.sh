#!/bin/zsh
# PLR-PLACE pass-4 mechanical battery — every gate bare, its exit on its own line.
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE/web/frontend
run() { local name=$1; shift; echo "=== $name"; "$@" > .plr-place/g-$name.log 2>&1; local rc=$?; tail -4 .plr-place/g-$name.log; echo "EXIT[$name]=$rc"; }
run tsc-b npx vue-tsc -b
run tsc-e2e npx vue-tsc --noEmit -p tsconfig.e2e.json
run copy node scripts/check-copy-register.mjs --self-test
run copy-bare node scripts/check-copy-register.mjs
run font node scripts/check-font-coverage.mjs
run motion node scripts/check-motion-contract.mjs --self-test
run projects node scripts/check-pw-projects.mjs --self-test
run theme-tokens node scripts/check-theme-tokens.mjs --self-test
run live-regions node scripts/check-live-regions.mjs --self-test
run prettier npx prettier --check --config .prettierrc.json src/ scripts/
run eslint npx eslint src e2e/player-place.spec.ts e2e/player-mark.spec.ts
run boundary npx eslint --no-config-lookup --config eslint.boundary.config.js src/games
run knip npx knip
run vt-playermark npx vitest run src/pencil/chrome
run vt-shared npx vitest run src/games/shared
run vt-rest npx vitest run src --exclude 'src/games/shared/**' --exclude 'src/pencil/chrome/**'
echo "=== BATTERY DONE"
