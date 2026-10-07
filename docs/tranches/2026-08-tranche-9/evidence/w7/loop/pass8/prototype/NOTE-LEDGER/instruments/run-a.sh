#!/bin/bash
# run-a.sh : batch A — the behavioural reserve row on the tree (:4249) and the control (:4250), then π tree vs control
P=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger8/p8
bash $P/bin/spec8.sh reserve-tree 4249 note-reserve.spec.ts
bash $P/bin/spec8.sh reserve-control 4250 note-reserve.spec.ts
bash $P/bin/probe.sh pi-tree tree 4249 pi
echo RUN-A-DONE >> $P/q/spec-reserve-tree.log
