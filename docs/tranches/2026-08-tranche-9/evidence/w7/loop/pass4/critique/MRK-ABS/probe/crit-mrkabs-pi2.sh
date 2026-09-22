#!/bin/zsh
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-39/web/frontend
S=.crit-mrkabs
while ! grep -q CHAIN-DONE $S/census-one.log; do sleep 5; done
for i in 2 3; do TAG=-proto$i PROTO=http://127.0.0.1:4234 CTRL=http://127.0.0.1:4235 npx playwright test -c $S/pw.config.ts $S/p4-pi.spec.ts > $S/pi-proto-run$i.log 2>&1; echo "EXIT $?" >> $S/pi-proto-run$i.log; done
TAG=-ctlctl2 PROTO=http://127.0.0.1:4235 CTRL=http://127.0.0.1:4235 npx playwright test -c $S/pw.config.ts $S/p4-pi.spec.ts > $S/pi-ctlctl-run2.log 2>&1; echo "EXIT $?" >> $S/pi-ctlctl-run2.log
TAG=-reverse PROTO=http://127.0.0.1:4235 CTRL=http://127.0.0.1:4234 npx playwright test -c $S/pw.config.ts $S/p4-pi.spec.ts > $S/pi-reverse.log 2>&1; echo "EXIT $?" >> $S/pi-reverse.log
echo PI2-DONE >> $S/pi-reverse.log
