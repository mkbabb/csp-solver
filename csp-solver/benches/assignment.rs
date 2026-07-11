use criterion::{BatchSize, BenchmarkId, Criterion, criterion_group, criterion_main};
use csp_solver::assignment;

// ---------------------------------------------------------------------------
// Deterministic LCG cost matrix generator (no `rand` dependency)
// ---------------------------------------------------------------------------

fn lcg_cost_matrix(rows: usize, cols: usize, seed: u64) -> Vec<f64> {
    let mut state = seed;
    (0..rows * cols)
        .map(|_| {
            state = state
                .wrapping_mul(6364136223846793005)
                .wrapping_add(1442695040888963407);
            ((state >> 33) as f64) / (u32::MAX as f64) * 100.0
        })
        .collect()
}

// ---------------------------------------------------------------------------
// Benchmark groups
// ---------------------------------------------------------------------------

fn bench_square_dense(c: &mut Criterion) {
    let mut group = c.benchmark_group("square_dense");

    for &n in &[10, 50, 200] {
        let label = format!("{n}x{n}");

        // CSP AssignmentBuilder
        group.bench_function(BenchmarkId::new("csp", &label), |b| {
            b.iter_batched(
                || lcg_cost_matrix(n, n, 0xDEAD_BEEF),
                |matrix| {
                    assignment()
                        .rows(n)
                        .cols(n)
                        .cost(|i, k| matrix[i * n + k])
                        .unmatch_penalty(1000.0)
                        .solve()
                        .expect("solvable")
                },
                BatchSize::PerIteration,
            );
        });
    }

    group.finish();
}

fn bench_square_roled(c: &mut Criterion) {
    let mut group = c.benchmark_group("square_roled");

    for &n in &[10, 50, 200] {
        let label = format!("{n}x{n}_2roles");

        // CSP with 2-role 50/50 partition
        group.bench_function(BenchmarkId::new("csp", &label), |b| {
            b.iter_batched(
                || lcg_cost_matrix(n, n, 0xCAFE_BABE),
                |matrix| {
                    assignment()
                        .rows(n)
                        .cols(n)
                        .cost(|i, k| matrix[i * n + k])
                        .row_group(|i| if i < n / 2 { 0 } else { 1 })
                        .col_group(|k| if k < n / 2 { 0 } else { 1 })
                        .unmatch_penalty(1000.0)
                        .solve()
                        .expect("solvable")
                },
                BatchSize::PerIteration,
            );
        });
    }

    group.finish();
}

fn bench_rectangular(c: &mut Criterion) {
    let mut group = c.benchmark_group("rectangular");

    for &(rows, cols) in &[(10, 20), (50, 30)] {
        let label = format!("{rows}x{cols}");

        group.bench_function(BenchmarkId::new("csp", &label), |b| {
            b.iter_batched(
                || lcg_cost_matrix(rows, cols, 0x1234_5678),
                |matrix| {
                    assignment()
                        .rows(rows)
                        .cols(cols)
                        .cost(|i, k| matrix[i * cols + k])
                        .unmatch_penalty(1000.0)
                        .solve()
                        .expect("solvable")
                },
                BatchSize::PerIteration,
            );
        });
    }

    group.finish();
}

fn bench_pinned(c: &mut Criterion) {
    let mut group = c.benchmark_group("pinned");
    let n = 50;
    let label = format!("{n}x{n}_5pins");

    group.bench_function(BenchmarkId::new("csp", &label), |b| {
        b.iter_batched(
            || lcg_cost_matrix(n, n, 0xFACE_FEED),
            |matrix| {
                assignment()
                    .rows(n)
                    .cols(n)
                    .cost(|i, k| matrix[i * n + k])
                    .unmatch_penalty(1000.0)
                    .pin(0, 0)
                    .pin(10, 10)
                    .pin(20, 20)
                    .pin(30, 30)
                    .pin(40, 40)
                    .solve()
                    .expect("solvable")
            },
            BatchSize::PerIteration,
        );
    });

    group.finish();
}

fn bench_edge_cases(c: &mut Criterion) {
    let mut group = c.benchmark_group("edge_cases");

    // 1x1
    group.bench_function(BenchmarkId::new("csp", "1x1"), |b| {
        b.iter_batched(
            || lcg_cost_matrix(1, 1, 42),
            |matrix| {
                assignment()
                    .rows(1)
                    .cols(1)
                    .cost(|i, k| matrix[i + k])
                    .unmatch_penalty(1000.0)
                    .solve()
                    .expect("solvable")
            },
            BatchSize::PerIteration,
        );
    });

    // 10x1
    group.bench_function(BenchmarkId::new("csp", "10x1"), |b| {
        b.iter_batched(
            || lcg_cost_matrix(10, 1, 42),
            |matrix| {
                assignment()
                    .rows(10)
                    .cols(1)
                    .cost(|i, k| matrix[i + k])
                    .unmatch_penalty(1000.0)
                    .solve()
                    .expect("solvable")
            },
            BatchSize::PerIteration,
        );
    });

    // 1x10
    group.bench_function(BenchmarkId::new("csp", "1x10"), |b| {
        b.iter_batched(
            || lcg_cost_matrix(1, 10, 42),
            |matrix| {
                assignment()
                    .rows(1)
                    .cols(10)
                    .cost(|i, k| matrix[i * 10 + k])
                    .unmatch_penalty(1000.0)
                    .solve()
                    .expect("solvable")
            },
            BatchSize::PerIteration,
        );
    });

    group.finish();
}

criterion_group!(
    benches,
    bench_square_dense,
    bench_square_roled,
    bench_rectangular,
    bench_pinned,
    bench_edge_cases,
);
criterion_main!(benches);
