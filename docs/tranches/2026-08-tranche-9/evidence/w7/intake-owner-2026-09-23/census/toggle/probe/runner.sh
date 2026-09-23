#!/bin/zsh
# census:toggle matrix — interleaved main(4251)/verb(4259), sequential
cd /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ct
run() { # name port engine vp scheme prm touch shots
  echo "$(date +%T) start $1" >> matrix.log
  node probe.mjs $2 $3 $4 $5 $6 $7 runs/$1.json $8 >> matrix.log 2>&1 || echo "FAIL $1" >> matrix.log
}
for E in ${=ENGINES}; do for VP in 1280x800 390x844; do T=0; [[ $VP == 390x844 ]] && T=1
  for S in light dark; do
    run t-main-$E-$VP-$S 4251 $E $VP $S 0 $T 0
    run t-verb-$E-$VP-$S 4259 $E $VP $S 0 $T 0
  done; done; done
echo "$(date +%T) MATRIX DONE" >> matrix.log
