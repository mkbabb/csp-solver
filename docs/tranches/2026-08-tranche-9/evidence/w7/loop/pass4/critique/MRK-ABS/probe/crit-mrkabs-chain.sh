#!/bin/zsh
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-39/web/frontend
S=.crit-mrkabs
# wait for the opacity search to finish
while pgrep -f 'p4-crit-opq' > /dev/null; do sleep 5; done
TAG=-ctlctl PROTO=http://127.0.0.1:4235 CTRL=http://127.0.0.1:4235 npx playwright test -c $S/pw.config.ts $S/p4-pi.spec.ts > $S/pi-ctlctl.log 2>&1; echo "EXIT $?" >> $S/pi-ctlctl.log
TAG=-proto PROTO=http://127.0.0.1:4234 CTRL=http://127.0.0.1:4235 npx playwright test -c $S/pw.config.ts $S/p4-pi.spec.ts > $S/pi-proto.log 2>&1; echo "EXIT $?" >> $S/pi-proto.log
npx playwright test -c $S/pw.filter.config.ts > $S/filter.log 2>&1; echo "EXIT $?" >> $S/filter.log
ARM=one ABS_BASE=http://127.0.0.1:4234 npx playwright test -c $S/pw.config.ts $S/p4-census.spec.ts -g "census" > $S/census-one.log 2>&1; echo "EXIT $?" >> $S/census-one.log
echo CHAIN-DONE >> $S/census-one.log
