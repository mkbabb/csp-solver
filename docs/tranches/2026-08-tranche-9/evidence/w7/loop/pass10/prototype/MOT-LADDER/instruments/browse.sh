#!/bin/zsh
# usage: browse.sh <engine> <arm> <port> <spec: reveal|sg>   (one row; the servers are up already)
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/MOT-LADDER
E=$1; A=$2; P=$3; K=$4; L=$S/logs/browse; mkdir -p $L; X=$L/exits.txt
FE=$S/ksnap-build/web/frontend
z=$(tail -1 ~/.claude/guard/log/zone.log | grep -o 'inuse=[0-9]*')
id=$(curl -s http://127.0.0.1:$P/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1)
echo "$K $A $E open load $(sysctl -n vm.loadavg) zone $z id $id" >> $X
case $K in
  reveal) (cd $FE && CL9_ARM=$A CL9_OUT=$L/reveal.jsonl CL9_PWOUT=$L/pwout-$K-$A-$E PLAYWRIGHT_BASE_URL=http://127.0.0.1:$P npx playwright test --config $S/pw/reveal.config.mjs --project $E --workers=1 > $L/$K-$A-$E.log 2>&1); r=$?;;
  sg) (cd $FE && SG_FE=$FE SG_OUT=$L/pwout-$K-$A-$E PLAYWRIGHT_BASE_URL=http://127.0.0.1:$P npx playwright test --config $S/pw/sg.config.mjs --project $E --workers=1 > $L/$K-$A-$E.log 2>&1); r=$?;;
esac
echo "$K $A $E exit $r close load $(sysctl -n vm.loadavg) zone $(tail -1 ~/.claude/guard/log/zone.log | grep -o 'inuse=[0-9]*')" >> $X
