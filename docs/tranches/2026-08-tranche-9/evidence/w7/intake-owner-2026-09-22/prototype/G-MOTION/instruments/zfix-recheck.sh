#!/bin/zsh
# after the fold z-order cure: re-read the proto move scenario (GA1/GA2/GA4/GA5/GA6) → runs/summary-zfix.jsonl
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-16/web/frontend/.gmotion
S=runs/summary-zfix.jsonl; : > $S
for E in chromium webkit; do
  timeout 170 node motion.mjs move $E 4253 1280x800 light 0 0 runs/z-proto-$E-1280-light.json 0 > /dev/null 2>&1 && node analyze.mjs runs/z-proto-$E-1280-light.json >> $S
  timeout 170 node motion.mjs move $E 4253 390x844 dark 0 1 runs/z-proto-$E-390-dark.json 0 > /dev/null 2>&1 && node analyze.mjs runs/z-proto-$E-390-dark.json >> $S
done
echo DONE >> $S
