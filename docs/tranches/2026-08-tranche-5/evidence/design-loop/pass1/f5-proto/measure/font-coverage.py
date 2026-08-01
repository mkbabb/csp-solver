#!/usr/bin/env python3
"""F5 PROTOTYPE — rendered-glyph coverage of the three self-hosted subsets.

Rendered coverage = (font cmap) ∩ (the @font-face unicode-range declared in
src/assets/index.css). A codepoint outside the declared range NEVER reaches the
face, regardless of the file's cmap (CSS Fonts §unicode-range), so the
intersection is what the browser can actually draw. Read-only against the tree.
"""
import json
import sys
from fontTools.ttLib import TTFont

ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/assets"

# unicode-range values transcribed VERBATIM from index.css @font-face blocks.
RANGES = {
    "Fraunces": "U+0020, U+0042, U+0044, U+0053, U+0061, U+0063-0064, U+0065-0066, "
    "U+0068, U+0069, U+006B, U+006C, U+006F, U+0072-0074, U+0075, U+0079, U+007A",
    "Fira Code": "U+0020, U+0031, U+0034-0037, U+0039, U+0040, U+0045, U+0048, U+004D, "
    "U+0061-0062, U+0064-0065, U+0069, U+006D, U+0072, U+0073, U+0075, U+0079, U+00D7",
    "Patrick Hand": "U+0020-0021, U+0027, U+002D-002E, U+0030-0039, U+003F, U+0043, "
    "U+0052, U+0053, U+0061-0069, U+006B-0077, U+0079-007A, U+00D7, U+2014, U+2026",
}
FILES = {
    "Fraunces": f"{ROOT}/fonts/fraunces-subset.woff2",
    "Fira Code": f"{ROOT}/fonts/firacode-subset.woff2",
    "Patrick Hand": f"{ROOT}/fonts/patrickhand-subset.woff2",
}

# Every string the F5 slice's surfaces render, by the face the CSS asks for.
STRINGS = {
    # .section-heading / .eyebrow-caption (Fraunces via --font-display) — CAPS via
    # text-transform, so the drawn codepoints are the uppercase ones.
    "Fraunces": [
        "NEW GAME", "SIZE", "DIFFICULTY", "MARKS", "CHECK", "CANDIDATES", "CANDS",
    ],
    # .ctrl-btn (Fira Code via --font-mono) — every OptionSelector label in the panel.
    "Fira Code": [
        "9x9", "9×9", "Easy", "Medium", "Hard",
        "Normal", "Corner", "Center", "Off", "Ask", "Live", "On",
    ],
    # .icon-sublabel + KeyboardLegend (Patrick Hand via --font-hand).
    "Patrick Hand": [
        "Deal", "sure?", "Clear", "Fill", "Solve", "Share", "Undo", "Redo", "Hint",
        "peek", "hint", "pencil", "undo", "redo", "copied!",
    ],
}


def parse_range(spec):
    out = set()
    for tok in spec.split(","):
        tok = tok.strip().removeprefix("U+")
        if "-" in tok:
            a, b = tok.split("-")
            out |= set(range(int(a, 16), int(b, 16) + 1))
        else:
            out.add(int(tok, 16))
    return out


report = {}
for face, path in FILES.items():
    cmap = set(TTFont(path).getBestCmap().keys())
    rng = parse_range(RANGES[face])
    rendered = cmap & rng
    face_report = {
        "cmap_glyphs": len(cmap),
        "declared_range_codepoints": len(rng),
        "rendered_coverage": len(rendered),
        "in_file_but_range_gated": sorted(chr(c) for c in (cmap - rng) if c > 0x20),
        "strings": {},
    }
    for s in STRINGS[face]:
        miss = [ch for ch in s if ord(ch) not in rendered]
        face_report["strings"][s] = {
            "falls_back": bool(miss),
            "missing": miss,
            "mixed_mid_word": bool(miss) and len(miss) < len([c for c in s if c != " "]),
        }
    report[face] = face_report

json.dump(report, sys.stdout, indent=2, ensure_ascii=False)
print()
