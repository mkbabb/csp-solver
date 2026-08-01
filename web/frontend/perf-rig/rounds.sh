#!/bin/bash
set -uo pipefail
RIG="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export CELLS="base a1-divider-pin a2-grid-bitmap-pin a3-toggle-pin a4-panel-filter-none a5-html-filters-none a6-progress-dt-pin a7-cell-anim-none a8-celebration-off a9-all-pose-pin a10-glyph-grain-none a11-transition-none a12-theme-combo"
for r in "$@"; do "${RIG}/matrix.sh" "$r"; done
echo ALL ROUNDS DONE
