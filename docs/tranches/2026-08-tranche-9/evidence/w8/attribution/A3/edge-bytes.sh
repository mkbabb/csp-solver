#!/usr/bin/env bash
# run: bash edge-bytes.sh    (GET with br+gzip; prints wire bytes per asset as JSONL)
set -u
BASE=https://sudoku.babb.dev
for p in "$@"; do
  curl -sS --compressed -o /dev/null -H 'Accept-Encoding: gzip' \
    -w '{"path":"'"$p"'","wire_bytes":%{size_download},"http":%{response_code},"ttfb_s":%{time_starttransfer},"total_s":%{time_total}}\n' "$BASE$p"
done
