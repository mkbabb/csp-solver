#!/usr/bin/env bash
# vitest chunked by directory on the tree archive; each chunk bare, exit recorded. No deletes.
FE="$1"; OUT="$2"; mkdir -p "$OUT"; cd "$FE" || exit 9
for d in src/pencil src/composables src/probe src/games; do
  npx vitest run "$d" > "$OUT/vitest-$(basename $d).log" 2>&1
  code=$?
  echo "vitest $d exit $code $(grep -E 'Test Files|Tests ' "$OUT/vitest-$(basename $d).log" | tr -s ' ' | tr '\n' ' ')" >> "$OUT/vitest-exits.txt"
done
echo "VITEST DONE load $(uptime | sed 's/.*averages: //')" >> "$OUT/vitest-exits.txt"
