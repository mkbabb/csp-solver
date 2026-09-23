#!/bin/bash
# Serve ONE arm dist on this lane's prototype port 4253 (4255/4256 belong to other lanes).
# usage: arm.sh <aq|f|b>   — kills the recorded 4253 server by PID, starts the named arm.
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-13/web/frontend || exit 1
while read -r name port pid; do
  if [ "$port" = "4253" ]; then kill "$pid" 2>/dev/null && echo "killed $name $pid"; fi
done < .drawin/pids.txt
grep '^base ' .drawin/pids.txt > .drawin/pids.next
mv .drawin/pids.next .drawin/pids.txt
sleep 1
nohup ./node_modules/.bin/vite preview --config .drawin/build.mts --outDir "dist-$1" --port 4253 --strictPort --host 127.0.0.1 > ".drawin/srv-$1.log" 2>&1 &
echo "$1 4253 $!" >> .drawin/pids.txt
sleep 4
cat .drawin/pids.txt
curl -s "http://127.0.0.1:4253/" | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1
