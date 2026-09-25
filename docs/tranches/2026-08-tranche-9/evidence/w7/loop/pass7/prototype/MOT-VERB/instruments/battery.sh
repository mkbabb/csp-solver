#!/bin/bash
# battery.sh — the pre-return battery, each gate BARE (exit captured first), tree beside control.
run() { # name, dir, cmd...
  local n=$1 d=$2; shift 2
  ( cd $d && "$@" ) > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb7/logs/bat-$([ $d = /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend ] && echo tree || echo ctl)-${n}.log 2>&1
  echo $?
}
row() { local n=$1; shift; t=$(run $n /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend "$@"); c=$(run $n /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb7/ctl-arch2/web/frontend "$@"); echo "ROW $n tree $t control $c"; }
row lint-copy node scripts/check-copy-register.mjs --self-test
row lint-lanes node scripts/check-lane-membership.mjs --self-test
row lint-theme-tokens node scripts/check-theme-tokens.mjs --self-test
row lint-sleep node scripts/check-sleep-lint.mjs --self-test
row lint-bands node scripts/check-motion-bands.mjs --self-test
row lint-verbs bash -c "node scripts/publish-verbs.mjs --check && node scripts/check-pencil-verbs.mjs --self-test"
row lint-motion node scripts/check-motion-contract.mjs --self-test
row e2e-projects node scripts/check-pw-projects.mjs --self-test
row eslint npx eslint .
row prettier npx prettier --check --config .prettierrc.json src/ scripts/ ../../scripts/ ../relay/
t=$(run cpb-src /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/check-property-block.mjs --fe /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend --self-test); c=$(run cpb-src /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb7/ctl-arch2/web/frontend node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/check-property-block.mjs --fe /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb7/ctl-arch2/web/frontend --self-test); echo "ROW cpb-selftest tree $t control $c"
t=$(run cpb-served /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/check-property-block.mjs --fe /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend --dist /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb7/d1 --served http://127.0.0.1:4247); c=$(run cpb-served /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb7/ctl-arch2/web/frontend node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/check-property-block.mjs --fe /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb7/ctl-arch2/web/frontend --dist /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend/dist --served http://127.0.0.1:4248); echo "ROW cpb-served tree $t control $c"
echo BATTERY-DONE
