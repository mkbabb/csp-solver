#!/bin/bash
# NOTE-LEDGER pass 5 — the ARM CENSUS. Flip the one token to each arm, run BOTH whole unit files
# the ledger's rows live in, record which rows red, restore by sha1. A born-RED demonstration per
# arm, in one run, with HOLD (the default) as the control that must read green.
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend
F=$W/src/games/shared/GameBoard.vue
cd $W
SHA=$(sha1sum $F | cut -d' ' -f1)
cp $F /tmp/ledger-gb-orig.vue 2>/dev/null || cp $F "$W/.ledger/gb-orig.vue"
ORIG=$( [ -f /tmp/ledger-gb-orig.vue ] && echo /tmp/ledger-gb-orig.vue || echo "$W/.ledger/gb-orig.vue")
for arm in hold age step tint; do
  sed -i '' "s/^const LEDGER_FULFILLED = \"[a-z]*\" as/const LEDGER_FULFILLED = \"$arm\" as/" $F
  grep -c "const LEDGER_FULFILLED = \"$arm\" as" $F >/dev/null || { echo "FLIP FAILED $arm"; exit 2; }
  npx vitest run src/games/shared/GameBoard.receipt.test.ts src/games/shared/GameBoard.notes.test.ts > $W/.ledger/arm-$arm.log 2>&1
  code=$?
  echo "ARM=$arm exit=$code $(grep -E '^ +Tests ' $W/.ledger/arm-$arm.log | tr -s ' ')"
  grep -E '^ +(×|✗|FAIL)|AssertionError' $W/.ledger/arm-$arm.log | sed 's/^/   /' | head -12
done
cp $ORIG $F
[ "$(sha1sum $F | cut -d' ' -f1)" = "$SHA" ] && echo "RESTORED sha1 $SHA" || echo "RESTORE MISMATCH"
