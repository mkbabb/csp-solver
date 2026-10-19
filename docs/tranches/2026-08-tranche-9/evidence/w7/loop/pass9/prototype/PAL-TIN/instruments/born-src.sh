#!/bin/bash
# PAL-TIN pass 9 · the .pcss born-RED, SOURCE arm, on the final gate bytes: the same plant on the rsync replica
# (tin.pcss + GameBoard's import), the gate run planted then clean in one run, the replica restored. No rm, no set -e.
S=$SCRATCH; R=$S/rep2/web/frontend; L=$S/logs/born-src.txt
cd $R || exit 9
before=$(shasum src/games/shared/GameBoard.vue | cut -c1-40); cp src/games/shared/GameBoard.vue $S/GameBoard.rep2.keep
printf 'html.dark { --color-peer-1-name: #ffd9b8; }\n' > src/games/shared/tin.pcss
N=$(grep -n '^import' src/games/shared/GameBoard.vue | head -1 | cut -d: -f1)
sed -i '' "${N}i\\
import \"./tin.pcss\";
" src/games/shared/GameBoard.vue
echo "gate $(shasum scripts/check-peer-tin.mjs | cut -c1-8) · planted $(grep -c 'tin.pcss' src/games/shared/GameBoard.vue) import line(s) · load $(uptime | sed 's/.*averages*: //')" > $L
od -c src/games/shared/tin.pcss | head -3 >> $L
node scripts/check-peer-tin.mjs > $S/logs/born-src-planted.txt 2>&1; e=$?; echo "source gate, planted: exit $e" >> $L
grep -E '^\s+4[ab]:' $S/logs/born-src-planted.txt | cut -c1-200 >> $L
cp $S/GameBoard.rep2.keep src/games/shared/GameBoard.vue; mkdir -p $S/trash/plant-pcss; mv src/games/shared/tin.pcss $S/trash/plant-pcss/rep2.tin.pcss.$(date +%s)
node scripts/check-peer-tin.mjs > $S/logs/born-src-clean.txt 2>&1; e=$?; echo "source gate, restored (the control): exit $e" >> $L
after=$(shasum src/games/shared/GameBoard.vue | cut -c1-40); echo "GameBoard $([ "$before" = "$after" ] && echo RESTORED || echo MISMATCH)" >> $L
