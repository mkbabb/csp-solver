//! End-to-end tests for the alignment pipeline.

use morph_core::align::align_forms;
use morph_core::scratch::AlignScratch;
use morph_core::types::{
    BBox, CorrespondenceHints, FormDef, Role, Segment, Signature, Subpath, SubpathHintPair,
};

// -- Helpers -----------------------------------------------------------------

/// Create a simple 4-segment square-like subpath.
fn make_square_subpath(
    id: &str,
    role: Role,
    offset_x: f64,
    offset_y: f64,
    size: f64,
) -> Subpath {
    let segs = vec![
        Segment {
            id: 0,
            point: [offset_x, offset_y],
            handle_in: [0.0, 0.0],
            handle_out: [size * 0.3, 0.0],
        },
        Segment {
            id: 1,
            point: [offset_x + size, offset_y],
            handle_in: [0.0, -size * 0.3],
            handle_out: [0.0, size * 0.3],
        },
        Segment {
            id: 2,
            point: [offset_x + size, offset_y + size],
            handle_in: [size * 0.3, 0.0],
            handle_out: [-size * 0.3, 0.0],
        },
        Segment {
            id: 3,
            point: [offset_x, offset_y + size],
            handle_in: [0.0, size * 0.3],
            handle_out: [0.0, -size * 0.3],
        },
    ];

    // Compute a rough signed area for the square (positive for outer).
    let sign = match role {
        Role::Outer => 1.0,
        Role::Counter => -1.0,
    };
    let signed_area = sign * size * size;

    Subpath {
        id: id.to_string(),
        segments: segs,
        signed_area,
        bbox: BBox {
            min_x: offset_x,
            min_y: offset_y,
            max_x: offset_x + size,
            max_y: offset_y + size,
        },
        role,
        signature: Signature {
            role,
            area_bucket: (signed_area.abs() + 1e-9).log2().floor() as i16,
            centroid_quadrant: 0,
            winding: if signed_area >= 0.0 { 1 } else { -1 },
        },
    }
}

/// Build a synthetic FormDef with the given subpaths.
fn make_form(id: &str, subpaths: Vec<Subpath>) -> FormDef {
    FormDef {
        id: id.to_string(),
        subpaths,
        view_box: [0.0, 0.0, 100.0, 100.0],
    }
}

// -- Tests -------------------------------------------------------------------

#[test]
fn test_align_identical_forms_tier1() {
    // Two identical forms: 1 outer + 1 counter.
    let outer = make_square_subpath("outer", Role::Outer, 0.0, 0.0, 10.0);
    let counter = make_square_subpath("counter", Role::Counter, 2.0, 2.0, 4.0);

    let source = make_form("src", vec![outer.clone(), counter.clone()]);
    let target = make_form("tgt", vec![outer, counter]);

    let mut scratch = AlignScratch::new();
    let result = align_forms(&source, &target, None, &mut scratch);

    assert_eq!(result.pairs.len(), 2, "should match both subpaths");
    assert!(result.unmatched_source.is_empty());
    assert!(result.unmatched_target.is_empty());

    // Each pair should have equal source and target segment counts.
    for pair in &result.pairs {
        assert_eq!(pair.source_segments.len(), pair.target_segments.len());
    }
}

#[test]
fn test_align_similar_forms_tier1() {
    // Similar but not identical geometry — same topology, same role count.
    let src_outer = make_square_subpath("outer", Role::Outer, 0.0, 0.0, 10.0);
    let src_counter = make_square_subpath("counter", Role::Counter, 2.0, 2.0, 4.0);

    let tgt_outer = make_square_subpath("outer", Role::Outer, 0.5, 0.5, 9.0);
    let tgt_counter = make_square_subpath("counter", Role::Counter, 2.5, 2.5, 3.5);

    let source = make_form("src", vec![src_outer, src_counter]);
    let target = make_form("tgt", vec![tgt_outer, tgt_counter]);

    let mut scratch = AlignScratch::new();
    let result = align_forms(&source, &target, None, &mut scratch);

    assert_eq!(result.pairs.len(), 2);
    assert!(result.unmatched_source.is_empty());
    assert!(result.unmatched_target.is_empty());

    for pair in &result.pairs {
        assert_eq!(pair.source_segments.len(), pair.target_segments.len());
    }
}

#[test]
fn test_align_force_tier2_with_hint() {
    // Supply a hint to force Tier 2 path.
    let outer = make_square_subpath("outer", Role::Outer, 0.0, 0.0, 10.0);
    let counter = make_square_subpath("counter", Role::Counter, 2.0, 2.0, 4.0);

    let source = make_form("src", vec![outer.clone(), counter.clone()]);
    let target = make_form("tgt", vec![outer, counter]);

    let hints = CorrespondenceHints {
        subpath_pairs: vec![SubpathHintPair {
            source: 0,
            target: 0,
        }],
        point_pairs: Vec::new(),
        procrustes: false,
    };

    let mut scratch = AlignScratch::new();
    let result = align_forms(&source, &target, Some(&hints), &mut scratch);

    // Same result: both matched.
    assert_eq!(result.pairs.len(), 2);
    assert!(result.unmatched_source.is_empty());
    assert!(result.unmatched_target.is_empty());
}

#[test]
fn test_align_asymmetric_forms_unmatched() {
    // Source: 3 subpaths (2 outer + 1 counter).
    // Target: 2 subpaths (1 outer + 1 counter).
    // This forces Tier 2 (cardinality mismatch) and produces an unmatched source.
    let src_outer1 = make_square_subpath("outer1", Role::Outer, 0.0, 0.0, 10.0);
    let src_outer2 = make_square_subpath("outer2", Role::Outer, 20.0, 0.0, 8.0);
    let src_counter = make_square_subpath("counter", Role::Counter, 2.0, 2.0, 4.0);

    let tgt_outer = make_square_subpath("outer", Role::Outer, 0.0, 0.0, 10.0);
    let tgt_counter = make_square_subpath("counter", Role::Counter, 2.0, 2.0, 4.0);

    let source = make_form("src", vec![src_outer1, src_outer2, src_counter]);
    let target = make_form("tgt", vec![tgt_outer, tgt_counter]);

    let mut scratch = AlignScratch::new();
    let result = align_forms(&source, &target, None, &mut scratch);

    // At most 2 pairs (since target has only 2 subpaths).
    assert!(result.pairs.len() <= 2);
    // At least one source must be unmatched (3 sources, 2 targets).
    let total_matched = result.pairs.len();
    let total_unmatched = result.unmatched_source.len();
    assert_eq!(total_matched + total_unmatched, 3, "all 3 sources accounted for");
    assert!(!result.unmatched_source.is_empty(), "asymmetric forms must have unmatched source");
}

#[test]
fn test_align_empty_source() {
    let target = make_form(
        "tgt",
        vec![make_square_subpath("outer", Role::Outer, 0.0, 0.0, 10.0)],
    );
    let source = make_form("src", vec![]);

    let mut scratch = AlignScratch::new();
    let result = align_forms(&source, &target, None, &mut scratch);

    assert!(result.pairs.is_empty());
    assert!(result.unmatched_source.is_empty());
    assert_eq!(result.unmatched_target.len(), 1);
}

#[test]
fn test_align_empty_target() {
    let source = make_form(
        "src",
        vec![make_square_subpath("outer", Role::Outer, 0.0, 0.0, 10.0)],
    );
    let target = make_form("tgt", vec![]);

    let mut scratch = AlignScratch::new();
    let result = align_forms(&source, &target, None, &mut scratch);

    assert!(result.pairs.is_empty());
    assert_eq!(result.unmatched_source.len(), 1);
    assert!(result.unmatched_target.is_empty());
}

#[test]
fn test_align_scratch_reuse() {
    // Verify that the scratch arena can be reused across multiple calls
    // without stale data leaking.
    let outer = make_square_subpath("outer", Role::Outer, 0.0, 0.0, 10.0);
    let source = make_form("src", vec![outer.clone()]);
    let target = make_form("tgt", vec![outer]);

    let mut scratch = AlignScratch::new();

    let r1 = align_forms(&source, &target, None, &mut scratch);
    let r2 = align_forms(&source, &target, None, &mut scratch);

    assert_eq!(r1.pairs.len(), r2.pairs.len());
    assert_eq!(r1.unmatched_source.len(), r2.unmatched_source.len());
    assert_eq!(r1.unmatched_target.len(), r2.unmatched_target.len());
}
