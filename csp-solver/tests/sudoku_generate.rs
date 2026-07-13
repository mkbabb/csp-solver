//! Sudoku board-generation / template-bank tests — migrated from
//! `src/puzzles/sudoku/generate.rs`'s formerly-inline `#[cfg(test)] mod
//! tests` (owner constraint 3, tests live in `tests/` only).
//!
//! Every item exercised here (`generate_board`, `generate_board_with_templates`,
//! `embedded_templates`, `embedded_template_count`) is public, so the move is
//! a pure relocation — no `pub(crate)` whitebox re-export was needed. The
//! original module held 3 `#[test]` fns totaling 7 assertions (the R13
//! happy-path check, the R13 mismatch-panics check, and 5 assertions bundled
//! into `embedded_templates_present_and_absent`); this file decomposes that
//! bundle 1:1 into 5 independently named tests, for 7 tests total.
//! Zero-widening — same inputs, same assertions, no new coverage.

use csp_solver::ordering::Ordering;
use csp_solver::sudoku::{
    Difficulty, create_sudoku_csp, embedded_template_count, embedded_templates, generate_board,
    generate_board_seeded, generate_board_with_templates,
};
use csp_solver::{Pruning, SolveConfig};

/// Happy path: a template that genuinely matches its claimed difficulty must
/// not trip the debug consistency assertion (it is silent when the contract
/// holds).
#[test]
fn generate_with_templates_matching_difficulty_does_not_panic() {
    let easy = generate_board(3, Difficulty::Easy);
    let board = generate_board_with_templates(3, Difficulty::Easy, &[easy]);
    assert_eq!(board.len(), 81);
}

/// Mismatch: a trivially-easy board (0 backtracks) served under a `Hard`
/// claim (band `100..=MAX`) must fail the debug assertion loudly — the exact
/// "wrong directory" scenario R13 guards against. Uses an easy board so the
/// measurement is fast and the 0-backtracks result is stable.
///
/// R13 is a `debug_assert!`, compiled out in release — preserved identically
/// at the new home via the same `cfg_attr(not(debug_assertions), ignore)`
/// gate the inline test used.
#[test]
#[cfg_attr(
    not(debug_assertions),
    ignore = "R13 guard is a debug_assert; compiled out in release"
)]
#[should_panic(expected = "does not match its claimed difficulty")]
fn generate_with_templates_mismatched_difficulty_panics_in_debug() {
    let easy = generate_board(3, Difficulty::Easy);
    let _ = generate_board_with_templates(3, Difficulty::Hard, &[easy]);
}

/// The N=3 hard bank is embedded and non-empty.
#[test]
fn embedded_templates_hard_bank_is_nonempty() {
    let hard = embedded_templates(3, Difficulty::Hard);
    assert!(!hard.is_empty(), "N=3 hard bank should be embedded");
}

/// The no-parse count agrees with the parsed length.
#[test]
fn embedded_template_count_matches_parsed_length() {
    let hard = embedded_templates(3, Difficulty::Hard);
    assert_eq!(embedded_template_count(3, Difficulty::Hard), hard.len());
}

/// N=5 medium is deliberately not shipped (rejected at the API) — the embed
/// degrades to an empty vec, not a panic.
#[test]
fn embedded_templates_absent_bank_is_empty() {
    assert!(embedded_templates(5, Difficulty::Medium).is_empty());
}

/// The no-parse count agrees (zero) for an absent bank too.
#[test]
fn embedded_template_count_absent_bank_is_zero() {
    assert_eq!(embedded_template_count(5, Difficulty::Medium), 0);
}

/// Every embedded N=3 easy template parses to a full 81-cell board.
#[test]
fn embedded_easy_templates_parse_to_full_board() {
    for board in embedded_templates(3, Difficulty::Easy) {
        assert_eq!(board.len(), 81);
    }
}

// ─── Live-gen uniqueness (FAM-9) ─────────────────────────────────────────────

/// The served Sudoku sub-grid sizes: 2 (4×4), 3 (9×9), 4 (16×16). Mirrors the
/// frontend's `VALID_SIZES = [2, 3, 4]` (`web/frontend/src/games/sudoku/
/// composables/useUrlState.ts`). N=5 is deliberately unshipped.
const SERVED_SIZES: [u32; 3] = [2, 3, 4];

/// FAM-9 live-gen uniqueness gate — a *dealt* Sudoku puzzle is single-solution
/// at every served size.
///
/// The generator's hole-digger (`generate_board_slow`) keeps a cell removal only
/// when the board stays single-solution (`max_solutions: 2` uniqueness probe at
/// each dig), so what it deals must be unique. This asserts that invariant on
/// **live-generated** boards — `generate_board_seeded` runs the real
/// hole-digging path — as distinct from the static template sweep
/// (`examples/verify_bank_uniqueness.rs`, an example CI never runs). Seeded for
/// determinism; each board is re-solved independently with `max_solutions: 2`
/// and asserted to yield exactly one solution. Cheap enough for every CI run:
/// `Easy` digs the fewest holes (`total/4`), so the per-dig probes and the
/// verify solve stay heavily constrained and fast.
///
/// Pairs with the Futoshiki analog (`tests/futoshiki.rs ::
/// generated_puzzles_are_unique_and_valid`, N=4–7), so both game families' live
/// generators carry a standing uniqueness gate.
#[test]
fn live_generated_boards_are_unique_across_served_sizes() {
    for n in SERVED_SIZES {
        let board = generate_board_seeded(n, Difficulty::Easy, 0x5D_00 + n as u64);
        let total = (n * n * n * n) as usize;
        assert_eq!(
            board.len(),
            total,
            "N={n}: generated board has {} cells, expected {total}",
            board.len()
        );

        let (mut csp, given) = create_sudoku_csp(&board, n);
        let config = SolveConfig {
            pruning: Pruning::Ac3,
            ordering: Ordering::Mrv,
            max_solutions: 2,
            node_budget: Some(50_000_000),
            ..Default::default()
        };
        let solutions = csp.solve_with_given(&config, &given);

        assert!(
            !csp.stats().budget_exceeded,
            "N={n}: uniqueness solve exhausted its node budget — the single-solution verdict is unsafe"
        );
        assert_eq!(
            solutions.len(),
            1,
            "N={n}: a live-generated board must have exactly one solution, got {}",
            solutions.len()
        );
    }
}
