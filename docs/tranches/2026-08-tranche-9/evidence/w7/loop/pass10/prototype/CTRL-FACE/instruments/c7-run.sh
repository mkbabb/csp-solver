#!/bin/bash
# CTRL-FACE pass 10 - CHECK 7 plant battery. usage: c7-run.sh <src web/frontend> <log> [plant-set ...]
# rsync copy of the frontend into the lane's durable scratch, one plant at a time, restored between
# plants; each exit is read bare from the check's own process into the log, beside c7 = the count of
# CHECK 7 finding lines (on a tree whose clean run reds on another check, c7 is the reading).
SRC="$1"; LOG="$2"; shift 2
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/CTRL-FACE/c7
I=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop
FE=$S/fe; mkdir -p $FE
rsync -a --delete --exclude node_modules --exclude dist --exclude .face-engine --exclude .vite-cache "$SRC/" "$FE/"
[ -e $FE/node_modules ] || ln -s "$SRC/node_modules" $FE/node_modules
cd $FE
restore() { rsync -a --delete --exclude node_modules --exclude dist --exclude .face-engine --exclude .vite-cache "$SRC/src/" "$FE/src/"; }
one() { restore; python3 "$1" "$2" || { echo "PLANTFAIL | $2" >> "$LOG"; return; }; node scripts/check-font-coverage.mjs > $S/last.log 2>&1; e=$?; echo "$e | c7=$(grep -c 'check 7' $S/last.log) | $2 | $(grep -m1 -E 'Comic|initial|revert|unset|ctrl-word|crash|Error' $S/last.log | cut -c1-200)" >> "$LOG"; }
: > "$LOG"
restore; node scripts/check-font-coverage.mjs > $S/last.log 2>&1; echo "clean exit $? | c7=$(grep -c 'check 7' $S/last.log) | $(tail -1 $S/last.log | cut -c1-160)" >> "$LOG"
for set in "$@"; do
  case $set in
    p7) PY=$I/pass8/critique/CTRL-FACE/instruments/p7plants.py ;;
    p8) PY=$I/pass8/critique/CTRL-FACE/instruments/p8plants.py ;;
    p9) PY=$I/pass9/prototype/CTRL-FACE/instruments/p9plants.py ;;
    p10) PY=$I/pass10/prototype/CTRL-FACE/instruments/p10plants.py ;;
  esac
  echo "== $set ($PY)" >> "$LOG"
  if [ $set = p7 ]; then printf '%s\n' "CONTROL literal (must red)" mint-face-token shadow-face-token-scoped shadow-font-token-root script-style-string ts-style-string cssText setAttribute-style "style.font shorthand" "ts h() style object" "svg font-family attr" "tailwind font-(--var)" "tailwind :class object" "tailwind :class string" "style template literal" "font-family var fallback-only (undeclared face)" > $S/list-$set.txt
  else python3 $PY --list > $S/list-$set.txt; fi
  while IFS= read -r n; do one $PY "$n"; done < $S/list-$set.txt
done
restore; node scripts/check-font-coverage.mjs > $S/last.log 2>&1; echo "restored clean exit $?" >> "$LOG"
echo DONE >> "$LOG"
