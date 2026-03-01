#!/usr/bin/env bash
# Start frontend (+ optional backend) dev servers on the closest available ports.
# Usage: ./scripts/dev [--full]   (--full includes the backend)

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

FRONTEND_PORT=$(find_port 3000)
BACKEND_PORT=$(find_port 8000)

cleanup() {
  echo ""
  echo "Shutting down…"
  kill 0 2>/dev/null
  wait 2>/dev/null
}
trap cleanup EXIT INT TERM

if [[ "${1:-}" == "--full" ]]; then
  echo "Backend  → http://localhost:$BACKEND_PORT"
  echo "Frontend → http://localhost:$FRONTEND_PORT  (proxying /api → :$BACKEND_PORT)"
  (cd backend && uv run uvicorn csp_solver.api.main:app --reload --port "$BACKEND_PORT") &
  (cd frontend && VITE_API_PORT=$BACKEND_PORT npx vite --port "$FRONTEND_PORT" --strictPort) &
else
  echo "Frontend → http://localhost:$FRONTEND_PORT"
  (cd frontend && npx vite --port "$FRONTEND_PORT" --strictPort) &
fi

wait
