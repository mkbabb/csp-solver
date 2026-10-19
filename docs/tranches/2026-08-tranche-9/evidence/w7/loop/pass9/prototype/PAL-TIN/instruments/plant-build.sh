#!/bin/bash
# PAL-TIN pass 9 · the .pcss plant IN THE TREE for one build, then removed; the tree's GameBoard sha checked after. No rm.
S=$SCRATCH; T=$WORKTREES/wf_308fa864-c94-2/web/frontend
cd $T || exit 9
before=$(shasum src/games/shared/GameBoard.vue | cut -c1-40)
cp src/games/shared/GameBoard.vue $S/GameBoard.vue.keep
printf 'html.dark { --color-peer-1-name: #ffd9b8; }\n' > src/games/shared/tin.pcss
L=$(grep -n '^import' src/games/shared/GameBoard.vue | head -1 | cut -d: -f1)
sed -i '' "${L}i\\
import \"./tin.pcss\";
" src/games/shared/GameBoard.vue
echo "planted: $(grep -c 'tin.pcss' src/games/shared/GameBoard.vue) import line(s)"; od -c src/games/shared/tin.pcss | head -3
echo "load $(uptime)"
npx vite build --config $S/cfg/vite.build.mts --outDir $S/dist-pcss --emptyOutDir > $S/logs/build-pcss2.vite.log 2>&1
echo "BUILD EXIT=$?"
cp $S/GameBoard.vue.keep src/games/shared/GameBoard.vue
mkdir -p $S/trash/plant-pcss; mv src/games/shared/tin.pcss $S/trash/plant-pcss/tin.pcss.$(date +%s)
after=$(shasum src/games/shared/GameBoard.vue | cut -c1-40)
echo "GameBoard before $before after $after $([ "$before" = "$after" ] && echo RESTORED || echo MISMATCH)"; ls src/games/shared/tin.pcss 2>&1
