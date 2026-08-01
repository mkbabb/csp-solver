import pathlib

root = pathlib.Path(
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/"
    ".claude/worktrees/wf_6e1b18f4-0f2-3/web/frontend"
)

game_sites = {
    "src/games/sudoku/SudokuGame.vue": ':error-check-mode="sudoku.errorCheckMode.value"',
    "src/games/futoshiki/FutoshikiGame.vue": ':error-check-mode="futoshiki.errorCheckMode.value"',
    "src/games/thermo/ThermoGame.vue": ':error-check-mode="thermo.errorCheckMode.value"',
    "src/games/killer/KillerGame.vue": ':error-check-mode="killer.errorCheckMode.value"',
    "src/games/kenken/KenKenGame.vue": ':error-check-mode="kenken.errorCheckMode.value"',
}
for path, anchor in game_sites.items():
    p = root / path
    s = p.read_text()
    assert s.count(anchor) == 1, (path, s.count(anchor))
    var = anchor.split('"')[1].split(".")[0]
    p.write_text(
        s.replace(anchor, anchor + f'\n        :proactive-check="{var}.proactiveCheck.value"')
    )
    print("game+", path)

for path in [
    "src/games/sudoku/ControlPanel/ControlPanel.vue",
    "src/games/futoshiki/ControlPanel/ControlPanel.vue",
]:
    p = root / path
    s = p.read_text()
    assert "  errorCheckMode: ErrorCheckMode;\n" in s, path
    s = s.replace(
        "  errorCheckMode: ErrorCheckMode;\n",
        "  errorCheckMode: ErrorCheckMode;\n"
        "  /** T4-P1 — useAssists' derived marking gate, relayed straight through. */\n"
        "  proactiveCheck: boolean;\n",
        1,
    )
    assert '    :error-check-mode="errorCheckMode"\n' in s, path
    s = s.replace(
        '    :error-check-mode="errorCheckMode"\n',
        '    :error-check-mode="errorCheckMode"\n    :proactive-check="proactiveCheck"\n',
        1,
    )
    p.write_text(s)
    print("relay+", path)
