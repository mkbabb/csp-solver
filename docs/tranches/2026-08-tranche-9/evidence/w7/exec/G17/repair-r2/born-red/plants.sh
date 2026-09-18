#!/bin/zsh
# G17 repair r2 — the born-RED battery. Six plants written into LIVE sources in the shapes the
# verifier proved blind, each run BARE against the r1 scanner (4235e382, checked out beside the
# real one so ROOT resolves) and against the cured one, then reverted.
set -u
FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-exec/web/frontend
cd "$FE" || exit 1
R1=scripts/check-copy-register.r1.mjs
git show 4235e382:web/frontend/scripts/check-copy-register.mjs > "$R1"

echo "G17 repair r2 · plants on the LIVE tree, gate run bare"
echo "date: $(date)"
echo "r1 scanner = 4235e382's, copied to $R1 (deleted at the end)"
echo

plant () {          # $1 label  $2 file  $3 perl-expression
  local label="$1" file="$2" expr="$3"
  echo "== $label"
  echo "   file: $file"
  perl -0pi -e "$expr" "$file"
  if git diff --quiet -- "$file"; then echo "   PLANT DID NOT APPLY"; return; fi
  local o1 e1 o2 e2
  o1=$(node "$R1" 2>&1); e1=$?
  o2=$(node scripts/check-copy-register.mjs 2>&1); e2=$?
  echo "   r1(4235e382)  EXIT=$e1   $(echo "$o1" | grep 'jargon over')"
  echo "$o1" | grep -E '^  (✗|~)' | sed 's/^/   r1 /'
  echo "   r2(cured)     EXIT=$e2   $(echo "$o2" | grep 'jargon over')"
  echo "$o2" | grep -E '^  (✗|~)' | sed 's/^/   r2 /'
  git checkout -- "$file"
  echo "   git status src/ after revert: [$(git status --porcelain src/ | tr '\n' ' ')]"
  echo
}

plant "V1 · announce() utterance, GameBoard.vue:883 (LIVE spoken copy)" \
  src/games/shared/GameBoard.vue \
  's/squares"\} filled/squares"} filled by the solver/'

plant "V2 · say() argument through the voice passed to copyAct, GameControlPanel.vue:320 (LIVE)" \
  src/games/shared/GameControlPanel.vue \
  's/say\(copied \? "Link copied"/say(copied ? "the solver copied the link"/'

plant "V3 · sublabel: <call> — a COPY_KEY whose value is a call, GameControlPanel.vue:363 (LIVE)" \
  src/games/shared/GameControlPanel.vue \
  's/sublabel: saysCoarse\("copied!"/sublabel: saysCoarse("solver copied!"/'

plant "V4 · washi: <call> — the same shape one line down, GameControlPanel.vue:364 (LIVE)" \
  src/games/shared/GameControlPanel.vue \
  's/washi: says\("copied!"/washi: says("the solver copied!"/'

plant "V6 · PLURAL SCREAMING_SNAKE copy table, techniqueVoice.ts:74" \
  src/games/shared/techniqueVoice.ts \
  's/const FURNITURE_NOTE: Record<ExtraUnit, string> = \{\n  cage: "check the cage"/const FURNITURE_NOTES: Record<ExtraUnit, string> = {\n  cage: "check the solver cage"/'

plant "V7 · PLURAL TitleCase copy table, techniqueVoice.ts (a new declaration)" \
  src/games/shared/techniqueVoice.ts \
  's/^const FURNITURE_NOTE/const errorNotes = { deal: "the solver failed" };\nconst FURNITURE_NOTE/m'

echo "== CONTROL · the tree UNPLANTED, both scanners"
o1=$(node "$R1" 2>&1); e1=$?
o2=$(node scripts/check-copy-register.mjs 2>&1); e2=$?
echo "   r1(4235e382)  EXIT=$e1   $(echo "$o1" | grep 'jargon over')"
echo "   r2(cured)     EXIT=$e2   $(echo "$o2" | grep 'jargon over')"
echo "   the live positive control rides here: GameBoard.vue:862 hands the voice an IDENTIFIER"
echo "   (announce(dealLine.value)) and the cured gate is green, so a voice reads literals only."
echo
rm -f "$R1"
echo "worktree status at end:"
git status --porcelain | sed 's/^/   /'
