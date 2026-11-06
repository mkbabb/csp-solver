#!/bin/zsh
# one row, n runs per engine, each its own guarded call; exits read from files the battery writes.
# usage: run.sh <label> <base> <n> <spec> <grep> <engines> [ENV=val ...]
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/ACC-FIVE
L=$1; BASE=$2; N=$3; SPEC=$4; G=$5; ENGS=$6; shift 6
OUT=$S/logs/$L.log
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend
for i in $(seq 1 $N); do
  for eng in ${=ENGS}; do
    z=$(tail -1 ~/.claude/guard/log/zone.log | grep -o 'inuse=[0-9]*')
    zn=${z#inuse=}
    if [ "${zn:-99999999}" -ge 8000000 ]; then echo "RUN $L $eng $i UNREAD zone $z" >> $OUT; continue; fi
    ld=$(uptime | sed 's/.*averages: //' | cut -d' ' -f1)
    if [ $eng = webkit ]; then GW=(--exclusive webkit); else GW=(); fi
    env "$@" BASE=$BASE PWOUT=$S/pw-out-$L ~/.claude/guard/guarded --timeout 30 $GW -- npx playwright test --config $S/cfg/pw.config.ts $SPEC --project $eng --workers=1 --grep "$G" > $S/logs/$L-$eng-$i.raw 2>&1
    echo $? > $S/logs/$L-$eng-$i.exit
    ld2=$(uptime | sed 's/.*averages: //' | cut -d' ' -f1)
    echo "RUN $L $eng $i exit $(cat $S/logs/$L-$eng-$i.exit) load $ld-$ld2 $z base $BASE env: $*" >> $OUT
    grep -E "G10 .*(CLAUSES|SHARE|gauge:|tally:|join:|clock)|G10-PANEL|D10-STALLRUN|D10-PARTIAL30|Error:|passed|failed|skipped" $S/logs/$L-$eng-$i.raw | grep -v "^\s*at " | cut -c1-900 | head -20 >> $OUT
  done
done
echo "DONE $L $(date +%T)" >> $OUT
