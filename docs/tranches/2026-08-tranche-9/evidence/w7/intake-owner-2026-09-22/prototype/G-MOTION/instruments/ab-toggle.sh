#!/bin/zsh
# interleaved HEAD/proto webkit + chromium flips under the same box load → runs/summary-ab.jsonl
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-16/web/frontend/.gmotion
S=runs/summary-ab.jsonl; : > $S
for i in 1 2 3; do for E in webkit chromium; do for P in 4254 4253; do
  A=proto; [ $P = 4254 ] && A=base
  timeout 170 node motion.mjs toggle $E $P 1280x800 light 0 0 runs/ab-$A-$E-$i.json 0 > /dev/null 2>&1 && node analyze.mjs runs/ab-$A-$E-$i.json >> $S
done; done; done
echo DONE >> runs/ab.log
