#!/bin/bash
# PAL-TIN pass 10 · FRESH gate-4 shapes beyond the pass-9 critic's (no rm, no set -e; discards mv to trash)
S=${SCRATCH:?set SCRATCH to the lane scratch dir}
A=${REP:-$S/rep}/web/frontend; TAG=${ATK_TAG:-f}; TR=$S/trash/fresh-$TAG; L=$S/logs/fresh-$TAG; mkdir -p $L $TR
cd $A || exit 9
out=$S/logs/fresh.$TAG.txt; : > $out
echo "gate $(shasum scripts/check-peer-tin.mjs|cut -c1-8) lib $(shasum scripts/shape-census.mjs|cut -c1-8) load $(uptime|sed 's/.*averages*: //')" >> $out
run() { node scripts/check-peer-tin.mjs > $L/$1.log 2>&1; local e=$?; echo "$1 exit $e · $(grep -cE '^  (4a|4b|2)' $L/$1.log) findings · $2" >> $out; }
new() { local rel=$1 body=$2 tag=$3; mkdir -p "$(dirname $rel)"; printf '%s\n' "$body" > $rel; run $tag "$rel: $body"; mv $rel $TR/$tag.$(basename $rel); }
B=$(printf '\134')
run clean0 baseline
new src/games/shared/p.ts 'declare const el: HTMLElement; el.style.setProperty.call(el.style, "--color-peer-2-ring", "#000");' F1-call
new src/games/shared/p.ts 'declare const el: HTMLElement; const k = ["--color-peer-2-ring"]; el.style.setProperty(k[0], "#000");' F2-array-held
new src/games/shared/p.ts 'declare const el: HTMLElement; const i = 2; el.style.setProperty(`--color-peer-${i}-ring`, "#000");' F3-template
new src/games/shared/p.ts 'declare const el: HTMLElement; el.style.setProperty("--color-" + "peer-2-ring", "#000");' F4-concat
new src/games/shared/p.ts "declare const el: HTMLElement; el.style.setProperty(\"${B}u002d-color-peer-2-ring\", \"#000\");" F5-js-escape
new src/games/shared/p.ts 'CSS.registerProperty({ name: "--color-peer-2-ring", syntax: "<color>", inherits: false, initialValue: "#000" });' F10-registerProperty
new src/games/shared/p.ts 'document.styleSheets[0].insertRule(":root{--color-peer-2-ring:#000}");' F11-insertRule
new src/games/shared/p.ts 'declare const el: HTMLElement; el.style.cssText = "--color-peer-2-ring: #000";' F12-cssText
new src/games/shared/p.ts 'declare const el: HTMLElement; el.style.setProperty(["--color", "peer", "2", "ring"].join("-"), "#000");' F13-join
new src/games/shared/p.ts 'declare const el: HTMLElement; el.style.setProperty(atob("LS1jb2xvci1wZWVyLTItcmluZw=="), "#000");' F14-base64
new src/games/shared/p.ts 'declare const el: HTMLElement; el.style.setProperty(String.fromCharCode(45,45,99,111,108,111,114,45,112,101,101,114,45,50,45,114,105,110,103), "#000");' F15-fromCharCode
new public/p10.svg '<svg xmlns="http://www.w3.org/2000/svg"><style>:root{--color-peer-2-ring:#000}</style></svg>' F8-public-svg
new src/games/shared/P10.vue '<template><span style="--color-peer-2-ring: #000">x</span></template>' F7-style-attr
run clean1 after
echo DONE >> $out
