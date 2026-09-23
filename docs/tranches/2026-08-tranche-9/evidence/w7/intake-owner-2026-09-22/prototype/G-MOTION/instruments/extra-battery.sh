#!/bin/zsh
# follow-ups: PRM move (fixed probe), GA7 proto vs negative control (chromium painted), GA8 at a scrolling phone viewport
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-16/web/frontend/.gmotion
S=runs/summary-extra.jsonl; LOG=runs/battery-extra.log; : > $S
run() { local E=$1; shift; local f=runs/$8.json
  timeout 170 node motion.mjs $1 $E $2 $3 $4 $5 $6 $f $7 >> $LOG 2>&1 || { echo "FAIL $8" >> $LOG; return; }
  timeout 170 node analyze.mjs $f >> $S 2>> $LOG; rm -rf runs/$8-shots; }
for E in chromium webkit; do run $E move 4253 1280x800 light 1 0 0 prm-m-proto-$E-1280; done
run chromium move 4253 1280x800 light 0 0 1 ga7-proto-chromium-1280
run chromium ga7neg 4253 1280x800 light 0 0 1 ga7neg2-proto-chromium-1280
run chromium move 4254 1280x800 light 0 0 1 ga7-base-chromium-1280
for E in chromium webkit; do
  run $E ga8 4253 390x560 light 0 1 0 ga8s-proto-$E-390x560
  run $E ga8 4254 390x560 light 0 1 0 ga8s-base-$E-390x560
  NEG=1 run $E ga8 4253 390x560 light 0 1 0 ga8sneg-proto-$E-390x560
done
echo DONE >> $LOG
