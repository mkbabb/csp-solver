//! Criterion benchmarks for geometry primitives: procrustes, resample,
//! densify, best_rotation_offset.

use criterion::{Criterion, criterion_group, criterion_main};
use morph_core::bezier::densify_contour;
use morph_core::procrustes::procrustes_2d;
use morph_core::resample::{best_rotation_offset, resample_contour};
use morph_core::types::{Segment, Vec2};
use std::f64::consts::TAU;

// -- Fixtures ----------------------------------------------------------------

/// Build a closed polygon with `n` segments equally spaced on a circle of
/// given `radius`, with cubic handles proportional to the arc chord.
fn make_circle_segments(n: usize, radius: f64) -> Vec<Segment> {
    let handle_scale = 0.27; // ~4/3 * tan(pi / 2n) for smooth circles
    (0..n)
        .map(|i| {
            let angle = TAU * i as f64 / n as f64;
            let cos = angle.cos();
            let sin = angle.sin();
            // Tangent perpendicular to radius.
            let tx = -sin * radius * handle_scale;
            let ty = cos * radius * handle_scale;
            Segment {
                id: i as u32,
                point: [cos * radius, sin * radius],
                handle_in: [-tx, -ty],
                handle_out: [tx, ty],
            }
        })
        .collect()
}

// -- Bench groups ------------------------------------------------------------

fn bench_procrustes_2d(c: &mut Criterion) {
    let mut group = c.benchmark_group("procrustes_2d");

    // 14-point cloud (typical small glyph).
    let segs_14 = make_circle_segments(14, 50.0);
    let pts_14: Vec<Vec2> = segs_14.iter().map(|s| s.point).collect();
    let angle = std::f64::consts::FRAC_PI_6;
    let cos = angle.cos();
    let sin = angle.sin();
    let rotated_14: Vec<Vec2> = pts_14
        .iter()
        .map(|p| [cos * p[0] - sin * p[1] + 5.0, sin * p[0] + cos * p[1] - 3.0])
        .collect();

    group.bench_function("14_pt", |b| {
        b.iter(|| procrustes_2d(&pts_14, &rotated_14));
    });

    // 64-point cloud (complex glyph).
    let segs_64 = make_circle_segments(64, 50.0);
    let pts_64: Vec<Vec2> = segs_64.iter().map(|s| s.point).collect();
    let rotated_64: Vec<Vec2> = pts_64
        .iter()
        .map(|p| [cos * p[0] - sin * p[1] + 5.0, sin * p[0] + cos * p[1] - 3.0])
        .collect();

    group.bench_function("64_pt", |b| {
        b.iter(|| procrustes_2d(&pts_64, &rotated_64));
    });

    group.finish();
}

fn bench_resample_contour(c: &mut Criterion) {
    let mut group = c.benchmark_group("resample_contour");

    let segs_14 = make_circle_segments(14, 50.0);

    // Identity resample (n == len): copy path.
    group.bench_function("14_to_14", |b| {
        b.iter(|| resample_contour(&segs_14, 14));
    });

    // Upsample 14 -> 32.
    group.bench_function("14_to_32", |b| {
        b.iter(|| resample_contour(&segs_14, 32));
    });

    // Downsample 64 -> 32.
    let segs_64 = make_circle_segments(64, 50.0);
    group.bench_function("64_to_32", |b| {
        b.iter(|| resample_contour(&segs_64, 32));
    });

    group.finish();
}

fn bench_densify_contour(c: &mut Criterion) {
    let mut group = c.benchmark_group("densify_contour");

    let segs_14 = make_circle_segments(14, 50.0);

    group.bench_function("14_seg_x_24_samples", |b| {
        b.iter(|| densify_contour(&segs_14, 24));
    });

    group.finish();
}

fn bench_best_rotation_offset(c: &mut Criterion) {
    let mut group = c.benchmark_group("best_rotation_offset");

    // 32-point contour with a known cyclic shift.
    let segs_32 = make_circle_segments(32, 50.0);
    let n = segs_32.len();
    let mut shifted = Vec::with_capacity(n);
    shifted.extend_from_slice(&segs_32[7..]);
    shifted.extend_from_slice(&segs_32[..7]);

    group.bench_function("32_pt", |b| {
        b.iter(|| best_rotation_offset(&shifted, &segs_32));
    });

    group.finish();
}

criterion_group!(
    benches,
    bench_procrustes_2d,
    bench_resample_contour,
    bench_densify_contour,
    bench_best_rotation_offset,
);
criterion_main!(benches);
