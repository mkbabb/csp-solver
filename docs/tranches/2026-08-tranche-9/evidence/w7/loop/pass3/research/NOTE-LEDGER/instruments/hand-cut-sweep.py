#!/usr/bin/env python3
"""NOTE-LEDGER pass-3 research — the margin's rendered vocabulary against the hand's cmap.
Reads patrickhand-subset.woff2 directly (fontTools) and prints every out-of-cut codepoint.
Read-only. The node form this proposes is a `marginRecordCopy` EXTRACT in
scripts/check-font-coverage.mjs, shaped like the fold's own `paperNoteCopy` (:117-131)."""
from fontTools.ttLib import TTFont
F = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/assets/fonts/patrickhand-subset.woff2"
cut = set(c for t in TTFont(F)['cmap'].tables for c in t.cmap)
V = [
 ("hint naked-single", "only 4 fits here"),
 ("hint naked-single 16x16", "only D fits here"),
 ("hint hidden-single row", "4 goes nowhere else in this row"),
 ("hint hidden-single col", "4 goes nowhere else in this column"),
 ("hint hidden-single box", "4 goes nowhere else in this box"),
 ("hint hidden-single fallback", "4 goes nowhere else in this group"),
 ("hint reveal", "the answer is 4"),
 ("hint 16x16 glyphs", "A B D E F G goes nowhere else in this box"),
 ("refusal", "that's a given clue"),
 ("solved", "solved it!"),
 ("conflict row/column/box", "check box 4"),
 ("conflict stuck", "no solution from here"),
 ("conflict cage", "check the cage"),
 ("conflict inequality", "check the greater than signs"),
 ("conflict thermometer", "check the thermometer"),
 ("slow solve", "still solving…"),
 ("wipe receipt", "the board is clear"),
 ("tally (DEBUG only)", "1284 backtracks · 19.9s"),
 ("fresh link copy", "this shared link couldn't be read"),
]
print("cut:", len(cut), "codepoints;", "".join(chr(c) for c in sorted(cut) if c > 32))
print("capitals in the cut:", [chr(c) for c in sorted(cut) if 65 <= c <= 90])
bad = set()
for name, s in V:
    miss = sorted(set(ch for ch in s if ord(ch) not in cut))
    bad |= set(miss)
    print(f"{'RED ' if miss else 'ok  '}{name:28} {s!r:46} {miss}")
print("union out-of-cut:", sorted(bad), [hex(ord(c)) for c in sorted(bad)])
print("bytes/codepoint on this file: 4312/46 =", round(4312/46, 1), "-> 7 new codepoints ~ +656 B (ESTIMATE; no source TTF in repo)")
