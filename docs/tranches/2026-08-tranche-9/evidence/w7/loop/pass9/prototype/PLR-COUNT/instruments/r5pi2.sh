#!/bin/bash
# r5pi2.sh: π whole-DOM + the filter census, ONCE this pass, on BUILT dists: this tree's dist on :4242 vs the control's on :4260.
# Build out of tree (guarded); stop the lane's dev server by recorded PID (cwd-checked); serve the dist on :4242 (guarded --timeout 90);
# chromium: each spec its own guarded call; WebKit: all three specs inside ONE `guarded --exclusive webkit` call (direct playwright).
S=$LANE
FE=$TREE/web/frontend
L=$S/logs/r5; G=$GUARDED
wl() { while [ "$(sysctl -n vm.loadavg | awk '{print int($2)}')" -gt 120 ]; do echo "$(date +%T) $1 waits $(sysctl -n vm.loadavg)" >> $L/pi.load; sleep 60; done; echo "$1 open $(date +%T) $(sysctl -n vm.loadavg)" >> $L/pi.load; }
[ -f $L/PLANTED ] && { echo "REFUSED: a plant is live ($(cat $L/PLANTED))" > $L/pi.exit; exit 3; }
[ -d $S/dist ] && mv $S/dist $S/trash/dist-$(date +%s)
cd $FE || exit 9
wl build; $G --timeout 20 -- npx vite build --config $S/rig/vite.build.mts > $L/pi-build.log 2>&1; echo "exit=$?" > $L/pi-build.exit
grep -q "exit=0" $L/pi-build.exit || { echo "build failed" > $L/pi.exit; exit 4; }
P=$(cat $L/srv-4242.pid 2>/dev/null); C=$(lsof -a -p "$P" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')
if [ -n "$P" ] && [ "$C" = "$FE" ]; then kill $P; echo "$(date +%T) stopped dev 4242 pid $P for π" >> $L/srv.log; mv $L/srv-4242.pid $S/trash/srv-4242-pi-$(date +%s).pid; sleep 4; fi
[ "$(curl -s -o /dev/null -m 5 -w '%{http_code}' http://127.0.0.1:4242/)" = "200" ] && { echo "REFUSED: :4242 still answers (held)" > $L/pi.exit; exit 5; }
[ "$(curl -s -o /dev/null -m 5 -w '%{http_code}' http://127.0.0.1:4260/)" = "200" ] || $S/bin/r5srv.sh ensure >> $L/srv.log 2>&1
(cd $FE && nohup $G --timeout 90 -- npx vite preview --config $S/rig/vite.build.mts --outDir $S/dist --host 127.0.0.1 --port 4242 --strictPort > $L/pi-preview.log 2>&1 & echo $! > $L/pi-preview.pid)
for i in $(seq 1 30); do [ "$(curl -s -o /dev/null -m 5 -w '%{http_code}' http://127.0.0.1:4242/)" = "200" ] && break; sleep 3; done
curl -s http://127.0.0.1:4242/ | grep -o 'index-[A-Za-z0-9_-]*\.js' > $L/pi-tree-id.txt
curl -s http://127.0.0.1:4260/ | grep -o 'index-[A-Za-z0-9_-]*\.js' > $L/pi-ctl-id.txt
run() { # $1 project $2 label $3 spec $4 dir $5 port; $6 "direct" inside the outer webkit guard
  K=$L/pi-$2.$1
  if [ "$6" = "direct" ]; then
    PLRC_DIR=$4 PLRC_PORT=$5 PLRC_WORKERS=1 PLRC_PWOUT=$S/pw-out/pi-$2.$1 npx playwright test -c $S/rig/pw.config.ts $3 --project $1 --workers=1 > $K.log 2>&1
  else
    PLRC_DIR=$4 PLRC_PORT=$5 PLRC_WORKERS=1 PLRC_PWOUT=$S/pw-out/pi-$2.$1 $G --timeout 30 -- npx playwright test -c $S/rig/pw.config.ts $3 --project $1 --workers=1 > $K.log 2>&1
  fi
  echo "exit=$?" > $K.exit
}
wl chromium
run chromium pi9 pi9.spec.ts $S/r5pi 4242
run chromium filt9 filt9.spec.ts $S/r5pi 4242
run chromium census-4242 filter-census.spec.ts $FE/e2e 4242
run chromium census-4260 filter-census.spec.ts $FE/e2e 4260
wl webkit
export -f run; export S FE L G
$G --exclusive webkit --timeout 60 -- bash -c 'run webkit pi9 pi9.spec.ts $S/r5pi 4242 direct; run webkit filt9 filt9.spec.ts $S/r5pi 4242 direct; run webkit census-4242 filter-census.spec.ts $FE/e2e 4242 direct; run webkit census-4260 filter-census.spec.ts $FE/e2e 4260 direct' > $L/pi-wk.guard.log 2>&1; echo "exit=$?" > $L/pi-wk.guard.exit
P=$(cat $L/pi-preview.pid); kill $P 2>/dev/null; echo "$(date +%T) stopped preview 4242 pid $P" >> $L/srv.log
echo "done $(date +%T) $(sysctl -n vm.loadavg)" > $L/pi.exit
