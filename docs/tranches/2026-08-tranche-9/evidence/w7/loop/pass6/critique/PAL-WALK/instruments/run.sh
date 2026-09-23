#!/bin/bash
# run.sh <tag> <engine> <dpr> <base> [grep] [dir] [match]
cd /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/rep/web/frontend || exit 1
tag=$1 eng=$2 d=$3 base=$4 g=${5:-} dir=${6:-../e2e} m=${7:-peer-walk\\.spec\\.ts$}
args=(--config .critpw6/pw.mts --project $eng)
[ -n "$g" ] && args+=(-g "$g")
PLAYWRIGHT_BASE_URL=$base CR_DPR=$d CR_DIR=$dir CR_MATCH="$m" CR_OUT=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/tr/$tag-$eng npx playwright test "${args[@]}" > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/$tag-$eng-dpr$d.log 2>&1
e=$?; echo "EXIT=$e" >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/$tag-$eng-dpr$d.log; echo "$tag $eng dpr$d exit $e $(date +%T)" >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/runs.txt
