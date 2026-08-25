//! The template-bank contract at the wire boundary — T9-W4 §4.1 beat 3.
//!
//! Through 0.6.0 exactly one verb took a bank: `generateSudoku`. The other four
//! diggable families had no way to be handed one at all, so
//! `useThermo.ts`'s `templates: null` was inert — not a mis-wiring, a surface
//! that did not exist (V2 refuted the claimed mechanism on exactly this point).
//! 0.7.0 makes the bank part of the generate contract for all five.
//!
//! A bank is a flat `Uint32Array` of **records**, each
//!
//! ```text
//! [ clue_len, board[0..total], clue[0..clue_len] ]
//! ```
//!
//! — the length prefix first so the reader can skip a record without reading a
//! cell, then the dense board, then exactly the clue buffer the family's own
//! `PuzzleData` getter already emits. A JS caller therefore banks a deal by
//! concatenating `[d.thermometers.length, ...d.board, ...d.thermometers]`, and
//! the record's tail is byte-identical to what `solveThermo` would be handed.
//! `generateSudoku` keeps its clue-free shape (`clue_len` is always 0 for a
//! family with no furniture, so sudoku's bare `total`-chunked bank is the same
//! format with the prefix elided — the one wire that shipped first keeps its
//! bytes).
//!
//! What this file asserts, per family:
//!
//!  1. **The bank is honored** — a non-empty bank returns one of its records
//!     verbatim, board and clue furniture both, never a fresh dig.
//!  2. **The pick reads the seed** — same seed ⇒ same record; across seeds every
//!     record is reachable (a pick pinned to index 0 passes (1) and fails here).
//!  3. **FAIL-EXPLICIT** — a truncated record, or a clue tail the family's own
//!     decoder refuses, throws a genuine `Error` carrying `.code ===
//!     "INVALID_INPUT"` at the *deal*, not silently at the first solve.
//!
//! The empty-bank fallback — an empty bank digs, byte-identical to the native
//! seeded dealer — is `verb_boundary.rs`'s five `verb_generate_*` tests, which
//! pass `Vec::new()` for exactly that reason.
//!
//! Run via `wasm-pack test --node` from `csp-solver/wasm/`.

#![cfg(target_arch = "wasm32")]

use csp_solver::puzzles::{futoshiki, kenken, killer, sudoku, thermo};
use csp_solver_wasm::{
    FutoshikiDifficulty, SudokuDifficulty, generate_futoshiki, generate_kenken, generate_killer,
    generate_thermo,
};
use wasm_bindgen::JsCast;
use wasm_bindgen::JsValue;
use wasm_bindgen_test::*;

/// The `.code` a thrown wire error carries, or `None` if it carries none.
fn code(err: JsValue) -> Option<String> {
    js_sys::Reflect::get(&err, &JsValue::from_str("code"))
        .ok()
        .and_then(|c| c.as_string())
}

fn assert_invalid_input(err: JsValue, label: &str) {
    assert!(
        err.is_instance_of::<js_sys::Error>(),
        "{label}: thrown value must be a genuine Error"
    );
    assert_eq!(
        code(err).as_deref(),
        Some("INVALID_INPUT"),
        "{label}: error must carry a machine-checkable .code"
    );
}

/// Wrap one dealt puzzle as a bank record.
fn record(board: &[u32], clue: &[u32]) -> Vec<u32> {
    let mut r = Vec::with_capacity(1 + board.len() + clue.len());
    r.push(clue.len() as u32);
    r.extend_from_slice(board);
    r.extend_from_slice(clue);
    r
}

/// Concatenate records into the flat bank buffer.
fn bank(records: &[Vec<u32>]) -> Vec<u32> {
    records.iter().flatten().copied().collect()
}

fn flat_thermos(thermos: &[thermo::Thermometer]) -> Vec<u32> {
    let mut out = Vec::new();
    for t in thermos {
        out.push(t.len() as u32);
        out.extend(t.iter().map(|&c| c as u32));
    }
    out
}

fn flat_killer_cages(cages: &[killer::KillerCage]) -> Vec<u32> {
    let mut out = Vec::new();
    for c in cages {
        out.push(c.cells.len() as u32);
        out.push(c.sum);
        out.extend(c.cells.iter().map(|&x| x as u32));
    }
    out
}

fn flat_kenken_cages(cages: &[kenken::KenKenCage]) -> Vec<u32> {
    let mut out = Vec::new();
    for c in cages {
        out.push(c.cells.len() as u32);
        out.push(c.op.ordinal());
        out.push(c.target);
        out.extend(c.cells.iter().map(|&x| x as u32));
    }
    out
}

fn flat_pairs(pairs: &[(usize, usize)]) -> Vec<u32> {
    pairs
        .iter()
        .flat_map(|&(a, b)| [a as u32, b as u32])
        .collect()
}

/// The seeds every "reaches every record" sweep draws over. Small and fixed:
/// the pick is `SimpleRng::new(seed).next_usize(count)`, a pure integer LCG, so
/// the sweep is deterministic on every target and needs no retry loop.
const SWEEP: std::ops::RangeInclusive<u32> = 1..=64;

// ═══ thermo ═════════════════════════════════════════════════════════════════

#[wasm_bindgen_test]
fn bank_generate_thermo() {
    let (b0, t0) = thermo::generate_thermo_seeded(2, sudoku::Difficulty::Easy, 555);
    let (b1, t1) = thermo::generate_thermo_seeded(2, sudoku::Difficulty::Easy, 556);
    let (f0, f1) = (flat_thermos(&t0), flat_thermos(&t1));
    assert!(
        (b0.clone(), f0.clone()) != (b1.clone(), f1.clone()),
        "the two bank records must differ or the sweep proves nothing"
    );
    let flat = bank(&[record(&b0, &f0), record(&b1, &f1)]);

    // 1. The bank is honored, verbatim.
    let wire = generate_thermo(2, SudokuDifficulty::Easy, 9.0, flat.clone()).expect("wire deals");
    let dealt = (wire.board(), wire.thermometers());
    assert!(
        dealt == (b0.clone(), f0.clone()) || dealt == (b1.clone(), f1.clone()),
        "a banked deal must be one of the bank's records, not a fresh dig"
    );
    assert_eq!(wire.n(), 2);

    // 2. The pick reads the seed: stable per seed, and every record reachable.
    let again = generate_thermo(2, SudokuDifficulty::Easy, 9.0, flat.clone()).expect("wire deals");
    assert_eq!(
        (again.board(), again.thermometers()),
        dealt,
        "same seed must pick the same record"
    );
    let mut seen_first = false;
    let mut seen_second = false;
    for s in SWEEP {
        let w = generate_thermo(2, SudokuDifficulty::Easy, f64::from(s), flat.clone())
            .expect("wire deals");
        if (w.board(), w.thermometers()) == (b0.clone(), f0.clone()) {
            seen_first = true;
        } else {
            seen_second = true;
        }
    }
    assert!(
        seen_first && seen_second,
        "the sweep must reach both records — a pick pinned to one index is not a pick"
    );

    // 3. FAIL-EXPLICIT.
    let mut truncated = record(&b0, &f0);
    truncated.pop();
    assert_invalid_input(
        generate_thermo(2, SudokuDifficulty::Easy, 1.0, truncated)
            .err()
            .expect("must reject"),
        "generateThermo truncated bank record",
    );
    assert_invalid_input(
        generate_thermo(2, SudokuDifficulty::Easy, 1.0, record(&b0, &[1, 0]))
            .err()
            .expect("must reject"),
        "generateThermo banked 1-cell tube",
    );
    assert_invalid_input(
        generate_thermo(2, SudokuDifficulty::Easy, 1.0, record(&b0, &[2, 0, 999]))
            .err()
            .expect("must reject"),
        "generateThermo banked out-of-range tube cell",
    );
}

// ═══ killer ═════════════════════════════════════════════════════════════════

#[wasm_bindgen_test]
fn bank_generate_killer() {
    let (b0, c0) = killer::generate_killer_seeded(2, sudoku::Difficulty::Easy, 909);
    let (b1, c1) = killer::generate_killer_seeded(2, sudoku::Difficulty::Easy, 910);
    let (f0, f1) = (flat_killer_cages(&c0), flat_killer_cages(&c1));
    assert!(
        (b0.clone(), f0.clone()) != (b1.clone(), f1.clone()),
        "the two bank records must differ or the sweep proves nothing"
    );
    let flat = bank(&[record(&b0, &f0), record(&b1, &f1)]);

    let wire = generate_killer(2, SudokuDifficulty::Easy, 9.0, flat.clone()).expect("wire deals");
    let dealt = (wire.board(), wire.cages());
    assert!(
        dealt == (b0.clone(), f0.clone()) || dealt == (b1.clone(), f1.clone()),
        "a banked deal must be one of the bank's records, not a fresh dig"
    );
    assert_eq!(wire.n(), 2);

    let mut seen_first = false;
    let mut seen_second = false;
    for s in SWEEP {
        let w = generate_killer(2, SudokuDifficulty::Easy, f64::from(s), flat.clone())
            .expect("wire deals");
        if (w.board(), w.cages()) == (b0.clone(), f0.clone()) {
            seen_first = true;
        } else {
            seen_second = true;
        }
    }
    assert!(
        seen_first && seen_second,
        "the sweep must reach both records — a pick pinned to one index is not a pick"
    );

    let mut truncated = record(&b0, &f0);
    truncated.pop();
    assert_invalid_input(
        generate_killer(2, SudokuDifficulty::Easy, 1.0, truncated)
            .err()
            .expect("must reject"),
        "generateKiller truncated bank record",
    );
    assert_invalid_input(
        generate_killer(2, SudokuDifficulty::Easy, 1.0, record(&b0, &[2, 5]))
            .err()
            .expect("must reject"),
        "generateKiller banked truncated cage",
    );
}

// ═══ kenken ═════════════════════════════════════════════════════════════════

#[wasm_bindgen_test]
fn bank_generate_kenken() {
    let (b0, c0) = kenken::generate_kenken_seeded(4, futoshiki::Difficulty::Easy, 23);
    let (b1, c1) = kenken::generate_kenken_seeded(4, futoshiki::Difficulty::Easy, 24);
    let (f0, f1) = (flat_kenken_cages(&c0), flat_kenken_cages(&c1));
    assert!(
        (b0.clone(), f0.clone()) != (b1.clone(), f1.clone()),
        "the two bank records must differ or the sweep proves nothing"
    );
    let flat = bank(&[record(&b0, &f0), record(&b1, &f1)]);

    let wire =
        generate_kenken(4, FutoshikiDifficulty::Easy, 9.0, flat.clone()).expect("wire deals");
    let dealt = (wire.board(), wire.cages());
    assert!(
        dealt == (b0.clone(), f0.clone()) || dealt == (b1.clone(), f1.clone()),
        "a banked deal must be one of the bank's records, not a fresh dig"
    );
    assert_eq!(wire.board_size(), 4);

    let mut seen_first = false;
    let mut seen_second = false;
    for s in SWEEP {
        let w = generate_kenken(4, FutoshikiDifficulty::Easy, f64::from(s), flat.clone())
            .expect("wire deals");
        if (w.board(), w.cages()) == (b0.clone(), f0.clone()) {
            seen_first = true;
        } else {
            seen_second = true;
        }
    }
    assert!(
        seen_first && seen_second,
        "the sweep must reach both records — a pick pinned to one index is not a pick"
    );

    let mut truncated = record(&b0, &f0);
    truncated.pop();
    assert_invalid_input(
        generate_kenken(4, FutoshikiDifficulty::Easy, 1.0, truncated)
            .err()
            .expect("must reject"),
        "generateKenKen truncated bank record",
    );
    assert_invalid_input(
        generate_kenken(
            4,
            FutoshikiDifficulty::Easy,
            1.0,
            record(&b0, &[2, 9, 3, 0, 1]),
        )
        .err()
        .expect("must reject"),
        "generateKenKen banked unknown operator ordinal",
    );
}

// ═══ futoshiki ══════════════════════════════════════════════════════════════

#[wasm_bindgen_test]
fn bank_generate_futoshiki() {
    let (b0, p0) =
        futoshiki::generate_futoshiki_difficulty_seeded(5, futoshiki::Difficulty::Medium, 7777);
    let (b1, p1) =
        futoshiki::generate_futoshiki_difficulty_seeded(5, futoshiki::Difficulty::Medium, 7778);
    let (f0, f1) = (flat_pairs(&p0), flat_pairs(&p1));
    assert!(
        (b0.clone(), f0.clone()) != (b1.clone(), f1.clone()),
        "the two bank records must differ or the sweep proves nothing"
    );
    let flat = bank(&[record(&b0, &f0), record(&b1, &f1)]);

    let wire =
        generate_futoshiki(5, FutoshikiDifficulty::Medium, 9.0, flat.clone()).expect("wire deals");
    let dealt = (wire.board(), wire.inequalities());
    assert!(
        dealt == (b0.clone(), f0.clone()) || dealt == (b1.clone(), f1.clone()),
        "a banked deal must be one of the bank's records, not a fresh dig"
    );
    assert_eq!(wire.board_size(), 5);

    let mut seen_first = false;
    let mut seen_second = false;
    for s in SWEEP {
        let w = generate_futoshiki(5, FutoshikiDifficulty::Medium, f64::from(s), flat.clone())
            .expect("wire deals");
        if (w.board(), w.inequalities()) == (b0.clone(), f0.clone()) {
            seen_first = true;
        } else {
            seen_second = true;
        }
    }
    assert!(
        seen_first && seen_second,
        "the sweep must reach both records — a pick pinned to one index is not a pick"
    );

    let mut truncated = record(&b0, &f0);
    truncated.pop();
    assert_invalid_input(
        generate_futoshiki(5, FutoshikiDifficulty::Medium, 1.0, truncated)
            .err()
            .expect("must reject"),
        "generateFutoshiki truncated bank record",
    );
    assert_invalid_input(
        generate_futoshiki(5, FutoshikiDifficulty::Medium, 1.0, record(&b0, &[0, 24]))
            .err()
            .expect("must reject"),
        "generateFutoshiki banked non-adjacent caret",
    );
}

// ═══ the hostile prefix ═════════════════════════════════════════════════════

/// A record whose length prefix is `u32::MAX` must reject, not wrap.
///
/// `usize` is **32 bits on wasm32** — the target this wire actually ships to —
/// so `at + 1 + total + prefix` computed with bare `+` wraps to a small number
/// that passes a `<= bank.len()` test, and the pick then slices out of bounds.
/// The ablation is real: swapping `bank_pick`'s checked walk back to a bare sum
/// turns this test into a wasm `unreachable` trap. Each family reaches the same
/// shared walk, so one is enough.
#[wasm_bindgen_test]
fn bank_hostile_prefix_is_invalid_input() {
    let (b0, t0) = thermo::generate_thermo_seeded(2, sudoku::Difficulty::Easy, 555);
    let mut hostile = record(&b0, &flat_thermos(&t0));
    hostile[0] = u32::MAX;
    assert_invalid_input(
        generate_thermo(2, SudokuDifficulty::Easy, 1.0, hostile)
            .err()
            .expect("must reject"),
        "generateThermo u32::MAX clue prefix",
    );
}

// ═══ the node_budget contract ═══════════════════════════════════════════════

// The `node_budget=0` doc/code divergence (V2's find, W4 §4.1 beat 2) had no
// test on either side of it, which is why five doc comments could say one thing
// while the code did another for three tranches. The pin lives in
// `verb_boundary.rs` beside the verbs it constrains.
