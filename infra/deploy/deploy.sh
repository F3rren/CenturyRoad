#!/usr/bin/env bash
# Rebuilds and restarts the production stack from the current checkout, and fails loudly if it
# does not come up healthy. Run it on the server:
#
#     ./infra/deploy/deploy.sh
#
# The deploy workflow runs it after fast-forwarding the checkout to the commit CI verified.
# It does not pull by itself: a script that rewrites its own file while bash is still reading
# it can misbehave, so updating the checkout is the caller's job.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/../.."

COMPOSE=(docker compose -f compose-prod.yml)

if [ ! -f .env ]; then
  echo "deploy: no .env in $(pwd) - copy .env.example to .env and fill it in first" >&2
  exit 1
fi

echo "deploy: commit $(git rev-parse --short HEAD 2>/dev/null || echo unknown)"

# --wait returns only once every service is running and every healthcheck has passed, and exits
# non-zero if one turns unhealthy or the timeout runs out. A broken build or a bad secret
# therefore fails here, with the logs below, instead of showing up later as a 502.
if ! "${COMPOSE[@]}" up -d --build --remove-orphans --wait --wait-timeout 300; then
  echo "deploy: the stack did not come up healthy" >&2
  "${COMPOSE[@]}" ps >&2 || true
  "${COMPOSE[@]}" logs --tail 40 >&2 || true
  exit 1
fi

# Each deploy leaves the previous images and build cache behind, and the disk is small.
# Dangling images and week-old cache only: nothing a running container or the next build needs.
docker image prune -f > /dev/null
docker builder prune -f --filter "until=168h" > /dev/null

echo "deploy: done"
