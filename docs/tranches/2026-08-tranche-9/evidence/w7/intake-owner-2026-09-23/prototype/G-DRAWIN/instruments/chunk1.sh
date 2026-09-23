#!/bin/bash
# Chunk 1: chromium, arm A×Q (on 4253) then the HEAD control (4254).
D=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-13/web/frontend/.drawin
bash "$D/battery.sh" AQ 4253 chromium full
bash "$D/battery.sh" BASE 4254 chromium full
