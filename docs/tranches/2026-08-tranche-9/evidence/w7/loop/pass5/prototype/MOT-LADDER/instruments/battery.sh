#!/usr/bin/env bash
# MOT-LADDER pass 5 · the pre-return battery (registry-v4 §2.11), each gate BARE, the exit code
# captured unpiped; run once on the tree and once on the read-only control. Usage: battery.sh <web/frontend> <label>
F="$1"; L="$2"; cd "$F" || exit 2
row() { local name="$1"; shift; "$@" > "/tmp/mlb-bat-$L-$name.log" 2>&1; local rc=$?; printf '%-26s %s\n' "$name" "$rc"; }
row lint-bands-BARE          node scripts/check-motion-bands.mjs --self-test
row lint-bands-B8_OWNED      env MOTION_LADDER_B8_OWNED=1 node scripts/check-motion-bands.mjs --self-test
row lint-verbs               sh -c 'node scripts/publish-verbs.mjs --check && node scripts/check-pencil-verbs.mjs --self-test'
row lint-motion              node scripts/check-motion-contract.mjs --self-test
row lint-copy                node scripts/check-copy-register.mjs --self-test
row lint-lanes               node scripts/check-lane-membership.mjs --self-test
row lint-theme-tokens        node scripts/check-theme-tokens.mjs --self-test
row lint-sleep               node scripts/check-sleep-lint.mjs --self-test
row test-e2e-projects        node scripts/check-pw-projects.mjs --self-test
row eslint                   npx eslint .
row prettier-check           npx prettier --check --config .prettierrc.json src/ scripts/ ../../scripts/ ../relay/
row lint-knip                npx knip
row lint-ink                 node scripts/check-ink-pressure.mjs --self-test
row lint-catch               node scripts/check-empty-catch.mjs --self-test
row lint-theme-selectors     node scripts/check-theme-selectors.mjs --self-test
row lint-live-regions        node scripts/check-live-regions.mjs --self-test
row lint-tdz                 node scripts/tdz-probe.mjs --self-test
row lint-boundary            npx eslint --no-config-lookup --config eslint.boundary.config.js src/games
row audit-high               npm audit --audit-level=high
