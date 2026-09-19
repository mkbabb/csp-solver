#!/bin/zsh
# MRK-LIVE pass-3 census battery: hue census (prototype vs HEAD), the copy gate, lint:motion,
# lint:knip. Mechanical, so it is a script (the stall law).
EV=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/MRK-LIVE
WT=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend
MAIN=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend
cd $WT

echo "== hue census: prototype =="
node $EV/instruments/hue-census.COPY.mjs $WT/src/assets/index.css > $EV/logs/hue-census-PROTO.txt 2>&1
echo "exit=$?"
echo "== hue census: HEAD 74a2b5d9 =="
node $EV/instruments/hue-census.COPY.mjs $MAIN/src/assets/index.css > $EV/logs/hue-census-HEAD.txt 2>&1
echo "exit=$?"
echo "== diff =="
diff $EV/logs/hue-census-HEAD.txt $EV/logs/hue-census-PROTO.txt > $EV/logs/hue-census-DIFF.txt
echo "diff-exit=$?"

echo "== check-copy-register =="
node scripts/check-copy-register.mjs > $EV/logs/copy-register.txt 2>&1
echo "exit=$?"

echo "== lint:motion =="
npm run lint:motion > $EV/logs/lint-motion.txt 2>&1
echo "exit=$?"

echo "== lint:knip =="
npm run lint:knip > $EV/logs/lint-knip.txt 2>&1
echo "exit=$?"

echo "== grep: the struck fallbacks =="
{
  echo "var(--toggle-bleed, : $(grep -rn 'var(--toggle-bleed,' src/ | wc -l)"
  echo "color-focus-sketch with fallback: $(grep -rn 'var(--color-focus-sketch,' src/ | wc -l)"
  echo "MOTION.boardFoldMs in FocusRing: $(grep -c 'boardFoldMs' src/pencil/chrome/FocusRing.vue)"
  echo "OUTSET const: $(grep -c 'const OUTSET' src/pencil/chrome/FocusRing.vue)"
  echo "game-cell:focus-within rule: $(grep -c 'game-cell:focus-within' src/games/shared/gameCell.css)"
  echo "marks-fade-in 250ms literals: $(grep -c 'marks-fade-in 250ms' src/games/shared/gameCell.css)"
  echo "z-index 70 sites: $(grep -rn 'z-index: 70' src/ | wc -l)"
} > $EV/logs/greps.txt 2>&1
cat $EV/logs/greps.txt
echo "CENSUS BATTERY DONE"
