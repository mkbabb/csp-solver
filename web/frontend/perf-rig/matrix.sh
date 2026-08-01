#!/bin/bash
# matrix.sh <round> — L2's ablation matrix, one round of the whole cell list, sequentially
# in real desktop Safari. One Safari at a time; KEEP_SAFARI_FRONT so the front never churns
# back to the editor mid-round (an occluded WebKit page suspends rAF outright).
set -uo pipefail
RIG="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROUND="${1:?usage: matrix.sh <round>}"
SC="${SC:-idle3s,deal,solveCelebration,galleryGlide,themeToggle}"
CELLS="${CELLS:-base a1-divider-pin a2-grid-bitmap-pin a3-toggle-pin a4-panel-filter-none a5-html-filters-none a6-progress-dt-pin a7-cell-anim-none a8-celebration-off a9-all-pose-pin a10-glyph-grain-none}"

# The cell order is SHUFFLED per round. This machine's load is not stationary (a backup
# daemon at 100%, an editor, another browser), so a fixed order would map any drift in load
# onto the same cells every round and read as an ablation effect. Shuffled, drift becomes
# noise around every cell instead of a bias in one.
SHUFFLED="$(printf '%s\n' ${CELLS} | sort -R | tr '\n' ' ')"
echo "round ${ROUND} order: ${SHUFFLED}"
for cell in ${SHUFFLED}; do
  RUN="${cell}-r${ROUND}"
  if [ "${cell}" = "base" ]; then
    KEEP_SAFARI_FRONT=1 TIMEOUT=300 "${RIG}/run-safari.sh" "${RUN}" "${SC}" 2>&1 | sed "s/^/[${RUN}] /"
  else
    KEEP_SAFARI_FRONT=1 TIMEOUT=300 "${RIG}/run-safari.sh" "${RUN}" "${SC}" \
      "${RIG}/ablations/${cell}.css" 2>&1 | sed "s/^/[${RUN}] /"
  fi
  sleep 3
done
echo "MATRIX ROUND ${ROUND} DONE"
