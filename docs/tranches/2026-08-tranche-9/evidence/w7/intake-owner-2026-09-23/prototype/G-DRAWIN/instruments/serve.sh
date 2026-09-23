#!/bin/bash
# Start the G-DRAWIN preview servers (127.0.0.1, strict ports) and record their PIDs.
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-13/web/frontend || exit 1
start() {
  nohup ./node_modules/.bin/vite preview --config .drawin/build.mts --outDir "dist-$1" --port "$2" --strictPort --host 127.0.0.1 > ".drawin/srv-$1.log" 2>&1 &
  echo "$1 $2 $!" >> .drawin/pids.txt
}
start base 4254
start aq 4253
start f 4255
start b 4256
sleep 3
cat .drawin/pids.txt
for p in 4253 4254 4255 4256; do curl -s -o /dev/null -w "$p %{http_code}\n" "http://127.0.0.1:$p/"; done
