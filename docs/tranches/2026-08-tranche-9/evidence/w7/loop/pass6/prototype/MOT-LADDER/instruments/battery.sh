#!/usr/bin/env bash
# MOT-LADDER pass 6 · the pre-return battery (registry-v4 §2.11 + LAWS P5), each row BARE (exit
# code unpiped), on the tree and on the read-only control. Usage: battery.sh <tree fe> <control fe> <log dir>
T="$1"; C="$2"; L="$3"; mkdir -p "$L"
rows=(
  "lint:bands|npm run --silent lint:bands"
  "lint:verbs|npm run --silent lint:verbs"
  "lint:motion|npm run --silent lint:motion"
  "lint:copy|npm run --silent lint:copy"
  "lint:lanes|npm run --silent lint:lanes"
  "lint:theme-tokens|npm run --silent lint:theme-tokens"
  "lint:sleep|npm run --silent lint:sleep"
  "test:e2e:projects|npm run --silent test:e2e:projects"
  "check-pw-projects (bare)|node scripts/check-pw-projects.mjs"
  "eslint .|npx eslint ."
  "npm run lint (scoped prettier)|npm run --silent lint"
  "lint:knip|npm run --silent lint:knip"
)
printf "%-32s %6s %9s\n" row tree control
for r in "${rows[@]}"; do
  name="${r%%|*}"; cmd="${r#*|}"; slug=$(echo "$name" | tr -c 'A-Za-z0-9' '_')
  (cd "$T" && eval "$cmd") > "$L/bat-tree-$slug.log" 2>&1; a=$?
  (cd "$C" && eval "$cmd") > "$L/bat-control-$slug.log" 2>&1; b=$?
  printf "%-32s %6s %9s\n" "$name" "$a" "$b"
done
