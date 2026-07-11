//! GAC-in-AllDifferent differential oracle (T3-W6, L25-20).
//!
//! ROW-1 of T3-W6 rewrites the GAC hot path (flat CSR adjacency + a Vec-indexed
//! warm cache). That is a *pure constant-reduction*: GAC's pruning strength — and
//! therefore the enumerated solution SET and the search-node count — must be
//! invariant by construction. This test stands up the oracle that catches a
//! semantics change the wall clock cannot see:
//!
//!  1. **Independent brute-force oracle.** For small AllDifferent CSPs, enumerate
//!     every candidate by hand, filter to the true solution set, and assert the
//!     GAC-on solver returns *exactly* that set — GAC neither invents nor drops a
//!     solution (soundness + completeness against a reference implementation).
//!  2. **On/off differential.** For the flag-gated production path (n-queens: an
//!     AllDifferent over rows + lambda diagonals), assert `GAC_ON`'s solution set
//!     equals `GAC_OFF`'s, and that ON explores no MORE nodes than OFF (GAC only
//!     prunes). This is the direct guard the CSR/cache refactor must survive.
//!
//! `GAC_IN_ALLDIFF_ENABLED` is a process-global atomic. Static globals are
//! per-process and cargo runs each test binary as its own process, so the only
//! possible race is with a parallel test IN THIS FILE — serialised here with
//! `FLAG_LOCK`.

use std::collections::BTreeSet;
use std::sync::atomic::Ordering as AtomicOrdering;
use std::sync::{Mutex, MutexGuard};

use csp_solver::constraint::LambdaConstraint;
use csp_solver::domain::bitset::BitsetDomain;
use csp_solver::ordering::Ordering;
use csp_solver::solver::gac::GAC_IN_ALLDIFF_ENABLED;
use csp_solver::{Csp, Pruning, SolveConfig};

/// Serialises every test that reads or writes `GAC_IN_ALLDIFF_ENABLED`.
static FLAG_LOCK: Mutex<()> = Mutex::new(());

fn lock() -> MutexGuard<'static, ()> {
    FLAG_LOCK.lock().unwrap_or_else(|e| e.into_inner())
}

fn enumerate_all(config: &SolveConfig, build: impl Fn() -> Csp<BitsetDomain>) -> Vec<Vec<u32>> {
    let mut csp = build();
    csp.solve(config)
}

fn set_of(sols: &[Vec<u32>]) -> BTreeSet<Vec<u32>> {
    sols.iter().cloned().collect()
}

// ---------------------------------------------------------------------------
// (1) Independent brute-force oracle for small AllDifferent CSPs
// ---------------------------------------------------------------------------

/// Every assignment of `domains` (cartesian product) that is pairwise distinct —
/// the reference solution set for a single AllDifferent, computed without the
/// solver.
fn brute_all_different(domains: &[Vec<u32>]) -> BTreeSet<Vec<u32>> {
    let mut out = BTreeSet::new();
    let mut current = vec![0u32; domains.len()];
    fn rec(i: usize, domains: &[Vec<u32>], current: &mut Vec<u32>, out: &mut BTreeSet<Vec<u32>>) {
        if i == domains.len() {
            let mut seen = BTreeSet::new();
            if current.iter().all(|v| seen.insert(*v)) {
                out.insert(current.clone());
            }
            return;
        }
        for &v in &domains[i] {
            current[i] = v;
            rec(i + 1, domains, current, out);
        }
    }
    rec(0, domains, &mut current, &mut out);
    out
}

fn build_all_different(domains: &[Vec<u32>]) -> Csp<BitsetDomain> {
    let mut csp = Csp::new();
    let vars: Vec<_> = domains
        .iter()
        .map(|d| csp.add_variable(BitsetDomain::new(d.iter().copied())))
        .collect();
    csp.add_all_different(vars);
    csp.finalize();
    csp
}

#[test]
fn gac_on_matches_bruteforce_oracle() {
    let _g = lock();
    GAC_IN_ALLDIFF_ENABLED.store(true, AtomicOrdering::Relaxed);

    let config = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::Mrv,
        max_solutions: usize::MAX,
        ..Default::default()
    };

    // Cases chosen to exercise GAC's Hall-set pruning, not just singleton
    // removal: the last two rows below can only take {3,4}, which GAC deduces
    // from the {1,2}/{1,2} Hall set among the first two.
    let cases: &[&[Vec<u32>]] = &[
        &[
            vec![1, 2, 3, 4],
            vec![1, 2, 3, 4],
            vec![1, 2, 3, 4],
            vec![1, 2, 3, 4],
        ],
        &[vec![1, 2], vec![1, 2], vec![1, 2, 3, 4], vec![1, 2, 3, 4]],
        &[vec![2, 3], vec![1, 2, 3], vec![1, 3], vec![1, 2, 3, 4, 5]],
    ];

    for domains in cases {
        let oracle = brute_all_different(domains);
        let solver = set_of(&enumerate_all(&config, || build_all_different(domains)));
        assert_eq!(
            solver, oracle,
            "GAC-on AllDifferent solution set diverged from the brute-force oracle for {domains:?}"
        );
        assert!(
            !oracle.is_empty(),
            "oracle must be non-trivial for {domains:?}"
        );
    }

    GAC_IN_ALLDIFF_ENABLED.store(true, AtomicOrdering::Relaxed);
}

// ---------------------------------------------------------------------------
// (2) On/off differential over the flag-gated production path (n-queens)
// ---------------------------------------------------------------------------

fn build_queens(n: u32) -> Csp<BitsetDomain> {
    let mut csp = Csp::new();
    let domain = BitsetDomain::range(n);
    let vars = csp.add_variables(&domain, n as usize);
    csp.add_all_different(vars.clone());
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

fn solve_queens_all(n: u32, gac_on: bool) -> (BTreeSet<Vec<u32>>, u64) {
    GAC_IN_ALLDIFF_ENABLED.store(gac_on, AtomicOrdering::Relaxed);
    let config = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::FailFirst,
        max_solutions: usize::MAX,
        ..Default::default()
    };
    let mut csp = build_queens(n);
    let sols = csp.solve(&config);
    let nodes = csp.stats().nodes_explored;
    (set_of(&sols), nodes)
}

#[test]
fn gac_on_off_solution_sets_are_identical() {
    let _g = lock();

    // n=8 has 92 solutions — the ground-truth count guards completeness on top of
    // the on==off set-equality (which guards the refactor's semantics).
    let expected_counts: &[(u32, usize)] = &[(6, 4), (7, 40), (8, 92)];

    for &(n, count) in expected_counts {
        let (off_set, off_nodes) = solve_queens_all(n, false);
        let (on_set, on_nodes) = solve_queens_all(n, true);

        assert_eq!(
            on_set, off_set,
            "n={n}: GAC on/off enumerated different solution sets — a GAC edit changed semantics"
        );
        assert_eq!(on_set.len(), count, "n={n}: solution count regressed");
        assert!(
            on_nodes <= off_nodes,
            "n={n}: GAC ON explored MORE nodes ({on_nodes}) than OFF ({off_nodes}) — GAC only prunes"
        );
    }

    GAC_IN_ALLDIFF_ENABLED.store(true, AtomicOrdering::Relaxed);
}
