#!/bin/bash
# pw.sh <tag> <port> <project> <match> [extra args] : runs the scratch config; exit written by the run itself
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-VERB
tag=$1; port=$2; proj=$3; match=$4; shift 4
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend
echo "LOAD-START $(uptime | sed 's/.*averages: //') $(date +%T)" > $S/logs/pw-$tag.log
PLAYWRIGHT_BASE_URL=http://127.0.0.1:$port VERB_MATCH="$match" npx playwright test -c $S/bin/pw.config.mjs --project=$proj "$@" >> $S/logs/pw-$tag.log 2>&1
echo "EXIT $?" > $S/logs/pw-$tag.exit
echo "LOAD-END $(uptime | sed 's/.*averages: //') $(date +%T)" >> $S/logs/pw-$tag.log
