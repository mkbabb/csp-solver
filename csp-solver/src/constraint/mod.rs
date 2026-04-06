//! Constraint trait, built-in implementations, and devirtualized dispatch.

pub mod all_different;
pub mod dispatch;
pub mod lambda;
pub mod not_equal;
pub mod traits;

pub use all_different::AllDifferent;
pub use dispatch::ConstraintEnum;
pub use lambda::LambdaConstraint;
pub use not_equal::NotEqual;
pub use traits::{Constraint, Revision, VarId};
