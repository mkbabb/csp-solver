#!/bin/zsh
# PAL-TIN pass 6 · GATE 4 on the TREE: each plant written into the work tree, the gate run BARE, the
# file restored (an edited file by cp from its scratch copy, sha1 checked; a new file mv'd to trash).
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2/web/frontend || exit 1
T=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/trash-paltin6-3; B=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/paltin6-plants; out=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/paltin6-plants/tree-plants.txt; : > $out
cp src/games/shared/gameCell.css $B/gameCell.css.orig; cp index.html $B/index.html.orig
S0=$(shasum src/games/shared/gameCell.css index.html | shasum)
new() { local rel=$1 body=$2 tag=$3; print -r -- "$body" > $rel; node scripts/check-peer-tin.mjs > $B/$tag.log 2>&1; echo "$tag exit $?  ($(grep -c '^  4a\|^  4b' $B/$tag.log) findings)" >> $out; mv $rel $T/$tag.${rel:t}; }
app() { local rel=$1 body=$2 tag=$3 orig=$4; print -r -- "$body" >> $rel; node scripts/check-peer-tin.mjs > $B/$tag.log 2>&1; echo "$tag exit $?  ($(grep -c '^  4a\|^  4b' $B/$tag.log) findings)" >> $out; cp $B/$orig $rel; }
node scripts/check-peer-tin.mjs > $B/clean0.log 2>&1; echo "clean before exit $?" >> $out
new src/games/shared/planted.ts 'export const RING_L = 0.32;' C1
new src/games/shared/planted.ts 'const cfg = { ringL: { light: 0.32, dark: 0.79 } };' C2
new src/games/shared/planted.ts 'const SWATCHES = ["#552200", "#2a3900", "#003b3d"];' C3
new src/games/shared/planted.ts 'declare const el: HTMLElement, i: number; el.style.setProperty(`--color-peer-${i}-ring`, "red");' C4b
new src/games/shared/planted.ts 'declare const i: number, v: string; export const style = { [`--color-peer-${i}-ring`]: v };' C4c
app src/games/shared/gameCell.css '.x { stroke: oklch(0.32 0.074 124.8); }' C5 gameCell.css.orig
new src/games/shared/planted.ts 'export const x = "#243200ff";' C6
new src/planted.js 'export default "#4b1d00";' C7
new src/games/shared/planted.ts 'const peerInks = ["#530", "#230"];' C8
new src/games/shared/planted.ts 'const peerRing = ["rgb(36,50,0)", "rgb(75, 29, 0)"];' C9
new src/games/shared/Planted.vue '<template><i style="--color-peer-2-ring:#111" /></template>' C10
new src/games/shared/planted.css ':root { --tape-ink-2: #2a3900; }' C11
app index.html '<meta name="theme-color" content="#ffa8f2">' NAME-HTML index.html.orig
node scripts/check-peer-tin.mjs > $B/clean1.log 2>&1; echo "clean after exit $?" >> $out
S1=$(shasum src/games/shared/gameCell.css index.html | shasum); [ "$S0" = "$S1" ] && echo "restored sha1-equal" >> $out || echo "RESTORE MISMATCH" >> $out
git status --short >> $out
