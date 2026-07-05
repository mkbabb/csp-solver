//! GAC all-different-except propagator (sentinel-aware Régin 1994).
//!
//! Thin, stateless entry point over the unified [`propagate_gac_core`] with the
//! sentinel supplied. Tolerates a designated *sentinel* value any number of
//! variables may share; non-sentinel assignments must still be pairwise
//! distinct. The sentinel is excluded from the value side of the bipartite
//! graph, variables narrowed to `{sentinel}` drop out of the variable side, and
//! variables retaining the sentinel are never forced onto a non-sentinel value
//! (the sentinel is their escape valve).
//!
//! # Complexity
//!
//! Hopcroft-Karp maximum matching is O(E√V) and Tarjan SCC is O(V + E). For the
//! sparse constraint graphs typical of scheduling this is O(n√n) per call; for
//! *dense* cost matrices (every variable reaches every value, E = Θ(n²)) it is
//! O(n^2.5). The constraint-level threshold amortizes the constant factor: below
//! it, singleton removal captures every pruning opportunity GAC would.
//!
//! # Example: GAC provides stronger pruning than singleton removal
//!
//! ```
//! use csp_solver::constraint::{Revision, VarId};
//! use csp_solver::domain::BitsetDomain;
//! use csp_solver::solver::gac_alldiff_except::propagate_gac_alldiff_except;
//! use csp_solver::variable::Variable;
//!
//! // 5 variables, domain {0, 1, 2, 3, 4}, sentinel = 0.
//! // Var 0 is assigned to 1 (non-sentinel), var 1 is assigned to 2.
//! let scope: Vec<VarId> = (0..5).collect();
//! let mut vars: Vec<Variable<BitsetDomain>> = vec![
//!     Variable::new(BitsetDomain::new([1])),       // assigned 1
//!     Variable::new(BitsetDomain::new([2])),       // assigned 2
//!     Variable::new(BitsetDomain::new([0, 3, 4])), // sentinel + {3, 4}
//!     Variable::new(BitsetDomain::new([0, 3, 4])), // sentinel + {3, 4}
//!     Variable::new(BitsetDomain::new([0, 3, 4])), // sentinel + {3, 4}
//! ];
//! let rev = propagate_gac_alldiff_except(&scope, &0u32, &mut vars, 0);
//! assert_ne!(rev, Revision::Unsatisfiable);
//! ```

use crate::constraint::traits::{Revision, VarId};
use crate::domain::Domain;
use crate::variable::Variable;

use super::gac::propagate_gac_core;

/// Run stateless sentinel-aware GAC all-different-except propagation on `scope`.
pub fn propagate_gac_alldiff_except<D: Domain>(
    scope: &[VarId],
    sentinel: &D::Value,
    variables: &mut [Variable<D>],
    depth: usize,
) -> Revision
where
    D::Value: PartialEq + Clone + std::fmt::Debug + 'static,
{
    propagate_gac_core(scope, Some(sentinel), variables, depth, None)
}
