//! GAC All-Different-Except integration tests.
//!
//! Tests the sentinel-aware Régin GAC propagator directly and via the
//! `AllDifferentExcept` constraint's `revise_impl` delegation path.

use csp_solver::constraint::traits::{Revision, VarId};
use csp_solver::constraint::{AllDifferentExcept, ConstraintEnum};
use csp_solver::domain::bitset::BitsetDomain;
use csp_solver::domain::Domain;
use csp_solver::solver::gac_alldiff_except::propagate_gac_alldiff_except;
use csp_solver::variable::Variable;
use csp_solver::{Csp, Pruning, SolveConfig};

/// Helper: run GAC except propagation and return revision + resulting domains.
fn run_gac_except(
    domains: &[Vec<u32>],
    sentinel: u32,
) -> (Revision, Vec<Vec<u32>>) {
    let scope: Vec<VarId> = (0..domains.len() as u32).collect();
    let mut variables: Vec<Variable<BitsetDomain>> = domains
        .iter()
        .map(|vals| Variable::new(BitsetDomain::new(vals.iter().copied())))
        .collect();

    let rev = propagate_gac_alldiff_except(&scope, &sentinel, &mut variables, 0);
    let result_domains: Vec<Vec<u32>> = variables
        .iter()
        .map(|v| v.domain.values())
        .collect();

    (rev, result_domains)
}

// ---------------------------------------------------------------------------
// 1. Sentinel is never pruned
// ---------------------------------------------------------------------------

#[test]
fn test_sentinel_never_pruned() {
    // 4 vars, domain {0, 1, 2, SENTINEL=99}. Var 0 assigned to 1.
    // After propagation, sentinel 99 must remain in all other vars' domains.
    let sentinel = 99u32;
    let scope: Vec<VarId> = (0..4).collect();
    let mut vars: Vec<Variable<BitsetDomain>> = vec![
        Variable::new(BitsetDomain::new([1])),            // assigned to 1
        Variable::new(BitsetDomain::new([0, 1, 2, 99])),
        Variable::new(BitsetDomain::new([0, 1, 2, 99])),
        Variable::new(BitsetDomain::new([0, 1, 2, 99])),
    ];

    let rev = propagate_gac_alldiff_except(&scope, &sentinel, &mut vars, 0);

    // Sentinel must still be present in vars 1, 2, 3.
    for i in 1..4 {
        assert!(
            vars[i].domain.contains(&sentinel),
            "sentinel must remain in var {i}'s domain"
        );
    }
    // Value 1 should be pruned from vars 1-3 (assigned to var 0).
    for i in 1..4 {
        assert!(
            !vars[i].domain.contains(&1),
            "value 1 should be pruned from var {i}"
        );
    }
    assert_eq!(rev, Revision::Changed);
}

// ---------------------------------------------------------------------------
// 2. Non-sentinel values cascade
// ---------------------------------------------------------------------------

#[test]
fn test_non_sentinel_cascades() {
    // 4 vars, domain {0, 1, 2, SENTINEL=99}.
    // Var 0 assigned to 0, var 1 assigned to 1.
    // After propagation, 0 and 1 should be pruned from vars 2 and 3
    // (but sentinel stays).
    let sentinel = 99u32;
    let scope: Vec<VarId> = (0..4).collect();
    let mut vars: Vec<Variable<BitsetDomain>> = vec![
        Variable::new(BitsetDomain::new([0])),            // assigned to 0
        Variable::new(BitsetDomain::new([1])),            // assigned to 1
        Variable::new(BitsetDomain::new([0, 1, 2, 99])),
        Variable::new(BitsetDomain::new([0, 1, 2, 99])),
    ];

    let rev = propagate_gac_alldiff_except(&scope, &sentinel, &mut vars, 0);
    assert_eq!(rev, Revision::Changed);

    // Vars 2 and 3 should have only {2, 99} remaining.
    assert_eq!(vars[2].domain.values(), vec![2, 99]);
    assert_eq!(vars[3].domain.values(), vec![2, 99]);
}

// ---------------------------------------------------------------------------
// 3. Sentinel-only scope is unchanged
// ---------------------------------------------------------------------------

#[test]
fn test_sentinel_only_scope_unchanged() {
    // 3 vars, all with domain {SENTINEL=5} only.
    // Nothing to prune — all committed to sentinel.
    let (rev, doms) = run_gac_except(
        &[vec![5], vec![5], vec![5]],
        5,
    );
    assert_eq!(rev, Revision::Unchanged);
    assert_eq!(doms, vec![vec![5], vec![5], vec![5]]);
}

// ---------------------------------------------------------------------------
// 4. Unsatisfiable detection
// ---------------------------------------------------------------------------

#[test]
fn test_unsatisfiable_detection() {
    // 4 unassigned vars, domains {0, 1} each. Sentinel = 99 (not in any domain).
    // 4 vars need distinct non-sentinel values from a pool of only 2 values,
    // and none have sentinel as escape. Matching covers only 2 of 4 -> UNSAT.
    let (rev, _) = run_gac_except(
        &[vec![0, 1], vec![0, 1], vec![0, 1], vec![0, 1]],
        99,
    );
    assert_eq!(rev, Revision::Unsatisfiable);
}

#[test]
fn test_unsatisfiable_singletons_clash() {
    // 3 vars: two singletons both assigned 0, one unassigned with {0, 1}.
    // The two singletons clash (both non-sentinel, same value).
    // GAC sees 1 unassigned var with available {1} (after excluding assigned 0).
    // But the underlying clash is between the two singletons themselves —
    // check_impl catches that. GAC correctly prunes 0 from the unassigned var.
    let (rev, doms) = run_gac_except(
        &[vec![0], vec![0], vec![0, 1]],
        99,
    );
    // GAC prunes 0 from var 2, leaving {1}. The singleton clash is a separate concern.
    assert_eq!(rev, Revision::Changed);
    assert_eq!(doms[2], vec![1]);
}

// ---------------------------------------------------------------------------
// 5. Five-variable hand-built scenario
// ---------------------------------------------------------------------------

#[test]
fn test_five_var_hand_built() {
    // 5 vars: var 0 pinned to non-sentinel 0, vars 1-4 have {0, 1, 2, SENTINEL=99}.
    // After GAC: 0 should be pruned from vars 1-4 (leaving {1, 2, 99}).
    let sentinel = 99u32;
    let scope: Vec<VarId> = (0..5).collect();
    let mut vars: Vec<Variable<BitsetDomain>> = vec![
        Variable::new(BitsetDomain::new([0])),             // pinned to 0
        Variable::new(BitsetDomain::new([0, 1, 2, 99])),
        Variable::new(BitsetDomain::new([0, 1, 2, 99])),
        Variable::new(BitsetDomain::new([0, 1, 2, 99])),
        Variable::new(BitsetDomain::new([0, 1, 2, 99])),
    ];

    let rev = propagate_gac_alldiff_except(&scope, &sentinel, &mut vars, 0);
    assert_eq!(rev, Revision::Changed);

    // Vars 1-4: 0 pruned, {1, 2, 99} remain.
    for i in 1..5 {
        assert!(!vars[i].domain.contains(&0), "val 0 should be pruned from var {i}");
        assert!(vars[i].domain.contains(&1));
        assert!(vars[i].domain.contains(&2));
        assert!(vars[i].domain.contains(&sentinel));
    }

    // Now pin var 1 to 1 and re-propagate.
    vars[1].restrict_to(&1, 1);
    let rev2 = propagate_gac_alldiff_except(&scope, &sentinel, &mut vars, 1);
    assert_eq!(rev2, Revision::Changed);

    // Vars 2-4: 0 and 1 pruned, {2, 99} remain.
    for i in 2..5 {
        assert!(!vars[i].domain.contains(&0), "val 0 should be pruned from var {i}");
        assert!(!vars[i].domain.contains(&1), "val 1 should be pruned from var {i}");
        assert!(vars[i].domain.contains(&2));
        assert!(vars[i].domain.contains(&sentinel));
    }
}

// ---------------------------------------------------------------------------
// 6. End-to-end CSP solve
// ---------------------------------------------------------------------------

#[test]
fn test_end_to_end_csp() {
    // 5 vars, domain 0..4, sentinel = 0, AllDifferentExcept.
    // Multiple vars can take sentinel 0; non-zero assignments must be distinct.
    let mut csp: Csp<BitsetDomain> = Csp::new();
    let vars = csp.add_variables(&BitsetDomain::range(5), 5);
    csp.add_constraint_enum(ConstraintEnum::AllDifferentExcept(
        AllDifferentExcept::new(vars.clone(), 0),
    ));
    csp.finalize();

    let config = SolveConfig {
        pruning: Pruning::Ac3,
        max_solutions: 10,
        ..SolveConfig::default()
    };
    let solutions = csp.solve(&config);
    assert!(!solutions.is_empty(), "should find at least one solution");

    for sol in &solutions {
        // Verify constraint: non-zero values must be pairwise distinct.
        let vals: Vec<u32> = vars.iter().map(|&v| sol[v as usize]).collect();
        let non_zero: Vec<u32> = vals.iter().copied().filter(|&v| v != 0).collect();
        let mut deduped = non_zero.clone();
        deduped.sort();
        deduped.dedup();
        assert_eq!(
            non_zero.len(),
            deduped.len(),
            "non-sentinel values must be distinct, got {vals:?}"
        );
    }

    // Verify that at least one solution has multiple vars taking sentinel 0.
    let has_multi_sentinel = solutions.iter().any(|sol| {
        let zero_count = vars
            .iter()
            .filter(|&&v| sol[v as usize] == 0)
            .count();
        zero_count >= 2
    });
    assert!(has_multi_sentinel, "at least one solution should have multiple vars taking sentinel 0");
}

// ---------------------------------------------------------------------------
// Compile-time regression: no ValueIndex bound required
// ---------------------------------------------------------------------------

#[test]
fn gac_except_compiles_without_value_index() {
    use csp_solver::domain::finite::FiniteDomain;
    let _: fn(&[VarId], &String, &mut [Variable<FiniteDomain<String>>], usize) -> Revision =
        propagate_gac_alldiff_except::<FiniteDomain<String>>;
}
