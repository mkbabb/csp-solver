#!/usr/bin/env python3
"""Apply F2's `proactiveCheck` plumbing to COPIES of the seven real consumer files and emit
real unified diffs. Nothing under the project tree is written — copies live in f2-proto/code/games."""
import difflib
import pathlib
import shutil
import sys

SRC = pathlib.Path(
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src"
)
OUT = pathlib.Path(__file__).resolve().parent.parent / "code" / "games"
DIFFS = pathlib.Path(__file__).resolve().parent.parent / "diffs"
OUT.mkdir(parents=True, exist_ok=True)
DIFFS.mkdir(parents=True, exist_ok=True)

# ── the five scenes: one binding each, on the mount that already has `errorCheckMode` ────
SCENES = {
    "games/sudoku/SudokuGame.vue": ("sudoku", "        :error-check-mode=\"sudoku.errorCheckMode.value\"\n"),
    "games/futoshiki/FutoshikiGame.vue": ("futoshiki", "        :error-check-mode=\"futoshiki.errorCheckMode.value\"\n"),
    "games/thermo/ThermoGame.vue": ("thermo", "        :error-check-mode=\"thermo.errorCheckMode.value\"\n"),
    "games/killer/KillerGame.vue": ("killer", "        :error-check-mode=\"killer.errorCheckMode.value\"\n"),
    "games/kenken/KenKenGame.vue": ("kenken", "        :error-check-mode=\"kenken.errorCheckMode.value\"\n"),
}

# ── the two thin section-suppliers: a prop + a forward ───────────────────────────────────
WRAPPERS = ["games/sudoku/ControlPanel/ControlPanel.vue", "games/futoshiki/ControlPanel/ControlPanel.vue"]

PROP_BLOCK = """  // T4-W8 ROW 2 — the error-check mode, relayed to the shell.
  errorCheckMode: ErrorCheckMode;
  // F2/D4 — `useAssists().proactiveCheck`, the second axis of the teacher pen's four poses:
  // it is what makes the on-demand edit-disarm visible (the pen lies back down on the desk).
  proactiveCheck: boolean;
"""

failures = []
diff_chunks = []

for rel, (name, anchor) in SCENES.items():
    src = SRC / rel
    text = src.read_text()
    if anchor not in text:
        failures.append(f"{rel}: anchor not found")
        continue
    new = text.replace(
        anchor, anchor + f'        :proactive-check="{name}.proactiveCheck.value"\n', 1
    )
    dst = OUT / pathlib.Path(rel).name
    dst.write_text(new)
    diff_chunks.append(
        "".join(
            difflib.unified_diff(
                text.splitlines(keepends=True),
                new.splitlines(keepends=True),
                fromfile=f"a/src/{rel}",
                tofile=f"b/src/{rel}",
                n=3,
            )
        )
    )

for rel in WRAPPERS:
    src = SRC / rel
    if not src.exists():
        failures.append(f"{rel}: missing")
        continue
    text = src.read_text()
    new = text
    # 1. the prop
    old_prop = "  // T4-W8 ROW 2 — the error-check mode, relayed to the shell's AssistSettings.\n  errorCheckMode: ErrorCheckMode;\n"
    if old_prop in new:
        new = new.replace(old_prop, PROP_BLOCK, 1)
    else:
        alt = "  errorCheckMode: ErrorCheckMode;\n"
        if alt in new:
            new = new.replace(alt, alt + "  proactiveCheck: boolean;\n", 1)
        else:
            failures.append(f"{rel}: prop anchor not found")
            continue
    # 2. the forward
    fwd_anchor = '    :error-check-mode="errorCheckMode"\n'
    if fwd_anchor not in new:
        failures.append(f"{rel}: forward anchor not found")
        continue
    new = new.replace(fwd_anchor, fwd_anchor + '    :proactive-check="proactiveCheck"\n', 1)
    tag = rel.split("/")[1] + "-" + pathlib.Path(rel).name
    (OUT / tag).write_text(new)
    diff_chunks.append(
        "".join(
            difflib.unified_diff(
                text.splitlines(keepends=True),
                new.splitlines(keepends=True),
                fromfile=f"a/src/{rel}",
                tofile=f"b/src/{rel}",
                n=3,
            )
        )
    )

(DIFFS / "proactive-check-plumbing.diff").write_text("".join(diff_chunks))
added = sum(1 for c in diff_chunks for line in c.splitlines() if line.startswith("+") and not line.startswith("+++"))
removed = sum(1 for c in diff_chunks for line in c.splitlines() if line.startswith("-") and not line.startswith("---"))
print(f"files={len(diff_chunks)} +{added} -{removed}")
if failures:
    print("FAILURES:", *failures, sep="\n  ")
    sys.exit(1)
