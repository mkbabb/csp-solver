#!/bin/bash
A=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw7/atk/web/frontend; out=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw7/logs/atk.txt; : > $out
sync_copy() { rsync -a --delete --exclude node_modules --exclude .critpw7 --exclude e2e/critw7.spec.ts /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw7/rep/web/frontend/ $A/; }
run() {
  (cd $A && node scripts/check-peer-arcs.mjs > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw7/logs/atk-$1-c4.log 2>&1); c4=$?
  (cd /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw7 && LAW_FE=$A node /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw7/law-probe.crit.mjs > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw7/logs/atk-$1-l6.log 2>&1); l6all=$?
  l6=$(grep -A2 '^L6' /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw7/logs/atk-$1-l6.log | grep -o 'PASS\|FAIL\|GREEN\|RED' | head -1)
  echo "$1 :: check-peer-arcs exit $c4 :: law-probe exit $l6all L6 $l6 :: $(grep -A3 '^L6' /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw7/logs/atk-$1-l6.log | tail -2 | tr '\n' ' ' | cut -c1-200)" >> $out
}
ic=$A/src/assets/index.css; ty=$A/src/assets/typography.css; pi=$A/src/games/shared/playerIdentity.ts
sync_copy; run clean
sync_copy; printf 'export const f = (el: HTMLElement) => { el.style.cssText = "--color-peer" + "-name-ink: red"; };\n' > $A/src/games/shared/critA2.ts; run A2-cssText-concatenated
sync_copy; printf 'export const f = (el: HTMLElement) => el.setAttribute("style", "--color-peer-" + "name-ink:red");\n' > $A/src/games/shared/critA3.ts; run A3-setAttribute-concatenated
sync_copy; printf '<script setup lang="ts">\nconst k = ["--color-peer", "name-ink"].join("-");\n</script>\n<template><div :style="{ [k]: \x27red\x27 }" /></template>\n' > $A/src/games/shared/CritA4.vue; run A4-style-object-computed-key
sync_copy; mkdir -p $A/lib; printf '.game-cell { --color-peer-name-ink: red; }\n' > $A/lib/peerx.css; sed -i '' 's|@import "./typography.css";|@import "./typography.css";\n@import "../../lib/peerx.css";|' $ic; run A5-import-from-outside-src
sync_copy; printf '\nhtml.dark { --peer-name-l: 0.5; }\n' >> $ic; run A7-stray-name-arm-html-dark
sync_copy; printf '\nhtml.dark { --peer-ink-l: 0.2; }\n' >> $ic; run A8-stray-digit-arm-html-dark
sync_copy; printf '\n.dark { --peer-name-l: 0.5; }\n' >> $ty; run A9-name-arm-in-typography-css
sync_copy; printf '\n.dark { --peer-ring-l: 0.2; }\n' >> $ty; run A9b-ring-arm-in-typography-css
sync_copy; sed -i '' 's|--peer-name-l: 0.86;|--peer-name-l: 0.80;|' $ic; sed -i '' 's|export const NAME_BANDS = \[0.295, 0.86\]|export const NAME_BANDS = [0.295, 0.80]|' $pi; grep -c "NAME_BANDS = \[0.295, 0.80\]" $pi >> $out; run A10-coordinated-name-0.80
sync_copy; run clean-after
