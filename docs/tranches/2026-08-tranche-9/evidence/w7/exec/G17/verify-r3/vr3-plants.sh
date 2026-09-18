#!/bin/bash
# Verifier r3's own plants on the REAL tree: each shipped past r1, each must red at r2.
set -u
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-exec/web/frontend
cd "$W" || exit 1

plant () { # $1 file  $2 python-replace-old  $3 new
  python3 - "$1" "$2" "$3" <<'PY'
import sys
p, old, new = sys.argv[1], sys.argv[2], sys.argv[3]
s = open(p).read()
assert s.count(old) == 1, (p, old, s.count(old))
open(p, "w").write(s.replace(old, new))
PY
}

run () { # $1 label
  node scripts/.vr3-r1.mjs >/tmp/vr3-r1.out 2>&1; r1=$?
  node scripts/check-copy-register.mjs >/tmp/vr3-r2.out 2>&1; r2=$?
  echo "  $1  r1(4235e382) EXIT=$r1   r2(8d334845) EXIT=$r2"
  grep -m2 -E "jargon over RENDERED|✗" /tmp/vr3-r2.out | sed 's/^/      r2: /'
}

echo "=== VR3 PLANTS ON THE REAL TREE (r1 = parent scanner, r2 = cured) ==="
echo "-- baseline, no plant --"
run "baseline (no plant)"

echo "-- P1: the board's announce() wrapper, GameBoard.vue:883 --"
plant src/games/shared/GameBoard.vue 'announce(`${fill.count} ${fill.count === 1 ? "square" : "squares"} filled`);' 'announce(`${fill.count} ${fill.count === 1 ? "square" : "squares"} filled by the solver`);'
run "P1 announce() through a wrapper"
git checkout -- src/games/shared/GameBoard.vue

echo "-- P2: the gallery's sayDeck(), GameGallery.vue:405 (a voice in a THIRD file) --"
plant src/pencil/chrome/GameGallery/GameGallery.vue 'sayDeck(`${card.name}, ${i + 1} of ${count.value}. ${stagedLine(card)}`);' 'sayDeck(`${card.name}, ${i + 1} of ${count.value}. solver picked. ${stagedLine(card)}`);'
run "P2 sayDeck() direct voice"
git checkout -- src/pencil/chrome/GameGallery/GameGallery.vue

echo "-- P3: the guard's sayGuard(), GameGallery.vue:815 --"
plant src/pencil/chrome/GameGallery/GameGallery.vue 'sayGuard(`Choose keep, or ${guardVerb.value}.`);' 'sayGuard(`Choose keep, or ask the engine to ${guardVerb.value}.`);'
run "P3 sayGuard() direct voice"
git checkout -- src/pencil/chrome/GameGallery/GameGallery.vue

echo "-- P4: a COPY_KEY whose value is a call, GameControlPanel sublabel/washi --"
grep -n "washi: says(" src/games/shared/GameControlPanel.vue | head -3
echo "=== TREE STATE AFTER ==="
git status --porcelain -- src/
