#!/bin/bash
# PAL-TIN pass 9 · the pass-7 and pass-8 critics' GATE 4 attacks re-run on an rsync REPLICA of the final tree
# (adapted from the pass-8 critic's g4crit8.sh; escape plants rebuilt from bytes, C23 added). No rm, no set -e; discards are mv to trash.
S=$SCRATCH
A=$S/rep2/web/frontend; TR=$S/trash/g4attack9; L=$S/logs/g4; mkdir -p $L $TR
cd $A || exit 9
out=$S/logs/g4attack9.txt; : > $out
echo "gate sha1 $(shasum scripts/check-peer-tin.mjs | cut -c1-8) · library sha1 $(shasum scripts/shape-census.mjs | cut -c1-8) · load $(uptime | sed 's/.*averages*: //')" >> $out
cp src/games/shared/gameCell.css $L/gameCell.css.orig; cp src/assets/index.css $L/index.css.orig
run() { node scripts/check-peer-tin.mjs > $L/$1.log 2>&1; local e=$?; echo "$1 exit $e · $(grep -cE '^  (4a|4b|2)' $L/$1.log) findings · $2" >> $out; }
new() { local rel=$1 body=$2 tag=$3; mkdir -p "$(dirname $rel)"; printf '%s\n' "$body" > $rel; run $tag "$rel: $body"; mv $rel $TR/$tag.$(basename $rel); }
app() { local rel=$1 body=$2 tag=$3 orig=$4; printf '%s\n' "$body" >> $rel; run $tag "$rel += $body"; cp $L/$orig $rel; }
run clean0 "baseline"
B=$(printf '\134')  # one backslash, from octal: the tool layer decodes escapes typed in a plant
echo "--- the pass-7 critic's set (run FIRST)" >> $out
new src/games/shared/p.ts 'export const x = "#" + (0xffb2f3).toString(16);' D23-packed-int
new src/games/shared/p.ts 'export const x = ["#ff", "b2f3"].join("");' D24-array-join
new src/games/shared/p.ts 'export const x = `#ff${"b2f3"}`;' D25-template-const
new src/games/shared/p.ts 'export const x = "color(display-p3 0.9554 0.7109 0.9383)";' D26-display-p3
new src/games/shared/p.ts 'export const x = "hsl(5.4rad 100% 84.9%)";' D27a-hsl-rad
new src/games/shared/p.ts 'export const x = "hsl(343.8grad 100% 84.9%)";' D27b-hsl-grad
new src/games/shared/p.ts "export const x = \"${B}x23ffb2f3\";" D28-escaped-hash
app src/games/shared/gameCell.css ".x { color: #ff${B}62 2f3; }" D29-css-escape-hash gameCell.css.orig
new src/games/shared/Tw.vue '<template><span class="text-indigo-200">x</span></template>' D30a-tw-indigo-200
new src/games/shared/Tw.vue '<template><span class="text-teal-800">x</span></template>' D30b-tw-teal-800
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
echo "--- the pass-8 critic's fresh set" >> $out
new src/games/shared/p.ts 'export const u = [function () {} / 2, "x/", "http://a.b", "#ffb2f3"];' C1-division-after-brace-then-url
new src/games/shared/p.ts "export function f(e: boolean, t: string) { if (e) /${B}/${B}//.test(t); return \"#ffb2f3\"; }" C2-regex-after-paren-with-slashes
new src/games/shared/p.ts "export const x = \"${B}u0023ffb2f3\";" C3-unicode-escape-hash
new src/games/shared/p.ts "export const x = \"${B}u{23}ffb2f3\";" C4-unicode-brace-escape
new src/games/shared/Tw.vue '<template><span style="color: &#x23;ffb2f3">x</span></template>' C5-hex-entity
app src/games/shared/gameCell.css ".x { color: #ff${B}0000622f3; }" C6-css-escape-6digit gameCell.css.orig
new src/games/shared/tin.pcss ':root.dark { --color-peer-5-name: #ff00ff; }' C7a-pcss-redeclares-arm
new src/games/shared/tin.pcss '.x { color: #ffb2f3; }' C7b-pcss-copy
app src/games/shared/gameCell.css '@property --tin-x { syntax: "<color>"; inherits: false; initial-value: #ffb2f3; }' C8-property-initial gameCell.css.orig
new src/games/shared/p.ts 'export const x = String.fromCharCode(35) + "ffb2f3";' C9-fromCharCode
new src/games/shared/p.ts 'export const x = "#ff" + (0xb2f3).toString(16);' C10-short-packed
new src/games/shared/p.ts 'export const px = [255, 178, 243, 255];' C12-rgba-byte-quad
new src/games/shared/p.ts 'export const gl = [1, 0.698, 0.953];' C13-float-triple
new src/games/shared/p.ts 'const T = ["ffb2f3", "ffc1a1"]; export const x = (i: number) => "#" + T[i];' C14-bare-hex-table-indexed
app src/games/shared/gameCell.css '.x { color: darkmagenta; }' C15a-named-darkmagenta-vs-light-pink gameCell.css.orig
new src/games/shared/p.ts 'declare const el: HTMLElement; el.style.color = "lightsalmon";' C15b-named-in-ts
app src/games/shared/gameCell.css '.x { color: color(xyz-d65 0.7333 0.5957 0.9243); }' C16a-color-xyz-d65 gameCell.css.orig
new src/games/shared/p.ts 'export const x = "color(xyz 0.7333 0.5957 0.9243)";' C16b-color-xyz
new src/games/shared/p.ts 'export const x = "#fbf";' C17-short-hex-near
new src/games/shared/p.ts 'export const inkOf = (i: number) => ({ "--color-user-ink": ["#9a3d00", "#3f6a00", "#006e73"][i] });' C18a-drifted-table-into-user-ink
new src/games/shared/p.ts 'declare const el: HTMLElement; el.style.setProperty("--color-user-ink", "#9a3d00");' C18b-drifted-scalar-into-user-ink
new src/games/shared/Tw.vue '<template><span class="[--color-peer-5-name:#ff00ff]">x</span></template>' C19-tw-arbitrary-property-redeclare
app src/games/shared/gameCell.css '.x { color: light-dark(#ffb2f3, #000); }' C20-light-dark gameCell.css.orig
new public/tin.svg '<svg xmlns="http://www.w3.org/2000/svg"><rect fill="#ffb2f3"/></svg>' C22-public-svg
new theme/tin.css ':root.dark { --color-peer-5-name: #ff00ff; } .y { color: #ffb2f3; }' C23-sheet-outside-src-NOT-YET-IMPORTED
mkdir -p theme; printf '%s\n' ':root.dark { --color-peer-5-name: #ff00ff; } .y { color: #ffb2f3; }' > theme/tin.css; app src/assets/index.css '@import "../../theme/tin.css";' C23-import-chain-outside-src index.css.orig; mv theme/tin.css $TR/C23.tin.css
run clean1 "after"
cmp -s src/assets/index.css $L/index.css.orig && cmp -s src/games/shared/gameCell.css $L/gameCell.css.orig && echo "restored byte-equal" >> $out
grep -E "exit|restored" $out > /dev/null; echo DONE >> $out
