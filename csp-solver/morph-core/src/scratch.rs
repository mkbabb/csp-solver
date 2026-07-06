//! Pre-allocated scratch buffers reused across alignment calls.
//!
//! Two arenas, both owned by [`AlignScratch`]:
//!
//! - the **Tier-2 cost-matrix** buffers (`cost_matrix`, `row_groups`,
//!   `col_groups`), sized `n_src·n_tgt` once per `align_forms` call;
//! - the **per-pair geometry** arena ([`PairScratch`]), reused across
//!   every materialized pair *within* a call so the equal-anchor-count
//!   pipeline allocates only the two segment vectors that escape into
//!   the returned `SubpathPair` (see `align/pairwise.rs`).

use crate::types::{PolylineSample, Segment, Vec2};

/// Pre-allocated buffers reused across `align_forms` invocations to
/// avoid per-call allocation overhead. The caller creates one
/// `AlignScratch` and passes it by `&mut` to every `align_forms` call.
#[derive(Default)]
pub struct AlignScratch {
    /// Row-major cost matrix, length = `n_src * n_tgt`.
    pub cost_matrix: Vec<f64>,
    /// Role tags for source subpaths.
    pub row_groups: Vec<u8>,
    /// Role tags for target subpaths.
    pub col_groups: Vec<u8>,
    /// Per-pair geometry arena, reused across every materialized pair.
    pub pair: PairScratch,
}

impl AlignScratch {
    /// Create a new empty scratch arena.
    pub fn new() -> Self {
        Self::default()
    }

    /// Clear and resize the cost-matrix buffers for a new
    /// `(n_src, n_tgt)` pair. The [`PairScratch`] resizes itself lazily
    /// on first use per pair, so it is untouched here.
    pub fn prepare(&mut self, n_src: usize, n_tgt: usize) {
        self.cost_matrix.clear();
        self.cost_matrix.resize(n_src * n_tgt, f64::INFINITY);
        self.row_groups.clear();
        self.row_groups.resize(n_src, 0);
        self.col_groups.clear();
        self.col_groups.resize(n_tgt, 0);
    }
}

/// Reusable working buffers for the per-pair geometry pipeline
/// (`align/pairwise.rs`). Every buffer is `clear()`-and-refill: capacity
/// is retained across pairs, so after the first pair the equal-count
/// path performs zero scratch allocations. Only the two *final* segment
/// vectors — which move into the returned `SubpathPair` — are freshly
/// allocated per pair.
#[derive(Default)]
pub struct PairScratch {
    /// Densified polyline sampling (arc-length annotated). Reused by
    /// `resample_contour_into`.
    pub poly: Vec<PolylineSample>,
    /// Arc-length-equidistant anchors chosen during resampling.
    pub taken: Vec<PolylineSample>,
    /// Interior polyline slice between two anchors (LSQ handle fit input).
    pub interior: Vec<Vec2>,
    /// Normalized/resampled source contour (working frame).
    pub work_src: Vec<Segment>,
    /// Normalized/resampled/rotated target contour (working frame).
    pub work_tgt: Vec<Segment>,
    /// Resample output buffer, swapped into a work buffer when a contour's
    /// anchor count must change (disjoint from the work buffer being read).
    pub resampled: Vec<Segment>,
}

impl PairScratch {
    /// Create an empty per-pair arena.
    pub fn new() -> Self {
        Self::default()
    }
}
