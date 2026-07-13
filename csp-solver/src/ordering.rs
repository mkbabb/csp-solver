//! Variable ordering heuristics.

use crate::constraint::VarId;
use crate::domain::Domain;
use crate::variable::Variable;

/// Variable ordering strategy for search.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Ordering {
    /// Chronological: pick variables in the order they appear on the stack.
    Chronological,
    /// Fail-first (MRV): pick the variable with the smallest domain.
    FailFirst,
    /// Mrv: pick the variable minimizing `domain-size / Σ constraint-weights`.
    /// The weights are frozen at 1.0 (no dom/wdeg bumping is wired to the
    /// kernel), so the denominator is a static per-variable weighted degree,
    /// precomputed once by [`precompute_var_wdeg`] rather than re-summed at every
    /// node.
    Mrv,
}

/// Precompute each variable's frozen weighted degree — Σ of its incident
/// constraint weights — the denominator of the [`Ordering::Mrv`] score.
///
/// The weights are frozen at 1.0 (no dom/wdeg bumping is wired), so this sum is
/// invariant across the entire search; computing it once here replaces the
/// per-node re-sum the [`Ordering::Mrv`] branch used to run for every stacked
/// variable at every node (P2-solver-backend MRV). Returns an **empty** vec for
/// the orderings that never consult wdeg (`Chronological` / `FailFirst` pay
/// nothing — not one add). The sum walks `var_constraint_ids[v]` in the same
/// order the per-node loop did, so each `var_wdeg[v]` is bit-identical to the
/// value the old code produced and the Mrv trajectory is unchanged.
///
/// **Frozen-weight invariant.** If a later tranche wires dom/wdeg bumping (the
/// reason the kernel still threads `constraint_weights` as `&mut`), it must
/// recompute — or incrementally patch — the affected `var_wdeg` entries on each
/// weight change, or the score denominator goes stale.
pub fn precompute_var_wdeg(
    ordering: Ordering,
    constraint_weights: &[f64],
    var_constraint_ids: &[Vec<usize>],
) -> Vec<f64> {
    if ordering != Ordering::Mrv {
        return Vec::new();
    }
    var_constraint_ids
        .iter()
        .map(|cids| cids.iter().map(|&cid| constraint_weights[cid]).sum())
        .collect()
}

/// Select the next unassigned variable from the stack according to the ordering heuristic.
///
/// Returns the index into `stack` of the chosen variable, or `None` if empty.
/// `var_wdeg` is the [`precompute_var_wdeg`] output — consulted only by
/// [`Ordering::Mrv`], and empty for the orderings that ignore it.
pub fn select_variable<D: Domain>(
    stack: &[VarId],
    variables: &[Variable<D>],
    ordering: Ordering,
    var_wdeg: &[f64],
) -> Option<usize> {
    if stack.is_empty() {
        return None;
    }

    match ordering {
        Ordering::Chronological => Some(stack.len() - 1),

        Ordering::FailFirst => {
            let mut best_idx = 0;
            let mut best_size = usize::MAX;
            for (i, &var) in stack.iter().enumerate() {
                let sz = variables[var as usize].domain.size();
                if sz < best_size {
                    best_size = sz;
                    best_idx = i;
                }
            }
            Some(best_idx)
        }

        // Mrv branches on `dom / wdeg`; `wdeg` is the precomputed frozen sum.
        Ordering::Mrv => {
            let mut best_idx = 0;
            let mut best_score = f64::MAX;
            for (i, &var) in stack.iter().enumerate() {
                let dom_size = variables[var as usize].domain.size() as f64;
                let wdeg = var_wdeg[var as usize];
                let score = dom_size / wdeg.max(1e-9);
                if score < best_score {
                    best_score = score;
                    best_idx = i;
                }
            }
            Some(best_idx)
        }
    }
}
