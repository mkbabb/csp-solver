#!/bin/bash
# PAL-WALK pass-9: peer-walk.spec.ts per config, sequential; exits read bare from files. No rm, no set -e.
S=<lane-scratch>
W=<repo>/.claude/worktrees/wf_308fa864-c94-1/web/frontend
cd $W
for cfg in "$@"; do
  eng=${cfg%%:*}; dpr=${cfg##*:}; tag=spec-$eng-$dpr-$RUNTAG
  while :; do l=$(sysctl -n vm.loadavg | awk '{print int($2)}'); [ "$l" -lt 120 ] && break; echo "$(date +%T) load $l waiting" >> $S/logs/$tag.load; sleep 60; done
  echo "start $(date +%T) $(sysctl -n vm.loadavg)" > $S/logs/$tag.load
  WALK_DPR=$dpr WALK_OUT=$S/test-results/$tag npx playwright test -c .pw-walk9.mts --project $eng $GREP > $S/logs/$tag.log 2>&1
  echo "exit=$?" > $S/logs/$tag.exit
  echo "end $(date +%T) $(sysctl -n vm.loadavg)" >> $S/logs/$tag.load
done
echo ALLDONE > $S/logs/spec-run-$RUNTAG.done
