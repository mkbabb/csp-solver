//! Constraint trait, built-in constraint types, and devirtualized enum dispatch.

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
    fn check(&self, assignment: &[Option<D::Value>]) -> bool;

    /// AC-3 style revision: prune values from domains that have no support.
    fn revise(&self, vars: &mut [Variable<D>], depth: usize) -> Revision {
        let scope = self.scope();
        if scope.len() != 2 {
            return Revision::Unchanged;
        }

        let xi = scope[0] as usize;
        let xj = scope[1] as usize;
        let mut changed = false;

        let mut assignment: Vec<Option<D::Value>> = vec![None; vars.len()];

        let vals_i = vars[xi].domain.values();
        let vals_j = vars[xj].domain.values();

        for vi in &vals_i {
            let mut supported = false;
            assignment[xi] = Some(vi.clone());
            for vj in &vals_j {
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
        assignment[xi] = None;
        assignment[xj] = None;

        if vars[xi].domain.is_empty() {
            return Revision::Unsatisfiable;
        }

        let vals_j = vars[xj].domain.values();
        let vals_i = vars[xi].domain.values();

        for vj in &vals_j {
            let mut supported = false;
            assignment[xj] = Some(vj.clone());
            for vi in &vals_i {
                assignment[xi] = Some(vi.clone());
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

        if changed { Revision::Changed } else { Revision::Unchanged }
    }
}

// ---------------------------------------------------------------------------
// Built-in constraint: NotEqual
// ---------------------------------------------------------------------------

#[derive(Debug)]
pub struct NotEqual {
    pub(crate) scope: [VarId; 2],
}

impl NotEqual {
    pub fn new(x: VarId, y: VarId) -> Self {
        Self { scope: [x, y] }
    }

    pub(crate) fn check_impl<V: PartialEq>(&self, assignment: &[Option<V>]) -> bool {
        let xi = self.scope[0] as usize;
        let xj = self.scope[1] as usize;
        match (&assignment[xi], &assignment[xj]) {
            (Some(a), Some(b)) => a != b,
            _ => true,
        }
    }

    pub(crate) fn revise_impl<D: Domain>(&self, vars: &mut [Variable<D>], depth: usize) -> Revision
    where
        D::Value: PartialEq,
    {
        let xi = self.scope[0] as usize;
        let xj = self.scope[1] as usize;
        let mut changed = false;

        if let Some(v) = vars[xi].domain.singleton_value() {
            if vars[xj].prune(&v, depth) {
                changed = true;
            }
        }
        if let Some(v) = vars[xj].domain.singleton_value() {
            if vars[xi].prune(&v, depth) {
                changed = true;
            }
        }

        if vars[xi].domain.is_empty() || vars[xj].domain.is_empty() {
            return Revision::Unsatisfiable;
        }

        if changed { Revision::Changed } else { Revision::Unchanged }
    }
}

impl<D: Domain> Constraint<D> for NotEqual
where
    D::Value: PartialEq,
{
    fn scope(&self) -> &[VarId] { &self.scope }
    fn check(&self, assignment: &[Option<D::Value>]) -> bool { self.check_impl(assignment) }
    fn revise(&self, vars: &mut [Variable<D>], depth: usize) -> Revision { self.revise_impl(vars, depth) }
}

// ---------------------------------------------------------------------------
// Built-in constraint: AllDifferent
// ---------------------------------------------------------------------------

#[derive(Debug)]
pub struct AllDifferent {
    pub(crate) scope: Vec<VarId>,
}

impl AllDifferent {
    pub fn new(vars: Vec<VarId>) -> Self {
        Self { scope: vars }
    }

    pub(crate) fn check_impl<V: PartialEq>(&self, assignment: &[Option<V>]) -> bool {
        let assigned: Vec<&V> = self
            .scope
            .iter()
            .filter_map(|&v| assignment[v as usize].as_ref())
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

    /// Singleton removal: prune assigned values from peers.
    ///
    /// GAC (Régin's algorithm) is available separately via
    /// `solver::gac_alldiff::propagate_gac_alldiff` for one-shot use
    /// (e.g. initial propagation). It is NOT called here because AC-3
    /// invokes revise() thousands of times and GAC is O(V√E) per call.
    pub(crate) fn revise_impl<D: Domain>(&self, vars: &mut [Variable<D>], depth: usize) -> Revision
    where
        D::Value: PartialEq,
    {
        let mut changed = false;
        let singletons: Vec<(VarId, D::Value)> = self
            .scope
            .iter()
            .filter_map(|&v| vars[v as usize].domain.singleton_value().map(|val| (v, val)))
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

impl<D: Domain> Constraint<D> for AllDifferent
where
    D::Value: PartialEq,
{
    fn scope(&self) -> &[VarId] { &self.scope }
    fn check(&self, assignment: &[Option<D::Value>]) -> bool { self.check_impl(assignment) }
    fn revise(&self, vars: &mut [Variable<D>], depth: usize) -> Revision { self.revise_impl(vars, depth) }
}

// ---------------------------------------------------------------------------
// Built-in constraint: Lambda (generic closure-based)
// ---------------------------------------------------------------------------

pub struct LambdaConstraint<D: Domain> {
    pub(crate) scope: Vec<VarId>,
    pub(crate) checker: Box<dyn Fn(&[Option<D::Value>]) -> bool>,
    label: String,
}

impl<D: Domain> std::fmt::Debug for LambdaConstraint<D> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "LambdaConstraint({}, {:?})", self.label, self.scope)
    }
}

impl<D: Domain> LambdaConstraint<D> {
    pub fn new(
        scope: Vec<VarId>,
        checker: impl Fn(&[Option<D::Value>]) -> bool + 'static,
        label: impl Into<String>,
    ) -> Self {
        Self { scope, checker: Box::new(checker), label: label.into() }
    }
}

impl<D: Domain> Constraint<D> for LambdaConstraint<D> {
    fn scope(&self) -> &[VarId] { &self.scope }
    fn check(&self, assignment: &[Option<D::Value>]) -> bool { (self.checker)(assignment) }
}

// ---------------------------------------------------------------------------
// ConstraintEnum: devirtualized dispatch for hot-path constraints
// ---------------------------------------------------------------------------

pub enum ConstraintEnum<D: Domain> {
    NotEqual(NotEqual),
    AllDifferent(AllDifferent),
    Lambda(LambdaConstraint<D>),
    Custom(Box<dyn Constraint<D>>),
}

impl<D: Domain> std::fmt::Debug for ConstraintEnum<D> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::NotEqual(c) => c.fmt(f),
            Self::AllDifferent(c) => c.fmt(f),
            Self::Lambda(c) => c.fmt(f),
            Self::Custom(c) => c.fmt(f),
        }
    }
}

impl<D: Domain> ConstraintEnum<D>
where
    D::Value: PartialEq,
{
    #[inline]
    pub fn scope(&self) -> &[VarId] {
        match self {
            Self::NotEqual(c) => &c.scope,
            Self::AllDifferent(c) => &c.scope,
            Self::Lambda(c) => &c.scope,
            Self::Custom(c) => c.scope(),
        }
    }

    #[inline]
    pub fn check(&self, assignment: &[Option<D::Value>]) -> bool {
        match self {
            Self::NotEqual(c) => c.check_impl(assignment),
            Self::AllDifferent(c) => c.check_impl(assignment),
            Self::Lambda(c) => (c.checker)(assignment),
            Self::Custom(c) => c.check(assignment),
        }
    }

    #[inline]
    pub fn revise(&self, vars: &mut [Variable<D>], depth: usize) -> Revision {
        match self {
            Self::NotEqual(c) => c.revise_impl(vars, depth),
            Self::AllDifferent(c) => c.revise_impl(vars, depth),
            Self::Lambda(c) => <LambdaConstraint<D> as Constraint<D>>::revise(c, vars, depth),
            Self::Custom(c) => c.revise(vars, depth),
        }
    }
}

