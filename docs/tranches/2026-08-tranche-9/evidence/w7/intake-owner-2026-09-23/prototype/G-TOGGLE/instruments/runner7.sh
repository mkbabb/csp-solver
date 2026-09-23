#!/bin/zsh
# runner7.sh — phase 7: v5 (the grid swap on the CSS clock: two frames on, the hinge, two frames off)
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-14/.gt
LOG=matrix-7.log
run() { echo "$(date +%T) load $(sysctl -n vm.loadavg | awk '{print $2}') start $1" >> $LOG; node probe.mjs $2 $3 $4 $5 $6 $7 runs/$1.json $8 $9 ${10} >> $LOG 2>&1 || echo "FAIL $1" >> $LOG; }
swap() { kill $(cat pid-proto) 2>/dev/null; sleep 2; zsh serve.sh $1 4255 proto >> $LOG 2>&1; sleep 4; curl -s -o /dev/null -w "serve $1 %{http_code}\n" http://127.0.0.1:4255/ >> $LOG; }
cd ../web/frontend
(npx vue-tsc -b && echo "vue-tsc ok" || echo "vue-tsc FAIL") >> ../../.gt/$LOG 2>&1
npx vite build --config .intake/build.mts --outDir dist-K6 --logLevel error >> ../../.gt/$LOG 2>&1; echo "K6 build exit $?" >> ../../.gt/$LOG
VITE_STORYBOOK_ARM=R npx vite build --config .intake/build.mts --outDir dist-R6 --logLevel error >> ../../.gt/$LOG 2>&1; echo "R6 build exit $?" >> ../../.gt/$LOG
cd ../../.gt
until grep -q "MATRIX 6 DONE" matrix-6.log; do sleep 5; done
swap dist-K6
for P in A B C D; do
  run s-K6$P-chromium-1280x800-light 4255 chromium 1280x800 light 0 0 1 plain 3
done
for P in A B; do
  run s-K6$P-chromium-390x844-light 4255 chromium 390x844 light 0 1 1 plain 3
done
run t-K6-chromium-1280x800-light 4255 chromium 1280x800 light 0 0 0 plain 4
run t-K6-webkit-1280x800-light 4255 webkit 1280x800 light 0 0 0 plain 4
run p-K6-chromium-1280x800-light 4255 chromium 1280x800 light 1 0 0 plain 3
run i-K6-chromium-1280x800-light 4255 chromium 1280x800 light 0 0 0 inject 3
swap dist-R6
for P in A B C; do
  run s-R6$P-chromium-1280x800-light 4255 chromium 1280x800 light 0 0 1 plain 3
done
run t-R6-chromium-1280x800-light 4255 chromium 1280x800 light 0 0 0 plain 4
run t-R6-webkit-390x844-light 4255 webkit 390x844 light 0 1 0 plain 4
echo "$(date +%T) MATRIX 7 DONE" >> $LOG
