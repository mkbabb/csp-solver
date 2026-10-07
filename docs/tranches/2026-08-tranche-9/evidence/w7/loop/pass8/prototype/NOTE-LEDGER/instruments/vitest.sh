#!/bin/bash
# vitest.sh <copy> <dir>... : vitest chunked by directory, each bare, the summary lines kept
P=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger8/p8
c=$1; shift; cd $P/$c/web/frontend; O=$P/q/vitest-$c.txt; echo "start $(date +%T) load $(uptime | sed 's/.*averages: //')" > $O
for d in "$@"; do n=$(echo $d | tr / _); npx vitest run $d > $P/q/vt-$c-$n.log 2>&1; x=$?; echo "$d exit=$x $(grep -E '^\s+(Test Files|Tests) ' $P/q/vt-$c-$n.log | tr -s ' ' | tr '\n' ' ')" >> $O; done
echo "DONE $(date +%T) load $(uptime | sed 's/.*averages: //')" >> $O
