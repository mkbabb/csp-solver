#!/bin/bash
# usage: erase7s-build.sh <frontend dir> <outDir> <label>   (uses <fe>/.erase7/build.mts)
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
cd $1; T0=$(date +%s); L0=$(uptime | sed 's/.*averages: //')
npx vite build --config .erase7/build.mts --outDir $2 --emptyOutDir > $S/erase7s-logs/build-$3.log 2>&1; EX=$?
echo "BUILD $3 exit=$EX secs=$(( $(date +%s)-T0 )) load0=$L0 load1=$(uptime | sed 's/.*averages: //') identity=$(ls $2/assets 2>/dev/null | grep -E '^index-.*\.js$')"
