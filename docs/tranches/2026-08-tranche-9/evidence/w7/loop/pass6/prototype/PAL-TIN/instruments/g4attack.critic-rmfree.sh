#!/bin/zsh
# the pass-5 critic's g4attack.sh, its two rm calls replaced by mv to a lane trash dir (LAWS P5); nothing else changed
G=$1
run() { # label file content(append)
  local f=$G/$2; cp $f $f.bak 2>/dev/null || touch $f.bak.new
  printf '%s\n' "$3" >> $f
  node $G/scripts/check-peer-tin.mjs > /dev/null 2>&1; local c=$?
  if [[ -e $f.bak ]]; then mv $f.bak $f; else mv $f /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/trash-paltin6-4/$RANDOM.${f:t}; mv $f.bak.new /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/trash-paltin6-4/$RANDOM.bak.new; fi
  echo "$1 -> exit $c"
}
node $G/scripts/check-peer-tin.mjs >/dev/null 2>&1; echo "baseline -> exit $?"
run "A1 css redeclare in gameCell.css" src/games/shared/gameCell.css '.x { --color-peer-2-ring: #2a3900; }'
run "A2 renamed scalar table" src/games/shared/playerIdentity.ts 'export const ringLightness = { light: 0.32, dark: 0.79 };'
run "A6 far literal" src/games/shared/playerIdentity.ts 'export const RING_BANDS = { light: 0.5, dark: 0.6 };'
run "C1 single scalar const" src/games/shared/playerIdentity.ts 'export const RING_L = 0.32;'
run "C2 nested object under neutral name" src/games/shared/playerIdentity.ts 'export const cfg = { ringL: { light: 0.32, dark: 0.79 } };'
run "C3 drifted hex table under neutral name" src/games/shared/playerIdentity.ts 'export const SWATCHES = ["#552200", "#2a3900", "#003a3c", "#20206a", "#4a0040"];'
run "C4 interpolated setProperty" src/games/shared/playerIdentity.ts 'export const bind = (el: HTMLElement, i: number) => el.style.setProperty(`--color-peer-${i}-ring`, "#2a3900");'
run "C5 oklch ring in gameCell.css" src/games/shared/gameCell.css '.cell.is-peer-cursor .ring { stroke: oklch(0.32 0.074 124.8); }'
run "C6 8-digit hex of a published arm" src/games/shared/gameCell.css '.x { stroke: #243200ff; }'
run "C7 published hex in a .js file" src/lib/tin.js 'export const T = "#243200";'
run "C8 3-digit shorthand table under peer name" src/games/shared/playerIdentity.ts 'export const peerInks = ["#530", "#230"];'
run "C9 rgb() table under peer name" src/games/shared/playerIdentity.ts 'export const peerRing = ["rgb(36,50,0)", "rgb(75,29,0)"];'
run "C10 inline template style in .vue" src/games/shared/GameBoard.vue '<template><i style="--color-peer-2-ring:#111"/></template>'
run "C11 CSS var alias under new name" src/games/shared/gameCell.css ':root { --tape-ink-2: #2a3900; }'
run "C12 tape name back in the stick (GameBoard color)" src/games/shared/GameBoard.vue '<style>.attribution-tape :deep(.washi-label){color:var(--color-user-ink)}</style>'
