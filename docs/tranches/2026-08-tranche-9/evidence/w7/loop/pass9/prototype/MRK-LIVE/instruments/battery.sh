#!/bin/bash
# usage: battery.sh <name> <baseURL> [extra playwright args...]; env passes through (EDGE_SABOTAGE etc)
name=$1; url=$2; shift 2
log=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MRK-LIVE/logs/bat-$name.log
: > $log
while :; do l=$(sysctl -n vm.loadavg | awk '{print int($2)}'); [ $l -lt 120 ] && break; echo "WAIT load $l $(date +%T)" >> $log; sleep 60; done
echo "LOAD-START $(sysctl -n vm.loadavg) $(date +%T)" >> $log
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend
PWOUT=$name PLAYWRIGHT_BASE_URL=$url npx playwright test --config /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MRK-LIVE/inst/pw.mjs "$@" >> $log 2>&1
echo $? > /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MRK-LIVE/logs/bat-$name.exit
echo "LOAD-END $(sysctl -n vm.loadavg) $(date +%T)" >> $log
