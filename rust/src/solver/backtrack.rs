//! Chronological backtracking search.

use crate::adjacency::Adjacency;
use crate::constraint::{Constraint, VarId};
use crate::domain::Domain;
use crate::ordering::{self, Ordering};
use crate::solver::ac3;
use crate::solver::propagate;
use crate::variable::Variable;
use crate::{Pruning, SolveStats};

/// Solution type: a vector of values indexed by variable ID.
pub type Solution<D> = Vec<<D as Domain>::Value>;

/// Run backtracking search.
///
/// Returns up to `max_solutions` solutions.
pub fn backtrack_search<D: Domain>(
    variables: &mut [Variable<D>],
    constraints: &[Box<dyn Constraint<D>>],
    adjacency: &Adjacency,
    config: &BacktrackConfig,
    stats: &mut SolveStats,
) -> Vec<Solution<D>> {
    let num_vars = variables.len();
    let mut assignment: Vec<Option<D::Value>> = vec![None; num_vars];
    let mut stack: Vec<VarId> = (0..num_vars as u32).collect();
    let mut solutions = Vec::new();

    backtrack_recurse(
        variables,
        constraints,
        adjacency,
        config,
        stats,
        &mut assignment,
        &mut stack,
        &mut solutions,
        0, // depth
    );

    solutions
}

/// Run backtracking search with pre-assigned variables (initial propagation).
///
/// `given` maps VarId -> Value for initially assigned variables.
pub fn backtrack_search_with_given<D: Domain>(
    variables: &mut [Variable<D>],
    constraints: &[Box<dyn Constraint<D>>],
    adjacency: &Adjacency,
    config: &BacktrackConfig,
    stats: &mut SolveStats,
    given: &[(VarId, D::Value)],
) -> Vec<Solution<D>> {
    let num_vars = variables.len();
    let mut assignment: Vec<Option<D::Value>> = vec![None; num_vars];

    // Apply given assignments
    for (var, val) in given {
        assignment[*var as usize] = Some(val.clone());
    }

    // Only unassigned variables go on the stack
    let mut stack: Vec<VarId> = (0..num_vars as u32)
        .filter(|v| assignment[*v as usize].is_none())
        .collect();

    let mut solutions = Vec::new();

    backtrack_recurse(
        variables,
        constraints,
        adjacency,
        config,
        stats,
        &mut assignment,
        &mut stack,
        &mut solutions,
        0,
    );

    solutions
}

/// Configuration for backtracking search.
pub struct BacktrackConfig {
    pub pruning: Pruning,
    pub ordering: Ordering,
    pub max_solutions: usize,
    pub constraint_weights: Vec<f64>,
    pub var_constraint_ids: Vec<Vec<usize>>,
}

fn backtrack_recurse<D: Domain>(
    variables: &mut [Variable<D>],
    constraints: &[Box<dyn Constraint<D>>],
    adjacency: &Adjacency,
    config: &BacktrackConfig,
    stats: &mut SolveStats,
    assignment: &mut Vec<Option<D::Value>>,
    stack: &mut Vec<VarId>,
    solutions: &mut Vec<Solution<D>>,
    depth: usize,
) -> bool {
    // Base case: all variables assigned
    if stack.is_empty() {
        // Extract a solution
        let sol: Solution<D> = assignment
            .iter()
            .map(|v| v.as_ref().unwrap().clone())
            .collect();
        solutions.push(sol);
        return solutions.len() >= config.max_solutions;
    }

    stats.nodes_explored += 1;

    // Select next variable
    let idx = ordering::select_variable(
        stack,
        variables,
        config.ordering,
        &config.constraint_weights,
        &config.var_constraint_ids,
    )
    .unwrap();

    let var = stack.swap_remove(idx);

    // Try each value in the variable's domain
    let values = variables[var as usize].domain.values();

    for val in values {
        // Assign
        assignment[var as usize] = Some(val.clone());

        // Check constraints
        let mut valid = true;
        for &ci in adjacency.constraints_for(var) {
            let scope = constraints[ci].scope();
            // Only check constraints where all scoped variables are assigned
            let all_assigned = scope
                .iter()
                .all(|&v| assignment[v as usize].is_some());
            if !all_assigned {
                continue;
            }
            if !constraints[ci].check(assignment) {
                valid = false;
                break;
            }
        }

        if valid {
            // Pruning
            let dwo = match config.pruning {
                Pruning::None => false,
                Pruning::ForwardChecking => propagate::forward_check(
                    var,
                    variables,
                    constraints,
                    adjacency,
                    assignment,
                    stats,
                    depth,
                ),
                Pruning::Ac3 => ac3::ac3_from_variable(
                    var,
                    variables,
                    constraints,
                    adjacency,
                    assignment,
                    stats,
                    depth,
                ),
                Pruning::AcFc => propagate::ac_fc(
                    var,
                    variables,
                    constraints,
                    adjacency,
                    assignment,
                    stats,
                    depth,
                ),
            };

            if !dwo {
                if backtrack_recurse(
                    variables,
                    constraints,
                    adjacency,
                    config,
                    stats,
                    assignment,
                    stack,
                    solutions,
                    depth + 1,
                ) {
                    return true; // enough solutions found
                }
            }
        }

        // Undo
        stats.backtracks += 1;
        assignment[var as usize] = None;
        // Restore all values pruned at this depth
        for v in variables.iter_mut() {
            v.restore(depth);
        }
    }

    // Put variable back on the stack
    stack.push(var);
    false
}
