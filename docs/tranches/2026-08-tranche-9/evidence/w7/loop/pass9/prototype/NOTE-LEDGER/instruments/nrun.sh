#!/bin/bash
# nrun.sh <label> <frontend-dir-to-copy> : per plant, lint:ink bare + the library --tree clean row, on a scratch copy
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-LEDGER
L=$1; SRCFE=$2; TP=$S/tp-$L/web/frontend; LOG=$S/logs/nrun-$L.txt; TREE=${TREE:-0}
mkdir -p $TP; cp -R $SRCFE/src $SRCFE/scripts $SRCFE/package.json $TP/ 2>/dev/null
O=$S/orig-$L.vue; cp $TP/src/pencil/chrome/MarginNote.vue $O; SFC=$TP/src/pencil/chrome/MarginNote.vue
: > $LOG; cd $TP
echo "load $(uptime | sed 's/.*averages: //')" >> $LOG
node scripts/check-ink-pressure.mjs > $S/logs/nr.out 2>&1; echo "[clean] lint:ink $? $(grep -m1 'note reserve' $S/logs/nr.out | cut -c1-200)" >> $LOG
for n in $(node $S/bin/nplant.mjs --list); do
  cp $O $SFC; node $S/bin/nplant.mjs $O $SFC $n || { echo "[$n] ANCHOR ABSENT" >> $LOG; continue; }
  node scripts/check-ink-pressure.mjs > $S/logs/nr.out 2>&1; e=$?
  echo "[$n] lint:ink $e $(grep -m1 'note reserve' $S/logs/nr.out | cut -c1-220)" >> $LOG
  if [ "$TREE" = 1 ]; then node scripts/shape-census.mjs --tree . > $S/logs/nr2.out 2>&1; echo "    census --tree $? $(grep -m1 'reserve' $S/logs/nr2.out | cut -c1-200)" >> $LOG; fi
done
cp $O $SFC; cmp -s $O $SFC && echo "restored equal" >> $LOG; echo DONE >> $LOG
