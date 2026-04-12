use criterion::{BatchSize, BenchmarkId, Criterion, criterion_group, criterion_main};
use csp_solver::domain::CostFiniteDomain;
use csp_solver::domain::traits::{CostDomain, Domain};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/// Build a CostFiniteDomain with `n` values: 0..n, costs from LCG.
fn make_domain(n: usize, seed: u64) -> CostFiniteDomain {
    let mut state = seed;
    let values: Vec<i32> = (0..n as i32).collect();
    let costs: Vec<f64> = (0..n)
        .map(|_| {
            state = state
                .wrapping_mul(6364136223846793005)
                .wrapping_add(1442695040888963407);
            ((state >> 33) as f64) / (u32::MAX as f64) * 100.0
        })
        .collect();
    CostFiniteDomain::new(values, costs)
}

// ---------------------------------------------------------------------------
// Benchmarks
// ---------------------------------------------------------------------------

fn bench_min_cost_cached(c: &mut Criterion) {
    let mut group = c.benchmark_group("min_cost_cached");

    for &n in &[10, 50, 200, 1000] {
        // First call: cold compute.
        group.bench_function(BenchmarkId::new("cold", n), |b| {
            b.iter_batched(
                || make_domain(n, 0xBEEF),
                |domain| {
                    let _ = domain.min_cost();
                },
                BatchSize::PerIteration,
            );
        });

        // Second call: should be O(1) cache hit.
        group.bench_function(BenchmarkId::new("cached", n), |b| {
            b.iter_batched(
                || {
                    let domain = make_domain(n, 0xBEEF);
                    // Prime the cache.
                    let _ = domain.min_cost();
                    domain
                },
                |domain| {
                    let _ = domain.min_cost();
                },
                BatchSize::PerIteration,
            );
        });
    }

    group.finish();
}

fn bench_min_cost_after_prune(c: &mut Criterion) {
    let mut group = c.benchmark_group("min_cost_after_prune");

    for &n in &[10, 50, 200, 1000] {
        group.bench_function(BenchmarkId::new("prune_then_min", n), |b| {
            b.iter_batched(
                || {
                    let domain = make_domain(n, 0xBEEF);
                    // Prime cache so remove() actually invalidates it.
                    let _ = domain.min_cost();
                    domain
                },
                |mut domain| {
                    // Remove value 0 (always present), invalidating cache.
                    domain.remove(&0);
                    // Recompute min_cost.
                    let _ = domain.min_cost();
                },
                BatchSize::PerIteration,
            );
        });
    }

    group.finish();
}

criterion_group!(benches, bench_min_cost_cached, bench_min_cost_after_prune);
criterion_main!(benches);
