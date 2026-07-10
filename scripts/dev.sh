#!/usr/bin/env bash
# Start the csp-solver frontend dev server. Cleans up on exit/kill.
#
# The frontend solves in-browser via @mkbabb/csp-solver-wasm in a Worker —
# there is no backend to launch.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# ── Load .env if present ──────────────────────────────────
# shellcheck source=/dev/null
[[ -f "$ROOT/.env" ]] && set -o allexport && source "$ROOT/.env" && set +o allexport

# ── Config ────────────────────────────────────────────────
PROJECT_NAME="csp-solver"
FRONTEND_PORT_DEFAULT=9121

# ── Verify the frontend layout is present ─────────────────
[[ -d "$ROOT/web/frontend" ]] || {
    echo "ERROR: $ROOT/web/frontend not found — expected the Vue frontend." >&2
    exit 1
}

# ── Find a free port starting from $1 ────────────────────
find_free_port() {
    local p=${1:-3000}
    for _ in $(seq 1 20); do
        lsof -iTCP:"$p" -sTCP:LISTEN -P -n >/dev/null 2>&1 || { echo "$p"; return 0; }
        ((p++))
    done
    echo "ERROR: no free port from $1" >&2; return 1
}

# ── Kill process tree ─────────────────────────────────────
kill_tree() {
    local pid=$1
    for child in $(pgrep -P "$pid" 2>/dev/null); do kill_tree "$child"; done
    kill "$pid" 2>/dev/null || true
}

# ── Pick a port ───────────────────────────────────────────
FRONTEND_PORT=$(find_free_port "${FRONTEND_PORT:-$FRONTEND_PORT_DEFAULT}")

# ── Teardown ──────────────────────────────────────────────
PIDS=()
cleanup() {
    echo ""; echo "Shutting down..."
    for p in "${PIDS[@]}"; do kill_tree "$p"; done
    wait 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# ── Start frontend (web/frontend: npm + Vite) ────────────
npm --prefix web/frontend run dev -- --port "$FRONTEND_PORT" &
PIDS+=($!)

cat <<EOF

──────────────────────────────────────
  $PROJECT_NAME Dev Environment
──────────────────────────────────────
  Frontend → http://localhost:$FRONTEND_PORT
──────────────────────────────────────

EOF

wait
