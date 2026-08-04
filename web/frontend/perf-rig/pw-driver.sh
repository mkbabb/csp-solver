#!/bin/bash
# pw-driver.sh <runId> [scenarios] — run-safari.sh's contract, backed by a Playwright engine.
#
# It exists so w5-bench.sh's discipline (the quiet gate, the load stamp, the peer lifecycle)
# covers the footnote lanes too, instead of each lane inventing its own loop.
#
# $PW_ENGINE = webkit | chromium · $PW_HEADLESS = 1 (default) | 0
#
# WHAT THESE LANES MAY AND MAY NOT SAY. Playwright's WebKit is NOT Safari — it is a different
# embedding of the engine, and its user agent lies about that (`Version/x Safari/605.x`, no
# `Chrome`), which is why w5-summarize.mjs labels lanes from the runId and never from the UA.
# Headless compounds it: an offscreen page gets a software rasteriser and a synthetic vsync, so
# a headless frame curve is an ARTEFACT of the harness, not a reading of the product. These
# lanes are quotable for RELATIVE shape — does the traffic state cost more than solo, does one
# game jank where another does not — and never as a Safari or an iOS fact.
set -uo pipefail

RIG_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_ID="${1:?usage: pw-driver.sh <runId> [scenarios]}"
SCENARIOS="${2:-idle3s,liveWindow}"
ENGINE="${PW_ENGINE:-webkit}"

ARGS=("${RUN_ID}" "${SCENARIOS}" --engine "${ENGINE}")
[ "${PW_HEADLESS:-1}" = "1" ] && ARGS+=(--headless)

nice -n 15 node "${RIG_DIR}/run-pw.mjs" "${ARGS[@]}"
