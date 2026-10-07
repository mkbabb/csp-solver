#!/bin/bash
# gates-src.sh <copy root> <tag> : the reserve law's browserless rows, each BARE, exit captured first
P=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger8/p8
cd $1/web/frontend || exit 9
O=$P/logs/src-$2.txt; echo "load $(uptime | sed 's/.*averages: //') $(date +%T) ink $(shasum scripts/check-ink-pressure.mjs | cut -c1-12) fc $(shasum scripts/check-font-coverage.mjs | cut -c1-12) lib $(shasum scripts/shape-census.mjs | cut -c1-12) MN $(shasum src/pencil/chrome/MarginNote.vue | cut -c1-12)" > $O
node scripts/check-ink-pressure.mjs --self-test --plants --sabotage-battery > $P/logs/src-$2-ink.log 2>&1; echo "lint:ink+plants+sabotage exit=$?" >> $O
node scripts/check-font-coverage.mjs --self-test > $P/logs/src-$2-fc.log 2>&1; echo "test:font-coverage exit=$?" >> $O
node scripts/shape-census.mjs --tree . > $P/logs/src-$2-tree.log 2>&1; echo "shape-census --tree exit=$?" >> $O
echo "DONE $(date +%T) load $(uptime | sed 's/.*averages: //')" >> $O
