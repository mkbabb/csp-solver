//! Pre-built constraint dependency graph for O(1) neighbor lookup.

use crate::constraint::{Constraint, VarId};
use crate::domain::Domain;

/// Adjacency structure: maps variables to constraints and constraints to neighbor constraints.
#[derive(Debug, Clone)]
pub struct Adjacency {
    /// For each variable, the indices of constraints involving it.
    pub var_constraints: Vec<Vec<usize>>,
    /// For each constraint, the indices of other constraints that share at least one variable.
    pub constraint_neighbors: Vec<Vec<usize>>,
    /// For each variable, the set of neighbor variables (variables sharing a constraint).
    pub var_neighbors: Vec<Vec<VarId>>,
}

impl Adjacency {
    /// Build the adjacency graph from a set of constraints.
    ///
    /// `num_vars`: total number of variables in the CSP.
    /// `constraints`: the constraint list.
    pub fn build<D: Domain>(
        num_vars: usize,
        constraints: &[Box<dyn Constraint<D>>],
    ) -> Self {
        let num_constraints = constraints.len();

        // Build var_constraints: for each variable, which constraints mention it.
        let mut var_constraints = vec![Vec::new(); num_vars];
        for (ci, c) in constraints.iter().enumerate() {
            for &v in c.scope() {
                var_constraints[v as usize].push(ci);
            }
        }

        // Build constraint_neighbors: two constraints are neighbors if they share a variable.
        let mut constraint_neighbors = vec![Vec::new(); num_constraints];
        for vc in &var_constraints {
            for &ci in vc {
                for &cj in vc {
                    if ci != cj {
                        constraint_neighbors[ci].push(cj);
                    }
                }
            }
        }
        // Deduplicate
        for neighbors in &mut constraint_neighbors {
            neighbors.sort_unstable();
            neighbors.dedup();
        }

        // Build var_neighbors: variables that share at least one constraint.
        let mut var_neighbors: Vec<Vec<VarId>> = vec![Vec::new(); num_vars];
        for c in constraints {
            let scope = c.scope();
            for &vi in scope {
                for &vj in scope {
                    if vi != vj {
                        var_neighbors[vi as usize].push(vj);
                    }
                }
            }
        }
        for neighbors in &mut var_neighbors {
            neighbors.sort_unstable();
            neighbors.dedup();
        }

        Self {
            var_constraints,
            constraint_neighbors,
            var_neighbors,
        }
    }

    /// Get all constraint indices involving a given variable.
    pub fn constraints_for(&self, var: VarId) -> &[usize] {
        &self.var_constraints[var as usize]
    }

    /// Get all neighbor constraint indices for a given constraint.
    pub fn neighbors_of_constraint(&self, ci: usize) -> &[usize] {
        &self.constraint_neighbors[ci]
    }

    /// Get all neighbor variables for a given variable.
    pub fn neighbors_of_var(&self, var: VarId) -> &[VarId] {
        &self.var_neighbors[var as usize]
    }
}
