//! Steps 4-8 — the per-pair geometry pipeline.
//!
//! Given a matched `(src, tgt)` subpath pair this normalizes, resamples,
//! rotationally aligns, and (optionally) Procrustes-fine-aligns the two
//! contours, returning the two segment vectors that become a
//! [`SubpathPair`]. Every intermediate contour is drawn from the caller's
//! [`PairScratch`] arena, so on the equal-anchor-count path the only
//! allocations are the two vectors that escape into the result.

use crate::procrustes::{apply_procrustes, procrustes_2d};
use crate::resample::{best_rotation_offset, resample_contour_into, weighted_rotation_offset};
use crate::scratch::PairScratch;
use crate::types::{CorrespondenceHints, Segment, SubpathPair, Vec2};

/// Run steps 4-8 for a single `(src, tgt)` subpath pair, returning
/// `(src_final, tgt_final)` in their original (un-normalized) frames.
///
/// Pure with respect to `src`/`tgt`; `ps` is scratch and its contents
/// after the call are unspecified. Deterministic.
///
/// Ported from `align.ts::alignPairInternal`. The residual/shift/
/// Procrustes-params that the TS port cached are dropped: they were
/// write-only (never read) once the cost matrix stopped scoring on the
/// residual — see `align/tier2.rs`.
pub(super) fn align_pair_internal(
    src: &crate::types::Subpath,
    tgt: &crate::types::Subpath,
    hints: Option<&CorrespondenceHints>,
    source_index: Option<usize>,
    target_index: Option<usize>,
    ps: &mut PairScratch,
) -> (Vec<Segment>, Vec<Segment>) {
    // Step 4 — centroid + scale normalization (centroids are precomputed).
    let src_centroid = src.centroid;
    let tgt_centroid = tgt.centroid;

    let src_area = src.signed_area.abs();
    let tgt_area = tgt.signed_area.abs();
    let area_ratio = if tgt_area > 1e-6 && src_area > 1e-6 {
        (tgt_area / src_area).sqrt()
    } else {
        1.0
    };

    translate_and_scale_into(&src.segments, src_centroid, 1.0, &mut ps.work_src);
    translate_and_scale_into(
        &tgt.segments,
        tgt_centroid,
        1.0 / area_ratio,
        &mut ps.work_tgt,
    );

    // Step 5 — arc-length resampling to a common anchor count. At most one
    // side needs resampling (the shorter one); the resample output lands
    // in a disjoint scratch buffer and is swapped into place.
    let n = src.segments.len().max(tgt.segments.len());
    if src.segments.len() != n {
        resample_contour_into(
            &ps.work_src,
            n,
            &mut ps.poly,
            &mut ps.taken,
            &mut ps.interior,
            &mut ps.resampled,
        );
        std::mem::swap(&mut ps.work_src, &mut ps.resampled);
    }
    if tgt.segments.len() != n {
        resample_contour_into(
            &ps.work_tgt,
            n,
            &mut ps.poly,
            &mut ps.taken,
            &mut ps.interior,
            &mut ps.resampled,
        );
        std::mem::swap(&mut ps.work_tgt, &mut ps.resampled);
    }

    // Step 6 — rotational start-index alignment (rotate target in place).
    let rotation_offset = best_rotation_offset(&ps.work_tgt, &ps.work_src);
    if rotation_offset != 0 {
        ps.work_tgt.rotate_left(rotation_offset);
    }

    // Step 7 — Procrustes fine-alignment (opt-in, default off). Applied
    // in place. The point buffers are local because this path is off in
    // every shipped call; arena-izing an always-off branch is not worth
    // the struct weight.
    if hints.is_some_and(|h| h.procrustes) {
        let src_points: Vec<Vec2> = ps.work_src.iter().map(|s| s.point).collect();
        let tgt_points: Vec<Vec2> = ps.work_tgt.iter().map(|s| s.point).collect();
        let result = procrustes_2d(&tgt_points, &src_points);
        let cos = result.theta.cos();
        let sin = result.theta.sin();
        let rotate_handle = |h: Vec2| -> Vec2 {
            [
                result.scale * (cos * h[0] - sin * h[1]),
                result.scale * (sin * h[0] + cos * h[1]),
            ]
        };
        for s in ps.work_tgt.iter_mut() {
            s.point = apply_procrustes(&result, s.point);
            s.handle_in = rotate_handle(s.handle_in);
            s.handle_out = rotate_handle(s.handle_out);
        }
    }

    // Step 8 — manual point-pair hints (soft constraint). Off unless the
    // caller supplies point pairs for exactly this subpath index pair.
    if let (Some(hints), Some(si), Some(ti)) = (hints, source_index, target_index)
        && !hints.point_pairs.is_empty()
    {
        let mut weights = vec![1.0_f64; n];
        let mut any = false;
        for h in &hints.point_pairs {
            if h.source_subpath == si && h.target_subpath == ti && h.source_index < n {
                weights[h.source_index] = 10.0; // bias factor
                any = true;
            }
        }
        if any {
            let offset = weighted_rotation_offset(&ps.work_tgt, &ps.work_src, &weights);
            if offset != 0 {
                ps.work_tgt.rotate_left(offset);
            }
        }
    }

    // Undo centroid/scale normalization — the two escaping allocations.
    let src_final = translate_and_scale(&ps.work_src, [-src_centroid[0], -src_centroid[1]], 1.0);
    let mut tgt_final = translate_and_scale(
        &ps.work_tgt,
        [-tgt_centroid[0] / area_ratio, -tgt_centroid[1] / area_ratio],
        area_ratio,
    );

    // Inherit source ids on the target.
    for (i, seg) in tgt_final.iter_mut().enumerate() {
        if let Some(src_seg) = src_final.get(i) {
            seg.id = src_seg.id;
        }
    }

    (src_final, tgt_final)
}

/// Materialize a matched pair into a [`SubpathPair`] for output.
///
/// Ported from `align.ts::buildPair`. With the lazy Tier-2 split there is
/// no cached result to reuse — every winning pair is materialized exactly
/// once, here.
pub(super) fn build_pair(
    src: &crate::types::Subpath,
    tgt: &crate::types::Subpath,
    source_index: usize,
    target_index: usize,
    hints: Option<&CorrespondenceHints>,
    ps: &mut PairScratch,
) -> SubpathPair {
    let (src_final, tgt_final) =
        align_pair_internal(src, tgt, hints, Some(source_index), Some(target_index), ps);
    SubpathPair {
        source_index,
        target_index,
        source_segments: src_final,
        target_segments: tgt_final,
    }
}

/// Translate and scale a segment array into a fresh `Vec`.
///
/// Each point becomes `(point - translate) * scale`; handles are scaled
/// but not translated (they are offsets).
///
/// Ported from `align.ts::translateAndScale`.
pub(super) fn translate_and_scale(
    segments: &[Segment],
    translate: Vec2,
    scale: f64,
) -> Vec<Segment> {
    let mut out = Vec::with_capacity(segments.len());
    translate_and_scale_into(segments, translate, scale, &mut out);
    out
}

/// Arena variant of [`translate_and_scale`] — writes into a caller-owned
/// buffer (cleared first), retaining capacity across calls.
pub(super) fn translate_and_scale_into(
    segments: &[Segment],
    translate: Vec2,
    scale: f64,
    out: &mut Vec<Segment>,
) {
    out.clear();
    out.extend(segments.iter().map(|s| Segment {
        id: s.id,
        point: [
            (s.point[0] - translate[0]) * scale,
            (s.point[1] - translate[1]) * scale,
        ],
        handle_in: [s.handle_in[0] * scale, s.handle_in[1] * scale],
        handle_out: [s.handle_out[0] * scale, s.handle_out[1] * scale],
    }));
}
