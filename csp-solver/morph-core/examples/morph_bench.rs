//! Wall-clock + allocation + pair-selection harness for the morph
//! alignment pipeline. Prototype-only; not shipped.
//!
//! Usage: `cargo run --release --example morph_bench -- [iters] [stressN]`
//!
//! Emits three blocks per corpus case:
//!   - PAIRS: the assignment vector (source_index -> target_index) so a
//!     before/after diff proves identical pair selection.
//!   - ALLOC: allocations attributable to one align_forms call.
//!   - TIME:  mean wall-clock over `iters` iterations.

use std::alloc::{GlobalAlloc, Layout, System};
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::Instant;

use morph_core::align::align_forms;
use morph_core::contour::{bbox, centroid, signed_area};
use morph_core::scratch::AlignScratch;
use morph_core::types::{FormDef, Role, Segment, Signature, Subpath};

// -- Counting allocator ------------------------------------------------------

static ALLOCS: AtomicU64 = AtomicU64::new(0);
static COUNTING: AtomicU64 = AtomicU64::new(0); // 0 = off, 1 = on

struct Counting;

unsafe impl GlobalAlloc for Counting {
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        if COUNTING.load(Ordering::Relaxed) == 1 {
            ALLOCS.fetch_add(1, Ordering::Relaxed);
        }
        unsafe { System.alloc(layout) }
    }
    unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
        unsafe { System.dealloc(ptr, layout) }
    }
}

#[global_allocator]
static A: Counting = Counting;

// -- Corpus fixtures ---------------------------------------------------------

/// Perturbed regular polygon — mirrors bbnf-buddy `generators.ts`
/// `regularPolygonSegments`: smooth closed contour, measurable arc length.
fn polygon(n: usize, cx: f64, cy: f64, r: f64, wobble: f64, role: Role, id: &str) -> Subpath {
    let mut segs = Vec::with_capacity(n);
    for i in 0..n {
        let ang = 2.0 * std::f64::consts::PI * (i as f64) / (n as f64);
        let rr = r + wobble * ((i as f64) * 1.3).sin();
        let x = cx + rr * ang.cos();
        let y = cy + rr * ang.sin();
        let tang = ang + std::f64::consts::FRAC_PI_2;
        let hlen = r * 2.0 * std::f64::consts::PI / (n as f64) / 3.0;
        segs.push(Segment {
            id: i as u32,
            point: [x, y],
            handle_in: [-hlen * tang.cos(), -hlen * tang.sin()],
            handle_out: [hlen * tang.cos(), hlen * tang.sin()],
        });
    }
    // Counter subpaths wind the opposite way; flip so signed_area sign
    // matches the role (matches the wire-layer invariant).
    if matches!(role, Role::Counter) {
        segs[1..].reverse();
    }
    let sa = signed_area(&segs);
    let bb = bbox(&segs);
    let ctr = centroid(&segs);
    let area_bucket = (sa.abs() + 1e-9).log2().floor() as i16;
    Subpath {
        id: id.to_string(),
        segments: segs,
        signed_area: sa,
        bbox: bb,
        centroid: ctr,
        role,
        signature: Signature {
            role,
            area_bucket,
            centroid_quadrant: (id.len() as u8) & 7,
            winding: if sa >= 0.0 { 1 } else { -1 },
        },
    }
}

fn form(id: &str, subpaths: Vec<Subpath>) -> FormDef {
    FormDef {
        id: id.to_string(),
        subpaths,
        view_box: [0.0, 0.0, 100.0, 100.0],
    }
}

/// Realistic small glyph pair: b (1 outer + 1 counter) -> B (1 outer + 2
/// counters). Cardinality mismatch on the counter role forces Tier 2.
fn realistic_pair() -> (FormDef, FormDef) {
    let src = form(
        "lowercase-b",
        vec![
            polygon(18, 40.0, 50.0, 40.0, 6.0, Role::Outer, "outer"),
            polygon(8, 45.0, 62.0, 12.0, 1.5, Role::Counter, "counter"),
        ],
    );
    let tgt = form(
        "uppercase-b",
        vec![
            polygon(18, 40.0, 50.0, 42.0, 5.0, Role::Outer, "outer"),
            polygon(8, 45.0, 34.0, 11.0, 1.0, Role::Counter, "counter-top"),
            polygon(8, 45.0, 66.0, 13.0, 1.2, Role::Counter, "counter-bot"),
        ],
    );
    (src, tgt)
}

/// Tier-1 pair (identical topology, 1 outer + 1 counter, equal anchor
/// counts) — no CSP solver runs, so its allocation count isolates the
/// per-pair geometry pipeline (the arena claim).
fn tier1_equal_pair() -> (FormDef, FormDef) {
    let a = form(
        "t1a",
        vec![
            polygon(16, 40.0, 50.0, 40.0, 4.0, Role::Outer, "outer"),
            polygon(8, 45.0, 55.0, 12.0, 1.5, Role::Counter, "counter"),
        ],
    );
    let b = form(
        "t1b",
        vec![
            polygon(16, 41.0, 51.0, 38.0, 4.0, Role::Outer, "outer"),
            polygon(8, 46.0, 56.0, 11.0, 1.5, Role::Counter, "counter"),
        ],
    );
    (a, b)
}

/// Tier-1 pair whose outer subpaths have *different* anchor counts, so
/// the resample path fires (the heaviest per-pair allocator). Same
/// topology (1 outer + 1 counter, single per role) keeps it Tier 1.
fn tier1_resample_pair() -> (FormDef, FormDef) {
    let a = form(
        "trA",
        vec![
            polygon(12, 40.0, 50.0, 40.0, 4.0, Role::Outer, "outer"),
            polygon(6, 45.0, 55.0, 12.0, 1.5, Role::Counter, "counter"),
        ],
    );
    let b = form(
        "trB",
        vec![
            polygon(24, 41.0, 51.0, 38.0, 4.0, Role::Outer, "outer"),
            polygon(10, 46.0, 56.0, 11.0, 1.5, Role::Counter, "counter"),
        ],
    );
    (a, b)
}

/// Stress pair: `n` distinct outer subpaths per side. Distinct signatures
/// (varying area buckets) defeat the Tier-1 fast path -> Tier 2 with an
/// n x n same-role cost matrix (the O(n^2)-full-pipeline pathology).
fn stress_pair(n: usize) -> (FormDef, FormDef) {
    let mut src = Vec::with_capacity(n);
    let mut tgt = Vec::with_capacity(n);
    for i in 0..n {
        let r = 10.0 + (i as f64) * 3.0; // distinct areas -> distinct buckets
        let cx = 15.0 + (i as f64) * 7.0;
        let cy = 15.0 + ((i * 13) % 40) as f64;
        src.push(polygon(10, cx, cy, r, 2.0, Role::Outer, &format!("s{i}")));
        // Target: same set, permuted + jittered, so the optimal matching
        // is non-trivial but well-defined.
        let j = (i * 3 + 1) % n;
        let r2 = 10.0 + (j as f64) * 3.0 + 0.4;
        let cx2 = 15.0 + (j as f64) * 7.0 + 0.5;
        let cy2 = 15.0 + ((j * 13) % 40) as f64 + 0.5;
        tgt.push(polygon(
            10,
            cx2,
            cy2,
            r2,
            2.0,
            Role::Outer,
            &format!("t{i}"),
        ));
    }
    (form("stress-src", src), form("stress-tgt", tgt))
}

// -- Measurement -------------------------------------------------------------

fn pairs_string(src: &FormDef, tgt: &FormDef) -> String {
    let mut scratch = AlignScratch::new();
    let a = align_forms(src, tgt, None, &mut scratch);
    let mut pairs: Vec<(usize, usize)> = a
        .pairs
        .iter()
        .map(|p| (p.source_index, p.target_index))
        .collect();
    pairs.sort_unstable();
    format!(
        "pairs={pairs:?} unmatched_src={:?} unmatched_tgt={:?}",
        a.unmatched_source, a.unmatched_target
    )
}

fn measure(name: &str, src: &FormDef, tgt: &FormDef, iters: u64) {
    println!("[{name}] PAIRS {}", pairs_string(src, tgt));

    // Allocation count for a single call (arena pre-warmed).
    let mut scratch = AlignScratch::new();
    let _ = align_forms(src, tgt, None, &mut scratch); // warm arena
    ALLOCS.store(0, Ordering::Relaxed);
    COUNTING.store(1, Ordering::Relaxed);
    let _ = align_forms(src, tgt, None, &mut scratch);
    COUNTING.store(0, Ordering::Relaxed);
    let allocs = ALLOCS.load(Ordering::Relaxed);
    println!("[{name}] ALLOC {allocs} allocations / warm align_forms call");

    // Wall-clock: reuse a single warm scratch across all iters.
    let mut scratch = AlignScratch::new();
    let _ = align_forms(src, tgt, None, &mut scratch);
    let t0 = Instant::now();
    let mut sink = 0usize;
    for _ in 0..iters {
        let a = align_forms(src, tgt, None, &mut scratch);
        sink = sink.wrapping_add(a.pairs.len());
    }
    let elapsed = t0.elapsed();
    let per = elapsed.as_nanos() as f64 / iters as f64;
    println!("[{name}] TIME {per:.1} ns/call  ({iters} iters, {elapsed:?}, sink={sink})");
    println!();
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let iters: u64 = args.get(1).and_then(|s| s.parse().ok()).unwrap_or(200_000);
    let stress_n: usize = args.get(2).and_then(|s| s.parse().ok()).unwrap_or(8);

    println!("== morph_bench (iters={iters}, stressN={stress_n}) ==\n");

    let (t1s, t1t) = tier1_equal_pair();
    measure("tier1_equal(2 pairs, no solver)", &t1s, &t1t, iters);

    let (trs, trt) = tier1_resample_pair();
    measure("tier1_resample(2 pairs, no solver)", &trs, &trt, iters);

    let (rs, rt) = realistic_pair();
    measure("realistic_bB", &rs, &rt, iters);

    for &n in &[4usize, 6, stress_n] {
        let (ss, st) = stress_pair(n);
        measure(&format!("stress_n{n}"), &ss, &st, iters / (n as u64));
    }
}
