#!/bin/zsh
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-39/web/frontend
run() { local tag=$1; shift; echo "== $tag $(date +%T)" >> $S/logs/chain1.log; env "$@" npx playwright test --config .mrkabs/pw.config.ts $P > $S/logs/$tag.log 2>&1; echo "EXIT[$tag] $? $(date +%T)" >> $S/logs/chain1.log; }
: > $S/logs/chain1.log
P=p5-spread run spread-A BASE=http://127.0.0.1:4239
P=p5-census run census-A BASE=http://127.0.0.1:4239 ARM=A
P=p5-census run census-C BASE=http://127.0.0.1:4242 ARM=C
P=p5-census run census-HEAD BASE=http://127.0.0.1:4240 ARM=HEAD
P=p5-census run census-A-forced BASE=http://127.0.0.1:4239 ARM=A FORCED=1
P=p5-census run census-HEAD-forced BASE=http://127.0.0.1:4240 ARM=HEAD FORCED=1
echo CHAIN-DONE >> $S/logs/chain1.log
