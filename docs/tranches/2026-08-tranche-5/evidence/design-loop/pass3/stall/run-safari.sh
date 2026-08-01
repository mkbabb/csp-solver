#!/bin/bash
# run-safari.sh <runId> [scenarios] [ablateFile] — drive the BUILT DIST in REAL Safari.
#
#   1. checks the probe server is up on $PORT (default 4894)
#   2. builds the probe URL (?__run / ?__scenarios / ?__ablate — the CSS is URI-encoded here)
#   3. `open -a Safari` it (a fresh runId ⇒ a fresh tab, and Safari comes frontmost —
#      rAF is throttled hard in an occluded window, so frontmost is load-bearing)
#   4. polls /__runs/<runId> for {"done":true} (timeout 120s)
#   5. best-effort osascript-closes localhost:<PORT> tabs (TCC may refuse — tolerated)
#
# $EXTRA — extra app query params appended verbatim (P-W4). The app's own state (game, board
# size, difficulty) is localStorage-persisted PER ORIGIN, so two ports serving two dists do
# NOT share a board: :4894 was carrying a 16×16 (256 cells) while a virgin :4899 booted 9×9
# (81 cells), and `deal`/`galleryGlide` scale with cell count. Any base-vs-cured pair must
# therefore pin state on the URL — `EXTRA='game=sudoku&size=3&difficulty=EASY'` — because
# `?size`/`?difficulty` beat storage in resolveInitialState() and clear the disagreeing save.
#
# Exit: 0 done · 2 server down · 3 timeout
set -uo pipefail

RIG_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${PORT:-4894}"
RUN_ID="${1:?usage: run-safari.sh <runId> [scenarios] [ablateFile]}"
SCENARIOS="${2:-idle3s,deal,undoBurst,solveCelebration,galleryGlide,themeToggle}"
ABLATE_FILE="${3:-}"
TIMEOUT="${TIMEOUT:-120}"

if ! curl -sf "http://localhost:${PORT}/__ping" >/dev/null; then
  echo "probe-server not answering on :${PORT} — start it first:"
  echo "  node ${RIG_DIR}/probe-server.mjs"
  exit 2
fi

if [ "${SCENARIOS}" = "rafCeiling" ]; then
  # the app-free control page: the display's rAF ceiling, same sampler shape
  URL="http://localhost:${PORT}/__ceiling?__run=${RUN_ID}"
else
  URL="http://localhost:${PORT}/?__run=${RUN_ID}&__scenarios=${SCENARIOS}"
fi
if [ -n "${EXTRA:-}" ]; then
  URL="${URL}&${EXTRA}"
  echo "extra params: ${EXTRA}"
fi
if [ -n "${ABLATE_FILE}" ]; then
  if [ ! -f "${ABLATE_FILE}" ]; then echo "ablate file not found: ${ABLATE_FILE}"; exit 2; fi
  ENC="$(node -e 'const fs=require("fs");process.stdout.write(encodeURIComponent(fs.readFileSync(process.argv[1],"utf8")))' "${ABLATE_FILE}")"
  URL="${URL}&__ablate=${ENC}"
  echo "ablation: ${ABLATE_FILE} ($(wc -c <"${ABLATE_FILE}" | tr -d ' ') bytes)"
fi

echo "run ${RUN_ID} → ${SCENARIOS}"

# Whose window was on top — restored at the end so the desktop comes back as we found it.
PREV_APP="$(osascript -e 'tell application "System Events" to get name of first application process whose frontmost is true' 2>/dev/null)"
[ -n "${PREV_APP}" ] && echo "frontmost before: ${PREV_APP}"

# The tab MUST be the front window's CURRENT tab and Safari MUST be frontmost: an occluded
# WebKit page has its timers and rAF suspended outright (the first run died exactly here —
# a full-screen app covered Safari and the probe posted `env` then flatlined). osascript
# guarantees tab-in-front; plain `open -a Safari` does not.
osascript >/dev/null 2>&1 <<APPLESCRIPT
tell application "Safari"
  activate
  if (count of windows) is 0 then
    make new document with properties {URL:"${URL}"}
  else
    tell front window
      set current tab to (make new tab with properties {URL:"${URL}"})
      set index to 1
    end tell
  end if
end tell
APPLESCRIPT
if [ $? -ne 0 ]; then
  echo "(osascript open refused — falling back to \`open -a Safari\`; occlusion risk)"
  open -a Safari "${URL}" || { echo "open -a Safari failed"; exit 2; }
fi

# P3 STALL LANE: the drawer exists at >=1024 ONLY (useControlsDrawer §6). Pin the window
# so every cell is measured in the SAME row regime — $WINW x $WINH, default 1280x900.
osascript >/dev/null 2>&1 <<BOUNDS
tell application "Safari" to set bounds of front window to {0, 0, ${WINW:-1280}, ${WINH:-900}}
BOUNDS

sleep 2
FRONT_NOW="$(osascript -e 'tell application "System Events" to get name of first application process whose frontmost is true' 2>/dev/null)"
if [ "${FRONT_NOW}" != "Safari" ]; then
  echo "WARNING: frontmost is '${FRONT_NOW}', not Safari — an occluded page suspends rAF and this run will stall"
fi

DEADLINE=$(( $(date +%s) + TIMEOUT ))
STATUS=3
REASSERTS=0
while [ "$(date +%s)" -lt "${DEADLINE}" ]; do
  if curl -s "http://localhost:${PORT}/__runs/${RUN_ID}" | grep -q '"done":true'; then
    STATUS=0
    break
  fi
  # Another app can steal the front (the editor does it on file change). Safari behind glass
  # = suspended timers, so re-assert rather than let the run die. Every re-assert is counted:
  # a run with churn > 0 has focus events in its frame curve and should be re-taken.
  if [ "$(osascript -e 'tell application "System Events" to get name of first application process whose frontmost is true' 2>/dev/null)" != "Safari" ]; then
    osascript -e 'tell application "Safari" to activate' >/dev/null 2>&1
    REASSERTS=$((REASSERTS + 1))
  fi
  sleep 2
done
[ "${REASSERTS}" -gt 0 ] && echo "front re-asserted ${REASSERTS}× during the run (focus churn — treat numbers with care)"

if [ "${STATUS}" -eq 0 ]; then
  echo "run ${RUN_ID} complete → ${RIG_DIR}/runs/${RUN_ID}.jsonl"
else
  echo "run ${RUN_ID} TIMED OUT after ${TIMEOUT}s (partial lines kept)"
fi

# best-effort tab cleanup; never hang the driver on TCC
osascript -e "
tell application \"Safari\"
  repeat with w in (every window)
    repeat with t in (every tab of w)
      try
        if (URL of t) contains \"localhost:${PORT}\" then close t
      end try
    end repeat
  end repeat
end tell" >/dev/null 2>&1 &
OSA=$!
( sleep 8; kill "${OSA}" 2>/dev/null ) >/dev/null 2>&1 &
wait "${OSA}" 2>/dev/null || echo "(tab cleanup skipped — osascript refused or timed out)"

# hand the desktop back to whoever had it
if [ -n "${PREV_APP}" ] && [ "${PREV_APP}" != "Safari" ] && [ "${KEEP_SAFARI_FRONT:-0}" != "1" ]; then
  osascript -e "tell application \"${PREV_APP}\" to activate" >/dev/null 2>&1 ||
    echo "(could not restore ${PREV_APP} to the front)"
fi

exit "${STATUS}"
