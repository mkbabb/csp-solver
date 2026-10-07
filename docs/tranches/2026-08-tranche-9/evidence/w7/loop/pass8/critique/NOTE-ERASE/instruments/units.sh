#!/bin/bash
C=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-erase8
for n in tree plant-unit plant-unit2 plant-unit3; do
  cd $C/$n/web/frontend 2>/dev/null || cd $C/$n
  npx vitest run src/pencil/chrome/marginNote.motion.test.ts --no-cache > $C/logs/unit-$n.log 2>&1; x=$?
  echo "UNIT $n exit=$x load=$(uptime | sed 's/.*averages: //') $(grep -E 'Test Files|Tests ' $C/logs/unit-$n.log | tr -s ' ' | tr '\n' ' ')" >> $C/logs/units.txt
done
cd $C/tree/web/frontend; npx vitest run src/games --no-cache --reporter=json --outputFile=$C/logs/vitest-games.json > $C/logs/vitest-games.log 2>&1; echo "GAMES exit=$? $(grep -E 'Test Files|Tests ' $C/logs/vitest-games.log | tr '\n' ' ')" >> $C/logs/units.txt
echo UNITS-DONE >> $C/logs/units.txt
