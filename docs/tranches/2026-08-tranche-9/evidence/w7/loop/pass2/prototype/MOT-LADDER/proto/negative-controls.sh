#!/usr/bin/env bash
# T9-W7 pass 2 · MOT-LADDER — THE NEGATIVE CONTROLS, on the real tree.
# Each sabotage is applied to a real file, the gate is run BARE (a pipe eats the exit code),
# and the file is restored from the copy taken first. A gate that cannot go red on the real
# surface is a gate that proves nothing about the real surface.
set -u
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-60/web/frontend
cd "$W" || exit 2
T=$(mktemp -d)

run() { node scripts/check-motion-bands.mjs >/dev/null 2>&1; echo $?; }

sabotage() { # name file "old<SEP>new"
  local name=$1 file=$2 expr=$3
  cp "$file" "$T/bak"
  python3 - "$file" "$expr" <<'PY'
import sys
p, expr = sys.argv[1], sys.argv[2]
s = open(p).read()
old, new = expr.split("\x01")
assert old in s, ("anchor missing", p, old[:60])
open(p, "w").write(s.replace(old, new, 1))
PY
  if [ $? -ne 0 ]; then printf '%-52s ANCHOR MISSING\n' "$name"; cp "$T/bak" "$file"; return; fi
  local rc; rc=$(run)
  cp "$T/bak" "$file"
  local back; back=$(run)
  printf '%-52s sabotaged=%s restored=%s  %s\n' "$name" "$rc" "$back" \
    "$([ "$rc" != 0 ] && [ "$back" = 0 ] && echo PASS || echo FAIL)"
}

echo "BASELINE (no sabotage): exit=$(run)   [0 = GREEN]"

sabotage "B1 the tongue regresses to a literal" \
  src/games/shared/DrawerTab.vue \
  $'transition: transform var(--motion-whisper, 150ms) var(--ease-drawOn);\x01transition: transform 150ms var(--ease-drawOn);'

sabotage "B2 a bare dockGlideMs joins MOTION" \
  src/pencil/config/pencilConfig.ts \
  $'  settleGuardMs: 220,\x01  settleGuardMs: 220,\n  dockGlideMs: 600,'

sabotage "B3 single-quoted :style shadow publisher" \
  src/pencil/chrome/GameGallery/GameGallery.vue \
  $'class="game-gallery"\x01class="game-gallery" :style="{ \'--card-step-ms\': mock }"'

sabotage "B3 a fallback drifts from its rung" \
  src/pencil/chrome/GameGallery/GameCard.vue \
  $'transform var(--motion-step, 440ms)\x01transform var(--motion-step, 400ms)'

sabotage "B3 the publisher goes back to inline properties" \
  src/pencil/config/pencilConfig.ts \
  $'  const el = doc.createElement("style");\x01  doc.documentElement.style.setProperty("--motion-throw", "520ms");\n  const el = doc.createElement("style");'

sabotage "B4 transition: all returns" \
  src/games/shared/GameControlPanel.vue \
  $'transition: filter var(--motion-leave, 200ms) var(--ease-standard);\x01transition: all var(--motion-leave, 200ms) var(--ease-standard);'

sabotage "B5 a live rule the reduce arm cannot reach" \
  src/games/shared/scene.css \
  $'transition: opacity var(--motion-leave, 200ms) var(--ease-fadeOut);\x01transition: opacity 200ms var(--ease-fadeOut);'

sabotage "B6 shorten one banked row" \
  src/pencil/chrome/MarginNote.vue \
  $'animation: ink-write-in var(--motion-note, 250ms) var(--ease-noteWrite) backwards;\x01animation: ink-write-in var(--motion-whisper, 150ms) var(--ease-noteWrite) backwards;'

sabotage "B7 plant a duration-300 class" \
  src/pencil/chrome/OptionSelector/OptionSelector.vue \
  $'text-center transition-colors duration-[var(--motion-whisper,150ms)]\x01text-center transition-colors duration-300'

sabotage "B8 a transition regresses to the UA's taste" \
  src/pencil/sheet/SheetWashiLabel.vue \
  $'transition: opacity var(--motion-whisper, 150ms) var(--ease-standard);\x01transition: opacity var(--motion-whisper, 150ms) ease;'

sabotage "B9 a rung lands in a delay position" \
  src/games/shared/scene.css \
  $'var(--ease-drawOn) 150ms\x01var(--ease-drawOn) var(--motion-whisper, 150ms)'

sabotage "G-DOCK-BAND the declared band is edited away" \
  src/pencil/config/pencilConfig.ts \
  $'travel: 302px @844x390 … 681px @768x1024 (sheet)\x01travel: about a screen'

sabotage "G-GUARD the carousel takes its own backstop again" \
  src/pencil/chrome/GameGallery/useCarouselGlide.ts \
  $'const SETTLE_GUARD_MS = GLIDE_MS + MOTION.settleGuardMs;\x01const SETTLE_GUARD_MS = GLIDE_MS + 200;'

echo "FINAL (restored): exit=$(run)   [0 = GREEN]"
rm -rf "$T"
