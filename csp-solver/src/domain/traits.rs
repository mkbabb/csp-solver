//! Core Domain trait and LatticeDomain extension.

use std::fmt::Debug;

/// A domain of possible values for a CSP variable.
///
/// Implementations must support efficient membership testing, removal, and iteration.
pub trait Domain: Clone + PartialEq + Debug {
    /// The type of individual values in this domain.
    type Value: Clone + PartialEq + Debug;

    /// Number of values currently in the domain.
    fn size(&self) -> usize;

    /// Whether the domain is empty (wipe-out).
    fn is_empty(&self) -> bool {
        self.size() == 0
    }

    /// Whether the domain contains exactly one value.
    fn is_singleton(&self) -> bool {
        self.size() == 1
    }

    /// If the domain is a singleton, return a reference to its sole value.
    fn singleton_value(&self) -> Option<Self::Value> {
        if self.is_singleton() {
            self.values().into_iter().next()
        } else {
            None
        }
    }

    /// Test membership.
    fn contains(&self, val: &Self::Value) -> bool;

    /// Remove a value from the domain. Returns `true` if the value was present.
    fn remove(&mut self, val: &Self::Value) -> bool;

    /// Add a value back into the domain.
    fn add(&mut self, val: &Self::Value);

    /// Collect all current values.
    fn values(&self) -> Vec<Self::Value>;

    /// Iterate over values without allocating.
    ///
    /// Default collects to Vec; BitsetDomain overrides with zero-alloc BitsetIter.
    fn iter(&self) -> impl Iterator<Item = Self::Value> + '_ {
        self.values().into_iter()
    }
}

/// Extension trait for monotonic lattice domains (e.g. FIRST/FOLLOW sets).
///
/// A lattice domain contains a single "current value" that grows monotonically
/// via `join`. Because the value is always a singleton, no search is needed --
/// propagation alone reaches the fixed point.
pub trait LatticeDomain: Domain {
    /// The bottom element of the lattice.
    fn bottom() -> Self;

    /// Join (least upper bound) with `other`. Returns `true` if `self` changed.
    fn join(&mut self, other: &Self) -> bool;
}
