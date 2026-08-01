#!/bin/bash
# run-sim.sh <runId> [scenarios] [ablateFile] — the same probe in the iOS Simulator's Safari.
#
# READ THIS BEFORE TRUSTING A NUMBER FROM HERE: the Simulator runs MobileSafari against the
# HOST's CPU/GPU (M5 Max). It exercises the real MOBILE code path — coarse pointer, the drawer
# regime, iPhone viewport — but its throughput is Mac-class, NOT iPhone-class. Use it for
# "does the mobile path jank and where", never for "the iPhone does N fps".
#
# The sim shares the host loopback, so localhost:PORT resolves straight to the rig.
# Occlusion suspends MobileSafari exactly as it does desktop Safari, hence the activate/re-assert.
set -uo pipefail

RIG_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${PORT:-4894}"
RUN_ID="${1:?usage: run-sim.sh <runId> [scenarios] [ablateFile]}"
SCENARIOS="${2:-idle3s,deal,undoBurst,solveCelebration,galleryGlide,themeToggle}"
ABLATE_FILE="${3:-}"
TIMEOUT="${TIMEOUT:-240}"
# the campaign's device; override with DEVICE=<udid|name>
DEVICE="${DEVICE:-perf-rig-iphone16}"

if ! curl -sf "http://localhost:${PORT}/__ping" >/dev/null; then
  echo "probe-server not answering on :${PORT} — start it first:"
  echo "  node ${RIG_DIR}/probe-server.mjs"
  exit 2
fi

UDID="$(xcrun simctl list devices 2>/dev/null | grep -F "${DEVICE}" | head -1 | sed -E 's/.*\(([0-9A-F-]{36})\).*/\1/')"
if [ -z "${UDID}" ]; then
  echo "no simulator matching '${DEVICE}'. Available:"
  xcrun simctl list devices available | grep -E "iPhone|iPad"
  exit 2
fi
STATE="$(xcrun simctl list devices 2>/dev/null | grep -F "${UDID}" | sed -E 's/.*\((Booted|Shutdown|Booting)\).*/\1/')"
echo "device ${DEVICE} ${UDID} (${STATE})"

if [ "${STATE}" != "Booted" ]; then
  echo "booting…"
  xcrun simctl boot "${UDID}" 2>/dev/null
  for _ in $(seq 1 60); do
    [ "$(xcrun simctl list devices | grep -F "${UDID}" | grep -c Booted)" = "1" ] && break
    sleep 1
  done
  xcrun simctl bootstatus "${UDID}" -b >/dev/null 2>&1
fi

if [ "${SCENARIOS}" = "rafCeiling" ]; then
  URL="http://localhost:${PORT}/__ceiling?__run=${RUN_ID}"
else
  URL="http://localhost:${PORT}/?__run=${RUN_ID}&__scenarios=${SCENARIOS}"
fi
if [ -n "${ABLATE_FILE}" ]; then
  if [ ! -f "${ABLATE_FILE}" ]; then echo "ablate file not found: ${ABLATE_FILE}"; exit 2; fi
  ENC="$(node -e 'const fs=require("fs");process.stdout.write(encodeURIComponent(fs.readFileSync(process.argv[1],"utf8")))' "${ABLATE_FILE}")"
  URL="${URL}&__ablate=${ENC}"
  echo "ablation: ${ABLATE_FILE}"
fi

PREV_APP="$(osascript -e 'tell application "System Events" to get name of first application process whose frontmost is true' 2>/dev/null)"
open -a Simulator >/dev/null 2>&1
osascript -e 'tell application "Simulator" to activate' >/dev/null 2>&1
sleep 2

echo "run ${RUN_ID} → ${SCENARIOS}"
xcrun simctl openurl "${UDID}" "${URL}" || { echo "simctl openurl failed"; exit 2; }

DEADLINE=$(( $(date +%s) + TIMEOUT ))
STATUS=3
REASSERTS=0
while [ "$(date +%s)" -lt "${DEADLINE}" ]; do
  if curl -s "http://localhost:${PORT}/__runs/${RUN_ID}" | grep -q '"done":true'; then
    STATUS=0
    break
  fi
  if [ "$(osascript -e 'tell application "System Events" to get name of first application process whose frontmost is true' 2>/dev/null)" != "Simulator" ]; then
    osascript -e 'tell application "Simulator" to activate' >/dev/null 2>&1
    REASSERTS=$((REASSERTS + 1))
  fi
  sleep 2
done
[ "${REASSERTS}" -gt 0 ] && echo "front re-asserted ${REASSERTS}× (focus churn — treat numbers with care)"

if [ "${STATUS}" -eq 0 ]; then
  echo "run ${RUN_ID} complete → ${RIG_DIR}/runs/${RUN_ID}.jsonl"
else
  echo "run ${RUN_ID} TIMED OUT after ${TIMEOUT}s (partial lines kept)"
fi

if [ -n "${PREV_APP}" ] && [ "${PREV_APP}" != "Simulator" ] && [ "${KEEP_SIM_FRONT:-0}" != "1" ]; then
  osascript -e "tell application \"${PREV_APP}\" to activate" >/dev/null 2>&1 || true
fi

exit "${STATUS}"
