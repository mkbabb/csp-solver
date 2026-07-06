//! Pairwise form alignment — the morph pipeline orchestrator.
//!
//! Ported from `bbnf-buddy/src/forms/align.ts`. Implements the full
//! 9-step alignment pipeline with two-tier dispatch, decomposed into
//! three cohesive submodules:
//!
//! - [`tier1`] — the signature fast path: when source and target forms
//!   have topologically-compatible subpath layouts, the trivial `i<->i`
//!   zip is provably correct and the CSP solver is skipped.
//! - [`tier2`] — the CSP path via the native `AssignmentBuilder`: scores
//!   a dense cost matrix with the cheap topology+centroid metric, solves
//!   the assignment, and materializes only the winning pairs.
//! - [`pairwise`] — steps 4-8, the per-pair geometry pipeline shared by
//!   both tiers.
//!
//! The only public entry point is [`align_forms`].

mod pairwise;
mod tier1;
mod tier2;

use crate::scratch::AlignScratch;
use crate::types::{CorrespondenceHints, FormDef, PairwiseAlignment};

/// Per-unmatched-row objective penalty. Large enough to dominate any
/// matched-pair cost and force the solver to prefer a matched assignment
/// whenever one is feasible.
///
/// Matches the TS constant in `align.ts`.
pub const UNMATCH_PENALTY: f64 = 1e6;

/// Sentinel cost for cross-role cells in the cost matrix. Two orders
/// of magnitude above `UNMATCH_PENALTY` to keep it strictly dominant.
///
/// Matches the TS constant `CROSS_ROLE_COST = UNMATCH_PENALTY * 100`.
pub const CROSS_ROLE_COST: f64 = UNMATCH_PENALTY * 100.0;

/// Minimum common resample count for subpath pairs.
pub const MIN_RESAMPLE: usize = 32;

/// Compute a pairwise alignment between two forms.
///
/// Tier 1 (signature fast path) is attempted first; if it fails,
/// falls through to Tier 2 (CSP via native `AssignmentBuilder`).
///
/// `scratch` is a pre-allocated arena reused across calls to avoid
/// per-invocation allocation overhead.
///
/// Ported from `align.ts::alignForms`.
pub fn align_forms(
    source: &FormDef,
    target: &FormDef,
    hints: Option<&CorrespondenceHints>,
    scratch: &mut AlignScratch,
) -> PairwiseAlignment {
    let n_src = source.subpaths.len();
    let n_tgt = target.subpaths.len();

    // Degenerate-cardinality short-circuit.
    if n_src == 0 || n_tgt == 0 {
        return PairwiseAlignment {
            source_form_id: source.id.clone(),
            target_form_id: target.id.clone(),
            pairs: Vec::new(),
            unmatched_source: (0..n_src).collect(),
            unmatched_target: (0..n_tgt).collect(),
        };
    }

    // Tier 1 — signature fast path. Skipped when hard subpathPairs
    // hints are present.
    let has_subpath_hints = hints.is_some_and(|h| !h.subpath_pairs.is_empty());

    if !has_subpath_hints && tier1::signatures_match(source, target) {
        return tier1::emit_canonical_pairs(source, target, hints, &mut scratch.pair);
    }

    // Tier 2 — CSP via native AssignmentBuilder.
    tier2::align_forms_csp(source, target, hints, scratch)
}
