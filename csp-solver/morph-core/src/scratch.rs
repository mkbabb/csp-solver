//! Pre-allocated scratch buffers reused across alignment calls.

use crate::types::{AlignInternalResult, PolylineSample};

/// Pre-allocated buffers reused across `align_forms` invocations to
/// avoid per-call allocation overhead. The caller creates one
/// `AlignScratch` and passes it by `&mut` to every `align_forms` call.
pub struct AlignScratch {
    /// Reused across densify calls within a single `align_forms` invocation.
    pub polyline: Vec<PolylineSample>,
    /// Row-major cost matrix, length = `n_src * n_tgt`.
    pub cost_matrix: Vec<f64>,
    /// Role tags for source subpaths.
    pub row_groups: Vec<u8>,
    /// Role tags for target subpaths.
    pub col_groups: Vec<u8>,
    /// Dense residual cache indexed by `i * n_tgt + k`.
    pub residual_cache: Vec<Option<AlignInternalResult>>,
}

impl AlignScratch {
    /// Create a new empty scratch arena.
    pub fn new() -> Self {
        Self {
            polyline: Vec::new(),
            cost_matrix: Vec::new(),
            row_groups: Vec::new(),
            col_groups: Vec::new(),
            residual_cache: Vec::new(),
        }
    }

    /// Clear and resize for a new `(n_src, n_tgt)` pair.
    pub fn prepare(&mut self, n_src: usize, n_tgt: usize) {
        self.cost_matrix.clear();
        self.cost_matrix.resize(n_src * n_tgt, f64::INFINITY);
        self.row_groups.clear();
        self.row_groups.resize(n_src, 0);
        self.col_groups.clear();
        self.col_groups.resize(n_tgt, 0);
        self.residual_cache.clear();
        self.residual_cache.resize_with(n_src * n_tgt, || None);
    }
}

impl Default for AlignScratch {
    fn default() -> Self {
        Self::new()
    }
}
