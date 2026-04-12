//! Arc-length contour resampling + rotational alignment.
//!
//! Ported from `bbnf-buddy/src/geometry/resample.ts`. The job: turn a
//! closed contour with N segments into one with M segments, with
//! handles that reproduce the original shape faithfully.

use crate::bezier::{densify_contour, fit_cubic_handles, sample_at_arc_length, slice_between};
use crate::types::{PolylineSample, Segment, Vec2};

/// Default samples per segment for arc-length densification.
const DEFAULT_SAMPLES_PER_SEGMENT: usize = 24;

/// Monotonic segment ID counter for newly-created segments.
/// Matches the TS `newSegmentId()` pattern — each resampled segment
/// gets a unique ID.
static NEXT_ID: std::sync::atomic::AtomicU32 = std::sync::atomic::AtomicU32::new(1);

fn new_segment_id() -> u32 {
    NEXT_ID.fetch_add(1, std::sync::atomic::Ordering::Relaxed)
}

/// Resample a closed contour to exactly `n` segments by walking the
/// contour's arc length, taking `n` evenly-spaced samples, and fitting
/// bezier handles via least-squares against the dense polyline.
///
/// When `n == segments.len()`, clones the input with fresh segment IDs
/// (matching the TS semantics where `resampleContour(segs, segs.length)`
/// returns a shallow copy with new IDs).
///
/// The handle-fitting uses the Schneider/Plass-Stone LSQ algorithm
/// implemented in [`fit_cubic_handles`], which preserves hand-tuned
/// corners that a naive 1/3-chord heuristic would erase.
///
/// Ported from `resample.ts::resampleContour`.
pub fn resample_contour(segments: &[Segment], n: usize) -> Vec<Segment> {
    if n == 0 || segments.is_empty() {
        return Vec::new();
    }

    // When the count already matches, return a copy with fresh IDs.
    if segments.len() == n {
        return segments
            .iter()
            .map(|s| Segment {
                id: new_segment_id(),
                point: s.point,
                handle_in: s.handle_in,
                handle_out: s.handle_out,
            })
            .collect();
    }

    let samples = densify_contour(segments, DEFAULT_SAMPLES_PER_SEGMENT);
    if samples.is_empty() {
        return Vec::new();
    }
    let total = samples.last().unwrap().cumulative;
    if total <= 1e-9 {
        return Vec::new();
    }

    // Pick n equidistant anchors along the arc length.
    let taken: Vec<PolylineSample> = (0..n)
        .map(|i| sample_at_arc_length(&samples, i as f64 / n as f64))
        .collect();

    // Build result segments with zero handles initially.
    let mut result: Vec<Segment> = taken
        .iter()
        .map(|s| Segment {
            id: new_segment_id(),
            point: s.point,
            handle_in: [0.0, 0.0],
            handle_out: [0.0, 0.0],
        })
        .collect();

    // For each adjacent pair of anchors, fit bezier handles via LSQ
    // against the dense polyline slice between them.
    for i in 0..n {
        let a = &taken[i];
        let b = &taken[(i + 1) % n];
        let t_a = normalized_tangent(a.tangent);
        // handleIn uses the tangent-negative direction so the control
        // point sits "behind" b (relative to arc travel).
        let t_b = negated(normalized_tangent(b.tangent));

        let interior = slice_between(&samples, a.cumulative, b.cumulative, total);
        let (handle_out, handle_in) =
            fit_cubic_handles(a.point, b.point, t_a, t_b, &interior);

        result[i].handle_out = handle_out;
        result[(i + 1) % n].handle_in = handle_in;
    }

    result
}

/// Cyclically rotate a closed contour by `offset` segments.
///
/// Ported from `resample.ts::rotateContour`.
pub fn rotate_contour(segments: &[Segment], offset: usize) -> Vec<Segment> {
    let n = segments.len();
    if n == 0 || offset == 0 {
        return segments.to_vec();
    }
    let k = offset % n;
    let mut out = Vec::with_capacity(n);
    out.extend_from_slice(&segments[k..]);
    out.extend_from_slice(&segments[..k]);
    out
}

/// Find the cyclic rotation of `target` that minimizes total squared
/// distance to `reference`'s anchor points. Both arrays must already be
/// the same length.
///
/// O(n^2) brute force with early-exit pruning — `n` is small in
/// practice (at most 64 for pathological glyphs).
///
/// The inner loop accumulates the sum of squared point distances for
/// each candidate rotation offset `k`. As soon as the running sum
/// exceeds the best-so-far, the inner loop breaks early, pruning
/// the remaining comparisons for that offset.
///
/// Ported from `resample.ts::bestRotationOffset`.
pub fn best_rotation_offset(target: &[Segment], reference: &[Segment]) -> usize {
    let n = target.len();
    if n == 0 || n != reference.len() {
        return 0;
    }
    let mut best_offset = 0usize;
    let mut best_sum = f64::INFINITY;

    for k in 0..n {
        let mut sum = 0.0_f64;
        for i in 0..n {
            let t = &target[(i + k) % n];
            let r = &reference[i];
            let dx = t.point[0] - r.point[0];
            let dy = t.point[1] - r.point[1];
            sum += dx * dx + dy * dy;
            if sum >= best_sum {
                break;
            }
        }
        if sum < best_sum {
            best_sum = sum;
            best_offset = k;
        }
    }

    best_offset
}

/// Variant of [`best_rotation_offset`] that lets callers bias specific
/// index pairs via a per-index weight vector. Used for manual
/// correspondence hint support.
///
/// Ported from `align.ts::weightedRotationOffset`.
pub fn weighted_rotation_offset(
    target: &[Segment],
    reference: &[Segment],
    weights: &[f64],
) -> usize {
    let n = target.len();
    if n == 0 || n != reference.len() {
        return 0;
    }
    let mut best_offset = 0usize;
    let mut best_sum = f64::INFINITY;

    for k in 0..n {
        let mut sum = 0.0_f64;
        for i in 0..n {
            let t = &target[(i + k) % n];
            let r = &reference[i];
            let dx = t.point[0] - r.point[0];
            let dy = t.point[1] - r.point[1];
            sum += (dx * dx + dy * dy) * weights[i];
            if sum >= best_sum {
                break;
            }
        }
        if sum < best_sum {
            best_sum = sum;
            best_offset = k;
        }
    }

    best_offset
}

// -- Internal helpers -------------------------------------------------------

fn normalized_tangent(t: Vec2) -> Vec2 {
    let len = (t[0] * t[0] + t[1] * t[1]).sqrt();
    let len = if len == 0.0 { 1.0 } else { len };
    [t[0] / len, t[1] / len]
}

fn negated(v: Vec2) -> Vec2 {
    [-v[0], -v[1]]
}
