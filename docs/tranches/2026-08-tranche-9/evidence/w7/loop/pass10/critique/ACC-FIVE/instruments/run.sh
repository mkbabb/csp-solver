#!/bin/zsh
# one row, one engine, its own guarded call; exit read from a file. usage: run.sh <label> <base> <grep> <engine> [ENV=val ...]
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-ACC-FIVE
L=$1; BASE=$2; G=$3; eng=$4; shift 4
OUT=$S/logs/battery-$eng.log
cd $S/tree/web/frontend
z=$(tail -1 ~/.claude/guard/log/zone.log | grep -o 'inuse=[0-9]*'); zn=${z#inuse=}
if [ "${zn:-99999999}" -ge 8000000 ]; then echo "RUN $L $eng UNREAD zone $z" >> $OUT; exit 0; fi
ld=$(uptime | sed 's/.*averages: //' | cut -d' ' -f1)
if [ $eng = webkit ]; then GW=(--exclusive webkit); else GW=(); fi
t0=$(date +%T)
env "$@" BASE=$BASE PWOUT=$S/pw-out-$L-$eng ~/.claude/guard/guarded --timeout 30 $GW -- npx playwright test --config .crit5.pw.config.ts front-rate.spec.ts --project $eng --workers=1 --grep "$G" > $S/logs/$L-$eng.raw 2>&1
echo $? > $S/logs/$L-$eng.exit
ld2=$(uptime | sed 's/.*averages: //' | cut -d' ' -f1)
z2=$(tail -1 ~/.claude/guard/log/zone.log | grep -o 'inuse=[0-9]*')
echo "RUN $L $eng exit $(cat $S/logs/$L-$eng.exit) $t0-$(date +%T) load $ld-$ld2 $z/$z2 base $BASE blob $(git hash-object src/pencil/grid/gridPaths.ts | cut -c1-8) env: $*" >> $OUT
grep -E "G10 .*(CLAUSES|SHARE|gauge:|tally:|join:|clock)|clause|G10-PANEL|D10-STALLRUN|D10-PARTIAL30|Error:|passed|failed|skipped|UNREAD" $S/logs/$L-$eng.raw | grep -v "^\s*at " | cut -c1-700 | head -24 >> $OUT
