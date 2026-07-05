//! Plain GAC all-different propagator (Régin 1994).
//!
//! Thin, stateless entry point over the unified [`propagate_gac_core`] with no
//! sentinel and no matching cache. Achieves generalized arc consistency for the
//! ordinary all-different constraint: build a variable→value bipartite graph,
//! find a maximum matching (Hopcroft-Karp), decompose the residual graph into
//! SCCs (Tarjan), and prune values that appear in no maximum matching.
//!
//! Only requires `D::Value: PartialEq` (implied by `Domain`); values map to
//! contiguous indices via deduplication, avoiding any `Ord`/`ValueIndex` bound.

use crate::constraint::{Revision, VarId};
use crate::domain::Domain;
use crate::variable::Variable;

use super::gac::propagate_gac_core;

/// Run stateless plain GAC all-different propagation on `scope`.
pub fn propagate_gac_alldiff<D: Domain>(
    scope: &[VarId],
    variables: &mut [Variable<D>],
    depth: usize,
) -> Revision
where
    D::Value: 'static,
{
    propagate_gac_core(scope, None, variables, depth, None)
}
