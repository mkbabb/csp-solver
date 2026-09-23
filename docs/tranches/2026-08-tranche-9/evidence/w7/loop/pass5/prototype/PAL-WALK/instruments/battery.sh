#!/bin/zsh
# registry-v4 §2.11's estate battery, each bare (exit unpiped), on the frontend dir given.
D=$1; tag=$2; out=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend/.palwalk5/logs/battery-$tag
mkdir -p $out; cd $D || exit 1
run() { local n=$1; shift; "$@" > $out/$n.log 2>&1; printf "%-22s exit %s\n" "$n" "$?" >> $out/summary.txt; }
: > $out/summary.txt
run lint-lanes node scripts/check-lane-membership.mjs --self-test
run lint-theme-tokens node scripts/check-theme-tokens.mjs --self-test
run lint-sleep node scripts/check-sleep-lint.mjs --self-test
run test-e2e-projects node scripts/check-pw-projects.mjs --self-test
run check-pw-projects node scripts/check-pw-projects.mjs
run lint-arcs node scripts/check-peer-arcs.mjs --self-test
run lint-copy node scripts/check-copy-register.mjs --self-test
run lint-motion node scripts/check-motion-contract.mjs --self-test
run lint-theme-selectors node scripts/check-theme-selectors.mjs --self-test
run lint-ink node scripts/check-ink-pressure.mjs --self-test
run lint-catch node scripts/check-empty-catch.mjs --self-test
run lint-live-regions node scripts/check-live-regions.mjs --self-test
run knip npx knip
run prettier-check npx prettier --check --config .prettierrc.json src/ scripts/ ../../scripts/ ../relay/
run eslint-dot npx eslint .
echo BATTERY_DONE >> $out/summary.txt
