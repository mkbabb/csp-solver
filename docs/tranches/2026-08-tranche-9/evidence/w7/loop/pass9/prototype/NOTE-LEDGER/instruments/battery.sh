#!/bin/bash
# battery.sh <label> <frontend dir> : each gate bare, exit written to the log by this script
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-LEDGER
LB=$1; FE=$2; LOG=$S/logs/battery-$LB.tsv; cd $FE; : > $LOG
run() { local n=$1; shift; local t0=$(date +%s); "$@" > $S/logs/bat-$LB-$n.txt 2>&1; local e=$?; echo -e "$n\t$e\t$(( $(date +%s)-t0 ))s\tload $(uptime | sed 's/.*averages: //')" >> $LOG; }
run vue-tsc-b npx vue-tsc -b
run typecheck-e2e npx vue-tsc --noEmit -p tsconfig.e2e.json
run lint-ink node scripts/check-ink-pressure.mjs --self-test
run lint-copy node scripts/check-copy-register.mjs --self-test
run copy-register node scripts/check-copy-register.mjs
run lint-motion node scripts/check-motion-contract.mjs --self-test
run lint-knip npx knip
run prettier npx prettier --check --config .prettierrc.json src/ scripts/
run eslint-changed npx eslint --max-warnings 0 scripts/check-ink-pressure.mjs e2e/note-reserve.spec.ts src/games/shared/GameBoard.vue src/games/shared/GameBoard.notes.test.ts
run font-coverage node scripts/check-font-coverage.mjs --self-test
run pw-projects node scripts/check-pw-projects.mjs
run lint-theme-tokens node scripts/check-theme-tokens.mjs --self-test
echo DONE >> $LOG
