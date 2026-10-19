#!/bin/bash
# stop.sh tree|control : kill the recorded server (and its node child) after a cwd check. no rm
S=<SCRATCH>
pid=$(cat $S/serve-$1.pid)
port=$([ $1 = control ] && echo 4250 || echo 4237)
lp=$(lsof -nP -t -iTCP:$port -sTCP:LISTEN 2>/dev/null | head -1)
cwd=$(lsof -a -p $lp -d cwd -Fn 2>/dev/null | grep '^n' | cut -c2-)
echo "stop $1 recorded $pid listener $lp cwd $cwd parent-of-listener $(ps -o ppid= -p $lp)"
case "$cwd" in
  */worktrees/wf_f72f3b5a-83a-45/web/frontend|*/pass9/ACC-SIX/union/web/frontend|*/worktrees/w7-control/web/frontend) kill $lp $pid 2>/dev/null; echo killed $lp $pid;;
  *) echo "REFUSED: listener cwd not mine";;
esac
