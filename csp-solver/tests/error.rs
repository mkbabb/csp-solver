//! `CspError` taxonomy tests — migrated from `src/error.rs`'s formerly-inline
//! `#[cfg(test)] mod tests` (owner constraint 3, tests live in `tests/` only).
//!
//! Two-pass migration: pass 1 moved the module verbatim; pass 2 decomposed
//! `every_variant_has_a_stable_code`'s four inline assertions into one test
//! per variant so each `code()` mapping has its own named, independently
//! failing contract. Zero-widening — every assertion below is the same
//! assertion the inline module made, just regrouped; no new inputs or
//! variants are exercised.

use csp_solver::CspError;

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
