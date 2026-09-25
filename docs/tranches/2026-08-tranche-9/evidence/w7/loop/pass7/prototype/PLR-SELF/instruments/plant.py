import sys
W='/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend/src/pencil/chrome/'
PM=W+'PlayerMark/PlayerMark.vue'; HS=W+'AttributionCard/HeadSheet.vue'
P={
 # pass-6's one-axis key back (the critic's gap 1)
 'P1-one-axis': (PM, '''  cramped.value =
    !NAMES_OVER_CELLS ||
    board.left <= tall.rowsStart ||
    (!!short && !laps(short.box, board));''', '  cramped.value = board.left <= tall.rowsStart && board.top < tall.box.bottom;'),
 # no re-fit under an open sheet (gap 2)
 'P2-no-refit': (PM, '  window.addEventListener("resize", refit);\n  document.addEventListener("transitionend", onSettle);\n', ''),
 # pass-6's label guard back (gap 4)
 'P3-label-guard': (PM, 'function onClick(): void {\n  if (clickOwed) {', 'function onClick(e: MouseEvent): void {\n  if ((e as PointerEvent).pointerType === "touch") return;\n  if (false) {'),
 # the sheet's press un-prevented (gap 5)
 'P4-sheet-unprevented': (PM, '    @pointerdown="onSheetPress"\n    @pointerup="onSheetRelease"\n', ''),
 # X6 as a FILE plant: the bottom edge clipped, top and sides intact (gap 3)
 'P5-X6-file': (HS, '.head-sheet-edge {\n  position: absolute;\n  inset: 1px;', '.head-sheet-edge {\n  clip-path: inset(-4px -4px 16px -4px);\n  position: absolute;\n  inset: 1px;'),
 # the shut pose left half there (gap 13)
 'P6-half-shut': (HS, '''  opacity: 0;
  /* UI-6''', '''  opacity: 0.35;
  /* UI-6'''),
 # the literal radius back (gap 9)
 'P7-radius-literal': (HS, ':radius="radius"', ':radius="15"'),
 # the ballot arm: names are not worth the cells (row 7)
 'ARM-cells': (PM, 'const NAMES_OVER_CELLS = true;', 'const NAMES_OVER_CELLS = false;'),
 # the edge arm QUIET (T9-B30)
 'ARM-quiet': (HS, 'const EDGE_QUIET = false;', 'const EDGE_QUIET = true;'),
 # the seam arm (a)
 'ARM-a': (PM, 'const TAP_IS_A_LOOK = true;', 'const TAP_IS_A_LOOK = false;'),
}
f,a,b=P[sys.argv[1]]
s=open(f).read()
assert s.count(a)==1, 'anchor missing '+sys.argv[1]
open(f,'w').write(s.replace(a,b))
print('planted',sys.argv[1],f.split('/')[-1])
