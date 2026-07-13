#!/usr/bin/env bash
# iai instruction-count gate — compare a single callgrind run against the
# committed golden baseline with a tolerance band.
#
# SEARCH-TRAJECTORY / INSTRUCTION-COUNT LOCK: this gate reds on ANY move of the
# solver hot-path instruction count beyond the band — a regression AND a
# legitimate win alike. A real speedup is not an accident to auto-absorb; it is
# re-baselined DELIBERATELY in a reviewed commit that edits iai_queens.baseline
# (never a silent auto-update, else the gate drifts back into the determinism
# tautology it replaced). Same tripwire class as the frozen search-node counts.
#
# The gate logic lives here, not inline in ci.yml, so it is runnable locally
# against any callgrind log (the born-RED proof feeds it a base log, a doubled-
# hot-path log, and a reverted log — no CI round-trip needed).
#
# Usage:
#   iai_gate.sh <run.log> <baseline-file> [tolerance_pct]
# Env:
#   IAI_TOLERANCE_PCT   default tolerance band in percent (default 2.0)
#   GITHUB_STEP_SUMMARY when set, a markdown table is appended to it
#
# Exit: 0 = within band (PASS); non-zero = out of band or unparseable (FAIL).
set -euo pipefail

RUN_LOG="${1:?usage: iai_gate.sh <run.log> <baseline-file> [tolerance_pct]}"
BASELINE_FILE="${2:?usage: iai_gate.sh <run.log> <baseline-file> [tolerance_pct]}"
TOL_PCT="${3:-${IAI_TOLERANCE_PCT:-2.0}}"

# Extract the measured instruction count from a callgrind run log.
# Strip ANSI escapes FIRST (belt-and-suspenders vs IAI_CALLGRIND_COLOR=never),
# then take the first integer after the "Instructions:" label — never a
# colour-code digit. (Folded verbatim from spike/iai-callgrind ff5d9de3 —
# "harden gate parser — strip ANSI, anchor to Instructions label".)
extract_measured() {
    sed -E $'s/\x1b\\[[0-9;]*[mK]//g' "$1" \
        | grep -E 'Instructions:' | head -1 \
        | sed -E 's/.*Instructions:[^0-9]*([0-9][0-9,]*).*/\1/' \
        | tr -d ','
}

# The golden count is the first non-blank, non-comment line of the baseline
# file (comments start with '#'), reduced to digits.
extract_golden() {
    grep -vE '^[[:space:]]*(#|$)' "$1" | head -1 | tr -cd '0-9'
}

MEASURED="$(extract_measured "$RUN_LOG" || true)"
GOLDEN="$(extract_golden "$BASELINE_FILE" || true)"

if [ -z "${MEASURED}" ]; then
    echo "::error::iai gate — could not parse an Instructions count from '${RUN_LOG}'; the lane produced no callgrind output"
    echo "----- ${RUN_LOG} tail -----"; tail -40 "$RUN_LOG" 2>/dev/null || true
    exit 1
fi
if [ -z "${GOLDEN}" ]; then
    echo "::error::iai gate — no golden count in baseline '${BASELINE_FILE}'"
    exit 1
fi

# Signed delta (for the report) and absolute delta (for the gate).
DELTA_PCT="$(awk -v m="$MEASURED" -v g="$GOLDEN" 'BEGIN{ printf "%.6f", (m-g)/g*100 }')"
ABS_PCT="$(awk -v m="$MEASURED" -v g="$GOLDEN" 'BEGIN{ d=(m-g)/g*100; if(d<0)d=-d; printf "%.6f", d }')"
PASS="$(awk -v a="$ABS_PCT" -v t="$TOL_PCT" 'BEGIN{ print (a<=t)?1:0 }')"
VERDICT="$([ "$PASS" = 1 ] && echo PASS || echo FAIL)"

echo "iai gate — measured=${MEASURED} golden=${GOLDEN} delta=${DELTA_PCT}% band=+/-${TOL_PCT}% => ${VERDICT}"

if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
    {
        echo "## iai — instruction-count baseline gate"
        echo ""
        echo "Search-trajectory / instruction-count lock — a legitimate improvement re-baselines deliberately (edit \`iai_queens.baseline\`)."
        echo ""
        echo "| metric | value |"
        echo "|---|---|"
        echo "| golden (committed) | ${GOLDEN} |"
        echo "| measured | ${MEASURED} |"
        echo "| delta | ${DELTA_PCT}% |"
        echo "| tolerance band | +/-${TOL_PCT}% |"
        echo "| gate | ${VERDICT} |"
    } >> "$GITHUB_STEP_SUMMARY"
fi

if [ "$PASS" != 1 ]; then
    echo "::error::iai gate FAIL — hot-path instruction count ${MEASURED} is ${DELTA_PCT}% off the golden ${GOLDEN} (band +/-${TOL_PCT}%). A regression? fix it. A real win? re-baseline iai_queens.baseline in a reviewed commit."
    exit 1
fi
echo "GATE PASS — hot-path instruction count within +/-${TOL_PCT}% of the committed golden (${DELTA_PCT}% delta)"
