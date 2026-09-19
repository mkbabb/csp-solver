#!/bin/bash
# PAL-WALK pass 2 — every born-RED claim, run mechanically. Each control is applied to a COPY of
# the tree's file, the row is run, and the file is restored before the next one. Nothing is left
# modified: the final `git status` line is the proof.
set -u
FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-59/web/frontend
SC=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-59/scratch
cd "$FE" || exit 2
mkdir -p "$SC/keep"
cp src/games/shared/useSession.ts "$SC/keep/useSession.ts"
cp src/games/shared/playerIdentity.ts "$SC/keep/playerIdentity.ts"
cp src/assets/index.css "$SC/keep/index.css"
cp scripts/check-peer-arcs.mjs "$SC/keep/check-peer-arcs.mjs"

restore() {
  cp "$SC/keep/useSession.ts" src/games/shared/useSession.ts
  cp "$SC/keep/playerIdentity.ts" src/games/shared/playerIdentity.ts
  cp "$SC/keep/index.css" src/assets/index.css
  cp "$SC/keep/check-peer-arcs.mjs" scripts/check-peer-arcs.mjs
}
trap restore EXIT

row() { # row <label> <expect: RED|GREEN> <vitest -t pattern>
  local label="$1" want="$2" pat="$3"
  npx vitest run src/games/shared/useSession.test.ts -t "$pat" >"$SC/out.txt" 2>&1
  local code=$?
  local got=GREEN
  [ $code -ne 0 ] && got=RED
  local mark="✗ MISMATCH"
  [ "$got" = "$want" ] && mark="✓"
  echo "$mark $label — wanted $want, got $got"
  grep -E "Tests +[0-9]" "$SC/out.txt" | tail -1 | sed 's/^/      /'
}

echo "=== A · the wire rule's three rows against HEAD's useSession.ts ==="
git show HEAD:web/frontend/src/games/shared/useSession.ts > src/games/shared/useSession.ts
row "U1 agreed index survives a non-author's st" RED "U1 —"
row "U2 own publish agrees nothing" RED "U2 —"
row "U3 no two ids share an ink string" RED "U3 —"
restore

echo
echo "=== B · tier 2 against HEAD's playerIdentity.ts (the 137.5° full-circle walk) ==="
git show HEAD:web/frontend/src/games/shared/playerIdentity.ts > src/games/shared/playerIdentity.ts
row "144 hues outside every declared arc" RED "fall outside every arc"
row "four hands read as four people" RED "four hands read as four people"
restore

echo
echo "=== C · tier 2 negative controls on a scratch copy of the walk ==="
perl -0pi -e 's/const STEP = SPAN \* \(\(3 - Math\.sqrt\(5\)\) \/ 2\);/const STEP = 0.5;/' src/games/shared/playerIdentity.ts
grep -n "const STEP" src/games/shared/playerIdentity.ts | sed 's/^/      /'
row "STEP = 0.5 · arc row" GREEN "fall outside every arc"
row "STEP = 0.5 · capacity row" RED "four hands read as four people"
restore

echo
echo "=== D · tier 1, the rename control, pass-1 gate vs the re-cut ==="
# ACC-SIX's shape: a chromatic token RENAMED (--color-crayon-green -> --color-answer-pale), and
# the family's arcs re-cut as if that hue were free.
perl -0pi -e 's/--color-crayon-green: #2dc653/--color-answer-pale: #2dc653/' src/assets/index.css
perl -0pi -e 's/--color-crayon-green: #3dd968/--color-answer-pale: #3dd968/' src/assets/index.css
perl -0pi -e 's/\[133\.985, 178\.6121\],/[177.0, 178.6121],/' src/games/shared/playerIdentity.ts
cp "$SC/pass1-check-peer-arcs.mjs" scripts/check-peer-arcs.pass1.mjs
echo "--- pass-1 gate (name list) ---"
node scripts/check-peer-arcs.pass1.mjs >"$SC/p1gate.txt" 2>&1
echo "      pass-1 gate exit $? (GREEN = blind to the renamed token)"
tail -3 "$SC/p1gate.txt" | sed 's/^/      /'
echo "--- the re-cut gate (by chroma) ---"
node scripts/check-peer-arcs.mjs >"$SC/p2gate.txt" 2>&1
echo "      re-cut gate exit $? (RED = the hue is still reserved)"
grep -c "under the 12° floor" "$SC/p2gate.txt" | sed 's/^/      hits: /'
rm -f scripts/check-peer-arcs.pass1.mjs
restore

echo
echo "=== E · the tree is restored ==="
git status --porcelain src/ scripts/ | sed 's/^/      /'
