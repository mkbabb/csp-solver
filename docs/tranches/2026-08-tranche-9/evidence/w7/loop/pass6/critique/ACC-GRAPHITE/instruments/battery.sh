#!/bin/bash
L=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg6crit/battery.tsv; : > $L
row(){ name=$1; shift; ( "$@" ) > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg6crit/bat-$name.log 2>&1; echo -e "$name\t$?" >> $L; }
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend
row tree-copy-register node scripts/check-copy-register.mjs
row tree-theme-tokens-self node scripts/check-theme-tokens.mjs --self-test
row tree-ink-pressure node scripts/check-ink-pressure.mjs
row tree-ink-pressure-self node scripts/check-ink-pressure.mjs --self-test
row tree-lint-theme-tokens npm run -s lint:theme-tokens
row tree-lint-lanes npm run -s lint:lanes
row tree-lint-sleep npm run -s lint:sleep
row tree-e2e-projects npm run -s test:e2e:projects
row tree-check-pw-projects node scripts/check-pw-projects.mjs
row tree-property-block node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/check-property-block.mjs --fe /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend
row tree-undef-census env FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/undefined-token-census.mjs
row tree-filter-census env BASE=http://127.0.0.1:4243 npx playwright test -c .accg6crit/pw.e2e.config.ts
row ctrl-filter-census env BASE=http://127.0.0.1:4244 npx playwright test -c .accg6crit/pw.e2e.config.ts
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
row ctrl-copy-register node scripts/check-copy-register.mjs
row ctrl-ink-pressure node scripts/check-ink-pressure.mjs
row ctrl-property-block node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/check-property-block.mjs --fe /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
row ctrl-undef-census env FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/undefined-token-census.mjs
echo DONE >> $L
