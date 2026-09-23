#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
. /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/motladder6crit-attack-lib.sh
FILES="$FILES src/games/futoshiki/CaretOverlay.vue"
case "$1" in
 X7) # the lane's gap 1, built: a DEAD decoy selector sharing the term keeps the MOVED row lawful; the real site renamed whole onto whisper
  perl -0pi -e 's/  \.cell-reveal-animated \{\n    animation: cell-reveal 0\.3s var\(--ease-anticipatePop\);/  .cell-reveal-animated-hold {\n    animation: cell-reveal 0.3s var(--ease-anticipatePop);\n  }\n  \@keyframes cell-pop {\n    0% {\n      transform: scale(0);\n      opacity: 0;\n    }\n    60% {\n      transform: scale(1.1);\n    }\n    100% {\n      transform: scale(1);\n      opacity: 1;\n    }\n  }\n  .cell-pop {\n    animation: cell-pop var(--motion-whisper) var(--ease-anticipatePop);/; s/    \.cell-reveal-animated,\n/    .cell-pop,\n/' $A/src/assets/index.css
  perl -pi -e "s/'cell-reveal-animated': revealArmed/'cell-pop': revealArmed/" $A/src/games/shared/DigitCell.vue
  perl -0pi -e 's/(const ADMITTED = \[\n)/$1  { file: "src\/assets\/index.css", key: "src\/assets\/index.css :: .cell-reveal-animated :: cell-reveal", newKey: "src\/assets\/index.css :: .cell-reveal-animated-hold :: cell-reveal", ms: 300, cls: "MOVED", why: "renamed" },\n/' $ADM
  grep -c 'cell-pop' $A/src/assets/index.css >&2; grep -c 'cell-reveal-animated-hold' $ADM >&2
  run X7 ;;
 X8) # a LAWFUL deletion through the gate's own advice: CaretOverlay's one site deleted, a DELETED row with ms 200
  perl -0pi -e 's/\n    transition: opacity var\(--motion-leave\) var\(--verb-lift-ease\);//' $A/src/games/futoshiki/CaretOverlay.vue
  perl -0pi -e 's/(const ADMITTED = \[\n)/$1  { key: "src\/games\/futoshiki\/CaretOverlay.vue :: .board-leaving .caret-layer :: opacity", ms: 200, cls: "DELETED", why: "gone" },\n/' $ADM
  grep -c 'motion-leave' $A/src/games/futoshiki/CaretOverlay.vue >&2
  run X8 ;;
esac
