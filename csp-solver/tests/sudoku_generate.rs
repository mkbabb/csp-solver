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

use csp_solver::sudoku::{
    Difficulty, embedded_template_count, embedded_templates, generate_board,
    generate_board_with_templates,
};

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
