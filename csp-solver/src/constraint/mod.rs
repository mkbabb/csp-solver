//! Constraint trait, built-in implementations, and devirtualized dispatch.

pub mod all_different;
pub mod dispatch;
pub mod lambda;
pub mod not_equal;
pub mod soft;
pub mod traits;

pub use all_different::AllDifferent;
pub use dispatch::ConstraintEnum;
pub use lambda::LambdaConstraint;
pub use not_equal::NotEqual;
pub use soft::SoftLambdaConstraint;
pub use traits::{Constraint, Revision, SoftConstraint, VarId};
