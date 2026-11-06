#!/bin/bash
# unit.sh : the unit battery on the tree, chunked by directory, --maxWorkers=2, each chunk its own guarded call
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/PLR-COUNT
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend
n=0
for d in src/pencil src/games/shared "src/games/sudoku src/games/futoshiki src/games/thermo src/games/killer src/games/kenken src/games/cards.test.ts src/games/posters.test.ts" src/composables; do
  n=$((n+1))
  $HOME/.claude/guard/guarded --timeout 20 -- npx vitest run --maxWorkers=2 $d > $S/logs/unit-$n.log 2>&1
  echo "chunk $n [$d] exit=$? $(grep -E 'Test Files|Tests ' $S/logs/unit-$n.log | tr -s ' ' | tr '\n' ' ')" >> $S/logs/unit.exit
done
# whatever sits outside the four chunks
$HOME/.claude/guard/guarded --timeout 20 -- npx vitest run --maxWorkers=2 --exclude 'src/pencil/**' --exclude 'src/games/**' --exclude 'src/composables/**' > $S/logs/unit-rest.log 2>&1
echo "chunk rest exit=$? $(grep -E 'Test Files|Tests ' $S/logs/unit-rest.log | tr -s ' ' | tr '\n' ' ')" >> $S/logs/unit.exit
echo "unit done" >> $S/logs/unit.exit
