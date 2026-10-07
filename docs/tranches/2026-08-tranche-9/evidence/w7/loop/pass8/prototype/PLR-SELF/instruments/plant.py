#!/usr/bin/env python3
"""plant.py <name> apply|restore — one file edit per plant, the original held by copy, sha1 printed."""
import sys, hashlib, shutil, os
W = '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend/'
HOLD = '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself8r/hold/'
MARK = 'src/pencil/chrome/PlayerMark/PlayerMark.vue'
SHEET = 'src/pencil/chrome/AttributionCard/HeadSheet.vue'
AREA = """    covered(tall, board) - covered(short, board) >
      UNDER_BOARD * (area(tall) - area(short));"""
PLANTS = {
    # K1 · pass 7's key back: the one-axis disjunct (board.left <= the rows' start) in place of the area clause
    'K1': (MARK, AREA, "    board.left <= tall.left + parseFloat(getComputedStyle(document.getElementById(lobbyId)!).paddingLeft);"),
    # K2 · clause sabotage: the area clause deleted, only 'one row clears' decides
    'K2': (MARK, AREA, "    false;"),
    # K3 · clause sabotage: 'one row clears the board' deleted
    'K3': (MARK, "    !laps(short, board) ||\n", ""),
    # K4 · clause sabotage: the threshold moved to 0 (any added row over the board takes short)
    'K4': (MARK, "const UNDER_BOARD = 0.7;", "const UNDER_BOARD = 0;"),
    # N0 · the other arm of the ballot, as a file edit (the desk row's negative)
    'N0': (MARK, "const NAMES_OVER_CELLS = true;", "const NAMES_OVER_CELLS = false;"),
    # D1 · pass 7's guard back: the debt never ends
    'D1': (MARK, "const TAP_CLICK_MS = 350;", "const TAP_CLICK_MS = Infinity;"),
    # D2 · clause sabotage: the debt forgiven at once (the tap's own late click toggles again)
    'D2': (MARK, "const TAP_CLICK_MS = 350;", "const TAP_CLICK_MS = 0;"),
    # E1 · DARK: a dark-only erase of the edge (the pass-7 critic's plant)
    'E1': (SHEET, ".head-sheet-frame {\n  height: 100%;\n}", ".head-sheet-frame {\n  height: 100%;\n}\n\n:global(.dark) .head-sheet-edge {\n  opacity: 0;\n}"),
    # R1 · the literal radius back
    'R1': (SHEET, ':radius="radius"', ':radius="15"'),
}
name, act = sys.argv[1], sys.argv[2]
f, old, new = PLANTS[name]
path = W + f
hold = HOLD + name + '.' + os.path.basename(f)
sha = lambda p: hashlib.sha1(open(p, 'rb').read()).hexdigest()[:12]
if act == 'apply':
    shutil.copyfile(path, hold)
    s = open(path).read()
    assert s.count(old) == 1, f'{name}: anchor count {s.count(old)}'
    open(path, 'w').write(s.replace(old, new))
    print(f'PLANT {name} applied {f} {sha(hold)} -> {sha(path)}')
else:
    shutil.copyfile(hold, path)
    print(f'PLANT {name} restored {f} {sha(path)} (hold {sha(hold)}) {"OK" if sha(path) == sha(hold) else "MISMATCH"}')
