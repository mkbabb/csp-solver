#!/bin/bash
for e in chromium webkit; do for a in "http://127.0.0.1:4234 tree" "http://127.0.0.1:4251 control"; do set -- $a; node /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-face8/probe/sideways.mjs $e $1 $2; echo "exit $? $e $2"; done; done
