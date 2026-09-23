#!/bin/bash
# MOT-LADDER pass-6 critic: attacks on CI's exact invocations, each on a restored copy.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
P=$S/motladder6crit-t6/web/frontend
A=$S/motladder6crit-atk/web/frontend
FILES="src/assets/index.css src/games/shared/DigitCell.vue scripts/check-motion-bands.mjs scripts/motion-bank.json src/pencil/chrome/GameGallery/GameCard.vue src/pencil/grid/HandDrawnGrid/usePathAnimation.ts src/pencil/chrome/GameGallery/GameGallery.vue src/pencil/celestial/DarkModeToggle.vue src/pencil/sheet/AnswerKeyLaminate.vue"
restore() { for f in $FILES; do cp "$P/$f" "$A/$f"; done; }
verify() { for f in $FILES; do cmp -s "$P/$f" "$A/$f" || echo "RESTORE FAIL $f"; done; }
run() { # name
  cd $A
  npm run lint:bands > $S/motladder6crit-atk-$1.bands.log 2>&1; b=$?
  npm run lint:verbs > $S/motladder6crit-atk-$1.verbs.log 2>&1; v=$?
  node scripts/check-motion-contract.mjs > $S/motladder6crit-atk-$1.motion.log 2>&1; m=$?
  echo "$1 bands=$b verbs=$v motion=$m :: $(grep -hE '^\s*✗|✗ ' $S/motladder6crit-atk-$1.bands.log | head -3 | tr '\n' ' ' | cut -c1-300)"
  restore; verify
}
ADM="$A/scripts/check-motion-bands.mjs"
case "$1" in
 X0) run X0 ;;
 X1)  # total rename (selector + keyframes) onto a rung + a DELETED row carrying the bank's value
  perl -0pi -e 's/\@keyframes cell-reveal \{/\@keyframes cell-pop {/; s/\.cell-reveal-animated \{\n    animation: cell-reveal 0\.3s var\(--ease-anticipatePop\);/.cell-pop {\n    animation: cell-pop var(--motion-whisper) var(--ease-anticipatePop);/; s/    \.cell-reveal-animated,\n/    .cell-pop,\n/' $A/src/assets/index.css
  perl -pi -e "s/'cell-reveal-animated': revealArmed/'cell-pop': revealArmed/" $A/src/games/shared/DigitCell.vue
  perl -0pi -e 's/  \{\n    file: "src\/assets\/index.css",\n    ms: \[300\],\n    anchor: ".cell-reveal-animated",\n    cls: "CHARACTER",\n    why: "cell-reveal on --ease-anticipatePop — an overshoot keyframe",\n  \},\n/  { file: "src\/assets\/index.css", key: "src\/assets\/index.css :: .cell-reveal-animated :: cell-reveal", ms: 300, cls: "DELETED", why: "retired" },\n/' $ADM
  grep -c 'cell-pop' $A/src/assets/index.css >&2; grep -c 'DELETED", why: "retired"' $ADM >&2
  run X1 ;;
 X1c) # the same rename, NO ledger row (negative control: must red)
  perl -0pi -e 's/\@keyframes cell-reveal \{/\@keyframes cell-pop {/; s/\.cell-reveal-animated \{\n    animation: cell-reveal 0\.3s var\(--ease-anticipatePop\);/.cell-pop {\n    animation: cell-pop var(--motion-whisper) var(--ease-anticipatePop);/; s/    \.cell-reveal-animated,\n/    .cell-pop,\n/' $A/src/assets/index.css
  perl -pi -e "s/'cell-reveal-animated': revealArmed/'cell-pop': revealArmed/" $A/src/games/shared/DigitCell.vue
  perl -0pi -e 's/  \{\n    file: "src\/assets\/index.css",\n    ms: \[300\],\n    anchor: ".cell-reveal-animated",\n    cls: "CHARACTER",\n    why: "cell-reveal on --ease-anticipatePop — an overshoot keyframe",\n  \},\n//' $ADM
  run X1c ;;
 X2ctl) perl -pi -e 's/--ease-standard: cubic-bezier\(0\.4, 0, 0\.2, 1\);/--ease-standard: ease-in;/' $A/src/assets/index.css; run X2ctl ;;
 X2a) perl -pi -e 's/--ease-standard: cubic-bezier\(0\.4, 0, 0\.2, 1\);/--ease-standard: EASE-IN;/' $A/src/assets/index.css; run X2a ;;
 X2b) perl -pi -e 's/--ease-standard: cubic-bezier\(0\.4, 0, 0\.2, 1\);/--ease-standard: linear(0, 1);/' $A/src/assets/index.css; run X2b ;;
 X2c) perl -pi -e 's/--ease-standard: cubic-bezier\(0\.4, 0, 0\.2, 1\);/--ease-standard: var(--ease-nope, ease-in);/' $A/src/assets/index.css; run X2c ;;
 X2d) perl -pi -e 's/--ease-standard: cubic-bezier\(0\.4, 0, 0\.2, 1\);/--ease-standard: CUBIC-BEZIER(0.42, 0, 1, 1);/' $A/src/assets/index.css; run X2d ;;
 X2e) perl -0pi -e 's/(        color var\(--motion-dusk\) var\(--verb-dusk-ease\) !important;\n)/$1      transition-timing-function: ease-in !important;\n/' $A/src/assets/index.css; grep -c 'transition-timing-function: ease-in !important' $A/src/assets/index.css >&2; run X2e ;;
 X3) perl -pi -e 's/scale\(var\(--live-fit\)\)/scale(max(var(--live-fit), 0.99))/' $A/src/pencil/chrome/GameGallery/GameCard.vue; grep -c 'max(var(--live-fit)' $A/src/pencil/chrome/GameGallery/GameCard.vue >&2; run X3 ;;
 X3ctl) perl -pi -e 's/scale\(var\(--live-fit\)\)/scale(var(--live-fit, 0.99))/' $A/src/pencil/chrome/GameGallery/GameCard.vue; run X3ctl ;;
 X4) perl -pi -e 's/duration: MOTION\.rungs\.whisper,/duration: MOTION.rungs.whisper \/ 3,/' $A/src/pencil/grid/HandDrawnGrid/usePathAnimation.ts; grep -c 'whisper / 3' $A/src/pencil/grid/HandDrawnGrid/usePathAnimation.ts >&2; run X4 ;;
 X5) perl -pi -e 's/const stagger = MOTION\.dealStaggerMs;/const stagger = MOTION.dealStaggerMs \/ 9;/' $A/src/pencil/chrome/GameGallery/GameGallery.vue; grep -c 'dealStaggerMs / 9' $A/src/pencil/chrome/GameGallery/GameGallery.vue >&2; run X5 ;;
 X6) printf '\n<style>\n@property --motion-throw { syntax: "<time>"; inherits: false; initial-value: 0ms; }\n</style>\n' >> $A/src/pencil/sheet/AnswerKeyLaminate.vue; run X6 ;;
esac
