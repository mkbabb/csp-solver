#!/bin/zsh
# census:toggle — chromium screencast arm + PRM arm (both engines), interleaved main/verb
cd /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ct
run() { echo "$(date +%T) start $1" >> matrix2.log; node probe.mjs $2 $3 $4 $5 $6 $7 runs/$1.json $8 >> matrix2.log 2>&1 || echo "FAIL $1" >> matrix2.log; }
for S in light dark; do
  run s-main-chromium-1280x800-$S 4251 chromium 1280x800 $S 0 0 1
  run s-verb-chromium-1280x800-$S 4259 chromium 1280x800 $S 0 0 1
done
run s-main-chromium-390x844-light 4251 chromium 390x844 light 0 1 1
run s-verb-chromium-390x844-light 4259 chromium 390x844 light 0 1 1
for E in chromium webkit; do
  run p-main-$E-1280x800-light 4251 $E 1280x800 light 1 0 0
  run p-verb-$E-1280x800-light 4259 $E 1280x800 light 1 0 0
done
echo "$(date +%T) MATRIX2 DONE" >> matrix2.log
