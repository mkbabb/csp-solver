//! N-ary all-different constraint with a sentinel escape value.
//!
//! Parallel to [`AllDifferent`](super::all_different::AllDifferent) but permits
//! arbitrarily many variables to share a single *sentinel* value — useful for
//! modelling partial bipartite assignment, where a dedicated "unmatched" token
//! may be selected by any number of sources simultaneously while every other
//! (real) target must still be picked at most once.
//!
//! ```no_run
//! use csp_solver::constraint::AllDifferentExcept;
//! use csp_solver::domain::BitsetDomain;
//! use csp_solver::Csp;
//!
//! // Four variables, each picking a target in 0..4. Value `0` is the
//! // "unmatched" sentinel — any number of variables may land on it.
//! let mut csp: Csp<BitsetDomain> = Csp::new();
//! let vars = csp.add_variables(&BitsetDomain::range(4), 4);
//! csp.add_constraint_enum(
//!     csp_solver::constraint::ConstraintEnum::AllDifferentExcept(
//!         AllDifferentExcept::new(vars, 0),
//!     ),
//! );
//! csp.finalize();
//! ```

use crate::domain::Domain;
use crate::variable::Variable;

use super::traits::{Constraint, Revision, VarId};

/// All-different over the scope, *except* that the configured `sentinel`
/// value may be assigned to any number of variables.
///
/// Non-sentinel assignments must remain pairwise distinct.
#[derive(Debug)]
pub struct AllDifferentExcept<V: Clone + PartialEq + std::fmt::Debug> {
    pub(crate) scope: Vec<VarId>,
    pub(crate) sentinel: V,
}

impl<V: Clone + PartialEq + std::fmt::Debug> AllDifferentExcept<V> {
    /// Create a new all-different-except constraint over `vars`, treating
    /// `sentinel` as the escape value that may be reused without conflict.
    pub fn new(vars: Vec<VarId>, sentinel: V) -> Self {
        Self { scope: vars, sentinel }
    }

    pub(crate) fn check_impl(&self, assignment: &[Option<V>]) -> bool {
        // Collect non-sentinel assigned values; sentinel assignments are
        // elided entirely so they never participate in the pairwise test.
        let assigned: Vec<&V> = self
            .scope
            .iter()
            .filter_map(|&v| assignment[v as usize].as_ref())
            .filter(|val| **val != self.sentinel)
            .collect();
        for i in 0..assigned.len() {
            for j in (i + 1)..assigned.len() {
                if assigned[i] == assigned[j] {
                    return false;
                }
            }
        }
        true
    }

    /// Singleton removal, skipping singletons whose value is the sentinel.
    ///
    /// A variable pinned to the sentinel does not forbid peers from
    /// choosing the sentinel themselves — that is the whole point of the
    /// construct — so its value must *not* be pruned from the rest of the
    /// scope. Non-sentinel singletons behave exactly like
    /// [`AllDifferent`](super::all_different::AllDifferent).
    ///
    /// This is plain singleton propagation, not Régin's GAC. Callers that
    /// need generalized arc consistency over the non-sentinel subset at
    /// large `N` should layer it on top externally; a parallel to
    /// `solver::gac_alldiff::propagate_gac_alldiff` for this constraint is
    /// out of scope here.
    pub(crate) fn revise_impl<D>(&self, vars: &mut [Variable<D>], depth: usize) -> Revision
    where
        D: Domain<Value = V>,
    {
        let mut changed = false;
        let singletons: Vec<(VarId, D::Value)> = self
            .scope
            .iter()
            .filter_map(|&v| vars[v as usize].domain.singleton_value().map(|val| (v, val)))
            .filter(|(_, val)| *val != self.sentinel)
            .collect();

        for (sv, sval) in &singletons {
            for &other in &self.scope {
                if other == *sv { continue; }
                if vars[other as usize].prune(sval, depth) { changed = true; }
                if vars[other as usize].domain.is_empty() { return Revision::Unsatisfiable; }
            }
        }

        if changed { Revision::Changed } else { Revision::Unchanged }
    }
}

impl<D> Constraint<D> for AllDifferentExcept<D::Value>
where
    D: Domain,
    D::Value: PartialEq,
{
    fn scope(&self) -> &[VarId] { &self.scope }
    fn check(&self, assignment: &[Option<D::Value>]) -> bool { self.check_impl(assignment) }
    fn revise(&self, vars: &mut [Variable<D>], depth: usize) -> Revision {
        self.revise_impl(vars, depth)
    }
}
