#!/bin/zsh
# Round 3 — round 2's two GREENs were the CONTROLS aimed at the wrong branch, not the units
# failing. `adoptInk(k, true)` cannot move an index the first frame already agreed, and
# `bindSelfInk` is not the gate on a solo page (`mint` is). Both re-aimed here.
set -u
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
cd "$W" || exit 1
row() { printf "  %-56s %s\n" "$1" "$2"; }
gone() { grep -qF -- "$2" "$1" && { echo "  !! control did not land"; return 1; } || return 0; }
verdict() { if grep -qE "[0-9]+ failed" "$1"; then row "$2" "RED (as required)"; grep -E "× U[0-9]|× [a-z]" "$1" | head -5; else row "$2" "GREEN — no unit holds it"; fi }

cp src/games/shared/useSession.ts "$S/us.bak"

echo "=== C1' · NOTHING is ever agreed (the wire rule's set never fills) ==="
perl -pi -e 's/from === e\[1\]\);/false);/' src/games/shared/useSession.ts
gone src/games/shared/useSession.ts "from === e[1]);" && {
  npx vitest run src/games/shared/useSession.test.ts > "$S/br3-noagree.log" 2>&1
  verdict "$S/br3-noagree.log" "no index is ever AGREED"
}
cp "$S/us.bak" src/games/shared/useSession.ts

echo "=== C2' · the SOLO page takes a colour (mint stops gating on the room) ==="
perl -pi -e 's/ink: id === selfId\.value && !roomHasOthers\(map\) \? \{\} : ident!\.inkFor\(index\),/ink: ident!.inkFor(index),/' src/games/shared/useSession.ts
gone src/games/shared/useSession.ts "!roomHasOthers(map) ? {}" && {
  npx vitest run src/games/shared/useSession.test.ts > "$S/br3-solo.log" 2>&1
  verdict "$S/br3-solo.log" "the solo page takes a colour"
}
cp "$S/us.bak" src/games/shared/useSession.ts

echo "=== C3' · the UNNAMED hand is not moved off a re-seated index (U3's ten lines) ==="
perl -0pi -e 's/    inkIndex\[id\] = \+\+top;\n    claimed\.set\(top, id\);\n    next\[id\] = \{ \.\.\.next\[id\], ink: inkOf\(id\) \};//s' src/games/shared/useSession.ts
gone src/games/shared/useSession.ts "inkIndex[id] = ++top;" && {
  npx vitest run src/games/shared/useSession.test.ts > "$S/br3-reseat.log" 2>&1
  verdict "$S/br3-reseat.log" "the unnamed hand keeps a claimed index"
}
cp "$S/us.bak" src/games/shared/useSession.ts

echo "restored"
npx vitest run src/games/shared/useSession.test.ts 2>&1 | grep -E "Tests +[0-9]"
npx vue-tsc -b >/dev/null 2>&1 && echo "vue-tsc 0" || echo "vue-tsc RED"
echo done
