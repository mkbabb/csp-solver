//! Solution-set-invariance regression guard for the AC-3/MAC enumerate-continuation
//! trail-undo soundness bug (kernel-behavior-preservation §2, §10.3a).
//!
//! Invariant under test: for a sound, complete solver, the solution *set* returned
//! for `max_solutions = usize::MAX` is invariant under `Pruning` and `Ordering` —
//! pruning changes efficiency, never *which* solutions exist. Any `budget_exceeded`
//! run is excluded (a legitimate truncation, not a completeness claim).
//!
//! The composed kernel shipped a defect where `ac3_from_variable`'s
//! `Revision::Unsatisfiable` arm returned without trailing the constraint scope,
//! leaking partial prunes into sibling branches and silently dropping solutions on
//! mixed global+binary problems under `Pruning::Ac3`. Pre-fix this test fails:
//! queens8 Ac3 enumerate returns 45 (Chronological) or 5 (FailFirst/DomWdeg) not 92;
//! futoshiki-loose Ac3-Chronological returns 1 not 288. Post-fix all combos agree.
//!
//! `cargo test --workspace` (which never runs benches) is otherwise blind to this —
//! see also the queens-bench CI smoke lane (`.github/workflows/ci.yml`), whose
//! `assert_eq!(92)` / `assert_eq!(14200)` encode the same ground truth.

use csp_solver::constraint::{AllDifferent, LambdaConstraint};
use csp_solver::domain::bitset::BitsetDomain;
use csp_solver::ordering::Ordering;
use csp_solver::puzzles::futoshiki::{FutoshikiPuzzle, create_futoshiki_csp};
use csp_solver::{Csp, Pruning, SolveConfig};

const PRUNINGS: [Pruning; 4] = [
    Pruning::None,
    Pruning::ForwardChecking,
    Pruning::Ac3,
    Pruning::AcFc,
];
const ORDERINGS: [Ordering; 3] = [
    Ordering::Chronological,
    Ordering::FailFirst,
    Ordering::DomWdeg,
];

fn enumerate_cfg(p: Pruning, o: Ordering) -> SolveConfig {
    SolveConfig {
        pruning: p,
        ordering: o,
        max_solutions: usize::MAX,
        node_budget: Some(5_000_000),
        ..Default::default()
    }
}

/// N-queens as AllDifferent(rows) + pairwise diagonal LambdaConstraints — the
/// mixed global+binary shape that triggers the enumerate bug.
fn build_nqueens(n: u32) -> Csp<BitsetDomain> {
    let mut csp = Csp::new();
    let domain = BitsetDomain::new(0..n);
    let vars = csp.add_variables(&domain, n as usize);
    csp.add_constraint(AllDifferent::new(vars.clone()));
    for i in 0..n {
        for j in (i + 1)..n {
            let vi = vars[i as usize];
            let vj = vars[j as usize];
            let diff = j - i;
            csp.add_constraint(LambdaConstraint::new(
                vec![vi, vj],
                move |a: &[Option<u32>]| match (&a[vi as usize], &a[vj as usize]) {
                    (Some(ri), Some(rj)) => ri.abs_diff(*rj) != diff,
                    _ => true,
                },
                format!("diag({i},{j})"),
            ));
        }
    }
    csp.finalize();
    csp
}

fn build_futoshiki(input: &str) -> Csp<BitsetDomain> {
    create_futoshiki_csp(&FutoshikiPuzzle::parse(input))
}

/// Canonical order-insensitive representation of a solution set: sorted list of
/// solution vectors. Set-equal iff these are Vec-equal.
fn canonical(sols: &[Vec<u32>]) -> Vec<Vec<u32>> {
    let mut v: Vec<Vec<u32>> = sols.to_vec();
    v.sort();
    v
}

/// Assert every completing (`budget_exceeded == false`) Pruning x Ordering combo
/// enumerates the identical solution set of the expected cardinality.
fn assert_set_invariant<F>(name: &str, build: F, expected_count: usize)
where
    F: Fn() -> Csp<BitsetDomain>,
{
    let mut reference: Option<Vec<Vec<u32>>> = None;
    let mut reference_tag = String::new();

    for p in PRUNINGS {
        for o in ORDERINGS {
            let mut csp = build();
            let sols = csp.solve(&enumerate_cfg(p, o));
            let stats = csp.stats();
            assert!(
                !stats.budget_exceeded,
                "{name}: {p:?}/{o:?} hit the node budget — raise it; this test needs a complete enumeration"
            );
            let got = canonical(&sols);
            assert_eq!(
                got.len(),
                expected_count,
                "{name}: {p:?}/{o:?} enumerated {} solutions, expected {expected_count} \
                 (solution-set-invariance / enumerate-continuation soundness violation)",
                got.len()
            );
            match &reference {
                None => {
                    reference = Some(got);
                    reference_tag = format!("{p:?}/{o:?}");
                }
                Some(reference_set) => {
                    assert_eq!(
                        &got, reference_set,
                        "{name}: {p:?}/{o:?} enumerated a DIFFERENT solution set than \
                         {reference_tag} — the set must be invariant under pruning/ordering"
                    );
                }
            }
        }
    }
}

#[test]
fn queens8_solution_set_invariant_across_pruning_and_ordering() {
    // 8-queens has exactly 92 solutions (OEIS A000170). The pre-fix Ac3 path
    // returned 45/5 here.
    assert_set_invariant("queens8", || build_nqueens(8), 92);
}

#[test]
fn queens6_solution_set_invariant_across_pruning_and_ordering() {
    // 6-queens has exactly 4 solutions.
    assert_set_invariant("queens6", || build_nqueens(6), 4);
}

#[test]
fn futoshiki_loose_solution_set_invariant_across_pruning_and_ordering() {
    // A 4x4 futoshiki with two inequalities (col0>col5 pos, and one <) admits 288
    // completions. Pre-fix Ac3-Chronological returned 1.
    assert_set_invariant("futoshiki_loose", || build_futoshiki("4\n\n\n1\n2\n"), 288);
}

#[test]
fn futoshiki_constr_solution_set_invariant_across_pruning_and_ordering() {
    // A more constrained 4x4 futoshiki — 16 completions. Guards the mixed
    // AllDifferent(rows/cols) + greater_than(binary) enumerate path that the
    // committed Futoshiki wave's uniqueness checker depends on.
    assert_set_invariant(
        "futoshiki_constr",
        || build_futoshiki("4\n0 5\n1 3\n1\n2\n"),
        16,
    );
}
