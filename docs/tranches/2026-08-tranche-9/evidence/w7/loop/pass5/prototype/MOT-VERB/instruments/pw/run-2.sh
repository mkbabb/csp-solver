#!/bin/bash
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend
cd /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mv/pw
kill 80558 80476 2>/dev/null; sleep 1
(cd $W && npx vite build --config .mot-verb/build.mts > /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MOT-VERB/logs/build2.log 2>&1; echo "EXIT $?" >> /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MOT-VERB/logs/build2.log)
(cd $W && nohup npx vite preview --config .mot-verb/serve.mts --outDir dist --host 127.0.0.1 --port 4247 --strictPort > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mv/srv-after2.log 2>&1 &)
sleep 6
echo "after2 pid=$(lsof -nP -iTCP:4247 -sTCP:LISTEN -t) $(curl -s http://127.0.0.1:4247/ | grep -o 'index-[A-Za-z0-9_-]*\.js')"
r() { local name=$1 spec=$2 proj=$3; shift 3; env "$@" npx playwright test -c pw.config.mts specs/$spec --project=$proj > ../$name.log 2>&1; echo "EXIT $?" >> ../$name.log; echo "done $name $(date +%T)"; }
r m19b-chromium m19.spec.ts chromium ARMS=after,main
r m19b-webkit m19.spec.ts webkit ARMS=after,main
r b10 b10.spec.ts chromium
r m15crop m15crop.spec.ts chromium
r gb3-chromium gb3.spec.ts chromium
r gb3-webkit gb3.spec.ts webkit
r m15-chromium m15.spec.ts chromium
r m15-webkit m15.spec.ts webkit
r m15prm-chromium m15.spec.ts chromium PRM=1 ARMS=after,main
r m15prm-webkit m15.spec.ts webkit PRM=1 ARMS=after,main
e() { local name=$1 url=$2 cfg=$3; shift 3; (cd $W && PLAYWRIGHT_BASE_URL=$url npx playwright test -c $cfg "$@" > /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MOT-VERB/logs/estate-$name.log 2>&1; echo "EXIT $?" >> /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MOT-VERB/logs/estate-$name.log); echo "done estate-$name $(date +%T)"; }
e tbf-after http://127.0.0.1:4247 playwright.config.ts e2e/theme-bake-freshness.spec.ts
e tbf-control http://127.0.0.1:4248 playwright.config.ts e2e/theme-bake-freshness.spec.ts
e vreg-after http://127.0.0.1:4247 playwright.config.ts e2e/visual-regression.spec.ts
e vreg-control http://127.0.0.1:4248 playwright.config.ts e2e/visual-regression.spec.ts
e golden-after http://127.0.0.1:4247 playwright-golden.config.ts
e golden-control http://127.0.0.1:4248 playwright-golden.config.ts
e filtercensus-after http://127.0.0.1:4247 playwright-throttle.config.ts e2e/filter-census.spec.ts
e drawer-after http://127.0.0.1:4247 playwright.config.ts e2e/drawer.spec.ts
e gallery-after http://127.0.0.1:4247 playwright.config.ts e2e/gallery.spec.ts
e gallery-control http://127.0.0.1:4248 playwright.config.ts e2e/gallery.spec.ts
echo ALLDONE2
