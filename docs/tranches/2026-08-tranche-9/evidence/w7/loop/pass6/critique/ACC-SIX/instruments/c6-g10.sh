#!/bin/bash
# critic G10: the tree's front-rate spec (copy + min-gap print), dev :4246, driven clock; webkit x6, chromium x3, CLOCK=60 negative per engine
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend
run() { local tag=$1 eng=$2; shift 2; env "$@" BASE=http://127.0.0.1:4246 npx playwright test -c /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6crit6/pw.config.ts --project=$eng > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6crit6/logs/g10-$tag-$eng.log 2>&1; local rc=$?; echo "$tag $eng exit $rc :: $(grep -o 'G10 [a-z]* .*' /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6crit6/logs/g10-$tag-$eng.log | sed 's/^G10 [a-z]* //' | tr '\n' '|' | cut -c1-900)"; }
for i in 1 2 3 4 5 6; do run gated$i webkit CLOCK=driven; done
for i in 1 2 3; do run gated$i chromium CLOCK=driven; done
run clock60 webkit CLOCK=60; run clock60 chromium CLOCK=60
echo ALLDONE
