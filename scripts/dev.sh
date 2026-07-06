#!/usr/bin/env bash
# Start the csp-solver dev environment. Cleans up on exit/kill.
#
# Two modes:
#   native (default) — uv (backend) + npm (frontend) directly on the host.
#   --docker         — `docker compose up` (web/api + web/frontend containers).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# ── Load .env if present ──────────────────────────────────
# shellcheck source=/dev/null
[[ -f "$ROOT/.env" ]] && set -o allexport && source "$ROOT/.env" && set +o allexport

# ── Config ────────────────────────────────────────────────
PROJECT_NAME="csp-solver"
BACKEND_PORT_DEFAULT=9120
FRONTEND_PORT_DEFAULT=9121

MODE="native"
if [[ "${1:-}" == "--docker" ]]; then
    MODE="docker"
    shift
fi

# ── Docker mode: delegate to compose, nothing else to do ─
if [[ "$MODE" == "docker" ]]; then
    exec docker compose -p "$PROJECT_NAME" up "$@"
fi

# ── Native mode: verify the web/ layout is actually present ─
[[ -d "$ROOT/web/api/src" ]] || {
    echo "ERROR: $ROOT/web/api/src not found — expected the web/api backend package." >&2
    exit 1
}
[[ -d "$ROOT/web/frontend" ]] || {
    echo "ERROR: $ROOT/web/frontend not found — expected the Vue frontend." >&2
    exit 1
}

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

# ── Start backend (web/api: uv-managed venv + Rust csp_solver wheel) ─
CORS_ORIGINS="http://localhost:$FRONTEND_PORT,http://localhost:5173" \
    uv run --directory web/api uvicorn app.main:app \
    --host 0.0.0.0 --port "$BACKEND_PORT" \
    --reload --reload-dir src &
PIDS+=($!)

# ── Start frontend (web/frontend: npm + Vite) ────────────
VITE_API_URL="http://localhost:$BACKEND_PORT" \
    npm --prefix web/frontend run dev -- --port "$FRONTEND_PORT" &
PIDS+=($!)

cat <<EOF

──────────────────────────────────────
  $PROJECT_NAME Dev Environment
──────────────────────────────────────
  Backend  → http://localhost:$BACKEND_PORT
  Frontend → http://localhost:$FRONTEND_PORT
──────────────────────────────────────

EOF

wait
