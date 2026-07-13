//! Oracle + solution-set-invariance harness — the single home for the two
//! coordinates that pin solver *soundness*: an independent oracle (does the
//! solver return exactly the true set?) and set-invariance (is that set the
//! same across every pruning/ordering?). Merged from three former files
//! (`gac_alldiff_oracle`, `futoshiki_engine_probe`, `solution_set_invariance`)
//! at T4-W2 — they overlapped on ground truth; consolidated here so the OEIS
//! queens count and the futoshiki oracle live once.
//!
//! Four coordinates:
//!
//!  1. **AllDifferent brute-force oracle** — for small AllDifferent CSPs,
//!     enumerate every candidate by hand, filter to the true set, and assert the
//!     GAC-on solver returns *exactly* it (soundness + completeness vs a
//!     reference).
//!  2. **GAC on/off differential** (n-queens) — `GAC_ON`'s solution set equals
//!     `GAC_OFF`'s and ON explores no MORE nodes than OFF (GAC only prunes); the
//!     direct guard the CSR/warm-cache refactor must survive. Node monotonicity
//!     and GAC-off completeness are asserted nowhere else.
//!  3. **Futoshiki brute-force oracle** — a hand-built 4×4 (Latin square, four
//!     inner cells blanked, six inequalities) enumerated by the solver and by
//!     exhaustive 4⁴ filtering; the sets must match (no invented/dropped board).
//!  4. **Solution-set invariance** — for a sound, complete solver the set for
//!     `max_solutions = usize::MAX` is invariant under `Pruning` × `Ordering`.
//!     Guards the AC-3/MAC enumerate-continuation trail-undo soundness bug
//!     (kernel-behavior-preservation §2, §10.3a): pre-fix queens8 Ac3 returned
//!     45/5 not 92 and futoshiki-loose Ac3-Chronological returned 1 not 288.
//!
//! `GAC_IN_ALLDIFF_ENABLED` is a process-global atomic; the two GAC tests that
//! write it are serialised by `FLAG_LOCK`. Every other test here asserts only
//! solution *sets* (and their cardinality), which are invariant to the GAC flag,
//! so a parallel reader observing a mid-toggle value still sees the correct set.
//!
//! `cargo test --workspace` (which never runs benches) is otherwise blind to the
//! enumerate-continuation defect — see also the queens-bench CI smoke lane
//! (`.github/workflows/ci.yml`), whose `assert_eq!(92)` / `assert_eq!(14200)`
//! encode the same ground truth.

use std::collections::BTreeSet;
use std::sync::atomic::Ordering as AtomicOrdering;
use std::sync::{Mutex, MutexGuard};

use csp_solver::constraint::{AllDifferent, LambdaConstraint};
use csp_solver::domain::bitset::BitsetDomain;
use csp_solver::ordering::Ordering;
use csp_solver::puzzles::futoshiki::{FutoshikiPuzzle, create_futoshiki_csp};
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

// ===========================================================================
// (1) Independent brute-force oracle for small AllDifferent CSPs
// ===========================================================================

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

// ===========================================================================
// (2) On/off differential over the flag-gated production path (n-queens)
// ===========================================================================

/// Queens via the devirtualized `add_all_different` (rows) + lambda diagonals —
/// the flag-gated production path the GAC on/off differential drives.
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

    // n=8 has 92 solutions. The absolute counts here are the SOLE GAC-off
    // completeness anchor (the invariance harness below never toggles the flag),
    // so they stay; the on==off set-equality and the node monotonicity are this
    // test's unique deltas, asserted nowhere else.
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

// ===========================================================================
// (3) Futoshiki engine brute-force oracle
// ===========================================================================

const N: u32 = 4;
const NN: usize = 16;

// A known-valid 4×4 Latin square (rows, columns each a permutation of 1..=4):
//   1 2 3 4
//   2 1 4 3
//   3 4 1 2
//   4 3 2 1
const SOLUTION: [u32; NN] = [1, 2, 3, 4, 2, 1, 4, 3, 3, 4, 1, 2, 4, 3, 2, 1];

// The four blanked (free) cells — an inner 2×2 block. Everything else is a given.
const FREE: [usize; 4] = [5, 6, 9, 10];

// Inequalities (cell_a > cell_b), each orthogonally adjacent and satisfied by
// SOLUTION — verified against the grid above.
const INEQUALITIES: [(usize, usize); 6] = [
    (1, 0),  // 2 > 1  (row 0)
    (3, 2),  // 4 > 3  (row 0)
    (4, 0),  // 2 > 1  (col 0)
    (12, 8), // 4 > 3  (col 0)
    (4, 5),  // 2 > 1  (row 1)
    (6, 7),  // 4 > 3  (row 1)
];

fn givens() -> Vec<(usize, u32)> {
    (0..NN)
        .filter(|i| !FREE.contains(i))
        .map(|i| (i, SOLUTION[i]))
        .collect()
}

fn puzzle() -> FutoshikiPuzzle {
    FutoshikiPuzzle::from_parts(N, givens(), INEQUALITIES.to_vec())
        .expect("hand-built board must pass from_parts validation")
}

fn solve_all(pruning: Pruning, ordering: Ordering) -> BTreeSet<Vec<u32>> {
    let mut csp = create_futoshiki_csp(&puzzle());
    let config = SolveConfig {
        pruning,
        ordering,
        max_solutions: usize::MAX,
        ..Default::default()
    };
    csp.solve(&config).into_iter().collect()
}

/// Reference oracle: every full grid consistent with the givens, a Latin square,
/// and every inequality — computed by exhaustive filtering, no solver.
fn brute_force() -> BTreeSet<Vec<u32>> {
    let fixed = givens();
    let mut out = BTreeSet::new();
    // 4⁴ candidate fills of the four free cells.
    for combo in 0..4u32.pow(FREE.len() as u32) {
        let mut grid = [0u32; NN];
        for &(i, v) in &fixed {
            grid[i] = v;
        }
        for (k, &cell) in FREE.iter().enumerate() {
            grid[cell] = 1 + (combo / 4u32.pow(k as u32)) % 4;
        }
        if is_valid(&grid) {
            out.insert(grid.to_vec());
        }
    }
    out
}

fn is_valid(grid: &[u32; NN]) -> bool {
    let n = N as usize;
    // Rows + columns each all-different (a Latin square over 1..=4).
    for i in 0..n {
        let mut row = BTreeSet::new();
        let mut col = BTreeSet::new();
        for j in 0..n {
            if !row.insert(grid[i * n + j]) || !col.insert(grid[j * n + i]) {
                return false;
            }
        }
    }
    // Inequalities.
    INEQUALITIES.iter().all(|&(a, b)| grid[a] > grid[b])
}

#[test]
fn solver_matches_bruteforce_oracle() {
    let oracle = brute_force();
    assert!(
        oracle.contains(SOLUTION.as_slice()),
        "the known Latin square must itself be a valid oracle solution — test data is wrong"
    );

    // Config invariance is covered by the futoshiki cases in the invariance
    // harness below (§4, all Pruning × Ordering); this test owns the independent
    // brute-force oracle the harness lacks.
    let solver = solve_all(Pruning::Ac3, Ordering::Mrv);
    assert_eq!(
        solver, oracle,
        "Futoshiki solve engine diverged from the brute-force oracle (invented or dropped a board)"
    );
}

// ===========================================================================
// (4) Solution-set invariance under Pruning × Ordering
// ===========================================================================

const PRUNINGS: [Pruning; 4] = [
    Pruning::None,
    Pruning::ForwardChecking,
    Pruning::Ac3,
    Pruning::AcFc,
];
const ORDERINGS: [Ordering; 3] = [Ordering::Chronological, Ordering::FailFirst, Ordering::Mrv];

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
    // 8-queens has exactly 92 solutions (OEIS A000170) — the canonical enumerate
    // + set-equality all other queens8 asserts defer to. The pre-fix Ac3 path
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
