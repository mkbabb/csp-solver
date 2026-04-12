//! Contour-level measurements — signed area, centroid, bounding box,
//! winding direction.
//!
//! Ported from `bbnf-buddy/src/geometry/contour.ts`. Signed area uses
//! Green's theorem on the densified polyline so curves contribute
//! accurately (the shoelace-over-anchors shortcut undercounts curved
//! contours by up to 20%).

use crate::bezier::densify_contour;
use crate::types::{BBox, Segment, Vec2};

/// Default samples per segment for densification in contour measurements.
const DEFAULT_SAMPLES: usize = 24;

/// Signed area of a closed bezier contour via Green's theorem on the
/// densified polyline.
///
/// SVG Y-down: positive = clockwise (outer), negative = CCW (counter/hole).
///
/// Ported from `contour.ts::signedArea`.
pub fn signed_area(segments: &[Segment]) -> f64 {
    if segments.len() < 2 {
        return 0.0;
    }
    let pts = densify_contour(segments, DEFAULT_SAMPLES);
    let n = pts.len();
    let mut area = 0.0_f64;
    for i in 0..n {
        let a = pts[i].point;
        let b = pts[(i + 1) % n].point;
        area += a[0] * b[1] - b[0] * a[1];
    }
    area / 2.0
}

/// Axis-aligned bounding box computed over anchor points (not curves).
///
/// Ported from `contour.ts::bbox`.
pub fn bbox(segments: &[Segment]) -> BBox {
    if segments.is_empty() {
        return BBox {
            min_x: 0.0,
            min_y: 0.0,
            max_x: 0.0,
            max_y: 0.0,
        };
    }
    let mut min_x = f64::INFINITY;
    let mut min_y = f64::INFINITY;
    let mut max_x = f64::NEG_INFINITY;
    let mut max_y = f64::NEG_INFINITY;
    for s in segments {
        if s.point[0] < min_x {
            min_x = s.point[0];
        }
        if s.point[1] < min_y {
            min_y = s.point[1];
        }
        if s.point[0] > max_x {
            max_x = s.point[0];
        }
        if s.point[1] > max_y {
            max_y = s.point[1];
        }
    }
    BBox {
        min_x,
        min_y,
        max_x,
        max_y,
    }
}

/// Area of a bounding box.
///
/// Ported from `contour.ts::bboxArea`.
pub fn bbox_area(b: &BBox) -> f64 {
    (b.max_x - b.min_x) * (b.max_y - b.min_y)
}

/// Intersection-over-union between two bounding boxes.
///
/// Returns 0.0 for disjoint boxes, 1.0 for identical boxes.
///
/// Ported from `contour.ts::bboxIoU`.
pub fn bbox_iou(a: &BBox, b: &BBox) -> f64 {
    let ix1 = a.min_x.max(b.min_x);
    let iy1 = a.min_y.max(b.min_y);
    let ix2 = a.max_x.min(b.max_x);
    let iy2 = a.max_y.min(b.max_y);
    if ix2 < ix1 || iy2 < iy1 {
        return 0.0;
    }
    let inter = (ix2 - ix1) * (iy2 - iy1);
    let union = bbox_area(a) + bbox_area(b) - inter;
    if union > 0.0 {
        inter / union
    } else {
        0.0
    }
}

/// Signed-area-weighted centroid of a dense contour sampling.
///
/// Falls back to the bbox midpoint for degenerate (zero-area) contours.
///
/// Ported from `contour.ts::centroid`.
pub fn centroid(segments: &[Segment]) -> Vec2 {
    if segments.is_empty() {
        return [0.0, 0.0];
    }
    let pts = densify_contour(segments, DEFAULT_SAMPLES);
    let n = pts.len();
    let mut cx = 0.0_f64;
    let mut cy = 0.0_f64;
    let mut area = 0.0_f64;
    for i in 0..n {
        let a = pts[i].point;
        let b = pts[(i + 1) % n].point;
        let cross = a[0] * b[1] - b[0] * a[1];
        area += cross;
        cx += (a[0] + b[0]) * cross;
        cy += (a[1] + b[1]) * cross;
    }
    area /= 2.0;
    if area.abs() < 1e-9 {
        let bb = bbox(segments);
        return [(bb.min_x + bb.max_x) / 2.0, (bb.min_y + bb.max_y) / 2.0];
    }
    cx /= 6.0 * area;
    cy /= 6.0 * area;
    [cx, cy]
}
