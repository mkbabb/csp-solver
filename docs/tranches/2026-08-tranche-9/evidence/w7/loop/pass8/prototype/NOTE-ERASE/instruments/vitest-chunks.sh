#!/bin/bash
# usage: vitest-chunks.sh <copy> — vitest chunked by src/ directory, one log line per chunk
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erase8
cd $S/$1/web/frontend
for d in src/games/shared src/games src/pencil src/composables src/lib src/utils; do
  [ -d $d ] || continue
  ex=""; [ $d = src/games ] && ex="--exclude src/games/shared/**"
  npx vitest run $d $ex --no-cache > $S/logs/vitest-$1-$(echo $d | tr / _).log 2>&1; x=$?
  echo "VITEST $1 $d exit=$x $(grep -E 'Test Files|Tests ' $S/logs/vitest-$1-$(echo $d | tr / _).log | tr -s ' ' | tr '\n' ' ')" >> $S/logs/vitest-summary.txt
done
echo "VITEST $1 DONE" >> $S/logs/vitest-summary.txt
