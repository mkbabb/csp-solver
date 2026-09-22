#!/bin/zsh
# PAL-WALK pass 4 · the mechanical censuses, bare, one line each (exit code unpiped).
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend || exit 1
run() { local n=$1; shift; "$@" > .pal-walk/census-$(echo $n | tr ' :/' '___').log 2>&1; printf "%-40s exit %s\n" "$n" "$?"; }
run "lint:arcs (check-peer-arcs --self-test)" node scripts/check-peer-arcs.mjs --self-test
run "lint:lanes (check-lane-membership)" node scripts/check-lane-membership.mjs
run "lint:copy (check-copy-register)" node scripts/check-copy-register.mjs
run "check-copy-register --self-test" node scripts/check-copy-register.mjs --self-test
run "lint:motion (check-motion-contract)" node scripts/check-motion-contract.mjs
run "check-pw-projects" node scripts/check-pw-projects.mjs
run "lint:theme-tokens --self-test" node scripts/check-theme-tokens.mjs --self-test
run "lint:theme-selectors --self-test" node scripts/check-theme-selectors.mjs --self-test
run "lint:ink --self-test" node scripts/check-ink-pressure.mjs --self-test
run "lint:catch --self-test" node scripts/check-empty-catch.mjs --self-test
run "lint:live-regions" npm run -s lint:live-regions
run "lint:sleep" npm run -s lint:sleep
run "knip" npx knip
run "eslint src scripts e2e" npx eslint src scripts e2e
run "prettier --check src scripts" npx prettier --check src scripts
run "vue-tsc -b" npx vue-tsc -b
run "vue-tsc -p tsconfig.e2e.json" npx vue-tsc -p tsconfig.e2e.json --noEmit
echo CENSUS_DONE
