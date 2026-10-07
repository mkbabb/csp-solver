#!/bin/bash
# ring8 over {tree :4230, control :4252} × {chromium, webkit} × {light, dark}, cell coarse1280
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tape8
HOME_LIB=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-27/web/frontend/e2e/lib/edge-bands.mjs
TAG=${1:-tree}; PORT=${2:-4230}; CELL=${3:-coarse1280}
for e in chromium webkit; do for sc in light dark; do
  node $S/instr/ring8.mjs http://127.0.0.1:$PORT/ $TAG $e $sc $CELL $HOME_LIB
  echo "EXIT $TAG $e $sc $CELL $?"
done; done
