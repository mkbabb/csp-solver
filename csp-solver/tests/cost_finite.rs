//! Integration tests for `CostFiniteDomain`.
//!
//! Exercises the public `(value, cost)` lookup surface, delegation to
//! the wrapped `FiniteDomain<i32>`, and an end-to-end branch-and-bound
//! run through `Csp::solve_optimized` — the shape future assignment
//! COPs will use.

use csp_solver::domain::CostFiniteDomain;
use csp_solver::domain::traits::{CostDomain, Domain};
use csp_solver::ordering::Ordering;
use csp_solver::{Csp, OptimizationMode, Pruning, SolveConfig};

/// Cost lookup returns the exact cost supplied at construction.
#[test]
fn cost_lookup_present() {
    let domain = CostFiniteDomain::new(vec![10, 20, 30], vec![1.0, 2.0, 3.0]);
    assert_eq!(domain.cost(&20), 2.0);
    assert_eq!(domain.cost(&10), 1.0);
    assert_eq!(domain.cost(&30), 3.0);
}

/// The constructor canonicalizes `(value, cost)` pairs to ascending
/// value order so that binary-search lookup is correct regardless of
/// the order the caller supplied.
#[test]
fn cost_lookup_unsorted_input() {
    let domain = CostFiniteDomain::new(vec![30, 10, 20], vec![3.0, 1.0, 2.0]);
    assert_eq!(domain.cost(&10), 1.0);
    assert_eq!(domain.cost(&20), 2.0);
    assert_eq!(domain.cost(&30), 3.0);
    // Sorted canonical form is visible through `values()`.
    assert_eq!(domain.values(), vec![10, 20, 30]);
}

/// The `i32` value type lets the domain carry a `-1` sentinel alongside
/// valid non-negative indices — this is the bipartite-assignment
/// "unmatched" marker that drives the morph pipeline COP.
#[test]
fn cost_lookup_with_negative_sentinel() {
    let domain = CostFiniteDomain::new(vec![-1, 0, 1, 2], vec![100.0, 4.2, 1.1, 7.8]);
    assert_eq!(domain.cost(&-1), 100.0);
    assert_eq!(domain.cost(&0), 4.2);
    assert_eq!(domain.cost(&1), 1.1);
    assert_eq!(domain.cost(&2), 7.8);
    // Sentinel participates in the ascending canonicalization.
    assert_eq!(domain.values(), vec![-1, 0, 1, 2]);
}

/// `min_cost` tracks the live domain: after pruning the current minimum
/// value, the next lowest cost becomes the new lower bound.
#[test]
fn min_cost_after_remove() {
    let mut domain = CostFiniteDomain::new(vec![10, 20, 30], vec![3.0, 1.0, 2.0]);
    assert_eq!(domain.min_cost(), 1.0);
    assert!(domain.remove(&20));
    assert_eq!(domain.min_cost(), 2.0);
    assert!(domain.remove(&30));
    assert_eq!(domain.min_cost(), 3.0);
}

/// Every `Domain` method must forward to the wrapped `FiniteDomain<i32>`
/// — no behavioral drift between the wrapper and its inner store.
#[test]
fn domain_delegation() {
    let mut domain = CostFiniteDomain::new(vec![1, 2, 3], vec![0.5, 1.5, 2.5]);

    // size / contains
    assert_eq!(domain.size(), 3);
    assert!(domain.contains(&1));
    assert!(domain.contains(&2));
    assert!(domain.contains(&3));
    assert!(!domain.contains(&4));

    // iter matches values
    let iter_vals: Vec<i32> = domain.iter().collect();
    assert_eq!(iter_vals, domain.values());
    assert_eq!(domain.values(), vec![1, 2, 3]);

    // remove
    assert!(domain.remove(&2));
    assert_eq!(domain.size(), 2);
    assert!(!domain.contains(&2));
    assert!(!domain.remove(&2)); // second removal is a no-op

    // add — restores the value; cost survives the remove/add cycle.
    domain.add(&2);
    assert_eq!(domain.size(), 3);
    assert!(domain.contains(&2));
    assert_eq!(domain.cost(&2), 1.5);

    // Adding a value not registered at construction time enters the
    // inner set but has no cost — defensive INFINITY fence.
    domain.add(&99);
    assert!(domain.contains(&99));
    assert_eq!(domain.cost(&99), f64::INFINITY);
}

/// End-to-end: three independent `CostFiniteDomain` variables with no
/// constraints and `MinimizeCost` must each pick their own minimum.
///
/// This is the simplest possible assignment COP shape — each variable
/// picks the value `20` (cost 1.0), giving a total of 3.0. Exercises
/// the full pipeline: `Csp::add_variable` → `finalize` →
/// `solve_optimized` → `CostDomain::cost` / `min_cost`.
#[test]
fn solve_optimized_end_to_end() {
    let mut csp: Csp<CostFiniteDomain> = Csp::new();
    let domain = CostFiniteDomain::new(vec![10, 20, 30], vec![3.0, 1.0, 2.0]);
    csp.add_variable(domain.clone());
    csp.add_variable(domain.clone());
    csp.add_variable(domain);
    csp.finalize();

    let config = SolveConfig {
        pruning: Pruning::ForwardChecking,
        ordering: Ordering::Chronological,
        max_solutions: 1,
        optimization_mode: OptimizationMode::MinimizeCost,
        ..Default::default()
    };

    let solutions = csp.solve_optimized(&config);
    assert_eq!(solutions.len(), 1);
    assert_eq!(solutions[0], vec![20, 20, 20]);

    // Sanity: the per-variable minima sum to the expected total cost.
    let total: f64 = solutions[0].iter().map(domain_cost).sum();
    assert_eq!(total, 3.0);
}

/// The internal `min_cost` cache must be correctly invalidated by
/// `remove` and `add` — stale cache reads would silently corrupt the
/// branch-and-bound lower bound.
#[test]
fn min_cost_cache_invalidation() {
    let mut d = CostFiniteDomain::new(vec![10, 20, 30], vec![3.0, 1.0, 2.0]);
    assert_eq!(d.min_cost(), 1.0); // computed, cached
    assert_eq!(d.min_cost(), 1.0); // cache hit
    d.remove(&20); // invalidates cache
    assert_eq!(d.min_cost(), 2.0); // recomputed, cached
    d.add(&20); // re-add, invalidates cache
    assert_eq!(d.min_cost(), 1.0); // recomputed with 20 back in domain
}

/// Helper mirroring the cost table used in `solve_optimized_end_to_end`.
fn domain_cost(val: &i32) -> f64 {
    match val {
        10 => 3.0,
        20 => 1.0,
        30 => 2.0,
        _ => panic!("unexpected value {val}"),
    }
}
