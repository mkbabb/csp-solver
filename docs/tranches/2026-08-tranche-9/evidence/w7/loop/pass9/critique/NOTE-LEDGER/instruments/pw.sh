#!/bin/zsh
# pw.sh <label> <port> <spec-dir> <spec> [args]
LB=$1; PT=$2; SD=$3; SPEC=$4; shift 4; LOG=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-NOTE-LEDGER/logs/pw-$LB.txt
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend
echo "load $(uptime | sed 's/.*averages: //') $(date +%T) served $(curl -s http://127.0.0.1:$PT/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1) spec-sha $(shasum $SD/$SPEC | cut -c1-12)" > $LOG
SPEC_DIR=$SD PLAYWRIGHT_BASE_URL=http://127.0.0.1:$PT npx playwright test --config $CFG $SPEC "$@" >> $LOG 2>&1
echo "exit=$? load $(uptime | sed 's/.*averages: //') $(date +%T)" >> $LOG
