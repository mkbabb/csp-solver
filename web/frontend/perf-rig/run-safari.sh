#!/bin/bash
# run-safari.sh <runId> [scenarios] [ablateFile] — drive the BUILT DIST in REAL Safari.
#
#   1. checks the probe server is up on $PORT (default 4894)
#   2. builds the probe URL (?__run / ?__scenarios / ?__ablate — the CSS is URI-encoded here)
#   3. hands it to safari-wd.mjs, which drives an ISOLATED automation Safari over W3C WebDriver:
#      a small corner window, verified to be painting from inside the page, NEVER made frontmost
#   4. that driver polls /__runs/<runId> for {"done":true} and closes its own session
#
# NOTHING HERE TOUCHES THE OWNER'S DESKTOP. There is no osascript in this file, no `activate`,
# no `open -a`, and no frontmost assertion — see the block above the drive for what was removed
# and why the removal is safe.
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
# The tree this run is about. Defaults to the sibling `../dist`, which is what every lane
# before T8-W5 measured. $DIST names a SNAPSHOT instead: `../dist` is unowned and a concurrent
# lane's rebuild moves it mid-session (the banked D6-G3 class), so a bench that must hold one
# tree across a long matrix copies it aside and points both the server and this check at the
# copy. The assertion is unchanged — whatever DIST names must be what :$PORT is serving.
DIST="${DIST:-${RIG_DIR}/../dist}"
RUN_ID="${1:?usage: run-safari.sh <runId> [scenarios] [ablateFile]}"
SCENARIOS="${2:-idle3s,deal,undoBurst,solveCelebration,galleryGlide,themeToggle}"
ABLATE_FILE="${3:-}"
TIMEOUT="${TIMEOUT:-120}"

if ! curl -sf "http://localhost:${PORT}/__ping" >/dev/null; then
  echo "probe-server not answering on :${PORT} — start it first:"
  echo "  node ${RIG_DIR}/probe-server.mjs"
  exit 2
fi

# BUILD IDENTITY, first line of the run (T5-W4 pass-7 Lane D, D6-G3). `../dist` is
# `.gitignore`d and owned by whoever last built — pass 5 measured an ABLATE dist without
# knowing it, and a concurrent lane rebuilt this one mid-session while the row was being
# closed. The rig prints WHICH tree it is about to measure, and asserts the server on
# :${PORT} is serving that same tree, before any number exists. Exit 4 if it cannot.
if ! node "${RIG_DIR}/../scripts/dist-identity.mjs" \
  --dist "${DIST}" --served "http://localhost:${PORT}/"; then
  echo "build identity unresolved — this run would produce numbers with no tree attached"
  exit 4
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

# ── THE DRIVE ────────────────────────────────────────────────────────────────────────────────
# Everything that used to live here is DELETED, on the owner's order. For the record, what it
# was: a PREV_APP capture via `System Events`; an `osascript … tell application "Safari" …
# activate` block that opened the URL as the front window's current tab; an `open -a Safari`
# fallback; a post-launch frontmost assertion; a re-assert loop that called `activate` every 2 s
# whenever anything else took the front; an osascript tab-cleanup sweep; and a closing
# `activate` to hand the desktop back. That apparatus seized the owner's screen for the whole
# run, and it existed to cure a problem it had misdiagnosed as FOCUS.
#
# The problem is OCCLUSION. A hidden WebKit page has rAF suspended — measured on this box: zero
# rAF callbacks in 20 s, while fixed integer work ran full speed (84/84/91 ms). Focus never
# entered into it. So the cure is a window that is genuinely visible, VERIFIED from inside the
# page, and a row that is thrown out when it is not — never a window that is forced to the front.
#
# safaridriver hosts an isolated, glass-paned automation Safari; navigation, script evaluation
# and screenshots need no focus and no frontmost. One session at a time (Apple's rule), which
# suits a bench that is serial anyway. Expect ONE activation when the session's Safari launches.
WD_PORT="${WD_PORT:-4285}"
# HYGIENE, NOT A CURE. The old default `1400,760 560×420` put its bottom edge at y=1180 on a
# 2048×1152 screen — 28 px off. That is worth fixing and it is NOT why frame rows get refused:
# an interleaved control (the two rects alternating seconds apart) reads 0/3 visible for BOTH,
# and a 1700×1050 window holds hidden 0/15 over 30 s. Occlusion here is a full-screen app on the
# active Space, which no rect and no WebDriver call can reach — see quiet-driver.md §3, upheld.
# Keep the window fully on-screen anyway, and trust the paint gate for the rest.
WD_RECT="${WD_RECT:-0,0,900,700}"

if ! curl -sf -m 3 "http://127.0.0.1:${WD_PORT}/status" >/dev/null; then
  echo "safaridriver is not listening on :${WD_PORT} — start it (backgrounded, nice'd):"
  echo "  nice -n 15 safaridriver -p ${WD_PORT} &"
  echo "If it refuses sessions, Remote Automation is off and the OWNER must enable it ONCE:"
  echo "  Safari ▸ Settings ▸ Advanced ▸ 'Show features for web developers',"
  echo "  then Develop ▸ 'Allow Remote Automation'"
  exit 2
fi

# $WD_SESSION_FILE banks the session across a matrix so the whole bench costs ONE activation.
SESS_ARG=()
[ -n "${WD_SESSION_FILE:-}" ] && SESS_ARG=(--session-file "${WD_SESSION_FILE}")

# Frames need a visible window; WORK does not. A scenario list with no frame scenario in it runs
# under the compute gate and is perfectly happy in a hidden, unfocused, backgrounded window —
# which is how the whole solver matrix gets measured on real Safari while the owner works.
case "${SCENARIOS}" in
  solveMatrix|solveMatrix,*|*,solveMatrix) GATE=compute ;;
  *) GATE=paint ;;
esac

# ${SESS_ARG[@]+…} not ${SESS_ARG[@]} — macOS bash 3.2 under `set -u` calls an EMPTY array's
# expansion unbound; the +form expands to nothing instead of dying.
nice -n 15 node "${RIG_DIR}/safari-wd.mjs" \
  --url "${URL}" --run "${RUN_ID}" --port "${PORT}" --gate "${GATE}" \
  --driver-port "${WD_PORT}" --rect "${WD_RECT}" --timeout "${TIMEOUT}" ${SESS_ARG[@]+"${SESS_ARG[@]}"}
STATUS=$?

case "${STATUS}" in
  0) echo "run ${RUN_ID} complete → ${RIG_DIR}/runs/${RUN_ID}.jsonl" ;;
  5) echo "run ${RUN_ID} OCCLUDED-INVALID — the automation window was not painting; row not quotable" ;;
  3) echo "run ${RUN_ID} TIMED OUT after ${TIMEOUT}s (partial lines kept)" ;;
esac

exit "${STATUS}"
