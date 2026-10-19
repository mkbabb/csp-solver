#!/bin/bash
# seq.sh "<tag> <port> <project> <match> [env...]" ... : runs pw.sh rows one after another
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-MOT-VERB
for row in "$@"; do $S/bin/pw.sh $row; echo "$row :: $(cat $S/logs/pw-${row%% *}.exit)" >> $S/logs/seq.txt; done
echo SEQDONE >> $S/logs/seq.txt
