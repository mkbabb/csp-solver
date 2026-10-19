#!/bin/bash
# PAL-TIN pass 9 · the node battery, bare; each exit written by the run itself to its own file. No rm, no set -e.
S=$SCRATCH
FE=$WORKTREES/wf_308fa864-c94-2/web/frontend
D=$S/dist-tree
O=$S/logs/final; mkdir -p $O
cd $FE || exit 9
echo "gate $(shasum scripts/check-peer-tin.mjs | cut -c1-8) · library $(shasum scripts/shape-census.mjs | cut -c1-8) · spec $(shasum e2e/peer-tin.spec.ts | cut -c1-8) · start $(date +%T) · load $(uptime | sed 's/.*averages*: //')" > $O/HEAD.txt
row() { local n=$1; shift; local t0=$(date +%s); "$@" > $O/$n.txt 2>&1; echo $? > $O/$n.exit; echo "$n exit $(cat $O/$n.exit) · $(( $(date +%s) - t0 )) s · load $(uptime | sed 's/.*averages*: //')" >> $O/HEAD.txt; }
row gate node scripts/check-peer-tin.mjs
row gate-dist node scripts/check-peer-tin.mjs --dist $D
row self-test node scripts/check-peer-tin.mjs --self-test
row self-test-dist node scripts/check-peer-tin.mjs --self-test --dist $D
row lint-tin npm run lint:tin
row copy-register node scripts/check-copy-register.mjs
row copy-register-st node scripts/check-copy-register.mjs --self-test
row lib-self-test node scripts/shape-census.mjs --self-test
row threshold-dist node scripts/check-peer-tin.mjs --threshold-battery --dist $D
row sabotage-dist node scripts/check-peer-tin.mjs --sabotage-battery --dist $D
echo "end $(date +%T)" >> $O/HEAD.txt
echo done > $O/DONE
