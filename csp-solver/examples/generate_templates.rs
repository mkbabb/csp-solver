//! Puzzle-template generator — the one-command pipeline that regenerates the
//! crate-owned template bank at `csp-solver/data/sudoku_puzzles/`.
//!
//! Replaces a dead Python generator (which imported `csp_solver.solver.sudoku`,
//! a module deleted at `08c339b`, and wrote to a stale `src/csp_solver/data`
//! path — doubly broken, cannot execute).
//!
//! Calls the *existing* Rust generation logic directly
//! (`csp_solver::sudoku::{generate_board, solve_sudoku, measure_difficulty}`) —
//! zero cross-language re-derivation, one source of truth for the
//! uniqueness + difficulty algorithm, because it *is* the solver being
//! validated against.
//!
//! Usage:
//!   cargo run --release --example generate_templates -- <N> <difficulty> <count> [out_dir]
//!
//!   N          sub-grid size (2, 3, 4 -> 4x4, 9x9, 16x16). N=5 (25x25) is
//!              REFUSED: the locked N=5 policy (`generate.rs`
//!              `embedded_template_count`) rejects that tier at the API, so a
//!              bank generated for it could never be read back. T3 §1 booked
//!              this arg-range refusal as a FOLD-DO on the file's next touch
//!              (chronic CH-29); this is that touch.
//!   difficulty easy | medium | hard
//!   count      number of templates to generate
//!   out_dir    output root (default: csp-solver/data/sudoku_puzzles); writes to
//!              <out_dir>/<N>/<difficulty>/template-{i}.json
//!
//! Because the bank is embedded into the library via `include_dir!`
//! (`puzzles/sudoku/generate.rs`), a full regeneration is:
//!   1. cargo run --release --example generate_templates -- <N> <difficulty> <count>
//!   2. rebuild the wheel (`maturin develop --release --features py`) to re-embed.
//!
//! Output schema (sparse, puzzle-only, compact — re-parsed by
//! `generate.rs::parse_puzzle_field`, which reads only the `puzzle` object):
//!   {"puzzle":{"<pos>":<digit>,...}}
//!   (puzzle carries only the non-zero/given cells; no whitespace.)
//!
//! The full solution and the `measure_difficulty` backtrack count are still
//! computed each iteration — the re-solve *is* the uniqueness/solvability
//! verification, and both are logged to stderr — but neither is serialized:
//! `parse_puzzle_field` never read them, so they were pure embed dead-weight
//! (~128 KiB across the bank). Dropping them plus sparsifying the puzzle and
//! stripping pretty-print whitespace takes the embed from 298,006 B to
//! 81,963 B (−72.5%).
//!
//! Each template logs its generation / verify-solve / difficulty-measurement
//! timing to stderr, so a single run doubles as an ad-hoc timing harness.
//! `SKIP_MEASURE=1` skips the (expensive) `measure_difficulty` step for
//! diagnostic runs, recording `backtracks: 0`.

use csp_solver::ordering::Ordering;
use csp_solver::sudoku::{Difficulty, generate_board, measure_difficulty, solve_sudoku};
use csp_solver::{Pruning, SolveConfig};
use std::env;
use std::fs;
use std::path::PathBuf;
use std::time::Instant;

fn parse_difficulty(s: &str) -> (Difficulty, &'static str) {
    match s.to_lowercase().as_str() {
        "easy" => (Difficulty::Easy, "easy"),
        "medium" => (Difficulty::Medium, "medium"),
        "hard" => (Difficulty::Hard, "hard"),
        other => panic!("unknown difficulty {other:?} (expected easy|medium|hard)"),
    }
}

/// Hand-rolled JSON object writer for a sparse (given-cells-only) board. No
/// `serde` dependency — keys are plain integer strings, values plain integers,
/// so there is nothing to escape.
fn sparse_json(board: &[u32]) -> String {
    let entries: Vec<String> = board
        .iter()
        .enumerate()
        .filter(|&(_, &v)| v != 0)
        .map(|(i, v)| format!("\"{i}\":{v}"))
        .collect();
    format!("{{{}}}", entries.join(","))
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 4 {
        eprintln!("usage: generate_templates <N> <difficulty> <count> [out_dir]");
        std::process::exit(2);
    }

    let n: u32 = args[1].parse().expect("N must be an integer (2, 3, or 4)");
    // The locked N=5 policy (CH-29, T3 §1): N=5 is rejected at the library API
    // — `embedded_template_count` refuses a tier with no embedded bank rather
    // than falling through to unbounded hole-digging (the old N=5 DoS surface).
    // Generating a bank this crate will never load is a silent no-op, so the
    // range is refused here, loudly, at the argument.
    if !(2..=4).contains(&n) {
        eprintln!(
            "generate_templates: N={n} is out of range — the shipped tiers are N=2,3,4. \
             N=5 (25x25) is refused by the locked N=5 policy: the library rejects that \
             tier at the API, so a bank generated for it could never be read back."
        );
        std::process::exit(2);
    }
    let (difficulty, diff_name) = parse_difficulty(&args[2]);
    let count: usize = args[3]
        .parse()
        .expect("count must be a non-negative integer");
    let out_root = args
        .get(4)
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from("csp-solver/data/sudoku_puzzles"));

    let out_dir = out_root.join(n.to_string()).join(diff_name);
    fs::create_dir_all(&out_dir).expect("failed to create output directory");

    // Verification re-solve (recover the unique solution): strongest available
    // config, kept cheap. `measure_difficulty` (below) is the canonical
    // difficulty signal and hardcodes its own FC+FailFirst config internally.
    let verify_config = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::Mrv,
        max_solutions: 1,
        ..Default::default()
    };

    let m = n * n;
    eprintln!(
        "generate_templates: N={n} ({m}x{m}) difficulty={diff_name} count={count} -> {}",
        out_dir.display()
    );

    let overall_start = Instant::now();
    let mut written = 0usize;

    for i in 0..count {
        let gen_start = Instant::now();
        let puzzle = generate_board(n, difficulty);
        let gen_elapsed = gen_start.elapsed();

        let solve_start = Instant::now();
        let solution = match solve_sudoku(&puzzle, n, &verify_config) {
            Some(s) => s,
            None => {
                eprintln!(
                    "  [{}/{count}] FAILED: generated puzzle did not re-solve (should be \
                     unreachable — uniqueness was checked during hole-digging)",
                    i + 1
                );
                continue;
            }
        };
        let solve_elapsed = solve_start.elapsed();

        // SKIP_MEASURE=1 isolates hole-digging cost from measure_difficulty cost
        // for diagnostic timing runs (measure_difficulty is a full FC+FailFirst
        // search — the dominant cost on near-minimal-clue "hard" boards).
        let measure_start = Instant::now();
        let backtracks = if env::var("SKIP_MEASURE").is_ok() {
            0
        } else {
            measure_difficulty(&puzzle, n)
        };
        let measure_elapsed = measure_start.elapsed();

        // Sparse, puzzle-only, compact: the solution and backtracks are computed
        // (the re-solve above is the solvability/uniqueness gate) and logged
        // below, but never serialized — `parse_puzzle_field` reads only `puzzle`.
        let json = format!("{{\"puzzle\":{}}}", sparse_json(&puzzle));
        let path = out_dir.join(format!("template-{i}.json"));
        fs::write(&path, json).expect("failed to write template JSON");
        written += 1;

        eprintln!(
            "  [{}/{count}] gen={:>9.1}ms verify_solve={:>7.1}ms measure_difficulty={:>9.1}ms \
             backtracks={backtracks:>8} solution_cells={} -> {}",
            i + 1,
            gen_elapsed.as_secs_f64() * 1000.0,
            solve_elapsed.as_secs_f64() * 1000.0,
            measure_elapsed.as_secs_f64() * 1000.0,
            solution.len(),
            path.display()
        );
    }

    eprintln!(
        "generate_templates: wrote {written}/{count} template(s) in {:.2}s",
        overall_start.elapsed().as_secs_f64()
    );
}
