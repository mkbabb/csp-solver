//! Differential oracle + node-drop harness for the n-ary arithmetic cages
//! (`CageSum` / `CageProduct`), in the `oracle_and_invariance` mold.
//!
//! Three coordinates pin the two new `revise_impl`s:
//!
//!  1. **Brute-force oracle** — a cage CSP's enumerated solution set equals an
//!     independent cartesian-filter reference (soundness *and* completeness: the
//!     propagator invents no board and drops none).
//!  2. **Set-invariance** — that set is identical across every `Pruning ×
//!     Ordering`, so cage propagation never changes the enumerate-all invariant.
//!  3. **Node-drop vs the n-ary lambda baseline** — the born-RED figure. The
//!     same Killer / KenKen board, once with the cage modelled as a 3-ary
//!     `LambdaConstraint` (which returns `Revision::Unchanged` — searches blind)
//!     and once with the devirtualized cage variant, enumerates the identical
//!     set while the cage explores strictly fewer nodes. Counts are asserted and
//!     banked in `docs/tranches/2026-07-tranche-4/evidence/w13/p-primitives.md`.

use std::collections::BTreeSet;

use csp_solver::constraint::{LambdaConstraint, VarId};
use csp_solver::domain::BitsetDomain;
use csp_solver::ordering::Ordering;
use csp_solver::{Csp, Pruning, SolveConfig};

// ---------------------------------------------------------------------------
// Shared harness
// ---------------------------------------------------------------------------

fn enumerate_cfg(pruning: Pruning, ordering: Ordering) -> SolveConfig {
    SolveConfig {
        pruning,
        ordering,
        max_solutions: usize::MAX,
        node_budget: Some(50_000_000),
        ..Default::default()
    }
}

fn set_of(sols: &[Vec<u32>]) -> BTreeSet<Vec<u32>> {
    sols.iter().cloned().collect()
}

/// Every assignment of `domains` (cartesian product) satisfying `keep` — the
/// solver-independent reference solution set.
fn brute(domains: &[Vec<u32>], keep: impl Fn(&[u32]) -> bool) -> BTreeSet<Vec<u32>> {
    let mut out = BTreeSet::new();
    let mut cur = vec![0u32; domains.len()];
    fn rec(
        i: usize,
        domains: &[Vec<u32>],
        cur: &mut Vec<u32>,
        keep: &dyn Fn(&[u32]) -> bool,
        out: &mut BTreeSet<Vec<u32>>,
    ) {
        if i == domains.len() {
            if keep(cur) {
                out.insert(cur.clone());
            }
            return;
        }
        for &v in &domains[i] {
            cur[i] = v;
            rec(i + 1, domains, cur, keep, out);
        }
    }
    rec(0, domains, &mut cur, &keep, &mut out);
    out
}

fn all_distinct(vals: &[u32]) -> bool {
    let mut seen = BTreeSet::new();
    vals.iter().all(|v| seen.insert(*v))
}

/// A cage clue modelled as an n-ary `LambdaConstraint` — the born-RED baseline
/// (the default `revise` prunes nothing for a 3+-variable lambda).
fn lambda_cage(scope: &[VarId], target: u32, product: bool) -> LambdaConstraint<BitsetDomain> {
    let sc = scope.to_vec();
    let inner = sc.clone();
    LambdaConstraint::new(
        sc,
        move |a: &[Option<u32>]| {
            let mut acc: i128 = if product { 1 } else { 0 };
            for &v in &inner {
                match a[v as usize] {
                    Some(x) if product => acc *= x as i128,
                    Some(x) => acc += x as i128,
                    None => return true,
                }
            }
            acc == target as i128
        },
        if product {
            "lambda_product"
        } else {
            "lambda_sum"
        },
    )
}

// ===========================================================================
// (1) + (2) Brute-force oracle & set-invariance — CageSum
// ===========================================================================

#[test]
fn cage_sum_solver_matches_bruteforce_and_is_set_invariant() {
    // Four all-different cells over 1..=6 whose values sum to 14.
    let domains: Vec<Vec<u32>> = (0..4).map(|_| (1..=6).collect()).collect();
    let target = 14u32;

    let oracle = brute(&domains, |v| {
        all_distinct(v) && v.iter().sum::<u32>() == target
    });
    assert!(!oracle.is_empty(), "oracle must be non-trivial");

    let build = || {
        let mut csp: Csp<BitsetDomain> = Csp::new();
        let vars: Vec<VarId> = domains
            .iter()
            .map(|d| csp.add_variable(BitsetDomain::new(d.iter().copied())))
            .collect();
        csp.add_all_different(vars.clone());
        csp.add_cage_sum(vars, target);
        csp.finalize();
        csp
    };

    let prunings = [
        Pruning::None,
        Pruning::ForwardChecking,
        Pruning::Ac3,
        Pruning::AcFc,
    ];
    let orderings = [Ordering::Chronological, Ordering::FailFirst, Ordering::Mrv];
    for p in prunings {
        for o in orderings {
            let mut csp = build();
            let got = set_of(&csp.solve(&enumerate_cfg(p, o)));
            assert!(!csp.stats().budget_exceeded, "{p:?}/{o:?} hit budget");
            assert_eq!(
                got, oracle,
                "CageSum solver diverged from the brute-force oracle under {p:?}/{o:?}"
            );
        }
    }
}

// ===========================================================================
// Brute-force oracle & set-invariance — CageProduct
// ===========================================================================

#[test]
fn cage_product_solver_matches_bruteforce_and_is_set_invariant() {
    // Three cells over 1..=6 whose values multiply to 24 (order matters — no
    // all-different, so e.g. (4,6,1) and (1,6,4) are distinct boards).
    let domains: Vec<Vec<u32>> = (0..3).map(|_| (1..=6).collect()).collect();
    let target = 24u32;

    let oracle = brute(&domains, |v| {
        v.iter().map(|&x| x as i128).product::<i128>() == target as i128
    });
    assert!(!oracle.is_empty(), "oracle must be non-trivial");

    let build = || {
        let mut csp: Csp<BitsetDomain> = Csp::new();
        let vars: Vec<VarId> = domains
            .iter()
            .map(|d| csp.add_variable(BitsetDomain::new(d.iter().copied())))
            .collect();
        csp.add_cage_product(vars, target);
        csp.finalize();
        csp
    };

    let prunings = [
        Pruning::None,
        Pruning::ForwardChecking,
        Pruning::Ac3,
        Pruning::AcFc,
    ];
    let orderings = [Ordering::Chronological, Ordering::FailFirst, Ordering::Mrv];
    for p in prunings {
        for o in orderings {
            let mut csp = build();
            let got = set_of(&csp.solve(&enumerate_cfg(p, o)));
            assert!(!csp.stats().budget_exceeded, "{p:?}/{o:?} hit budget");
            assert_eq!(
                got, oracle,
                "CageProduct solver diverged from the brute-force oracle under {p:?}/{o:?}"
            );
        }
    }
}

// ===========================================================================
// (3) Node-drop vs the n-ary lambda baseline
// ===========================================================================

const N4: usize = 4;
const NN4: usize = 16;

/// Row-major cell id.
fn cell(r: usize, c: usize) -> VarId {
    (r * N4 + c) as VarId
}

/// Rows + columns all-different (a 4×4 Latin square); `boxes` adds the four 2×2
/// sub-boxes (a 4×4 Sudoku).
fn add_latin(csp: &mut Csp<BitsetDomain>, boxes: bool) {
    for r in 0..N4 {
        csp.add_all_different((0..N4).map(|c| cell(r, c)).collect());
    }
    for c in 0..N4 {
        csp.add_all_different((0..N4).map(|r| cell(r, c)).collect());
    }
    if boxes {
        for br in (0..N4).step_by(2) {
            for bc in (0..N4).step_by(2) {
                let mut b = Vec::new();
                for dr in 0..2 {
                    for dc in 0..2 {
                        b.push(cell(br + dr, bc + dc));
                    }
                }
                csp.add_all_different(b);
            }
        }
    }
}

/// The six cages of the fixed Killer/KenKen partition, as `(scope, op)` where
/// `op` is `'+'` / `'*'` / `'-'` / `'/'` with the target computed from the seed
/// solution grid.
///   1 2 3 4 / 3 4 1 2 / 2 1 4 3 / 4 3 2 1
const SEED: [u32; NN4] = [1, 2, 3, 4, 3, 4, 1, 2, 2, 1, 4, 3, 4, 3, 2, 1];

fn cage_partition() -> Vec<(Vec<VarId>, char)> {
    vec![
        (vec![0, 1, 4], '+'),  // 1+2+3 = 6
        (vec![2, 3, 7], '+'),  // 3+4+2 = 9
        (vec![5, 6, 10], '*'), // 4*1*4 = 16
        (vec![8, 9, 12], '+'), // 2+1+4 = 7
        (vec![13, 14], '-'),   // |3-2| = 1
        (vec![11, 15], '/'),   // 3/1 = 3
    ]
}

fn sum_of(scope: &[VarId]) -> u32 {
    scope.iter().map(|&v| SEED[v as usize]).sum()
}
fn prod_of(scope: &[VarId]) -> u32 {
    scope.iter().map(|&v| SEED[v as usize]).product()
}

/// Add a 2-cell difference cage `|a − b| == diff` (binary — propagates via the
/// default binary revise in both the lambda and cage builds).
fn add_diff(csp: &mut Csp<BitsetDomain>, a: VarId, b: VarId, diff: u32) {
    csp.add_constraint(LambdaConstraint::new(
        vec![a, b],
        move |x: &[Option<u32>]| match (x[a as usize], x[b as usize]) {
            (Some(p), Some(q)) => p.abs_diff(q) == diff,
            _ => true,
        },
        "diff",
    ));
}

/// Add a 2-cell ratio cage `max/min == q && max % min == 0` (binary).
fn add_ratio(csp: &mut Csp<BitsetDomain>, a: VarId, b: VarId, q: u32) {
    csp.add_constraint(LambdaConstraint::new(
        vec![a, b],
        move |x: &[Option<u32>]| match (x[a as usize], x[b as usize]) {
            (Some(p), Some(r)) => {
                let (hi, lo) = if p >= r { (p, r) } else { (r, p) };
                lo != 0 && hi % lo == 0 && hi / lo == q
            }
            _ => true,
        },
        "ratio",
    ));
}

/// Build the board. `boxes` ⇒ Killer (Sudoku); else KenKen (Latin). `use_cages`
/// ⇒ the `+`/`*` clues use the devirtualized cage variants; else the n-ary
/// lambda baseline. `-`/`/` are always 2-cell binaries.
fn build_board(boxes: bool, use_cages: bool) -> Csp<BitsetDomain> {
    let mut csp: Csp<BitsetDomain> = Csp::new();
    let _ = csp.add_variables(&BitsetDomain::new(1..=N4 as u32), NN4);
    add_latin(&mut csp, boxes);
    for (scope, op) in cage_partition() {
        match op {
            '+' => {
                let t = sum_of(&scope);
                if use_cages {
                    csp.add_cage_sum(scope, t);
                } else {
                    csp.add_constraint(lambda_cage(&scope, t, false));
                }
            }
            '*' => {
                let t = prod_of(&scope);
                if use_cages {
                    csp.add_cage_product(scope, t);
                } else {
                    csp.add_constraint(lambda_cage(&scope, t, true));
                }
            }
            '-' => add_diff(
                &mut csp,
                scope[0],
                scope[1],
                SEED[scope[0] as usize].abs_diff(SEED[scope[1] as usize]),
            ),
            '/' => {
                let (a, b) = (scope[0], scope[1]);
                let (hi, lo) = if SEED[a as usize] >= SEED[b as usize] {
                    (SEED[a as usize], SEED[b as usize])
                } else {
                    (SEED[b as usize], SEED[a as usize])
                };
                add_ratio(&mut csp, a, b, hi / lo);
            }
            _ => unreachable!(),
        }
    }
    csp.finalize();
    csp
}

/// Enumerate both builds, assert the identical solution set, and that the cage
/// build explores strictly fewer nodes. Returns `(lambda_nodes, cage_nodes)`.
fn node_drop(boxes: bool) -> (u64, u64) {
    let cfg = enumerate_cfg(Pruning::Ac3, Ordering::FailFirst);

    let mut lam = build_board(boxes, false);
    let lam_set = set_of(&lam.solve(&cfg));
    let lam_nodes = lam.stats().nodes_explored;
    assert!(!lam.stats().budget_exceeded, "lambda build hit node budget");

    let mut cage = build_board(boxes, true);
    let cage_set = set_of(&cage.solve(&cfg));
    let cage_nodes = cage.stats().nodes_explored;
    assert!(!cage.stats().budget_exceeded, "cage build hit node budget");

    assert!(!lam_set.is_empty(), "board must be satisfiable");
    assert!(
        lam_set.contains(SEED.as_slice()),
        "the seed solution must be in the enumerated set"
    );
    assert_eq!(
        lam_set, cage_set,
        "cage propagation changed the solution set — a soundness violation"
    );
    assert!(
        cage_nodes < lam_nodes,
        "cage explored {cage_nodes} nodes, lambda {lam_nodes} — the cage must prune strictly more"
    );
    (lam_nodes, cage_nodes)
}

#[test]
fn killer_cage_sum_node_drop_vs_lambda() {
    let (lam, cage) = node_drop(true);
    // Banked (see the evidence file). Asserted as a strict drop above; the
    // absolute figures are printed under `--nocapture`.
    println!("KILLER  lambda_nodes={lam}  cage_nodes={cage}");
}

#[test]
fn kenken_mixed_cage_node_drop_vs_lambda() {
    let (lam, cage) = node_drop(false);
    println!("KENKEN  lambda_nodes={lam}  cage_nodes={cage}");
}
