#!/bin/bash
# stage4.sh : the final bytes (t4): boot-hand and GA1 re-read on t4, both engines
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-VERB
$S/bin/swap.sh t4 > $S/logs/swap-t4.log 2>&1
$S/bin/rows.sh boot-t4 4246 'boot-hand\.spec\.ts' chromium webkit
$S/bin/rows.sh ga1-t4 4246 'fold-verb\.spec\.ts' chromium webkit
# pi on the final bytes: t4 against the pass-8 bytes (4247 = dist-bt) and t4 against itself (the noise floor)
PI_A=4246 PI_B=4247 VERB_TESTDIR=$S/spec $S/bin/rows.sh pi-t4-bt 4246 'pi-rest\.spec\.ts' chromium webkit
PI_A=4246 PI_B=4246 VERB_TESTDIR=$S/spec $S/bin/rows.sh pi-t4-t4 4246 'pi-rest\.spec\.ts' chromium webkit
PI_PRM=0 PI_A=4246 PI_B=4246 VERB_TESTDIR=$S/spec $S/bin/rows.sh pi-t4-t4-live 4246 'pi-rest\.spec\.ts' chromium
echo STAGE4-DONE >> $S/logs/rows.tsv
