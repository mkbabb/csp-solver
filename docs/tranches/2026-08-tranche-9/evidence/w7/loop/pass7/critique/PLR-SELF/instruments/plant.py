import sys, pathlib
F = pathlib.Path(sys.argv[1]); which = sys.argv[2]
pm = F/'src/pencil/chrome/PlayerMark/PlayerMark.vue'; hs = F/'src/pencil/chrome/AttributionCard/HeadSheet.vue'
def sub(p, a, b):
    t = p.read_text(); assert t.count(a) == 1, (which, a); p.write_text(t.replace(a, b)); print('PLANTED', which)
if which == 'X6':
    sub(hs, '.head-sheet-edge {\n  position: absolute;\n  inset: 1px;\n  pointer-events: none;\n}', '.head-sheet-edge {\n  position: absolute;\n  inset: 1px;\n  pointer-events: none;\n  clip-path: inset(-4px -4px 16px -4px);\n}')
elif which == 'DARK':
    sub(hs, '.head-sheet-frame {\n  height: 100%;\n}', '.head-sheet-frame {\n  height: 100%;\n}\n:global(.dark) .head-sheet-edge {\n  opacity: 0;\n}')
elif which == 'P1':
    sub(pm, '  cramped.value =\n    !NAMES_OVER_CELLS ||\n    board.left <= tall.rowsStart ||\n    (!!short && !laps(short.box, board));', '  cramped.value = board.left <= tall.rowsStart && board.top < tall.box.bottom;')
elif which == 'PTE':
    sub(pm, '  document.addEventListener("transitionend", onSettle);
});', '});')
elif which == 'PRS':
    sub(pm, '  window.addEventListener("resize", refit);
  document.addEventListener("transitionend", onSettle);
});', '  document.addEventListener("transitionend", onSettle);
});')
else: raise SystemExit('unknown')
