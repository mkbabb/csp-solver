//! Futoshiki generate + solve — the first criterion perf guard for a shipped
//! game's second puzzle type (T3-W6 ROW-3b / A24 G13 bench-half).
//!
//! Before this, Futoshiki (N=4–7, in production since T2) had ZERO criterion
//! coverage at any size — a solve-path or generator regression was invisible to
//! the perf suite. Two groups over N=5 and N=7 (the mid and near-top shipped
//! sizes):
//!
//! * `futoshiki_generate` — the seeded, uniqueness-checked hole-dig pipeline
//!   (`generate_futoshiki_seeded`), the cost the game pays to hand a player a
//!   board.
//! * `futoshiki_solve` — first-solution solve of that generated board under the
//!   EXACT production config (`Ac3` + `Mrv`, the `solve_futoshiki` / F1 override):
//!   the shipped default (`ForwardChecking` + `FailFirst`) cannot crack an empty
//!   N≥6 board in the 1M-node budget, so the perf guard tracks the config the
//!   engine actually runs.
//!
//! Seeds are fixed so the boards — and thus the node counts underneath the wall
//! time — are identical every run; the wall figure is the load-sensitive number,
//! the shape is the guard.

use criterion::{BenchmarkId, Criterion, criterion_group, criterion_main};
use csp_solver::ordering::Ordering;
use csp_solver::puzzles::futoshiki::{
    FutoshikiPuzzle, create_futoshiki_csp, generate_futoshiki_seeded,
};
use csp_solver::{Pruning, SolveConfig};

/// Deterministic seed per size — same board on every run, native and wasm.
fn seed_for(n: u32) -> u64 {
    0xF0_75_00 + n as u64
}

/// Build a production `FutoshikiPuzzle` from a seeded generated board.
fn generate_puzzle(n: u32) -> FutoshikiPuzzle {
    let (board, inequalities) = generate_futoshiki_seeded(n, seed_for(n));
    let fixed: Vec<(usize, u32)> = board
        .iter()
        .enumerate()
        .filter(|&(_, &v)| v != 0)
        .map(|(i, &v)| (i, v))
        .collect();
    FutoshikiPuzzle::from_parts(n, fixed, inequalities)
        .expect("seeded generator must emit a valid puzzle")
}

fn bench_generate(c: &mut Criterion) {
    let mut group = c.benchmark_group("futoshiki_generate");
    group.sample_size(20);
    for &n in &[5u32, 7] {
        group.bench_function(BenchmarkId::from_parameter(n), |b| {
            b.iter(|| generate_futoshiki_seeded(n, seed_for(n)));
        });
    }
    group.finish();
}

fn bench_solve(c: &mut Criterion) {
    let mut group = c.benchmark_group("futoshiki_solve");
    group.sample_size(20);
    for &n in &[5u32, 7] {
        let puzzle = generate_puzzle(n);
        group.bench_function(BenchmarkId::from_parameter(n), |b| {
            b.iter(|| {
                let mut csp = create_futoshiki_csp(&puzzle);
                let config = SolveConfig {
                    pruning: Pruning::Ac3,
                    ordering: Ordering::Mrv,
                    max_solutions: 1,
                    ..Default::default()
                };
                let solutions = csp.solve(&config);
                assert!(!solutions.is_empty(), "N={n}: generated board must solve");
                solutions
            });
        });
    }
    group.finish();
}

criterion_group!(benches, bench_generate, bench_solve);
criterion_main!(benches);
