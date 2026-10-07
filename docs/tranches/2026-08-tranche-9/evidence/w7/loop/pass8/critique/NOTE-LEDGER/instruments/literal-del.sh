#!/bin/bash
# literal-del.sh : each reserve clause's test replaced by a literal false (or its off-branch) in the tf copy; --self-test bare; restored
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/lcrit8
FE=$SP/tf/web/frontend; F=$FE/scripts/check-ink-pressure.mjs; O=$SP/bin/cip.orig.mjs; LOG=$SP/logs/literal-deletions.txt
: > $LOG
cd $FE
del() { # name sed-expr
  cp $O $F; sed -i '' "$2" $F
  if cmp -s $O $F; then echo "[$1] VACUOUS edit" >> $LOG; return; fi
  node --check $F 2>>$LOG; c=$?
  node scripts/check-ink-pressure.mjs --self-test > $SP/logs/ld.out 2>&1; e=$?
  echo "[$1] node --check $c · --self-test exit $e · $(grep -m1 'note-reserve · ' $SP/logs/ld.out | cut -c1-200) · load $(uptime | sed 's/.*averages: //')" >> $LOG
}
del R1 's/if (on("R1") \&\& voice.length !== 1)/if (false \&\& voice.length !== 1)/'
del R2 's/if (on("R2") \&\& v !== "inherit")/if (false \&\& v !== "inherit")/'
del R3-important 's/if (on("R3-important") \&\& s.important)/if (false \&\& s.important)/'
del R3-seat 's/      on("R3-seat") \&\&/      false \&\&/'
del R4-every-site 's/const reserveSites = on("R4-every-site") ? block : block.filter/const reserveSites = false ? block : block.filter/'
del R4-consumer 's/const consumer = on("R4-consumer")/const consumer = false/'
cp $O $F; echo "restored $(cmp -s $O $F && echo equal)" >> $LOG; echo DONE >> $LOG
