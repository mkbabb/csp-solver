//! Pairwise form alignment — the morph pipeline orchestrator.
//!
//! Ported from `bbnf-buddy/src/forms/align.ts`.

use crate::scratch::AlignScratch;
use crate::types::{CorrespondenceHints, FormDef, PairwiseAlignment};

/// Compute a pairwise alignment between two forms.
///
/// Tier 1 (signature fast path) is attempted first; if it fails,
/// falls through to Tier 2 (CSP via native `AssignmentBuilder`).
///
/// `scratch` is a pre-allocated arena reused across calls to avoid
/// per-invocation allocation overhead.
pub fn align_forms(
    _source: &FormDef,
    _target: &FormDef,
    _hints: Option<&CorrespondenceHints>,
    _scratch: &mut AlignScratch,
) -> PairwiseAlignment {
    todo!("2C-03: port align orchestration")
}
