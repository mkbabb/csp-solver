#!/bin/bash
# crit-PAL-TIN · swap :4245 between builds (kill only the PID this lane recorded, cwd checked) and read §2c on each. No rm.
S=$SCRATCH
W=$WORKTREES/wf_308fa864-c94-2/web/frontend
L=$S/logs/swap.txt; : > $L
while [ ! -f $S/logs/browser.done ]; do sleep 10; done
swap() { local dist=$1 tag=$2; local pid=$(cat $S/logs/pid-4245); local now=$(lsof -nP -t -iTCP:4245 -sTCP:LISTEN 2>/dev/null)
  local cwd=$(lsof -a -p $pid -d cwd -Fn 2>/dev/null | grep ^n | cut -c2-)
  if [ "$now" = "$pid" ] && [ "$cwd" = "$W" ]; then kill $pid; echo "stopped :4245 pid $pid (recorded, cwd ours)" >> $L; else echo "REFUSED: :4245 listener $now recorded $pid cwd $cwd" >> $L; return 1; fi
  for i in $(seq 1 15); do lsof -nP -t -iTCP:4245 -sTCP:LISTEN >/dev/null 2>&1 || break; sleep 1; done
  (cd $W && nohup npx vite preview --config $S/cfg/vite.preview.mts --outDir $dist --host 127.0.0.1 --port 4245 --strictPort > $S/logs/serve-$tag.log 2>&1 &)
  for i in $(seq 1 60); do curl -s http://127.0.0.1:4245/ | grep -q 'index-' && break; sleep 1; done
  lsof -nP -t -iTCP:4245 -sTCP:LISTEN > $S/logs/pid-4245
  echo ":4245 now $tag pid $(cat $S/logs/pid-4245) serves $(curl -s http://127.0.0.1:4245/ | grep -o 'index-[A-Za-z0-9_-]*\.js') css $(curl -s http://127.0.0.1:4245/ | grep -o 'index-[A-Za-z0-9_-]*\.css')" >> $L; }
spec() { local tag=$1 eng=$2; local lg=$S/logs/sw-$tag-$eng.log
  echo "$tag $eng · load $(uptime|sed 's/.*averages*: //') · $(date +%T)" > $lg
  (cd $W && PLAYWRIGHT_BASE_URL=http://127.0.0.1:4245 TIN_DPR=1 TIN_OUT=$S/pw-out/sw-$tag-$eng npx playwright test --config $S/cfg/pw.mts --project $eng -g '§2c' >> $lg 2>&1)
  echo "EXIT=$? · load after $(uptime|sed 's/.*averages*: //') · $(date +%T)" >> $lg; echo "$tag $eng $(tail -1 $lg)" >> $L; }
swap $S/dist-pcss3 pcss3 && { spec pcss3 chromium; spec pcss3 webkit; }
swap $S/dist-pcss1 pcss1 && { spec pcss1 chromium; spec pcss1 webkit; }
swap $S/dist-tree tree
echo done > $S/logs/swap.done
