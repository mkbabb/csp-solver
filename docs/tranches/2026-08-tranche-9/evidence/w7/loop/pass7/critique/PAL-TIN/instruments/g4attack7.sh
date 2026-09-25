#!/bin/bash
# PAL-TIN pass-7 CRITIC · the pass-6 set (D1–D22) FIRST, then fresh publishers D23–D40 (replica only, never the tree)
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
A=$S/tincrit7/g4/web/frontend; T=$S/trash-tincrit7-1; L=$S/tincrit7/logs/g4; mkdir -p $L $T
export SHAPE_CENSUS=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/instruments/shape-census.mjs
cd $A || exit 9
out=$S/tincrit7/logs/g4attack7.txt; : > $out
cp src/games/shared/gameCell.css $L/gameCell.css.orig; cp src/assets/index.css $L/index.css.orig
run() { node scripts/check-peer-tin.mjs > $L/$1.log 2>&1; echo "$1 exit $? · $(grep -c '^  4a\|^  4b\|^  2' $L/$1.log) findings · $2" >> $out; }
new() { local rel=$1 body=$2 tag=$3; mkdir -p "$(dirname $rel)"; printf '%s\n' "$body" > $rel; run $tag "$rel: $body"; mv $rel $T/$tag.$(basename $rel); }
app() { local rel=$1 body=$2 tag=$3 orig=$4; printf '%s\n' "$body" >> $rel; run $tag "$rel += $body"; cp $L/$orig $rel; }
run clean0 "baseline"
new src/games/shared/p.ts 'export const x = "color(srgb 1 0.698 0.953)";' D1-color-srgb
new src/games/shared/p.ts 'export const x = "oklab(0.856 0.1045 -0.0550)";' D2-oklab
new src/games/shared/p.ts 'export const x = "hwb(310 70% 0%)";' D4-hwb
new src/games/shared/p.ts 'export const x = "rgb(100% 70% 95%)";' D5-rgb-percent
new src/games/shared/p.ts 'export const x = "#ff" + "b2f3";' D6-hex-concat
new src/games/shared/p.ts 'export const TAPE = [[255, 193, 161], [178, 231, 5]];' D7-numeric-triples
new src/games/shared/palette.json '{"a":"#ffc1a1","e":"#ffb2f3"}' D8-json-table
new public/peers.css ':root{--x1:#ffc1a1;--x2:#b2e705}' D9-public-css
new src/games/shared/P.tsx 'export const x = "#ffb2f3";' D10-tsx
new src/games/shared/p.ts 'declare const el: HTMLElement, i: number; el.style.setProperty("--color-peer-" + i + "-name", "#000");' D11-minted-concat
new src/games/shared/p.ts 'declare const i: number; export const s = { ["--color-peer-" + i + "-ring"]: "#000" };' D12-minted-key-concat
app src/games/shared/gameCell.css '.x { color: color-mix(in oklch, var(--color-peer-5-ring) 60%, white); }' D13-colormix-derived-arm gameCell.css.orig
new src/games/shared/p.ts 'export const x = "hsl(0.86turn 100% 85%)";' D14-hsl-turn
# ---- fresh: pass 7
new src/games/shared/p.ts 'export const x = "#" + (0xffb2f3).toString(16);' D23-packed-int
new src/games/shared/p.ts 'export const x = ["#ff", "b2f3"].join("");' D24-array-join
new src/games/shared/p.ts 'export const x = `#ff${"b2f3"}`;' D25-template-const
new src/games/shared/p.ts 'export const x = "color(display-p3 0.9554 0.7109 0.9383)";' D26-display-p3
new src/games/shared/p.ts 'export const x = "hsl(5.4rad 100% 84.9%)";' D27a-hsl-rad
new src/games/shared/p.ts 'export const x = "hsl(343.8grad 100% 84.9%)";' D27b-hsl-grad
new src/games/shared/p.ts 'export const x = "\x23ffb2f3";' D28-escaped-hash
app src/games/shared/gameCell.css '.x { color: #ff\62 2f3; }' D29-css-escape-hash gameCell.css.orig
new src/games/shared/Tw.vue '<template><span class="text-indigo-200">x</span></template>' D30a-tailwind-indigo-200-vs-violet-name
new src/games/shared/Tw.vue '<template><span class="text-teal-800">x</span></template>' D30b-tailwind-teal-800-vs-teal-stick
new src/games/shared/p.ts 'export const x = "rgb(255 178 243 / 50%)";' D31-rgb-slash-alpha
app src/games/shared/gameCell.css '.x { color: color-mix(in oklch, var(--color-peer-cursor-ink) 60%, white); }' D32-derived-via-indirection gameCell.css.orig
new src/games/shared/p.ts 'declare const el: HTMLElement, i: number; el.style.setProperty(`--color-${"peer"}-${i}-name`, "#000");' D33-minted-split-template
new src/games/shared/p.ts 'declare const el: HTMLElement, i: number; el.style.setProperty("--color-peer-".concat(String(i), "-name"), "#000");' D34-minted-concat-method
new src/games/shared/p.ts 'declare const el: HTMLElement, i: number; el.style.setProperty(["--color-peer", i, "name"].join("-"), "#000");' D35-minted-join
new src/games/shared/p.ts 'export const x = "oklch(from #000 0.856 0.121 332.4)";' D36-relative-from-literal
new src/games/shared/p.ts 'export const x = "lab(80.2 28.6 -17.4)";' D37-cie-lab
app src/games/shared/gameCell.css '.x { color: oklch(0.856 0.121 332.4 / 0.5); }' D38-oklch-alpha gameCell.css.orig
new src/games/shared/p.ts 'const P = "b2f3"; export const x = "#ff" + P;' D39-const-ident-concat
new src/games/shared/p.ts 'export const x = "#FfB2F3".toLowerCase();' D40-mixed-case
run clean1 "after"
cmp -s src/assets/index.css $L/index.css.orig && cmp -s src/games/shared/gameCell.css $L/gameCell.css.orig && echo "restored byte-equal" >> $out
echo DONE >> $out
