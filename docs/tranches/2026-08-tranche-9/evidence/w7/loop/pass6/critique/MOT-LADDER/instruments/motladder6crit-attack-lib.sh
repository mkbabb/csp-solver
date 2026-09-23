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
