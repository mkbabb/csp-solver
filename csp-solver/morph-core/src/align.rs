//! Pairwise form alignment — the morph pipeline orchestrator.
//!
//! Ported from `bbnf-buddy/src/forms/align.ts`. Implements the full
//! 9-step alignment pipeline with two-tier dispatch:
//!
//! - **Tier 1 (signature fast path)**: when source and target forms
//!   have topologically-compatible subpath layouts, the trivial `i<->i`
//!   zip is provably correct and the CSP solver is skipped.
//!
//! - **Tier 2 (CSP via native `AssignmentBuilder`)**: builds a dense
//!   cost matrix, hands it to [`csp_solver::assignment()`] as a direct
//!   native rlib call (zero FFI overhead), and converts the solution
//!   to a `PairwiseAlignment`.

use crate::contour::{bbox_iou, centroid};
use crate::procrustes::{apply_procrustes, procrustes_2d};
use crate::resample::{
    best_rotation_offset, resample_contour, rotate_contour, weighted_rotation_offset,
};
use crate::scratch::AlignScratch;
use crate::signature::compare_signatures;
use crate::types::{
    AlignInternalResult, CorrespondenceHints, FormDef, PairwiseAlignment, ProcrustesResult, Role,
    Segment, Subpath, SubpathPair, Vec2,
};

/// Per-unmatched-row objective penalty. Large enough to dominate any
/// matched-pair cost and force the solver to prefer a matched assignment
/// whenever one is feasible.
///
/// Matches the TS constant in `align.ts`.
pub const UNMATCH_PENALTY: f64 = 1e6;

/// Weight for the alignment-residual term in the Tier 2 cost matrix.
/// `M[i][k] = pair_cost(i,k) + ALIGN_RESIDUAL_WEIGHT * residual(i,k)`.
///
/// Matches the TS constant in `align.ts`.
pub const ALIGN_RESIDUAL_WEIGHT: f64 = 0.5;

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

    if !has_subpath_hints && signatures_match(source, target) {
        return emit_canonical_pairs(source, target, hints);
    }

    // Tier 2 — CSP via native AssignmentBuilder.
    align_forms_csp(source, target, hints, scratch)
}

// -- Tier 1 — signature fast path --------------------------------------------

/// Topological-compatibility predicate for the Tier 1 fast path.
///
/// Returns `true` iff the trivial `i<->i` zip is provably the unique
/// correct subpath assignment. Checks:
/// 1. Identical total and per-role subpath counts.
/// 2. Index-by-index role agreement.
/// 3. For roles with >1 subpath per side, exact signature equality.
///
/// Ported from `align.ts::signaturesMatch`.
fn signatures_match(source: &FormDef, target: &FormDef) -> bool {
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
    if src_outer > 1 {
        for i in 0..src.len() {
            if src[i].role != Role::Outer {
                continue;
            }
            if compare_signatures(&src[i].signature, &tgt[i].signature) != std::cmp::Ordering::Equal
            {
                return false;
            }
        }
    }
    if src_counter > 1 {
        for i in 0..src.len() {
            if src[i].role != Role::Counter {
                continue;
            }
            if compare_signatures(&src[i].signature, &tgt[i].signature) != std::cmp::Ordering::Equal
            {
                return false;
            }
        }
    }

    true
}

/// Tier 1 emission — trivially zip the two canonical-sorted subpath
/// arrays and hand each pair to `build_pair`.
///
/// Ported from `align.ts::emitCanonicalPairs`.
fn emit_canonical_pairs(
    source: &FormDef,
    target: &FormDef,
    hints: Option<&CorrespondenceHints>,
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
            None,
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

// -- Tier 2 — CSP cost matrix scoring ----------------------------------------

/// Cost of pairing two classified subpaths. Weighted combination of
/// centroid distance, bbox-IoU mismatch, and log-area ratio.
///
/// Ported from `align.ts::pairCost`.
fn pair_cost(a: &Subpath, b: &Subpath) -> f64 {
    let ca = centroid(&a.segments);
    let cb = centroid(&b.segments);
    let centroid_dist = ((ca[0] - cb[0]).powi(2) + (ca[1] - cb[1]).powi(2)).sqrt();

    let iou = bbox_iou(&a.bbox, &b.bbox);

    let area_a = a.signed_area.abs().max(1e-3);
    let area_b = b.signed_area.abs().max(1e-3);
    let area_ratio = (area_a / area_b).ln().abs();

    0.5 * centroid_dist + 0.3 * (1.0 - iou) + 0.2 * area_ratio
}

/// Tier 2 dispatcher: build cost matrix + call native `AssignmentBuilder`.
///
/// Ported from the Tier 2 path of `align.ts::alignForms`.
fn align_forms_csp(
    source: &FormDef,
    target: &FormDef,
    hints: Option<&CorrespondenceHints>,
    scratch: &mut AlignScratch,
) -> PairwiseAlignment {
    let n_src = source.subpaths.len();
    let n_tgt = target.subpaths.len();

    scratch.prepare(n_src, n_tgt);

    // Build cost matrix + residual cache.
    for i in 0..n_src {
        let src_role = source.subpaths[i].role;
        for k in 0..n_tgt {
            let base = i * n_tgt + k;
            if src_role == target.subpaths[k].role {
                let r = align_pair_internal(
                    &source.subpaths[i],
                    &target.subpaths[k],
                    hints,
                    Some(i),
                    Some(k),
                );
                scratch.cost_matrix[base] = pair_cost(&source.subpaths[i], &target.subpaths[k])
                    + ALIGN_RESIDUAL_WEIGHT * r.residual;
                scratch.residual_cache[base] = Some(r);
            } else {
                scratch.cost_matrix[base] = CROSS_ROLE_COST;
            }
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

    // Shape the assignment back into SubpathPair records.
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
        let cached = scratch.residual_cache[i * n_tgt + k_usize].take();
        pairs.push(build_pair(
            &source.subpaths[i],
            &target.subpaths[k_usize],
            i,
            k_usize,
            hints,
            cached,
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

// -- Steps 4-8 — per-pair alignment ------------------------------------------

/// Run steps 4-8 of the alignment pipeline for a single `(src, tgt)`
/// subpath pair. Returns everything both the cost-matrix scorer and
/// the pair emitter need.
///
/// Pure function — does not mutate inputs. Deterministic.
///
/// Ported from `align.ts::alignPairInternal`.
pub fn align_pair_internal(
    src: &Subpath,
    tgt: &Subpath,
    hints: Option<&CorrespondenceHints>,
    source_index: Option<usize>,
    target_index: Option<usize>,
) -> AlignInternalResult {
    // Step 4 — centroid + scale normalization.
    let src_centroid = centroid(&src.segments);
    let tgt_centroid = centroid(&tgt.segments);

    let src_area = src.signed_area.abs();
    let tgt_area = tgt.signed_area.abs();
    let area_ratio = if tgt_area > 1e-6 && src_area > 1e-6 {
        (tgt_area / src_area).sqrt()
    } else {
        1.0
    };

    let src_normalized = translate_and_scale(&src.segments, src_centroid, 1.0);
    let tgt_normalized = translate_and_scale(&tgt.segments, tgt_centroid, 1.0 / area_ratio);

    // Step 5 — arc-length resampling to a common anchor count.
    let n = src.segments.len().max(tgt.segments.len());
    let src_resampled = if src.segments.len() == n {
        src_normalized
    } else {
        resample_contour(&src_normalized, n)
    };
    let mut tgt_resampled = if tgt.segments.len() == n {
        tgt_normalized
    } else {
        resample_contour(&tgt_normalized, n)
    };

    // Step 6 — rotational start-index alignment.
    let rotation_offset = best_rotation_offset(&tgt_resampled, &src_resampled);
    tgt_resampled = rotate_contour(&tgt_resampled, rotation_offset);
    let mut shift = rotation_offset;

    // Step 7 — Procrustes fine-alignment (opt-in).
    let mut procrustes_params = ProcrustesResult::default();
    if hints.is_some_and(|h| h.procrustes) {
        let src_points: Vec<Vec2> = src_resampled.iter().map(|s| s.point).collect();
        let tgt_points: Vec<Vec2> = tgt_resampled.iter().map(|s| s.point).collect();
        let result = procrustes_2d(&tgt_points, &src_points);
        procrustes_params = result;

        let cos = result.theta.cos();
        let sin = result.theta.sin();
        tgt_resampled = tgt_resampled
            .into_iter()
            .map(|s| {
                let new_point = apply_procrustes(&result, s.point);
                let rotate_handle = |h: Vec2| -> Vec2 {
                    [
                        result.scale * (cos * h[0] - sin * h[1]),
                        result.scale * (sin * h[0] + cos * h[1]),
                    ]
                };
                Segment {
                    id: s.id,
                    point: new_point,
                    handle_in: rotate_handle(s.handle_in),
                    handle_out: rotate_handle(s.handle_out),
                }
            })
            .collect();
    }

    // Step 8 — manual point-pair hints (soft constraint).
    if let (Some(hints), Some(si), Some(ti)) = (hints, source_index, target_index)
        && !hints.point_pairs.is_empty()
    {
        let relevant: Vec<_> = hints
            .point_pairs
            .iter()
            .filter(|h| h.source_subpath == si && h.target_subpath == ti)
            .collect();
        if !relevant.is_empty() {
            let mut weights = vec![1.0_f64; n];
            for h in &relevant {
                if h.source_index < n {
                    weights[h.source_index] = 10.0; // bias factor
                }
            }
            let offset = weighted_rotation_offset(&tgt_resampled, &src_resampled, &weights);
            if offset != 0 {
                tgt_resampled = rotate_contour(&tgt_resampled, offset);
                shift = (shift + offset) % n;
            }
        }
    }

    // Residual — sum of squared point distances in the normalized frame.
    let mut residual = 0.0_f64;
    for j in 0..n {
        let dx = tgt_resampled[j].point[0] - src_resampled[j].point[0];
        let dy = tgt_resampled[j].point[1] - src_resampled[j].point[1];
        residual += dx * dx + dy * dy;
    }

    // Undo centroid/scale normalization.
    let src_final = translate_and_scale(&src_resampled, [-src_centroid[0], -src_centroid[1]], 1.0);
    let mut tgt_final = translate_and_scale(
        &tgt_resampled,
        [-tgt_centroid[0] / area_ratio, -tgt_centroid[1] / area_ratio],
        area_ratio,
    );

    // Inherit source ids on the target.
    for (i, seg) in tgt_final.iter_mut().enumerate() {
        if let Some(src_seg) = src_final.get(i) {
            seg.id = src_seg.id;
        }
    }

    AlignInternalResult {
        residual,
        src_final,
        tgt_final,
        shift,
        procrustes: procrustes_params,
    }
}

/// Shape an `AlignInternalResult` into a `SubpathPair` for output.
/// When `cached` is `Some`, reuses it directly; otherwise runs
/// `align_pair_internal`.
///
/// Ported from `align.ts::buildPair`.
fn build_pair(
    src: &Subpath,
    tgt: &Subpath,
    source_index: usize,
    target_index: usize,
    hints: Option<&CorrespondenceHints>,
    cached: Option<AlignInternalResult>,
) -> SubpathPair {
    let r = cached.unwrap_or_else(|| {
        align_pair_internal(src, tgt, hints, Some(source_index), Some(target_index))
    });
    SubpathPair {
        source_index,
        target_index,
        source_segments: r.src_final,
        target_segments: r.tgt_final,
    }
}

/// Translate and scale a segment array.
///
/// Each point becomes `(point - translate) * scale`; handles are scaled
/// but not translated (they are offsets).
///
/// Ported from `align.ts::translateAndScale`.
fn translate_and_scale(segments: &[Segment], translate: Vec2, scale: f64) -> Vec<Segment> {
    segments
        .iter()
        .map(|s| Segment {
            id: s.id,
            point: [
                (s.point[0] - translate[0]) * scale,
                (s.point[1] - translate[1]) * scale,
            ],
            handle_in: [s.handle_in[0] * scale, s.handle_in[1] * scale],
            handle_out: [s.handle_out[0] * scale, s.handle_out[1] * scale],
        })
        .collect()
}
