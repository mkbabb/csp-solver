#!/bin/bash
# usage: run.sh <src-fe> <log>  — rsync copy, run every plant, restore, print exits
SRC="$1"; LOG="$2"; S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/CTRL-FACE/c7; FE=$S/fe; PR=$S/probe
rsync -a --delete --exclude node_modules --exclude dist --exclude .face-engine "$SRC/" "$FE/"; [ -e $FE/node_modules ] || ln -s "$SRC/node_modules" $FE/node_modules
cd $FE
restore() { rsync -a --exclude node_modules --exclude dist --exclude .face-engine "$SRC/src/" "$FE/src/"; [ -f src/assets/plant-face.css ] && mv src/assets/plant-face.css $S/../trash/plant-$RANDOM.css; }
one() { restore; python3 $PR/$1 "$2" || { echo "PLANTFAIL $2" >> "$LOG"; return; }; node scripts/check-font-coverage.mjs > $S/last.log 2>&1; e=$?; echo "$e | $2 | $(grep -m1 -i 'check 7\|face law\|comic\|binding' $S/last.log | cut -c1-170)" >> "$LOG"; }
: > "$LOG"
echo "== pass-7 critic plants" >> "$LOG"
for n in "CONTROL literal (must red)" mint-face-token shadow-face-token-scoped shadow-font-token-root script-style-string ts-style-string cssText setAttribute-style "style.font shorthand" "ts h() style object" "svg font-family attr" "tailwind font-(--var)" "tailwind :class object" "tailwind :class string" "style template literal" "font-family var fallback-only (undeclared face)"; do one p7plants.py "$n"; done
echo "== pass-8 critic 25" >> "$LOG"
python3 $PR/p8plants.py --list > $S/list8.txt
while IFS= read -r n; do one p8plants.py "$n"; done < $S/list8.txt
echo "== pass-9 lane plants" >> "$LOG"
python3 $PR/p9plants.py --list > $S/list9.txt
while IFS= read -r n; do one p9plants.py "$n"; done < $S/list9.txt
restore; node scripts/check-font-coverage.mjs > $S/last.log 2>&1; echo "restored clean exit $?" >> "$LOG"
echo DONE >> "$LOG"
