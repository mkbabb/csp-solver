#!/bin/bash
# CRITIC · one row n runs per engine. usage: run.sh <label> <base> <n> <spec> <grep> <engines> [ENV=val ...]
C=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-acc5
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend
L=$1; BASE=$2; N=$3; SPEC=$4; G=$5; ENGS=$6; shift 6
OUT=$C/logs/$L.log
cd $C/cfg
for i in $(seq 1 $N); do
  for eng in $ENGS; do
    ld=$(uptime | sed 's/.*averages: //' | cut -d' ' -f1)
    env "$@" BASE=$BASE PWOUT=$C/pw-out-$L npx playwright test --config $C/cfg/pw.config.ts $SPEC --project $eng --grep "$G" > $C/logs/$L-$eng-$i.raw 2>&1
    ex=$?
    ld2=$(uptime | sed 's/.*averages: //' | cut -d' ' -f1)
    echo "RUN $L $eng $i exit $ex load $ld-$ld2 base $BASE env: $*" >> $OUT
    grep -E "G10 .*(CLAUSES|gauge:|tally:|join:|clock)|G10-PANEL|TALLY-FLASH .*SUMMARY|Error:|passed|failed" $C/logs/$L-$eng-$i.raw | grep -v "^\s*at " | head -14 >> $OUT
  done
done
echo "DONE $L $(date +%T)" >> $OUT
