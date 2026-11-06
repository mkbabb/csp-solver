#!/bin/zsh
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-ACC-FIVE
GP=$S/tree/web/frontend/src/pencil/grid/gridPaths.ts
E=$1; TB=http://127.0.0.1:4236; CB=http://127.0.0.1:4258; O=$S/logs/battery-$E.log; R=$S/run.sh
alive() { for p in 4236 4258; do echo -n "$p:$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:$p/) "; done; }
swap() { cp $S/probe/gridPaths.$1.ts $GP; echo "SWAP $1 $(date +%T)" >> $O; sleep 4; }
restore() { cp $S/probe/gridPaths.f67c70ee.ts $GP; cmp $S/probe/gridPaths.f67c70ee.ts $GP && echo "RESTORED-BYTE-EQUAL $(date +%T)" >> $O; sleep 4; }
echo "OPEN $E $(date +%T) alive $(alive) control $(curl -s $CB/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1)" >> $O
$R p30 $TB "D10-partial30" $E
$R d10 $TB "D10-stallrun" $E
swap 458bb26f; $R p30-p9 $TB "D10-partial30" $E
swap eeb58de2; $R d10-p8 $TB "D10-stallrun" $E
restore
$R g10 $TB "G10: every" $E
swap heavy; $R g10-heavy $TB "G10: every" $E; restore
echo "alive $(alive)" >> $O
$R ctrl $CB "." $E
echo "DONE $E $(date +%T) alive $(alive)" >> $O
