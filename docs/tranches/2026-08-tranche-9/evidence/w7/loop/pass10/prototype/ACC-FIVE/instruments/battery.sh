#!/bin/zsh
# usage: battery.sh <engine>   (chromium first; webkit queued last under --exclusive webkit via run.sh)
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/ACC-FIVE
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend
GP=$T/src/pencil/grid/gridPaths.ts
E=$1; TB=http://127.0.0.1:4236; CB=http://127.0.0.1:4258
O=$S/logs/battery-$E.log; echo "OPEN $E $(date +%T) load $(uptime | sed 's/.*averages: //') $(tail -1 ~/.claude/guard/log/zone.log | grep -o 'inuse=[0-9]*')" >> $O
alive() { for p in 4236 4258; do echo -n "$p:$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:$p/) "; done; echo; }
swap() { cp $S/probe/gridPaths.$1.ts $GP; echo "SWAP $1 blob $(git -C $T hash-object $GP) $(date +%T)" >> $O; sleep 3; }
restore() { cp $S/probe/gridPaths.p10.ts $GP; cmp $S/probe/gridPaths.p10.ts $GP && echo "RESTORED-BYTE-EQUAL $(date +%T)" >> $O; sleep 3; }
R=$S/run.sh
echo "alive $(alive)" >> $O
$R d10-$E $TB 1 front-rate.spec.ts "D10-stallrun" $E
$R d10s9-$E $TB 1 front-rate.spec.ts "D10-stallrun" $E D10_STALLS=9
$R p30-$E $TB 1 front-rate.spec.ts "D10-partial30" $E
swap p9;   $R p30-p9-$E $TB 1 front-rate.spec.ts "D10-partial30" $E; $R d10-p9-$E $TB 1 front-rate.spec.ts "D10-stallrun" $E
swap p8;   $R p30-p8-$E $TB 1 front-rate.spec.ts "D10-partial30" $E; $R d10-p8-$E $TB 1 front-rate.spec.ts "D10-stallrun" $E
swap slow; $R d10-slow-$E $TB 1 front-rate.spec.ts "D10-stallrun" $E; $R p30-slow-$E $TB 1 front-rate.spec.ts "D10-partial30" $E
restore
echo "alive $(alive)" >> $O
N10=1; [ $E = webkit ] && N10=5; $R g10-$E $TB $N10 front-rate.spec.ts "G10: every" $E
swap heavy; $R g10-heavy-$E $TB 1 front-rate.spec.ts "G10: every" $E; restore
$R panel-$E $TB 1 front-rate.spec.ts "G10-panel" $E
if [ "$(curl -s -o /dev/null -w "%{http_code}" $CB/)" = 200 ]; then $R ctrl-$E $CB 1 front-rate.spec.ts "." $E; else echo "CONTROL UNREAD: :4258 not serving (heavy-queue wait) $(date +%T)" >> $O; fi
if [ "$PI" = 1 ]; then
  # π (R4): the tree's faithful BUILD (scratch dist-tree, .git marker present) vs the control dist, one payload.
  # The dev server on :4236 is stopped by its recorded PID (cwd checked) and the dist served there instead.
  LP=$(cat $S/pids/tree.listener); CW=$(lsof -a -p $LP -d cwd -Fn 2>/dev/null | grep ^n | cut -c2-)
  if [ "$CW" = "$T" ]; then kill $LP; echo "STOPPED dev :4236 pid $LP (cwd $CW) $(date +%T)" >> $O; else echo "NOT STOPPING :4236 pid $LP cwd $CW" >> $O; fi
  sleep 3
  (cd $T && npx vite preview --config .acc5p10.vite.mts --outDir $S/dist-tree --host 127.0.0.1 --port 4236 --strictPort > $S/logs/serve-pi.log 2>&1 &; echo $! > $S/pids/pi.wrapper)
  for k in $(seq 1 30); do [ "$(curl -s -o /dev/null -w '%{http_code}' $TB/)" = 200 ] && break; sleep 1; done
  echo "PI tree dist $(curl -s $TB/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1) css $(curl -s $TB/ | grep -o 'index-[A-Za-z0-9_-]*\.css' | head -1) control $(curl -s $CB/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1) $(date +%T)" >> $O
  cp $S/probe/acc5-pi.spec.ts $T/e2e/acc5-pi.spec.ts
  for pe in webkit chromium; do $R pi-$pe $TB 1 acc5-pi.spec.ts "PI" $pe TB=$TB CB=$CB; done
  mv $T/e2e/acc5-pi.spec.ts $S/trash/acc5-pi.spec.ts.$(date +%H%M%S)
  PL=$(lsof -nP -iTCP:4236 -sTCP:LISTEN -t | head -1); PC=$(lsof -a -p $PL -d cwd -Fn 2>/dev/null | grep ^n | cut -c2-)
  [ "$PC" = "$T" ] && kill $PL && echo "STOPPED preview :4236 pid $PL $(date +%T)" >> $O
fi
echo "DONE $E $(date +%T) load $(uptime | sed 's/.*averages: //')" >> $O
