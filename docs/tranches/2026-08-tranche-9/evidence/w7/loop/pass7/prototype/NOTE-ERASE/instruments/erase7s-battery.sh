#!/bin/bash
# The pre-return battery, each gate BARE (its own exit), tree vs the 74a2b5d9 archive control.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
I6=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend; C=$S/erase7-base/web/frontend
echo "sha1 MarginNote=$(shasum $T/src/pencil/chrome/MarginNote.vue | cut -c1-12) ctt=$(shasum $T/scripts/check-theme-tokens.mjs | cut -c1-12) spec=$(shasum $T/e2e/affordances.spec.ts | cut -c1-12) load=$(uptime | sed 's/.*averages: //')"
run() { name=$1; shift; for arm in tree control; do D=$T; [ $arm = control ] && D=$C; cd $D; "$@" > $S/erase7s-logs/bat-$name-$arm.log 2>&1; echo "$arm=$?"; done | tr '\n' ' ' | sed "s/^/$name: /"; echo; }
run lint-lanes npm run -s lint:lanes
run lint-theme-tokens npm run -s lint:theme-tokens
run lint-sleep npm run -s lint:sleep
run lint-motion npm run -s lint:motion
run lint-copy npm run -s lint:copy
run lint-ink npm run -s lint:ink
run test-e2e-projects npm run -s test:e2e:projects
run check-pw-projects node scripts/check-pw-projects.mjs
run check-copy-register node scripts/check-copy-register.mjs
run eslint npx eslint .
run npm-lint npm run -s lint
run typecheck-e2e npm run -s typecheck:e2e
for arm in tree control; do D=$T; [ $arm = control ] && D=$C; node $I6/check-property-block.mjs --fe $D > $S/erase7s-logs/bat-cpb-src-$arm.log 2>&1; echo -n "check-property-block source $arm=$? "; done; echo
node $I6/check-property-block.mjs --fe $T --self-test > $S/erase7s-logs/bat-cpb-self.log 2>&1; echo "check-property-block --self-test tree=$?"
node $I6/check-property-block.mjs --fe $T --dist $S/erase7s-dist-tree --served http://127.0.0.1:4248 > $S/erase7s-logs/bat-cpb-served-tree.log 2>&1; echo -n "check-property-block served tree(:4248)=$? "
node $I6/check-property-block.mjs --fe $C --dist /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend/dist --served http://127.0.0.1:4249 > $S/erase7s-logs/bat-cpb-served-control.log 2>&1; echo "control(:4249)=$?"
for arm in tree control; do D=$T; [ $arm = control ] && D=$C; FE=$D node $I6/undefined-token-census.mjs > $S/erase7s-logs/bat-census-$arm.log 2>&1; echo -n "census $arm=$? "; FE=$D node $I6/undefined-token-census.mjs --self-test > $S/erase7s-logs/bat-census-self-$arm.log 2>&1; echo -n "census-self $arm=$? "; done; echo
echo "BATDONE load=$(uptime | sed 's/.*averages: //')"
