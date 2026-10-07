S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/face8
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-33/web/frontend
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
mkdir -p $S/vitest
echo "load $(sysctl -n vm.loadavg)"
for d in src/composables src/games/futoshiki src/games/kenken src/games/killer src/games/sudoku src/games/thermo src/games/shared src/pencil src/games/cards.test src/games/posters.test; do
  n=$(echo "$d" | tr '/*' '__')
  for arm in tree:$T ctrl:$C; do
    (cd ${arm#*:} && npx vitest run $d --reporter=default > $S/vitest/${arm%%:*}-$n.log 2>&1); ex=$?
    echo "$d ${arm%%:*} exit=$ex :: $(grep -E 'Test Files|Tests ' $S/vitest/${arm%%:*}-$n.log | tr -s ' ' | tr '\n' ' ')"
  done
done
echo "load $(sysctl -n vm.loadavg)"
echo DONE
