#!/bin/bash
# sim-matrix.sh — the top ablations repeated in REAL MobileSafari on the iOS 26 sim. Mac-class
# throughput, real mobile code path (coarse pointer, drawer regime, dpr 3).
#
# NOTHING HERE ASKS FOR THE FRONT (M19, permanent). Both invocations below used to export
# `KEEP_SIM_FRONT=1` into run-sim.sh, which reads no variable of that name — the frontmost
# apparatus it belonged to was deleted from run-sim.sh:76-78 on the owner's order. A dead knob
# is still a lesson, and the lesson it taught was the abrogated one, so it is gone too
# (T9-W6 §6.1; LEDGER-adjacent T8-R12's own stripping clause, finally satisfied).
set -uo pipefail
RIG="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SC="idle3s,deal,solveCelebration,galleryGlide,themeToggle"
for r in "$@"; do
  for cell in $(printf '%s\n' base a10-glyph-grain-none a13-glyph-layerize aB2-best-plus-transitions | sort -R); do
    if [ "${cell}" = "base" ]; then
      TIMEOUT=300 "${RIG}/run-sim.sh" "sim-${cell}-s${r}" "${SC}" 2>&1 | sed "s/^/[sim-${cell}-s${r}] /"
    else
      TIMEOUT=300 "${RIG}/run-sim.sh" "sim-${cell}-s${r}" "${SC}" \
        "${RIG}/ablations/${cell}.css" 2>&1 | sed "s/^/[sim-${cell}-s${r}] /"
    fi
    sleep 3
  done
done
echo SIM MATRIX DONE
