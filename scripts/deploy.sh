#!/usr/bin/env bash
# Deploy csp-solver to a remote host: SSH in, git pull, rebuild + restart the
# prod compose stack.
#
# DEPLOY_HOST has NO default. The legacy target (mbabb.fridayinstitute.net /
# mbabb.friday.institute:1022) is NXDOMAIN-dead — silently falling back to it
# is exactly the failure mode this script refuses. Supply the real target
# explicitly via --host or $DEPLOY_HOST.
set -euo pipefail

usage() {
    cat <<'EOF'
Usage: deploy.sh --host <host> [options]

Required:
  --host <host>        Target host to deploy to. (env: DEPLOY_HOST)
                        No default — the legacy host is NXDOMAIN-dead.

Options:
  --port <port>        SSH port.                  (env: DEPLOY_PORT, default: 22)
  --user <user>        SSH user.                   (env: DEPLOY_USER, default: mbabb)
  --path <path>        Remote repo path.           (env: DEPLOY_PATH, default: /var/www/csp-solver)
  --branch <branch>    Branch to deploy.           (env: BRANCH, default: master)
  -h, --help            Show this help and exit.
EOF
}

DEPLOY_HOST="${DEPLOY_HOST:-}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"
DEPLOY_USER="${DEPLOY_USER:-mbabb}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/csp-solver}"
BRANCH="${BRANCH:-master}"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --host) DEPLOY_HOST="$2"; shift 2 ;;
        --port) DEPLOY_PORT="$2"; shift 2 ;;
        --user) DEPLOY_USER="$2"; shift 2 ;;
        --path) DEPLOY_PATH="$2"; shift 2 ;;
        --branch) BRANCH="$2"; shift 2 ;;
        -h|--help) usage; exit 0 ;;
        *) echo "ERROR: unknown argument: $1" >&2; usage >&2; exit 1 ;;
    esac
done

if [[ -z "$DEPLOY_HOST" ]]; then
    echo "ERROR: no deploy target configured." >&2
    echo "  DEPLOY_HOST is unset and --host was not given." >&2
    echo "  There is no default host: the legacy target" >&2
    echo "  (mbabb.fridayinstitute.net / mbabb.friday.institute:1022) is NXDOMAIN-dead." >&2
    echo "  Pass --host <host> or export DEPLOY_HOST=<host>." >&2
    exit 1
fi

echo "Deploying to ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PORT}..."
echo "Path: ${DEPLOY_PATH}"
echo "Branch: ${BRANCH}"
echo ""

# The heredoc is deliberately unquoted: DEPLOY_PATH/BRANCH are interpolated
# client-side before the script is shipped over SSH, so the remote shell
# never has to know them as env vars.
# shellcheck disable=SC2087
ssh -p "${DEPLOY_PORT}" "${DEPLOY_USER}@${DEPLOY_HOST}" << ENDSSH
  set -euo pipefail
  cd "${DEPLOY_PATH}"

  echo "Pulling latest code..."
  git pull origin "${BRANCH}"

  echo "Building containers..."
  docker compose -f docker-compose.yml -f docker-compose.prod.yml build

  echo "Restarting services..."
  docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

  echo "Cleaning up old images..."
  docker image prune -f

  echo "Deployment complete!"
  docker compose ps
ENDSSH
