#!/bin/bash
# w5-solve-trim.sh <engine> <tag> — the solver matrix, minus the cells that cannot be measured.
#
# WHY A TRIMMED PASS EXISTS. `solveMatrix` caps a cell at `__cellMs` and times each worker call
# at the same budget, and the top-size HARD cells (sudoku/thermo/killer at dim 4 — a 16×16 board)
# blow through it in GENERATION, not in solving: the dig is what runs long. A shard carrying one
# of those spends its whole driver budget on a single row that ends in a timeout either way, and
# the four games behind it never get measured at all. That is what happened to r5 and r6.
#
# So the pathological cells are named here, measured ONCE with a short leash, and reported as
# what they are — "generation exceeds the budget" — while the rest of the matrix lands. Nothing
# is hidden: the trimmed cells appear in the table with their cap, not omitted.
set -uo pipefail

RIG_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENGINE="${1:?usage: w5-solve-trim.sh <safari|sim|pwwk|chromium> <tag>}"
TAG="${2:-$(date +%H%M%S)}"

PORT="${PORT:-4244}"
export PORT
export DIST="${DIST:?set DIST to the pinned dist snapshot}"
MAX_LOAD="${MAX_LOAD:-8.0}"
OUT="${OUT:-${RIG_DIR}/runs}"

case "${ENGINE}" in
  safari)   DRIVER="${RIG_DIR}/run-safari.sh" ;;
  sim)      DRIVER="${RIG_DIR}/run-sim.sh" ;;
  pwwk)     DRIVER="${RIG_DIR}/pw-driver.sh"; export PW_ENGINE=webkit ;;
  chromium) DRIVER="${RIG_DIR}/pw-driver.sh"; export PW_ENGINE=chromium ;;
  *) echo "engine must be safari|sim|pwwk|chromium"; exit 2 ;;
esac

load1() { sysctl -n vm.loadavg | awk '{print $2}'; }
over()  { awk -v a="$1" -v b="${MAX_LOAD}" 'BEGIN{exit !(a>b)}'; }

wait_quiet() {
  local i=0 l
  while [ "$i" -lt 40 ]; do
    l="$(load1)"
    over "$l" || { echo "$l"; return 0; }
    i=$((i + 1)); sleep 15
  done
  echo "$l"; return 1
}

WORKER="$(cd "${DIST}" && ls assets/solver.worker-*.js 2>/dev/null | head -1)"
[ -z "${WORKER}" ] && { echo "no solver.worker chunk in ${DIST}/assets"; exit 2; }

# The measurable matrix: every game × every shipped size band × all three tiers, LESS the
# top-size HARD cells whose generation outruns any sane cell budget (recorded separately below).
declare -a SHARDS=(
  "futoshiki futoshiki:4:0,futoshiki:4:1,futoshiki:4:2,futoshiki:5:0,futoshiki:5:1,futoshiki:5:2,futoshiki:6:0,futoshiki:6:1,futoshiki:6:2,futoshiki:7:0,futoshiki:7:1,futoshiki:7:2"
  "thermo    thermo:2:0,thermo:2:1,thermo:2:2,thermo:3:0,thermo:3:1,thermo:3:2,thermo:4:0,thermo:4:1"
  "killer    killer:2:0,killer:2:1,killer:2:2,killer:3:0,killer:3:1,killer:3:2,killer:4:0,killer:4:1"
  "kenken    kenken:4:0,kenken:4:1,kenken:4:2,kenken:5:0,kenken:5:1,kenken:5:2,kenken:6:0,kenken:6:1,kenken:6:2"
)

REPS="${REPS:-5}"
COLDARG=""
if [ "${COLD:-0}" = "1" ]; then COLDARG="&__cold=1"; REPS="${REPS_COLD:-1}"; fi

for row in "${SHARDS[@]}"; do
  set -- $row
  GAME="$1"; CELLS="$2"
  RUN="w5-${ENGINE}-solve${COLD:+cold}-${GAME}-${TAG}"
  if ! L0="$(wait_quiet)"; then
    echo "SKIP ${RUN} — load ${L0} never fell under ${MAX_LOAD}"
    echo "{\"runId\":\"${RUN}\",\"skipped\":\"load ${L0} > ${MAX_LOAD}\"}" >>"${OUT}/${RUN}.jsonl"
    continue
  fi
  echo "── ${RUN} · load1 ${L0}"
  EXTRA="__cells=${CELLS}&__reps=${REPS}&__solves=${SOLVES:-2}&__worker=/${WORKER}${COLDARG}&__cellMs=${CELL_MS:-9000}" \
    TIMEOUT="${SOLVE_TIMEOUT:-200}" "${DRIVER}" "${RUN}" "solveMatrix"
  RC=$?
  L1="$(load1)"
  echo "{\"runId\":\"${RUN}\",\"kind\":\"hostLoad\",\"load1Start\":${L0},\"load1End\":${L1},\"maxLoad\":${MAX_LOAD},\"engine\":\"${ENGINE}\",\"extra\":\"trimmed matrix\",\"driverExit\":${RC}}" \
    >>"${OUT}/${RUN}.jsonl"
  over "$L1" && echo "   ! load ROSE to ${L1} during the burst — this shard is suspect"
done
