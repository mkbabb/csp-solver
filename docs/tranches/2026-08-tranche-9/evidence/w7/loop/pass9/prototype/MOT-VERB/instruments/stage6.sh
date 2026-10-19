#!/bin/bash
# stage6.sh : the mask probe on t4 (π's sensitivity: does the masked element paint?)
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-VERB
VERB_TESTDIR=$S/spec $S/bin/rows.sh mask-t4 4246 'mask-probe\.spec\.ts' chromium webkit
# live t4 vs the pass-8 bytes (4247 = dist-bt): the live noise floor t4-t4 read 0 px on 4/4 cells, so the t3-bt
# live differences are re-read on the final bytes, both engines, and a t4-t4 live floor in WebKit
PI_PRM=0 PI_A=4246 PI_B=4247 VERB_TESTDIR=$S/spec $S/bin/rows.sh pi-t4-bt-live 4246 'pi-rest\.spec\.ts' chromium webkit
PI_PRM=0 PI_A=4246 PI_B=4246 VERB_TESTDIR=$S/spec $S/bin/rows.sh pi-t4-t4-live 4246 'pi-rest\.spec\.ts' webkit
# the S clause's reds on t4 (Chromium native, 4/56 and 8/56 bakes in the ruling): the same rows on the pass-8 bytes
# (4247 = LADDER's dist-bt) at the same hour's load, x3, so the red is attributed to the bytes or to the regime
for k in 1 2 3; do $S/bin/rows.sh boot-bt-r$k 4247 'boot-hand\.spec\.ts' chromium; done
echo STAGE6-DONE >> $S/logs/rows.tsv
