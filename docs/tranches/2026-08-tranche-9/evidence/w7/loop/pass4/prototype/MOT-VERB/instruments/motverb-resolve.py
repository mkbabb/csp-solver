#!/usr/bin/env python3
"""MOT-VERB pass-4 replay: resolve the LADDER-p4 / VERB-p3 conflicts by declared policy.

POLICY. The ladder node is MOT-LADDER's (registry-v3 §2.7): rungs, characters, the publisher,
the registrations, `settleGuardMs`, the bands gate. The CURVE AXIS is MOT-VERB's (same ruling,
and pass4 ci.yml's own retirement line): every `--ease-*` -> `--verb-*-ease` assignment is
VERB's. Both gates ship. Structural seams are marked MANUAL and edited by hand.
"""
import sys, re, pathlib

S = pathlib.Path(
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/"
    "b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb-merge/merged"
)

T, O, M = "theirs", "ours", "manual"
PLAN = {
    "web/frontend/package.json": [M],
    "web/frontend/src/main.ts": [O],
    "web/frontend/src/App.vue": [M, T],
    "web/frontend/src/assets/index.css": [M, M, M],
    "web/frontend/src/games/shared/GameBoard.vue": [T],
    "web/frontend/src/games/shared/SolverErrorNote.vue": [T, T],
    "web/frontend/src/games/shared/useControlsDrawer.ts": [M, M, M],
    "web/frontend/src/games/shared/GameControlPanel.vue": [T, T, T, T],
    "web/frontend/src/games/shared/DrawerTab.vue": [T],
    "web/frontend/src/games/thermo/ThermoTube.vue": [T],
    "web/frontend/src/games/shared/scene.css": [T, T, T, T],
    "web/frontend/src/games/futoshiki/CaretOverlay.vue": [T],
    "web/frontend/src/games/shared/useFlipGlide.ts": [M, M, M],
    "web/frontend/src/pencil/config/pencilConfig.ts": [M, M],
    "web/frontend/src/pencil/chrome/CompletionVignette.vue": [T],
    "web/frontend/src/pencil/chrome/MarginNote.vue": [T, T],
    "web/frontend/src/pencil/chrome/AttributionCard/CrayonHeart.vue": [T],
    "web/frontend/src/pencil/chrome/AttributionCard/AttributionCard.vue": [T, T],
    "web/frontend/src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue": [T],
    "web/frontend/src/pencil/chrome/GameGallery/useCarouselGlide.ts": [M],
    "web/frontend/src/pencil/chrome/GameGallery/GameCard.vue": [T, T],
    "web/frontend/src/pencil/chrome/GameGallery/GameGallery.vue": [O, O, T, T, T],
    "web/frontend/src/pencil/chrome/icons/FillForcedIcon.vue": [T],
    "web/frontend/src/pencil/chrome/icons/SolveIcon.vue": [T],
    "web/frontend/src/pencil/sheet/SheetWashiLabel.vue": [T],
    "web/frontend/src/pencil/sheet/AnswerKeyLaminate.vue": [T],
    "web/frontend/src/pencil/celestial/DarkModeToggle.vue": [T],
    "web/frontend/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue": [T],
    ".github/workflows/ci.yml": [M],
}

START = re.compile(r"^<<<<<<< ")
MID = re.compile(r"^=======$")
END = re.compile(r"^>>>>>>> ")

total = {"theirs": 0, "ours": 0, "manual": 0}
for rel, plan in PLAN.items():
    p = S / rel
    lines = p.read_text().splitlines(keepends=True)
    out, i, n = [], 0, 0
    while i < len(lines):
        if START.match(lines[i]):
            j = i + 1
            ours = []
            while not MID.match(lines[j].rstrip("\n")):
                ours.append(lines[j]); j += 1
            j += 1
            theirs = []
            while not END.match(lines[j]):
                theirs.append(lines[j]); j += 1
            j += 1
            if n >= len(plan):
                print(f"!! {rel}: conflict {n} has no plan entry"); sys.exit(1)
            c = plan[n]
            total[c] += 1
            if c == T: out.extend(theirs)
            elif c == O: out.extend(ours)
            else: out.extend(lines[i:j])
            n += 1
            i = j
        else:
            out.append(lines[i]); i += 1
    if n != len(plan):
        print(f"!! {rel}: {n} conflicts but {len(plan)} plan entries"); sys.exit(1)
    p.write_text("".join(out))
    print(f"resolved {n:2d}  {rel}")
print(f"=== theirs={total['theirs']} ours={total['ours']} manual-left={total['manual']} ===")
