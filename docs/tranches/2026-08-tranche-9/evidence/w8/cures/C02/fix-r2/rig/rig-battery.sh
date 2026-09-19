#!/bin/zsh
# T9-W8 C02 repair round 2 — the perf rig's GATE A/B/C/D, both arms, INTERLEAVED.
# cured-run1 was taken before this script; it continues base1, cured2, base2, cured3, base3.
# Each run stamps loadavg at both ends and its own exit code. The rig serves its own dist on
# :4390 and needs the host to itself: nothing else runs while this does.
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-bake/web/frontend
R=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C02/fix-r2/rig
cd $W
run() { # $1 = arm (dist | dist-base), $2 = out name
  {
    echo "loadavg start: $(sysctl -n vm.loadavg)"
    node perf-rig/ci-subset.mjs --dist $1
    echo "EXIT=$?"
    echo "loadavg end: $(sysctl -n vm.loadavg)"
  } > $R/$2 2>&1
  echo "DONE $2 $(grep -c 'RESULT' $R/$2)"
}
run dist-base base-run1.txt
run dist      cured-run2.txt
run dist-base base-run2.txt
run dist      cured-run3.txt
run dist-base base-run3.txt
echo "BATTERY COMPLETE"
