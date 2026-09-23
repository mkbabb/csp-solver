#!/bin/zsh
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MRK-ABS
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-39/web/frontend
run() { local tag=$1; shift; echo "== $tag $(date +%T)" >> $S/logs/chain3.log; env "$@" npx playwright test --config .mrkabs/pw.config.ts $P > $S/logs/$tag.log 2>&1; echo "EXIT[$tag] $? $(date +%T)" >> $S/logs/chain3.log; }
: > $S/logs/chain3.log
P=p5-census run census-HEAD BASE=http://127.0.0.1:4240 ARM=HEAD
P=p5-census run census-HEAD-forced BASE=http://127.0.0.1:4240 ARM=HEAD FORCED=1
P=p5-census run census-A-prm BASE=http://127.0.0.1:4239 ARM=A PRM=1
mkdir -p $S/run2; P=p5-census run census-A-run2 BASE=http://127.0.0.1:4239 ARM=A-run2
P=p5-pi run pi-parked REGIME=parked
P=p5-pi run pi-default REGIME=default
P=p5-density run density
P=p5-crops run crops
echo CHAIN3-DONE >> $S/logs/chain3.log
