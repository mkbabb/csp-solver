#!/bin/bash
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-LEDGER
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend
T=${1:-1}
echo "load $(uptime | sed 's/.*averages: //')"
node --check scripts/check-ink-pressure.mjs; echo "check $?"
node scripts/check-ink-pressure.mjs > $S/logs/ink$T-bare.txt 2>&1; echo "bare exit $?"
node scripts/check-ink-pressure.mjs --self-test --plants --sabotage-battery > $S/logs/ink$T-st.txt 2>&1; echo "self-test+plants+sabotage exit $?"
echo DONE
