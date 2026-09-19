#!/bin/zsh
# T9-W8 C02 repair round 3 — the estate's perf rig (GATE A/B/C/D), both arms, INTERLEAVED
# cured, base, cured, base, cured, base. The rig is UNMODIFIED and serves its own dist on
# :4259, inside this track's 4250-4260 band. Each run stamps loadavg at both ends and its exit.
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-bake/web/frontend
R=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C02/fix-r3/rig
mkdir -p $R
cd $W
run() { # $1 = arm (dist | dist-base), $2 = out name
  {
    echo "loadavg start: $(sysctl -n vm.loadavg)"
    node perf-rig/ci-subset.mjs --dist $1 --port 4259
    echo "EXIT=$?"
    echo "loadavg end: $(sysctl -n vm.loadavg)"
  } > $R/$2 2>&1
  echo "DONE $2 exit=$(grep -o 'EXIT=[0-9]*' $R/$2 | tail -1)"
}
run dist      cured-run1.txt
run dist-base base-run1.txt
run dist      cured-run2.txt
run dist-base base-run2.txt
run dist      cured-run3.txt
run dist-base base-run3.txt
echo "RIG BATTERY COMPLETE"
