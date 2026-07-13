//! T4-W6 GEN-1 — the generation-truth probe, promoted from the r2 throwaway
//! (`r2-generation-truth.md` §Rerunnable probes) to a standing CI gate.
//!
//! Grades the embedded Sudoku bank by `measure_difficulty` — the codebase's OWN
//! difficulty proxy (`ForwardChecking` + `FailFirst` backtrack count, the metric
//! the bake-time grader and the debug band assertion consult) — under a node
//! budget, and asserts the tier *labels* order honestly:
//!
//!   1. no inversion — across the tiers a size actually banks, both the median
//!      and the max budgeted-backtrack counts are non-decreasing easy→medium→hard
//!      (a "Hard" board can never be search-cheaper than "Medium");
//!   2. clue-count honesty — the median givens count is non-increasing
//!      easy→medium→hard for every banked tier (fewer clues as the label rises).
//!
//! `measure_difficulty` is deterministic (no RNG; `FailFirst` is a fixed order),
//! and the random symmetry transform a deal applies preserves the backtrack
//! count (`r2-generation-truth.md` GEN-1), so grading each embedded template ONCE
//! is exactly grading every deal that template can produce. A tier with no
//! embedded bank (9×9 easy/medium, all 4×4 — live-generated in the worker) is
//! skipped here: those are clue-count tiers whose live search grade is W7's
//! (disposition (b) — the FC proxy is bimodal at these sizes, 0 or millions of
//! backtracks with nothing between, so it cannot separate two propagation-solvable
//! tiers; see the wave record).
//!
//! ## Born RED at the wave base SHA
//!
//! The embedded 16×16 Hard bank was STALE — 102-107 givens, **0 backtracks every
//! board** — while Medium ran to millions: Hard measured strictly EASIER than
//! Medium (the max assertion fired). Cured by regenerating the 16×16 Hard bank
//! (disposition (a)): the current generator deals genuinely search-hard 90-97-given
//! boards that saturate the FC search on every deal.
//!
//! Release example (a search-hard 16×16 board runs `measure_difficulty` to ~1.5M
//! backtracks; the node budget bounds each grade to a second or two). Wired into
//! the CI `rust` lane beside `gac_ab_corpus`.

use csp_solver::ordering::Ordering;
use csp_solver::sudoku::{Difficulty, create_sudoku_csp, embedded_templates};
use csp_solver::{Pruning, SolveConfig};

/// Node budget for a single grade. A search-hard board exhausts it (`saturated`);
/// a propagation-solvable board finishes at 0 backtracks. The cap bounds CI cost
/// AND makes the difficulty comparison cutoff-stable: `node_budget` limits *nodes*
/// while `backtracks` is a distinct counter that keeps climbing to the cutoff, so
/// two saturating boards report different raw backtrack tallies. Grading each
/// board as `min(backtracks, GRADE_BUDGET)` collapses every saturating board to a
/// single ceiling value, so "Hard's max ≥ Medium's max" is well-defined (both
/// saturating ⇒ both == the ceiling) instead of turning on which runaway search
/// happened to accrue more backtracks before the same node cutoff.
const GRADE_BUDGET: u64 = 300_000;

fn givens(board: &[u32]) -> usize {
    board.iter().filter(|&&v| v != 0).count()
}

/// The crate's `measure_difficulty` config (FC + FailFirst, first solution) under
/// a node budget — the crate fn is unbudgeted and a search-hard board runs to
/// millions. Returns the difficulty (backtracks, capped at the budget ceiling)
/// and whether the search saturated the budget (the "deep search" signal).
fn grade(board: &[u32], n: u32) -> (u64, bool) {
    let (mut csp, given) = create_sudoku_csp(board, n);
    let config = SolveConfig {
        pruning: Pruning::ForwardChecking,
        ordering: Ordering::FailFirst,
        max_solutions: 1,
        node_budget: Some(GRADE_BUDGET),
        ..Default::default()
    };
    csp.solve_with_given(&config, &given);
    let saturated = csp.stats().budget_exceeded;
    (csp.stats().backtracks.min(GRADE_BUDGET), saturated)
}

fn median(sorted: &[u64]) -> u64 {
    if sorted.is_empty() {
        0
    } else {
        sorted[sorted.len() / 2]
    }
}

struct TierGrade {
    diff: Difficulty,
    name: &'static str,
    count: usize,
    median_bt: u64,
    max_bt: u64,
    median_givens: usize,
    saturate_frac: f64,
}

fn grade_tier(n: u32, diff: Difficulty, name: &'static str) -> Option<TierGrade> {
    let boards = embedded_templates(n, diff);
    if boards.is_empty() {
        return None;
    }
    let graded: Vec<(u64, bool)> = boards.iter().map(|b| grade(b, n)).collect();
    let saturators = graded.iter().filter(|&&(_, sat)| sat).count();
    let mut bts: Vec<u64> = graded.iter().map(|&(bt, _)| bt).collect();
    let mut gvs: Vec<usize> = boards.iter().map(|b| givens(b)).collect();
    let count = boards.len();
    bts.sort_unstable();
    gvs.sort_unstable();
    Some(TierGrade {
        diff,
        name,
        count,
        median_bt: median(&bts),
        max_bt: *bts.iter().max().unwrap(),
        median_givens: gvs[gvs.len() / 2],
        saturate_frac: saturators as f64 / count as f64,
    })
}

fn main() {
    let tiers = [
        (Difficulty::Easy, "easy"),
        (Difficulty::Medium, "medium"),
        (Difficulty::Hard, "hard"),
    ];
    let mut violations: Vec<String> = vec![];

    println!("=== GEN-1 generation-truth probe (measure_difficulty, budget {GRADE_BUDGET}) ===");
    for n in [2u32, 3, 4] {
        let graded: Vec<TierGrade> = tiers
            .iter()
            .filter_map(|&(d, name)| grade_tier(n, d, name))
            .collect();
        if graded.is_empty() {
            println!("N={n}: no embedded bank (all tiers live-generated) — skipped");
            continue;
        }
        println!("N={n} ({}×{}):", n * n, n * n);
        for g in &graded {
            println!(
                "  {:<6} {:>2} boards  givens~{:>3}  bt(cap {GRADE_BUDGET}) median {:>6} max {:>6}  deep-search {:>3.0}%",
                g.name,
                g.count,
                g.median_givens,
                g.median_bt,
                g.max_bt,
                g.saturate_frac * 100.0,
            );
        }

        // Monotone across the tiers this size actually banks (in easy→hard order).
        for pair in graded.windows(2) {
            let (lo, hi) = (&pair[0], &pair[1]);
            // (1) no search inversion — the higher label is never search-cheaper,
            // by the crate's own FC proxy (median AND max capped backtracks).
            if hi.median_bt < lo.median_bt {
                violations.push(format!(
                    "N={n}: {} median backtracks {} < {} median {} (search inversion)",
                    hi.name, hi.median_bt, lo.name, lo.median_bt
                ));
            }
            if hi.max_bt < lo.max_bt {
                violations.push(format!(
                    "N={n}: {} max backtracks {} < {} max {} (search inversion)",
                    hi.name, hi.max_bt, lo.name, lo.max_bt
                ));
            }
            // (2) the deep-search fraction is non-decreasing — a higher label
            // requires deep search on at least as many deals (the robust signal:
            // a boolean per board, immune to the cutoff-tally jitter above).
            if hi.saturate_frac + 1e-9 < lo.saturate_frac {
                violations.push(format!(
                    "N={n}: {} deep-search {:.0}% < {} {:.0}% (difficulty inversion)",
                    hi.name,
                    hi.saturate_frac * 100.0,
                    lo.name,
                    lo.saturate_frac * 100.0
                ));
            }
            // (3) clue-count honesty — the higher label carries no more clues.
            if hi.median_givens > lo.median_givens {
                violations.push(format!(
                    "N={n}: {} median givens {} > {} median {} (clue-count inversion)",
                    hi.name, hi.median_givens, lo.name, lo.median_givens
                ));
            }
        }

        // 16×16 is the size that banks all three tiers and carried the defect:
        // its Hard must actually require deep search on a MAJORITY of deals (the
        // born-RED symptom was Hard=0% deep-search while Medium searched — a Hard
        // bank that is trivially FC-solvable is the stale-bank inversion).
        if n == 4
            && let Some(hard) = graded.iter().find(|g| g.diff == Difficulty::Hard)
            && hard.saturate_frac < 0.5
        {
            violations.push(format!(
                "N=4: Hard requires deep search on only {:.0}% of deals (< 50% majority) \
                 — a Hard tier that rarely searches is the stale-bank inversion",
                hard.saturate_frac * 100.0
            ));
        }
    }

    if violations.is_empty() {
        println!("\nVERDICT: PASS — every banked tier orders honestly (no inversion)");
    } else {
        eprintln!("\nVERDICT: FAIL — {} label inversion(s):", violations.len());
        for v in &violations {
            eprintln!("  - {v}");
        }
        std::process::exit(1);
    }
}
