#!/bin/bash
# pw.sh <label> <url> <project> <spec> [grep]
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verbcrit8
F=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend
L=$1; U=$2; P=$3; SPEC=$4; G=$5
LOG=$S/logs/pw-$L.log
echo "load $(sysctl -n vm.loadavg) url $U $(curl -s $U/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1) project $P spec $SPEC grep ${G:-none}" > $LOG
cd $F
if [ -n "$G" ]; then
  PW_OUT=$S/pw-out-$L PLAYWRIGHT_BASE_URL=$U npx playwright test --config $S/pw.config.ts --project=$P $SPEC --grep "$G" --workers ${W:-2} --repeat-each ${REPEAT:-1} >> $LOG 2>&1
else
  PW_OUT=$S/pw-out-$L PLAYWRIGHT_BASE_URL=$U npx playwright test --config $S/pw.config.ts --project=$P $SPEC --workers ${W:-2} --repeat-each ${REPEAT:-1} >> $LOG 2>&1
fi
echo "EXIT $?" >> $LOG
