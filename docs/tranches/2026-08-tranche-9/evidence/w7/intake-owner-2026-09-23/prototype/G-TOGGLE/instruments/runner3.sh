#!/bin/zsh
# runner3.sh — phase 3: the final source (v1 grid timer) — R1 built fresh; K (dist-K) is v1 already.
# painted s-runs for K1 (2 photographs) and R1 (1280 + 390), t-runs R1 light boot both engines.
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-14/.gt
LOG=matrix-3.log
run() { echo "$(date +%T) load $(sysctl -n vm.loadavg | awk '{print $2}') start $1" >> $LOG; node probe.mjs $2 $3 $4 $5 $6 $7 runs/$1.json $8 $9 ${10} >> $LOG 2>&1 || echo "FAIL $1" >> $LOG; }
swap() { kill $(cat pid-proto) 2>/dev/null; sleep 2; zsh serve.sh $1 4255 proto >> $LOG 2>&1; sleep 4; curl -s -o /dev/null -w "serve $1 %{http_code}\n" http://127.0.0.1:4255/ >> $LOG; }
cd ../web/frontend
(npx vue-tsc -b && echo "vue-tsc ok" || echo "vue-tsc FAIL") >> ../../.gt/$LOG 2>&1
VITE_STORYBOOK_ARM=R npx vite build --config .intake/build.mts --outDir dist-R1 --logLevel error >> ../../.gt/$LOG 2>&1; echo "R1 build exit $?" >> ../../.gt/$LOG
cd ../../.gt
until grep -q "MATRIX 2 DONE" matrix-2.log; do sleep 5; done
swap dist-K
echo "$(date +%T) selftest $(node selftest.mjs)" >> $LOG
for P in A B; do
  run s-K1$P-chromium-1280x800-light 4255 chromium 1280x800 light 0 0 1 plain 3
  run s-K1$P-chromium-390x844-light 4255 chromium 390x844 light 0 1 1 plain 3
done
swap dist-R1
for P in A B; do
  run s-R1$P-chromium-1280x800-light 4255 chromium 1280x800 light 0 0 1 plain 3
  run s-R1$P-chromium-390x844-light 4255 chromium 390x844 light 0 1 1 plain 3
done
for E in chromium webkit; do
  run t-R1-$E-1280x800-light 4255 $E 1280x800 light 0 0 0 plain 4
  run t-R1-$E-390x844-light 4255 $E 390x844 light 0 1 0 plain 4
  run p-R1-$E-1280x800-light 4255 $E 1280x800 light 1 0 0 plain 3
done
echo "$(date +%T) MATRIX 3 DONE" >> $LOG
