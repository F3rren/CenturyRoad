#!/usr/bin/env bash
# Dumps the production Postgres to a file, checks that the file can be read back, and removes
# dumps older than BACKUP_KEEP_DAYS. Run it on the server, from cron (see the README):
#
#     ./infra/backup/backup.sh
#
#   BACKUP_DIR        where the dumps go        (default: $HOME/backups/century-road)
#   BACKUP_KEEP_DAYS  how many days to keep     (default: 14)
#
# The dump is taken inside the db container, over its own local socket and with the
# credentials that container already has, so no password is read from .env or put on a
# command line here. It is a pg_dump custom-format archive: restore it with pg_restore.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/../.."

BACKUP_DIR="${BACKUP_DIR:-$HOME/backups/century-road}"
KEEP_DAYS="${BACKUP_KEEP_DAYS:-14}"
COMPOSE=(docker compose -f compose-prod.yml)

if [[ ! "$KEEP_DAYS" =~ ^[0-9]+$ ]]; then
  echo "backup: BACKUP_KEEP_DAYS must be a whole number of days, got '$KEEP_DAYS'" >&2
  exit 1
fi

# The dump holds every user's email and password hash: readable by this user only.
umask 077
mkdir -p "$BACKUP_DIR"

final="$BACKUP_DIR/century-road-$(date -u +%Y%m%dT%H%M%SZ).dump"
partial="$final.partial"
trap 'rm -f "$partial"' EXIT

# The single quotes are deliberate: POSTGRES_USER and POSTGRES_DB must be expanded by the shell
# inside the container, where they are set, not by this one.
# shellcheck disable=SC2016
"${COMPOSE[@]}" exec -T db sh -c \
  'pg_dump --format=custom --no-owner --no-privileges -U "$POSTGRES_USER" "$POSTGRES_DB"' \
  > "$partial"

# An empty or truncated dump is worse than none, because it looks like a backup. Listing the
# archive reads its table of contents, which fails on a file that was cut short.
if [ ! -s "$partial" ]; then
  echo "backup: the dump is empty" >&2
  exit 1
fi
"${COMPOSE[@]}" exec -T db pg_restore --list < "$partial" > /dev/null

mv "$partial" "$final"
echo "backup: wrote $final ($(du -h "$final" | cut -f1))"

# Only after a good new dump, so a run of failures never empties the folder.
find "$BACKUP_DIR" -maxdepth 1 -name 'century-road-*.dump' -mtime +"$KEEP_DAYS" -delete
