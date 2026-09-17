#!/bin/bash
# RUN: cd web/frontend && bash <thisdir>/run-matrix.sh    (a vite preview must already serve :4254)
# T9-W8 lane A5 — every cell, sequentially, loadavg banked between. NEVER builds.
set -u
A="$(cd "$(dirname "$0")" && pwd)"
cell () { # name engine throttle viewport net extra
  echo "=== $1  loadavg $(sysctl -n vm.loadavg)" | tee -a "$A/matrix.log"
  node "$A/toggle-probe.mjs" --engine "$2" --throttle "$3" --viewport "$4" --net "$5" --port 4254 \
    --windows 3 --toggles 4 --out "$A/raw-$1.jsonl" $6 2>>"$A/matrix.log"
  echo "=== $1 done  loadavg $(sysctl -n vm.loadavg)" | tee -a "$A/matrix.log"
}
cell chromium-4x-desk-cold-fast3g  chromium 4 desk   fast3g ""
cell chromium-1x-desk-cold-nonet   chromium 1 desk   none   ""
cell chromium-6x-desk-cold-fast3g  chromium 6 desk   fast3g ""
cell chromium-4x-mobile-cold-fast3g chromium 4 mobile fast3g ""
cell chromium-4x-desk-warm         chromium 4 desk   none   --warm
cell webkit-desk-cold              webkit   1 desk   none   ""
cell webkit-mobile-cold            webkit   1 mobile none   ""
