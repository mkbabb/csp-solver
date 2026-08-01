#!/bin/bash
# simq.sh <runId> <extraQuery> [timeoutS] — open an arbitrary probe URL on perf-rig-iphone16
# and wait for {done:true}. PORT env selects the server. Re-asserts Simulator front like
# run-sim.sh (MobileSafari suspends rAF when occluded).
set -uo pipefail
PORT="${PORT:-4896}"
UDID="${UDID:-1B3EB33C-9F51-4D70-B994-E35877EB65E8}"
RUN="${1:?usage: simq.sh <runId> <query> [timeout]}"
Q="${2:-}"
TO="${3:-150}"

curl -sf "http://localhost:${PORT}/__ping" >/dev/null || { echo "NO-SERVER :${PORT}"; exit 2; }
URL="http://localhost:${PORT}/?__run=${RUN}"
[ -n "${Q}" ] && URL="${URL}&${Q}"

open -a Simulator >/dev/null 2>&1
osascript -e 'tell application "Simulator" to activate' >/dev/null 2>&1
sleep 1
xcrun simctl openurl "${UDID}" "${URL}" || { echo "OPENURL-FAIL ${RUN}"; exit 2; }

DEADLINE=$(( $(date +%s) + TO ))
RE=0
while [ "$(date +%s)" -lt "${DEADLINE}" ]; do
  if curl -s "http://localhost:${PORT}/__runs/${RUN}" | grep -q '"done":true'; then
    echo "OK ${RUN} (reasserts ${RE})"
    exit 0
  fi
  if [ "$(osascript -e 'tell application "System Events" to get name of first application process whose frontmost is true' 2>/dev/null)" != "Simulator" ]; then
    osascript -e 'tell application "Simulator" to activate' >/dev/null 2>&1
    RE=$((RE+1))
  fi
  sleep 2
done
echo "TIMEOUT ${RUN}"
exit 3
