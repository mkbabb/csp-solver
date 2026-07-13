//! Contract test for canonicalizing `Difficulty` (grand-audit Pass 3,
//! `difficulty-sixth-definition` — hardening prototype 14's
//! `tests/difficulty_parity.rs` against D10c / T8: prototype 6 added a
//! *sixth* Difficulty definition — `wasm/src/sudoku.rs::SudokuDifficulty`,
//! spelled in idiomatic Rust PascalCase (`Easy`/`Medium`/`Hard`) rather
//! than the SCREAMING_SNAKE_CASE every other sibling uses — which the
//! original verbatim-substring test neither scanned nor could pass if
//! naively extended to scan it.
//!
//! This version fixes both problems structurally:
//!
//! 1. **Casing policy** (fixes "fail on it"): each sibling definition is
//!    paired with an explicit [`Casing`] describing how *that site*
//!    spells the canonical variant names in its own source text. Two
//!    casings are legitimate today — `Verbatim` (SCREAMING_SNAKE, the
//!    wire format: PyO3, Pydantic, TS union) and `PascalCase` (idiomatic
//!    Rust identifiers: `wasm/src/sudoku.rs`). Adding a third casing is a
//!    one-line addition to [`Casing::expected`], not a rewrite.
//!
//! 2. **Scanned-file-list guard** (fixes "miss it"): [`no_unscanned_difficulty_definitions_exist`]
//!    walks the same three root directories every live Difficulty mirror
//!    has ever lived in and greps for a Difficulty-shaped definition
//!    (`enum ...Difficulty` / `class ...Difficulty` / `type ...Difficulty =`),
//!    then asserts the discovered file set is *exactly* [`SIBLING_DEFINITIONS`]'s
//!    path set — no more, no less. A new file defining a Difficulty-shaped
//!    type that isn't in [`SIBLING_DEFINITIONS`] fails this test by
//!    construction, even if its casing happens to be correct and even if
//!    nobody ever extends [`difficulty_variants_agree_across_all_known_definitions`]
//!    to look at it. This is what makes a silent seventh definition
//!    structurally impossible, not just "not yet observed."
//!
//! Both tests operate on plain source text — no cross-language execution,
//! no proc-macro, no generated-file pipeline (per the Pass-2 "contract
//! test beats codegen" resolution, open question 7).
//!
//! ## Reconciliation note (W6, 2026-07-05)
//!
//! The prototype's `SIBLING_DEFINITIONS` paths and its `strum`-derived
//! canonical variant list were authored against the pre-restructure tree.
//! Landed here retargeted to the current topology — `py.rs` → `py/sudoku.rs`
//! (W1 py-module split, T3-W3 rename), `composables/useSudoku.ts` → `games/sudoku/types.ts`
//! (W7 frontend topology) — and de-`strum`'d: the canonical wire names are
//! inlined behind a compile-time `match` on the enum, so no `strum`
//! dependency is added to the (W3-owned) `Cargo.toml`. The guard behavior
//! is identical.
//!
//! The T2-W2 abrogation retired the FastAPI service, so the Pydantic
//! `models.py` mirror and its scan root are gone — the sudoku wire-mirror set
//! is three: PyO3, wasm, frontend TS.
//!
//! ## Reconciliation note (T4-W6, 2026-07-13)
//!
//! Futoshiki grew its own `Difficulty` axis (GEN-2), spelled in the same
//! idiomatic Rust PascalCase as the wasm sudoku enum: `puzzles::futoshiki::
//! generate::Difficulty` (core) and `wasm/src/futoshiki.rs::FutoshikiDifficulty`
//! (wire). They are a *parallel* axis, not additional sudoku wire-mirrors — a
//! distinct puzzle's tiers that happen to share the canonical `EASY`/`MEDIUM`/
//! `HARD` variant set — so the discovery guard must still see them (they are
//! `enum …Difficulty` declarations) and they join [`SIBLING_DEFINITIONS`] as
//! `PascalCase` siblings. The sudoku wire-mirror set proper stays three.
//!
//! ## Scope boundary (read before adding a fifth casing or a new root)
//!
//! - The regex-free heuristics in [`looks_like_difficulty_definition`] key
//!   on the literal substring `"Difficulty"` in a `enum`/`class`/`type`
//!   declaration line. A future definition using a *different* name for
//!   the same concept (e.g. a hypothetical `SudokuLevel` introduced instead
//!   of reusing `Difficulty`) will **not** be caught by this guard — it
//!   catches a same-named seventh definition appearing outside the
//!   allowlist, not a differently-named parallel concept. See the Pass-3
//!   report for the honest accounting of this boundary.
//! - [`SCAN_ROOTS`] is itself a maintained list. A Difficulty-shaped
//!   definition introduced in a root not listed here (a new crate, a new
//!   frontend app directory) is invisible to this guard. Extend
//!   `SCAN_ROOTS` when a new surface (e.g. a Futoshiki-specific frontend
//!   package) is added to the composed tree.
//! - Generated/derived artifacts (`wasm/pkg/*.d.ts`, `dist/`, `target/`,
//!   `node_modules/`) are excluded — they are compiled *from* one of the
//!   scanned sources, so a hand-authored drift there is impossible by
//!   construction; a *stale build* is a build-freshness problem, not a
//!   duplicate-definition problem, and out of this test's scope.

use std::collections::BTreeSet;
use std::path::Path;

use csp_solver::sudoku::Difficulty;

/// Canonical SCREAMING_SNAKE_CASE wire name for a `Difficulty` variant.
///
/// The native enum is PascalCase Rust (`Easy`/`Medium`/`Hard`); this is
/// the single point that maps it to the wire format every sibling mirrors.
/// Being an exhaustive `match` on the real enum, it is a **compile-time
/// anchor**: renaming or removing a variant breaks the build here rather
/// than letting the substring checks below drift silently.
fn wire_name(d: Difficulty) -> &'static str {
    match d {
        Difficulty::Easy => "EASY",
        Difficulty::Medium => "MEDIUM",
        Difficulty::Hard => "HARD",
    }
}

/// How a sibling site spells the canonical variant names in its own
/// source text.
#[derive(Clone, Copy, Debug)]
enum Casing {
    /// Site's source text contains the canonical wire-format string
    /// verbatim: PyO3 `#[pyclass]` variants, Pydantic `Enum`
    /// members/values, and the frontend TS string-literal union all mirror
    /// the wire format directly in their Rust/Python/TS identifiers.
    Verbatim,
    /// Site's source text spells the variant as an idiomatic Rust
    /// PascalCase identifier instead of mirroring the wire string —
    /// `wasm/src/sudoku.rs::SudokuDifficulty` (prototype 6).
    PascalCase,
}

impl Casing {
    /// Transform a canonical SCREAMING_SNAKE_CASE variant name (e.g.
    /// `"EASY"`) into the substring this site's source text is expected
    /// to contain verbatim.
    fn expected(self, canonical_variant: &str) -> String {
        match self {
            Casing::Verbatim => canonical_variant.to_string(),
            Casing::PascalCase => {
                let mut chars = canonical_variant.chars();
                match chars.next() {
                    Some(first) => {
                        first.to_uppercase().collect::<String>() + &chars.as_str().to_lowercase()
                    }
                    None => String::new(),
                }
            }
        }
    }
}

/// Every known non-canonical Difficulty definition, paired with a human
/// label and the casing policy that site's source text follows. Paths are
/// relative to `csp-solver/` (cargo's test working directory is always the
/// crate root, regardless of which `tests/*.rs` file is running).
///
/// The canonical source, `src/puzzles/sudoku/generate.rs::Difficulty`, is
/// deliberately *not* listed here — it is the thing every entry below is
/// checked against, not a sibling of itself.
const SIBLING_DEFINITIONS: &[(&str, &str, Casing)] = &[
    (
        "py/sudoku.rs::SudokuDifficulty (PyO3)",
        "src/py/sudoku.rs",
        Casing::Verbatim,
    ),
    (
        "wasm/src/sudoku.rs::SudokuDifficulty (wasm, prototype 6 — idiomatic casing)",
        "wasm/src/sudoku.rs",
        Casing::PascalCase,
    ),
    (
        "games/sudoku/types.ts Difficulty (frontend TS)",
        "../web/frontend/src/games/sudoku/types.ts",
        Casing::Verbatim,
    ),
    (
        "puzzles/futoshiki/generate.rs::Difficulty (futoshiki core, T4-W6 — idiomatic casing)",
        "src/puzzles/futoshiki/generate.rs",
        Casing::PascalCase,
    ),
    (
        "wasm/src/futoshiki.rs::FutoshikiDifficulty (wasm, T4-W6 — idiomatic casing)",
        "wasm/src/futoshiki.rs",
        Casing::PascalCase,
    ),
    (
        "games/futoshiki/types.ts Difficulty (frontend TS, T4-W6)",
        "../web/frontend/src/games/futoshiki/types.ts",
        Casing::Verbatim,
    ),
];

/// The canonical definition's own file — excluded from both the sibling
/// scan (nothing to check it against) and the discovery guard (it's
/// allowed to say "Difficulty" all it wants; it *is* the definition).
const CANONICAL_FILE: &str = "src/puzzles/sudoku/generate.rs";

/// Root directories every live Difficulty mirror has ever lived in.
/// Relative to `csp-solver/`. Extend this when a new surface is added to
/// the composed tree (e.g. a Futoshiki-specific frontend package).
const SCAN_ROOTS: &[&str] = &["src", "wasm/src", "../web/frontend/src"];

/// Directory names never worth descending into: build output, dependency
/// trees, VCS metadata. Generated artifacts under these are compiled
/// *from* a scanned source, so hand-authored drift there is impossible by
/// construction (a stale build is a different problem).
const EXCLUDE_DIRS: &[&str] = &[
    "node_modules",
    "dist",
    "target",
    "pkg",
    ".git",
    "__pycache__",
];

#[test]
fn difficulty_variants_agree_across_all_known_definitions() {
    let canonical: &[&str] = &[
        wire_name(Difficulty::Easy),
        wire_name(Difficulty::Medium),
        wire_name(Difficulty::Hard),
    ];
    assert_eq!(
        canonical,
        &["EASY", "MEDIUM", "HARD"],
        "canonical Difficulty wire names changed shape — update this test's \
         expectation deliberately, don't let it drift silently"
    );

    let mut problems: Vec<String> = Vec::new();

    for (label, rel_path, casing) in SIBLING_DEFINITIONS {
        let path = Path::new(rel_path);
        let text = match std::fs::read_to_string(path) {
            Ok(t) => t,
            Err(e) => {
                problems.push(format!("{label} ({rel_path}): could not read file — {e}"));
                continue;
            }
        };
        for variant in canonical {
            let expected = casing.expected(variant);
            if !text.contains(&expected) {
                problems.push(format!(
                    "{label} ({rel_path}): missing canonical variant {variant:?} \
                     (expected {casing:?} spelling {expected:?} in source text)"
                ));
            }
        }
    }

    assert!(
        problems.is_empty(),
        "Difficulty parity broken across {} known sibling definitions — canonical \
         source is csp_solver::sudoku::Difficulty ({CANONICAL_FILE}).\n{}",
        SIBLING_DEFINITIONS.len(),
        problems.join("\n")
    );
}

/// Does this source line look like it *declares* a Difficulty-shaped
/// type, as opposed to merely importing/using one?
fn looks_like_difficulty_definition(line: &str, ext: &str) -> bool {
    let trimmed = line.trim_start();
    // Import/re-export lines mention "Difficulty" in a `type` position
    // (`import type { Difficulty } from ...`) without defining anything —
    // exclude explicitly so they don't false-positive the TS heuristic.
    if trimmed.starts_with("import") || trimmed.starts_with("from ") || trimmed.starts_with("use ")
    {
        return false;
    }
    if !trimmed.contains("Difficulty") {
        return false;
    }
    match ext {
        "rs" => trimmed.contains("enum "),
        "py" => trimmed.contains("class "),
        // A TS `type` alias *declaration* always carries `=` on the line
        // (`type Difficulty = 'EASY' | …`). A multi-line inline-type-import
        // continuation — `import {\n  type SudokuDifficulty,\n}` — trims to
        // `type SudokuDifficulty,` with no `=`, and would otherwise
        // false-positive (e.g. `solver.worker.ts` importing the wasm enum).
        // Requiring `=` for the `type` branch excludes it; a real `enum`
        // declaration is unambiguous and needs no such guard.
        "ts" | "vue" => {
            (trimmed.contains("type ") && trimmed.contains('=')) || trimmed.contains("enum ")
        }
        _ => false,
    }
}

fn file_ext(path: &str) -> &str {
    path.rsplit('.').next().unwrap_or("")
}

/// Recursively walk `root` (a path string relative to the crate root,
/// possibly starting with `../`), returning every file path (same
/// relative-string convention as [`SIBLING_DEFINITIONS`]) whose content
/// contains a line matching [`looks_like_difficulty_definition`].
fn scan_root_for_difficulty_definitions(root: &str, out: &mut BTreeSet<String>) {
    let dir = match std::fs::read_dir(root) {
        Ok(d) => d,
        Err(_) => return, // root doesn't exist on this checkout — nothing to scan
    };
    for entry in dir.flatten() {
        let name = entry.file_name();
        let name = name.to_string_lossy();
        let child_path = format!("{root}/{name}");

        let file_type = match entry.file_type() {
            Ok(t) => t,
            Err(_) => continue,
        };

        if file_type.is_dir() {
            if EXCLUDE_DIRS.contains(&name.as_ref()) {
                continue;
            }
            scan_root_for_difficulty_definitions(&child_path, out);
            continue;
        }

        if !file_type.is_file() {
            continue;
        }

        let ext = file_ext(&name);
        if !matches!(ext, "rs" | "py" | "ts" | "vue") {
            continue;
        }

        let text = match std::fs::read_to_string(&child_path) {
            Ok(t) => t,
            Err(_) => continue, // non-UTF8 or unreadable — not a hand-authored Difficulty def
        };

        if text
            .lines()
            .any(|line| looks_like_difficulty_definition(line, ext))
        {
            out.insert(child_path);
        }
    }
}

#[test]
fn no_unscanned_difficulty_definitions_exist() {
    let mut discovered: BTreeSet<String> = BTreeSet::new();
    for root in SCAN_ROOTS {
        scan_root_for_difficulty_definitions(root, &mut discovered);
    }

    // The canonical file itself always matches the heuristic (it *is* an
    // `enum ... Difficulty`) — it's the source of truth, not a sibling to
    // reconcile against. Remove it before comparing.
    discovered.remove(CANONICAL_FILE);

    let allowlisted: BTreeSet<String> = SIBLING_DEFINITIONS
        .iter()
        .map(|(_, path, _)| (*path).to_string())
        .collect();

    let unscanned: Vec<&String> = discovered.difference(&allowlisted).collect();
    let stale: Vec<&String> = allowlisted.difference(&discovered).collect();

    assert!(
        unscanned.is_empty(),
        "found Difficulty-shaped definition(s) not in SIBLING_DEFINITIONS — this is \
         exactly the D10c/T8 failure mode (a new mirror silently invisible to the \
         parity check): {unscanned:?}\n\
         Add each to SIBLING_DEFINITIONS in this file with an explicit Casing, or \
         delete it if it's dead code."
    );
    assert!(
        stale.is_empty(),
        "SIBLING_DEFINITIONS lists path(s) that no longer look like a Difficulty \
         definition (file deleted, or the enum/class/type declaration was removed) — \
         update this file's SIBLING_DEFINITIONS to match reality: {stale:?}"
    );
}
