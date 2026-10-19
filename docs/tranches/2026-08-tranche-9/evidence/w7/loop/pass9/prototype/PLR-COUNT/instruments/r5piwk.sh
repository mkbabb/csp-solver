#!/bin/bash
# r5piwk.sh: the WebKit half of r5pi2.sh, re-queued after the unit battery: wait for final.done (one heavy run per lane),
# serve the SAME built dist on :4242 (guarded --timeout 90), cycle the control if it is older than 70 min, then all four
# WebKit reads inside ONE `guarded --exclusive webkit` call (direct playwright inside it), then stop the preview by PID.
S=$LANE
FE=$TREE/web/frontend
L=$S/logs/r5; G=$GUARDED
while [ ! -f $L/final.done ]; do sleep 20; done
cd $FE || exit 9   # npx must resolve the frontend's @playwright/test (the first run, from another cwd, read "unknown command 'test'")
[ -f $L/PLANTED ] && { echo "REFUSED: a plant is live" > $L/piwk.exit; exit 3; }
[ "$(curl -s -o /dev/null -m 5 -w '%{http_code}' http://127.0.0.1:4242/)" = "200" ] && { echo "REFUSED: :4242 answers (held)" > $L/piwk.exit; exit 5; }
(cd $FE && nohup $G --timeout 90 -- npx vite preview --config $S/rig/vite.build.mts --outDir $S/dist --host 127.0.0.1 --port 4242 --strictPort > $L/piwk-preview.log 2>&1 < /dev/null & echo $! > $L/piwk-preview.pid)
for i in $(seq 1 30); do [ "$(curl -s -o /dev/null -m 5 -w '%{http_code}' http://127.0.0.1:4242/)" = "200" ] && break; sleep 3; done
echo "$(date +%T) started preview 4242 pid $(cat $L/piwk-preview.pid) for the WebKit π" >> $L/srv.log
curl -s http://127.0.0.1:4242/ | grep -o 'index-[A-Za-z0-9_-]*\.js' > $L/piwk-tree-id.txt
run() { K=$L/pi-$2.$1; PLRC_DIR=$4 PLRC_PORT=$5 PLRC_WORKERS=1 PLRC_PWOUT=$S/pw-out/pi-$2.$1 npx playwright test -c $S/rig/pw.config.ts $3 --project $1 --workers=1 > $K.log 2>&1; echo "exit=$?" > $K.exit; }
export -f run; export S FE L
while [ "$(sysctl -n vm.loadavg | awk '{print int($2)}')" -gt 120 ]; do sleep 60; done
echo "webkit queued $(date +%T) $(sysctl -n vm.loadavg)" >> $L/pi.load
$G --exclusive webkit --timeout 60 -- bash -c '
  echo "lock held $(date +%T) $(sysctl -n vm.loadavg)" >> $L/pi.load
  a=$(( $(date +%s) - $(cat $L/srv-4260.t) )); [ $a -gt 4200 ] && $S/bin/r5ctlcycle2.sh >> $L/srv.log 2>&1 < /dev/null
  curl -s http://127.0.0.1:4260/ | grep -o "index-[A-Za-z0-9_-]*\.js" > $L/piwk-ctl-id.txt
  run webkit pi9 pi9.spec.ts $S/r5pi 4242; run webkit filt9 filt9.spec.ts $S/r5pi 4242
  run webkit census-4242 filter-census.spec.ts $FE/e2e 4242; run webkit census-4260 filter-census.spec.ts $FE/e2e 4260' > $L/piwk.guard.log 2>&1 < /dev/null
echo "exit=$?" > $L/piwk.guard.exit
P=$(cat $L/piwk-preview.pid); kill $P 2>/dev/null; echo "$(date +%T) stopped preview 4242 pid $P" >> $L/srv.log
echo "done $(date +%T) $(sysctl -n vm.loadavg)" > $L/piwk.exit
