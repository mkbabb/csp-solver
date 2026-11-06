#!/bin/bash
# PAL-TIN pass 10 (adapted from the pass-9 critic attack.sh) · FRESH gate-4 shapes on the replica (no rm, no set -e; discards mv to trash)
S=${SCRATCH:?set SCRATCH to the lane scratch dir}
A=${REP:-$S/rep}/web/frontend; TR=$S/trash/attack-${ATK_TAG:-x}; L=$S/logs/atk-${ATK_TAG:-x}; mkdir -p $L $TR
cd $A || exit 9
out=$S/logs/attack.${ATK_TAG:-x}.txt; : > $out
echo "gate $(shasum scripts/check-peer-tin.mjs|cut -c1-8) lib $(shasum scripts/shape-census.mjs|cut -c1-8) load $(uptime|sed 's/.*averages*: //')" >> $out
cp src/games/shared/gameCell.css $L/gameCell.css.orig
run() { node scripts/check-peer-tin.mjs > $L/$1.log 2>&1; local e=$?; echo "$1 exit $e · $(grep -cE '^  (4a|4b|2)' $L/$1.log) findings · $2" >> $out; }
new() { local rel=$1 body=$2 tag=$3; mkdir -p "$(dirname $rel)"; printf '%s\n' "$body" > $rel; cp $rel $TR/$tag.$(basename $rel); run $tag "$rel: $body"; mv $rel $TR/$tag.$(basename $rel).done; }
app() { local rel=$1 body=$2 tag=$3; printf '%s\n' "$body" >> $rel; run $tag "$rel += $body"; cp $L/gameCell.css.orig $rel; }
B=$(printf '\134')
run clean0 baseline
new src/games/shared/p.ts 'declare const el: HTMLElement; el.attributeStyleMap.set("--color-peer-5-name", "#000");' N1-typed-om
new src/games/shared/p.ts 'declare const el: HTMLElement; el.style["setProperty"]("--color-peer-5-name", "#000");' N2-bracket-call
new src/games/shared/Tw.vue "<template><span :style=\"{ ['--color-peer-5-name']: 'black' }\">x</span></template>" N3a-vue-computed-key
new src/games/shared/p.ts 'export const s = { ["--color-peer-5-name"]: "#000" };' N3b-ts-computed-key
new src/games/shared/p.ts 'const N = "--color-peer-5-name"; declare const el: HTMLElement; el.style.setProperty(N, "#000");' N4-bound-alias
new src/games/shared/p.ts 'declare const el: HTMLElement; el.style.setProperty ("--color-peer-5-name", "#000");' N5-space-before-paren
new src/games/shared/p.ts 'declare const el: HTMLElement; Reflect.apply(el.style.setProperty, el.style, ["--color-peer-5-name", "#000"]);' N6-reflect-apply
app src/games/shared/gameCell.css ":root.dark { --color-peer-5-nam${B}65: #000; }" N7-css-escaped-propname
new src/games/shared/p.ts 'declare const el: HTMLElement; el.style.setProperty("--color-peer-cursor-ink", "#123456");' N8-cursor-ink-binder
new src/games/shared/p.ts 'export const x = "hwb(309.4 69.8% 0%)";' N9-hwb
new src/games/shared/p.ts 'export const x = "rgb(100% 69.8% 95.3%)";' N10-rgb-percent
new src/games/shared/p.ts 'export const x = "color(srgb-linear 1 0.4451 0.8963)";' N11-srgb-linear
new src/games/shared/p.ts 'export const x = "color(srgb 1 0.698 0.953)";' N12-color-srgb
new src/games/shared/p.ts 'export const x = "#" + (16757491).toString(16);' N14-decimal-packed
app src/games/shared/gameCell.css ".x { background: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23ffb2f3'/%3E%3C/svg%3E\"); }" N21-datauri-pct23-css
new src/games/shared/p.ts "export const u = \"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23ffb2f3'/%3E%3C/svg%3E\";" N22-datauri-pct23-ts
new src/games/shared/tin.postcss ':root.dark { --color-peer-5-name: #ff00ff; } .x { color: #ffb2f3; }' N26a-postcss-unimported
printf ':root.dark { --color-peer-5-name: #ff00ff; } .x { color: #ffb2f3; }\n' > src/games/shared/tin.postcss
new src/games/shared/p.ts 'import "./tin.postcss";' N26b-postcss-imported
mv src/games/shared/tin.postcss $TR/N26b.tin.postcss
printf ':root.dark { --color-peer-5-name: #ff00ff; } .x { color: #ffb2f3; }\n' > src/games/shared/tin.sss
new src/games/shared/p.ts 'import "./tin.sss";' N26c-sss-imported
mv src/games/shared/tin.sss $TR/N26c.tin.sss
printf ':root.dark{--color-peer-5-name:#ff00ff}\n' > src/games/shared/tin.txt
new src/games/shared/p.ts 'import t from "./tin.txt?raw"; const s = document.createElement("style"); s.textContent = t; document.head.append(s);' N27-raw-txt-style
mv src/games/shared/tin.txt $TR/N27.tin.txt
mkdir -p theme; printf ':root.dark { --color-peer-5-name: #ff00ff; } .y { color: #ffb2f3; }\n' > theme/tin2.css
new src/games/shared/Tw.vue '<template><span>x</span></template><style src="../../../theme/tin2.css"></style>' N29-sfc-style-src-outside
new src/games/shared/p.ts 'import "../../../theme/tin2.css";' N30-ts-import-outside
mv theme $TR/N29-30.theme
app src/games/shared/gameCell.css '@property --color-peer-5-name { syntax: "<color>"; inherits: false; initial-value: #000; }' N34-property-registers-arm
new src/games/shared/p.ts 'export const x = "#ffb2f380";' N42-hex8
new src/games/shared/p.ts 'export const x = "rgb(255,178,243)";' N41-legacy-commas
run clean1 after
cmp $L/gameCell.css.orig src/games/shared/gameCell.css && echo "gameCell restored" >> $out
ls src/games/shared/p.ts src/games/shared/Tw.vue theme 2>&1 | tail -3 >> $out
echo DONE >> $out
