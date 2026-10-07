#!/bin/bash
# PAL-WALK pass-8 CRITIC attacks on fresh COPIES of the tree (never the tree). No rm; no set -e.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/walkcrit8
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend
OUT=$S/atk.tsv; : > $OUT; mkdir -p $S/logs
mk() { d=$S/atk/$1/web/frontend; mkdir -p $d; for x in src e2e scripts public index.html package.json vitest.config.ts vitest.setup.ts tsconfig.json tsconfig.node.json env.d.ts; do cp -R $T/$x $d/ 2>/dev/null; done; ln -s $T/node_modules $d/node_modules; cp $S/check-peer-arcs.p7.mjs $d/scripts/; echo $d; }
run() { name=$1; d=$2; ( cd $d && node scripts/check-peer-arcs.mjs ) > $S/logs/$name-p8.log 2>&1; e8=$?; ( cd $d && node scripts/check-peer-arcs.p7.mjs ) > $S/logs/$name-p7.log 2>&1; e7=$?; printf '%s\tp8=%s\tp7=%s\n' "$name" "$e8" "$e7" >> $OUT; }
unit() { name=$1; d=$2; ( cd $d && npx vitest run src/games/shared/useSession.test.ts ) > $S/logs/$name-unit.log 2>&1; printf '%s-unit\texit=%s\t%s\n' "$name" "$?" "$(grep -E 'Tests ' $S/logs/$name-unit.log | tail -1)" >> $OUT; }
GB=src/games/shared/GameBoard.vue
# --- the pass-7 plants FIRST (critic's pass-7 attack forms) ---
d=$(mk clean); run clean $d; unit clean $d
d=$(mk A2); printf 'export const a2 = (el: HTMLElement): void => {\n  el.style.cssText = "--color-peer" + "-name-ink: red";\n};\n' > $d/src/games/shared/peerxA2.ts; run A2 $d
d=$(mk A3); printf 'export const a3 = (el: HTMLElement): void => {\n  el.setAttribute("style", "--color-peer-" + "name-ink:red");\n};\n' > $d/src/games/shared/peerxA3.ts; run A3 $d
d=$(mk A4); printf '<script setup lang="ts">\nconst k = ["--color-peer", "name-ink"].join("-");\n</script>\n<template><span :style="{ [k]: %s }" /></template>\n' "'red'" > $d/src/games/shared/PeerXA4.vue; run A4 $d
d=$(mk A5); mkdir -p $d/lib; printf '.game-cell {\n  --color-peer-name-ink: red;\n}\n' > $d/lib/peerx.css; { printf '@import "../../lib/peerx.css";\n'; cat $T/src/assets/index.css; } > $d/src/assets/index.css; run A5 $d
d=$(mk A7); printf '\nhtml.dark {\n  --peer-name-l: 0.5;\n}\n' >> $d/src/assets/index.css; run A7 $d
d=$(mk A8); printf '\nhtml.dark {\n  --peer-ink-l: 0.2;\n}\n' >> $d/src/assets/index.css; run A8 $d
d=$(mk A9); printf '\n.dark {\n  --peer-name-l: 0.5;\n}\n' >> $d/src/assets/typography.css; run A9 $d
d=$(mk A9b); printf '\n.dark {\n  --peer-ring-l: 0.2;\n}\n' >> $d/src/assets/typography.css; run A9b $d
d=$(mk A10); sed -i '' 's/NAME_BANDS = \[0\.295, 0\.86\]/NAME_BANDS = [0.295, 0.8]/' $d/src/games/shared/playerIdentity.ts; sed -i '' 's/--peer-name-l: 0\.86;/--peer-name-l: 0.8;/' $d/src/assets/index.css; printf 'A10 anchors %s %s\n' "$(grep -c 'NAME_BANDS = \[0.295, 0.8\]' $d/src/games/shared/playerIdentity.ts)" "$(grep -c 'peer-name-l: 0.8;' $d/src/assets/index.css)" >> $OUT; run A10 $d; unit A10 $d
# --- the critic's NEW plants (pass 8) ---
d=$(mk N1-consumer-digit); sed -i '' 's/  color: var(--color-peer-name-ink);/  color: var(--color-user-ink);/' $d/$GB; printf 'N1 anchor %s\n' "$(grep -c 'color: var(--color-user-ink);' $d/$GB)" >> $OUT; run N1 $d; unit N1 $d
d=$(mk N2-paper-revert); perl -0pi -e 's/background:\n    linear-gradient\(var\(--sheet-washi-neutral\), var\(--sheet-washi-neutral\)\),\n    var\(--color-card\);/background: var(--sheet-washi-neutral);/' $d/$GB; printf 'N2 anchor %s\n' "$(grep -c 'var(--color-card);' $d/$GB)" >> $OUT; run N2 $d; unit N2 $d
d=$(mk N3-typedom); printf 'export const n3 = (el: HTMLElement): void => {\n  el.attributeStyleMap.set("--color-peer-name-ink", "red");\n};\n' > $d/src/games/shared/peerxN3.ts; run N3 $d
d=$(mk N4-insertRule); printf 'export const n4 = (): void => {\n  document.styleSheets[0].insertRule(".dark { --peer-name-l: 0.5 }");\n};\n' > $d/src/games/shared/peerxN4.ts; run N4 $d
d=$(mk N5-styleEl); printf 'export const n5 = (): void => {\n  const s = document.createElement("style");\n  s.textContent = ".dark .washi-label { --color-peer-name-ink: #777 }";\n  document.head.append(s);\n};\n' > $d/src/games/shared/peerxN5.ts; run N5 $d
d=$(mk N6-sfc-scoped); printf '\n<style scoped>\n:global(.dark) .attribution-tape :deep(.washi-label) {\n  --peer-name-l: 0.5;\n}\n</style>\n' >> $d/$GB; run N6 $d
d=$(mk N7-tw-arbitrary); printf '<template><span class="[--peer-name-l:0.5]">x</span></template>\n' > $d/src/games/shared/PeerXN7.vue; run N7 $d
d=$(mk N8-indexhtml); sed -i '' 's/<html lang="en">/<html lang="en" style="--peer-name-l: 0.5">/' $d/index.html; printf 'N8 anchor %s\n' "$(grep -c 'style="--peer-name-l' $d/index.html)" >> $OUT; run N8 $d
d=$(mk N9-media); printf '\n@media (prefers-color-scheme: dark) {\n  :root {\n    --peer-name-l: 0.5;\n  }\n}\n' >> $d/src/assets/index.css; run N9 $d
d=$(mk N10-layer); printf '\n@layer peerx {\n  .dark {\n    --peer-name-l: 0.5;\n  }\n}\n' >> $d/src/assets/index.css; run N10 $d
d=$(mk N11-tplstem); printf 'export const n11 = (el: HTMLElement, k: string): void => {\n  el.style.setProperty(`--color-peer-${k}-ink`, "red");\n};\n' > $d/src/games/shared/peerxN11.ts; run N11 $d
d=$(mk N12-constructed); printf 'export const n12 = (): void => {\n  const s = new CSSStyleSheet();\n  s.replaceSync(".dark { --peer-name-l: 0.5 }");\n  document.adoptedStyleSheets = [...document.adoptedStyleSheets, s];\n};\n' > $d/src/games/shared/peerxN12.ts; run N12 $d
d=$(mk N13-digit-coord); sed -i '' 's/DIGIT_BANDS = \[0\.44, 0\.65\]/DIGIT_BANDS = [0.6, 0.5]/' $d/src/games/shared/playerIdentity.ts; sed -i '' 's/--peer-ink-l: 0\.44;/--peer-ink-l: 0.6;/; s/--peer-ink-l: 0\.65;/--peer-ink-l: 0.5;/' $d/src/assets/index.css; printf 'N13 anchors %s %s\n' "$(grep -c 'DIGIT_BANDS = \[0.6, 0.5\]' $d/src/games/shared/playerIdentity.ts)" "$(grep -cE 'peer-ink-l: 0\.(6|5);' $d/src/assets/index.css)" >> $OUT; run N13 $d; unit N13 $d
d=$(mk N14-name83); sed -i '' 's/NAME_BANDS = \[0\.295, 0\.86\]/NAME_BANDS = [0.295, 0.83]/' $d/src/games/shared/playerIdentity.ts; sed -i '' 's/--peer-name-l: 0\.86;/--peer-name-l: 0.83;/' $d/src/assets/index.css; run N14 $d; unit N14 $d
d=$(mk N15-name84); sed -i '' 's/NAME_BANDS = \[0\.295, 0\.86\]/NAME_BANDS = [0.295, 0.84]/' $d/src/games/shared/playerIdentity.ts; sed -i '' 's/--peer-name-l: 0\.86;/--peer-name-l: 0.84;/' $d/src/assets/index.css; run N15 $d; unit N15 $d
d=$(mk N16-opacity); perl -0pi -e 's/\.attribution-tape :deep\(\.washi-label\) \{\n  opacity: 1;/.attribution-tape :deep(.washi-label) {\n  opacity: 0.55;/' $d/$GB; printf 'N16 anchor %s\n' "$(grep -c 'opacity: 0.55;' $d/$GB)" >> $OUT; run N16 $d; unit N16 $d
echo ATKDONE >> $OUT
