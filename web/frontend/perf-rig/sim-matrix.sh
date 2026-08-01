#!/bin/bash
# sim-matrix.sh — the top ablations repeated in REAL MobileSafari on the iOS 26 sim. Mac-class
# throughput, real mobile code path (coarse pointer, drawer regime, dpr 3).
set -uo pipefail
RIG="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SC="idle3s,deal,solveCelebration,galleryGlide,themeToggle"
for r in "$@"; do
  for cell in $(printf '%s\n' base a10-glyph-grain-none a13-glyph-layerize aB2-best-plus-transitions | sort -R); do
    if [ "${cell}" = "base" ]; then
      KEEP_SIM_FRONT=1 TIMEOUT=300 "${RIG}/run-sim.sh" "sim-${cell}-s${r}" "${SC}" 2>&1 | sed "s/^/[sim-${cell}-s${r}] /"
    else
      KEEP_SIM_FRONT=1 TIMEOUT=300 "${RIG}/run-sim.sh" "sim-${cell}-s${r}" "${SC}" \
        "${RIG}/ablations/${cell}.css" 2>&1 | sed "s/^/[sim-${cell}-s${r}] /"
    fi
    sleep 3
  done
done
echo SIM MATRIX DONE
