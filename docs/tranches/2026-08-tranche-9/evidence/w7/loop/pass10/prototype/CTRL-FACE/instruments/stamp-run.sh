#!/bin/bash
# CTRL-FACE pass 10 - the stamp's class battery, ON DISK (the pass-9 critic's W and R first).
# usage: stamp-run.sh <tree root (a repo root holding web/frontend)> <log>
# A copy of the tree (its own `git init`, so Tailwind's scan is bounded: LAWS P9 §A) carries the tree's
# dist and both censuses; each plant edits ONE file, the gate runs (it REBUILDS the copy), the exit is
# read bare, and the copy is restored before the next plant.
SRC="$1"; LOG="$2"
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/CTRL-FACE/stamp
NM=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules
mkdir -p $S
rsync -a --delete --exclude node_modules --exclude .git --exclude test-results --exclude /docs --exclude /.claude "$SRC/" "$S/tree/"
cd $S/tree && { [ -d .git ] || git init -q; } && echo "copy gitdir=$(git rev-parse --absolute-git-dir)" > "$LOG"
FE=$S/tree/web/frontend; ln -sfn $NM $FE/node_modules
restore() { rsync -a --delete --exclude node_modules --exclude .face-engine --exclude test-results "$SRC/web/frontend/" "$FE/"; ln -sfn $NM $FE/node_modules; }
gate() { (cd $FE && node scripts/check-face-engine-identity.mjs --self-test > $S/last.log 2>&1); e=$?; echo "$e | $1 | $(grep -E '^(RED|GREEN)  a fresh|^(RED|GREEN)  each census' $S/last.log | tr '\n' ' ') | $(grep -m1 -E 'builds other bytes|changed since|threw' $S/last.log | cut -c1-200)" >> "$LOG"; }
restore; gate "CLEAN (expect 0)"
echo 'export const PLANT_W = 1; console.log(PLANT_W);' >> $FE/src/games/shared/solver/solver.worker.ts; gate "W one statement in the worker (expect 1)"; restore
printf '\n<!-- bg-[#123456] text-[13.37px] tracking-[0.42em] -->\n' >> $FE/src/games/sudoku/README.md; gate "R utility names in a README (expect 1)"; restore
printf '\n.controls-card { letter-spacing: 1px }\n' >> $FE/src/games/shared/scene.css; gate "S scene.css letter-spacing (expect 1)"; restore
python3 -c "import sys;p=sys.argv[1];b=bytearray(open(p,'rb').read());b[127]^=1;open(p,'wb').write(b)" $FE/src/assets/fonts/patrickhand-subset.woff2; gate "F patrickhand offset 127 flipped (expect 1)"; restore
PUB=$(ls $FE/public | head -1); printf '\n' >> "$FE/public/$PUB"; gate "P public/$PUB one byte appended (expect 1)"; restore
J=$(ls $FE/dist/assets/*.js | head -1); printf ';' >> $J; gate "D a dist chunk appended after the build, no source edit (expect 1)"; restore
printf '\n// a comment the minifier drops\n' >> $FE/src/main.ts; gate "N comment-only source edit, no emitted byte moves (expect 0)"; restore
gate "RESTORED (expect 0)"
echo DONE >> "$LOG"
