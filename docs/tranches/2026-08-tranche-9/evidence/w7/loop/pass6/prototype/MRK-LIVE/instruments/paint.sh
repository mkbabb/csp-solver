#!/bin/bash
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklive-p6
cd $W
TAGP=${1:-lane-p5geom}
for prm in no-preference reduce; do
  MRKLIVE_PRM=$prm MRKLIVE_TAG=$TAGP npx playwright test -c .mrklive-p6/pw.probe.config.ts p6-paint --grep "P6-PAINT" > $S/paint-$TAGP-$prm.log 2>&1; echo "EXIT[$TAGP $prm] $?" >> $S/paint-exits.log
done
MRKLIVE_TAG=$TAGP npx playwright test -c .mrklive-p6/pw.probe.config.ts p6-paint --grep "LAW39" > $S/law39-$TAGP.log 2>&1; echo "EXIT[law39 $TAGP] $?" >> $S/paint-exits.log
if [ "$TAGP" = lane-p5geom ]; then
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4239 MRKLIVE_TAG=control-dist npx playwright test -c .mrklive-p6/pw.probe.config.ts p6-paint --grep "LAW39" > $S/law39-control.log 2>&1; echo "EXIT[law39 control] $?" >> $S/paint-exits.log
fi
echo "PAINT-DONE $TAGP" >> $S/paint-exits.log
