//! Tier 2 — CSP assignment via the native `AssignmentBuilder`.
//!
//! The cost matrix is scored with the **cheap** topology+centroid metric
//! ([`pair_cost`], all O(1) given the precomputed `Subpath.centroid`),
//! the assignment is solved, and only then does the O(n) winning set run
//! the full per-pair geometry pipeline ([`build_pair`]). This is the
//! lazy split: scoring is decoupled from materialization, so the
//! expensive resample+rotate+Procrustes pipeline runs O(n) times, not
//! O(n²).

use super::pairwise::build_pair;
use super::{CROSS_ROLE_COST, UNMATCH_PENALTY};
use crate::contour::bbox_iou;
use crate::scratch::AlignScratch;
use crate::types::{CorrespondenceHints, FormDef, PairwiseAlignment, Subpath};

/// Cost of pairing two classified subpaths. Weighted combination of
/// centroid distance, bbox-IoU mismatch, and log-area ratio — every term
/// is O(1) because the centroid is read from the precomputed
/// [`Subpath::centroid`](crate::types::Subpath::centroid) field rather
/// than re-densifying the contour.
///
/// Ported from `align.ts::pairCost`.
pub(super) fn pair_cost(a: &Subpath, b: &Subpath) -> f64 {
    let ca = a.centroid;
    let cb = b.centroid;
    let centroid_dist = ((ca[0] - cb[0]).powi(2) + (ca[1] - cb[1]).powi(2)).sqrt();

    let iou = bbox_iou(&a.bbox, &b.bbox);

    let area_a = a.signed_area.abs().max(1e-3);
    let area_b = b.signed_area.abs().max(1e-3);
    let area_ratio = (area_a / area_b).ln().abs();

    0.5 * centroid_dist + 0.3 * (1.0 - iou) + 0.2 * area_ratio
}

/// Tier 2 dispatcher: score cost matrix + call native `AssignmentBuilder`
/// + materialize winning pairs.
///
/// Ported from the Tier 2 path of `align.ts::alignForms`.
pub(super) fn align_forms_csp(
    source: &FormDef,
    target: &FormDef,
    hints: Option<&CorrespondenceHints>,
    scratch: &mut AlignScratch,
) -> PairwiseAlignment {
    let n_src = source.subpaths.len();
    let n_tgt = target.subpaths.len();

    scratch.prepare(n_src, n_tgt);

    // Score the cost matrix with the cheap topology+centroid metric only.
    // The per-pair geometry pipeline is deferred to the winning pairs
    // (see below) — scoring never materializes an alignment.
    for i in 0..n_src {
        let src_role = source.subpaths[i].role;
        for k in 0..n_tgt {
            let base = i * n_tgt + k;
            scratch.cost_matrix[base] = if src_role == target.subpaths[k].role {
                pair_cost(&source.subpaths[i], &target.subpaths[k])
            } else {
                CROSS_ROLE_COST
            };
        }
    }

    // Role tags.
    for i in 0..n_src {
        scratch.row_groups[i] = source.subpaths[i].role.tag();
    }
    for k in 0..n_tgt {
        scratch.col_groups[k] = target.subpaths[k].role.tag();
    }

    // Hard subpath hints -> pins.
    let hint_pairs: Vec<(usize, i32)> = hints
        .map(|h| {
            h.subpath_pairs
                .iter()
                .map(|p| (p.source, p.target as i32))
                .collect()
        })
        .unwrap_or_default();

    // Call native AssignmentBuilder — zero FFI overhead.
    let cost_matrix_ref = &scratch.cost_matrix;
    let row_groups_ref = &scratch.row_groups;
    let col_groups_ref = &scratch.col_groups;

    let mut builder = csp_solver::assignment()
        .rows(n_src)
        .cols(n_tgt)
        .cost(|i, k| cost_matrix_ref[i * n_tgt + k])
        .row_group(|i| row_groups_ref[i])
        .col_group(|k| col_groups_ref[k])
        .unmatch_penalty(UNMATCH_PENALTY);

    for &(row, col) in &hint_pairs {
        builder = builder.pin(row, col);
    }

    let solution = builder.solve().expect("alignment CSP must be solvable");

    // Materialize only the winning pairs — O(n) geometry-pipeline runs.
    let mut pairs = Vec::new();
    let mut unmatched_source = Vec::new();
    let mut unmatched_target_set: Vec<bool> = vec![true; n_tgt];

    for i in 0..n_src {
        let k = solution.assign[i];
        if k < 0 {
            unmatched_source.push(i);
            continue;
        }
        let k_usize = k as usize;
        pairs.push(build_pair(
            &source.subpaths[i],
            &target.subpaths[k_usize],
            i,
            k_usize,
            hints,
            &mut scratch.pair,
        ));
        unmatched_target_set[k_usize] = false;
    }

    let unmatched_target: Vec<usize> = (0..n_tgt).filter(|&k| unmatched_target_set[k]).collect();

    PairwiseAlignment {
        source_form_id: source.id.clone(),
        target_form_id: target.id.clone(),
        pairs,
        unmatched_source,
        unmatched_target,
    }
}
