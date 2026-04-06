//! CSP variable with domain tracking and pruned-value undo log.

use crate::domain::Domain;

/// A CSP variable holding its current domain and an undo log for backtracking.
#[derive(Debug, Clone)]
pub struct Variable<D: Domain> {
    /// Current (working) domain -- mutated during search.
    pub domain: D,
    /// Original domain -- used for full reset.
    original_domain: D,
    /// Undo log: `(depth, removed_value)` pairs. During backtracking, all entries
    /// at the given depth are restored into the domain.
    pruned: Vec<(usize, D::Value)>,
}

impl<D: Domain> Variable<D> {
    /// Create a new variable with the given initial domain.
    pub fn new(domain: D) -> Self {
        Self {
            original_domain: domain.clone(),
            domain,
            pruned: Vec::new(),
        }
    }

    /// Record that `val` was pruned at `depth`, and remove it from the domain.
    /// Returns `true` if the value was actually present and removed.
    pub fn prune(&mut self, val: &D::Value, depth: usize) -> bool {
        if self.domain.remove(val) {
            self.pruned.push((depth, val.clone()));
            true
        } else {
            false
        }
    }

    /// Restore all values pruned at the given `depth`.
    pub fn restore(&mut self, depth: usize) {
        // Walk backward and pop all entries matching this depth.
        while let Some(&(d, _)) = self.pruned.last() {
            if d == depth {
                let (_, val) = self.pruned.pop().unwrap();
                self.domain.add(&val);
            } else {
                break;
            }
        }
    }

    /// Reset to the original domain, clearing the undo log.
    pub fn reset(&mut self) {
        self.domain = self.original_domain.clone();
        self.pruned.clear();
    }

    /// Replace the current domain entirely (used during initial propagation).
    pub fn set_domain(&mut self, domain: D) {
        self.domain = domain;
    }
}
