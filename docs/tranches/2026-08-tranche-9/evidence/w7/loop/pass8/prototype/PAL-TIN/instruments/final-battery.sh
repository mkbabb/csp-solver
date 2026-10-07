#!/bin/bash
# PAL-TIN pass 8 · FINAL browser battery on the unedited tree: the WHOLE spec file per engine (DPR 1),
# then §2b four more times per engine (row 4: ≥ 5 clean runs per engine), then §2b at DPR 2 per engine.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tin8
for e in chromium webkit; do ENGINES=$e bash $S/spec.sh 1 fin-whole; done
for r in 2 3 4 5; do for e in chromium webkit; do ENGINES=$e bash $S/spec.sh 1 fin-s2b-r$r "§2b"; done; done
for e in chromium webkit; do ENGINES=$e bash $S/spec.sh 2 fin-s2b "§2b"; done
echo ALLDONE > $S/logs/final-battery.done
