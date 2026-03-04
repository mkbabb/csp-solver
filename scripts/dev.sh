#!/usr/bin/env bash
# Start frontend and ensure API proxy points at a healthy backend.
# Usage:
#   ./scripts/dev.sh                 # auto: reuse healthy backend, or start one locally
#   ./scripts/dev.sh --full          # always start a local backend
#   ./scripts/dev.sh --frontend-only # never start backend

set -euo pipefail
cd "$(dirname "$0")/.."

# Find the closest available port starting from $1
find_port() {
  local port=$1
  while lsof -iTCP:"$port" -sTCP:LISTEN &>/dev/null; do
    ((port++))
  done
  echo "$port"
}

is_backend_healthy() {
  local base_url=$1
  curl -fsS --max-time 2 "${base_url%/}/api/v1/health" >/dev/null 2>&1
}

MODE="${1:-auto}"
FRONTEND_PORT=$(find_port 3000)
DEFAULT_API_URL="${VITE_API_URL:-http://localhost:8000}"
START_BACKEND=0
BACKEND_PORT=""
BACKEND_URL="$DEFAULT_API_URL"

cleanup() {
  trap - EXIT INT TERM
  echo ""
  echo "Shutting down…"
  kill 0 2>/dev/null
  wait 2>/dev/null
}
trap cleanup EXIT INT TERM

case "$MODE" in
  --full)
    START_BACKEND=1
    BACKEND_PORT=$(find_port 8000)
    BACKEND_URL="http://localhost:$BACKEND_PORT"
    ;;
  --frontend-only)
    if ! is_backend_healthy "$BACKEND_URL"; then
      echo "Warning: backend health check failed at $BACKEND_URL"
      echo "         API requests from frontend will fail until backend is running."
    fi
    ;;
  auto|"")
    if is_backend_healthy "$BACKEND_URL"; then
      echo "Using existing backend → $BACKEND_URL"
    else
      START_BACKEND=1
      BACKEND_PORT=$(find_port 8000)
      BACKEND_URL="http://localhost:$BACKEND_PORT"
      echo "No healthy backend at $DEFAULT_API_URL; starting local backend at $BACKEND_URL"
    fi
    ;;
  *)
    echo "Unknown option: $MODE"
    echo "Usage: ./scripts/dev.sh [--full|--frontend-only]"
    exit 1
    ;;
esac

if [[ "$START_BACKEND" -eq 1 ]]; then
  echo "Backend  → http://localhost:$BACKEND_PORT"
  echo "Frontend → http://localhost:$FRONTEND_PORT  (proxying /api → :$BACKEND_PORT)"
  (cd backend && uv run uvicorn csp_solver.api.main:app --reload --port "$BACKEND_PORT") &
  (cd frontend && VITE_API_URL="$BACKEND_URL" VITE_API_PORT="$BACKEND_PORT" npx vite --port "$FRONTEND_PORT" --strictPort) &
else
  echo "Frontend → http://localhost:$FRONTEND_PORT  (proxying /api → $BACKEND_URL)"
  (cd frontend && VITE_API_URL="$BACKEND_URL" npx vite --port "$FRONTEND_PORT" --strictPort) &
fi

wait
