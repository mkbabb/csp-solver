//! G1/G2 probe — real Futoshiki generation cost + difficulty calibration.
//!
//! Extends the Pass-3 single-trial probe (`pass3/futoshiki-gen-probe-output.txt`)
//! with the multi-trial discipline `rust-owned-puzzle-data.md` §3.2 established:
//!
//! - **G1** (generation cost): full pipeline — seed a Latin square, place an
//!   *adjacency-valid* inequality set, uniqueness-checked hole-dig — timed over
//!   several trials across 3 keep-densities × N∈{5..8}. Every internal solve is
//!   capped at the crate's default 1M-node budget, so a cell that crosses the
//!   phase-transition cliff shows up as a large wall-clock, not a hang.
//! - **G2** (difficulty rating): `measure_difficulty` (naive FC+FailFirst
//!   backtrack count) across generated boards, per N and density — the raw
//!   material for any future difficulty band. v1 ships no tiers regardless.
//!
//! Run: `cargo run --release --example probe_futoshiki_gen -p csp-solver`.

use std::time::Instant;

use csp_solver::puzzles::futoshiki::{generate_futoshiki_tuned_seeded, measure_difficulty};

/// Trials per (N, density) cell — ≥5 per the multi-trial gate.
const TRIALS: u64 = 7;
/// Wall-clock guard per cell: once exceeded (and ≥1 trial is in), stop adding
/// trials. Keeps the pathological low-density/high-N cells from dominating.
const CELL_BUDGET_SECS: f64 = 12.0;

fn median(mut xs: Vec<f64>) -> f64 {
    if xs.is_empty() {
        return f64::NAN;
    }
    xs.sort_by(|a, b| a.partial_cmp(b).unwrap());
    let mid = xs.len() / 2;
    if xs.len().is_multiple_of(2) {
        (xs[mid - 1] + xs[mid]) / 2.0
    } else {
        xs[mid]
    }
}

fn seed_for(tag: u64, n: u32, density: f64, i: u64) -> u64 {
    let d = (density * 1000.0) as u64;
    tag ^ (u64::from(n) << 40) ^ (d << 20) ^ i.wrapping_mul(0x9E37_79B9_7F4A_7C15)
}

fn main() {
    println!(
        "=== G1: generation wall-clock — up to {TRIALS} trials/cell, adjacency-valid carets ==="
    );
    println!("(inequality_count = n; every internal solve capped at the 1M-node budget)");
    println!(
        "(cell aborts trials past {CELL_BUDGET_SECS:.0}s cumulative — reported as trials<{TRIALS})"
    );
    println!();

    let densities = [0.75_f64, 0.60, 0.50];
    for n in 5u32..=8 {
        let ineq = n as usize;
        for &d in &densities {
            // N=8 below 60% keep crosses the measured cliff (single solves ~5s);
            // skip it rather than let one trial run for minutes.
            if n >= 8 && d < 0.60 {
                println!(
                    "n={n} keep={d:.2} ineq={ineq:2}  SKIPPED (past the N=8 cliff — see §2 of the seed probe)"
                );
                continue;
            }

            let mut times = Vec::new();
            let cell_start = Instant::now();
            for t in 0..TRIALS {
                if !times.is_empty() && cell_start.elapsed().as_secs_f64() > CELL_BUDGET_SECS {
                    break;
                }
                let seed = seed_for(0xA53F_0000, n, d, t);
                let start = Instant::now();
                let (_board, _ineqs) = generate_futoshiki_tuned_seeded(n, d, ineq, seed);
                times.push(start.elapsed().as_secs_f64() * 1000.0);
            }

            let med = median(times.clone());
            let mean = times.iter().sum::<f64>() / times.len() as f64;
            let max = times.iter().cloned().fold(0.0, f64::max);
            let flag = if n == 7 && (d - 0.75).abs() < 1e-9 && med > 50.0 {
                "  <<< FLAG: N=7@75% median > 50ms — revisit shipped-size decision"
            } else {
                ""
            };
            println!(
                "n={n} keep={d:.2} ineq={ineq:2}  trials={:2}  median={med:8.2}ms  mean={mean:8.2}ms  max={max:9.2}ms{flag}",
                times.len()
            );
        }
    }

    println!();
    println!("=== G2: difficulty calibration — backtracks under naive FC+FailFirst ===");
    println!(
        "(the same recipe Sudoku's measure_difficulty uses; higher = harder for a non-AC solver)"
    );
    println!();

    let boards_per: u64 = 10;
    for &d in &[0.75_f64, 0.60] {
        for n in 5u32..=7 {
            let ineq = n as usize;
            let mut bts = Vec::new();
            for i in 0..boards_per {
                let seed = seed_for(0xB2C0_0000, n, d, i);
                let (board, ineqs) = generate_futoshiki_tuned_seeded(n, d, ineq, seed);
                bts.push(measure_difficulty(&board, n, &ineqs) as f64);
            }
            let med = median(bts.clone());
            let min = bts.iter().cloned().fold(f64::MAX, f64::min);
            let max = bts.iter().cloned().fold(0.0, f64::max);
            let mean = bts.iter().sum::<f64>() / bts.len() as f64;
            println!(
                "n={n} keep={d:.2} ineq={ineq}  backtracks over {boards_per} boards: \
                 min={min:.0} median={med:.0} mean={mean:.1} max={max:.0}"
            );
        }
    }
}
