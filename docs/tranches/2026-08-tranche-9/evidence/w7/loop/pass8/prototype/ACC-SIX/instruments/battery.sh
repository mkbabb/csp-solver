#!/bin/bash
# battery.sh <label> <dir> [gates...] : every gate bare in <dir>/web/frontend, exit codes recorded (no pipes on the gate)
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/six8
label=$1; dir=$2; shift 2
cd $dir/web/frontend || exit 9
run(){ name=$1; shift; t0=$(date +%s); "$@" > $S/logs/bat-$label-$name.log 2>&1; rc=$?; echo "BAT $label $name exit $rc $(( $(date +%s)-t0 ))s load $(uptime | sed 's/.*averages: //' | cut -d' ' -f1)"; }
GATES=${GATES:-"vuetsc tce2e vt-pencil vt-composables vt-games eslint prettier knip lanes themetokens sleep motion copy ink projects fontcov"}
for g in $GATES; do case $g in
  vuetsc) run vuetsc npx vue-tsc -b ;;
  tce2e) run tce2e npx vue-tsc --noEmit -p tsconfig.e2e.json ;;
  vt-pencil) run vt-pencil npx vitest run src/pencil ;;
  vt-composables) run vt-composables npx vitest run src/composables ;;
  vt-games) run vt-games npx vitest run src/games ;;
  eslint) run eslint npx eslint . --max-warnings 0 ;;
  prettier) run prettier npx prettier --check --config .prettierrc.json src/ scripts/ ../../scripts/ ../relay/ ;;
  knip) run knip npx knip ;;
  lanes) run lanes node scripts/check-lane-membership.mjs --self-test ;;
  themetokens) run themetokens node scripts/check-theme-tokens.mjs --self-test ;;
  sleep) run sleep node scripts/check-sleep-lint.mjs --self-test ;;
  motion) run motion node scripts/check-motion-contract.mjs --self-test ;;
  copy) run copy node scripts/check-copy-register.mjs --self-test ;;
  ink) run ink node scripts/check-ink-pressure.mjs --self-test ;;
  projects) run projects node scripts/check-pw-projects.mjs --self-test ;;
  fontcov) run fontcov node scripts/check-font-coverage.mjs --self-test ;;
  verbs) run verbs node scripts/check-pencil-verbs.mjs --self-test ;;
  bands) run bands node scripts/check-motion-bands.mjs --self-test ;;
  propblock) run propblock node scripts/check-property-block.mjs --self-test ;;
  census) run census node scripts/shape-census.mjs --self-test ;;
esac; done
echo "BATDONE $label"
