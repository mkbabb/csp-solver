use criterion::{BenchmarkId, Criterion, criterion_group, criterion_main};
use csp_solver::Csp;
use csp_solver::constraint::{LambdaConstraint, VarId};
use csp_solver::domain::LatticeDomain;
use csp_solver::domain::bitset::BitsetDomain;
use csp_solver::domain::lattice::BitsetLatticeDomain;

// ---------------------------------------------------------------------------
// Acyclic chain: N variables, each grounded to a different initial set,
// with union constraints propagating left-to-right.
//
//   v0 >= seed0
//   v1 >= v0
//   v2 >= v1
//   ...
//   v_{N-1} >= v_{N-2}
//
// After propagation, v_{N-1} should contain the union of all seeds.
// ---------------------------------------------------------------------------

fn build_acyclic_chain(n: usize, finalize: bool) -> Csp<BitsetLatticeDomain> {
    let mut csp = Csp::new();

    // Each variable starts with a single-bit seed: variable i gets bit i.
    // For n > 128 we wrap around, but n <= 128 is the intended usage.
    let vars: Vec<VarId> = (0..n)
        .map(|i| {
            let bit = (i % 128) as u32;
            let seed = BitsetLatticeDomain::new(BitsetDomain::new([bit]));
            csp.add_variable(seed)
        })
        .collect();

    // Chain constraint: v[i+1] >= v[i] (i.e. v[i+1] must be superset of v[i]).
    // AC-3 revise on this will join v[i]'s value into v[i+1].
    for i in 0..(n - 1) {
        let vi = vars[i];
        let vj = vars[i + 1];
        csp.add_constraint(LambdaConstraint::<BitsetLatticeDomain>::new(
            vec![vi, vj],
            move |assignment| match (&assignment[vi as usize], &assignment[vj as usize]) {
                (Some(a), Some(b)) => {
                    // b must be a superset of a
                    (a.bits() & b.bits()) == a.bits()
                }
                _ => true,
            },
            format!("v{} >= v{}", i + 1, i),
        ));
    }

    // finalize() builds the adjacency graph, which routes propagate() to AC-3.
    // Dropping it leaves propagate() on the monotonic sweep — bbnf's actual path
    // (it never calls finalize() over its lattice-domain IR passes).
    if finalize {
        csp.finalize();
    }
    csp
}

// ---------------------------------------------------------------------------
// Cyclic ring: N variables arranged in a cycle.
//
//   v0 >= v_{N-1}
//   v1 >= v0
//   v2 >= v1
//   ...
//   v_{N-1} >= v_{N-2}
//
// Each variable seeded with a single bit. After propagation all variables
// should contain the union of all seeds (the complete set).
// ---------------------------------------------------------------------------

fn build_cyclic_ring(n: usize, finalize: bool) -> Csp<BitsetLatticeDomain> {
    let mut csp = Csp::new();

    let vars: Vec<VarId> = (0..n)
        .map(|i| {
            let bit = (i % 128) as u32;
            let seed = BitsetLatticeDomain::new(BitsetDomain::new([bit]));
            csp.add_variable(seed)
        })
        .collect();

    // Ring: v[(i+1) % n] >= v[i]
    for i in 0..n {
        let vi = vars[i];
        let vj = vars[(i + 1) % n];
        csp.add_constraint(LambdaConstraint::<BitsetLatticeDomain>::new(
            vec![vi, vj],
            move |assignment| match (&assignment[vi as usize], &assignment[vj as usize]) {
                (Some(a), Some(b)) => (a.bits() & b.bits()) == a.bits(),
                _ => true,
            },
            format!("v{} >= v{}", (i + 1) % n, i),
        ));
    }

    // finalize() builds the adjacency graph, which routes propagate() to AC-3.
    // Dropping it leaves propagate() on the monotonic sweep — bbnf's actual path
    // (it never calls finalize() over its lattice-domain IR passes).
    if finalize {
        csp.finalize();
    }
    csp
}

// ---------------------------------------------------------------------------
// FIRST-set simulation: tree-structured grammar dependencies.
//
// Models a grammar with `depth` levels, branching factor 2.
// Leaf rules each contribute a unique terminal. Non-leaf rules inherit
// from both children via union (superset) constraints.
//
// Total variables: 2^(depth+1) - 1
// ---------------------------------------------------------------------------

fn build_first_set_tree(depth: usize, finalize: bool) -> Csp<BitsetLatticeDomain> {
    let mut csp = Csp::new();
    let num_nodes = (1usize << (depth + 1)) - 1;

    // Leaves get unique seeds; internal nodes start at bottom.
    let num_leaves = 1usize << depth;
    let first_leaf = num_nodes - num_leaves;

    let vars: Vec<VarId> = (0..num_nodes)
        .map(|i| {
            if i >= first_leaf {
                let bit = ((i - first_leaf) % 128) as u32;
                csp.add_variable(BitsetLatticeDomain::new(BitsetDomain::new([bit])))
            } else {
                csp.add_variable(BitsetLatticeDomain::bottom())
            }
        })
        .collect();

    // Parent >= left child, Parent >= right child.
    for i in 0..first_leaf {
        let left = 2 * i + 1;
        let right = 2 * i + 2;

        let vp = vars[i];
        let vl = vars[left];
        csp.add_constraint(LambdaConstraint::<BitsetLatticeDomain>::new(
            vec![vl, vp],
            move |assignment| match (&assignment[vl as usize], &assignment[vp as usize]) {
                (Some(a), Some(b)) => (a.bits() & b.bits()) == a.bits(),
                _ => true,
            },
            format!("v{i} >= v{left}"),
        ));

        let vr = vars[right];
        csp.add_constraint(LambdaConstraint::<BitsetLatticeDomain>::new(
            vec![vr, vp],
            move |assignment| match (&assignment[vr as usize], &assignment[vp as usize]) {
                (Some(a), Some(b)) => (a.bits() & b.bits()) == a.bits(),
                _ => true,
            },
            format!("v{i} >= v{right}"),
        ));
    }

    // finalize() builds the adjacency graph, which routes propagate() to AC-3.
    // Dropping it leaves propagate() on the monotonic sweep — bbnf's actual path
    // (it never calls finalize() over its lattice-domain IR passes).
    if finalize {
        csp.finalize();
    }
    csp
}

// ---------------------------------------------------------------------------
// Benchmarks
// ---------------------------------------------------------------------------

// Each builder is run under BOTH propagation paths:
//   finalize == true  → adjacency built → propagate() dispatches to AC-3.
//   finalize == false → no adjacency    → propagate() dispatches to the monotonic
//                                          sweep, which is bbnf's real path over
//                                          its lattice-domain IR passes (it never
//                                          calls finalize()). The `_sweep` groups
//                                          are the sweep-path variants added at
//                                          T2-W3 so the sweep kernel is benched,
//                                          not just AC-3.

fn bench_acyclic_chain(c: &mut Criterion) {
    for (suffix, finalize) in [("", true), ("_sweep", false)] {
        let mut group = c.benchmark_group(format!("lattice_acyclic_chain{suffix}"));
        for &n in &[20usize, 50, 100] {
            group.bench_function(BenchmarkId::from_parameter(n), |b| {
                b.iter(|| {
                    let mut csp = build_acyclic_chain(n, finalize);
                    let result = csp.propagate();
                    assert!(result.is_ok());
                    result
                });
            });
        }
        group.finish();
    }
}

fn bench_cyclic_ring(c: &mut Criterion) {
    for (suffix, finalize) in [("", true), ("_sweep", false)] {
        let mut group = c.benchmark_group(format!("lattice_cyclic_ring{suffix}"));
        for &n in &[20usize, 50, 100, 128] {
            group.bench_function(BenchmarkId::from_parameter(n), |b| {
                b.iter(|| {
                    let mut csp = build_cyclic_ring(n, finalize);
                    let result = csp.propagate();
                    assert!(result.is_ok());
                    result
                });
            });
        }
        group.finish();
    }
}

fn bench_first_set_tree(c: &mut Criterion) {
    for (suffix, finalize) in [("", true), ("_sweep", false)] {
        let mut group = c.benchmark_group(format!("lattice_first_set_tree{suffix}"));
        // depth=4 -> 31 nodes, depth=5 -> 63, depth=6 -> 127
        for &depth in &[4usize, 5, 6] {
            let num_nodes = (1usize << (depth + 1)) - 1;
            group.bench_function(
                BenchmarkId::new("depth", format!("{depth}_({num_nodes}n)")),
                |b| {
                    b.iter(|| {
                        let mut csp = build_first_set_tree(depth, finalize);
                        let result = csp.propagate();
                        assert!(result.is_ok());
                        result
                    });
                },
            );
        }
        group.finish();
    }
}

criterion_group!(
    benches,
    bench_acyclic_chain,
    bench_cyclic_ring,
    bench_first_set_tree
);
criterion_main!(benches);
