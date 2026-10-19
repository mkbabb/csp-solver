#!/bin/bash
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-LEDGER
cd $S/hp/web/frontend; echo "load $(uptime | sed 's/.*averages: //')"
node scripts/shape-census.mjs --self-test --lib $S/h2/web/frontend/scripts/shape-census.mjs > $S/logs/hp-bornred.txt 2>&1; echo "born-RED (rows on homes v2) exit $?"
SHAPE_SABOTAGE=r4-unresolved node scripts/shape-census.mjs --self-test > $S/logs/hp-sab-r4u.txt 2>&1; echo "SHAPE_SABOTAGE=r4-unresolved exit $?"
node scripts/shape-census.mjs --tree $S/wL/web/frontend > $S/logs/hp-tree-union.txt 2>&1; echo "--tree union(wL) exit $?"
echo DONE
