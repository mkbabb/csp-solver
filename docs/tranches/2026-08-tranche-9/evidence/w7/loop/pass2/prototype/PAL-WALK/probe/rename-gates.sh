#!/bin/bash
# Both gates over the renamed state the previous script built. Restores the tree on exit.
set -u
FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-59/web/frontend
SC=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-59/scratch
cd "$FE" || exit 2
cp src/assets/index.css "$SC/hold-index.css"
cp src/games/shared/playerIdentity.ts "$SC/hold-pi.ts"
restore() {
  cp "$SC/hold-index.css" src/assets/index.css
  cp "$SC/hold-pi.ts" src/games/shared/playerIdentity.ts
  rm -f scripts/check-peer-arcs.pass1.mjs
}
trap restore EXIT

cp "$SC/renamed-index.css" src/assets/index.css
cp "$SC/renamed-playerIdentity.ts" src/games/shared/playerIdentity.ts
cp "$SC/pass1-check-peer-arcs.mjs" scripts/check-peer-arcs.pass1.mjs

echo "--- PASS-1 GATE (name list) over the renamed sheet + its own re-derived arcs ---"
node scripts/check-peer-arcs.pass1.mjs
echo "   pass-1 exit: $?"
echo
echo "--- THE RE-CUT GATE (by chroma) over the same state ---"
node scripts/check-peer-arcs.mjs 2>&1 | head -20
echo "   re-cut exit: ${PIPESTATUS[0]}"
node scripts/check-peer-arcs.mjs >/dev/null 2>&1
echo "   re-cut exit (bare): $?"
