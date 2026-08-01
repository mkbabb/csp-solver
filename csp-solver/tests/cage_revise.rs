//! Revise-level guards for the n-ary arithmetic cages (`CageSum` /
//! `CageProduct`) — the propagator seen through the shipped dispatch.
//!
//! The sibling `tests/cage.rs` pins the cages at CSP level (enumerated solution
//! set vs a cartesian oracle, set-invariance across `Pruning × Ordering`, and
//! the node-drop against the n-ary lambda baseline). This file pins the single
//! `revise` call underneath: what one propagation step prunes, and the
//! randomized soundness property that step must never violate.
//!
//! Every call crosses [`ConstraintEnum::revise`] — the exact devirtualized arm
//! `Csp` runs in production, not the `pub(crate)` `revise_impl` reached from
//! inside the crate. Extracted verbatim from `src/constraint/cage.rs`'s inline
//! `mod tests` at T5-W2 under the standing colocation edict (tests live in
//! `tests/`, never inline); the assertions are unchanged.

use std::collections::BTreeSet;

use csp_solver::constraint::traits::{Constraint, Revision, VarId};
use csp_solver::constraint::{CageProduct, CageSum, ConstraintEnum, LambdaConstraint};
use csp_solver::domain::{BitsetDomain, Domain};
use csp_solver::variable::Variable;

/// One propagation step of a cage-sum through the production dispatch.
fn revise_sum(vars: &mut [Variable<BitsetDomain>], scope: Vec<VarId>, target: u32) -> Revision {
    ConstraintEnum::<BitsetDomain>::CageSum(CageSum::new(scope, target)).revise(vars, 1)
}

/// One propagation step of a cage-product through the production dispatch.
fn revise_product(vars: &mut [Variable<BitsetDomain>], scope: Vec<VarId>, target: u32) -> Revision {
    ConstraintEnum::<BitsetDomain>::CageProduct(CageProduct::new(scope, target)).revise(vars, 1)
}

fn vars_from(domains: &[Vec<u32>]) -> Vec<Variable<BitsetDomain>> {
    domains
        .iter()
        .map(|d| Variable::new(BitsetDomain::new(d.iter().copied())))
        .collect()
}

/// `n` copies of the same domain (array-repeat needs `Copy`, `Vec` isn't).
fn rep(d: &[u32], n: usize) -> Vec<Vec<u32>> {
    (0..n).map(|_| d.to_vec()).collect()
}

fn domain_of(v: &Variable<BitsetDomain>) -> Vec<u32> {
    let mut vals = v.domain.values();
    vals.sort_unstable();
    vals
}

// -- born-RED: the n-ary lambda wall is live ----------------------------

/// A cage-sum modelled as a 3-ary `LambdaConstraint` returns
/// `Revision::Unchanged` and prunes nothing — the wall the cage variants
/// clear (`traits.rs` default `revise`, `_ => Unchanged`).
#[test]
fn n_ary_lambda_cage_sum_does_not_propagate() {
    let mut vars = vars_from(&rep(&[1, 2, 3, 4, 5, 6, 7, 8, 9], 3));
    // Σ of three cells == 6: a bounds propagator would cap each cell at 4.
    let lambda = LambdaConstraint::new(
        vec![0, 1, 2],
        |a: &[Option<u32>]| match (a[0], a[1], a[2]) {
            (Some(x), Some(y), Some(z)) => x + y + z == 6,
            _ => true,
        },
        "cage_sum(6)",
    );
    let rev = Constraint::revise(&lambda, &mut vars, 1);
    assert_eq!(
        rev,
        Revision::Unchanged,
        "the n-ary lambda wall must be live"
    );
    for v in &vars {
        assert_eq!(v.domain.size(), 9, "lambda pruned nothing — the wall");
    }
}

// -- CageSum propagation -------------------------------------------------

#[test]
fn cage_sum_revise_prunes_by_residual() {
    let mut vars = vars_from(&rep(&[1, 2, 3, 4, 5, 6, 7, 8, 9], 3));
    let rev = revise_sum(&mut vars, vec![0, 1, 2], 6);
    assert_eq!(rev, Revision::Changed);
    // others' min is 1+1 = 2, so each cell ≤ 6 − 2 = 4.
    for v in &vars {
        assert_eq!(domain_of(v), vec![1, 2, 3, 4]);
    }
}

#[test]
fn cage_sum_revise_tightens_low_end() {
    // Two cells, each 1..=9, sum 17 ⇒ each cell ≥ 17 − 9 = 8.
    let mut vars = vars_from(&rep(&[1, 2, 3, 4, 5, 6, 7, 8, 9], 2));
    assert_eq!(revise_sum(&mut vars, vec![0, 1], 17), Revision::Changed);
    assert_eq!(domain_of(&vars[0]), vec![8, 9]);
    assert_eq!(domain_of(&vars[1]), vec![8, 9]);
}

#[test]
fn cage_sum_revise_detects_unsat() {
    // Max reachable sum is 2+2 = 4 < target 9.
    let mut vars = vars_from(&[vec![1, 2], vec![1, 2]]);
    assert_eq!(
        revise_sum(&mut vars, vec![0, 1], 9),
        Revision::Unsatisfiable
    );
}

// -- CageProduct propagation --------------------------------------------

#[test]
fn cage_product_revise_prunes_by_divisibility_and_bound() {
    // Π of three cells (1..=6) == 6. Others' max product is 6*6 = 36, so
    // every value divides 6 (5 is dropped) and required = 6/x must be
    // reachable — 1,2,3,6 survive; 4,5 do not.
    let mut vars = vars_from(&rep(&[1, 2, 3, 4, 5, 6], 3));
    assert_eq!(
        revise_product(&mut vars, vec![0, 1, 2], 6),
        Revision::Changed
    );
    for v in &vars {
        assert_eq!(domain_of(v), vec![1, 2, 3, 6]);
    }
}

#[test]
fn cage_product_revise_prunes_zero_for_nonzero_target() {
    let mut vars = vars_from(&[vec![0, 1, 2, 3], vec![0, 1, 2, 3]]);
    assert_eq!(revise_product(&mut vars, vec![0, 1], 6), Revision::Changed);
    // 0 gone (zero factor); 1 gone (6/1 = 6 exceeds other's max 3); 2,3 stay.
    assert_eq!(domain_of(&vars[0]), vec![2, 3]);
    assert_eq!(domain_of(&vars[1]), vec![2, 3]);
}

#[test]
fn cage_product_revise_detects_unsat() {
    // Max reachable product is 2*2 = 4 < target 9.
    let mut vars = vars_from(&[vec![1, 2], vec![1, 2]]);
    assert_eq!(
        revise_product(&mut vars, vec![0, 1], 9),
        Revision::Unsatisfiable
    );
}

// -- randomized differential oracle (revise-level soundness) ------------
//
// The born-RED guard the spec names: the propagator must NEVER prune a
// value that participates in a full solution over the ORIGINAL domains
// (bounds consistency is sound, not domain-complete). A brute-force cartesian
// enumeration computes every solution-supported value per cell; the assert
// is that each survives the revise.

struct Lcg(u64);
impl Lcg {
    fn next(&mut self) -> u64 {
        self.0 = self
            .0
            .wrapping_mul(6364136223846793005)
            .wrapping_add(1442695040888963407);
        self.0
    }
    fn below(&mut self, n: u32) -> u32 {
        (self.next() >> 33) as u32 % n
    }
}

/// Random non-empty subset of `pool`.
fn random_domain(rng: &mut Lcg, pool: &[u32]) -> Vec<u32> {
    loop {
        let d: Vec<u32> = pool.iter().copied().filter(|_| rng.below(2) == 0).collect();
        if !d.is_empty() {
            return d;
        }
    }
}

/// Every solution-supported value per cell, by brute-force cartesian filter.
fn supported(domains: &[Vec<u32>], keep: impl Fn(&[u32]) -> bool) -> Vec<Vec<u32>> {
    let n = domains.len();
    let mut supp: Vec<BTreeSet<u32>> = vec![Default::default(); n];
    let mut cur = vec![0u32; n];
    fn rec(
        i: usize,
        domains: &[Vec<u32>],
        cur: &mut Vec<u32>,
        keep: &dyn Fn(&[u32]) -> bool,
        supp: &mut [BTreeSet<u32>],
    ) {
        if i == domains.len() {
            if keep(cur) {
                for (k, &v) in cur.iter().enumerate() {
                    supp[k].insert(v);
                }
            }
            return;
        }
        for &v in &domains[i] {
            cur[i] = v;
            rec(i + 1, domains, cur, keep, supp);
        }
    }
    rec(0, domains, &mut cur, &keep, &mut supp);
    supp.into_iter().map(|s| s.into_iter().collect()).collect()
}

fn assert_sound<F, R>(label: &str, domains: &[Vec<u32>], keep: F, revise: R)
where
    F: Fn(&[u32]) -> bool,
    R: Fn(&mut [Variable<BitsetDomain>]) -> Revision,
{
    let supp = supported(domains, &keep);
    let mut vars = vars_from(domains);
    let rev = revise(&mut vars);
    // Every solution-supported value must survive.
    for (i, want) in supp.iter().enumerate() {
        let got = domain_of(&vars[i]);
        for v in want {
            assert!(
                got.contains(v),
                "{label}: cell {i} pruned solution-supported value {v}\n  domains={domains:?}\n  survived={got:?}\n  supported={want:?}",
            );
        }
        // The propagator only ever removes values.
        for g in &got {
            assert!(
                domains[i].contains(g),
                "{label}: cell {i} invented value {g}"
            );
        }
    }
    // If any cell has no support, the whole cage is unsat: either a wipe-out
    // was reported or some cell emptied.
    let unsatisfiable = supp.iter().any(|s| s.is_empty());
    if unsatisfiable {
        let emptied = vars.iter().any(|v| v.domain.is_empty());
        assert!(
            rev == Revision::Unsatisfiable || emptied || rev == Revision::Changed,
            "{label}: unsatisfiable cage not flagged for domains={domains:?}"
        );
    }
}

#[test]
fn cage_sum_revise_soundness_randomized() {
    let mut rng = Lcg(0x51ED_C0DE_u64);
    let pool: Vec<u32> = (1..=6).collect();
    for _ in 0..2000 {
        let n = 2 + rng.below(3) as usize; // 2..=4 cells
        let domains: Vec<Vec<u32>> = (0..n).map(|_| random_domain(&mut rng, &pool)).collect();
        let target = 1 + rng.below(24) as i128; // 1..=24
        let scope: Vec<VarId> = (0..n as VarId).collect();
        assert_sound(
            "cage_sum",
            &domains,
            |c| c.iter().map(|&x| x as i128).sum::<i128>() == target,
            |vars| revise_sum(vars, scope.clone(), target as u32),
        );
    }
}

#[test]
fn cage_product_revise_soundness_randomized() {
    let mut rng = Lcg(0xC0FF_EE42_u64);
    // Pool includes 0 to exercise the zero-factor and zero-target logic.
    let pool: Vec<u32> = (0..=6).collect();
    for _ in 0..2000 {
        let n = 2 + rng.below(3) as usize;
        let domains: Vec<Vec<u32>> = (0..n).map(|_| random_domain(&mut rng, &pool)).collect();
        let target = rng.below(50) as i128; // 0..=49 (includes the zero target)
        let scope: Vec<VarId> = (0..n as VarId).collect();
        assert_sound(
            "cage_product",
            &domains,
            |c| c.iter().map(|&x| x as i128).product::<i128>() == target,
            |vars| revise_product(vars, scope.clone(), target as u32),
        );
    }
}
