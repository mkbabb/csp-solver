#!/usr/bin/env bash
# run: bash A3-run-matrix.sh 4254    — all A3 regimes, 3 windows each, appends raw.jsonl
set -u
P=${1:-4254}
D=$(cd "$(dirname "$0")" && pwd)
echo "LOADAVG-START $(sysctl -n vm.loadavg) $(date -u +%FT%TZ)"
run() { echo "== $* =="; node "$D/A3-cache-probe.mjs" --port "$P" --windows 3 --out "$D/raw.jsonl" "$@"; }
run --engine chromium --cpu 4 --net fast3g --viewport desk
run --engine chromium --cpu 4 --net none   --viewport desk
run --engine chromium --cpu 4 --net fast3g --viewport mobile
run --engine chromium --cpu 1 --net none   --viewport desk
run --engine chromium --cpu 6 --net fast3g --viewport mobile
run --engine webkit   --cpu 1 --net none   --viewport desk
run --engine webkit   --cpu 1 --net none   --viewport mobile
echo "LOADAVG-END $(sysctl -n vm.loadavg) $(date -u +%FT%TZ)"
