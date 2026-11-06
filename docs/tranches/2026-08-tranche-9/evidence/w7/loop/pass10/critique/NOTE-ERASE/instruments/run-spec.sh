#!/bin/bash
# run-spec.sh <frontend dir> <port> <dist> <vite cfg> <label> <project> [pw args] — the preview is the run's own webServer inside ONE guarded call.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-NOTE-ERASE
F=$1 port=$2 dist=$3 vcfg=$4 label=$5 proj=$6; shift 6
holder=$(lsof -nP -iTCP:$port -sTCP:LISTEN -t 2>/dev/null); if [ -n "$holder" ]; then echo "SPEC $label PORT $port HELD by $holder - a sibling's, not run" > $S/logs/spec-$label.exit; exit 3; fi
mkdir -p $F/.crit10
cat > $F/.crit10/pw.config.ts <<CFG
import base from "../playwright.config.ts";
// crit-NOTE-ERASE pass-10 scratch runner (never banked)
export default { ...base, testDir: "../e2e", testMatch: "**/e2e/affordances.spec.ts", globalSetup: "../e2e/global-setup.ts",
  webServer: { command: "npx vite preview --config $vcfg --outDir $dist --host 127.0.0.1 --port $port --strictPort", cwd: "${SERVE_CWD:-$F}", url: "http://127.0.0.1:$port/", reuseExistingServer: false, timeout: 120000 },
  workers: 1, timeout: 90000, outputDir: "$S/pw-out-$label" };
CFG
EX=""; [ "$proj" = webkit ] && EX="--exclusive webkit"
Z0=$(tail -1 ~/.claude/guard/log/zone.log | grep -oE 'inuse=[0-9]+'); L0=$(uptime | sed 's/.*averages: //'); T0=$(date +%T)
(cd $F && PLAYWRIGHT_BASE_URL=http://127.0.0.1:$port ~/.claude/guard/guarded $EX --timeout 60 -- npx playwright test --config .crit10/pw.config.ts --project=$proj --workers=1 --reporter=list "$@" > $S/logs/spec-$label.log 2>&1); x=$?
echo "SPEC $label proj=$proj fe=$F port=$port dist=$(ls $dist/assets | grep -E '^index-.*\.js$') css=$(wc -c < $(ls $dist/assets/index-*.css | head -1) | tr -d ' ')B exit=$x t0=$T0 t1=$(date +%T) load0=$L0 load1=$(uptime | sed 's/.*averages: //') zone0=$Z0 zone1=$(tail -1 ~/.claude/guard/log/zone.log | grep -oE 'inuse=[0-9]+')" > $S/logs/spec-$label.exit
