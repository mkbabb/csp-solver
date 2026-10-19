#!/bin/bash
# unit-motion.sh <label> <frontend dir> — the motion unit file only; exit to logs/unit-<label>.exit
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-ERASE
(cd $2 && npx vitest run src/pencil/chrome/marginNote.motion.test.ts > $S/logs/unit-$1.log 2>&1); echo "UNIT $1 exit=$? load=$(uptime | sed 's/.*averages: //')" > $S/logs/unit-$1.exit
