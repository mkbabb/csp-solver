#!/bin/bash
# battery1.sh — the e2e rows, tree | control | plants. The tree is NOT edited while this runs.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb8/r2
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend
LANE=http://127.0.0.1:4247; CTL=http://127.0.0.1:4250
swap() { # kill the recorded lane listener (cwd = my tree) and serve dist $1
  local p=$(cat $S/lane.pid)
  local cwd=$(lsof -a -p $p -d cwd -Fn 2>/dev/null | tail -1)
  if [ "$cwd" = "n$T" ]; then kill $p; else echo "SWAP REFUSED pid $p cwd $cwd"; return 1; fi
  for i in $(seq 1 20); do lsof -nP -iTCP:4247 -sTCP:LISTEN >/dev/null 2>&1 || break; sleep 0.5; done
  bash $S/serve.sh $1; sleep 4
  echo "SERVED $1 -> $(curl -s $LANE/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1) pid $(cat $S/lane.pid)"
}
for spec in frame-halfstroke fold-verb boot-hand; do
  for eng in chromium webkit; do
    bash $S/pw.sh tree-$spec-$eng $LANE $eng e2e/$spec.spec.ts; echo "ROW tree $spec $eng $(tail -1 $S/logs/pw-tree-$spec-$eng.log)"
    bash $S/pw.sh ctl-$spec-$eng $CTL $eng e2e/$spec.spec.ts; echo "ROW ctl $spec $eng $(tail -1 $S/logs/pw-ctl-$spec-$eng.log)"
  done
done
for pl in bypass hold0 stacks0 p7clock; do
  swap $S/dist-plant-$pl || continue
  for eng in chromium webkit; do
    bash $S/pw.sh plant-$pl-boot-$eng $LANE $eng e2e/boot-hand.spec.ts; echo "ROW plant-$pl boot $eng $(tail -1 $S/logs/pw-plant-$pl-boot-$eng.log)"
  done
done
swap $S/dist-p8a-tree
echo BATTERY1-DONE
