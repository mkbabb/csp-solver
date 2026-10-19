#!/bin/bash
# stage5.sh : boot-t4's one Chromium S red (4/56 bakes under the hand, native arm) re-read x5 per engine on the same
# t4 listener, before the read is called: never re-baseline (nor convict) on a single red
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-VERB
for k in 1 2 3 4 5; do $S/bin/rows.sh boot-t4r$k 4246 'boot-hand\.spec\.ts' chromium webkit; done
echo STAGE5-DONE >> $S/logs/rows.tsv
