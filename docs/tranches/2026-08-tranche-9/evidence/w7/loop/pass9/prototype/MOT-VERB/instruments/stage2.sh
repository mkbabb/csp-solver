#!/bin/bash
# stage2.sh : frame rows (tree t3 + control), the boot thresholds by env, GA1 on homes v2's library (born-RED)
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-VERB
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend
$S/bin/swap.sh t3 > $S/logs/swap-t3b.log 2>&1
$S/bin/rows.sh frame-t3 4246 'frame-halfstroke\.spec\.ts' chromium webkit
$S/bin/rows.sh frame-ctl 4247 'frame-halfstroke\.spec\.ts' chromium webkit
BOOT_R_FLOOR=1.05 $S/bin/rows.sh bootR105-t3 4246 'boot-hand\.spec\.ts' chromium webkit
BOOT_L_BOUND=1.0 $S/bin/rows.sh bootL1-t3 4246 'boot-hand\.spec\.ts' chromium webkit
# born-RED of stale-rebase on the product row: GA1 with homes v2's postpaint (restored after, asserted)
cp $W/e2e/lib/postpaint.mjs $S/plants/postpaint.proposed.mjs
cp $S/homes-v2/postpaint.mjs $W/e2e/lib/postpaint.mjs
$S/bin/rows.sh ga1-homesv2 4246 'fold-verb\.spec\.ts' webkit chromium
cp $S/plants/postpaint.proposed.mjs $W/e2e/lib/postpaint.mjs
cmp $S/plants/postpaint.proposed.mjs $W/e2e/lib/postpaint.mjs && echo RESTORED-postpaint >> $S/logs/rows.tsv
echo STAGE2-DONE >> $S/logs/rows.tsv
