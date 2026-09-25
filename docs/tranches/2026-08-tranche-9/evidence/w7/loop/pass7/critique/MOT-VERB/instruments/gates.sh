#!/bin/bash
# gates.sh <frontend dir> <tag> — the source gates, each bare, exit captured first
FE=$1; T=$2; L=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verbcrit7/logs
cd $FE
node scripts/check-motion-bands.mjs --self-test > $L/$T-bands.log 2>&1; b=$?
node scripts/check-theme-tokens.mjs --self-test > $L/$T-tokens.log 2>&1; t=$?
node scripts/check-motion-contract.mjs --self-test > $L/$T-motion.log 2>&1; m=$?
node scripts/check-copy-register.mjs --self-test > $L/$T-copy.log 2>&1; c=$?
( node scripts/publish-verbs.mjs --check && node scripts/check-pencil-verbs.mjs --self-test ) > $L/$T-verbs.log 2>&1; v=$?
node scripts/check-lane-membership.mjs --self-test > $L/$T-lanes.log 2>&1; ln=$?
node scripts/check-sleep-lint.mjs --self-test > $L/$T-sleep.log 2>&1; s=$?
echo "GATES $T bands $b tokens $t motion $m copy $c verbs $v lanes $ln sleep $s"
