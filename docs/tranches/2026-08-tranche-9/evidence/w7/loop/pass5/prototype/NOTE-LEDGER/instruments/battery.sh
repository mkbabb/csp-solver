#!/bin/bash
# NOTE-LEDGER pass 5 — the pre-return battery (registry-v4 §2.11), each gate BARE, run on the
# work tree and on the read-only control, exit codes side by side. Usage: battery.sh <gate...>
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
L=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger/battery
mkdir -p $L
run() { # name, command
  (cd $W && eval "$2" > $L/proto-$1.log 2>&1); p=$?
  (cd $C && eval "$2" > $L/control-$1.log 2>&1); c=$?
  printf "%-22s proto=%s control=%s   | %s\n" "$1" "$p" "$c" "$(tail -1 $L/proto-$1.log | cut -c1-110)"
}
for g in "$@"; do
  case $g in
    lanes) run lanes "node scripts/check-lane-membership.mjs --self-test";;
    theme-tokens) run theme-tokens "node scripts/check-theme-tokens.mjs --self-test";;
    sleep) run sleep "node scripts/check-sleep-lint.mjs --self-test";;
    e2e-projects) run e2e-projects "node scripts/check-pw-projects.mjs --self-test";;
    pw-projects) run pw-projects "node scripts/check-pw-projects.mjs";;
    eslint) run eslint "npx eslint .";;
    prettier) run prettier "npx prettier --check --config .prettierrc.json src/ scripts/ ../../scripts/ ../relay/";;
    copy) run copy "node scripts/check-copy-register.mjs --self-test";;
    ink) run ink "node scripts/check-ink-pressure.mjs --self-test";;
    motion) run motion "node scripts/check-motion-contract.mjs --self-test";;
    live-regions) run live-regions "node scripts/check-live-regions.mjs --self-test";;
    boundary) run boundary "npx eslint --no-config-lookup --config eslint.boundary.config.js src/games";;
    knip) run knip "npx knip";;
    font-coverage) run font-coverage "node scripts/check-font-coverage.mjs";;
    vue-tsc) run vue-tsc "npx vue-tsc --noEmit -p tsconfig.json";;
  esac
done
