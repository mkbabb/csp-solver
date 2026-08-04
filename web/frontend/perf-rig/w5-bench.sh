#!/bin/bash
# w5-bench.sh — T8-W5's two bench families, on one engine, one cell at a time.
#
#   ./w5-bench.sh boil  safari|sim  <tag>   # family 1: boil × multiplayer, 5 games × 3 states
#   ./w5-bench.sh solve safari|sim  <tag>   # family 2: wasm solve latency, game × size × tier
#   ./w5-bench.sh cold  safari|sim  <tag>   # family 2's cold arm — a fresh worker per cell
#   ./w5-bench.sh ceiling safari|sim <tag>  # the denominator
#
# THE QUIET GATE. Three sibling lanes are running dev servers and suites on this box, and a
# measurement taken under their load is a fact about the box, not about the bundle (the rig's
# own banked case: webkit RED at load 13.83, GREEN at 2.99, same dist). Every burst waits for
# the 1-minute load average to fall under $MAX_LOAD, and every burst records the load it
# started and finished under, so a cell that was quiet going in and loud coming out can be
# thrown out rather than quietly believed.
#
# EVERYTHING AROUND a burst is `nice -n 15`; the burst itself is NOT, because a nice'd
# measurement measures niceness. Bursts are serial by construction — one browser, one window,
# one cell — and each is sized to land inside a minute.
set -uo pipefail

RIG_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FAMILY="${1:?usage: w5-bench.sh <boil|solve|cold|ceiling> <safari|sim> <tag>}"
ENGINE="${2:?engine: safari|sim}"
TAG="${3:-$(date +%H%M%S)}"

PORT="${PORT:-4244}"
export PORT
export DIST="${DIST:?set DIST to the pinned dist snapshot}"
RELAY="${RELAY:-wss://sudoku-relay.mkbabb.workers.dev}"
MAX_LOAD="${MAX_LOAD:-8.0}"
WAIT_TRIES="${WAIT_TRIES:-40}"
OUT="${OUT:-${RIG_DIR}/runs}"

case "${ENGINE}" in
  safari)   DRIVER="${RIG_DIR}/run-safari.sh" ;;
  sim)      DRIVER="${RIG_DIR}/run-sim.sh" ;;
  # The footnote lanes. They carry their engine in the runId because their UA lies — see
  # pw-driver.sh and w5-summarize.mjs's LANES table.
  pwwk)     DRIVER="${RIG_DIR}/pw-driver.sh"; export PW_ENGINE=webkit ;;
  chromium) DRIVER="${RIG_DIR}/pw-driver.sh"; export PW_ENGINE=chromium ;;
  *) echo "engine must be safari|sim|pwwk|chromium"; exit 2 ;;
esac

load1() { sysctl -n vm.loadavg | awk '{print $2}'; }
over()  { awk -v a="$1" -v b="${MAX_LOAD}" 'BEGIN{exit !(a>b)}'; }

# Block until the box is quiet enough to measure on. Returns 1 if it never gets there — the
# caller SKIPS the cell and says so, rather than measuring anyway.
wait_quiet() {
  local i=0 l
  while [ "$i" -lt "${WAIT_TRIES}" ]; do
    l="$(load1)"
    over "$l" || { echo "$l"; return 0; }
    i=$((i + 1))
    sleep 15
  done
  echo "$l"
  return 1
}

# One burst. $1 runId, $2 scenarios, $3 EXTRA app params, and $TIMEOUT from the caller.
burst() {
  local run="$1" scen="$2" extra="${3:-}"
  local l0 l1
  if ! l0="$(wait_quiet)"; then
    echo "SKIP ${run} — load ${l0} never fell under ${MAX_LOAD} in $((WAIT_TRIES * 15))s"
    echo "{\"runId\":\"${run}\",\"skipped\":\"load ${l0} > ${MAX_LOAD}\"}" >>"${OUT}/${run}.jsonl"
    return 1
  fi
  echo "── ${run} · ${scen} · load1 ${l0} · ${extra}"
  EXTRA="${extra}" "${DRIVER}" "${run}" "${scen}"
  local rc=$?
  l1="$(load1)"
  # The load stamp travels WITH the reading, in the same file, so no table can be read
  # without it.
  echo "{\"runId\":\"${run}\",\"kind\":\"hostLoad\",\"load1Start\":${l0},\"load1End\":${l1},\"maxLoad\":${MAX_LOAD},\"engine\":\"${ENGINE}\",\"extra\":\"${extra}\",\"driverExit\":${rc}}" \
    >>"${OUT}/${run}.jsonl"
  over "$l1" && echo "   ! load ROSE to ${l1} during the burst — this cell is suspect"
  return $rc
}

# The five games at the size a player meets them at (cards.ts defaults), EASY so a deal is
# cheap: cell COUNT is what the boil scales with, and difficulty does not move it.
BOIL_CELLS=(
  "sudoku 3"
  "futoshiki 5"
  "thermo 3"
  "killer 3"
  "kenken 4"
)

case "${FAMILY}" in
  ceiling)
    TIMEOUT=90 burst "w5-${ENGINE}-ceiling-${TAG}" "rafCeiling" ""
    ;;

  boil)
    # Three states per game. (a) solo. (b) a peer at the table, silent. (c) that peer writing
    # at a brisk human cadence — 500 ms, which is a player who knows the puzzle.
    for row in "${BOIL_CELLS[@]}"; do
      set -- $row
      GAME="$1"; SIZE="$2"
      BASE="game=${GAME}&size=${SIZE}&difficulty=EASY"

      TIMEOUT=110 burst "w5-${ENGINE}-${GAME}-solo-${TAG}" "idle3s,liveWindow" "${BASE}"

      for state in present traffic; do
        ROOM="w5$(date +%s)$RANDOM"
        if [ "${state}" = "present" ]; then
          nice -n 15 node "${RIG_DIR}/peer.mjs" --room "${ROOM}" --relay "${RELAY}" \
            --writes 0 >"${OUT}/w5-${ENGINE}-${GAME}-${state}-${TAG}.peer.log" 2>&1 &
        else
          nice -n 15 node "${RIG_DIR}/peer.mjs" --room "${ROOM}" --relay "${RELAY}" \
            --writes 80 --cadence 500 --start 1200 \
            >"${OUT}/w5-${ENGINE}-${GAME}-${state}-${TAG}.peer.log" 2>&1 &
        fi
        PEER=$!
        sleep 1
        TIMEOUT=110 burst "w5-${ENGINE}-${GAME}-${state}-${TAG}" "idle3s,liveWindow" \
          "${BASE}&s=${ROOM}"
        kill "${PEER}" 2>/dev/null
        wait "${PEER}" 2>/dev/null
        sleep 2
      done
    done
    ;;

  solve|cold)
    # game:dim:tierOrdinal — the shipped size bands (selectors.ts) crossed with all three tiers.
    # Sharded one game per burst so no burst outruns a minute by much and a death costs one game.
    declare -a SHARDS=(
      "sudoku    sudoku:2:0,sudoku:2:1,sudoku:2:2,sudoku:3:0,sudoku:3:1,sudoku:3:2,sudoku:4:0,sudoku:4:1,sudoku:4:2"
      "futoshiki futoshiki:4:0,futoshiki:4:1,futoshiki:4:2,futoshiki:5:0,futoshiki:5:1,futoshiki:5:2,futoshiki:6:0,futoshiki:6:1,futoshiki:6:2,futoshiki:7:0,futoshiki:7:1,futoshiki:7:2"
      "thermo    thermo:2:0,thermo:2:1,thermo:2:2,thermo:3:0,thermo:3:1,thermo:3:2,thermo:4:0,thermo:4:1,thermo:4:2"
      "killer    killer:2:0,killer:2:1,killer:2:2,killer:3:0,killer:3:1,killer:3:2,killer:4:0,killer:4:1,killer:4:2"
      "kenken    kenken:4:0,kenken:4:1,kenken:4:2,kenken:5:0,kenken:5:1,kenken:5:2,kenken:6:0,kenken:6:1,kenken:6:2"
    )
    WORKER="$(cd "${DIST}" && ls assets/solver.worker-*.js 2>/dev/null | head -1)"
    [ -z "${WORKER}" ] && { echo "no solver.worker chunk in ${DIST}/assets"; exit 2; }
    REPS="${REPS:-5}"
    COLDARG=""
    [ "${FAMILY}" = "cold" ] && { COLDARG="&__cold=1"; REPS="${REPS_COLD:-1}"; }
    for row in "${SHARDS[@]}"; do
      set -- $row
      GAME="$1"; CELLS="$2"
      TIMEOUT="${SOLVE_TIMEOUT:-420}" burst "w5-${ENGINE}-${FAMILY}-${GAME}-${TAG}" "solveMatrix" \
        "__cells=${CELLS}&__reps=${REPS}&__solves=${SOLVES:-2}&__worker=/${WORKER}${COLDARG}&__cellMs=${CELL_MS:-25000}"
    done
    ;;

  *) echo "family must be boil|solve|cold|ceiling"; exit 2 ;;
esac
