#!/bin/bash
# unit estate chunked by directory; bare exit per chunk
FE=$1; LOG=$2
cd $FE
: > $LOG
for d in src/pencil src/games/shared src/games/sudoku src/games/futoshiki src/games/thermo src/games/killer src/games/kenken src/lib src/composables src/components; do
  [ -d $d ] || continue
  npx vitest run --no-cache $d > $LOG.$(echo $d | tr / _) 2>&1
  e=$?
  echo "$d exit=$e $(grep -E 'Test Files|Tests ' $LOG.$(echo $d | tr / _) | tr -s ' ' | tr '\n' ' ')" >> $LOG
done
ls src | grep -v -E '^(pencil|games|lib|composables|components)$' >> $LOG.others
npx vitest run --no-cache > $LOG.whole 2>&1; echo "WHOLE exit=$? $(grep -E 'Test Files|Tests ' $LOG.whole | tr -s ' ' | tr '\n' ' ')" >> $LOG
echo DONE >> $LOG
