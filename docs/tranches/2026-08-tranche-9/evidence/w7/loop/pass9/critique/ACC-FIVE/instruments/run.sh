#!/bin/zsh
# usage: run.sh <label> <base> <n> <spec> <grep> <engines> [ENV=val ...]
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-ACC-FIVE
L=$1; BASE=$2; N=$3; SPEC=$4; G=$5; ENGS=$6; shift 6
OUT=$S/logs/$L.log
cd $S/cfg
for i in $(seq 1 $N); do
  for eng in ${=ENGS}; do
    ld=$(uptime | sed 's/.*averages: //' | cut -d' ' -f1)
    env "$@" BASE=$BASE PWOUT=$S/pw-out-$L npx playwright test --config $S/cfg/pw.config.ts $SPEC --project $eng --grep "$G" > $S/logs/$L-$eng-$i.raw 2>&1
    echo $? > $S/logs/$L-$eng-$i.exit
    ld2=$(uptime | sed 's/.*averages: //' | cut -d' ' -f1)
    echo "RUN $L $eng $i exit $(cat $S/logs/$L-$eng-$i.exit) load $ld-$ld2 base $BASE env: $*" >> $OUT
    grep -E "CRIT-P30|D10-STALLRUN|G10-PANEL|G10 .*CLAUSES|Error:|passed|failed" $S/logs/$L-$eng-$i.raw | grep -v "^\s*at " | head -12 >> $OUT
  done
done
echo "DONE $L $(date +%T)" >> $OUT
