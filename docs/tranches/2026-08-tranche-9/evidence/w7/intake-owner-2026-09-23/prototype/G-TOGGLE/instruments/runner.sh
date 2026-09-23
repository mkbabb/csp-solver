#!/bin/zsh
# runner.sh <arm K|R> — interleaved control(4256) / arm(4255), sequential; log to matrix-<arm>.log
ARM=$1
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-14/.gt
LOG=matrix-$ARM.log
run() { # name port engine vp scheme prm touch shots mode flips
  echo "$(date +%T) load $(sysctl -n vm.loadavg | awk '{print $2}') start $1" >> $LOG
  node probe.mjs $2 $3 $4 $5 $6 $7 runs/$1.json $8 $9 ${10} >> $LOG 2>&1 || echo "FAIL $1" >> $LOG
}
for E in chromium webkit; do for VP in 1280x800 390x844; do T=0; [[ $VP == 390x844 ]] && T=1
  for S in light dark; do
    run t-base$ARM-$E-$VP-$S 4256 $E $VP $S 0 $T 0 plain 4
    run t-$ARM-$E-$VP-$S 4255 $E $VP $S 0 $T 0 plain 4
  done; done; done
for E in chromium webkit; do
  run p-base$ARM-$E-1280x800-light 4256 $E 1280x800 light 1 0 0 plain 3
  run p-$ARM-$E-1280x800-light 4255 $E 1280x800 light 1 0 0 plain 3
  run i-base$ARM-$E-1280x800-light 4256 $E 1280x800 light 0 0 0 inject 3
  run i-$ARM-$E-1280x800-light 4255 $E 1280x800 light 0 0 0 inject 3
done
run r-$ARM-chromium-1280x800-light 4255 chromium 1280x800 light 0 0 0 repress 3
run r-$ARM-webkit-390x844-light 4255 webkit 390x844 light 0 1 0 repress 3
echo "$(date +%T) MATRIX $ARM DONE" >> $LOG
