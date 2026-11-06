#!/bin/bash
# wk-inner.sh <mode> <jobfile> : runs INSIDE one `guarded --exclusive webkit` call; playwright direct, one job at a time,
# servers checked before each job (a dead server = that job UNREAD), plants applied and sha-restored per job
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/PLR-COUNT
mode=$1; jobs=$2
case $mode in tree) FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend;; uni) FE=$S/ac/uni/web/frontend;; tri) FE=$S/ac/tri/web/frontend;; esac
up() { curl -s -o /dev/null -m 5 -w "%{http_code}" http://127.0.0.1:$1/; }
zone() { tail -1 $HOME/.claude/guard/log/zone.log | grep -o 'inuse=[0-9]*' | cut -d= -f2; }
cd $FE
while IFS='|' read -r lab plant grep envs; do
  [ -z "$lab" ] && continue
  K=$S/logs/$lab.webkit
  for i in $(seq 1 30); do [ "$(up 4242)" = "200" ] && [ "$(up 4260)" = "200" ] && break; echo "$(date +%T) inside the lock, servers lane=$(up 4242) ctl=$(up 4260)" >> $K.wait; sleep 30; done
  if [ "$(up 4242)" != "200" ] || [ "$(up 4260)" != "200" ] || [ "$(cat $S/logs/srv/srv-4242.mode)" != "$mode" ]; then
    echo "UNREAD servers lane=$(up 4242) ctl=$(up 4260) mode=$(cat $S/logs/srv/srv-4242.mode) $(date +%T)" >> $K.load; echo "exit=UNREAD" > $K.exit; continue; fi
  z=$(zone); if [ "$z" -ge 8000000 ]; then echo "ZONE $z UNREAD" >> $K.load; echo "exit=ZONE" > $K.exit; continue; fi
  while [ "$(sysctl -n vm.loadavg | awk '{print int($2)}')" -gt 120 ]; do echo "$(date +%T) waits $(sysctl -n vm.loadavg)" >> $K.load; sleep 60; done
  echo "open $(date +%T) load $(sysctl -n vm.loadavg) inuse $z bundle=$(curl -s -m 5 http://127.0.0.1:4260/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1)" >> $K.load
  if [ "$plant" != "-" ]; then python3 $S/bin/plants.py apply $plant $FE > $K.plant 2>&1; sleep 3; fi
  env PLRC_DIR=$FE/e2e PLRC_PWOUT=$S/pw-out/$lab.webkit G14_CONTROL=http://127.0.0.1:4260 $envs npx playwright test -c $S/rig/pw.config.ts e2e/player-tally.spec.ts --project webkit --workers=1 -g "$grep" > $K.log 2>&1
  echo "exit=$?" > $K.exit
  if [ "$plant" != "-" ]; then python3 $S/bin/plants.py restore $plant $FE >> $K.plant 2>&1; sleep 3; fi
  echo "close $(date +%T) load $(sysctl -n vm.loadavg) inuse $(zone)" >> $K.load
done < $jobs
