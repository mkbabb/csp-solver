"""F5 contract test: `board_size`, never a bare `size` alias, anywhere in the
new Futoshiki files.

Sudoku's API `size` parameter is the *subgrid* side length (board is
`size**2`); Futoshiki has no subgrid, so its natural size parameter is the
board side directly. Reusing the literal identifier `size` for a
differently-scaled quantity is exactly the kind of naming collision
`api-error-taxonomy.md`'s `Difficulty` five-way parity check was built to
catch — cheap insurance given that precedent (wave spec F5).

This walks the actual AST (not a text/regex grep) so prose in docstrings
discussing *why* `size` is avoided (this file's own module docstring
included) can say the word "size" freely without tripping a false positive —
only real identifiers (function parameters, assigned names, attribute
accesses) are checked.
"""

from __future__ import annotations

import ast
from pathlib import Path

FUTOSHIKI_PKG = Path(__file__).parent.parent / "src" / "app" / "games" / "futoshiki"


def _bare_size_identifiers(tree: ast.AST) -> list[tuple[int, str]]:
    """Return `(lineno, node-kind)` for every identifier that is the exact
    bare string `size` — never a substring hit like `board_size`, since AST
    identifiers are whole tokens, not text spans."""
    hits: list[tuple[int, str]] = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Name) and node.id == "size":
            hits.append((node.lineno, "Name"))
        elif isinstance(node, ast.arg) and node.arg == "size":
            hits.append((node.lineno, "arg"))
        elif isinstance(node, ast.Attribute) and node.attr == "size":
            hits.append((node.lineno, "Attribute"))
        elif isinstance(node, ast.keyword) and node.arg == "size":
            hits.append((node.lineno, "keyword"))
    return hits


def test_futoshiki_package_exists():
    assert FUTOSHIKI_PKG.is_dir(), f"expected {FUTOSHIKI_PKG} to exist"
    py_files = sorted(FUTOSHIKI_PKG.glob("*.py"))
    assert len(py_files) >= 3, (
        f"expected at least models.py/router.py/service.py, found {py_files}"
    )


def test_no_bare_size_identifier_in_futoshiki_package():
    py_files = sorted(FUTOSHIKI_PKG.glob("*.py"))
    assert py_files, f"no .py files found under {FUTOSHIKI_PKG}"

    offenders: dict[str, list[tuple[int, str]]] = {}
    for path in py_files:
        tree = ast.parse(path.read_text(), filename=str(path))
        hits = _bare_size_identifiers(tree)
        if hits:
            offenders[path.name] = hits

    assert not offenders, (
        f"bare `size` identifier(s) found (must be `board_size`): {offenders}"
    )


def test_board_size_identifier_actually_used():
    """Guards against the check above passing vacuously (e.g. if a future
    refactor renamed the field to something else entirely, silently) — at
    least one real `board_size` identifier must exist in the package."""
    found = False
    for path in sorted(FUTOSHIKI_PKG.glob("*.py")):
        tree = ast.parse(path.read_text(), filename=str(path))
        for node in ast.walk(tree):
            if (
                (isinstance(node, ast.Name) and node.id == "board_size")
                or (isinstance(node, ast.arg) and node.arg == "board_size")
                or (isinstance(node, ast.Attribute) and node.attr == "board_size")
            ):
                found = True
                break
        if found:
            break
    assert found, "expected at least one `board_size` identifier in the futoshiki package"
