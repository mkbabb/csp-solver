#!/bin/bash
# r5g5tol.sh <engine>: the PROPOSED g5tol glyph-pop (scratch copy) --self-test, then GLYPH_SABOTAGE=g5tol; and homes v2's own self-test beside it (the control)
S=$LANE
FE=$TREE/web/frontend
L=$S/logs/r5; e=$1; EX=""; [ "$e" = "webkit" ] && EX="--exclusive webkit"
while [ "$(sysctl -n vm.loadavg | awk '{print int($2)}')" -gt 120 ]; do echo "$(date +%T) waits $(sysctl -n vm.loadavg)" >> $L/g5tol.$e.load; sleep 60; done
echo "open $(date +%T) $(sysctl -n vm.loadavg)" >> $L/g5tol.$e.load
cd $S/g5tol/web/frontend && $GUARDED --timeout 30 $EX -- node e2e/lib/glyph-pop.mjs --self-test --engine $e > $L/g5tol-self.$e.log 2>&1; echo "exit=$?" > $L/g5tol-self.$e.exit
cd $S/g5tol/web/frontend && GLYPH_SABOTAGE=g5tol $GUARDED --timeout 30 $EX -- node e2e/lib/glyph-pop.mjs --self-test --engine $e > $L/g5tol-sab.$e.log 2>&1; echo "exit=$?" > $L/g5tol-sab.$e.exit
cd $FE && $GUARDED --timeout 30 $EX -- node e2e/lib/glyph-pop.mjs --self-test --engine $e > $L/homes-self.$e.log 2>&1; echo "exit=$?" > $L/homes-self.$e.exit
echo "close $(date +%T) $(sysctl -n vm.loadavg)" >> $L/g5tol.$e.load
