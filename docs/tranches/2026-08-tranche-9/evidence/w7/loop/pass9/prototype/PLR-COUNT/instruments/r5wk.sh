#!/bin/bash
# The WebKit column's battery + the g5tol WebKit self-test, run INSIDE ONE `guarded --exclusive webkit` call (so the lock is
# taken once, not re-queued per job); playwright/node run directly in here (a nested guard's flock would deadlock).
S=$LANE
FE=$TREE/web/frontend
L=$S/logs/r5
echo "wk open $(date +%T) $(sysctl -n vm.loadavg)" >> $L/wk.load
B13_PROJS=webkit python3 $S/bin/r5breaks2.py COMB FADE80F HEAD12F PLUSF2 C1 C2 C3 C4 C5 SLACK-eps SLACK+eps LAPX LAPY > $L/breaksW2.log 2>&1; echo "exit=$?" > $L/breaksW2.exit
echo "g5tol open $(date +%T) $(sysctl -n vm.loadavg)" >> $L/wk.load
cd $S/g5tol/web/frontend && node e2e/lib/glyph-pop.mjs --self-test --engine webkit > $L/g5tol-self.webkit.log 2>&1; echo "exit=$?" > $L/g5tol-self.webkit.exit
cd $S/g5tol/web/frontend && GLYPH_SABOTAGE=g5tol node e2e/lib/glyph-pop.mjs --self-test --engine webkit > $L/g5tol-sab.webkit.log 2>&1; echo "exit=$?" > $L/g5tol-sab.webkit.exit
cd $FE && node e2e/lib/glyph-pop.mjs --self-test --engine webkit > $L/homes-self.webkit.log 2>&1; echo "exit=$?" > $L/homes-self.webkit.exit
echo "wk close $(date +%T) $(sysctl -n vm.loadavg)" >> $L/wk.load
# APPENDED 16:0x while this script ran (bash reads its script as it goes): the battery's rest, re-run on r5breaks3 (the
# r5breaks2 run hung on its ensure's captured stdout and was stopped at HEAD12F; FADE80F's WebKit read lost its control mid-run)
echo "w3 open $(date +%T) $(sysctl -n vm.loadavg)" >> $L/wk.load
B13_PROJS=webkit python3 $S/bin/r5breaks3.py FADE80F HEAD12F PLUSF2 C1 C2 C3 C4 C5 SLACK-eps SLACK+eps LAPX LAPY > $L/breaksW3.log 2>&1; echo "exit=$?" > $L/breaksW3.exit
echo "w3 close $(date +%T) $(sysctl -n vm.loadavg)" >> $L/wk.load
