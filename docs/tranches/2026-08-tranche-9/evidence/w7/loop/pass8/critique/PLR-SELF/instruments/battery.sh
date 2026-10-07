#!/bin/bash
# critic battery: plants by whole-file copy, restore verified by sha1. No deletes.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critic-plrself8
C=$S/ct/web/frontend
PM=$C/src/pencil/chrome/PlayerMark/PlayerMark.vue
HS=$C/src/pencil/chrome/AttributionCard/HeadSheet.vue
sha() { shasum "$1" | cut -c1-12; }
echo "BATTERY START $(date +%T) PM $(sha $PM) HS $(sha $HS)"
# P7: the pass-7 PlayerMark.vue whole (the pass-7 plant first on the re-cut key and debt rows)
cp $S/p7/web/frontend/src/pencil/chrome/PlayerMark/PlayerMark.vue $PM; echo "P7 applied PM $(sha $PM)"; sleep 3
$S/run.sh p7-plant "row budget flips|click with no press"
cp $S/hold/PlayerMark.p8.vue $PM; echo "P7 restored PM $(sha $PM)"; sleep 3
# E1: dark-only erase of the head-sheet edge (the pass-7 critic's plant) on the four-band row
python3 - "$HS" <<'PY'
import sys
p=sys.argv[1]; s=open(p).read(); old=".head-sheet-frame {\n  height: 100%;\n}"
assert s.count(old)==1, s.count(old)
open(p,'w').write(s.replace(old, old+"\n\n:global(.dark) .head-sheet-edge {\n  opacity: 0;\n}"))
PY
echo "E1 applied HS $(sha $HS)"; sleep 3
$S/run.sh e1-plant "drawn edge on all four sides and no CSS border, in both themes"
cp $S/hold/HeadSheet.p8.vue $HS; echo "E1 restored HS $(sha $HS)"; sleep 3
$S/run.sh critic-cells "CRITIC cells"
$S/run.sh critic-regimes "CRITIC regimes"
echo "BATTERY END $(date +%T) PM $(sha $PM) HS $(sha $HS)"
