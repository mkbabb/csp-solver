#!/bin/zsh
# runner6.sh — phase 6: v4 (the grid swap two rAFs off the hinge timer) — does the cold digit blackout go?
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-14/.gt
LOG=matrix-6.log
run() { echo "$(date +%T) load $(sysctl -n vm.loadavg | awk '{print $2}') start $1" >> $LOG; node probe.mjs $2 $3 $4 $5 $6 $7 runs/$1.json $8 $9 ${10} >> $LOG 2>&1 || echo "FAIL $1" >> $LOG; }
swap() { kill $(cat pid-proto) 2>/dev/null; sleep 2; zsh serve.sh $1 4255 proto >> $LOG 2>&1; sleep 4; curl -s -o /dev/null -w "serve $1 %{http_code}\n" http://127.0.0.1:4255/ >> $LOG; }
cd ../web/frontend
(./node_modules/.bin/prettier --check src/composables/useTheme.ts && echo "prettier ok" || echo "prettier FAIL") >> ../../.gt/$LOG 2>&1
(npx vue-tsc -b && echo "vue-tsc ok" || echo "vue-tsc FAIL") >> ../../.gt/$LOG 2>&1
npx vite build --config .intake/build.mts --outDir dist-K5 --logLevel error >> ../../.gt/$LOG 2>&1; echo "K5 build exit $?" >> ../../.gt/$LOG
VITE_STORYBOOK_ARM=R npx vite build --config .intake/build.mts --outDir dist-R5 --logLevel error >> ../../.gt/$LOG 2>&1; echo "R5 build exit $?" >> ../../.gt/$LOG
cd ../../.gt
swap dist-K5
for P in A B C; do
  run s-K5$P-chromium-1280x800-light 4255 chromium 1280x800 light 0 0 1 plain 3
done
run s-K5A-chromium-390x844-light 4255 chromium 390x844 light 0 1 1 plain 3
run t-K5-chromium-1280x800-light 4255 chromium 1280x800 light 0 0 0 plain 4
run t-K5-webkit-1280x800-light 4255 webkit 1280x800 light 0 0 0 plain 4
swap dist-R5
for P in A B; do
  run s-R5$P-chromium-1280x800-light 4255 chromium 1280x800 light 0 0 1 plain 3
done
run t-R5-chromium-1280x800-light 4255 chromium 1280x800 light 0 0 0 plain 4
echo "$(date +%T) MATRIX 6 DONE" >> $LOG
