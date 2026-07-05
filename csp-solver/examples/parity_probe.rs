//! Byte-parity probe for kernel behavior preservation (pass-3 critique).
//!
//! Dumps (nodes_explored, backtracks, propagations, budget_exceeded, nsol,
//! ordered-solution-hash) for a battery of problems under every
//! Pruning x Ordering combo. Identical source compiled against baseline
//! (91bb8b0) and the composed kernel tree; stdout diffed line-for-line.

use csp_solver::builder::assignment;
use csp_solver::constraint::{AllDifferent, LambdaConstraint, NotEqual, VarId};
use csp_solver::domain::bitset::BitsetDomain;
use csp_solver::ordering::Ordering;
use csp_solver::puzzles::futoshiki::{FutoshikiPuzzle, create_futoshiki_csp};
use csp_solver::{Csp, Pruning, SolveConfig};

/// FNV-1a over the ordered solution list. Order-sensitive: a change in
/// enumeration order flips the hash even when the solution *set* is equal.
fn fnv(sols: &[Vec<u32>]) -> u64 {
    let mut h: u64 = 0xcbf29ce484222325;
    for sol in sols {
        for &v in sol {
            for b in v.to_le_bytes() {
                h ^= b as u64;
                h = h.wrapping_mul(0x100000001b3);
            }
        }
        h ^= 0xff; // solution separator
        h = h.wrapping_mul(0x100000001b3);
    }
    h
}

/// Order-INSENSITIVE set hash: XOR of per-solution FNV hashes. If this
/// matches but `fnv` differs, the two trees found the same set in a
/// different order.
fn set_hash(sols: &[Vec<u32>]) -> u64 {
    let mut acc: u64 = 0;
    for sol in sols {
        acc ^= fnv(std::slice::from_ref(sol));
    }
    acc
}

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

fn cfg(p: Pruning, o: Ordering, maxsol: usize) -> SolveConfig {
    SolveConfig {
        pruning: p,
        ordering: o,
        max_solutions: maxsol,
        backjumping: false,
        node_budget: Some(1_000_000),
        ..Default::default()
    }
}

fn emit(
    name: &str,
    p: Pruning,
    o: Ordering,
    maxsol: usize,
    sols: &[Vec<u32>],
    st: &csp_solver::SolveStats,
) {
    let tag = if maxsol == usize::MAX {
        "all".to_string()
    } else {
        maxsol.to_string()
    };
    println!(
        "P={name:<18} pr={p:?} or={o:?} max={tag} nodes={} bt={} prop={} budget={} nsol={} solhash={:#018x} sethash={:#018x}",
        st.nodes_explored,
        st.backtracks,
        st.propagations,
        st.budget_exceeded,
        sols.len(),
        fnv(sols),
        set_hash(sols),
    );
}

fn run<F: Fn() -> Csp<BitsetDomain>>(name: &str, build: F, maxsols: &[usize]) {
    for &maxsol in maxsols {
        for p in PRUNINGS {
            for o in ORDERINGS {
                let mut csp = build();
                let sols = csp.solve(&cfg(p, o, maxsol));
                emit(name, p, o, maxsol, &sols, csp.stats());
            }
        }
    }
}

// ---- problem builders ----

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

/// Australia 3-colouring with integer colours (BitsetDomain 0..3).
/// Regions: 0=WA 1=NT 2=SA 3=Q 4=NSW 5=V 6=T.
fn build_australia() -> Csp<BitsetDomain> {
    let mut csp = Csp::new();
    let domain = BitsetDomain::new(0..3);
    let v: Vec<VarId> = (0..7).map(|_| csp.add_variable(domain.clone())).collect();
    let edges = [
        (0, 1),
        (0, 2),
        (1, 2),
        (1, 3),
        (2, 3),
        (2, 4),
        (2, 5),
        (3, 4),
        (4, 5),
    ];
    for (a, b) in edges {
        csp.add_constraint(NotEqual::new(v[a], v[b]));
    }
    csp.finalize();
    csp
}

/// N-value permutation: N vars over 0..N, one global AllDifferent.
/// Enumerate-all = N! solutions — the multi-solution enumerate path.
fn build_permutation(n: u32) -> Csp<BitsetDomain> {
    let mut csp = Csp::new();
    let domain = BitsetDomain::new(0..n);
    let vars = csp.add_variables(&domain, n as usize);
    csp.add_constraint(AllDifferent::new(vars));
    csp.finalize();
    csp
}

fn build_futoshiki(input: &str) -> Csp<BitsetDomain> {
    create_futoshiki_csp(&FutoshikiPuzzle::parse(input))
}

// ---- solve_with_given path ----

fn run_given(name: &str, n: u32, given: &[(VarId, u32)], maxsol: usize) {
    for p in PRUNINGS {
        for o in ORDERINGS {
            let mut csp = build_permutation(n);
            let sols = csp.solve_with_given(&cfg(p, o, maxsol), given);
            emit(name, p, o, maxsol, &sols, csp.stats());
        }
    }
}

// ---- COP / AssignmentBuilder ----

fn run_assignment() {
    // Deterministic 5x5 cost matrix; branch-and-bound optimum.
    let costs = |r: usize, c: usize| ((r * 7 + c * 3 + (r * c) % 5) % 11) as f64 + 1.0;
    let sol = assignment()
        .rows(5)
        .cols(5)
        .cost(costs)
        .solve()
        .expect("assignment solve");
    let st = &sol.stats;
    println!(
        "P={:<18} COP nodes={} bt={} prop={} budget={} cost={:.4} assign={:?}",
        "assignment5x5",
        st.nodes_explored,
        st.backtracks,
        st.propagations,
        st.budget_exceeded,
        sol.cost,
        sol.assign
    );

    // Grouped variant: two row groups, two col groups, an unmatch penalty.
    let sol2 = assignment()
        .rows(6)
        .cols(6)
        .cost(|r, c| ((r * 5 + c * 2) % 9) as f64 + 0.5)
        .row_group(|r| (r % 2) as u8)
        .col_group(|c| (c % 2) as u8)
        .unmatch_penalty(20.0)
        .solve()
        .expect("assignment grouped solve");
    let st2 = &sol2.stats;
    println!(
        "P={:<18} COP nodes={} bt={} prop={} budget={} cost={:.4} assign={:?}",
        "assignment6x6grp",
        st2.nodes_explored,
        st2.backtracks,
        st2.propagations,
        st2.budget_exceeded,
        sol2.cost,
        sol2.assign
    );
}

fn main() {
    let both: &[usize] = &[1, usize::MAX];

    // Queens: N=6 (all combos complete), N=8 (heavier).
    run("queens6", || build_nqueens(6), both);
    run("queens8", || build_nqueens(8), both);

    // Map colouring (enumerate-all + first).
    run("australia3", build_australia, both);

    // Multi-solution enumerate-all permutations.
    run("perm5", || build_permutation(5), both);
    run("perm6", || build_permutation(6), &[usize::MAX]);

    // Futoshiki: constrained (single sol) + loose (multi sol).
    run(
        "futoshiki_constr",
        || build_futoshiki("4\n0 5\n1 3\n1\n2\n"),
        both,
    );
    run(
        "futoshiki_loose",
        || build_futoshiki("4\n\n\n1\n2\n"),
        &[usize::MAX],
    );

    // solve_with_given: permutation with pins.
    run_given("given_perm5", 5, &[(0, 2)], usize::MAX);
    run_given("given_perm6", 6, &[(0, 0), (1, 3)], usize::MAX);

    // COP / AssignmentBuilder branch-and-bound.
    run_assignment();
}
