#!/bin/bash
# swap.sh <tag> : kill the tree server on 4246 by recorded PID (cwd checked = our p-tree), then start <tag> detached via the caller
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-MOT-VERB
pid=$(grep '^tree-' $S/logs/pids.txt | tail -1 | awk '{print $2}')
for p in $pid $(pgrep -P $pid); do
  cwd=$(lsof -a -p $p -d cwd -Fn 2>/dev/null | grep '^n' | cut -c2-)
  case "$cwd" in $S/*) kill $p && echo "killed $p cwd $cwd $(date +%T)" >> $S/logs/kills.txt;; *) echo "REFUSED $p cwd $cwd" >> $S/logs/kills.txt;; esac
done
