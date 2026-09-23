#!/bin/bash
# PAL-TIN pass-6 CRITIC · fresh second publishers against the colour-keyed GATE 4 (rsync copy, never the tree)
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
A=$S/tincrit6-g4copy; T=$S/trash-tincrit6-1; L=$S/tincrit6/logs/g4; mkdir -p $L
cd $A || exit 9
out=$S/tincrit6/logs/g4attack6.txt; : > $out
cp src/games/shared/gameCell.css $L/gameCell.css.orig; cp src/assets/index.css $L/index.css.orig
run() { node scripts/check-peer-tin.mjs > $L/$1.log 2>&1; echo "$1 exit $? · $(grep -c '^  4a\|^  4b' $L/$1.log) findings · $2" >> $out; }
new() { local rel=$1 body=$2 tag=$3; mkdir -p "$(dirname $rel)"; printf '%s\n' "$body" > $rel; run $tag "$rel: $body"; mv $rel $T/$tag.$(basename $rel); }
app() { local rel=$1 body=$2 tag=$3 orig=$4; printf '%s\n' "$body" >> $rel; run $tag "$rel += $body"; cp $L/$orig $rel; }
run clean0 "baseline"
# the published dark name arm pink #ffb4f3 = oklch(0.86 0.118 332.3); amber #ffc1a1; light ring green #243200
new src/games/shared/p.ts 'export const x = "color(srgb 1 0.706 0.953)";' D1-color-srgb
new src/games/shared/p.ts 'export const x = "oklab(0.86 0.1045 -0.0550)";' D2-oklab
new src/games/shared/p.ts 'export const x = "lch(79.5% 36 350)";' D3-lch
new src/games/shared/p.ts 'export const x = "hwb(310 71% 0%)";' D4-hwb
new src/games/shared/p.ts 'export const x = "rgb(100% 71% 95%)";' D5-rgb-percent
new src/games/shared/p.ts 'export const x = "#ff" + "b4f3";' D6-hex-concat
new src/games/shared/p.ts 'export const TAPE = [[255, 193, 161], [178, 231, 5]];' D7-numeric-triples
new src/games/shared/palette.json '{"a":"#ffc1a1","b":"#b2e705","c":"#00edf7","d":"#c4ceff","e":"#ffb4f3"}' D8-json-table
new public/peers.css ':root{--x1:#ffc1a1;--x2:#b2e705}' D9-public-css
new src/games/shared/P.tsx 'export const x = "#ffb4f3";' D10-tsx
new src/games/shared/p.ts 'declare const el: HTMLElement, i: number; el.style.setProperty("--color-peer-" + i + "-name", "#000");' D11-minted-concat
new src/games/shared/p.ts 'declare const i: number; export const s = { ["--color-peer-" + i + "-ring"]: "#000" };' D12-minted-key-concat
app src/games/shared/gameCell.css '.x { color: color-mix(in oklch, var(--color-peer-5-ring) 60%, white); }' D13-colormix-derived-arm gameCell.css.orig
new src/games/shared/p.ts 'export const x = "hsl(0.86turn 100% 85%)";' D14-hsl-turn
app src/games/shared/gameCell.css '.x { color: oklch(86% 0.118 332.3deg); }' D15-oklch-percent-deg gameCell.css.orig
new src/games/shared/p.ts 'export const x = "#FFB4F3";' D16-hex-upper
new src/games/shared/p.ts 'export const nameL = 0.86;' D17-nameL-scalar
# 4b: a dark name arm drifted to L 0.83 in index.css (still >= 4.5 flat on the grid line?)
sed 's/--color-peer-5-name: #ffb4f3;/--color-peer-5-name: #ffa6f2;/' $L/index.css.orig > src/assets/index.css; run D18-index-name-drift "index.css pink name -> #ffa6f2"; cp $L/index.css.orig src/assets/index.css
# 4b: the light name alias re-pointed to the STICK (the pass-4 red), not a hex
sed 's/--color-peer-5-name: var(--color-peer-5-ring);/--color-peer-5-name: var(--color-peer-5);/' $L/index.css.orig > src/assets/index.css; run D19-light-name-to-stick "index.css light pink name -> var(--color-peer-5)"; cp $L/index.css.orig src/assets/index.css
# gate 2 on the NAME arms: dark violet/pink name at dE 0.098 today -> push them to 0.05
sed 's/--color-peer-4-name: #c4ceff;/--color-peer-4-name: #e5c6ff;/' $L/index.css.orig > src/assets/index.css; run D20-name-pair-collide "index.css dark violet name -> #e5c6ff (near pink)"; cp $L/index.css.orig src/assets/index.css
run clean1 "after"
cmp -s src/assets/index.css $L/index.css.orig && cmp -s src/games/shared/gameCell.css $L/gameCell.css.orig && echo "restored byte-equal" >> $out
echo DONE >> $out
