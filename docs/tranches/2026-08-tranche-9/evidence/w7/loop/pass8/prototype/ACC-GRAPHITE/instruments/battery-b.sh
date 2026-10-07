#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/graphite8
B=$S/bin/band.sh
R5=desk,phone,tablet,tabletL,deskcoarse
bash $B b-raster raster.crit.ts
bash $B b-stamped band.crit.ts GATE=1
bash $B b-perim5 bandc.crit.ts GATE=1 STAT=perimeter RIGS=$R5
bash $B b-tb5 bandc.crit.ts GATE=1 STAT=tb RIGS=$R5
bash $B b-x812 bandc.crit.ts STAT=tb RIGS=phone812
bash $B b-xdpr2 bandc.crit.ts STAT=tb DPR=2 RIGS=desk,phone
P='.game-cell:has(input:focus-visible) .cell-ghost-retrace'
bash $B b-pl-thin bandc.crit.ts GATE=1 STAT=tb RIGS=desk,phone,tablet "EXTRA_CSS=$P{display:none !important}"
bash $B b-pl-thick bandc.crit.ts GATE=1 STAT=tb RIGS=desk,phone,tablet "EXTRA_CSS=$P{stroke-width:20 !important}"
bash $B b-pl-ptr bandc.crit.ts GATE=1 STAT=tb RIGS=desk,phone,tablet "EXTRA_CSS=@media (pointer: coarse) and (max-resolution: 1dppx){$P{stroke-width:12 !important}}"
bash $B b-pl-clip bandc.crit.ts GATE=1 STAT=tb RIGS=desk,phone,tablet "EXTRA_CSS=svg.hand-drawn-grid{clip-path:inset(1.2% 0 1.2% 0)}"
bash $B b-pl-clipP bandc.crit.ts GATE=1 STAT=perimeter RIGS=desk,phone,tablet "EXTRA_CSS=svg.hand-drawn-grid{clip-path:inset(1.2% 0 1.2% 0)}"
bash $B b-pl-x6 bandc.crit.ts GATE=1 STAT=tb RIGS=desk,phone,tablet "EXTRA_CSS=.cell-ghost{clip-path:inset(0 22% 0 22%)}"
echo ALLDONE > $S/logs/battery-b.done
