#!/bin/zsh
# webkit 390 dark move, proto and HEAD interleaved ×2 after the z-order cure → runs/summary-zfix2.jsonl
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-16/web/frontend/.gmotion
S=runs/summary-zfix2.jsonl; : > $S
for i in 1 2; do for P in 4253 4254; do
  A=proto; [ $P = 4254 ] && A=base
  timeout 170 node motion.mjs move webkit $P 390x844 dark 0 1 runs/z2-$A-webkit-390-dark-$i.json 0 > /dev/null 2>&1 && node analyze.mjs runs/z2-$A-webkit-390-dark-$i.json >> $S
done; done
echo DONE > runs/zfix2.done
