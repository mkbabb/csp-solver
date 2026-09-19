#!/bin/zsh
# PAL-WALK pass-3 · born-RED, round 2. Every substitution is VERIFIED to have landed before the
# row is run — round 1 reported three GREENs that were patterns failing to match, not gates
# failing to hold.
set -u
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
cd "$W" || exit 1

applied() { # file, needle-that-must-be-GONE
  if grep -qF "$2" "$1"; then echo "  !! control did NOT land in $1"; return 1; fi
  return 0
}
row() { printf "  %-56s %s\n" "$1" "$2"; }

echo "=== A · the ring band reverted to the DIGIT's band (index.css) ==="
cp src/assets/index.css "$S/index.css.bak"
perl -pi -e 's/--peer-ring-l: 0\.32;/--peer-ring-l: 0.44;/; s/--peer-ring-l: 0\.79;/--peer-ring-l: 0.65;/' src/assets/index.css
if applied src/assets/index.css "--peer-ring-l: 0.32;"; then
  PLAYWRIGHT_BASE_URL=http://127.0.0.1:4244 npx playwright test --config pw.walk.config.ts \
    --project chromium > "$S/br2-ringrevert.log" 2>&1
  grep -E "ring band 0\.(44|65)|shipped band" "$S/br2-ringrevert.log" | head -6
  if grep -qE "[0-9]+ failed" "$S/br2-ringrevert.log"; then row "ring band = digit band" "RED (as required)"; else row "ring band = digit band" "GREEN — the gate does not hold"; fi
fi
cp "$S/index.css.bak" src/assets/index.css

echo
echo "=== C · the SESSION branches, each removed and verified ==="
cp src/games/shared/useSession.ts "$S/us.bak"

run_units() { npx vitest run src/games/shared/useSession.test.ts > "$1" 2>&1; }
verdict() { if grep -qE "[0-9]+ failed" "$1"; then row "$2" "RED (as required)"; grep -E "× U[0-9]|× the module|× four hands|× every hand" "$1" | head -6; else row "$2" "GREEN — no unit holds it"; fi }

perl -pi -e 's/from === e\[1\]\);/true);/' src/games/shared/useSession.ts
applied src/games/shared/useSession.ts "from === e[1]);" && { run_units "$S/br2-wire.log"; verdict "$S/br2-wire.log" "every st is authoritative (no wire rule)"; }
cp "$S/us.bak" src/games/shared/useSession.ts

perl -pi -e 's/if \(!me \|\| !roomHasOthers\(\) \|\|/if (!me ||/' src/games/shared/useSession.ts
applied src/games/shared/useSession.ts "!roomHasOthers() ||" && { run_units "$S/br2-self.log"; verdict "$S/br2-self.log" "self binds on the FIRST id"; }
cp "$S/us.bak" src/games/shared/useSession.ts

perl -0pi -e 's/for \(const pos of source\?\.writtenPositions\(\) \?\? \[\]\)\s*\n?\s*ledger\.clock\[String\(pos\)\] \?\?= \[0, id\];//s' src/games/shared/useSession.ts
applied src/games/shared/useSession.ts "writtenPositions()" && { run_units "$S/br2-stamp.log"; verdict "$S/br2-stamp.log" "the solo-era stamp deleted"; }
cp "$S/us.bak" src/games/shared/useSession.ts

echo
echo "=== D · the DECLARED accessor, made optional again ==="
cp src/games/shared/useSession.ts "$S/us.bak"
perl -pi -e 's/  writtenPositions: \(\) => number\[\];/  writtenPositions?: () => number[];/' src/games/shared/useSession.ts
applied src/games/shared/useSession.ts "  writtenPositions: () => number[];" && {
  npx vue-tsc -b > "$S/br2-declared.log" 2>&1
  if [ -s "$S/br2-declared.log" ]; then row "the accessor made optional" "RED at the TYPE (as required)"; else row "the accessor made optional" "GREEN — nothing holds the declaration"; fi
}
cp "$S/us.bak" src/games/shared/useSession.ts

echo
echo "restored; verifying"
node scripts/check-peer-arcs.mjs --self-test >/dev/null 2>&1 && echo "tier1 GREEN" || echo "tier1 RED — NOT RESTORED"
npx vitest run src/games/shared/useSession.test.ts src/games/shared/BoardHost.authors.test.ts 2>&1 | grep -E "Tests +[0-9]"
npx vue-tsc -b >/dev/null 2>&1 && echo "vue-tsc 0" || echo "vue-tsc RED — NOT RESTORED"
echo done
