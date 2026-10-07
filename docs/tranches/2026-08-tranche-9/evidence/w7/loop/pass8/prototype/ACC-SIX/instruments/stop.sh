#!/bin/bash
# stop.sh <what> : kill the recorded wrapper and its children, after a cwd check
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/six8
grep " $1 " $S/pids.txt | tail -1 | while read pid what port; do
  kids=$(pgrep -P $pid); grand=$(for k in $kids; do pgrep -P $k; done)
  for p in $grand $kids $pid; do
    cwd=$(lsof -a -p $p -d cwd -Fn 2>/dev/null | grep '^n' | cut -c2-)
    case "$cwd" in *six8/bt/web/frontend*|*w7-control/web/frontend*) kill $p 2>/dev/null && echo "killed $p ($what, $cwd)";; *) echo "skip $p cwd=$cwd";; esac
  done
done
