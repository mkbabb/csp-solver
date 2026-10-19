#!/bin/bash
# lints.sh <label> <frontend dir>: the browserless battery, bare exits from files. no rm, no set -e
S=<SCRATCH>
cd $2
for r in "copy:scripts/check-copy-register.mjs --self-test" "ink:scripts/check-ink-pressure.mjs --self-test" "motion:scripts/check-motion-contract.mjs --self-test" "lanes:scripts/check-lane-membership.mjs --self-test" "fontcov:scripts/check-font-coverage.mjs --self-test" "projects:scripts/check-pw-projects.mjs --self-test" "census:scripts/shape-census.mjs --self-test"; do
  n=${r%%:*}; c=${r#*:}
  # check-pw-projects runs `git rev-parse` (its sha stamp): never in the control tree
  if [ "$1" = control ] && [ "$n" = projects ]; then echo "lint $1 $n NOT RUN (git in the control tree)"; continue; fi
  GIT_CEILING_DIRECTORIES=$S node $c > $S/logs/lint-$1-$n.log 2>&1; echo $? > $S/logs/lint-$1-$n.exit
  echo "lint $1 $n exit $(cat $S/logs/lint-$1-$n.exit)"
done
GIT_CEILING_DIRECTORIES=$S npx knip > $S/logs/lint-$1-knip.log 2>&1; echo $? > $S/logs/lint-$1-knip.exit; echo "lint $1 knip exit $(cat $S/logs/lint-$1-knip.exit)"
GIT_CEILING_DIRECTORIES=$S npx prettier --check e2e/count-yield.spec.ts e2e/wash-step.spec.ts scripts/check-theme-tokens.mjs src/pencil/sheet/SheetWashiLabel.vue src/games/shared/DifficultyTally.vue src/pencil/grid/gridPaths.ts > $S/logs/lint-$1-prettier.log 2>&1; echo $? > $S/logs/lint-$1-prettier.exit; echo "lint $1 prettier exit $(cat $S/logs/lint-$1-prettier.exit)"
GIT_CEILING_DIRECTORIES=$S npx eslint scripts/check-theme-tokens.mjs src/pencil/sheet/SheetWashiLabel.vue src/games/shared/DifficultyTally.vue src/pencil/grid/gridPaths.ts > $S/logs/lint-$1-eslint.log 2>&1; echo $? > $S/logs/lint-$1-eslint.exit; echo "lint $1 eslint exit $(cat $S/logs/lint-$1-eslint.exit)"
echo LINTS-DONE $1
