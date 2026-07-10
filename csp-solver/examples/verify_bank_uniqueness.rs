//! P1 uniqueness/correctness sweep — the verify-11 harness, Rust-native.
//!
//! Drives the *embedded* bank (`embedded_templates` → `parse_puzzle_field`) so
//! it exercises the compile-time `include_dir!` embed of the reshaped
//! sparse+puzzle-only files directly — the exact path the wheel/cdylib ships.
//! For every embedded board it re-solves with `max_solutions = 2` and asserts
//! exactly one solution (uniqueness + solvability). A non-unique, unsat, or
//! budget-truncated board is a hard failure. Exit code is nonzero on any defect.

use std::time::Instant;

use csp_solver::ordering::Ordering;
use csp_solver::sudoku::{
    Difficulty, create_sudoku_csp, embedded_template_count, embedded_templates,
};
use csp_solver::{Pruning, SolveConfig};

fn main() {
    let sizes = [2u32, 3, 4, 5];
    let diffs = [
        (Difficulty::Easy, "easy"),
        (Difficulty::Medium, "medium"),
        (Difficulty::Hard, "hard"),
    ];

    let mut total = 0usize;
    let mut unique = 0usize;
    let mut non_unique = 0usize;
    let mut unsat = 0usize;
    let mut truncated = 0usize;
    let mut global_max_bt = 0u64;

    let start = Instant::now();
    for n in sizes {
        for (diff, dname) in diffs {
            let boards = embedded_templates(n, diff);
            let count = embedded_template_count(n, diff);
            assert_eq!(
                boards.len(),
                count,
                "parsed count != directory count for N={n} {dname}"
            );
            if boards.is_empty() {
                continue;
            }
            let m = (n * n) as usize;
            let mut bucket_bt = 0u64;
            let mut bucket_ok = 0usize;
            for (bi, board) in boards.iter().enumerate() {
                assert_eq!(
                    board.len(),
                    m * m,
                    "N={n} {dname} template-{bi}: parsed {} cells, expected {}",
                    board.len(),
                    m * m
                );
                let (mut csp, given) = create_sudoku_csp(board, n);
                let config = SolveConfig {
                    pruning: Pruning::Ac3,
                    ordering: Ordering::Mrv,
                    max_solutions: 2,
                    node_budget: Some(50_000_000),
                    ..Default::default()
                };
                let solutions = csp.solve_with_given(&config, &given);
                bucket_bt = bucket_bt.max(csp.stats().backtracks);
                global_max_bt = global_max_bt.max(csp.stats().backtracks);
                total += 1;
                match solutions.len() {
                    0 => {
                        unsat += 1;
                        eprintln!("  DEFECT N={n} {dname} template-{bi}: UNSAT (0 solutions)");
                    }
                    1 => {
                        unique += 1;
                        bucket_ok += 1;
                    }
                    k => {
                        non_unique += 1;
                        eprintln!(
                            "  DEFECT N={n} {dname} template-{bi}: NON-UNIQUE ({k} solutions)"
                        );
                    }
                }
                if csp.stats().budget_exceeded {
                    truncated += 1;
                    eprintln!(
                        "  WARN N={n} {dname} template-{bi}: budget_exceeded — uniqueness unsafe"
                    );
                }
            }
            println!(
                "  N={n} {dname:<6} {:2} boards  unique={}/{}  max_bt={}",
                boards.len(),
                bucket_ok,
                boards.len(),
                bucket_bt
            );
        }
    }

    let elapsed = start.elapsed();
    println!("\n=== SWEEP SUMMARY ===");
    println!("total boards  : {total}");
    println!("unique        : {unique}");
    println!("non_unique    : {non_unique}");
    println!("unsat         : {unsat}");
    println!("budget_trunc  : {truncated}");
    println!("max_backtracks: {global_max_bt}");
    println!("elapsed       : {:.3}s", elapsed.as_secs_f64());

    let ok = non_unique == 0 && unsat == 0 && truncated == 0 && unique == total && total > 0;
    println!(
        "VERDICT: {}",
        if ok {
            "PASS — all boards unique & solvable"
        } else {
            "FAIL"
        }
    );
    if !ok {
        std::process::exit(1);
    }
}
