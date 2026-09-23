#!/usr/bin/env bash
FE="$1"; L="$2"; cd "$FE" || exit 9
for d in src/composables src/pencil src/games; do npx vitest run $d > "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrkabs6-logs/vitest-$L-${d//\//_}.log" 2>&1; echo "$d $?"; grep -E "Test Files|Tests " "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrkabs6-logs/vitest-$L-${d//\//_}.log" | tail -2; done
echo VITEST-DONE
