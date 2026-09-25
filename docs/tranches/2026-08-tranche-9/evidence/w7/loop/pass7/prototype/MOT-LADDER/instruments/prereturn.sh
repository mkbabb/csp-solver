#!/usr/bin/env bash
# MOT-LADDER pass 7 · the pre-return battery (registry-v4 §2.11 + LAWS P6 §F), each row BARE (exit
# code unpiped), on the tree and on the read-only control. Usage: prereturn.sh <tree fe> <control fe> <log dir> <tree dist> <control dist>
T="$1"; C="$2"; L="$3"; TD="$4"; CD="$5"; I=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ladder7-instr
mkdir -p "$L"
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
  "check-property-block (source+dist)|node $I/check-property-block.mjs --fe . --dist \$DIST"
  "check-property-block --self-test|node $I/check-property-block.mjs --fe . --self-test"
  "undefined-token census --self-test|FE=. node $I/undefined-token-census.mjs --self-test"
  "eslint .|npx eslint ."
  "npm run lint (prettier src/ scripts/ ../../scripts/ ../relay/)|npm run --silent lint"
  "lint:knip|npm run --silent lint:knip"
)
printf "%-64s %6s %9s\n" row tree control
for r in "${rows[@]}"; do
  name="${r%%|*}"; cmd="${r#*|}"; slug=$(echo "$name" | tr -c 'A-Za-z0-9' '_')
  (cd "$T" && DIST="$TD" eval "$cmd") > "$L/bat-tree-$slug.log" 2>&1; a=$?
  (cd "$C" && DIST="$CD" eval "$cmd") > "$L/bat-control-$slug.log" 2>&1; b=$?
  printf "%-64s %6s %9s\n" "$name" "$a" "$b"
done
