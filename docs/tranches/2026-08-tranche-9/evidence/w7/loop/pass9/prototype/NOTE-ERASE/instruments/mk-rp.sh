#!/bin/bash
# mk-rp.sh <src frontend> <name> <src copy root (for csp-solver data etc.)> — copy a frontend to $S/<name>/web/frontend and plant the two CSS spellings that ship
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-ERASE
src=$1 n=$2 root=$3; D=$S/$n/web/frontend
[ -e $S/$n ] && mv $S/$n $S/trash/$n-$(date +%s)
mkdir -p $S/$n && rsync -a --exclude node_modules --exclude '.erase9*' --exclude web/frontend $root/ $S/$n/
mkdir -p $D && rsync -a --exclude node_modules --exclude '.erase9*' --exclude dist --exclude test-results --exclude 'playwright-report*' --exclude .face-engine $src/ $D/
BS=$(printf '\134')
printf '@property --%s6d otion-note { syntax: "<time>"; inherits: false; initial-value: 0ms; }\n' "$BS" > $D/src/assets/crit-esc.css
mkdir -p $D/extra && printf '@property --motion-dusk { syntax: "<time>"; inherits: false; initial-value: 0ms; }\n' > $D/extra/x.css
printf '\nimport "./assets/crit-esc.css";\nimport "../extra/x.css";\n' >> $D/src/main.ts
od -c $D/src/assets/crit-esc.css | head -2
tail -3 $D/src/main.ts
