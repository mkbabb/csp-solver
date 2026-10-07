#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb8/r2
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend
LANE=http://127.0.0.1:4247
swap() {
  local p=$(cat $S/lane.pid); local cwd=$(lsof -a -p $p -d cwd -Fn 2>/dev/null | tail -1)
  if [ "$cwd" = "n$T" ]; then kill $p; else echo "SWAP REFUSED pid $p cwd $cwd"; return 1; fi
  for i in $(seq 1 20); do lsof -nP -iTCP:4247 -sTCP:LISTEN >/dev/null 2>&1 || break; sleep 0.5; done
  bash $S/serve.sh $1; sleep 4
  echo "SERVED $1 -> $(curl -s $LANE/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1) pid $(cat $S/lane.pid)"
}
swap $S/dist-arch-union
for eng in chromium webkit; do bash $S/pw.sh union-frame-$eng $LANE $eng e2e/frame-halfstroke.spec.ts; echo "ROW union frame $eng $(tail -1 $S/logs/pw-union-frame-$eng.log)"; done
swap $S/dist-arch-unionbase
for eng in chromium webkit; do bash $S/pw.sh unionbase-frame-$eng $LANE $eng e2e/frame-halfstroke.spec.ts; echo "ROW unionbase frame $eng $(tail -1 $S/logs/pw-unionbase-frame-$eng.log)"; done
B=$(cat /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb8/board.txt)
mkdir -p $S/frames
for arm in hinge sheet; do
  swap $S/dist-arch-$arm
  (cd $T && node $S/frame-b23-8.mjs shot $arm $LANE 122 $B $S/frames/b23-$arm-122.png) ; echo "SHOT-EXIT $arm $?"
done
(cd $T && node $S/frame-b23-8.mjs compose $S/frames/b23-hinge-122.png $S/frames/b23-sheet-122.png $S/frames/pair-122.png); echo "COMPOSE $?"
(cd $T && node $S/ink122.mjs $S/frames/b23-hinge-122.png $S/frames/b23-sheet-122.png)
swap $S/dist-p8a-tree
echo BATTERY3-DONE
