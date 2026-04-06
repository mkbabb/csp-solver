//! ConstraintEnum: devirtualized dispatch for hot-path constraints.

use crate::domain::Domain;
use crate::variable::Variable;

use super::all_different::AllDifferent;
use super::lambda::LambdaConstraint;
use super::not_equal::NotEqual;
use super::traits::{Constraint, Revision, VarId};

/// Enum-dispatched constraint storage. Avoids vtable indirection for built-in types.
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
