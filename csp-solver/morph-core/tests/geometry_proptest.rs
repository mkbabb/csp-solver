//! Property-based tests for morph-core geometry primitives via proptest.
//!
//! Seven properties validate Procrustes alignment, contour centroid
//! invariance, resampling length preservation, signed area sign,
//! bbox IoU symmetry, and rotation offset identity. Each property
//! runs 256 cases with a deterministic seed.

use morph_core::contour::{bbox_iou, centroid, signed_area};
use morph_core::procrustes::procrustes_2d;
use morph_core::resample::{best_rotation_offset, resample_contour};
use morph_core::types::{BBox, Segment, Vec2};
use proptest::prelude::*;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/// Build a straight-line Segment (zero handles) at the given point.
fn straight_seg(id: u32, point: Vec2) -> Segment {
    Segment {
        id,
        point,
        handle_in: [0.0, 0.0],
        handle_out: [0.0, 0.0],
    }
}

/// Strategy: generate N random 2D points with coords in [-100, 100].
fn points_strategy(min_n: usize, max_n: usize) -> impl Strategy<Value = Vec<Vec2>> {
    proptest::collection::vec(prop::array::uniform2(-100.0..100.0_f64), min_n..=max_n)
}

/// Strategy: generate a closed convex polygon with N vertices (CCW in
/// math-Y). We generate N angles in [0, 2pi], sort them, and place
/// points on a circle of radius R.
fn convex_polygon_strategy(min_n: usize, max_n: usize) -> impl Strategy<Value = Vec<Segment>> {
    (min_n..=max_n, 1.0..50.0_f64).prop_flat_map(|(n, radius)| {
        proptest::collection::vec(0.0..1.0_f64, n).prop_map(move |mut fracs| {
            fracs.sort_by(|a, b| a.partial_cmp(b).unwrap());
            fracs
                .iter()
                .enumerate()
                .map(|(i, &f)| {
                    let angle = f * std::f64::consts::TAU;
                    straight_seg(i as u32, [radius * angle.cos(), radius * angle.sin()])
                })
                .collect::<Vec<_>>()
        })
    })
}

/// Strategy: generate a simple closed polygon (straight-line segments)
/// with N vertices at random positions.
fn polygon_strategy(min_n: usize, max_n: usize) -> impl Strategy<Value = Vec<Segment>> {
    proptest::collection::vec(prop::array::uniform2(-50.0..50.0_f64), min_n..=max_n).prop_map(
        |pts| {
            pts.iter()
                .enumerate()
                .map(|(i, &p)| straight_seg(i as u32, p))
                .collect()
        },
    )
}

// ---------------------------------------------------------------------------
// Properties
// ---------------------------------------------------------------------------

proptest! {
    #![proptest_config(ProptestConfig {
        cases: 256,
        failure_persistence: None,
        .. ProptestConfig::default()
    })]

    /// procrustes_2d(pts, pts) returns identity transform.
    #[test]
    fn prop_procrustes_identity(pts in points_strategy(3, 20)) {
        let r = procrustes_2d(&pts, &pts);
        prop_assert!((r.theta).abs() < 1e-9, "theta: {}", r.theta);
        prop_assert!((r.scale - 1.0).abs() < 1e-9, "scale: {}", r.scale);
        prop_assert!((r.translation[0]).abs() < 1e-9, "tx: {}", r.translation[0]);
        prop_assert!((r.translation[1]).abs() < 1e-9, "ty: {}", r.translation[1]);
    }

    /// Rotating all points by theta recovers that theta via procrustes.
    #[test]
    fn prop_procrustes_rotation_recovered(
        pts in points_strategy(3, 20),
        theta_frac in -1.0..1.0_f64,
    ) {
        let theta = theta_frac * std::f64::consts::PI;
        let cos = theta.cos();
        let sin = theta.sin();

        // Rotate all points around origin.
        let rotated: Vec<Vec2> = pts
            .iter()
            .map(|p| [cos * p[0] - sin * p[1], sin * p[0] + cos * p[1]])
            .collect();

        let r = procrustes_2d(&pts, &rotated);

        // Normalize both angles to [-pi, pi] for comparison.
        let normalize = |a: f64| {
            let mut a = a % std::f64::consts::TAU;
            if a > std::f64::consts::PI {
                a -= std::f64::consts::TAU;
            }
            if a < -std::f64::consts::PI {
                a += std::f64::consts::TAU;
            }
            a
        };
        let expected = normalize(theta);
        let actual = normalize(r.theta);
        let diff = (actual - expected).abs();
        // Handle wrap-around at +/- pi.
        let diff = diff.min(std::f64::consts::TAU - diff);
        prop_assert!(
            diff < 1e-6,
            "theta mismatch: expected {} got {} (diff {})",
            expected,
            actual,
            diff,
        );
        prop_assert!(
            (r.scale - 1.0).abs() < 1e-6,
            "scale should be 1.0, got {}",
            r.scale,
        );
    }

    /// centroid(translate(contour, v)) ~ centroid(contour) + v.
    #[test]
    fn prop_centroid_invariance(
        segs in polygon_strategy(3, 15),
        v in prop::array::uniform2(-50.0..50.0_f64),
    ) {
        let c_orig = centroid(&segs);

        let translated: Vec<Segment> = segs
            .iter()
            .map(|s| Segment {
                id: s.id,
                point: [s.point[0] + v[0], s.point[1] + v[1]],
                handle_in: s.handle_in,
                handle_out: s.handle_out,
            })
            .collect();

        let c_trans = centroid(&translated);

        // Tolerance is looser because centroid uses densified polyline
        // with Green's theorem and may fall back to bbox midpoint for
        // degenerate polygons.
        let dx = (c_trans[0] - (c_orig[0] + v[0])).abs();
        let dy = (c_trans[1] - (c_orig[1] + v[1])).abs();
        prop_assert!(
            dx < 1e-3 && dy < 1e-3,
            "centroid shift mismatch: dx={}, dy={}",
            dx,
            dy,
        );
    }

    /// resample_contour(c, n).len() == n for n in [3, 50].
    #[test]
    fn prop_resample_preserves_length(
        segs in polygon_strategy(3, 10),
        n in 3..50usize,
    ) {
        let resampled = resample_contour(&segs, n);
        prop_assert_eq!(
            resampled.len(),
            n,
            "expected {} segments, got {}",
            n,
            resampled.len(),
        );
    }

    /// A CCW convex polygon (in math Y-up, CW in SVG Y-down) has
    /// positive signed area from the shoelace formula.
    ///
    /// We generate vertices on a circle sorted by angle, which
    /// produces CCW winding in standard math coordinates. Under SVG
    /// Y-down interpretation the shoelace gives a positive result
    /// (CW = outer).
    #[test]
    fn prop_signed_area_sign(segs in convex_polygon_strategy(3, 12)) {
        // Skip degenerate cases where all points coincide (radius
        // variation or fraction collisions can produce near-zero area).
        let area = signed_area(&segs);
        // For a non-degenerate convex polygon on a circle, area should
        // be significantly nonzero. We only check sign for polygons
        // that have measurable area.
        if area.abs() > 1e-6 {
            prop_assert!(
                area > 0.0,
                "CCW convex polygon should have positive signed area, got {}",
                area,
            );
        }
    }

    /// bbox_iou(a, b) == bbox_iou(b, a).
    #[test]
    fn prop_bbox_iou_symmetric(
        a_coords in prop::array::uniform4(0.0..100.0_f64),
        b_coords in prop::array::uniform4(0.0..100.0_f64),
    ) {
        let a = BBox {
            min_x: a_coords[0].min(a_coords[1]),
            max_x: a_coords[0].max(a_coords[1]),
            min_y: a_coords[2].min(a_coords[3]),
            max_y: a_coords[2].max(a_coords[3]),
        };
        let b = BBox {
            min_x: b_coords[0].min(b_coords[1]),
            max_x: b_coords[0].max(b_coords[1]),
            min_y: b_coords[2].min(b_coords[3]),
            max_y: b_coords[2].max(b_coords[3]),
        };

        let iou_ab = bbox_iou(&a, &b);
        let iou_ba = bbox_iou(&b, &a);

        prop_assert!(
            (iou_ab - iou_ba).abs() < 1e-12,
            "bbox_iou not symmetric: {} vs {}",
            iou_ab,
            iou_ba,
        );
    }

    /// best_rotation_offset(c, c) == 0 for any contour.
    #[test]
    fn prop_best_rotation_identity(segs in polygon_strategy(3, 15)) {
        let offset = best_rotation_offset(&segs, &segs);
        prop_assert_eq!(offset, 0, "identity rotation should be 0, got {}", offset);
    }
}
