#!/bin/bash
# gates.sh <label> <frontend dir> - browserless gates, each bare, its exit written to logs/gates-<label>.txt
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE
n=$1 F=$2; O=$S/logs/gates-$n.txt; : > $O
g() { local name=$1; shift; (cd $F && ~/.claude/guard/guarded --light --timeout 10 -- "$@" > $S/logs/gate-$n-$name.log 2>&1); echo "$name exit=$? $(tail -1 $S/logs/gate-$n-$name.log | cut -c1-150)" >> $O; }
g vue-tsc npx vue-tsc -b --force
g typecheck-e2e npx vue-tsc --noEmit -p tsconfig.e2e.json
g eslint npx eslint src/pencil/chrome/MarginNote.vue src/pencil/chrome/marginNote.motion.test.ts e2e/affordances.spec.ts scripts/check-theme-tokens.mjs
g vitest-motion npx vitest run --maxWorkers=2 src/pencil/chrome/marginNote.motion.test.ts
g prettier npx prettier --check --config .prettierrc.json src/pencil/chrome/MarginNote.vue src/pencil/chrome/marginNote.motion.test.ts scripts/check-theme-tokens.mjs
g knip npx knip
g lint-sleep node scripts/check-sleep-lint.mjs --self-test
g lint-copy node scripts/check-copy-register.mjs --self-test
g lint-ink node scripts/check-ink-pressure.mjs --self-test
g lint-theme-tokens node scripts/check-theme-tokens.mjs --self-test
g lint-motion node scripts/check-motion-contract.mjs --self-test
g lint-live-regions node scripts/check-live-regions.mjs --self-test
g shape-self node scripts/shape-census.mjs --self-test
echo "FIN $(date +%T)" >> $O
