// iai-callgrind instruction-count baseline (ONE bench).
//
// arm64-macOS cannot run Valgrind, so callgrind instruction counts can only be
// derived in CI on Linux. This bench measures a single, fully-deterministic CSP
// solve (8-queens, first solution, AC-3 + FailFirst) under callgrind. Instruction
// counts are a function of the compiled binary alone — identical binary => identical
// count => 0% run-to-run delta, which is exactly the determinism P6 proved
// (1,585,722 instructions across 3 ephemeral runners, 0.000000% delta).
//
// harness = false; the iai-callgrind `main!` macro forwards to the
// `iai-callgrind-runner` binary (installed in CI via `cargo install`). Locally on
// arm64-macOS the target compiles but the runner is absent — `cargo check
// --benches` / `cargo build --bench iai_queens` succeed; running it needs Linux +
// Valgrind, which is why this lives in a CI-only lane.

use std::hint::black_box;

use csp_solver::constraint::LambdaConstraint;
use csp_solver::domain::bitset::BitsetDomain;
use csp_solver::ordering::Ordering;
use csp_solver::{Csp, Pruning, SolveConfig};

use iai_callgrind::{library_benchmark, library_benchmark_group, main};

fn build_queens(n: u32) -> Csp<BitsetDomain> {
    let mut csp = Csp::new();
    let domain = BitsetDomain::range(n);
    let vars = csp.add_variables(&domain, n as usize);
    csp.add_all_different(vars.clone());
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

fn solve_queens_first(n: u32) -> usize {
    let mut csp = build_queens(n);
    let config = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::FailFirst,
        max_solutions: 1,
        ..Default::default()
    };
    let solutions = csp.solve(&config);
    assert!(!solutions.is_empty());
    solutions.len()
}

#[library_benchmark]
fn queens_first_8() -> usize {
    black_box(solve_queens_first(black_box(8)))
}

library_benchmark_group!(name = queens; benchmarks = queens_first_8);
main!(library_benchmark_groups = queens);
