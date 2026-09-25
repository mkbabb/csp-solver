#!/bin/bash
# usage: pwjobs.sh <fe> <out> then lines "name|env|args" on stdin
FE="$1"; OUT="$2"; cd "$FE"
while IFS='|' read -r name envs args; do
  [ -z "$name" ] && continue
  t0=$(date +%s)
  env $envs PW_JSON="$OUT.$name.json" npx playwright test $args > "$OUT.$name.log" 2>&1
  ec=$?
  echo "$name EXIT $ec ($(( $(date +%s)-t0 ))s) load[$(uptime | sed 's/.*averages: //')] :: $(grep -E '^\s+[0-9]+ (passed|failed|skipped|flaky)' "$OUT.$name.log" | tr -s ' ' | tr '\n' ' ')" >> "$OUT"
done
echo DONE >> "$OUT"
