#!/bin/bash
P=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklive-p7/plant/web/frontend; W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend; S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklive-p7
FILES="src/pencil/chrome/FocusRing.vue src/games/shared/gameCell.css src/pencil/sheet/AnswerKeyLaminate.vue e2e/focus-ring.spec.ts"
restore() { for f in $FILES; do cp $W/$f $P/$f; done; }
sums() { (cd $P && shasum $FILES) ; }
restore; echo "--- base sums (== work tree)"; sums; (cd $W && shasum $FILES)
cd $P
for spec in "X5|G-LIVE-19" "X4|G-LIVE-16|G-LIVE-23" "X4b|G-LIVE-14|G-LIVE-16|G-LIVE-23" "CLIP0|G-LIVE-16|G-LIVE-23"; do
  name=${spec%%|*}; rows=${spec#*|}
  python3 $S/plants.py $P $name
  echo "=== PLANT $name rows $rows load $(sysctl -n vm.loadavg)"; sums | grep -v spec.ts
  sleep 3
  PASS7_INSTRUMENTS=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/instruments PWOUT=$name PLAYWRIGHT_BASE_URL=http://127.0.0.1:4245 npx playwright test --config .cfg/pw.config.ts focus-ring.spec.ts -g "$rows" --reporter=list > $S/logs/plant-$name.log 2>&1
  echo "EXIT $?"; grep -E '✘|passed|failed|Error:' $S/logs/plant-$name.log | head -12 | cut -c1-220
  restore; echo "restored:"; sums | grep -v spec.ts
done
echo ALLDONE
