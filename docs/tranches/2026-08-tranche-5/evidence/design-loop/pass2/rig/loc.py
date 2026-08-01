"""Code-only LOC: strip HTML/JS/CSS comments and blank lines, then count.
Run over base (git show) and head so the two are measured by the SAME stripper — the only
way the comparison means anything."""
import re
import subprocess
import sys

WT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_6e1b18f4-0f2-3"


def strip(src: str) -> int:
    src = re.sub(r"<!--.*?-->", "", src, flags=re.S)
    src = re.sub(r"/\*.*?\*/", "", src, flags=re.S)
    src = re.sub(r"^\s*//.*$", "", src, flags=re.M)
    return sum(1 for line in src.splitlines() if line.strip())


def at_head(path):
    with open(f"{WT}/{path}") as f:
        return f.read()


def at_base(path):
    return subprocess.run(
        ["git", "-C", WT, "show", f"HEAD:{path}"], capture_output=True, text=True
    ).stdout


FILES = [
    "web/frontend/src/games/shared/GameControlPanel.vue",
    "web/frontend/src/games/shared/AssistSettings.vue",
    "web/frontend/src/games/shared/PencilModeToggle.vue",
    "web/frontend/src/games/shared/CheckStatus.vue",
    "web/frontend/src/pencil/sheet/SheetWashiLabel.vue",
    "web/frontend/src/games/sudoku/ControlPanel/ControlPanel.vue",
    "web/frontend/src/games/futoshiki/ControlPanel/ControlPanel.vue",
    "web/frontend/src/games/sudoku/SudokuGame.vue",
    "web/frontend/src/games/futoshiki/FutoshikiGame.vue",
    "web/frontend/src/games/thermo/ThermoGame.vue",
    "web/frontend/src/games/killer/KillerGame.vue",
    "web/frontend/src/games/kenken/KenKenGame.vue",
    "web/frontend/src/games/sudoku/ControlPanel/ControlPanel.test.ts",
    "web/frontend/src/games/futoshiki/ControlPanel/ControlPanel.test.ts",
]

tot_b = tot_h = 0
print(f"{'file':58} {'base':>6} {'head':>6} {'delta':>7}")
for f in FILES:
    b = strip(at_base(f) or "")
    try:
        h = strip(at_head(f))
    except FileNotFoundError:
        h = 0
    tot_b += b
    tot_h += h
    print(f"{f.replace('web/frontend/src/', ''):58} {b:>6} {h:>6} {h - b:>+7}")
print(f"{'TOTAL code-only':58} {tot_b:>6} {tot_h:>6} {tot_h - tot_b:>+7}", file=sys.stdout)
