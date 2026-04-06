use criterion::{BenchmarkId, Criterion, criterion_group, criterion_main};
use csp_solver::constraint::{AllDifferent, LambdaConstraint};
use csp_solver::domains::bitset::BitsetDomain;
use csp_solver::ordering::Ordering;
use csp_solver::{Csp, Pruning, SolveConfig};

// ---------------------------------------------------------------------------
// Builder: construct a fresh N-Queens CSP
// ---------------------------------------------------------------------------

fn build_queens(n: u32) -> Csp<BitsetDomain> {
    let mut csp = Csp::new();

    // Variable i = row for queen in column i. Domain = {0, ..., n-1}.
    let domain = BitsetDomain::range(n);
    let vars = csp.add_variables(&domain, n as usize);

    // All queens in different rows.
    csp.add_constraint(AllDifferent::new(vars.clone()));

    // Diagonal constraints: for each pair (i, j), |row_i - row_j| != |i - j|.
    for i in 0..n {
        for j in (i + 1)..n {
            let vi = vars[i as usize];
            let vj = vars[j as usize];
            let diff = j - i;
            csp.add_constraint(LambdaConstraint::new(
                vec![vi, vj],
                move |assignment: &[Option<u32>]| match (
                    &assignment[vi as usize],
                    &assignment[vj as usize],
                ) {
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

// ---------------------------------------------------------------------------
// Benchmarks
// ---------------------------------------------------------------------------

fn bench_queens_first_solution(c: &mut Criterion) {
    let mut group = c.benchmark_group("queens_first");

    for &n in &[8u32, 12, 16] {
        let id = BenchmarkId::new("ac3_failfirst", n);
        group.bench_function(id, |b| {
            b.iter(|| {
                let mut csp = build_queens(n);
                let config = SolveConfig {
                    pruning: Pruning::Ac3,
                    ordering: Ordering::FailFirst,
                    max_solutions: 1,
                    backjumping: false,
                };
                let solutions = csp.solve(&config);
                assert!(!solutions.is_empty());
                solutions
            });
        });
    }

    group.finish();
}

fn bench_queens_all_solutions(c: &mut Criterion) {
    let mut group = c.benchmark_group("queens_all");

    // N=8: 92 solutions — fast enough for full enumeration.
    group.bench_function(BenchmarkId::new("ac3_failfirst", 8), |b| {
        b.iter(|| {
            let mut csp = build_queens(8);
            let config = SolveConfig {
                pruning: Pruning::Ac3,
                ordering: Ordering::FailFirst,
                max_solutions: usize::MAX,
                backjumping: false,
            };
            let solutions = csp.solve(&config);
            assert_eq!(solutions.len(), 92);
            solutions
        });
    });

    // N=12: 14200 solutions — still tractable.
    group.sample_size(10);
    group.bench_function(BenchmarkId::new("ac3_failfirst", 12), |b| {
        b.iter(|| {
            let mut csp = build_queens(12);
            let config = SolveConfig {
                pruning: Pruning::Ac3,
                ordering: Ordering::FailFirst,
                max_solutions: usize::MAX,
                backjumping: false,
            };
            let solutions = csp.solve(&config);
            assert_eq!(solutions.len(), 14200);
            solutions
        });
    });

    group.finish();
}

fn bench_queens_configs(c: &mut Criterion) {
    let mut group = c.benchmark_group("queens_configs");

    // Compare solver configurations on 8-queens (all solutions).
    let configs: &[(&str, Pruning, Ordering)] = &[
        ("fc_chrono", Pruning::ForwardChecking, Ordering::Chronological),
        ("fc_failfirst", Pruning::ForwardChecking, Ordering::FailFirst),
        ("ac3_failfirst", Pruning::Ac3, Ordering::FailFirst),
        ("ac3_domwdeg", Pruning::Ac3, Ordering::DomWdeg),
        ("acfc_failfirst", Pruning::AcFc, Ordering::FailFirst),
    ];

    for &(name, pruning, ordering) in configs {
        group.bench_function(BenchmarkId::new("8q_all", name), |b| {
            b.iter(|| {
                let mut csp = build_queens(8);
                let config = SolveConfig {
                    pruning,
                    ordering,
                    max_solutions: usize::MAX,
                    backjumping: false,
                };
                let solutions = csp.solve(&config);
                assert_eq!(solutions.len(), 92);
                solutions
            });
        });
    }

    group.finish();
}

criterion_group!(
    benches,
    bench_queens_first_solution,
    bench_queens_all_solutions,
    bench_queens_configs
);
criterion_main!(benches);
