#!/bin/bash
# chain-6.sh : the ONE-ROUTE tree first (the lane's queued tree server re-serves ac/tri in-process: no slot released, no
# re-queue), chromium then WebKit in one lock; then back to the tree (CTALL, TOKENFb); stop; unit.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/PLR-COUNT
B=$S/bin; SP=e2e/player-tally.spec.ts; L=$S/logs/chain-6.log; export RECYCLE=6100
up() { curl -s -o /dev/null -m 5 -w "%{http_code}" http://127.0.0.1:$1/; }
echo "chain-6 start $(date +%T)" >> $L
for i in $(seq 1 360); do [ "$(up 4242)" = "200" ] && [ "$(up 4260)" = "200" ] && break; echo "$(date +%T) servers lane=$(up 4242) ctl=$(up 4260)" >> $S/logs/chain-6.wait; sleep 30; done
echo "servers up $(date +%T) lane=$(up 4242) ctl=$(up 4260)" >> $L
if $B/srv.sh switch tri; then
  echo "switched $(date +%T)" >> $L
  $B/run.sh TRI tri $SP - chromium; echo "TRI.chromium $(cat $S/logs/TRI.chromium.exit) $(date +%T)" >> $L
  echo "queued $(date +%T)" > $S/logs/wk-tri.guard
  $HOME/.claude/guard/guarded --exclusive webkit --timeout 90 -- /bin/bash $B/wk-inner.sh tri $S/wk-tri.jobs >> $S/logs/wk-tri.guard 2>&1; echo "guard exit=$? $(date +%T)" >> $S/logs/wk-tri.guard
  echo "WTRI.webkit $(cat $S/logs/WTRI.webkit.exit 2>/dev/null) $(date +%T)" >> $L
else echo "switch failed $(date +%T): TRI UNREAD" >> $L; fi
$B/srv.sh restore; echo "restored $(date +%T) mode=$(cat $S/logs/srv/srv-4242.mode)" >> $L
$B/run.sh CTALL tree $SP "the tall phone" chromium; echo "CTALL.chromium $(cat $S/logs/CTALL.chromium.exit) $(date +%T)" >> $L
$B/plant.sh TOKENFb TOKENF tree $SP "sheet's ground · light · dpr 2" chromium; echo "TOKENFb $(cat $S/logs/TOKENFb.chromium.exit) $(date +%T)" >> $L
$B/srv.sh stop >> $L 2>&1; $B/srv.sh restore
$B/unit.sh; echo "unit done $(date +%T)" >> $L
echo "chain-6 done $(date +%T)" >> $L
