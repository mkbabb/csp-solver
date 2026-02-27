#!/usr/bin/env bash
set -euo pipefail

# Deployment configuration (override via environment variables)
DEPLOY_HOST="${DEPLOY_HOST:-mbabb.fridayinstitute.net}"
DEPLOY_PORT="${DEPLOY_PORT:-1022}"
DEPLOY_USER="${DEPLOY_USER:-mbabb}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/csp-solver}"
BRANCH="${BRANCH:-master}"

echo "Deploying to ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PORT}..."
echo "Path: ${DEPLOY_PATH}"
echo "Branch: ${BRANCH}"
echo ""

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
