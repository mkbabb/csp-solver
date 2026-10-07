#!/bin/bash
# stop-port.sh : kill the 4237 LISTENER (and its npx parent) only after its cwd reads as this lane's out-of-tree copy
for p in $(lsof -nP -tiTCP:4237 -sTCP:LISTEN); do
  pp=$(ps -o ppid= -p $p | tr -d ' ')
  for q in $p $pp; do
    cwd=$(lsof -a -p $q -d cwd -Fn 2>/dev/null | grep '^n' | cut -c2-)
    case "$cwd" in *six8/bt/web/frontend*) kill $q 2>/dev/null && echo "killed $q ($cwd)";; *) echo "skip $q cwd=$cwd";; esac
  done
done
for i in $(seq 1 20); do lsof -nP -tiTCP:4237 -sTCP:LISTEN >/dev/null || { echo port-free; exit 0; }; sleep 0.5; done; echo PORT-STILL-HELD; exit 1
