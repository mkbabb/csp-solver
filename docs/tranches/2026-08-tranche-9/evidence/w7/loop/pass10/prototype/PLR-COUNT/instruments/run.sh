#!/bin/bash
# run.sh <label> <tree|uni> <spec> <grep|-> <chromium|webkit> [ENV=V ...] : ONE playwright project, its own guarded call
# (webkit: --exclusive webkit), --workers=1. Opens only at 1-min load <= 120 and zone inuse < 8M (both printed).
# Exit written bare to logs/<label>.<proj>.exit.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/PLR-COUNT
G=$HOME/.claude/guard/guarded
lab=$1; mode=$2; spec=$3; grep=$4; proj=$5; shift 5
case $mode in tree) FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend;; uni) FE=$S/ac/uni/web/frontend;; tri) FE=$S/ac/tri/web/frontend;; esac
K=$S/logs/$lab.$proj
zone() { tail -1 $HOME/.claude/guard/log/zone.log | grep -o 'inuse=[0-9]*' | cut -d= -f2; }
$S/bin/srv.sh ensure $mode > $K.srv 2>&1
up() { curl -s -o /dev/null -m 5 -w "%{http_code}" http://127.0.0.1:$1/; }
# servers wait for a guard slot like any heavy run: the battery opens only once both answer (and the lane is this mode)
for i in $(seq 1 180); do
  [ "$(up 4242)" = "200" ] && [ "$(up 4260)" = "200" ] && [ "$(cat $S/logs/srv/srv-4242.mode 2>/dev/null)" = "$mode" ] && break
  echo "$(date +%T) servers lane=$(up 4242) ctl=$(up 4260)" >> $K.wait; sleep 30
done
if [ "$(up 4242)" != "200" ] || [ "$(up 4260)" != "200" ]; then echo "exit=NOSERVER" > $K.exit; exit 0; fi
# warm the lane's dev transform so the first cell does not pay it
curl -s -o /dev/null -m 120 http://127.0.0.1:4242/src/main.ts
echo "servers $(date +%T) lane=$(up 4242) ctl=$(up 4260) bundle=$(curl -s -m 5 http://127.0.0.1:4260/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1)" >> $K.srv
while [ "$(sysctl -n vm.loadavg | awk '{print int($2)}')" -gt 120 ]; do echo "$(date +%T) waits $(sysctl -n vm.loadavg)" >> $K.load; sleep 60; done
z=$(zone); if [ "$z" -ge 8000000 ]; then echo "ZONE $z >= 8M: UNREAD" >> $K.load; echo "exit=ZONE" > $K.exit; exit 0; fi
echo "open $(date +%T) load $(sysctl -n vm.loadavg) inuse $z $(cat $K.srv)" >> $K.load
EX=""; [ "$proj" = "webkit" ] && EX="--exclusive webkit"
cd $FE || exit 9
if [ "$grep" != "-" ]; then
  env PLRC_DIR=$FE/e2e PLRC_PWOUT=$S/pw-out/$lab.$proj G14_CONTROL=http://127.0.0.1:4260 "$@" $G --timeout 90 $EX -- npx playwright test -c $S/rig/pw.config.ts $spec --project $proj --workers=1 -g "$grep" > $K.log 2>&1
else
  env PLRC_DIR=$FE/e2e PLRC_PWOUT=$S/pw-out/$lab.$proj G14_CONTROL=http://127.0.0.1:4260 "$@" $G --timeout 90 $EX -- npx playwright test -c $S/rig/pw.config.ts $spec --project $proj --workers=1 > $K.log 2>&1
fi
echo "exit=$?" > $K.exit
echo "close $(date +%T) load $(sysctl -n vm.loadavg) inuse $(zone)" >> $K.load
