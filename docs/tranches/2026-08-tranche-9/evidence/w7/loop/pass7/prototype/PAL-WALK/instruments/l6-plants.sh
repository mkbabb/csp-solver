#!/bin/bash
# l6plants — the L6 PROPOSED on the tree copy under each plant (real files), bare exits; restored by rsync.
A=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk7/attack/web/frontend; P=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/prototype/PAL-WALK/instruments/law-probe.PROPOSED.mjs
out=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk7/logs/l6plants.txt; : > $out
sync_copy() { rsync -a --delete --exclude node_modules --exclude dist --exclude test-results --exclude playwright-report --exclude .palwalk7 /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend/ $A/; }
run() { LAW_FE=$A node $P > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk7/logs/l6p-$1.log 2>&1; e=$?; echo "$1 exit $e :: $(grep -A2 '^L6' /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk7/logs/l6p-$1.log | tail -1 | sed 's/^ *read: //' | cut -c1-260)" >> $out; }
ic=$A/src/assets/index.css; pi=$A/src/games/shared/playerIdentity.ts
sync_copy; run clean
sync_copy; printf '\n.dark .game-cell { --peer-ring-l: 0.2; }\n' >> $ic; run LA1-dark-arm-dark-game-cell
sync_copy; printf '\nhtml.dark { --peer-ring-l: 0.2; }\n' >> $ic; run LA2-dark-arm-html-dark
sync_copy; printf '\n.board-cells { --peer-ring-l: 0.4; }\n' >> $ic; run LA3-light-arm-board-cells
sync_copy; python3 - $pi <<'PY'
import sys; p=sys.argv[1]; s=open(p).read()
a='export const inkFor = (index: number): Record<string, string> => {'
b='''const TABLE = ["27.17", "181.79", "234.22", "47.19", "201.82", "320.64", "124.79", "221.84"];
export const inkFor = (index: number): Record<string, string> => {
  const t = TABLE[((index % 8) + 8) % 8];
  return {
    "--color-user-ink": `oklch(var(--peer-ink-l) 0.1 ${t}deg)`,
    "--color-peer-cursor-ink": `oklch(var(--peer-ring-l) 0.05 ${t}deg)`,
    "--color-peer-name-ink": `oklch(var(--peer-name-l) 0.05 ${t}deg)`,
  };
};
export const inkForWalk = (index: number): Record<string, string> => {'''
assert s.count(a)==1; open(p,'w').write(s.replace(a,b))
PY
run LA4-fixed-table-behind-inkFor-STEP-chromaAt-standing
sync_copy; sed -i '' 's|--peer-ring-l: 0.295;|--peer-ring-l: 0.32;|' $ic; run P6-light-arm-0.32
sync_copy; sed -i '' 's|--peer-ring-l: 0.79;|--peer-ring-l: 0.775;|' $ic; run P6-dark-arm-0.775
sync_copy; printf '\n:root { --color-peer-cursor-ink: var(--color-foreground); }\n' >> $ic; run P6-alias-arm-in-index-css
sync_copy; sed -i '' 's|at("--peer-name-l", NAME_BANDS)|at("--peer-name-l", RING_BANDS)|' $pi; run N-name-chroma-at-ring-table
sync_copy; sed -i '' 's|--peer-name-l: 0.86;|--peer-name-l: 0.93;|' $ic; run N-name-band-sheet-only
sync_copy; run clean-after
