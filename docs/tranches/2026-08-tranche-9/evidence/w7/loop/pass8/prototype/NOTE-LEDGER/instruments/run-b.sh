#!/bin/bash
# run-b.sh : batch B — the union (L8 = union + homes + ERASE8 + LEDGER8) arms on :4249, the control on :4250
P=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger8/p8
O=$P/q/run-b.txt; echo "start $(date +%T) load $(uptime | sed 's/.*averages: //')" > $O
bash $P/bin/serve.sh down 4249 >> $O 2>&1
idof() { ls $P/dists/$1/assets | grep -E '^index-.*\.js$'; }
up() { bash $P/bin/serve.sh up 4249 $P/L8/web/frontend $P/cfg/build-$1.mts $P/dists/$1 $(idof $1) >> $O 2>&1; }
down() { bash $P/bin/serve.sh down 4249 >> $O 2>&1; }
up u-hold || { echo "u-hold serve failed" >> $O; exit 1; }
bash $P/bin/spec8.sh reserve-union 4249 note-reserve.spec.ts; echo "reserve-union $(tail -1 $P/q/spec-reserve-union.log)" >> $O
bash $P/bin/spec8.sh swap-union 4249 affordances.spec.ts -g "the SWAP" --repeat-each=5; echo "swap-union $(tail -1 $P/q/spec-swap-union.log)" >> $O
bash $P/bin/probe.sh hold-glyph hold 4249 glyph,sixteen; echo "hold glyph,sixteen $(tail -1 $P/q/probe-hold-glyph.log)" >> $O
bash $P/bin/probe.sh hold-seat hold 4249 seat; echo "hold seat $(tail -1 $P/q/probe-hold-seat.log)" >> $O
bash $P/bin/probe.sh hold-frames hold 4249 frames; echo "hold frames $(tail -1 $P/q/probe-hold-frames.log)" >> $O
down
for arm in age step tint; do
  up u-$arm || { echo "u-$arm serve failed" >> $O; continue; }
  M=frames; [ $arm = tint ] && M=frames,glyph
  bash $P/bin/probe.sh $arm-frames $arm 4249 $M; echo "$arm $M $(tail -1 $P/q/probe-$arm-frames.log)" >> $O
  down
done
echo "DONE $(date +%T) load $(uptime | sed 's/.*averages: //')" >> $O
