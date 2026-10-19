#!/bin/bash
# pw.sh <tag> <port> <project> <match> [env...] : waits for load < 120, runs, writes the exit to logs/pw-<tag>.exit
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-MOT-VERB
tag=$1; port=$2; proj=$3; match=$4; shift 4
cd $S/bank/web/frontend
while :; do l=$(sysctl -n vm.loadavg | awk '{print int($2)}'); [ $l -lt 120 ] && break; echo "WAIT load $l $(date +%T)" >> $S/logs/pw-$tag.log; sleep 60; done
echo "LOAD-START $(sysctl -n vm.loadavg) $(date +%T)" > $S/logs/pw-$tag.log
env "$@" PLAYWRIGHT_BASE_URL=http://127.0.0.1:$port CV_MATCH="$match" npx playwright test -c $S/bank/web/frontend/crit-pw.config.mjs --project=$proj >> $S/logs/pw-$tag.log 2>&1
echo "EXIT $?" > $S/logs/pw-$tag.exit
echo "LOAD-END $(sysctl -n vm.loadavg) $(date +%T)" >> $S/logs/pw-$tag.log
