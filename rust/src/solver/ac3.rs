//! AC-3 worklist propagation using the adjacency graph.

use std::collections::VecDeque;

use crate::adjacency::Adjacency;
use crate::constraint::{Constraint, Revision, VarId};
use crate::domain::Domain;
use crate::variable::Variable;
use crate::SolveStats;

/// Run AC-3 propagation over all constraints.
///
/// Returns `Err(())` if a domain wipe-out is detected (unsatisfiable).
pub fn ac3_full<D: Domain>(
    variables: &mut [Variable<D>],
    constraints: &[Box<dyn Constraint<D>>],
    adjacency: &Adjacency,
    stats: &mut SolveStats,
    depth: usize,
) -> Result<(), ()> {
    let mut worklist: VecDeque<usize> = (0..constraints.len()).collect();
    let mut in_worklist = vec![true; constraints.len()];

    while let Some(idx) = worklist.pop_front() {
        in_worklist[idx] = false;

        match constraints[idx].revise(variables, depth) {
            Revision::Unchanged => {}
            Revision::Changed => {
                stats.propagations += 1;
                // Re-enqueue only neighbor constraints (via adjacency list)
                for &neighbor in adjacency.neighbors_of_constraint(idx) {
                    if !in_worklist[neighbor] {
                        worklist.push_back(neighbor);
                        in_worklist[neighbor] = true;
                    }
                }
            }
            Revision::Unsatisfiable => return Err(()),
        }
    }

    Ok(())
}

/// Run AC-3 propagation seeded from a single variable assignment.
///
/// Only enqueues constraints involving the given variable and its neighbors.
/// This is the MAC (Maintaining Arc Consistency) variant used during search.
pub fn ac3_from_variable<D: Domain>(
    var: VarId,
    variables: &mut [Variable<D>],
    constraints: &[Box<dyn Constraint<D>>],
    adjacency: &Adjacency,
    assignment: &[Option<D::Value>],
    stats: &mut SolveStats,
    depth: usize,
) -> bool {
    // Seed worklist with constraints involving neighbors of the assigned variable
    let mut worklist: VecDeque<usize> = VecDeque::new();
    let mut in_worklist = vec![false; constraints.len()];

    for &ci in adjacency.constraints_for(var) {
        // Only enqueue if the constraint involves at least one unassigned neighbor
        let scope = constraints[ci].scope();
        let has_unassigned = scope
            .iter()
            .any(|&v| v != var && assignment[v as usize].is_none());
        if has_unassigned {
            worklist.push_back(ci);
            in_worklist[ci] = true;
        }
    }

    while let Some(idx) = worklist.pop_front() {
        in_worklist[idx] = false;

        match constraints[idx].revise(variables, depth) {
            Revision::Unchanged => {}
            Revision::Changed => {
                stats.propagations += 1;
                // Check for DWO on all variables in this constraint's scope
                for &v in constraints[idx].scope() {
                    if variables[v as usize].domain.is_empty() {
                        return true; // DWO
                    }
                }
                // Re-enqueue neighbors
                for &neighbor in adjacency.neighbors_of_constraint(idx) {
                    if !in_worklist[neighbor] {
                        // Only if involves unassigned variables
                        let scope = constraints[neighbor].scope();
                        let has_unassigned = scope
                            .iter()
                            .any(|&v| assignment[v as usize].is_none());
                        if has_unassigned {
                            worklist.push_back(neighbor);
                            in_worklist[neighbor] = true;
                        }
                    }
                }
            }
            Revision::Unsatisfiable => return true, // DWO
        }
    }

    false
}
