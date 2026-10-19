#!/bin/bash
# usage: cool.sh <log> <cmd...> — waits for a 1-min load < 118 (polled every 30 s), prints the loads, runs the command, writes <log>.exit
LOG=$1; shift
l1() { sysctl -n vm.loadavg | awk '{print $2}'; }
while :; do L=$(l1); if awk -v l="$L" 'BEGIN{exit !(l<118)}'; then break; fi; echo "waiting load $L $(date +%T)" >> "$LOG.wait"; sleep 30; done
echo "load at open $(sysctl -n vm.loadavg) $(date +%T)" > "$LOG"
"$@" >> "$LOG" 2>&1
echo $? > "$LOG.exit"
echo "load at close $(sysctl -n vm.loadavg) $(date +%T)" >> "$LOG"
