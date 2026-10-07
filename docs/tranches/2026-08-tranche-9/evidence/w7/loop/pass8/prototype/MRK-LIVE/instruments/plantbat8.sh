#!/bin/bash
# The file-plant battery, on the SCRATCH COPY served at :4235 (the tree is never edited). Each plant:
# apply → HMR settle (a poll on the served module) → the rows that can see it, both engines → restore → sha.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklive8b
C=$S/copy/web/frontend
cd $C
run() { # plant, grep
  local name=$1 grep=$2
  echo "=== $name rows /$grep/ load $(sysctl -n vm.loadavg)"
  python3 $S/plants8.py $name apply
  sleep 4
  PWOUT=$name npx playwright test --config $S/pw.copy.mjs -g "$grep" > $S/logs/plant-$name.log 2>&1
  echo "$name EXIT $?"
  grep -E '^\s+[0-9]+ (passed|failed)' $S/logs/plant-$name.log
  grep -E '✘' $S/logs/plant-$name.log | sed -E 's/.*› (G-LIVE-[0-9]+[^(]*).*/  RED \1/' | sort | uniq -c
  python3 $S/plants8.py $name restore
  sleep 3
}
for p in ${PLANTS:-NOPREF2 COARSE2 MORE2 DARKX4b X4 X4b FCCLIP2 X5 X7 X8 X9 R2}; do
  case $p in
    NOPREF2|COARSE2|MORE2) run $p "G-LIVE-16|G-LIVE-23" ;;
    DARKX4b|X4|X4b) run $p "G-LIVE-16 .*\[reduce\]|G-LIVE-23 .*\[reduce\]" ;;
    FCCLIP2) run $p "G-LIVE-21" ;;
    X5|X7|X8|X9) run $p "G-LIVE-19" ;;
    R2) run $p "G-LIVE-4 " ;;
  esac
done
echo "final shas: $(shasum src/assets/index.css src/pencil/sheet/AnswerKeyLaminate.vue src/pencil/chrome/FocusRing.vue | cut -c1-12 | tr '\n' ' ')"
echo ALLDONE
