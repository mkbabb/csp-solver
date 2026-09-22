#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend
run(){ echo "=== $*"; "$@" > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg-crit/gate.out 2>&1; rc=$?; tail -4 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg-crit/gate.out; echo "EXIT $rc :: $*"; }
run node scripts/check-copy-register.mjs
run node scripts/check-copy-register.mjs --self-test
run node scripts/check-ink-pressure.mjs
run node scripts/check-ink-pressure.mjs --self-test
run node scripts/check-theme-tokens.mjs
run node scripts/check-theme-tokens.mjs --self-test
run node scripts/check-motion-contract.mjs --self-test
run node scripts/check-font-coverage.mjs
run npx knip
run npx prettier --check --config .prettierrc.json src/ scripts/
run npx eslint src scripts e2e
run npx vue-tsc -b --force
echo ALLDONE
