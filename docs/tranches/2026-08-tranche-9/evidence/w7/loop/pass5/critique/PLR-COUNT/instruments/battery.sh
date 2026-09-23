#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-count
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
run() { local where="$1" name="$2"; shift 2; ( cd "$where" && "$@" > $S/gate.out 2>&1 ); local rc=$?; echo "EXIT[$name]=$rc"; if [ $rc -ne 0 ]; then tail -4 $S/gate.out | cut -c1-240 | sed 's/^/    /'; fi; }
for side in tree control; do
  D=$T; [ $side = control ] && D=$C
  echo "##### $side"
  [ $side = tree ] && run $D vue-tsc-b npx vue-tsc -b
  run $D typecheck-e2e npx vue-tsc --noEmit -p tsconfig.e2e.json
  run $D eslint npx eslint .
  run $D prettier-check npm run -s lint
  run $D lint:lanes npm run -s lint:lanes
  run $D lint:theme-tokens npm run -s lint:theme-tokens
  run $D lint:sleep npm run -s lint:sleep
  run $D test:e2e:projects npm run -s test:e2e:projects
  run $D check-copy-register-bare node scripts/check-copy-register.mjs
  run $D lint:copy npm run -s lint:copy
  run $D test:font-coverage npm run -s test:font-coverage
  run $D lint:motion npm run -s lint:motion
  run $D lint:live-regions npm run -s lint:live-regions
  run $D lint:knip npm run -s lint:knip
  run $D lint:boundary npm run -s lint:boundary
done
echo "### DONE"
