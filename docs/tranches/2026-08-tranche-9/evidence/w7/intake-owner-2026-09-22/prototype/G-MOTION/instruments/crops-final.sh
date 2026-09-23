#!/bin/zsh
# re-cut c2 after the z-order cure, then c3 and c4 → crops/ ; log crops/crops.log
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-16/web/frontend/.gmotion
L=crops/crops.log; : > $L
timeout 170 node crops.mjs c2 crops >> $L 2>&1 || echo "FAIL c2" >> $L
timeout 170 node crops.mjs c3 crops >> $L 2>&1 || echo "FAIL c3" >> $L
M_chromium_light='{"maxChannelDelta":2,"pxOver1":74}' M_chromium_dark='{"maxChannelDelta":2,"pxOver1":21}' M_webkit_light='{"maxChannelDelta":9,"pxOver1":138923}' M_webkit_dark='{"maxChannelDelta":2,"pxOver1":2}' timeout 170 node crops.mjs c4 crops >> $L 2>&1 || echo "FAIL c4" >> $L
echo DONE >> $L
