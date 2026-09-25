#!/bin/bash
for T in "$@"; do
  cd $T
  echo "## $T"
  for s in lint:copy lint:theme-tokens lint:sleep lint:lanes lint:motion test:e2e:projects lint; do
    npm run -s $s > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklivecrit7/logs/lint-$s.out 2>&1; e=$?
    echo "$s EXIT $e :: $(tail -1 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklivecrit7/logs/lint-$s.out | cut -c1-160)"
  done
done
