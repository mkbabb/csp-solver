#!/bin/bash
C=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-acc5
T=http://127.0.0.1:4236; F=front-rate.spec.ts; TF=tally-flash.spec.ts; B=$C/logs/chainB.log
echo "CHAIN-B START $(date +%T) load $(uptime | sed 's/.*averages: //')" > $B
$C/unserve.sh tree wf_f72f3b5a-83a-41/web/frontend >> $B
for k in $(seq 1 30); do lsof -nP -iTCP:4236 -sTCP:LISTEN -t >/dev/null 2>&1 || break; sleep 1; done
for p in p7g p7t nostart; do
  $C/serve.sh $p $C/$p/web/frontend 4236 $C/dev-$p.mts >> $B
  echo "  gate: $(curl -s $T/src/pencil/grid/gridPaths.ts | grep -o 'FRONT_GAP_MS = [^;]*\|wholeMsClock ? 1 : 0' | head -2 | tr '\n' ' ') tally-start-writes: $(curl -s $T/src/games/shared/DifficultyTally.vue | grep -c 'gate.write(0, true)')" >> $B
  case $p in
    p7g) $C/run.sh p7g-panel $T 1 $F "G10-panel" "chromium webkit"; $C/run.sh p7g-60 $T 1 $F "G10: every" "webkit" HZ=60;;
    p7t) $C/run.sh p7t-flash $T 1 $TF "tally" "chromium webkit";;
    nostart) $C/run.sh nostart-flash $T 1 $TF "tally" "chromium webkit"; $C/run.sh nostart-125 $T 1 $F "G10: every" "chromium webkit";;
  esac
  $C/unserve.sh $p crit-acc5/$p/web/frontend >> $B
  for k in $(seq 1 30); do lsof -nP -iTCP:4236 -sTCP:LISTEN -t >/dev/null 2>&1 || break; sleep 1; done
  echo "$p done $(date +%T)" >> $B
done
$C/serve.sh tree2 /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend 4236 $C/dev-tree.mts >> $B
$C/run.sh t125 $T 1 $F "G10: every" "chromium webkit"
echo "CHAIN-B DONE $(date +%T) load $(uptime | sed 's/.*averages: //')" >> $B
