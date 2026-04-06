#!/usr/bin/env bash
# Start csp-solver dev environment. Cleans up on exit/kill.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# ── Load .env if present ──────────────────────────────────
[[ -f "$ROOT/.env" ]] && set -o allexport && source "$ROOT/.env" && set +o allexport

# ── Config ────────────────────────────────────────────────
PROJECT_NAME="csp-solver"
BACKEND_PORT_DEFAULT=9120
FRONTEND_PORT_DEFAULT=9121

# ── Find a free port starting from $1 ────────────────────
find_free_port() {
    local p=${1:-8000}
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

# ── Pick ports ────────────────────────────────────────────
BACKEND_PORT=$(find_free_port "${BACKEND_PORT:-$BACKEND_PORT_DEFAULT}")
FRONTEND_PORT=$(find_free_port "${FRONTEND_PORT:-$FRONTEND_PORT_DEFAULT}")

export BACKEND_PORT FRONTEND_PORT

# ── Teardown ──────────────────────────────────────────────
PIDS=()
cleanup() {
    echo ""; echo "Shutting down..."
    for p in "${PIDS[@]}"; do kill_tree "$p"; done
    wait 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# ── Start backend ─────────────────────────────────────────
CORS_ORIGINS="http://localhost:$FRONTEND_PORT,http://localhost:5173" \
    uv run uvicorn csp_solver.api.main:app \
    --host 0.0.0.0 --port "$BACKEND_PORT" \
    --reload --reload-dir backend/src &
PIDS+=($!)

# ── Start frontend ────────────────────────────────────────
VITE_API_URL="http://localhost:$BACKEND_PORT" \
    npx --prefix frontend vite frontend --port "$FRONTEND_PORT" &
PIDS+=($!)

cat <<EOF

──────────────────────────────────────
  CSP Solver Dev Environment
──────────────────────────────────────
  Backend  → http://localhost:$BACKEND_PORT
  Frontend → http://localhost:$FRONTEND_PORT
──────────────────────────────────────

EOF

wait
