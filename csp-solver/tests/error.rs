//! `CspError` taxonomy tests — migrated from `src/error.rs`'s formerly-inline
//! `#[cfg(test)] mod tests` (owner constraint 3, tests live in `tests/` only).
//!
//! Two-pass migration: pass 1 moved the module verbatim; pass 2 decomposed
//! `every_variant_has_a_stable_code`'s four inline assertions into one test
//! per variant so each `code()` mapping has its own named, independently
//! failing contract. Zero-widening — every assertion below is the same
//! assertion the inline module made, just regrouped; no new inputs or
//! variants are exercised.

use csp_solver::{CspError, SolveStats};

#[test]
fn code_unsatisfiable() {
    assert_eq!(CspError::Unsatisfiable.code(), "UNSATISFIABLE");
}

#[test]
fn code_budget_exceeded() {
    assert_eq!(CspError::BudgetExceeded.code(), "BUDGET_EXCEEDED");
}

#[test]
fn code_invalid_input() {
    assert_eq!(CspError::invalid_input("x").code(), "INVALID_INPUT");
}

#[test]
fn code_timeout() {
    assert_eq!(CspError::Timeout.code(), "TIMEOUT");
}

#[test]
fn unsatisfiable_marker_converts() {
    let e: CspError = csp_solver::Unsatisfiable.into();
    assert_eq!(e, CspError::Unsatisfiable);
}

// ─── `aborted`: the one place an empty result becomes a typed error ──────────
//
// T3's RESERVE kept `Timeout` constructor-less "until cancel-driver"; the
// driver landed (`SolveConfig::cancel` + `SolveStats::cancelled`), so these
// three cases are its declared wire point. Before this, `CspTimeoutError` was
// registered on the Python module and could never be raised.

#[test]
fn aborted_maps_cancellation_to_timeout() {
    let stats = SolveStats {
        cancelled: true,
        ..Default::default()
    };
    assert_eq!(CspError::aborted(&stats), Some(CspError::Timeout));
}

#[test]
fn aborted_maps_budget_to_budget_exceeded() {
    let stats = SolveStats {
        budget_exceeded: true,
        ..Default::default()
    };
    assert_eq!(CspError::aborted(&stats), Some(CspError::BudgetExceeded));
}

#[test]
fn aborted_prefers_cancellation_over_budget() {
    // Both flags can be set — the caller's own act outranks the library's cap.
    let stats = SolveStats {
        cancelled: true,
        budget_exceeded: true,
        ..Default::default()
    };
    assert_eq!(CspError::aborted(&stats), Some(CspError::Timeout));
}

#[test]
fn aborted_is_none_for_a_completed_search() {
    // A search that ran to completion and found nothing is a *proof*, not an
    // abort — never conflated with either stop.
    assert_eq!(CspError::aborted(&SolveStats::default()), None);
}
