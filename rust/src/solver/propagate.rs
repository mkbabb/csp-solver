//! Forward checking and AC-FC hybrid propagation.

use crate::adjacency::Adjacency;
use crate::constraint::{Constraint, VarId};
use crate::domain::Domain;
use crate::variable::Variable;
use crate::SolveStats;

/// Forward checking: for each unassigned neighbor of `var`, test every value
/// in its domain against the current assignment. Prune unsupported values.
///
/// Returns `true` if a domain wipe-out (DWO) is detected.
pub fn forward_check<D: Domain>(
    var: VarId,
    variables: &mut [Variable<D>],
    constraints: &[Box<dyn Constraint<D>>],
    adjacency: &Adjacency,
    assignment: &[Option<D::Value>],
    stats: &mut SolveStats,
    depth: usize,
) -> bool {
    // For each unassigned neighbor of `var`
    for &neighbor in adjacency.neighbors_of_var(var) {
        if assignment[neighbor as usize].is_some() {
            continue;
        }

        let vals = variables[neighbor as usize].domain.values();

        for val in &vals {
            // Build a temporary assignment with neighbor = val
            let mut test_assignment = assignment.to_vec();
            test_assignment[neighbor as usize] = Some(val.clone());

            // Check all constraints involving both var and neighbor
            let mut valid = true;
            for &ci in adjacency.constraints_for(neighbor) {
                let scope = constraints[ci].scope();
                // Only check constraints where all scoped variables are assigned in our test
                let all_assigned = scope
                    .iter()
                    .all(|&v| test_assignment[v as usize].is_some());
                if !all_assigned {
                    continue;
                }
                if !constraints[ci].check(&test_assignment) {
                    valid = false;
                    break;
                }
            }

            if !valid {
                variables[neighbor as usize].prune(val, depth);
                stats.propagations += 1;
            }
        }

        if variables[neighbor as usize].domain.is_empty() {
            return true; // DWO
        }
    }

    false
}

/// AC-FC hybrid: forward check + limited arc consistency propagation.
///
/// Runs forward checking from `var`, then for any domain reduced to a singleton,
/// propagates further via forward checking on that singleton.
///
/// Returns `true` if a domain wipe-out (DWO) is detected.
pub fn ac_fc<D: Domain>(
    var: VarId,
    variables: &mut [Variable<D>],
    constraints: &[Box<dyn Constraint<D>>],
    adjacency: &Adjacency,
    assignment: &[Option<D::Value>],
    stats: &mut SolveStats,
    depth: usize,
) -> bool {
    // Start with forward checking from the assigned variable
    if forward_check(var, variables, constraints, adjacency, assignment, stats, depth) {
        return true;
    }

    // Propagate singletons: if FC reduced any neighbor to a singleton,
    // propagate constraints from that neighbor too.
    let mut worklist: Vec<VarId> = Vec::new();
    for &neighbor in adjacency.neighbors_of_var(var) {
        if assignment[neighbor as usize].is_none() && variables[neighbor as usize].domain.is_singleton() {
            worklist.push(neighbor);
        }
    }

    let mut visited = vec![false; variables.len()];
    visited[var as usize] = true;

    while let Some(v) = worklist.pop() {
        if visited[v as usize] {
            continue;
        }
        visited[v as usize] = true;

        // Temporarily "assign" this singleton for constraint checking
        let singleton_val = variables[v as usize].domain.singleton_value().unwrap();
        let mut extended_assignment = assignment.to_vec();
        extended_assignment[v as usize] = Some(singleton_val);

        if forward_check(v, variables, constraints, adjacency, &extended_assignment, stats, depth) {
            return true;
        }

        // Check for new singletons
        for &neighbor in adjacency.neighbors_of_var(v) {
            if assignment[neighbor as usize].is_none()
                && !visited[neighbor as usize]
                && variables[neighbor as usize].domain.is_singleton()
            {
                worklist.push(neighbor);
            }
        }
    }

    false
}
