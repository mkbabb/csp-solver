#!/bin/zsh
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-NOTE-LEDGER
export GIT_CEILING_DIRECTORIES=$S
L=${1:-t9}; SRC=$S/$L/web/frontend; TP=$S/tp-$L/web/frontend; LOG=$S/logs/crun-$L.txt
mkdir -p $TP; cp -R $SRC/src $SRC/scripts $SRC/package.json $TP/
SFC=$TP/src/pencil/chrome/MarginNote.vue; O=$S/orig-$L.vue; cp $SFC $O
: > $LOG; cd $TP; TAG=""
echo "load $(uptime | sed 's/.*averages: //')" >> $LOG
node scripts/check-ink-pressure.mjs > $S/logs/cr.out 2>&1; echo "[clean] lint:ink $? $(grep -m1 'note reserve' $S/logs/cr.out | cut -c1-200)" >> $LOG
run() { gen=$1; n=$2; cp $O $SFC; node $S/bin/$gen $O $SFC $n || { echo "[$n] ANCHOR ABSENT" >> $LOG; return; }
  node scripts/check-ink-pressure.mjs > $S/logs/cr.out 2>&1; e=$?; echo "[${TAG}$n] lint:ink $e $(grep -m1 'note reserve' $S/logs/cr.out | cut -c1-220)" >> $LOG; }
for n in $(node $S/bin/nplant.mjs --list); do run nplant.mjs $n; done
for n in $(node $S/bin/cplant.mjs --list); do run cplant.mjs $n; done
# literal sabotage: R4-element off, bound widened
cp scripts/check-ink-pressure.mjs $S/cip-orig.mjs
sed 's/on("R4-element")/false/g' $S/cip-orig.mjs > scripts/check-ink-pressure.mjs
TAG="SAB R4-element=false · "; for n in N19 N4; do run nplant.mjs $n; done; TAG=""
sed 's/reserve < line - 0\.5/reserve < line - 15/' $S/cip-orig.mjs > scripts/check-ink-pressure.mjs
grep -c 'reserve < line - 15' scripts/check-ink-pressure.mjs >> $LOG
TAG="SAB bound 0.5→15 · "; run nplant.mjs N19; TAG=""
cp $S/cip-orig.mjs scripts/check-ink-pressure.mjs; cp $O $SFC; cmp -s $O $SFC && cmp -s $S/cip-orig.mjs scripts/check-ink-pressure.mjs && echo "restored equal" >> $LOG
echo "load $(uptime | sed 's/.*averages: //')" >> $LOG; echo DONE >> $LOG
