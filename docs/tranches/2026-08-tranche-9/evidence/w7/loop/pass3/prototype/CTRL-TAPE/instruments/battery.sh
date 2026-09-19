#!/bin/zsh
# CTRL-TAPE pass 3 — the mechanical battery, as ONE script (the stall law). Every gate runs
# BARE: no pipe eats an exit code, and each code is banked beside its name.
FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-27/web/frontend
LOG=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/CTRL-TAPE/logs
cd "$FE" || exit 9

run() {
  name=$1; shift
  echo "===== $name" >> "$LOG/battery.txt"
  "$@" > "$LOG/$name.txt" 2>&1
  code=$?
  echo "EXIT $name = $code" >> "$LOG/battery.txt"
  tail -6 "$LOG/$name.txt" >> "$LOG/battery.txt"
}

: > "$LOG/battery.txt"
run check-theme-selectors node scripts/check-theme-selectors.mjs
run check-copy-register node scripts/check-copy-register.mjs
run check-font-coverage node scripts/check-font-coverage.mjs
run lint-motion npm run lint:motion
run prettier npx prettier --check "src/**/*.{ts,vue,css}" "e2e/**/*.ts" "scripts/**/*.mjs"
run vue-tsc npx vue-tsc -b
run vitest npx vitest run
echo "BATTERY DONE" >> "$LOG/battery.txt"
