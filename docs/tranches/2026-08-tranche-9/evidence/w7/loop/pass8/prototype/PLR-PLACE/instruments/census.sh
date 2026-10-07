#!/bin/bash
# PLR-PLACE pass 8 · the three-arm census on the served byte copy (:4243). No set -e.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/place8
C=$S/copy/web/frontend; L=$S/logs/census.txt
export P8_OUT=$S/readings P8_PORT=4243 P8_WK=2
cd $C
sha() { shasum $C/src/pencil/chrome/PlayerMark/PlayerMark.vue $C/src/App.vue | cut -c1-12 | tr '\n' ' '; }
CELLS=''
for sz in 3 4; do for c in '390,664' '390,800' '360,800' '390,844' '390,860' '430,932' '768,1024' '844,390' '812,375'; do CELLS="$CELLS{\"w\":${c%,*},\"h\":${c#*,},\"n\":2,\"size\":$sz},"; done; for c in '1280,800' '1440,900' '1536,864' '1920,1080'; do CELLS="$CELLS{\"w\":${c%,*},\"h\":${c#*,},\"n\":2,\"size\":$sz,\"fine\":true},"; done; done
CELLS="[$CELLS{\"w\":390,\"h\":664,\"n\":2,\"size\":2}]"
RSZ='[{"n":2,"from":[390,860],"to":[390,664]},{"n":2,"size":4,"from":[430,932],"to":[390,664]},{"n":2,"size":4,"fine":true,"from":[1920,1080],"to":[1280,800]}]'
run() { # arm
  echo "== $1 start $(date +%T) load $(uptime | sed 's/.*averages: //') sha $(sha)" >> $L
  P8_ARM=$1 P8_WHAT=kill P8_CELLS="$CELLS" npx playwright test -c .place8/pw.config.ts .place8/p8-census.spec.ts > $S/logs/census-kill-$1.log 2>&1; echo "kill $1 exit=$?" >> $L
  P8_ARM=$1 P8_WHAT=resize P8_RSZ="$RSZ" P8_WK=1 npx playwright test -c .place8/pw.config.ts .place8/p8-census.spec.ts > $S/logs/census-rsz-$1.log 2>&1; echo "resize $1 exit=$?" >> $L
  echo "== $1 end $(date +%T) sha $(sha)" >> $L
}
run chart
P8_ARM=chart P8_WHAT=aa P8_WK=1 npx playwright test -c .place8/pw.config.ts .place8/p8-census.spec.ts > $S/logs/aa-chart.log 2>&1; echo "aa chart exit=$?" >> $L
P8_ARM=chart P8_WHAT=g10 P8_WK=1 npx playwright test -c .place8/pw.config.ts .place8/p8-census.spec.ts > $S/logs/g10.log 2>&1; echo "g10 exit=$?" >> $L
python3 $S/cfg/plant.py YIELD apply >> $L 2>&1; sleep 8
run yield
python3 $S/cfg/plant.py YIELD restore >> $L 2>&1
python3 $S/cfg/plant.py LIST apply >> $L 2>&1; sleep 8
run list
python3 $S/cfg/plant.py LIST restore >> $L 2>&1
echo "DONE $(date +%T) sha $(sha)" >> $L
