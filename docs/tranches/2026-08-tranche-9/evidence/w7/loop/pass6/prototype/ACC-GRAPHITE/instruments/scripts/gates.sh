#!/bin/bash
# The pre-return battery, each gate BARE (exit code unpiped), tree then control; scratch parked outside.
TREE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend; CTRL=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend; P=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg6/accg6-parked-gates; mkdir -p $P
until grep -q ALLDONE /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg6/estate.tsv; do sleep 5; done
mv /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend/.accg6 $P/
: > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg6/gates.tsv
run() { name="$1"; shift; for arm in tree ctrl; do d=$TREE; [ $arm = ctrl ] && d=$CTRL; ( cd $d && FE=$d "$@" > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg6/gate-$name-$arm.log 2>&1 ); echo -e "$name\t$arm\t$?" >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg6/gates.tsv; done; }
run copy-register node scripts/check-copy-register.mjs
run copy-register-selftest node scripts/check-copy-register.mjs --self-test
run theme-tokens-selftest node scripts/check-theme-tokens.mjs --self-test
run ink-pressure node scripts/check-ink-pressure.mjs
run ink-pressure-selftest node scripts/check-ink-pressure.mjs --self-test
run lint-theme-tokens npm run -s lint:theme-tokens
run lint-lanes npm run -s lint:lanes
run lint-sleep npm run -s lint:sleep
run lint-motion npm run -s lint:motion
run test-e2e-projects npm run -s test:e2e:projects
run check-pw-projects node scripts/check-pw-projects.mjs
run knip npx knip
run eslint npx eslint .
run prettier npm run -s lint
mv $P/.accg6 /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend/
echo ALLDONE >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg6/gates.tsv
