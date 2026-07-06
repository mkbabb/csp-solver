//! `SolveConfig` / `SolveStats` PyO3 bindings + the `CancelToken` cooperative
//! cancellation handle.

use pyo3::prelude::*;

use super::enums::{Ordering, Pruning};
use crate::{CancelToken as RustCancelToken, SolveConfig as RustSolveConfig};

// ═══════════════════════════════════════════════════════════════════════════
// Cooperative cancellation
// ═══════════════════════════════════════════════════════════════════════════

/// A cancellation handle for a running (or not-yet-started) solve.
///
/// Construct one, pass it into `SolveConfig(cancel=token)`, keep the same
/// `token` on the Python side, and call `token.cancel()` from *any* thread —
/// including the asyncio event-loop thread — to stop a search that's
/// currently running on a `Python::allow_threads`-released worker thread.
/// Checked at the same cadence as `node_budget` inside the search loop, so
/// cancellation typically takes effect within a handful of search nodes.
#[pyclass]
#[derive(Clone, Default)]
pub struct CancelToken {
    pub(super) inner: RustCancelToken,
}

#[pymethods]
impl CancelToken {
    #[new]
    fn new() -> Self {
        Self {
            inner: RustCancelToken::new(),
        }
    }

    /// Request cancellation. Safe to call while a search holding this
    /// token is running on another thread.
    fn cancel(&self) {
        self.inner.cancel();
    }

    #[getter]
    fn is_cancelled(&self) -> bool {
        self.inner.is_cancelled()
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// SolveConfig + SolveStats
// ═══════════════════════════════════════════════════════════════════════════

#[pyclass]
#[derive(Clone)]
pub struct SolveConfig {
    #[pyo3(get, set)]
    pub pruning: Pruning,
    #[pyo3(get, set)]
    pub ordering: Ordering,
    #[pyo3(get, set)]
    pub max_solutions: usize,
    /// Maximum number of search nodes before aborting early.
    /// `None` disables the budget. Defaults to 1_000_000.
    #[pyo3(get, set)]
    pub node_budget: Option<u64>,
    /// Cooperative cancellation handle. `None` (the default) means the
    /// search cannot be cancelled externally. See [`CancelToken`].
    #[pyo3(get, set)]
    pub cancel: Option<CancelToken>,
}

#[pymethods]
impl SolveConfig {
    #[new]
    #[pyo3(signature = (pruning=Pruning::FORWARD_CHECKING, ordering=Ordering::CHRONOLOGICAL, max_solutions=1, node_budget=Some(1_000_000), cancel=None))]
    fn new(
        pruning: Pruning,
        ordering: Ordering,
        max_solutions: usize,
        node_budget: Option<u64>,
        cancel: Option<CancelToken>,
    ) -> Self {
        Self {
            pruning,
            ordering,
            max_solutions,
            node_budget,
            cancel,
        }
    }
}

impl From<&SolveConfig> for RustSolveConfig {
    fn from(c: &SolveConfig) -> Self {
        RustSolveConfig {
            pruning: c.pruning.into(),
            ordering: c.ordering.into(),
            max_solutions: c.max_solutions,
            node_budget: c.node_budget,
            cancel: c.cancel.as_ref().map(|t| t.inner.clone()),
            ..Default::default()
        }
    }
}

#[pyclass]
#[derive(Clone)]
pub struct SolveStats {
    #[pyo3(get)]
    pub backtracks: u64,
    #[pyo3(get)]
    pub nodes_explored: u64,
    #[pyo3(get)]
    pub propagations: u64,
    /// `True` when the last search hit its `node_budget` and returned
    /// best-so-far rather than optimal results.
    #[pyo3(get)]
    pub budget_exceeded: bool,
    /// `True` when the last search was stopped early via a `CancelToken`
    /// rather than hitting `node_budget`. Distinct from `budget_exceeded`.
    #[pyo3(get)]
    pub cancelled: bool,
}
