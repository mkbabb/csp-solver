#!/bin/bash
# run-spec2.sh <frontend dir> <port> <label> [playwright args…] — that dir's affordances.spec.ts against :port.
# The exit is written by this script to logs/spec-<label>.exit (never piped); the log is logs/spec-<label>.log.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-ERASE
F=$1 port=$2 label=$3; shift 3
mkdir -p $F/.erase9
cat > $F/.erase9/pw.config.ts <<CFG
import base from "../playwright.config.ts";
// NOTE-ERASE pass-9 scratch runner (never banked): the product config, no webServer, scratch output.
export default {
  ...base,
  testDir: "../e2e",
  testMatch: "**/e2e/affordances.spec.ts",
  globalSetup: "../e2e/global-setup.ts",
  webServer: undefined,
  workers: 2,
  timeout: 90000,
  outputDir: "$S/pw-out-$label",
};
CFG
L0=$(uptime | sed 's/.*averages: //')
(cd $F && PLAYWRIGHT_BASE_URL=http://127.0.0.1:$port npx playwright test --config .erase9/pw.config.ts --reporter=list "$@" > $S/logs/spec-$label.log 2>&1); x=$?
echo "SPEC $label fe=$F port=$port exit=$x load0=$L0 load1=$(uptime | sed 's/.*averages: //')" > $S/logs/spec-$label.exit
