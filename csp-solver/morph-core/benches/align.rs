//! Criterion benchmarks for the alignment pipeline.

use criterion::{BatchSize, Criterion, criterion_group, criterion_main};
use morph_core::align::align_forms;
use morph_core::contour::centroid;
use morph_core::scratch::AlignScratch;
use morph_core::types::{
    BBox, CorrespondenceHints, FormDef, Role, Segment, Signature, Subpath, SubpathHintPair,
};

// -- Fixtures ----------------------------------------------------------------

/// Create a 4-segment closed polygon subpath with cubic handles.
fn make_square_subpath(id: &str, role: Role, offset_x: f64, offset_y: f64, size: f64) -> Subpath {
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

    let sign = match role {
        Role::Outer => 1.0,
        Role::Counter => -1.0,
    };
    let signed_area = sign * size * size;

    let ctr = centroid(&segs);
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
        centroid: ctr,
        role,
        signature: Signature {
            role,
            area_bucket: (signed_area.abs() + 1e-9).log2().floor() as i16,
            centroid_quadrant: 0,
            winding: if signed_area >= 0.0 { 1 } else { -1 },
        },
    }
}

fn make_form(id: &str, subpaths: Vec<Subpath>) -> FormDef {
    FormDef {
        id: id.to_string(),
        subpaths,
        view_box: [0.0, 0.0, 100.0, 100.0],
    }
}

// -- Bench groups ------------------------------------------------------------

fn bench_align_tier1(c: &mut Criterion) {
    let mut group = c.benchmark_group("align_forms/tier1");

    // Matching topology: 1 outer + 1 counter on each side.
    let outer = make_square_subpath("outer", Role::Outer, 0.0, 0.0, 10.0);
    let counter = make_square_subpath("counter", Role::Counter, 2.0, 2.0, 4.0);
    let source = make_form("src", vec![outer.clone(), counter.clone()]);
    let target = make_form("tgt", vec![outer, counter]);

    group.bench_function("identical_topology", |b| {
        b.iter_batched(
            AlignScratch::new,
            |mut scratch| align_forms(&source, &target, None, &mut scratch),
            BatchSize::SmallInput,
        );
    });

    // Similar but not identical geometry -- same topology, different sizes.
    let src_outer = make_square_subpath("outer", Role::Outer, 0.0, 0.0, 10.0);
    let src_counter = make_square_subpath("counter", Role::Counter, 2.0, 2.0, 4.0);
    let tgt_outer = make_square_subpath("outer", Role::Outer, 0.5, 0.5, 9.0);
    let tgt_counter = make_square_subpath("counter", Role::Counter, 2.5, 2.5, 3.5);
    let source2 = make_form("src", vec![src_outer, src_counter]);
    let target2 = make_form("tgt", vec![tgt_outer, tgt_counter]);

    group.bench_function("similar_geometry", |b| {
        b.iter_batched(
            AlignScratch::new,
            |mut scratch| align_forms(&source2, &target2, None, &mut scratch),
            BatchSize::SmallInput,
        );
    });

    group.finish();
}

fn bench_align_tier2(c: &mut Criterion) {
    let mut group = c.benchmark_group("align_forms/tier2");

    // Force Tier 2 via correspondence hint.
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

    group.bench_function("forced_via_hint", |b| {
        b.iter_batched(
            AlignScratch::new,
            |mut scratch| align_forms(&source, &target, Some(&hints), &mut scratch),
            BatchSize::SmallInput,
        );
    });

    group.finish();
}

fn bench_align_asymmetric(c: &mut Criterion) {
    let mut group = c.benchmark_group("align_forms/synthetic_asymmetric");

    // Source: 3 subpaths (2 outer + 1 counter).
    // Target: 2 subpaths (1 outer + 1 counter).
    // Forces Tier 2 via cardinality mismatch.
    let src_outer1 = make_square_subpath("outer1", Role::Outer, 0.0, 0.0, 10.0);
    let src_outer2 = make_square_subpath("outer2", Role::Outer, 20.0, 0.0, 8.0);
    let src_counter = make_square_subpath("counter", Role::Counter, 2.0, 2.0, 4.0);
    let tgt_outer = make_square_subpath("outer", Role::Outer, 0.0, 0.0, 10.0);
    let tgt_counter = make_square_subpath("counter", Role::Counter, 2.0, 2.0, 4.0);

    let source = make_form("src", vec![src_outer1, src_outer2, src_counter]);
    let target = make_form("tgt", vec![tgt_outer, tgt_counter]);

    group.bench_function("3_outer_vs_2_outer", |b| {
        b.iter_batched(
            AlignScratch::new,
            |mut scratch| align_forms(&source, &target, None, &mut scratch),
            BatchSize::SmallInput,
        );
    });

    group.finish();
}

criterion_group!(
    benches,
    bench_align_tier1,
    bench_align_tier2,
    bench_align_asymmetric
);
criterion_main!(benches);
