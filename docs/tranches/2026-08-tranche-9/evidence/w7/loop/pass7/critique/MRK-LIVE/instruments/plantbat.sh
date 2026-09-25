#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklivecrit7
P=$S/copy/web/frontend; W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend
FILES="src/pencil/chrome/FocusRing.vue src/games/shared/gameCell.css src/pencil/sheet/AnswerKeyLaminate.vue e2e/focus-ring.spec.ts"
restore() { for f in $FILES; do cp $W/$f $P/$f; done; }
sums() { (cd $P && shasum $FILES | cut -c1-8 | tr '\n' ' '); echo; }
restore; echo "base (copy):"; sums; echo "work tree:"; (cd $W && shasum $FILES | cut -c1-8 | tr '\n' ' '); echo
for spec in "$@"; do
  name=${spec%%:*}; rows=${spec#*:}
  python3 $S/plants.py $P $name || { echo "plant $name FAILED to apply"; continue; }
  echo "=== PLANT $name rows '$rows'"; sums
  sleep 4
  $S/runspec.sh 4235 plant-$name "$rows"
  restore; echo "restored:"; sums
done
echo ALLDONE
