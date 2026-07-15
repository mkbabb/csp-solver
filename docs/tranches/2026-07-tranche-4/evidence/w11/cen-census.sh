#!/usr/bin/env bash
# T4-W11 CEN baseline — THE TWIN CENSUS (rerunnable). Run from anywhere.
# Emits TWO codeonly variants per twin pair so R3/R4/V reproduce identically on darwin:
#   RAW  = x6 §Probes verbatim (GNU \s) — UNDER-STRIPS on BSD/darwin sed (no gsed here),
#          indented/column-0 // and * comment lines SURVIVE -> inflated counts.
#   CORR = darwin-portable correction: \s -> [[:space:]]. Actually honors "comments/blanks
#          stripped" (0 comment/blank survivors, verified). THIS is the canonical CEN census;
#          the net-LOC floor + %-of-smaller verdicts bind to CORR.
# The gate binds to the DELTA (drop after each extraction row) measured with the SAME recipe
# before/after; CORR is that recipe. RAW is banked only for traceability to x6's 453/95/... figures.
set -euo pipefail
ROOT=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion
cd "$ROOT/web/frontend/src"

# x6 verbatim (GNU \s) — under-strips on BSD sed
codeonly_raw(){ sed -E '/^\s*\/\//d;/^\s*\*/d;/^\s*\/\*/d;/^\s*$/d' "$1"|sed 's/^[[:space:]]*//'; }
# darwin-portable correction (POSIX class) — the canonical CEN filter
codeonly(){ sed -E '/^[[:space:]]*\/\//d;/^[[:space:]]*\*/d;/^[[:space:]]*\/\*/d;/^[[:space:]]*$/d' "$1"|sed 's/^[[:space:]]*//'; }

twin(){ # label fileA fileB
  local label="$1" a="$2" b="$3"
  local ra rb rid ca cb id
  ra=$(codeonly_raw "$a"|wc -l|tr -d ' '); rb=$(codeonly_raw "$b"|wc -l|tr -d ' ')
  rid=$(comm -12 <(codeonly_raw "$a"|sort) <(codeonly_raw "$b"|sort)|wc -l|tr -d ' ')
  ca=$(codeonly "$a"|wc -l|tr -d ' '); cb=$(codeonly "$b"|wc -l|tr -d ' ')
  id=$(comm -12 <(codeonly "$a"|sort) <(codeonly "$b"|sort)|wc -l|tr -d ' ')
  printf '%-20s | CORR A=%-4s B=%-4s id=%-4s | RAW A=%-4s B=%-4s id=%-4s\n' "$label" "$ca" "$cb" "$id" "$ra" "$rb" "$rid"
}

SHA=$(git -C "$ROOT" rev-parse --short HEAD)
echo "=== TWIN CENSUS @ $SHA (CORR = canonical; RAW = x6-verbatim, under-strips on darwin) ==="
twin "ControlPanel.vue"    games/sudoku/ControlPanel/ControlPanel.vue          games/futoshiki/ControlPanel/ControlPanel.vue
twin "SolverErrorNote.vue" games/sudoku/SudokuBoard/SolverErrorNote.vue        games/futoshiki/FutoshikiBoard/SolverErrorNote.vue
twin "Cell.vue"            games/sudoku/SudokuBoard/SudokuCell/SudokuCell.vue   games/futoshiki/FutoshikiBoard/FutoshikiCell/FutoshikiCell.vue
twin "Board.vue"           games/sudoku/SudokuBoard/SudokuBoard.vue            games/futoshiki/FutoshikiBoard/FutoshikiBoard.vue
twin "use<Game>.ts"        games/sudoku/composables/useSudoku.ts               games/futoshiki/composables/useFutoshiki.ts
twin "Game.vue(scene)"     games/sudoku/SudokuGame.vue                         games/futoshiki/FutoshikiGame.vue
twin "conflicts.ts"        games/sudoku/SudokuBoard/conflicts.ts               games/futoshiki/FutoshikiBoard/conflicts.ts

echo
echo "=== cloc by game dir (code lines) @ $SHA ==="
cloc "$ROOT/web/frontend/src/games/sudoku" --quiet 2>/dev/null | grep -iE 'SUM|Language|----' | sed 's/^/[sudoku]   /'
cloc "$ROOT/web/frontend/src/games/futoshiki" --quiet 2>/dev/null | grep -iE 'SUM' | sed 's/^/[futoshiki] /'
cloc "$ROOT/web/frontend/src/games/shared" --quiet 2>/dev/null | grep -iE 'SUM' | sed 's/^/[shared]    /'
echo "--- per-dir single-number code totals ---"
for d in sudoku futoshiki shared; do
  n=$(cloc "$ROOT/web/frontend/src/games/$d" --quiet --csv 2>/dev/null | awk -F, '/^[0-9]+,SUM/{print $5}')
  printf '  games/%-10s code=%s\n' "$d" "$n"
done
