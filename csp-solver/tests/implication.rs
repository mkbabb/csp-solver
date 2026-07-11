//! Integration tests for `ImplicationConstraint<V>` — `antecedent = trigger → consequent ∈ allowed`.
//!
//! This is public surface (`csp_solver::constraint::ImplicationConstraint`) with a live
//! out-of-repo consumer — bbnf-lang's engine-family installer constructs it at
//! `crates/ir/src/passes/csp_strategy/constraints/engine.rs:170` as a pairwise
//! `a = engine ⇒ b ∈ {engine}` equality. Prior to this file it was `pub` but untested
//! in-repo (tranche-III S2 / C-β). The tests below lock the three semantic contracts —
//! `check`, `revise` (trigger, non-trigger, wipeout), and an end-to-end solve mirroring
//! the bbnf construction.

use csp_solver::constraint::{Constraint, ImplicationConstraint, Revision};
use csp_solver::domain::{BitsetDomain, Domain};
use csp_solver::variable::Variable;
use csp_solver::{Csp, Pruning, SolveConfig};

// Bind the generic `Constraint<BitsetDomain>` methods on a `u32`-valued implication.
type Impl = ImplicationConstraint<u32>;

// -----------------------------------------------------------------------
// 1. `check`: the antecedent must be the trigger for the rule to bite.
// -----------------------------------------------------------------------
#[test]
fn check_vacuous_when_antecedent_not_trigger() {
    // scope = [0, 1]; trigger = 5; allowed = {2}. Antecedent bound to 9 (≠ trigger):
    // the implication is vacuously satisfied regardless of the consequent.
    let c = Impl::new(0, 1, 5, vec![2]);
    let assignment: Vec<Option<u32>> = vec![Some(9), Some(7)];
    assert!(<Impl as Constraint<BitsetDomain>>::check(&c, &assignment));
}

#[test]
fn check_holds_when_consequent_in_allowed() {
    // Antecedent = trigger, consequent ∈ allowed → satisfied.
    let c = Impl::new(0, 1, 5, vec![2, 3]);
    let assignment: Vec<Option<u32>> = vec![Some(5), Some(3)];
    assert!(<Impl as Constraint<BitsetDomain>>::check(&c, &assignment));
}

#[test]
fn check_fails_when_triggered_and_consequent_disallowed() {
    // Antecedent = trigger, consequent ∉ allowed → violated.
    let c = Impl::new(0, 1, 5, vec![2, 3]);
    let assignment: Vec<Option<u32>> = vec![Some(5), Some(7)];
    assert!(!<Impl as Constraint<BitsetDomain>>::check(&c, &assignment));
}

#[test]
fn check_vacuous_when_consequent_unbound() {
    // Antecedent = trigger but consequent still open → not yet decidable, treated
    // as satisfied by `check` (which only rejects a fully-bound violation).
    let c = Impl::new(0, 1, 5, vec![2]);
    let assignment: Vec<Option<u32>> = vec![Some(5), None];
    assert!(<Impl as Constraint<BitsetDomain>>::check(&c, &assignment));
}

// -----------------------------------------------------------------------
// 2. `revise`: fires only on a singleton antecedent equal to the trigger,
//    and prunes the consequent down to `allowed`.
// -----------------------------------------------------------------------
#[test]
fn revise_prunes_consequent_to_allowed_when_triggered() {
    // vars[0] pinned to trigger (5); vars[1] open over 0..6. Expect the consequent
    // filtered to exactly {2, 3}, everything else gone.
    let mut vars: Vec<Variable<BitsetDomain>> = vec![
        Variable::new(BitsetDomain::new([5])),
        Variable::new(BitsetDomain::range(6)),
    ];
    let c = Impl::new(0, 1, 5, vec![2, 3]);

    let rev = <Impl as Constraint<BitsetDomain>>::revise(&c, &mut vars, 0);
    assert_eq!(rev, Revision::Changed, "triggered revise must prune");

    for v in 0u32..6 {
        let want = v == 2 || v == 3;
        assert_eq!(
            vars[1].domain.contains(&v),
            want,
            "consequent value {v}: expected present={want}"
        );
    }
    // The antecedent is never touched by this constraint.
    assert_eq!(vars[0].domain.singleton_value(), Some(5));
}

#[test]
fn revise_noop_when_antecedent_not_singleton_trigger() {
    // Antecedent still open (not a singleton) → trigger cannot fire → Unchanged,
    // consequent fully intact.
    let mut vars: Vec<Variable<BitsetDomain>> = vec![
        Variable::new(BitsetDomain::range(6)),
        Variable::new(BitsetDomain::range(6)),
    ];
    let c = Impl::new(0, 1, 5, vec![2, 3]);

    let rev = <Impl as Constraint<BitsetDomain>>::revise(&c, &mut vars, 0);
    assert_eq!(
        rev,
        Revision::Unchanged,
        "untriggered revise must be a no-op"
    );
    for v in 0u32..6 {
        assert!(vars[1].domain.contains(&v), "consequent lost {v} on no-op");
    }
}

#[test]
fn revise_noop_when_singleton_but_not_trigger() {
    // Antecedent is a singleton, but on a different value than the trigger → no fire.
    let mut vars: Vec<Variable<BitsetDomain>> = vec![
        Variable::new(BitsetDomain::new([1])),
        Variable::new(BitsetDomain::range(6)),
    ];
    let c = Impl::new(0, 1, 5, vec![2, 3]);

    let rev = <Impl as Constraint<BitsetDomain>>::revise(&c, &mut vars, 0);
    assert_eq!(rev, Revision::Unchanged);
    assert_eq!(vars[1].domain.iter().count(), 6, "consequent untouched");
}

#[test]
fn revise_reports_unsatisfiable_on_wipeout() {
    // Triggered, but `allowed` is disjoint from the consequent's domain → the
    // consequent is emptied → Unsatisfiable.
    let mut vars: Vec<Variable<BitsetDomain>> = vec![
        Variable::new(BitsetDomain::new([5])),
        Variable::new(BitsetDomain::new([0, 1])),
    ];
    let c = Impl::new(0, 1, 5, vec![7]); // 7 not in {0,1}

    let rev = <Impl as Constraint<BitsetDomain>>::revise(&c, &mut vars, 0);
    assert_eq!(
        rev,
        Revision::Unsatisfiable,
        "wiping the consequent must surface Unsatisfiable"
    );
    assert!(vars[1].domain.is_empty());
}

// -----------------------------------------------------------------------
// 3. End-to-end: the exact bbnf shape — a chain of pairwise equalities
//    `a = e ⇒ b ∈ {e}` over a shared "engine" domain forces all engine
//    variables to agree, and the solver finds a consistent assignment.
// -----------------------------------------------------------------------
#[test]
fn solve_end_to_end_pairwise_engine_equality() {
    // Three "engine" variables over a 3-value engine domain (0,1,2). For every
    // engine value e and every ordered pair (i, j), install `i = e ⇒ j ∈ {e}`.
    // The conjunction forces v0 = v1 = v2 (bbnf's "same engine per component").
    let mut csp: Csp<BitsetDomain> = Csp::new();
    let a = csp.add_variable(BitsetDomain::range(3));
    let b = csp.add_variable(BitsetDomain::range(3));
    let c = csp.add_variable(BitsetDomain::range(3));
    let vars = [a, b, c];

    for &i in &vars {
        for &j in &vars {
            if i == j {
                continue;
            }
            for e in 0u32..3 {
                csp.add_constraint(Impl::new(i, j, e, vec![e]));
            }
        }
    }
    csp.finalize();

    let config = SolveConfig {
        pruning: Pruning::ForwardChecking,
        max_solutions: 1,
        ..Default::default()
    };
    let solutions = csp.solve(&config);
    assert!(
        !solutions.is_empty(),
        "pairwise engine-equality chain must be satisfiable"
    );

    let sol = &solutions[0];
    let (va, vb, vc) = (sol[a as usize], sol[b as usize], sol[c as usize]);
    assert_eq!(va, vb, "engine vars must agree (a==b), got {va} vs {vb}");
    assert_eq!(vb, vc, "engine vars must agree (b==c), got {vb} vs {vc}");
}

// -----------------------------------------------------------------------
// 4. End-to-end negative: a triggered implication with an out-of-range
//    `allowed` set makes the instance UNSAT.
// -----------------------------------------------------------------------
#[test]
fn solve_end_to_end_unsat_when_forced_out_of_domain() {
    // v0 must equal 1 (via a not-equal on the other values), and `v0 = 1 ⇒ v1 ∈ {9}`
    // with v1 confined to 0..3 — the implication forces v1 to an impossible value.
    let mut csp: Csp<BitsetDomain> = Csp::new();
    let x = csp.add_variable(BitsetDomain::new([1])); // pinned to the trigger
    let y = csp.add_variable(BitsetDomain::range(3)); // 0..2, cannot be 9
    csp.add_constraint(Impl::new(x, y, 1, vec![9]));
    csp.finalize();

    let config = SolveConfig {
        pruning: Pruning::ForwardChecking,
        max_solutions: 1,
        ..Default::default()
    };
    let solutions = csp.solve(&config);
    assert!(
        solutions.is_empty(),
        "an implication forcing the consequent out of its domain must be UNSAT"
    );
}
