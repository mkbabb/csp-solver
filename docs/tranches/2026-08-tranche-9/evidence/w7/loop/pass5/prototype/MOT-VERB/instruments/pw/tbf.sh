#!/bin/bash
EV=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MOT-VERB
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend; G=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue; SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mv
cd $W
t(){ PLAYWRIGHT_BASE_URL=http://127.0.0.1:$2 npx playwright test -c playwright-throttle.config.ts --project=theme-bake-chromium --project=theme-bake-webkit --reporter=line > $EV/logs/estate-tbf-$1.log 2>&1; echo "EXIT $?" >> $EV/logs/estate-tbf-$1.log; echo "done $1 $(date +%T)"; }
t after 4247
t control 4248
# PLANT: the theme token back in the grid cacheKey (a re-mint per flip)
python3 - <<'PY'
p="/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue"
s=open(p).read()
s=s.replace('import { usePathAnimation } from "./usePathAnimation";','import { usePathAnimation } from "./usePathAnimation";\nimport { useTheme } from "@/composables/useTheme";\nconst { isDark } = useTheme();',1)
s=s.replace('cacheKey: `grid-${props.boardSize}-${props.subgridSize}`,','cacheKey: `grid-${props.boardSize}-${props.subgridSize}-${isDark.value ? "d" : "l"}`,',1)
open(p,"w").write(s)
PY
grep -c 'isDark.value ? "d"' $G
npx vite build --config .mot-verb/build.mts --outDir dist-plant > $EV/logs/plant-m15-build.log 2>&1; echo "EXIT $?" >> $EV/logs/plant-m15-build.log
cp $SP/HandDrawnGrid.vue.bak $G; shasum $G $SP/HandDrawnGrid.vue.bak
nohup npx vite preview --config .mot-verb/serve.mts --outDir dist-plant --host 127.0.0.1 --port 4245 --strictPort > $SP/srv-plant.log 2>&1 &
echo "plant wrapper $!"; sleep 5; echo "plant listener $(lsof -nP -iTCP:4245 -sTCP:LISTEN -t)"
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4245 npx playwright test -c playwright-throttle.config.ts --project=theme-bake-chromium --reporter=line > $EV/logs/plant-m15-tbf.log 2>&1; echo "EXIT $?" >> $EV/logs/plant-m15-tbf.log; echo "done plant"
kill $(lsof -nP -iTCP:4245 -sTCP:LISTEN -t); rm -rf dist-plant
echo ALLDONE3
