#!/bin/bash
R=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tincrit6/run.sh; L=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tincrit6/lane2b.sh
$R tree-cr-1 4241 chromium 1 6
$R ctrl-cr-1 4242 chromium 1 6
$L plant-faint-2b-cr-1 4243 chromium 1 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tincrit6-plant/web/frontend/e2e
$R plant-faint-cr-1 4243 chromium 1 6
$R tree-wk-1 4241 webkit 1 6
$R ctrl-wk-1 4242 webkit 1 6
$L plant-faint-2b-wk-1 4243 webkit 1 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tincrit6-plant/web/frontend/e2e
$R tree-cr-2 4241 chromium 2 6
$R ctrl-cr-2 4242 chromium 2 6
echo SEQ1DONE > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tincrit6/logs/seq1.done
