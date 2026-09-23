#!/bin/bash
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
for eng in chromium webkit; do
  node $SP/nlcrit6-probe.mjs $eng crit push,land,aa,pi > $SP/nlcrit6-logs/probe-$eng.log 2>&1
  echo "$eng exit=$? rows=$(grep -c '^ROW' $SP/nlcrit6-logs/probe-$eng.log) $(grep -m1 '^ERR' $SP/nlcrit6-logs/probe-$eng.log)"
done; echo PROBE-DONE
