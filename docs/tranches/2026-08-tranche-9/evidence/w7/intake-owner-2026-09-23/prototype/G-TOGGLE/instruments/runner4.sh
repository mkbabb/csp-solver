#!/bin/zsh
# runner4.sh — phase 4: the FINAL source (v1 grid timer + the re-reading settle): K3, R3 — G7 under the injector, G10
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-14/.gt
LOG=matrix-4.log
run() { echo "$(date +%T) load $(sysctl -n vm.loadavg | awk '{print $2}') start $1" >> $LOG; node probe.mjs $2 $3 $4 $5 $6 $7 runs/$1.json $8 $9 ${10} >> $LOG 2>&1 || echo "FAIL $1" >> $LOG; }
swap() { kill $(cat pid-proto) 2>/dev/null; sleep 2; zsh serve.sh $1 4255 proto >> $LOG 2>&1; sleep 4; curl -s -o /dev/null -w "serve $1 %{http_code}\n" http://127.0.0.1:4255/ >> $LOG; }
cd ../web/frontend
(npx vue-tsc -b && echo "vue-tsc ok" || echo "vue-tsc FAIL") >> ../../.gt/$LOG 2>&1
npx vite build --config .intake/build.mts --outDir dist-K3 --logLevel error >> ../../.gt/$LOG 2>&1; echo "K3 build exit $?" >> ../../.gt/$LOG
VITE_STORYBOOK_ARM=R npx vite build --config .intake/build.mts --outDir dist-R3 --logLevel error >> ../../.gt/$LOG 2>&1; echo "R3 build exit $?" >> ../../.gt/$LOG
cd ../../.gt
until grep -q "MATRIX 3 DONE" matrix-3.log; do sleep 5; done
for ARM in K3 R3; do
  swap dist-$ARM
  for E in webkit chromium; do
    run i-$ARM-$E-1280x800-light 4255 $E 1280x800 light 0 0 0 inject 3
    run t-$ARM-$E-1280x800-light 4255 $E 1280x800 light 0 0 0 plain 4
  done
  run i-$ARM-webkit-390x844-light 4255 webkit 390x844 light 0 1 0 inject 3
done
run r-R3-chromium-1280x800-light 4255 chromium 1280x800 light 0 0 0 repress 3
echo "$(date +%T) MATRIX 4 DONE" >> $LOG
