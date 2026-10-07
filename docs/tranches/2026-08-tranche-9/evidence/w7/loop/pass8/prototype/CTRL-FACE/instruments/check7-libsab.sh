#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-33/web/frontend
for c in sfc-toplevel at-own wildcard tw-split tpl-file script-css script-shorthand script-style-object svg-presentation tw-var-shorthand csstext style-computed-key setprop-computed const-carried collect-walk; do
  out=$(SHAPE_SABOTAGE=$c node scripts/check-font-coverage.mjs 2>&1); ex=$?
  echo "LIBSAB $c exit=$ex :: $(echo "$out" | grep -o 'plant "[^"]*" did not red\|LAWFUL form ([^:]*\|the face law (check 7): [^ ]*' | head -3 | tr '\n' ';')"
done
echo DONE
