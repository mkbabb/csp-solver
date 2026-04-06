use criterion::{BenchmarkId, Criterion, criterion_group, criterion_main};
use csp_solver::constraint::VarId;
use csp_solver::domain::bitset::BitsetDomain;
use csp_solver::ordering::Ordering;
use csp_solver::{Csp, Pruning, SolveConfig};

// ---------------------------------------------------------------------------
// Australia: 7 nodes, 3 colors
// ---------------------------------------------------------------------------

fn build_australia() -> Csp<BitsetDomain> {
    // WA=0, NT=1, SA=2, Q=3, NSW=4, V=5, T=6
    let mut csp = Csp::new();
    let domain = BitsetDomain::new(0..3);
    let _vars = csp.add_variables(&domain, 7);

    let edges: &[(VarId, VarId)] = &[
        (0, 1), // WA-NT
        (0, 2), // WA-SA
        (1, 2), // NT-SA
        (1, 3), // NT-Q
        (2, 3), // SA-Q
        (2, 4), // SA-NSW
        (2, 5), // SA-V
        (3, 4), // Q-NSW
        (4, 5), // NSW-V
    ];
    for &(a, b) in edges {
        csp.add_not_equal(a, b);
    }
    csp.finalize();
    csp
}

// ---------------------------------------------------------------------------
// Deterministic random graph generator (LCG-based)
// ---------------------------------------------------------------------------

fn build_random_graph(n: u32, num_colors: u32, seed: u64, edge_probability_pct: u32) -> Csp<BitsetDomain> {
    let mut csp = Csp::new();
    let domain = BitsetDomain::new(0..num_colors);
    let _vars = csp.add_variables(&domain, n as usize);

    // Simple LCG for deterministic edge generation
    let mut rng = seed;
    for i in 0..n {
        for j in (i + 1)..n {
            rng = rng.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
            let roll = ((rng >> 33) as u32) % 100;
            if roll < edge_probability_pct {
                csp.add_not_equal(i as VarId, j as VarId);
            }
        }
    }

    csp.finalize();
    csp
}

// ---------------------------------------------------------------------------
// Benchmarks
// ---------------------------------------------------------------------------

fn bench_australia(c: &mut Criterion) {
    let mut group = c.benchmark_group("map_color_australia");

    let configs: &[(&str, Pruning, Ordering)] = &[
        ("fc_failfirst", Pruning::ForwardChecking, Ordering::FailFirst),
        ("ac3_failfirst", Pruning::Ac3, Ordering::FailFirst),
        ("ac3_domwdeg", Pruning::Ac3, Ordering::DomWdeg),
    ];

    for &(name, pruning, ordering) in configs {
        // First solution
        group.bench_function(BenchmarkId::new("first", name), |b| {
            b.iter(|| {
                let mut csp = build_australia();
                let config = SolveConfig {
                    pruning,
                    ordering,
                    max_solutions: 1,
                    backjumping: false,
                };
                let solutions = csp.solve(&config);
                assert!(!solutions.is_empty());
                solutions
            });
        });

        // All solutions
        group.bench_function(BenchmarkId::new("all", name), |b| {
            b.iter(|| {
                let mut csp = build_australia();
                let config = SolveConfig {
                    pruning,
                    ordering,
                    max_solutions: usize::MAX,
                    backjumping: false,
                };
                csp.solve(&config)
            });
        });
    }

    group.finish();
}

fn bench_random_graph(c: &mut Criterion) {
    let mut group = c.benchmark_group("map_color_random");

    // 20-node graph, 4 colors, ~30% edge density
    group.bench_function(BenchmarkId::new("n20_c4", "ac3_failfirst"), |b| {
        b.iter(|| {
            let mut csp = build_random_graph(20, 4, 0xDEAD_BEEF, 30);
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

    group.bench_function(BenchmarkId::new("n20_c4", "ac3_domwdeg"), |b| {
        b.iter(|| {
            let mut csp = build_random_graph(20, 4, 0xDEAD_BEEF, 30);
            let config = SolveConfig {
                pruning: Pruning::Ac3,
                ordering: Ordering::DomWdeg,
                max_solutions: 1,
                backjumping: false,
            };
            let solutions = csp.solve(&config);
            assert!(!solutions.is_empty());
            solutions
        });
    });

    // 20-node graph, 3 colors, tighter (~25% density for feasibility)
    group.bench_function(BenchmarkId::new("n20_c3", "ac3_failfirst"), |b| {
        b.iter(|| {
            let mut csp = build_random_graph(20, 3, 0xCAFE_BABE, 25);
            let config = SolveConfig {
                pruning: Pruning::Ac3,
                ordering: Ordering::FailFirst,
                max_solutions: 1,
                backjumping: false,
            };
            csp.solve(&config)
        });
    });

    // 50-node graph, 4 colors, ~15% edge density
    group.bench_function(BenchmarkId::new("n50_c4", "ac3_failfirst"), |b| {
        b.iter(|| {
            let mut csp = build_random_graph(50, 4, 0x1234_5678, 15);
            let config = SolveConfig {
                pruning: Pruning::Ac3,
                ordering: Ordering::FailFirst,
                max_solutions: 1,
                backjumping: false,
            };
            csp.solve(&config)
        });
    });

    group.bench_function(BenchmarkId::new("n50_c4", "ac3_domwdeg"), |b| {
        b.iter(|| {
            let mut csp = build_random_graph(50, 4, 0x1234_5678, 15);
            let config = SolveConfig {
                pruning: Pruning::Ac3,
                ordering: Ordering::DomWdeg,
                max_solutions: 1,
                backjumping: false,
            };
            csp.solve(&config)
        });
    });

    // 50-node graph, 5 colors, ~20% density (more edges, more colors)
    group.bench_function(BenchmarkId::new("n50_c5", "ac3_failfirst"), |b| {
        b.iter(|| {
            let mut csp = build_random_graph(50, 5, 0xBAAD_F00D, 20);
            let config = SolveConfig {
                pruning: Pruning::Ac3,
                ordering: Ordering::FailFirst,
                max_solutions: 1,
                backjumping: false,
            };
            csp.solve(&config)
        });
    });

    group.finish();
}

criterion_group!(benches, bench_australia, bench_random_graph);
criterion_main!(benches);
