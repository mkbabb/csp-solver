//! Conflict-directed backjumping.

use crate::adjacency::Adjacency;
use crate::constraint::{Constraint, VarId};
use crate::domain::Domain;
use crate::ordering::{self, Ordering};
use crate::solver::ac3;
use crate::solver::propagate;
use crate::variable::Variable;
use crate::{Pruning, SolveStats};

use super::backtrack::Solution;

/// Run backjumping search.
///
/// Returns up to `max_solutions` solutions.
pub fn backjump_search<D: Domain>(
    variables: &mut [Variable<D>],
    constraints: &[Box<dyn Constraint<D>>],
    adjacency: &Adjacency,
    config: &BackjumpConfig,
    stats: &mut SolveStats,
) -> Vec<Solution<D>> {
    let num_vars = variables.len();
    let mut assignment: Vec<Option<D::Value>> = vec![None; num_vars];
    let mut stack: Vec<VarId> = (0..num_vars as u32).collect();
    let mut solutions = Vec::new();

    // Track assignment order for depth mapping
    let mut assigned_order: Vec<VarId> = Vec::new();

    backjump_recurse(
        variables,
        constraints,
        adjacency,
        config,
        stats,
        &mut assignment,
        &mut stack,
        &mut solutions,
        &mut assigned_order,
        0,
    );

    solutions
}

/// Result of a recursive backjump call.
enum BackjumpResult {
    /// Continue normal search at this level.
    Continue,
    /// Found enough solutions -- done.
    Done,
    /// Backjump to the variable at the given depth.
    JumpTo(usize),
}

/// Configuration for backjumping search.
pub struct BackjumpConfig {
    pub pruning: Pruning,
    pub ordering: Ordering,
    pub max_solutions: usize,
    pub constraint_weights: Vec<f64>,
    pub var_constraint_ids: Vec<Vec<usize>>,
}

fn backjump_recurse<D: Domain>(
    variables: &mut [Variable<D>],
    constraints: &[Box<dyn Constraint<D>>],
    adjacency: &Adjacency,
    config: &BackjumpConfig,
    stats: &mut SolveStats,
    assignment: &mut Vec<Option<D::Value>>,
    stack: &mut Vec<VarId>,
    solutions: &mut Vec<Solution<D>>,
    assigned_order: &mut Vec<VarId>,
    depth: usize,
) -> BackjumpResult {
    // Base case: all variables assigned
    if stack.is_empty() {
        let sol: Solution<D> = assignment
            .iter()
            .map(|v| v.as_ref().unwrap().clone())
            .collect();
        solutions.push(sol);
        if solutions.len() >= config.max_solutions {
            return BackjumpResult::Done;
        }
        return BackjumpResult::Continue;
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
    assigned_order.push(var);

    // Conflict set: tracks which previously-assigned variables caused failures
    let mut conflict_set: Vec<VarId> = Vec::new();

    let values = variables[var as usize].domain.values();
    let mut exhausted = true;

    for val in values {
        assignment[var as usize] = Some(val.clone());

        // Check constraints and identify conflicting variables
        let mut valid = true;
        for &ci in adjacency.constraints_for(var) {
            let scope = constraints[ci].scope();
            let all_assigned = scope
                .iter()
                .all(|&v| assignment[v as usize].is_some());
            if !all_assigned {
                continue;
            }
            if !constraints[ci].check(assignment) {
                valid = false;
                // Add the other assigned variables in this constraint to the conflict set
                for &v in scope {
                    if v != var && assignment[v as usize].is_some() && !conflict_set.contains(&v) {
                        conflict_set.push(v);
                    }
                }
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

            if dwo {
                // DWO: add neighbors involved in wipe-out to conflict set
                for &neighbor in adjacency.neighbors_of_var(var) {
                    if assignment[neighbor as usize].is_some() && !conflict_set.contains(&neighbor) {
                        conflict_set.push(neighbor);
                    }
                }
            } else {
                match backjump_recurse(
                    variables,
                    constraints,
                    adjacency,
                    config,
                    stats,
                    assignment,
                    stack,
                    solutions,
                    assigned_order,
                    depth + 1,
                ) {
                    BackjumpResult::Done => return BackjumpResult::Done,
                    BackjumpResult::Continue => {
                        exhausted = false;
                    }
                    BackjumpResult::JumpTo(target_depth) => {
                        // Undo current assignment
                        stats.backtracks += 1;
                        assignment[var as usize] = None;
                        for v in variables.iter_mut() {
                            v.restore(depth);
                        }
                        assigned_order.pop();
                        stack.push(var);

                        if target_depth < depth {
                            // Jump past this level
                            return BackjumpResult::JumpTo(target_depth);
                        }
                        // target_depth == depth: continue trying values at this level
                        continue;
                    }
                }
            }
        }

        // Undo
        stats.backtracks += 1;
        assignment[var as usize] = None;
        for v in variables.iter_mut() {
            v.restore(depth);
        }
    }

    assigned_order.pop();
    stack.push(var);

    if exhausted && !conflict_set.is_empty() {
        // Find the most recent variable in the conflict set and jump to it
        let jump_target = conflict_set
            .iter()
            .filter_map(|&cv| {
                assigned_order
                    .iter()
                    .position(|&av| av == cv)
            })
            .max();

        if let Some(target_depth) = jump_target {
            if target_depth < depth {
                return BackjumpResult::JumpTo(target_depth);
            }
        }
    }

    BackjumpResult::Continue
}
