//! N-ary arithmetic-cage constraints: [`CageSum`] and [`CageProduct`].
//!
//! These are the two `revise_impl`s that clear the engine's **n-ary-lambda
//! blindness wall** (`constraint/traits.rs`: the default `revise` returns
//! [`Revision::Unchanged`] for any scope of 3+ variables, so a cage modelled as
//! a [`LambdaConstraint`](super::lambda::LambdaConstraint) is consulted only by
//! `check()` at assignment time and prunes *nothing*). A Killer cage (sum) or a
//! KenKen `×` cage (product) modelled as a lambda therefore searches blind past
//! the AllDifferent GAC. Modelled as one of these devirtualized
//! [`ConstraintEnum`](super::dispatch::ConstraintEnum) variants, the cage's
//! bounds-propagation `revise_impl` tightens each cell's domain by the residual
//! target — the node-count drop banked in `tests/cage.rs`.
//!
//! Both are **bounds-consistency** propagators (in the `AllDifferent` /
//! `NotEqual` mold — a real `revise_impl`, never an n-ary lambda): they prune a
//! value only when the residual target cannot be met with any choice of the
//! other cells' current bounds. Bounds consistency is *sound* (it never removes
//! a value that participates in a full solution) but not domain-complete — the
//! differential oracle (`tests/cage.rs`, and the revise-level randomized oracle
//! below) is the born-RED guard on exactly that soundness property.
//!
//! ## The value seam
//!
//! [`ConstraintEnum`] is generic over the domain `D`, and its value type ranges
//! over `u32` (the production [`BitsetDomain`](crate::domain::BitsetDomain)),
//! `i32`, `String`, lattice `BitsetDomain`, … — cage arithmetic is meaningful
//! only for the integer bitset domain. Rather than pin a numeric trait bound on
//! the shared enum (which would reject every non-numeric domain the engine
//! already serves), each cage carries its integer reading as **data**: a
//! `fn(&V) -> `[`CageInt`] pointer, set by the `u32` constructor. The generic
//! `revise_impl`/`check_impl` then compile for every `V` and do real arithmetic
//! for the one value type a cage is ever built over. No enum bound changes; the
//! variant is simply never constructed for a non-integer domain.

use crate::domain::Domain;
use crate::variable::Variable;

use super::traits::{Revision, VarId};

/// Signed accumulator for cage arithmetic. `i64` (not `i128`) deliberately:
/// wasm32 has native 64-bit mul/div/rem but emulates 128-bit in software
/// (`__multi3`/`__udivti3`/`__umodti3` — kilobytes of compiler-rt that land in
/// the lean build), and 64 bits is ample. A Killer sum tops out near 1 143
/// (9 cells × 127); a KenKen product near 9⁹ ≈ 3.8·10⁸ — both dwarfed by
/// `i64::MAX` (≈ 9.2·10¹⁸). The product path still saturates every multiply so
/// a pathological scope degrades to a sound "no upper prune" rather than wrap.
type CageInt = i64;

/// Integer `(min, max, has_zero)` of a domain, or `None` when it is empty
/// (a wipe-out the caller reports as [`Revision::Unsatisfiable`]).
fn cell_bounds<D: Domain>(
    dom: &D,
    to_int: fn(&D::Value) -> CageInt,
) -> Option<(CageInt, CageInt, bool)> {
    let mut lo = CageInt::MAX;
    let mut hi = CageInt::MIN;
    let mut has_zero = false;
    for val in dom.iter() {
        let x = to_int(&val);
        lo = lo.min(x);
        hi = hi.max(x);
        has_zero |= x == 0;
    }
    if hi < lo {
        None
    } else {
        Some((lo, hi, has_zero))
    }
}

// ===========================================================================
// CageSum — Σ scope == target
// ===========================================================================

/// N-ary cage-sum: the scope's values sum to `target`.
///
/// Serves Killer cages and the `+` KenKen cages. `revise_impl` is bounds
/// consistency for the linear equality `Σ xᵢ == target`: each cell is pinned to
/// `[target − Σ(others' max), target − Σ(others' min)]`, iterated to an internal
/// fixpoint because pruning one cell tightens the residual for the rest.
pub struct CageSum<V> {
    pub(crate) scope: Vec<VarId>,
    target: CageInt,
    to_int: fn(&V) -> CageInt,
}

impl<V> std::fmt::Debug for CageSum<V> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "CageSum(target={}, {:?})", self.target, self.scope)
    }
}

impl CageSum<u32> {
    /// Cage-sum over `scope` summing to `target`, for the production
    /// [`BitsetDomain`](crate::domain::BitsetDomain) (values are `u32`).
    pub fn new(scope: Vec<VarId>, target: u32) -> Self {
        Self {
            scope,
            target: target as CageInt,
            to_int: |v| *v as CageInt,
        }
    }
}

impl<V> CageSum<V> {
    /// Satisfied iff the fully-assigned scope sums to `target`. A partial scope
    /// passes — the search kernel calls `check` only once every scope variable
    /// is bound, and propagation (`revise_impl`) owns partial pruning.
    pub(crate) fn check_impl(&self, assignment: &[Option<V>]) -> bool {
        let mut sum: CageInt = 0;
        for &v in &self.scope {
            match &assignment[v as usize] {
                Some(val) => sum += (self.to_int)(val),
                None => return true,
            }
        }
        sum == self.target
    }

    pub(crate) fn revise_impl<D: Domain<Value = V>>(
        &self,
        vars: &mut [Variable<D>],
        depth: usize,
    ) -> Revision {
        let mut changed = false;
        loop {
            // Running integer totals across the whole scope.
            let mut s_min: CageInt = 0;
            let mut s_max: CageInt = 0;
            for &v in &self.scope {
                match cell_bounds(&vars[v as usize].domain, self.to_int) {
                    Some((lo, hi, _)) => {
                        s_min += lo;
                        s_max += hi;
                    }
                    None => return Revision::Unsatisfiable,
                }
            }

            let mut pass_changed = false;
            for &v in &self.scope {
                // This cell's own bounds; the residual others-sum is then
                // [s_min − lo_i, s_max − hi_i], pinning the cell to
                // [target − others_max, target − others_min].
                let (lo_i, hi_i, _) = cell_bounds(&vars[v as usize].domain, self.to_int)
                    .expect("non-empty: totals pass above would have returned");
                let allow_lo = self.target - (s_max - hi_i);
                let allow_hi = self.target - (s_min - lo_i);
                for val in vars[v as usize].domain.iter() {
                    let x = (self.to_int)(&val);
                    if (x < allow_lo || x > allow_hi) && vars[v as usize].prune(&val, depth) {
                        pass_changed = true;
                        changed = true;
                    }
                }
                if vars[v as usize].domain.is_empty() {
                    return Revision::Unsatisfiable;
                }
            }
            if !pass_changed {
                break;
            }
        }
        if changed {
            Revision::Changed
        } else {
            Revision::Unchanged
        }
    }
}

// ===========================================================================
// CageProduct — Π scope == target
// ===========================================================================

/// N-ary cage-product: the scope's values multiply to `target`.
///
/// Serves the `×` KenKen cages. `revise_impl` is bounds consistency for the
/// multiplicative equality `Π xᵢ == target` over non-negative integers, iterated
/// to an internal fixpoint. For a non-zero target every cell must be non-zero
/// (a zero factor forces the product to zero), each cell must **divide** the
/// target, and the required product of the others (`target / xᵢ`) must lie in
/// `[Π others' min, Π others' max]` — the positive-monotone product bound. The
/// KenKen invariant (values 1..=n, no zeros) makes these bounds clean; the
/// zero-target branch is handled soundly for completeness.
pub struct CageProduct<V> {
    pub(crate) scope: Vec<VarId>,
    target: CageInt,
    to_int: fn(&V) -> CageInt,
}

impl<V> std::fmt::Debug for CageProduct<V> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "CageProduct(target={}, {:?})", self.target, self.scope)
    }
}

impl CageProduct<u32> {
    /// Cage-product over `scope` multiplying to `target`, for the production
    /// [`BitsetDomain`](crate::domain::BitsetDomain) (values are `u32`).
    pub fn new(scope: Vec<VarId>, target: u32) -> Self {
        Self {
            scope,
            target: target as CageInt,
            to_int: |v| *v as CageInt,
        }
    }
}

impl<V> CageProduct<V> {
    /// Satisfied iff the fully-assigned scope multiplies to `target`. A partial
    /// scope passes (see [`CageSum::check_impl`]).
    pub(crate) fn check_impl(&self, assignment: &[Option<V>]) -> bool {
        let mut prod: CageInt = 1;
        for &v in &self.scope {
            match &assignment[v as usize] {
                Some(val) => prod = prod.saturating_mul((self.to_int)(val)),
                None => return true,
            }
        }
        prod == self.target
    }

    pub(crate) fn revise_impl<D: Domain<Value = V>>(
        &self,
        vars: &mut [Variable<D>],
        depth: usize,
    ) -> Revision {
        let mut changed = false;
        loop {
            // Validity pass: any empty domain is an immediate wipe-out (it also
            // lets the per-cell peer scans below `unwrap` their `cell_bounds`).
            for &v in &self.scope {
                if cell_bounds(&vars[v as usize].domain, self.to_int).is_none() {
                    return Revision::Unsatisfiable;
                }
            }

            let mut pass_changed = false;
            for (i, &v) in self.scope.iter().enumerate() {
                if self.target == 0 {
                    // Product is zero iff some cell is zero. A cell whose peers
                    // can never be zero is itself forced to zero.
                    let peers_can_be_zero = self.scope.iter().enumerate().any(|(j, &u)| {
                        j != i
                            && cell_bounds(&vars[u as usize].domain, self.to_int)
                                .is_some_and(|c| c.2)
                    });
                    if peers_can_be_zero {
                        continue;
                    }
                    for val in vars[v as usize].domain.iter() {
                        if (self.to_int)(&val) != 0 && vars[v as usize].prune(&val, depth) {
                            pass_changed = true;
                            changed = true;
                        }
                    }
                } else {
                    // Positive-monotone product bound of the other cells. A peer
                    // still carrying a zero drags `others_min` to 0 (a sound,
                    // looser lower bound); it is pruned on its own turn, and the
                    // fixpoint re-tightens next pass.
                    let mut others_min: CageInt = 1;
                    let mut others_max: CageInt = 1;
                    for (j, &u) in self.scope.iter().enumerate() {
                        if j == i {
                            continue;
                        }
                        let (lo, hi, _) = cell_bounds(&vars[u as usize].domain, self.to_int)
                            .expect("non-empty: validity pass above would have returned");
                        others_min = others_min.saturating_mul(lo);
                        others_max = others_max.saturating_mul(hi);
                    }
                    for val in vars[v as usize].domain.iter() {
                        let x = (self.to_int)(&val);
                        // A supported value must be non-zero (a zero factor
                        // forces a zero product), must divide the target, and
                        // its required cofactor `target / x` must be reachable
                        // by the others. `x == 0` short-circuits before the
                        // modulo, so the divide is never by zero.
                        let prune = x == 0
                            || self.target % x != 0
                            || !(others_min..=others_max).contains(&(self.target / x));
                        if prune && vars[v as usize].prune(&val, depth) {
                            pass_changed = true;
                            changed = true;
                        }
                    }
                }
                if vars[v as usize].domain.is_empty() {
                    return Revision::Unsatisfiable;
                }
            }
            if !pass_changed {
                break;
            }
        }
        if changed {
            Revision::Changed
        } else {
            Revision::Unchanged
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::constraint::LambdaConstraint;
    use crate::constraint::traits::Constraint;
    use crate::domain::BitsetDomain;

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
        let cage = CageSum::new(vec![0, 1, 2], 6);
        let rev = cage.revise_impl(&mut vars, 1);
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
        let cage = CageSum::new(vec![0, 1], 17);
        assert_eq!(cage.revise_impl(&mut vars, 1), Revision::Changed);
        assert_eq!(domain_of(&vars[0]), vec![8, 9]);
        assert_eq!(domain_of(&vars[1]), vec![8, 9]);
    }

    #[test]
    fn cage_sum_revise_detects_unsat() {
        // Max reachable sum is 2+2 = 4 < target 9.
        let mut vars = vars_from(&[vec![1, 2], vec![1, 2]]);
        let cage = CageSum::new(vec![0, 1], 9);
        assert_eq!(cage.revise_impl(&mut vars, 1), Revision::Unsatisfiable);
    }

    // -- CageProduct propagation --------------------------------------------

    #[test]
    fn cage_product_revise_prunes_by_divisibility_and_bound() {
        // Π of three cells (1..=6) == 6. Others' max product is 6*6 = 36, so
        // every value divides 6 (5 is dropped) and required = 6/x must be
        // reachable — 1,2,3,6 survive; 4,5 do not.
        let mut vars = vars_from(&rep(&[1, 2, 3, 4, 5, 6], 3));
        let cage = CageProduct::new(vec![0, 1, 2], 6);
        assert_eq!(cage.revise_impl(&mut vars, 1), Revision::Changed);
        for v in &vars {
            assert_eq!(domain_of(v), vec![1, 2, 3, 6]);
        }
    }

    #[test]
    fn cage_product_revise_prunes_zero_for_nonzero_target() {
        let mut vars = vars_from(&[vec![0, 1, 2, 3], vec![0, 1, 2, 3]]);
        let cage = CageProduct::new(vec![0, 1], 6);
        assert_eq!(cage.revise_impl(&mut vars, 1), Revision::Changed);
        // 0 gone (zero factor); 1 gone (6/1 = 6 exceeds other's max 3); 2,3 stay.
        assert_eq!(domain_of(&vars[0]), vec![2, 3]);
        assert_eq!(domain_of(&vars[1]), vec![2, 3]);
    }

    #[test]
    fn cage_product_revise_detects_unsat() {
        // Max reachable product is 2*2 = 4 < target 9.
        let mut vars = vars_from(&[vec![1, 2], vec![1, 2]]);
        let cage = CageProduct::new(vec![0, 1], 9);
        assert_eq!(cage.revise_impl(&mut vars, 1), Revision::Unsatisfiable);
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
        let mut supp: Vec<std::collections::BTreeSet<u32>> = vec![Default::default(); n];
        let mut cur = vec![0u32; n];
        fn rec(
            i: usize,
            domains: &[Vec<u32>],
            cur: &mut Vec<u32>,
            keep: &dyn Fn(&[u32]) -> bool,
            supp: &mut [std::collections::BTreeSet<u32>],
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
                |vars| CageSum::new(scope.clone(), target as u32).revise_impl(vars, 1),
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
                |vars| CageProduct::new(scope.clone(), target as u32).revise_impl(vars, 1),
            );
        }
    }
}
