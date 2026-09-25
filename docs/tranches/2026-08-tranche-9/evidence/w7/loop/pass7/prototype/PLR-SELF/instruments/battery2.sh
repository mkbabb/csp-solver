#!/bin/bash
# PLR-SELF pass 7: the regime census (both ballot arms), the break battery (each plant a file edit the dev server
# hot-swaps; restored by copy, sha1-verified), the radius plant, and the seam frames (both arms). Serial.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself7b
FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend
I=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/instruments
PM=$FE/src/pencil/chrome/PlayerMark/PlayerMark.vue; HS=$FE/src/pencil/chrome/AttributionCard/HeadSheet.vue
cd $FE
sums() { echo "PM $(shasum $PM|cut -c1-12) HS $(shasum $HS|cut -c1-12) spec $(shasum e2e/player-mark.spec.ts|cut -c1-12)"; }
plant() { cp $2 $S/hold.$1; python3 $S/plant.py $1; sleep 3; }
restore() { cp $S/hold.$1 $2; sleep 3; }
echo "sha1 at start: $(sums)"; echo "LOAD $(sysctl -n vm.loadavg)"
: > $S/regime.jsonl
ARM=names OUT=$S/regime.jsonl TD=$FE/.plr-self/specs TM=p7-regime WK=2 npx playwright test -c .plr-self/pw7b.mts > $S/logs/regime-names.log 2>&1; echo "regime names exit $?"
plant ARM-cells $PM
ARM=cells OUT=$S/regime.jsonl TD=$FE/.plr-self/specs TM=p7-regime WK=2 npx playwright test -c .plr-self/pw7b.mts > $S/logs/regime-cells.log 2>&1; echo "regime cells exit $?"
restore ARM-cells $PM; echo "after ARM-cells: $(sums)"
run() { # plant file grep
  local p=$1 f=$2 g=$3; local before=$(shasum $f|cut -c1-40)
  plant $p $f
  WK=2 npx playwright test -c .plr-self/pw7b.mts -g "$g" > $S/logs/break-$p.log 2>&1; local ec=$?
  restore $p $f; local after=$(shasum $f|cut -c1-40)
  echo "$p exit=$ec restored=$([ "$before" = "$after" ] && echo OK || echo MISMATCH) :: $(grep -E '^\s+[0-9]+ (passed|failed|flaky)' $S/logs/break-$p.log | tr -s ' ' | tr '\n' ' ')"
  grep -E '✘|✓' $S/logs/break-$p.log | sed 's/^ */   /' | cut -c1-170
}
run P1-one-axis $PM "portrait phone compresses"
run P2-no-refit $PM "reads the space again"
run P3-label-guard $PM "one tap is one toggle"
run P4-sheet-unprevented $PM "a tap opens the mark"
run P5-X6-file $HS "all four sides"
run P6-half-shut $HS "shut, both head disclosures"
# the chair's probes on the plants they name
plant P2-no-refit $PM; for e in chromium webkit; do node $I/rest-probes.mjs --engine $e --preset self-resize --url http://127.0.0.1:4241; echo "EXIT rest $e self-resize [P2 planted] $?"; done; restore P2-no-refit $PM
plant P3-label-guard $PM; for e in chromium webkit; do node $I/rest-probes.mjs --engine $e --preset self-touch --plant relabel --url http://127.0.0.1:4241; echo "EXIT rest $e self-touch+relabel [P3 planted] $?"; done; restore P3-label-guard $PM
plant P4-sheet-unprevented $PM; for e in chromium webkit; do node $I/rest-probes.mjs --engine $e --preset self-touch --url http://127.0.0.1:4241; echo "EXIT rest $e self-touch [P4 planted] $?"; done; restore P4-sheet-unprevented $PM
plant P7-radius-literal $HS; OUT=$S/radius-literal.json U=http://127.0.0.1:4241 node $S/radius.mjs; echo "EXIT radius [P7 literal planted] $?"; restore P7-radius-literal $HS
echo "after breaks: $(sums)"
# the seam frames, B's id pinned, one payload, one variable (TAP_IS_A_LOOK)
OUTDIR=$S/frames ARM=b TD=$FE/.plr-self/specs TM=p7-seam WK=1 npx playwright test -c .plr-self/pw7b.mts > $S/logs/seam-b.log 2>&1; echo "seam b exit $?"
plant ARM-a $PM
OUTDIR=$S/frames ARM=a TD=$FE/.plr-self/specs TM=p7-seam WK=1 npx playwright test -c .plr-self/pw7b.mts > $S/logs/seam-a.log 2>&1; echo "seam a exit $?"
restore ARM-a $PM
echo "sha1 at end: $(sums)"; echo "LOAD $(sysctl -n vm.loadavg)"
echo BATTERY2-DONE
