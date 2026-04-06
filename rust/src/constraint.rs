//! Constraint trait and built-in constraint types.

use std::fmt::Debug;

use crate::domain::Domain;
use crate::variable::Variable;

/// Unique variable identifier (index into the variable array).
pub type VarId = u32;

/// Result of running `revise` on a constraint.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Revision {
    /// No values were pruned.
    Unchanged,
    /// At least one value was pruned, but no domain was wiped out.
    Changed,
    /// A domain was wiped out -- the current partial assignment is unsatisfiable.
    Unsatisfiable,
}

/// A constraint over one or more CSP variables.
pub trait Constraint<D: Domain>: Debug {
    /// The variables this constraint involves (its "scope").
    fn scope(&self) -> &[VarId];

    /// Check whether a full or partial assignment satisfies this constraint.
    /// `assignment[var_id]` is `Some(value)` if assigned, `None` if unassigned.
    fn check(&self, assignment: &[Option<D::Value>]) -> bool;

    /// AC-3 style revision: prune values from domains that have no support.
    /// `depth` is the current search depth (for undo-log bookkeeping).
    ///
    /// Default implementation does pairwise support checking for binary constraints.
    fn revise(&self, vars: &mut [Variable<D>], depth: usize) -> Revision {
        let scope = self.scope();
        if scope.len() != 2 {
            return Revision::Unchanged;
        }

        let xi = scope[0] as usize;
        let xj = scope[1] as usize;
        let mut changed = false;

        // Revise xi against xj
        let vals_i = vars[xi].domain.values();
        let vals_j = vars[xj].domain.values();

        for vi in &vals_i {
            let mut supported = false;
            for vj in &vals_j {
                let mut assignment = vec![None; vars.len()];
                assignment[xi] = Some(vi.clone());
                assignment[xj] = Some(vj.clone());
                if self.check(&assignment) {
                    supported = true;
                    break;
                }
            }
            if !supported {
                vars[xi].prune(vi, depth);
                changed = true;
            }
        }

        if vars[xi].domain.is_empty() {
            return Revision::Unsatisfiable;
        }

        // Revise xj against xi
        let vals_j = vars[xj].domain.values();
        let vals_i = vars[xi].domain.values();

        for vj in &vals_j {
            let mut supported = false;
            for vi in &vals_i {
                let mut assignment = vec![None; vars.len()];
                assignment[xi] = Some(vi.clone());
                assignment[xj] = Some(vj.clone());
                if self.check(&assignment) {
                    supported = true;
                    break;
                }
            }
            if !supported {
                vars[xj].prune(vj, depth);
                changed = true;
            }
        }

        if vars[xj].domain.is_empty() {
            return Revision::Unsatisfiable;
        }

        if changed {
            Revision::Changed
        } else {
            Revision::Unchanged
        }
    }
}

// ---------------------------------------------------------------------------
// Built-in constraint: NotEqual
// ---------------------------------------------------------------------------

/// Binary not-equal constraint: `x != y`.
#[derive(Debug)]
pub struct NotEqual {
    scope: [VarId; 2],
}

impl NotEqual {
    pub fn new(x: VarId, y: VarId) -> Self {
        Self { scope: [x, y] }
    }
}

impl<D: Domain> Constraint<D> for NotEqual
where
    D::Value: PartialEq,
{
    fn scope(&self) -> &[VarId] {
        &self.scope
    }

    fn check(&self, assignment: &[Option<D::Value>]) -> bool {
        let xi = self.scope[0] as usize;
        let xj = self.scope[1] as usize;
        match (&assignment[xi], &assignment[xj]) {
            (Some(a), Some(b)) => a != b,
            _ => true, // if either is unassigned, constraint is trivially satisfied
        }
    }

    fn revise(&self, vars: &mut [Variable<D>], depth: usize) -> Revision {
        let xi = self.scope[0] as usize;
        let xj = self.scope[1] as usize;
        let mut changed = false;

        // If xi is singleton {v}, remove v from xj
        if let Some(v) = vars[xi].domain.singleton_value() {
            if vars[xj].prune(&v, depth) {
                changed = true;
            }
        }

        // If xj is singleton {v}, remove v from xi
        if let Some(v) = vars[xj].domain.singleton_value() {
            if vars[xi].prune(&v, depth) {
                changed = true;
            }
        }

        if vars[xi].domain.is_empty() || vars[xj].domain.is_empty() {
            return Revision::Unsatisfiable;
        }

        if changed {
            Revision::Changed
        } else {
            Revision::Unchanged
        }
    }
}

// ---------------------------------------------------------------------------
// Built-in constraint: AllDifferent
// ---------------------------------------------------------------------------

/// N-ary all-different constraint: all variables in scope must have distinct values.
#[derive(Debug)]
pub struct AllDifferent {
    scope: Vec<VarId>,
}

impl AllDifferent {
    pub fn new(vars: Vec<VarId>) -> Self {
        Self { scope: vars }
    }
}

impl<D: Domain> Constraint<D> for AllDifferent
where
    D::Value: PartialEq,
{
    fn scope(&self) -> &[VarId] {
        &self.scope
    }

    fn check(&self, assignment: &[Option<D::Value>]) -> bool {
        let assigned: Vec<&D::Value> = self
            .scope
            .iter()
            .filter_map(|&v| assignment[v as usize].as_ref())
            .collect();
        // Check all assigned values are distinct
        for i in 0..assigned.len() {
            for j in (i + 1)..assigned.len() {
                if assigned[i] == assigned[j] {
                    return false;
                }
            }
        }
        true
    }

    fn revise(&self, vars: &mut [Variable<D>], depth: usize) -> Revision {
        // Simple propagation: if any variable is a singleton, remove its value
        // from all other variables in the scope.
        let mut changed = false;

        let singletons: Vec<(VarId, D::Value)> = self
            .scope
            .iter()
            .filter_map(|&v| {
                vars[v as usize]
                    .domain
                    .singleton_value()
                    .map(|val| (v, val))
            })
            .collect();

        for (sv, sval) in &singletons {
            for &other in &self.scope {
                if other == *sv {
                    continue;
                }
                if vars[other as usize].prune(sval, depth) {
                    changed = true;
                }
                if vars[other as usize].domain.is_empty() {
                    return Revision::Unsatisfiable;
                }
            }
        }

        if changed {
            Revision::Changed
        } else {
            Revision::Unchanged
        }
    }
}

// ---------------------------------------------------------------------------
// Built-in constraint: Lambda (generic closure-based)
// ---------------------------------------------------------------------------

/// A generic constraint defined by a closure.
///
/// Isomorphic to Python's `add_constraint(checker, variables)`.
pub struct LambdaConstraint<D: Domain> {
    scope: Vec<VarId>,
    checker: Box<dyn Fn(&[Option<D::Value>]) -> bool>,
    label: String,
}

impl<D: Domain> std::fmt::Debug for LambdaConstraint<D> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "LambdaConstraint({}, {:?})", self.label, self.scope)
    }
}

impl<D: Domain> LambdaConstraint<D> {
    /// Create a new lambda constraint.
    ///
    /// - `scope`: the variable IDs this constraint involves.
    /// - `checker`: a function that returns `true` if the (partial) assignment is valid.
    ///   The function receives the full assignment array; only indices in `scope` are relevant.
    /// - `label`: a human-readable label for debugging.
    pub fn new(
        scope: Vec<VarId>,
        checker: impl Fn(&[Option<D::Value>]) -> bool + 'static,
        label: impl Into<String>,
    ) -> Self {
        Self {
            scope,
            checker: Box::new(checker),
            label: label.into(),
        }
    }
}

impl<D: Domain> Constraint<D> for LambdaConstraint<D> {
    fn scope(&self) -> &[VarId] {
        &self.scope
    }

    fn check(&self, assignment: &[Option<D::Value>]) -> bool {
        (self.checker)(assignment)
    }
}
