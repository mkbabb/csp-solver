#!/bin/bash
# r2 accent-kinship's MOVED probe (pass-4 PAL-WALK copy, OUT re-pointed), re-run once: tree (4244) and control (4246), both engines, dpr 1.
for arm in tree:4244 control:4246; do n=${arm%%:*}; p=${arm#*:}; for e in chromium webkit; do
  mkdir -p /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/kin-$n-$e
  KIN_OUT=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/kin-$n-$e BASE=http://127.0.0.1:$p WALK_DIR=./kin WALK_MATCH='accent-kinship\.probe\.ts$' /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/run.sh kin-$n $e 1
done; done
echo KIN_DONE >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/logs/runs.txt
