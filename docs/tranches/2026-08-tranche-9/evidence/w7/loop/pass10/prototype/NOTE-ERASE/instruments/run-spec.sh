#!/bin/bash
# run-spec.sh <frontend dir> <port> <label> <project chromium|webkit> [playwright args...]
# One guarded run per project (webkit: --exclusive webkit), workers 1, no webServer; exit written to logs/spec-<label>.exit, never piped.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE
F=$1 port=$2 label=$3 proj=$4; shift 4
mkdir -p $F/.erase10
cat > $F/.erase10/pw.config.ts <<CFG
import base from "../playwright.config.ts";
// NOTE-ERASE pass-10 scratch runner (never banked): the product config, no webServer, scratch output.
export default {
  ...base,
  testDir: "../e2e",
  testMatch: "**/e2e/affordances.spec.ts",
  globalSetup: "../e2e/global-setup.ts",
  webServer: undefined,
  workers: 1,
  timeout: 90000,
  outputDir: "$S/pw-out-$label",
};
CFG
EX=""; [ "$proj" = webkit ] && EX="--exclusive webkit"
Z0=$(tail -1 ~/.claude/guard/log/zone.log | grep -oE 'inuse=[0-9]+')
L0=$(uptime | sed 's/.*averages: //'); T0=$(date +%T)
(cd $F && PLAYWRIGHT_BASE_URL=http://127.0.0.1:$port ~/.claude/guard/guarded $EX --timeout 60 -- npx playwright test --config .erase10/pw.config.ts --project=$proj --workers=1 --reporter=list "$@" > $S/logs/spec-$label.log 2>&1); x=$?
echo "SPEC $label proj=$proj fe=$F port=$port served=$(curl -s --max-time 3 http://127.0.0.1:$port/ | grep -oE 'index-[A-Za-z0-9_-]+\.js' | head -1) exit=$x t0=$T0 t1=$(date +%T) load0=$L0 load1=$(uptime | sed 's/.*averages: //') zone0=$Z0 zone1=$(tail -1 ~/.claude/guard/log/zone.log | grep -oE 'inuse=[0-9]+')" > $S/logs/spec-$label.exit
