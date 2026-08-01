#!/bin/bash
# shot.sh <outPng> <urlPath> [waitS] — plain (probe-free) load on the sim, then a framebuffer grab.
set -uo pipefail
PORT="${PORT:-4896}"
UDID="${UDID:-1B3EB33C-9F51-4D70-B994-E35877EB65E8}"
OUT="${1:?out.png}"; P="${2:-/}"; W="${3:-6}"
open -a Simulator >/dev/null 2>&1
osascript -e 'tell application "Simulator" to activate' >/dev/null 2>&1
xcrun simctl openurl "${UDID}" "http://localhost:${PORT}${P}" >/dev/null 2>&1 || { echo "openurl fail"; exit 2; }
sleep "${W}"
xcrun simctl io "${UDID}" screenshot --type=png "${OUT}" >/dev/null 2>&1 && echo "shot ${OUT}" || echo "SHOT-FAIL ${OUT}"
