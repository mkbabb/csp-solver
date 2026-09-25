#!/bin/bash
# attack4 — check 4 (lint:arcs) on SHAPE, each plant a REAL file in a copy of the tree, run bare, restored by rsync.
A=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk7/attack/web/frontend
out=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk7/logs/attack4.txt; : > $out
sync_copy() { mkdir -p $A; rsync -a --delete --exclude node_modules --exclude dist --exclude test-results --exclude playwright-report --exclude .palwalk7 /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend/ $A/; [ -e $A/node_modules ] || ln -s /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules $A/node_modules; }
run() { (cd $A && node scripts/check-peer-arcs.mjs > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk7/logs/attack4-$1.log 2>&1); e=$?; echo "$1 exit $e :: $(grep -m1 '•' /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk7/logs/attack4-$1.log | cut -c1-190)" >> $out; }
sync_copy; run clean
sync_copy; printf ':root{--peer-ring-l:.2}\n.game-cell{--color-peer-cursor-ink:var(--color-foreground)}\n' > $A/public/peer.css; sed -i '' 's|</head>|<link rel="stylesheet" href="/peer.css"></head>|' $A/index.html; run K1-public-peer-css-linked
sync_copy; python3 -c "
p='$A/public/404.html'; s=open(p).read(); c='[--color-peer-cursor-ink'+':red]'; s=s.replace('</html>','<i class=\"'+c+'\"></i></html>') if '</html>' in s else s+'<i class=\"'+c+'\"></i>'; open(p,'w').write(s)"; run T1-public-404-tailwind-candidate
sync_copy; printf '\n.game-cell .glyph-svg { --color-user-ink: var(--color-foreground); }\n' >> $A/src/games/shared/gameCell.css; run K12-digit-alias-gameCell
sync_copy; printf '\n.board-cells { --color-user-ink: #2563eb; }\n' >> $A/src/assets/index.css; run K12b-fourth-user-ink-index-css
sync_copy; printf '{ "--color-peer-cursor-ink": "#2a3900" }\n' > $A/src/games/shared/inks.json; run S1-json-table
sync_copy; printf 'export const f = (el: HTMLElement) => el.style.setProperty("--color-peer-name-ink", "#fff");\n' > $A/src/games/shared/Planted.tsx; run S2-tsx-write
sync_copy; printf 'export const f = (el: HTMLElement, v: string) => el.style.setProperty(["--color-peer", "cursor-ink"].join("-"), v);\n' > $A/src/games/shared/planted.ts; run S3-computed-name
sync_copy; sed -i '' 's|"--color-peer-name-ink": pair\[2\]|"--color-peer-name-ink": pair[1]|' $A/src/games/shared/playerIdentity.ts; run N4-name-site-rebound
sync_copy; sed -i '' 's|--peer-name-l: 0.86;|--peer-name-l: 0.79;|' $A/src/assets/index.css; run N1-name-band-sheet-only
sync_copy; printf '\nconst PEER = { "--color-user-ink": "oklch(0.6 0.11 137.5deg)" };\n' >> $A/src/games/shared/useJoinWash.test.ts; printf '.x { color: var(--color-user-ink); }\n' > $A/public/quiet.css; run G-control-fixture-and-consumer
sync_copy; run clean-after
echo ATTACK4_DONE >> $out
