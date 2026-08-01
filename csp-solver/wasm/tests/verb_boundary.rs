//! One boundary test per exported wasm verb — 15 of them, 5 families ×
//! `solve*` / `propagate*` / `generate*`.
//!
//! The r3 audit found 12 of the 15 shipped verbs had no test at the boundary at
//! all: `solveAssignmentCop` and the futoshiki wire were covered, and sudoku,
//! thermo, killer and kenken crossed untested. A verb tested only from Rust is
//! tested everywhere except where it ships — the marshalling, the getters and
//! the `.code` on a thrown error are exactly what a native test cannot see.
//!
//! Every test asserts the same three things, in the futoshiki-parity mold:
//!
//!  1. **Marshalling** — a valid call returns the wire shape (flat buffers of
//!     the declared length, the getters populated).
//!  2. **Native parity** — the wire's answer is the crate's answer, board for
//!     board, under the same production config. The solver and `SimpleRng` are
//!     pure-integer, so native and wasm are bit-identical; a divergence here is
//!     a marshalling bug.
//!  3. **FAIL-EXPLICIT** — a malformed call throws a genuine `Error` carrying
//!     `.code === "INVALID_INPUT"`, never a silent accept and never an untyped
//!     throw. Three of the five `generate*` verbs threw a bare `JsError` with
//!     no `.code` before T5-W2; those assertions are the guard on that cure.
//!
//! Run via `wasm-pack test --node` from `csp-solver/wasm/`.

#![cfg(target_arch = "wasm32")]

use csp_solver::ordering::Ordering;
use csp_solver::puzzles::{futoshiki, kenken, killer, sudoku, thermo};
use csp_solver::{Pruning, SolveConfig};
use csp_solver_wasm::{
    FutoshikiDifficulty, SudokuDifficulty, generate_futoshiki, generate_kenken, generate_killer,
    generate_sudoku, generate_thermo, propagate_futoshiki, propagate_kenken, propagate_killer,
    propagate_sudoku, propagate_thermo, solve_futoshiki, solve_kenken, solve_killer, solve_sudoku,
    solve_thermo,
};
use wasm_bindgen::JsCast;
use wasm_bindgen::JsValue;
use wasm_bindgen_test::*;

/// The shipped solve policy every wire uses (the F1 production override).
fn production(max_solutions: usize) -> SolveConfig {
    SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::Mrv,
        max_solutions,
        ..Default::default()
    }
}

/// The `.code` a thrown wire error carries, or `None` if it carries none —
/// the discriminant a JS caller switches on.
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

/// A solved 4×4 Latin square with one cell dug out — the smallest board every
/// boxed family accepts (`n = 2` ⇒ 4×4).
fn sudoku_4x4_dug() -> Vec<u32> {
    let mut b = vec![1, 2, 3, 4, 3, 4, 1, 2, 2, 1, 4, 3, 4, 3, 2, 1];
    b[0] = 0;
    b
}

/// Flatten thermometers into the length-prefixed wire buffer (`[k, cells…]`).
fn flat_thermos(thermos: &[thermo::Thermometer]) -> Vec<u32> {
    let mut out = Vec::new();
    for t in thermos {
        out.push(t.len() as u32);
        out.extend(t.iter().map(|&c| c as u32));
    }
    out
}

/// Flatten killer cages into the length-prefixed wire buffer (`[k, sum, cells…]`).
fn flat_killer_cages(cages: &[killer::KillerCage]) -> Vec<u32> {
    let mut out = Vec::new();
    for c in cages {
        out.push(c.cells.len() as u32);
        out.push(c.sum);
        out.extend(c.cells.iter().map(|&x| x as u32));
    }
    out
}

/// Flatten kenken cages into the wire buffer (`[k, op, target, cells…]`).
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

/// Every cell's mask must be a non-empty subset of `1..=values`.
fn assert_mask_shape(masks: &[u32], cells: usize, values: u32, label: &str) {
    assert_eq!(masks.len(), cells, "{label}: one mask per cell");
    let legal: u32 = (1..=values).fold(0, |acc, v| acc | (1 << v));
    for (i, &m) in masks.iter().enumerate() {
        assert_ne!(m, 0, "{label}: cell {i} has no surviving candidate");
        assert_eq!(
            m & !legal,
            0,
            "{label}: cell {i} mask has out-of-range bits"
        );
    }
}

// ═══ sudoku ═════════════════════════════════════════════════════════════════

#[wasm_bindgen_test]
fn verb_solve_sudoku() {
    let board = sudoku_4x4_dug();
    let native = sudoku::solve_sudoku(&board, 2, &production(1)).expect("native solves");

    let wire = solve_sudoku(board.clone(), 2, Some(1), None).expect("wire solves");
    assert!(wire.solved());
    assert_eq!(wire.solution_count(), 1);
    assert_eq!(wire.n(), 2);
    assert_eq!(wire.solutions(), native, "wire↔native solution mismatch");
    assert!(!wire.budget_exceeded());

    assert_invalid_input(
        solve_sudoku(vec![0u32; 15], 2, Some(1), None)
            .err()
            .expect("must reject"),
        "solveSudoku short board",
    );
}

#[wasm_bindgen_test]
fn verb_propagate_sudoku() {
    let board = sudoku_4x4_dug();
    let masks = propagate_sudoku(board, 2).expect("wire propagates");
    assert_mask_shape(&masks, 16, 4, "propagateSudoku");
    // Cell 0's only completion is 1 — a singleton after propagation.
    assert_eq!(masks[0], 1 << 1, "the dug cell must pin to 1");

    assert_invalid_input(
        propagate_sudoku(vec![0u32; 15], 2)
            .err()
            .expect("must reject"),
        "propagateSudoku short board",
    );
}

#[wasm_bindgen_test]
fn verb_generate_sudoku() {
    let native = sudoku::generate_board_seeded(2, sudoku::Difficulty::Easy, 4242);
    let wire = generate_sudoku(2, SudokuDifficulty::Easy, 4242.0, Vec::new()).expect("wire deals");
    assert_eq!(wire.len(), 16);
    assert_eq!(wire, native, "wire↔native generated board mismatch");

    assert_invalid_input(
        generate_sudoku(0, SudokuDifficulty::Easy, 1.0, Vec::new())
            .err()
            .expect("must reject"),
        "generateSudoku n=0",
    );
}

// ═══ futoshiki ══════════════════════════════════════════════════════════════

#[wasm_bindgen_test]
fn verb_solve_futoshiki() {
    let (board, pairs) = futoshiki::generate_futoshiki_seeded(4, 99);
    let native =
        futoshiki::solve_futoshiki(&board, 4, &pairs, &production(1)).expect("native solves");

    let flat: Vec<u32> = pairs
        .iter()
        .flat_map(|&(a, b)| [a as u32, b as u32])
        .collect();
    let wire = solve_futoshiki(board, 4, flat, Some(1), None).expect("wire solves");
    assert!(wire.solved());
    assert_eq!(wire.board_size(), 4);
    assert_eq!(wire.solutions(), native, "wire↔native solution mismatch");

    assert_invalid_input(
        solve_futoshiki(vec![0u32; 16], 4, vec![0, 15], Some(1), None)
            .err()
            .expect("must reject"),
        "solveFutoshiki non-adjacent caret",
    );
}

#[wasm_bindgen_test]
fn verb_propagate_futoshiki() {
    let (board, pairs) = futoshiki::generate_futoshiki_seeded(4, 99);
    let flat: Vec<u32> = pairs
        .iter()
        .flat_map(|&(a, b)| [a as u32, b as u32])
        .collect();
    let masks = propagate_futoshiki(board, 4, flat).expect("wire propagates");
    assert_mask_shape(&masks, 16, 4, "propagateFutoshiki");

    assert_invalid_input(
        propagate_futoshiki(vec![0u32; 16], 4, vec![0, 1, 2])
            .err()
            .expect("must reject"),
        "propagateFutoshiki odd pair buffer",
    );
}

#[wasm_bindgen_test]
fn verb_generate_futoshiki() {
    let (nb, np) =
        futoshiki::generate_futoshiki_difficulty_seeded(5, futoshiki::Difficulty::Medium, 7777);
    let wire = generate_futoshiki(5, FutoshikiDifficulty::Medium, 7777.0).expect("wire deals");
    assert_eq!(wire.board(), nb);
    assert_eq!(wire.board_size(), 5);
    assert_eq!(
        wire.inequalities(),
        np.iter()
            .flat_map(|&(a, b)| [a as u32, b as u32])
            .collect::<Vec<u32>>()
    );

    assert_invalid_input(
        generate_futoshiki(8, FutoshikiDifficulty::Easy, 1.0)
            .err()
            .expect("must reject"),
        "generateFutoshiki out-of-band board_size",
    );
}

// ═══ thermo ═════════════════════════════════════════════════════════════════

#[wasm_bindgen_test]
fn verb_solve_thermo() {
    let (board, thermos) = thermo::generate_thermo_seeded(2, sudoku::Difficulty::Easy, 31);
    let native = thermo::solve_thermo(&board, 2, &thermos, &production(1)).expect("native solves");

    let wire = solve_thermo(board, 2, flat_thermos(&thermos), Some(1), None).expect("wire solves");
    assert!(wire.solved());
    assert_eq!(wire.n(), 2);
    assert_eq!(wire.solutions(), native, "wire↔native solution mismatch");

    assert_invalid_input(
        solve_thermo(vec![0u32; 16], 2, vec![1, 0], Some(1), None)
            .err()
            .expect("must reject"),
        "solveThermo 1-cell tube",
    );
}

#[wasm_bindgen_test]
fn verb_propagate_thermo() {
    let (board, thermos) = thermo::generate_thermo_seeded(2, sudoku::Difficulty::Easy, 31);
    let masks = propagate_thermo(board, 2, flat_thermos(&thermos)).expect("wire propagates");
    assert_mask_shape(&masks, 16, 4, "propagateThermo");

    assert_invalid_input(
        propagate_thermo(vec![0u32; 16], 2, vec![2, 0, 99])
            .err()
            .expect("must reject"),
        "propagateThermo out-of-range tube cell",
    );
}

#[wasm_bindgen_test]
fn verb_generate_thermo() {
    let (nb, nt) = thermo::generate_thermo_seeded(2, sudoku::Difficulty::Easy, 555);
    let wire = generate_thermo(2, SudokuDifficulty::Easy, 555.0).expect("wire deals");
    assert_eq!(wire.board(), nb);
    assert_eq!(wire.n(), 2);
    assert_eq!(wire.thermometers(), flat_thermos(&nt));

    assert_invalid_input(
        generate_thermo(0, SudokuDifficulty::Easy, 1.0)
            .err()
            .expect("must reject"),
        "generateThermo n=0",
    );
}

// ═══ killer ═════════════════════════════════════════════════════════════════

#[wasm_bindgen_test]
fn verb_solve_killer() {
    let (board, cages) = killer::generate_killer_seeded(2, sudoku::Difficulty::Easy, 17);
    let native = killer::solve_killer(&board, 2, &cages, &production(1)).expect("native solves");

    let wire =
        solve_killer(board, 2, flat_killer_cages(&cages), Some(1), None).expect("wire solves");
    assert!(wire.solved());
    assert_eq!(wire.n(), 2);
    assert_eq!(wire.solutions(), native, "wire↔native solution mismatch");

    assert_invalid_input(
        solve_killer(vec![0u32; 16], 2, vec![2, 5], Some(1), None)
            .err()
            .expect("must reject"),
        "solveKiller truncated cage buffer",
    );
}

#[wasm_bindgen_test]
fn verb_propagate_killer() {
    let (board, cages) = killer::generate_killer_seeded(2, sudoku::Difficulty::Easy, 17);
    let masks = propagate_killer(board, 2, flat_killer_cages(&cages)).expect("wire propagates");
    assert_mask_shape(&masks, 16, 4, "propagateKiller");

    assert_invalid_input(
        propagate_killer(vec![0u32; 16], 2, vec![1, 3, 99])
            .err()
            .expect("must reject"),
        "propagateKiller out-of-range cage cell",
    );
}

#[wasm_bindgen_test]
fn verb_generate_killer() {
    let (nb, nc) = killer::generate_killer_seeded(2, sudoku::Difficulty::Easy, 909);
    let wire = generate_killer(2, SudokuDifficulty::Easy, 909.0).expect("wire deals");
    assert_eq!(wire.board(), nb);
    assert_eq!(wire.n(), 2);
    assert_eq!(wire.cages(), flat_killer_cages(&nc));

    assert_invalid_input(
        generate_killer(0, SudokuDifficulty::Easy, 1.0)
            .err()
            .expect("must reject"),
        "generateKiller n=0",
    );
}

// ═══ kenken ═════════════════════════════════════════════════════════════════

#[wasm_bindgen_test]
fn verb_solve_kenken() {
    let (board, cages) = kenken::generate_kenken_seeded(4, futoshiki::Difficulty::Easy, 23);
    let native = kenken::solve_kenken(&board, 4, &cages, &production(1)).expect("native solves");

    let wire =
        solve_kenken(board, 4, flat_kenken_cages(&cages), Some(1), None).expect("wire solves");
    assert!(wire.solved());
    assert_eq!(wire.board_size(), 4);
    assert_eq!(wire.solutions(), native, "wire↔native solution mismatch");

    assert_invalid_input(
        solve_kenken(vec![0u32; 16], 4, vec![2, 9, 3, 0, 1], Some(1), None)
            .err()
            .expect("must reject"),
        "solveKenKen unknown operator ordinal",
    );
}

#[wasm_bindgen_test]
fn verb_propagate_kenken() {
    let (board, cages) = kenken::generate_kenken_seeded(4, futoshiki::Difficulty::Easy, 23);
    let masks = propagate_kenken(board, 4, flat_kenken_cages(&cages)).expect("wire propagates");
    assert_mask_shape(&masks, 16, 4, "propagateKenKen");

    assert_invalid_input(
        propagate_kenken(vec![0u32; 16], 4, vec![2, 1, 3, 0])
            .err()
            .expect("must reject"),
        "propagateKenKen truncated cage buffer",
    );
}

#[wasm_bindgen_test]
fn verb_generate_kenken() {
    let (nb, nc) = kenken::generate_kenken_seeded(5, futoshiki::Difficulty::Hard, 606);
    let wire = generate_kenken(5, FutoshikiDifficulty::Hard, 606.0).expect("wire deals");
    assert_eq!(wire.board(), nb);
    assert_eq!(wire.board_size(), 5);
    assert_eq!(wire.cages(), flat_kenken_cages(&nc));

    assert_invalid_input(
        generate_kenken(2, FutoshikiDifficulty::Easy, 1.0)
            .err()
            .expect("must reject"),
        "generateKenKen out-of-band board_size",
    );
}
