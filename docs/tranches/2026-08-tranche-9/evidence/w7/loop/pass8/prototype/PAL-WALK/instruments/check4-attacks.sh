#!/bin/bash
# PAL-WALK pass 8: the critic's pass-7 attacks (A2-A5, A7-A9b, A10) planted on fresh COPIES of the tree
# (one copy per plant, never the tree), each read bare by the pass-8 check AND the pass-7 fork.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk9
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend
OUT=$S/logs/attacks.tsv; : > $OUT
mk() { d=$S/atk/$1/web/frontend; mkdir -p $d; for x in src e2e scripts public index.html package.json README.md; do cp -R $T/$x $d/; done; ln -s $T/node_modules $d/node_modules; cp $S/check-peer-arcs.p7.mjs $d/scripts/; echo $d; }
run() { name=$1; d=$2; ( cd $d && node scripts/check-peer-arcs.mjs ) > $S/logs/atk-$name-p8.log 2>&1; e8=$?; ( cd $d && node scripts/check-peer-arcs.p7.mjs ) > $S/logs/atk-$name-p7.log 2>&1; e7=$?; echo -e "$name\tp8=$e8\tp7=$e7" >> $OUT; }
d=$(mk clean); run clean $d
d=$(mk A2); printf 'export const a2 = (el: HTMLElement): void => {\n  el.style.cssText = "--color-peer" + "-name-ink: red";\n};\n' > $d/src/games/shared/peerxA2.ts; run A2 $d
d=$(mk A3); printf 'export const a3 = (el: HTMLElement): void => {\n  el.setAttribute("style", "--color-peer-" + "name-ink:red");\n};\n' > $d/src/games/shared/peerxA3.ts; run A3 $d
d=$(mk A4); printf '<script setup lang="ts">\nconst k = ["--color-peer", "name-ink"].join("-");\n</script>\n<template><span :style="{ [k]: %s }" /></template>\n' "'red'" > $d/src/games/shared/PeerXA4.vue; run A4 $d
d=$(mk A5); mkdir -p $d/lib; printf '.game-cell {\n  --color-peer-name-ink: red;\n}\n' > $d/lib/peerx.css; { printf '@import "../../lib/peerx.css";\n'; cat $T/src/assets/index.css; } > $d/src/assets/index.css; run A5 $d
d=$(mk A7); printf '\nhtml.dark {\n  --peer-name-l: 0.5;\n}\n' >> $d/src/assets/index.css; run A7 $d
d=$(mk A8); printf '\nhtml.dark {\n  --peer-ink-l: 0.2;\n}\n' >> $d/src/assets/index.css; run A8 $d
d=$(mk A9); printf '\n.dark {\n  --peer-name-l: 0.5;\n}\n' >> $d/src/assets/typography.css; run A9 $d
d=$(mk A9b); printf '\n.dark {\n  --peer-ring-l: 0.2;\n}\n' >> $d/src/assets/typography.css; run A9b $d
d=$(mk A10); sed -i '' 's/NAME_BANDS = \[0\.295, 0\.86\]/NAME_BANDS = [0.295, 0.8]/' $d/src/games/shared/playerIdentity.ts; sed -i '' 's/--peer-name-l: 0\.86;/--peer-name-l: 0.8;/' $d/src/assets/index.css; grep -c 'NAME_BANDS = \[0.295, 0.8\]' $d/src/games/shared/playerIdentity.ts >> $S/logs/atk-A10-anchor.txt; grep -c 'peer-name-l: 0.8;' $d/src/assets/index.css >> $S/logs/atk-A10-anchor.txt; run A10 $d
( cd $d && npx vitest run src/games/shared/useSession.test.ts src/games/shared/BoardHost.authors.test.ts ) > $S/logs/atk-A10-unit.log 2>&1; echo -e "A10-unit\texit=$?" >> $OUT
( cd $S/atk/clean/web/frontend && npx vitest run src/games/shared/useSession.test.ts src/games/shared/BoardHost.authors.test.ts ) > $S/logs/atk-clean-unit.log 2>&1; echo -e "clean-unit\texit=$?" >> $OUT
d=$S/atk/clean/web/frontend; run clean-after $d
echo ATKDONE >> $OUT
