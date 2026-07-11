//! GAC-in-AllDifferent on/off A/B — the CI-visible per-call-cost guard (T3-W6
//! ROW-3a).
//!
//! The 13.79× corpus headline and the disclosed named-hard minority cost lived
//! only in `examples/gac_timing_probe.rs`, run by hand — CI never invoked it, so
//! a regression in GAC's per-propagation constant (or a ROW-1 CSR/Vec-cache win)
//! was invisible to the criterion suite. This group toggles
//! `GAC_IN_ALLDIFF_ENABLED` across a small fixed set so the delta is a first-class
//! benchmark:
//!
//! * `al_escargot` (named-hard 9×9, n=3) — the minority-cost board: GAC ON is
//!   ~1.7–3.1× SLOWER here (its on-node count is already tiny, so GAC's fixed
//!   graph-rebuild has nothing to amortise). This side guards against the
//!   constant *widening*.
//! * `n4_medium` (a 16×16 template winner, n=4) — the majority case: GAC ON is
//!   ~27× FASTER (17× fewer nodes). This side guards against the win *eroding*.
//!
//! Both use the EXACT production config (`Ac3` + `Mrv`). NODE COUNTS are the
//! oracle, not the wall ratio (load-sensitive, G6): the `gac_ab_corpus` smoke lane
//! asserts the 40,513→4,678 spine; this bench measures the constant the spine's
//! invariance frees to move only in µs.

use std::sync::atomic::Ordering as AtomicOrdering;

use criterion::{BenchmarkId, Criterion, criterion_group, criterion_main};
use csp_solver::ordering::Ordering;
use csp_solver::solver::gac::GAC_IN_ALLDIFF_ENABLED;
use csp_solver::sudoku::{Difficulty, create_sudoku_csp, embedded_templates};
use csp_solver::{Pruning, SolveConfig};

const AL_ESCARGOT: &str =
    "100007090030020008009600500005300900010080002600004000300000010040000007007000300";

fn digits(s: &str) -> Vec<u32> {
    s.chars().map(|c| c.to_digit(10).unwrap()).collect()
}

/// Solve one board (n = box size) under the production config with GAC in
/// AllDifferent forced to `gac_on`. Asserts a solution is found so `--test`
/// (the CI smoke mode) exercises the happy path.
fn solve_board(board: &[u32], n: u32, gac_on: bool) {
    GAC_IN_ALLDIFF_ENABLED.store(gac_on, AtomicOrdering::Relaxed);
    let (mut csp, given) = create_sudoku_csp(board, n);
    let config = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::Mrv,
        max_solutions: 1,
        ..Default::default()
    };
    let solutions = csp.solve_with_given(&config, &given);
    assert!(!solutions.is_empty(), "board must solve under Ac3+Mrv");
}

fn bench_gac_ab(c: &mut Criterion) {
    let al_escargot = digits(AL_ESCARGOT);
    let n4_medium = embedded_templates(4, Difficulty::Medium)
        .into_iter()
        .next()
        .expect("N4/medium template bank must be embedded");

    let cases: &[(&str, &[u32], u32)] = &[
        ("al_escargot", &al_escargot, 3),
        ("n4_medium", &n4_medium, 4),
    ];

    let mut group = c.benchmark_group("gac_ab");
    // 16×16 solves dominate; keep the sample count modest so the lane stays cheap.
    group.sample_size(20);

    for &(label, board, n) in cases {
        for (state, gac_on) in [("gac_on", true), ("gac_off", false)] {
            group.bench_function(BenchmarkId::new(label, state), |b| {
                b.iter(|| solve_board(board, n, gac_on));
            });
        }
    }

    group.finish();

    // Restore the default (ON) so nothing downstream in this process observes a
    // stray OFF — benches are their own binary, but leave the world as found.
    GAC_IN_ALLDIFF_ENABLED.store(true, AtomicOrdering::Relaxed);
}

criterion_group!(benches, bench_gac_ab);
criterion_main!(benches);
