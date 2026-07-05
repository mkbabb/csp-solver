//! Cubic bezier primitives — evaluation, differentiation, densification,
//! and least-squares handle fitting.
//!
//! Ported from `bbnf-buddy/src/geometry/bezier.ts`. Everything here
//! operates on raw [`Vec2`] points and handle offsets so it is reusable
//! outside the [`Segment`] abstraction.

use crate::types::{PolylineSample, Segment, Vec2};

/// Evaluate a point on a cubic bezier at parameter `t` in `[0, 1]`.
///
/// Uses the explicit polynomial form:
///   `B(t) = (1-t)^3 * p0 + 3*(1-t)^2*t * p1 + 3*(1-t)*t^2 * p2 + t^3 * p3`
///
/// Ported from `bezier.ts::cubicBezier`.
pub fn cubic_bezier(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: f64) -> Vec2 {
    let u = 1.0 - t;
    let uu = u * u;
    let uuu = uu * u;
    let tt = t * t;
    let ttt = tt * t;
    [
        uuu * p0[0] + 3.0 * uu * t * p1[0] + 3.0 * u * tt * p2[0] + ttt * p3[0],
        uuu * p0[1] + 3.0 * uu * t * p1[1] + 3.0 * u * tt * p2[1] + ttt * p3[1],
    ]
}

/// Tangent (derivative) of a cubic bezier at parameter `t` in `[0, 1]`.
///
///   `B'(t) = 3*(1-t)^2*(p1-p0) + 6*(1-t)*t*(p2-p1) + 3*t^2*(p3-p2)`
///
/// Ported from `bezier.ts::cubicTangent`.
pub fn cubic_tangent(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: f64) -> Vec2 {
    let u = 1.0 - t;
    let uu = u * u;
    let tt = t * t;
    [
        3.0 * uu * (p1[0] - p0[0]) + 6.0 * u * t * (p2[0] - p1[0]) + 3.0 * tt * (p3[0] - p2[0]),
        3.0 * uu * (p1[1] - p0[1]) + 6.0 * u * t * (p2[1] - p1[1]) + 3.0 * tt * (p3[1] - p2[1]),
    ]
}

/// Walk a closed segment loop and emit a dense polyline sampling with
/// arc-length annotations.
///
/// `samples_per_segment` controls precision; 24 is plenty for smooth
/// glyphs. The last sample of segment `i` is omitted to avoid
/// duplicates with the first sample of segment `i+1` — except for the
/// very first segment which starts at `j=0` (the contour's start point).
///
/// Ported from `bezier.ts::densifyContour`. The subtle skip-`j=0` logic
/// for segment boundaries is preserved exactly: for `i == 0` we start
/// at `j = 0`; for all subsequent segments we start at `j = 1`.
pub fn densify_contour(segments: &[Segment], samples_per_segment: usize) -> Vec<PolylineSample> {
    let n = segments.len();
    if n == 0 || samples_per_segment == 0 {
        return Vec::new();
    }

    let mut samples = Vec::with_capacity(n * samples_per_segment);
    let mut cumulative = 0.0_f64;
    let mut prev: Option<Vec2> = None;

    for i in 0..n {
        let a = &segments[i];
        let b = &segments[(i + 1) % n];

        let p0 = a.point;
        let p1 = [a.point[0] + a.handle_out[0], a.point[1] + a.handle_out[1]];
        let p2 = [b.point[0] + b.handle_in[0], b.point[1] + b.handle_in[1]];
        let p3 = b.point;

        // Skip j=0 for all segments after the first to avoid duplicate
        // points at segment boundaries.
        let start = if i == 0 { 0 } else { 1 };

        for j in start..=samples_per_segment {
            let t = j as f64 / samples_per_segment as f64;
            let point = cubic_bezier(p0, p1, p2, p3, t);
            let tangent = cubic_tangent(p0, p1, p2, p3, t);

            if let Some(p) = prev {
                cumulative += ((point[0] - p[0]).powi(2) + (point[1] - p[1]).powi(2)).sqrt();
            }

            samples.push(PolylineSample {
                point,
                tangent,
                cumulative,
            });
            prev = Some(point);
        }
    }

    samples
}

/// Binary-search a dense polyline for the sample at fractional arc
/// length `t` in `[0, 1]`, linearly interpolating between adjacent
/// samples for position and tangent.
///
/// Ported from `bezier.ts::sampleAtArcLength`.
pub fn sample_at_arc_length(samples: &[PolylineSample], t: f64) -> PolylineSample {
    if samples.is_empty() {
        return PolylineSample {
            point: [0.0, 0.0],
            tangent: [1.0, 0.0],
            cumulative: 0.0,
        };
    }

    let total = samples.last().unwrap().cumulative;
    let target = t * total;

    // Binary search for the first sample with cumulative >= target.
    let mut lo = 0usize;
    let mut hi = samples.len() - 1;
    while lo < hi {
        let mid = (lo + hi) >> 1;
        if samples[mid].cumulative < target {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }

    if lo == 0 {
        return samples[0];
    }

    let a = &samples[lo - 1];
    let b = &samples[lo];
    let span = b.cumulative - a.cumulative;
    if span <= 1e-9 {
        return *b;
    }

    let frac = (target - a.cumulative) / span;
    PolylineSample {
        point: [
            a.point[0] + (b.point[0] - a.point[0]) * frac,
            a.point[1] + (b.point[1] - a.point[1]) * frac,
        ],
        tangent: [
            a.tangent[0] + (b.tangent[0] - a.tangent[0]) * frac,
            a.tangent[1] + (b.tangent[1] - a.tangent[1]) * frac,
        ],
        cumulative: target,
    }
}

/// Least-squares cubic bezier handle fit for a pair of endpoints given
/// a dense polyline sample along the span between them.
///
/// Given endpoints `p0` and `p3` plus `samples` (interior polyline
/// points parameterized by chord length), solve the 2x2 normal
/// equations for control magnitudes `alpha`, `beta` along the fixed
/// tangent directions `t0`, `t3` that minimize the sum of squared
/// errors.
///
/// Falls back to 1/3-chord heuristic when the sample set is empty or
/// degenerate.
///
/// Ported from `bezier.ts::fitCubicHandles`.
pub fn fit_cubic_handles(p0: Vec2, p3: Vec2, t0: Vec2, t3: Vec2, samples: &[Vec2]) -> (Vec2, Vec2) {
    let chord = ((p3[0] - p0[0]).powi(2) + (p3[1] - p0[1]).powi(2)).sqrt();
    let n = samples.len();

    if n == 0 {
        let third = chord / 3.0;
        return (
            [t0[0] * third, t0[1] * third],
            [t3[0] * third, t3[1] * third],
        );
    }

    // Chord-length parameterize the samples.
    let mut params = vec![0.0_f64; n];
    let mut total = 0.0_f64;
    for i in 1..n {
        total += ((samples[i][0] - samples[i - 1][0]).powi(2)
            + (samples[i][1] - samples[i - 1][1]).powi(2))
        .sqrt();
        params[i] = total;
    }
    // Account for last -> p3 chord.
    total += ((p3[0] - samples[n - 1][0]).powi(2) + (p3[1] - samples[n - 1][1]).powi(2)).sqrt();
    if total <= 1e-9 {
        let third = chord / 3.0;
        return (
            [t0[0] * third, t0[1] * third],
            [t3[0] * third, t3[1] * third],
        );
    }
    // Also account for p0 -> first sample prelude.
    let prelude = ((samples[0][0] - p0[0]).powi(2) + (samples[0][1] - p0[1]).powi(2)).sqrt();
    for p in &mut params {
        *p = (*p + prelude) / (total + prelude);
    }

    // Solve the 2x2 normal equations.
    let mut c00 = 0.0_f64;
    let mut c01 = 0.0_f64;
    let mut c11 = 0.0_f64;
    let mut x0 = 0.0_f64;
    let mut x1 = 0.0_f64;

    for i in 0..n {
        let u = params[i];
        let uu = 1.0 - u;
        let b0 = uu * uu * uu;
        let b1 = 3.0 * uu * uu * u;
        let b2 = 3.0 * uu * u * u;
        let b3 = u * u * u;

        let a1x = t0[0] * b1;
        let a1y = t0[1] * b1;
        let a2x = t3[0] * b2;
        let a2y = t3[1] * b2;

        c00 += a1x * a1x + a1y * a1y;
        c01 += a1x * a2x + a1y * a2y;
        c11 += a2x * a2x + a2y * a2y;

        let rx = samples[i][0] - (b0 * p0[0] + b1 * p0[0] + b2 * p3[0] + b3 * p3[0]);
        let ry = samples[i][1] - (b0 * p0[1] + b1 * p0[1] + b2 * p3[1] + b3 * p3[1]);
        x0 += a1x * rx + a1y * ry;
        x1 += a2x * rx + a2y * ry;
    }

    let det = c00 * c11 - c01 * c01;
    let (mut alpha, mut beta) = if det.abs() < 1e-12 {
        (chord / 3.0, chord / 3.0)
    } else {
        ((x0 * c11 - x1 * c01) / det, (x1 * c00 - x0 * c01) / det)
    };

    // Clamp to non-negative — negative magnitudes produce cusps.
    let max_mag = chord * 2.0;
    alpha = alpha.clamp(0.0, max_mag);
    beta = beta.clamp(0.0, max_mag);

    ([t0[0] * alpha, t0[1] * alpha], [t3[0] * beta, t3[1] * beta])
}

/// Extract polyline point positions strictly between two cumulative
/// arc-length positions on a closed sample ring.
///
/// Handles the wrap-around case when `end_len < start_len`.
///
/// Ported from `resample.ts::sliceBetween`.
pub fn slice_between(
    samples: &[PolylineSample],
    start_len: f64,
    end_len: f64,
    total: f64,
) -> Vec<Vec2> {
    let mut out = Vec::new();
    if total <= 0.0 {
        return out;
    }

    let wrapped = end_len < start_len;
    for s in samples {
        let len = s.cumulative;
        if wrapped {
            if len > start_len + 1e-9 || len < end_len - 1e-9 {
                out.push(s.point);
            }
        } else if len > start_len + 1e-9 && len < end_len - 1e-9 {
            out.push(s.point);
        }
    }
    out
}
