#!/bin/bash
# run-d.sh : batch D on the FINAL bytes — the reserve row re-run (tree tree2 dist, control, union u-hold2), the glyph-text
# re-run on the union dist (+ the like-for-like ask pose), all from the t8 copy (L8 is under its battery)
P=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger8/p8
export COPY=t8
O=$P/q/run-d.txt; echo "start $(date +%T) load $(uptime | sed 's/.*averages: //')" > $O
idof() { ls $P/dists/$1/assets | grep -E '^index-.*\.js$'; }
bash $P/bin/serve.sh up 4249 $P/t8/web/frontend $P/cfg/build-t8f.mts $P/dists/tree2 $(idof tree2) >> $O 2>&1 || { echo "tree serve failed" >> $O; exit 1; }
bash $P/bin/spec8.sh reserve-tree-final 4249 note-reserve.spec.ts; echo "reserve-tree-final $(tail -1 $P/q/spec-reserve-tree-final.log)" >> $O
bash $P/bin/spec8.sh reserve-control-final 4250 note-reserve.spec.ts; echo "reserve-control-final $(tail -1 $P/q/spec-reserve-control-final.log)" >> $O
bash $P/bin/serve.sh down 4249 >> $O 2>&1
bash $P/bin/serve.sh up 4249 $P/t8/web/frontend $P/cfg/build-L8f.mts $P/dists/u-hold2 $(idof u-hold2) >> $O 2>&1 || { echo "union serve failed" >> $O; exit 1; }
bash $P/bin/spec8.sh reserve-union-final 4249 note-reserve.spec.ts; echo "reserve-union-final $(tail -1 $P/q/spec-reserve-union-final.log)" >> $O
bash $P/bin/probe.sh glyphask hold 4249 glyphask; echo "glyphask $(tail -1 $P/q/probe-glyphask.log)" >> $O
bash $P/bin/probe.sh glyphtext hold 4249 none glyphtext.probe.ts; echo "glyphtext $(tail -1 $P/q/probe-glyphtext.log)" >> $O
bash $P/bin/serve.sh down 4249 >> $O 2>&1
echo "DONE $(date +%T) load $(uptime | sed 's/.*averages: //')" >> $O
