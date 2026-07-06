//! Tier 1 — the signature fast path.
//!
//! When source and target forms are topologically compatible the trivial
//! `i<->i` zip is provably the unique correct subpath assignment, so the
//! CSP solver is skipped entirely. Only the O(n) winning pairs run the
//! per-pair geometry pipeline.

use super::pairwise::build_pair;
use crate::scratch::PairScratch;
use crate::signature::compare_signatures;
use crate::types::{CorrespondenceHints, FormDef, PairwiseAlignment, Role};

/// Topological-compatibility predicate for the Tier 1 fast path.
///
/// Returns `true` iff the trivial `i<->i` zip is provably the unique
/// correct subpath assignment. Checks:
/// 1. Identical total and per-role subpath counts.
/// 2. Index-by-index role agreement.
/// 3. For roles with >1 subpath per side, exact signature equality.
///
/// Ported from `align.ts::signaturesMatch`.
pub(super) fn signatures_match(source: &FormDef, target: &FormDef) -> bool {
    let src = &source.subpaths;
    let tgt = &target.subpaths;
    if src.len() != tgt.len() {
        return false;
    }

    // Per-role count check.
    let (mut src_outer, mut src_counter) = (0usize, 0usize);
    for s in src {
        match s.role {
            Role::Outer => src_outer += 1,
            Role::Counter => src_counter += 1,
        }
    }
    let (mut tgt_outer, mut tgt_counter) = (0usize, 0usize);
    for t in tgt {
        match t.role {
            Role::Outer => tgt_outer += 1,
            Role::Counter => tgt_counter += 1,
        }
    }
    if src_outer != tgt_outer || src_counter != tgt_counter {
        return false;
    }

    // Role sequencing check.
    for i in 0..src.len() {
        if src[i].role != tgt[i].role {
            return false;
        }
    }

    // Ambiguity guard: when a role has >1 subpath per side, require
    // exact signature equality index-by-index.
    if src_outer > 1 && !signatures_equal_for_role(src, tgt, Role::Outer) {
        return false;
    }
    if src_counter > 1 && !signatures_equal_for_role(src, tgt, Role::Counter) {
        return false;
    }

    true
}

fn signatures_equal_for_role(
    src: &[crate::types::Subpath],
    tgt: &[crate::types::Subpath],
    role: Role,
) -> bool {
    for i in 0..src.len() {
        if src[i].role != role {
            continue;
        }
        if compare_signatures(&src[i].signature, &tgt[i].signature) != std::cmp::Ordering::Equal {
            return false;
        }
    }
    true
}

/// Tier 1 emission — trivially zip the two canonical-sorted subpath
/// arrays and hand each pair to `build_pair`.
///
/// Ported from `align.ts::emitCanonicalPairs`.
pub(super) fn emit_canonical_pairs(
    source: &FormDef,
    target: &FormDef,
    hints: Option<&CorrespondenceHints>,
    ps: &mut PairScratch,
) -> PairwiseAlignment {
    let n = source.subpaths.len();
    let mut pairs = Vec::with_capacity(n);
    for i in 0..n {
        pairs.push(build_pair(
            &source.subpaths[i],
            &target.subpaths[i],
            i,
            i,
            hints,
            ps,
        ));
    }
    PairwiseAlignment {
        source_form_id: source.id.clone(),
        target_form_id: target.id.clone(),
        pairs,
        unmatched_source: Vec::new(),
        unmatched_target: Vec::new(),
    }
}
