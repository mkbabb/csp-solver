//! Profiling harness with phase timing breakdown.

use csp_solver::constraint::VarId;
use csp_solver::domain::bitset::BitsetDomain;
use csp_solver::ordering::Ordering;
use csp_solver::*;
use std::time::{Duration, Instant};

#[allow(dead_code)]
struct PhaseTimings {
    construct: Duration,
    finalize: Duration,
    initial_prop: Duration,
    search: Duration,
    total: Duration,
    backtracks: u64,
    propagations: u64,
}

fn solve_timed(grid: &[u32; 81], config: &SolveConfig) -> PhaseTimings {
    let total_start = Instant::now();

    // Phase 1: Construct CSP
    let t = Instant::now();
    let mut csp = Csp::new();
    let domain = BitsetDomain::new(1..=9);
    for _ in 0..81 {
        csp.add_variable(domain.clone());
    }
    let mut add_group = |vars: Vec<VarId>| {
        for i in 0..vars.len() {
            for j in (i + 1)..vars.len() {
                csp.add_not_equal(vars[i], vars[j]);
            }
        }
    };
    for r in 0..9u32 {
        add_group((0..9).map(|c| r * 9 + c).collect());
    }
    for c in 0..9u32 {
        add_group((0..9).map(|r| r * 9 + c).collect());
    }
    for bi in 0..3u32 {
        for bj in 0..3u32 {
            add_group(
                (0..3)
                    .flat_map(|di| (0..3).map(move |dj| (bi * 3 + di) * 9 + (bj * 3 + dj)))
                    .collect(),
            );
        }
    }
    let construct = t.elapsed();

    // Phase 2: Finalize (build adjacency)
    let t = Instant::now();
    csp.finalize();
    let finalize = t.elapsed();

    // Phase 3 + 4: Solve with given (includes initial prop + search)
    let given: Vec<(VarId, u32)> = grid
        .iter()
        .enumerate()
        .filter(|(_, v)| **v != 0)
        .map(|(i, v)| (i as VarId, *v))
        .collect();

    let t = Instant::now();
    let _solutions = csp.solve_with_given(config, &given);
    let solve_total = t.elapsed();

    let total = total_start.elapsed();
    let stats = csp.stats();

    PhaseTimings {
        construct,
        finalize,
        initial_prop: Duration::ZERO, // lumped into search for now
        search: solve_total,
        total,
        backtracks: stats.backtracks,
        propagations: stats.propagations,
    }
}

fn main() {
    #[rustfmt::skip]
    let puzzles: &[(&str, [u32; 81])] = &[
        ("Al Escargot", [
            1,0,0,0,0,7,0,9,0, 0,3,0,0,2,0,0,0,8, 0,0,9,6,0,0,5,0,0,
            0,0,5,3,0,0,9,0,0, 0,1,0,0,8,0,0,0,2, 6,0,0,0,0,4,0,0,0,
            3,0,0,0,0,0,0,1,0, 0,4,0,0,0,0,0,0,7, 0,0,7,0,0,0,3,0,0,
        ]),
        ("Platinum Blonde", [
            0,0,0,0,0,0,0,1,2, 0,0,0,0,3,5,0,0,0, 0,0,0,6,0,0,0,7,0,
            7,0,0,0,0,0,3,0,0, 0,0,0,0,0,0,0,0,0, 0,0,1,0,0,0,0,0,8,
            0,4,0,0,0,2,0,0,0, 0,0,0,1,8,0,0,0,0, 2,5,0,0,0,0,0,0,0,
        ]),
        ("Golden Nugget", [
            0,0,0,0,0,0,0,3,9, 0,0,0,0,0,1,0,0,5, 0,0,3,0,5,0,8,0,0,
            0,0,8,0,9,0,0,0,6, 0,7,0,0,0,2,0,0,0, 1,0,0,4,0,0,0,0,0,
            0,0,9,0,8,0,0,5,0, 0,2,0,0,0,0,6,0,0, 4,0,0,7,0,0,0,0,0,
        ]),
        ("Inkala 2010", [
            0,0,5,3,0,0,0,0,0, 8,0,0,0,0,0,0,2,0, 0,7,0,0,1,0,5,0,0,
            4,0,0,0,0,5,3,0,0, 0,1,0,0,7,0,0,0,6, 0,0,3,2,0,0,0,8,0,
            0,6,0,5,0,0,0,0,9, 0,0,4,0,0,0,0,3,0, 0,0,0,0,0,9,7,0,0,
        ]),
        ("17-clue minimal", [
            0,0,0,0,0,0,0,1,0, 4,0,0,0,0,0,0,0,0, 0,2,0,0,0,0,0,0,0,
            0,0,0,0,5,0,4,0,7, 0,0,8,0,0,0,3,0,0, 0,0,1,0,9,0,0,0,0,
            3,0,0,4,0,0,2,0,0, 0,5,0,1,0,0,0,0,0, 0,0,0,8,0,6,0,0,0,
        ]),
    ];

    let configs: &[(&str, SolveConfig)] = &[
        (
            "AC3+DomWdeg",
            SolveConfig {
                pruning: Pruning::Ac3,
                ordering: Ordering::DomWdeg,
                max_solutions: 1,
                backjumping: false,
                ..Default::default()
            },
        ),
        (
            "AC3+FailFirst",
            SolveConfig {
                pruning: Pruning::Ac3,
                ordering: Ordering::FailFirst,
                max_solutions: 1,
                backjumping: false,
                ..Default::default()
            },
        ),
        (
            "FC+FailFirst",
            SolveConfig {
                pruning: Pruning::ForwardChecking,
                ordering: Ordering::FailFirst,
                max_solutions: 1,
                backjumping: false,
                ..Default::default()
            },
        ),
    ];

    // Warm up
    for (_, grid) in puzzles {
        for (_, cfg) in configs {
            std::hint::black_box(solve_timed(grid, cfg));
        }
    }

    // Measure (average of N runs)
    let n = 100;
    println!(
        "{:20} {:16} | {:>8} {:>8} {:>8} | {:>6} {:>6} | {:>8}",
        "puzzle", "config", "constr", "finalize", "solve", "bt", "prop", "total"
    );
    println!("{}", "-".repeat(105));

    for (pname, grid) in puzzles {
        for (cname, cfg) in configs {
            let mut totals = PhaseTimings {
                construct: Duration::ZERO,
                finalize: Duration::ZERO,
                initial_prop: Duration::ZERO,
                search: Duration::ZERO,
                total: Duration::ZERO,
                backtracks: 0,
                propagations: 0,
            };
            for _ in 0..n {
                let t = solve_timed(grid, cfg);
                totals.construct += t.construct;
                totals.finalize += t.finalize;
                totals.search += t.search;
                totals.total += t.total;
                totals.backtracks += t.backtracks;
                totals.propagations += t.propagations;
            }
            let d = |dur: Duration| -> f64 { dur.as_secs_f64() / n as f64 * 1000.0 };
            println!(
                "{:20} {:16} | {:7.3}ms {:7.3}ms {:7.3}ms | {:>6} {:>6} | {:7.3}ms",
                pname,
                cname,
                d(totals.construct),
                d(totals.finalize),
                d(totals.search),
                totals.backtracks / n as u64,
                totals.propagations / n as u64,
                d(totals.total)
            );
        }
    }
}
