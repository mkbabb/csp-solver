#!/bin/zsh
# runner2.sh — phase 2: K2 (hinge on the CSS clock) then R2, interleaved with the control (4256)
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-14/.gt
LOG=matrix-2.log
run() { echo "$(date +%T) load $(sysctl -n vm.loadavg | awk '{print $2}') start $1" >> $LOG; node probe.mjs $2 $3 $4 $5 $6 $7 runs/$1.json $8 $9 ${10} >> $LOG 2>&1 || echo "FAIL $1" >> $LOG; }
swap() { kill $(cat pid-proto) 2>/dev/null; sleep 2; zsh serve.sh $1 4255 proto >> $LOG 2>&1; sleep 4; curl -s -o /dev/null -w "serve $1 %{http_code}\n" http://127.0.0.1:4255/ >> $LOG; }
for ARM in K2 R2; do
  swap dist-$ARM
  echo "$(date +%T) selftest $(node selftest.mjs)" >> $LOG
  for P in A B; do
    run s-base$ARM$P-chromium-1280x800-light 4256 chromium 1280x800 light 0 0 1 plain 3
    run s-$ARM$P-chromium-1280x800-light 4255 chromium 1280x800 light 0 0 1 plain 3
    run s-base$ARM$P-chromium-390x844-light 4256 chromium 390x844 light 0 1 1 plain 3
    run s-$ARM$P-chromium-390x844-light 4255 chromium 390x844 light 0 1 1 plain 3
  done
  for E in chromium webkit; do for VP in 1280x800 390x844; do T=0; [[ $VP == 390x844 ]] && T=1
    for S in light dark; do
      [[ $ARM == K2 && $S == dark ]] && continue
      run t-$ARM-$E-$VP-$S 4255 $E $VP $S 0 $T 0 plain 4
    done; done; done
  for E in chromium webkit; do
    run p-$ARM-$E-1280x800-light 4255 $E 1280x800 light 1 0 0 plain 3
    run p-$ARM-$E-390x844-light 4255 $E 390x844 light 1 1 0 plain 3
    run i-$ARM-$E-1280x800-light 4255 $E 1280x800 light 0 0 0 inject 3
  done
  run r-$ARM-chromium-1280x800-light 4255 chromium 1280x800 light 0 0 0 repress 3
  run r-$ARM-webkit-390x844-light 4255 webkit 390x844 light 0 1 0 repress 3
done
echo "$(date +%T) MATRIX 2 DONE" >> $LOG
