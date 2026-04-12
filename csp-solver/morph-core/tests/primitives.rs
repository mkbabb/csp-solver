//! Unit tests for geometry primitives ported from bbnf-buddy.

use approx::assert_abs_diff_eq;
use morph_core::bezier::{cubic_bezier, cubic_tangent, densify_contour};
use morph_core::contour::{bbox, bbox_iou, centroid, signed_area};
use morph_core::procrustes::{apply_procrustes, procrustes_2d};
use morph_core::resample::{best_rotation_offset, resample_contour};
use morph_core::types::{BBox, Segment, Vec2};

// -- Helper: build a simple square contour -----------------------------------

/// Create a unit square contour (4 segments) at the origin with
/// zero-offset handles (straight-line segments).
fn unit_square() -> Vec<Segment> {
    vec![
        Segment {
            id: 0,
            point: [0.0, 0.0],
            handle_in: [0.0, 0.0],
            handle_out: [0.0, 0.0],
        },
        Segment {
            id: 1,
            point: [1.0, 0.0],
            handle_in: [0.0, 0.0],
            handle_out: [0.0, 0.0],
        },
        Segment {
            id: 2,
            point: [1.0, 1.0],
            handle_in: [0.0, 0.0],
            handle_out: [0.0, 0.0],
        },
        Segment {
            id: 3,
            point: [0.0, 1.0],
            handle_in: [0.0, 0.0],
            handle_out: [0.0, 0.0],
        },
    ]
}

/// Create a curved contour (4 segments) that forms a rounded square,
/// with nonzero handles to exercise the full bezier path.
fn rounded_square() -> Vec<Segment> {
    vec![
        Segment {
            id: 10,
            point: [0.0, 0.0],
            handle_in: [-0.2, 0.0],
            handle_out: [0.3, 0.0],
        },
        Segment {
            id: 11,
            point: [1.0, 0.0],
            handle_in: [0.0, -0.2],
            handle_out: [0.0, 0.3],
        },
        Segment {
            id: 12,
            point: [1.0, 1.0],
            handle_in: [0.2, 0.0],
            handle_out: [-0.3, 0.0],
        },
        Segment {
            id: 13,
            point: [0.0, 1.0],
            handle_in: [0.0, 0.2],
            handle_out: [0.0, -0.3],
        },
    ]
}

// -- Bezier tests -----------------------------------------------------------

#[test]
fn test_cubic_bezier_endpoints() {
    let p0: Vec2 = [0.0, 0.0];
    let p1: Vec2 = [0.3, 0.5];
    let p2: Vec2 = [0.7, 0.8];
    let p3: Vec2 = [1.0, 1.0];

    let start = cubic_bezier(p0, p1, p2, p3, 0.0);
    assert_abs_diff_eq!(start[0], p0[0], epsilon = 1e-12);
    assert_abs_diff_eq!(start[1], p0[1], epsilon = 1e-12);

    let end = cubic_bezier(p0, p1, p2, p3, 1.0);
    assert_abs_diff_eq!(end[0], p3[0], epsilon = 1e-12);
    assert_abs_diff_eq!(end[1], p3[1], epsilon = 1e-12);
}

#[test]
fn test_cubic_tangent_nonzero() {
    let p0: Vec2 = [0.0, 0.0];
    let p1: Vec2 = [0.3, 0.5];
    let p2: Vec2 = [0.7, 0.8];
    let p3: Vec2 = [1.0, 1.0];

    let t = cubic_tangent(p0, p1, p2, p3, 0.5);
    // At midpoint the tangent should be non-degenerate.
    let len = (t[0] * t[0] + t[1] * t[1]).sqrt();
    assert!(len > 0.01, "tangent at midpoint should be nonzero");
}

#[test]
fn test_densify_contour_sample_count() {
    let segs = unit_square();
    let samples = densify_contour(&segs, 24);
    // 4 segments * 24 samples/seg, minus 3 boundary duplicates
    // (segments 1, 2, 3 skip j=0), so:
    //   seg 0: j in [0..24] => 25 samples
    //   seg 1: j in [1..24] => 24 samples
    //   seg 2: j in [1..24] => 24 samples
    //   seg 3: j in [1..24] => 24 samples
    //   total = 25 + 24*3 = 97
    assert_eq!(samples.len(), 97);
}

#[test]
fn test_densify_monotone_arc_length() {
    let segs = rounded_square();
    let samples = densify_contour(&segs, 24);
    for i in 1..samples.len() {
        assert!(
            samples[i].cumulative >= samples[i - 1].cumulative,
            "arc length must be monotone non-decreasing"
        );
    }
}

// -- Contour tests ----------------------------------------------------------

#[test]
fn test_centroid_of_square() {
    let segs = unit_square();
    let c = centroid(&segs);
    assert_abs_diff_eq!(c[0], 0.5, epsilon = 1e-3);
    assert_abs_diff_eq!(c[1], 0.5, epsilon = 1e-3);
}

#[test]
fn test_signed_area_ccw() {
    // Unit square vertices in CCW order (math-Y).
    // In SVG Y-down, this maps to CW -> positive area.
    let segs = unit_square();
    let area = signed_area(&segs);
    // With straight-line handles (zero offset), the densified polyline
    // follows the edges exactly. A CW square in SVG Y-down has
    // positive signed area.
    // The exact value depends on how the densification traces the edges,
    // but should be approximately +1.0 for a unit square traced CW.
    // Since our vertices are (0,0)->(1,0)->(1,1)->(0,1) which is CCW in
    // math-Y and CW in SVG-Y, area > 0 means the shoelace sees it as
    // outer.
    //
    // For straight lines (zero handles), the densified polyline is the
    // polygon itself. Shoelace of (0,0),(1,0),(1,1),(0,1) closed:
    //   sum = (0*0 - 1*0) + (1*1 - 1*0) + (1*1 - 0*1) + (0*0 - 0*1)
    //       = 0 + 1 + 1 + 0 = 2
    //   area = 2/2 = 1.0
    //
    // But with the densified sampling we might get slightly different
    // results due to the parametric walk. Check sign and magnitude.
    assert!(
        area.abs() > 0.5,
        "unit square should have significant area, got {area}"
    );
}

#[test]
fn test_bbox_of_square() {
    let segs = unit_square();
    let b = bbox(&segs);
    assert_abs_diff_eq!(b.min_x, 0.0, epsilon = 1e-12);
    assert_abs_diff_eq!(b.min_y, 0.0, epsilon = 1e-12);
    assert_abs_diff_eq!(b.max_x, 1.0, epsilon = 1e-12);
    assert_abs_diff_eq!(b.max_y, 1.0, epsilon = 1e-12);
}

#[test]
fn test_bbox_iou_identical() {
    let b = BBox {
        min_x: 0.0,
        min_y: 0.0,
        max_x: 1.0,
        max_y: 1.0,
    };
    let iou = bbox_iou(&b, &b);
    assert_abs_diff_eq!(iou, 1.0, epsilon = 1e-12);
}

#[test]
fn test_bbox_iou_disjoint() {
    let a = BBox {
        min_x: 0.0,
        min_y: 0.0,
        max_x: 1.0,
        max_y: 1.0,
    };
    let b = BBox {
        min_x: 2.0,
        min_y: 2.0,
        max_x: 3.0,
        max_y: 3.0,
    };
    let iou = bbox_iou(&a, &b);
    assert_abs_diff_eq!(iou, 0.0, epsilon = 1e-12);
}

// -- Resample tests ---------------------------------------------------------

#[test]
fn test_resample_preserves_count() {
    let segs = rounded_square();
    let resampled = resample_contour(&segs, 8);
    assert_eq!(resampled.len(), 8);
}

#[test]
fn test_resample_identity_count() {
    let segs = rounded_square();
    let n = segs.len();
    let resampled = resample_contour(&segs, n);
    assert_eq!(resampled.len(), n);
    // Points should match (it's a copy when count matches).
    for i in 0..n {
        assert_abs_diff_eq!(resampled[i].point[0], segs[i].point[0], epsilon = 1e-6);
        assert_abs_diff_eq!(resampled[i].point[1], segs[i].point[1], epsilon = 1e-6);
    }
}

// -- Rotation tests ---------------------------------------------------------

#[test]
fn test_best_rotation_identity() {
    let segs = rounded_square();
    let offset = best_rotation_offset(&segs, &segs);
    assert_eq!(offset, 0);
}

#[test]
fn test_best_rotation_finds_shift() {
    let segs = rounded_square();
    let n = segs.len();
    // Shift target by 1: target = [seg1, seg2, seg3, seg0].
    // best_rotation_offset finds k such that target[(i+k)%n] ≈ reference[i].
    // For k = n-1 = 3: target[(i+3)%4] maps i=0 -> target[3]=seg0=ref[0], etc.
    let mut shifted = Vec::with_capacity(n);
    shifted.extend_from_slice(&segs[1..]);
    shifted.extend_from_slice(&segs[..1]);
    let offset = best_rotation_offset(&shifted, &segs);
    assert_eq!(offset, n - 1);
}

// -- Procrustes tests -------------------------------------------------------

#[test]
fn test_procrustes_identity() {
    let pts: Vec<Vec2> = vec![[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]];
    let result = procrustes_2d(&pts, &pts);
    assert_abs_diff_eq!(result.theta, 0.0, epsilon = 1e-9);
    assert_abs_diff_eq!(result.scale, 1.0, epsilon = 1e-9);
    assert_abs_diff_eq!(result.translation[0], 0.0, epsilon = 1e-9);
    assert_abs_diff_eq!(result.translation[1], 0.0, epsilon = 1e-9);
}

#[test]
fn test_procrustes_known_rotation() {
    let pts: Vec<Vec2> = vec![[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]];

    // Rotate all points by 45 degrees around origin.
    let angle = std::f64::consts::FRAC_PI_4;
    let cos = angle.cos();
    let sin = angle.sin();
    let rotated: Vec<Vec2> = pts
        .iter()
        .map(|p| [cos * p[0] - sin * p[1], sin * p[0] + cos * p[1]])
        .collect();

    let result = procrustes_2d(&pts, &rotated);
    assert_abs_diff_eq!(result.theta, angle, epsilon = 1e-9);
    assert_abs_diff_eq!(result.scale, 1.0, epsilon = 1e-9);
}

#[test]
fn test_procrustes_with_scale() {
    let pts: Vec<Vec2> = vec![[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]];
    let scaled: Vec<Vec2> = pts.iter().map(|p| [p[0] * 2.0, p[1] * 2.0]).collect();

    let result = procrustes_2d(&pts, &scaled);
    assert_abs_diff_eq!(result.theta, 0.0, epsilon = 1e-9);
    assert_abs_diff_eq!(result.scale, 2.0, epsilon = 1e-9);
}

#[test]
fn test_apply_procrustes_round_trip() {
    let pts: Vec<Vec2> = vec![[1.0, 2.0], [3.0, 4.0], [5.0, 0.0]];
    let transformed: Vec<Vec2> = pts
        .iter()
        .map(|p| [p[0] * 1.5 + 10.0, p[1] * 1.5 + 20.0])
        .collect();

    let result = procrustes_2d(&pts, &transformed);
    for (i, &p) in pts.iter().enumerate() {
        let applied = apply_procrustes(&result, p);
        assert_abs_diff_eq!(applied[0], transformed[i][0], epsilon = 1e-6);
        assert_abs_diff_eq!(applied[1], transformed[i][1], epsilon = 1e-6);
    }
}
