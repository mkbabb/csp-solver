//! Native↔wasm parity for the Futoshiki flat wire (G6) + adjacency
//! negative-controls (G3, wasm boundary).
//!
//! Extends the W6 client-solve parity discipline: the crate's solver and
//! `SimpleRng` are pure-integer, so `generate_futoshiki_seeded` and the
//! `Ac3`+`Mrv` solve are bit-identical on native and wasm. The check that
//! matters is therefore that the wasm *wire* (`solveFutoshiki` /
//! `generateFutoshiki` — flat `Uint32Array` marshaling + `from_parts`
//! validation) never diverges from the crate's native path reached
//! directly. Both run here under `wasm-pack test --node`; a mismatch is a
//! wire-marshaling bug, the exact silent client↔server divergence this
//! harness exists to catch.
//!
//! G6 bar: 0 mismatches across fixed + generated boards at N∈{4..7}.
//! G3 bar: a non-adjacent / out-of-range inequality throws a coded
//! `INVALID_INPUT`, never a silent accept.
//!
//! Run via `wasm-pack test --node` from `csp-solver/wasm/`.

#![cfg(target_arch = "wasm32")]

use csp_solver::ordering::Ordering;
use csp_solver::puzzles::futoshiki::{
    FutoshikiPuzzle, create_futoshiki_csp, generate_futoshiki_seeded,
};
use csp_solver::{Pruning, SolveConfig};
use csp_solver_wasm::{generate_futoshiki, solve_futoshiki};
use wasm_bindgen::JsValue;
use wasm_bindgen_test::*;

// `wasm-bindgen-test` defaults to the Node runner under `wasm-pack test
// --node`; the absence of a `wasm_bindgen_test_configure!(run_in_browser)`
// line is how you opt into it.

fn fixed_cells(board: &[u32]) -> Vec<(usize, u32)> {
    board
        .iter()
        .enumerate()
        .filter(|&(_, &v)| v != 0)
        .map(|(i, &v)| (i, v))
        .collect()
}

fn flat_ineq(pairs: &[(usize, usize)]) -> Vec<u32> {
    pairs
        .iter()
        .flat_map(|&(a, b)| [a as u32, b as u32])
        .collect()
}

/// The native path the PyO3 server solve takes: `Ac3` + `Mrv`,
/// `max_solutions = 1`, via `solve_with_given(&[])` — byte-for-byte the
/// config *and* entry point the wasm wire uses, so their first solutions
/// must agree even for under-constrained boards.
fn native_first(puzzle: &FutoshikiPuzzle) -> Option<Vec<u32>> {
    let mut csp = create_futoshiki_csp(puzzle);
    let config = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::Mrv,
        max_solutions: 1,
        ..Default::default()
    };
    csp.solve_with_given(&config, &[]).into_iter().next()
}

/// Assert the wasm wire's first solution matches the native path's — or
/// that both agree the board is unsatisfiable.
fn assert_parity(board: &[u32], n: u32, pairs: &[(usize, usize)], label: &str) {
    let puzzle = FutoshikiPuzzle::from_parts(n, fixed_cells(board), pairs.to_vec())
        .unwrap_or_else(|e| panic!("{label}: from_parts rejected a valid board: {e}"));
    let native = native_first(&puzzle);

    let result = solve_futoshiki(board.to_vec(), n, flat_ineq(pairs), Some(1), None)
        .unwrap_or_else(|_| panic!("{label}: wire solve threw on a valid board"));

    match native {
        Some(sol) => {
            assert!(result.solved(), "{label}: native solved but wire did not");
            assert_eq!(result.solution_count(), 1, "{label}: wire solution_count");
            assert_eq!(result.board_size(), n, "{label}: wire board_size");
            assert_eq!(
                result.solutions(),
                sol,
                "{label}: wire↔native solution mismatch"
            );
        }
        None => assert!(
            !result.solved(),
            "{label}: wire solved but native found none"
        ),
    }
}

fn err_code(err: JsValue) -> Option<String> {
    js_sys::Reflect::get(&err, &JsValue::from_str("code"))
        .ok()
        .and_then(|c| c.as_string())
}

// ---------------------------------------------------------------------------
// G6 — native↔wasm parity, 0 mismatches
// ---------------------------------------------------------------------------

#[wasm_bindgen_test]
fn parity_generated_boards_n4_to_n7() {
    for n in 4..=7u32 {
        for &seed in &[1u64, 7, 42, 12345] {
            let (board, pairs) = generate_futoshiki_seeded(n, seed);
            assert_parity(&board, n, &pairs, &format!("gen n={n} seed={seed}"));
        }
    }
}

#[wasm_bindgen_test]
fn parity_fixed_boards() {
    // A solved 4×4 Latin square, all givens, no inequalities → the solution
    // is the board itself, uniquely.
    let solved = vec![1, 2, 3, 4, 2, 1, 4, 3, 3, 4, 1, 2, 4, 3, 2, 1];
    assert_parity(&solved, 4, &[], "fixed full 4x4");

    // Same square with cell 0 blanked and an adjacent caret cell_1 > cell_0
    // ((0,0)↔(0,1)) — the value is forced back to 1.
    let mut dug = solved.clone();
    dug[0] = 0;
    assert_parity(&dug, 4, &[(1, 0)], "fixed dug 4x4 + caret");

    // Empty, under-constrained boards — first-solution parity still holds.
    assert_parity(&[0u32; 16], 4, &[], "fixed empty 4x4");
    assert_parity(
        &[0u32; 25],
        5,
        &[(1, 0), (5, 0)],
        "fixed empty 5x5 + carets",
    );
}

#[wasm_bindgen_test]
fn generate_wire_matches_native_n4_to_n7() {
    for n in 4..=7u32 {
        for &seed in &[1u64, 42, 12345] {
            let (nb, np) = generate_futoshiki_seeded(n, seed);
            let wire = generate_futoshiki(n, seed as f64).expect("wire generate");
            assert_eq!(wire.board(), nb, "board mismatch n={n} seed={seed}");
            assert_eq!(
                wire.inequalities(),
                flat_ineq(&np),
                "inequality mismatch n={n} seed={seed}"
            );
            assert_eq!(
                wire.board_size(),
                n,
                "board_size mismatch n={n} seed={seed}"
            );
        }
    }
}

// ---------------------------------------------------------------------------
// G3 — adjacency / range negative-controls (wasm boundary)
// ---------------------------------------------------------------------------

#[wasm_bindgen_test]
fn non_adjacent_pair_is_invalid_input() {
    // cell 0 (0,0) ↔ cell 15 (3,3): opposite corners, Manhattan distance 6.
    let err = solve_futoshiki(vec![0u32; 16], 4, vec![0, 15], Some(1), None)
        .err()
        .expect("expected an error");
    assert_eq!(err_code(err).as_deref(), Some("INVALID_INPUT"));
}

#[wasm_bindgen_test]
fn diagonal_pair_is_invalid_input() {
    // cell 0 (0,0) ↔ cell 5 (1,1): diagonal, Manhattan distance 2 — no shared edge.
    let err = solve_futoshiki(vec![0u32; 16], 4, vec![0, 5], Some(1), None)
        .err()
        .expect("expected an error");
    assert_eq!(err_code(err).as_deref(), Some("INVALID_INPUT"));
}

#[wasm_bindgen_test]
fn out_of_range_index_is_invalid_input() {
    let err = solve_futoshiki(vec![0u32; 16], 4, vec![0, 99], Some(1), None)
        .err()
        .expect("expected an error");
    assert_eq!(err_code(err).as_deref(), Some("INVALID_INPUT"));
}

#[wasm_bindgen_test]
fn odd_inequality_buffer_is_invalid_input() {
    let err = solve_futoshiki(vec![0u32; 16], 4, vec![0, 1, 2], Some(1), None)
        .err()
        .expect("expected an error");
    assert_eq!(err_code(err).as_deref(), Some("INVALID_INPUT"));
}

#[wasm_bindgen_test]
fn wrong_board_length_is_invalid_input() {
    let err = solve_futoshiki(vec![0u32; 10], 4, vec![], Some(1), None)
        .err()
        .expect("expected an error");
    assert_eq!(err_code(err).as_deref(), Some("INVALID_INPUT"));
}

#[wasm_bindgen_test]
fn generate_out_of_range_board_size_is_invalid_input() {
    let low = generate_futoshiki(3, 1.0).err().expect("expected an error");
    assert_eq!(err_code(low).as_deref(), Some("INVALID_INPUT"));
    let high = generate_futoshiki(8, 1.0).err().expect("expected an error");
    assert_eq!(err_code(high).as_deref(), Some("INVALID_INPUT"));
}
