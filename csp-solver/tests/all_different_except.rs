//! Integration tests for `AllDifferentExcept<V>`.

use csp_solver::constraint::{AllDifferentExcept, Constraint, ConstraintEnum, Revision, VarId};
use csp_solver::domain::BitsetDomain;
use csp_solver::domain::Domain;
use csp_solver::variable::Variable;
use csp_solver::{Csp, Pruning, SolveConfig};

// -----------------------------------------------------------------------
// 1. `check`: multiple sentinels are allowed
// -----------------------------------------------------------------------
#[test]
fn check_allows_multiple_sentinels() {
    // Three variables, sentinel = 0. Two vars parked on the sentinel, the
    // third on a distinct non-sentinel. No conflict.
    let c = AllDifferentExcept::<u32>::new(vec![0, 1, 2], 0);
    let assignment: Vec<Option<u32>> = vec![Some(0), Some(0), Some(7)];
    assert!(<AllDifferentExcept<u32> as Constraint<BitsetDomain>>::check(&c, &assignment));
}

// -----------------------------------------------------------------------
// 2. `check`: non-sentinel duplicates are still rejected
// -----------------------------------------------------------------------
#[test]
fn check_rejects_duplicate_non_sentinel() {
    let c = AllDifferentExcept::<u32>::new(vec![0, 1, 2], 0);
    let assignment: Vec<Option<u32>> = vec![Some(3), Some(3), Some(0)];
    assert!(!<AllDifferentExcept<u32> as Constraint<BitsetDomain>>::check(&c, &assignment));
}

// -----------------------------------------------------------------------
// 3. `check`: mixed sentinel + distinct non-sentinel
// -----------------------------------------------------------------------
#[test]
fn check_mixed_sentinel_and_distinct() {
    let c = AllDifferentExcept::<u32>::new(vec![0, 1, 2, 3], 0);
    let assignment: Vec<Option<u32>> = vec![Some(0), Some(1), Some(2), Some(0)];
    assert!(<AllDifferentExcept<u32> as Constraint<BitsetDomain>>::check(&c, &assignment));
}

// -----------------------------------------------------------------------
// 4. `revise`: non-sentinel singletons prune peers, but the sentinel
//    itself remains available in peer domains.
// -----------------------------------------------------------------------
#[test]
fn revise_prunes_non_sentinel_singleton() {
    // vars[0] is pinned to value 2 (singleton, non-sentinel).
    // vars[1] and vars[2] start with full 0..4 domains.
    // Expected: 2 is removed from vars[1] and vars[2], but 0 (sentinel)
    // must still be present.
    let mut vars: Vec<Variable<BitsetDomain>> = vec![
        Variable::new(BitsetDomain::new([2])),
        Variable::new(BitsetDomain::range(4)),
        Variable::new(BitsetDomain::range(4)),
    ];
    let c = AllDifferentExcept::<u32>::new(vec![0, 1, 2], 0);

    let rev = <AllDifferentExcept<u32> as Constraint<BitsetDomain>>::revise(&c, &mut vars, 0);
    assert_eq!(
        rev,
        Revision::Changed,
        "non-sentinel singleton should prune peers"
    );

    // vars[1] and vars[2] should no longer contain 2, but must still
    // contain 0 (the sentinel).
    assert!(!vars[1].domain.contains(&2));
    assert!(!vars[2].domain.contains(&2));
    assert!(
        vars[1].domain.contains(&0),
        "sentinel 0 must remain in vars[1]"
    );
    assert!(
        vars[2].domain.contains(&0),
        "sentinel 0 must remain in vars[2]"
    );
}

// -----------------------------------------------------------------------
// 5. `revise`: sentinel singletons do NOT prune peers — any number of
//    other variables may choose the sentinel.
// -----------------------------------------------------------------------
#[test]
fn revise_skips_sentinel_singleton() {
    // vars[0] is pinned to the sentinel (0). vars[1] and vars[2] start
    // with full 0..4 domains and must be left entirely untouched.
    let mut vars: Vec<Variable<BitsetDomain>> = vec![
        Variable::new(BitsetDomain::new([0])),
        Variable::new(BitsetDomain::range(4)),
        Variable::new(BitsetDomain::range(4)),
    ];
    let c = AllDifferentExcept::<u32>::new(vec![0, 1, 2], 0);

    let rev = <AllDifferentExcept<u32> as Constraint<BitsetDomain>>::revise(&c, &mut vars, 0);
    assert_eq!(
        rev,
        Revision::Unchanged,
        "sentinel singleton must not prune peers"
    );

    // Peer domains must be fully intact.
    for v in 0u32..4 {
        assert!(vars[1].domain.contains(&v), "vars[1] lost value {v}");
        assert!(vars[2].domain.contains(&v), "vars[2] lost value {v}");
    }
}

// -----------------------------------------------------------------------
// 6. End-to-end CSP: 4 variables over 0..3, sentinel = 0. Solver must
//    find a feasible assignment where 0 may repeat across variables.
// -----------------------------------------------------------------------
#[test]
fn solve_end_to_end_permits_sentinel_repeats() {
    // 4 vars, domain 0..3. Without AllDifferentExcept, a pure AllDifferent
    // over the full 4 vars would be UNSAT (pigeonhole: 4 vars, 3 values).
    // With sentinel = 0 allowed to repeat, solutions exist.
    let mut csp: Csp<BitsetDomain> = Csp::new();
    let vars: Vec<VarId> = csp.add_variables(&BitsetDomain::range(3), 4);
    csp.add_constraint_enum(ConstraintEnum::AllDifferentExcept(AllDifferentExcept::new(
        vars.clone(),
        0,
    )));
    csp.finalize();

    let config = SolveConfig {
        pruning: Pruning::ForwardChecking,
        max_solutions: 1,
        ..Default::default()
    };
    let solutions = csp.solve(&config);
    assert!(
        !solutions.is_empty(),
        "AllDifferentExcept with sentinel 0 must admit a feasible solution \
         for 4 vars over 0..3"
    );

    // Validate the returned solution against the constraint semantics:
    // every non-sentinel value is unique; sentinel repeats are fine.
    let sol = &solutions[0];
    let assigned: Vec<u32> = vars.iter().map(|&v| sol[v as usize]).collect();
    let non_sentinel: Vec<u32> = assigned.iter().copied().filter(|v| *v != 0).collect();
    let mut sorted = non_sentinel.clone();
    sorted.sort();
    sorted.dedup();
    assert_eq!(
        sorted.len(),
        non_sentinel.len(),
        "non-sentinel values must be pairwise distinct, got {assigned:?}"
    );
}
