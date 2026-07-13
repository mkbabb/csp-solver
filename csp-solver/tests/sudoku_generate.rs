//! Sudoku board-generation / template-bank tests — migrated from
//! `src/puzzles/sudoku/generate.rs`'s formerly-inline `#[cfg(test)] mod
//! tests` (owner constraint 3, tests live in `tests/` only).
//!
//! Every item exercised here (`generate_board`, `generate_board_with_templates`,
//! `embedded_templates`, `embedded_template_count`) is public, so the move is
//! a pure relocation — no `pub(crate)` whitebox re-export was needed. The
//! original module held 3 `#[test]` fns totaling 7 assertions (the R13
//! happy-path check, the R13 mismatch-panics check, and 5 assertions bundled
//! into `embedded_templates_present_and_absent`); this file decomposes that
//! bundle 1:1 into 5 independently named tests, for 7 tests total.
//! Zero-widening — same inputs, same assertions, no new coverage.

use csp_solver::ordering::Ordering;
use csp_solver::sudoku::{
    Difficulty, create_sudoku_csp, embedded_template_count, embedded_templates, generate_board,
    generate_board_seeded, generate_board_with_templates,
};
use csp_solver::{Pruning, SolveConfig};

/// Happy path: a template that genuinely matches its claimed difficulty must
/// not trip the debug consistency assertion (it is silent when the contract
/// holds).
#[test]
fn generate_with_templates_matching_difficulty_does_not_panic() {
    let easy = generate_board(3, Difficulty::Easy);
    let board = generate_board_with_templates(3, Difficulty::Easy, &[easy]);
    assert_eq!(board.len(), 81);
}

/// Mismatch: a trivially-easy board (0 backtracks) served under a `Hard`
/// claim (band `100..=MAX`) must fail the debug assertion loudly — the exact
/// "wrong directory" scenario R13 guards against. Uses an easy board so the
/// measurement is fast and the 0-backtracks result is stable.
///
/// R13 is a `debug_assert!`, compiled out in release — preserved identically
/// at the new home via the same `cfg_attr(not(debug_assertions), ignore)`
/// gate the inline test used.
#[test]
#[cfg_attr(
    not(debug_assertions),
    ignore = "R13 guard is a debug_assert; compiled out in release"
)]
#[should_panic(expected = "does not match its claimed difficulty")]
fn generate_with_templates_mismatched_difficulty_panics_in_debug() {
    let easy = generate_board(3, Difficulty::Easy);
    let _ = generate_board_with_templates(3, Difficulty::Hard, &[easy]);
}

/// The N=3 hard bank is embedded and non-empty.
#[test]
fn embedded_templates_hard_bank_is_nonempty() {
    let hard = embedded_templates(3, Difficulty::Hard);
    assert!(!hard.is_empty(), "N=3 hard bank should be embedded");
}

/// The no-parse count agrees with the parsed length.
#[test]
fn embedded_template_count_matches_parsed_length() {
    let hard = embedded_templates(3, Difficulty::Hard);
    assert_eq!(embedded_template_count(3, Difficulty::Hard), hard.len());
}

/// N=5 medium is deliberately not shipped (rejected at the API) — the embed
/// degrades to an empty vec, not a panic.
#[test]
fn embedded_templates_absent_bank_is_empty() {
    assert!(embedded_templates(5, Difficulty::Medium).is_empty());
}

/// The no-parse count agrees (zero) for an absent bank too.
#[test]
fn embedded_template_count_absent_bank_is_zero() {
    assert_eq!(embedded_template_count(5, Difficulty::Medium), 0);
}

/// Every embedded N=3 easy template parses to a full 81-cell board.
#[test]
fn embedded_easy_templates_parse_to_full_board() {
    for board in embedded_templates(3, Difficulty::Easy) {
        assert_eq!(board.len(), 81);
    }
}

// ─── Live-gen uniqueness (FAM-9) ─────────────────────────────────────────────

/// The served Sudoku sub-grid sizes: 2 (4×4), 3 (9×9), 4 (16×16). Mirrors the
/// frontend's `VALID_SIZES = [2, 3, 4]` (`web/frontend/src/games/sudoku/
/// composables/useUrlState.ts`). N=5 is deliberately unshipped.
const SERVED_SIZES: [u32; 3] = [2, 3, 4];

/// FAM-9 live-gen uniqueness gate — a *dealt* Sudoku puzzle is single-solution
/// at every served size.
///
/// The generator's hole-digger (`generate_board_slow`) keeps a cell removal only
/// when the board stays single-solution (`max_solutions: 2` uniqueness probe at
/// each dig), so what it deals must be unique. This asserts that invariant on
/// **live-generated** boards — `generate_board_seeded` runs the real
/// hole-digging path — as distinct from the static template sweep
/// (`examples/verify_bank_uniqueness.rs`, an example CI never runs). Seeded for
/// determinism; each board is re-solved independently with `max_solutions: 2`
/// and asserted to yield exactly one solution. Cheap enough for every CI run:
/// `Easy` digs the fewest holes (`total/4`), so the per-dig probes and the
/// verify solve stay heavily constrained and fast.
///
/// Pairs with the Futoshiki analog (`tests/futoshiki.rs ::
/// generated_puzzles_are_unique_and_valid`, N=4–7), so both game families' live
/// generators carry a standing uniqueness gate.
#[test]
fn live_generated_boards_are_unique_across_served_sizes() {
    for n in SERVED_SIZES {
        let board = generate_board_seeded(n, Difficulty::Easy, 0x5D_00 + n as u64);
        let total = (n * n * n * n) as usize;
        assert_eq!(
            board.len(),
            total,
            "N={n}: generated board has {} cells, expected {total}",
            board.len()
        );

        let (mut csp, given) = create_sudoku_csp(&board, n);
        let config = SolveConfig {
            pruning: Pruning::Ac3,
            ordering: Ordering::Mrv,
            max_solutions: 2,
            node_budget: Some(50_000_000),
            ..Default::default()
        };
        let solutions = csp.solve_with_given(&config, &given);

        assert!(
            !csp.stats().budget_exceeded,
            "N={n}: uniqueness solve exhausted its node budget — the single-solution verdict is unsafe"
        );
        assert_eq!(
            solutions.len(),
            1,
            "N={n}: a live-generated board must have exactly one solution, got {}",
            solutions.len()
        );
    }
}

// ─── Live-gen sweep — the fall-through tiers (FAM-9 / GEN-3 + GEN-4) ──────────

/// The tiers whose embedded bank is EMPTY, so `getRandomBoard` hole-digs LIVE in
/// the wasm worker on every deal (`r2-generation-truth.md` GEN-3): all 4×4, and
/// 9×9 Easy + 9×9 Medium. (9×9 Hard and all three 16×16 tiers are served from the
/// corpus fast path — `embedded_templates` non-empty — so a *deal* there is a
/// template pick + symmetry transform, not a live dig.) This is exactly the set
/// `TEMPLATE_BANK[size]?.[diff] ?? []` resolves empty for in the frontend, and the
/// set whose per-deal generation cost the wave must hold to the corpus bar.
const LIVE_DEALT_TIERS: &[(u32, Difficulty)] = &[
    (2, Difficulty::Easy),
    (2, Difficulty::Medium),
    (2, Difficulty::Hard),
    (3, Difficulty::Easy),
    (3, Difficulty::Medium),
];

/// Several seeds per tier — the sweep breadth the uniqueness gate asks for
/// (`r2-generation-truth.md` GEN-4: "n∈{2,3}×diff×several seeds, max_solutions:2"),
/// distinct from `live_generated_boards_are_unique_across_served_sizes`'s single
/// `0x5D_00+n` Easy-only probe. Fixed for determinism.
const SWEEP_SEEDS: [u64; 5] = [1, 7, 42, 1234, 65537];

/// GEN-4 + GEN-3 — the live-gen sweep. Widens the sibling
/// `live_generated_boards_are_unique_across_served_sizes` (W2: n∈{2,3,4} Easy, one
/// seed each) across the *fall-through* tiers × several seeds, asserting two
/// properties on every live deal:
///
///   - **uniqueness (GEN-4)** — the hole-digger keeps a removal only while the
///     board stays single-solution (`max_solutions:2` probe per dig,
///     `generate.rs:307`), so what it deals must be unique; re-solved here
///     independently under the production `Ac3+Mrv` config, exactly one solution;
///   - **corpus-bar parity (GEN-3)** — the deal solves within a node budget the
///     corpus fast-path deals clear trivially (a template + transform is unique by
///     construction and Ac3-propagation-solvable). `budget_exceeded` on any live
///     deal would mean the fall-through path is off the corpus bar — the latency
///     risk r2 flagged, caught here as a node-count invariant rather than a flaky
///     in-browser wall-time probe (the browser-latency variant belongs to the e2e
///     lane, which owns wall-time surfaces).
///
/// Node counts are machine-invariant (ci.yml GAC-corpus rationale, G6), so the
/// budget is a stable gate. 4×4 and 9×9 Easy/Medium are propagation-heavy (dense
/// givens), so the whole sweep stays well inside the budget and cheap for every
/// `cargo test --workspace` run.
#[test]
fn live_dealt_tiers_are_unique_and_within_the_corpus_bar() {
    // The corpus bar: a fast-path deal is Ac3-propagation-solvable and its
    // uniqueness re-solve costs ~0 backtracks. A generous ceiling that a
    // propagation-solvable board clears with room, yet a runaway would breach.
    const CORPUS_BAR: u64 = 5_000_000;
    for &(n, diff) in LIVE_DEALT_TIERS {
        let total = (n * n * n * n) as usize;
        for seed in SWEEP_SEEDS {
            assert_eq!(
                embedded_template_count(n, diff),
                0,
                "N={n} {diff:?}: expected a live-dealt (empty-bank) tier — the fall-through \
                 set drifted; re-derive LIVE_DEALT_TIERS from the current bank"
            );

            let board = generate_board_seeded(n, diff, seed);
            assert_eq!(
                board.len(),
                total,
                "N={n} {diff:?} seed={seed}: board has {} cells, expected {total}",
                board.len()
            );

            let (mut csp, given) = create_sudoku_csp(&board, n);
            let config = SolveConfig {
                pruning: Pruning::Ac3,
                ordering: Ordering::Mrv,
                max_solutions: 2,
                node_budget: Some(CORPUS_BAR),
                ..Default::default()
            };
            let solutions = csp.solve_with_given(&config, &given);

            assert!(
                !csp.stats().budget_exceeded,
                "N={n} {diff:?} seed={seed}: live deal breached the corpus bar ({CORPUS_BAR} \
                 nodes) — the fall-through path is off the fast-path latency budget"
            );
            assert_eq!(
                solutions.len(),
                1,
                "N={n} {diff:?} seed={seed}: a live deal must have exactly one solution, got {}",
                solutions.len()
            );
        }
    }
}

// ─── Clue-count honesty — GEN-1 disposition (b) ──────────────────────────────

fn givens(board: &[u32]) -> usize {
    board.iter().filter(|&&v| v != 0).count()
}

/// The givens a *served* deal carries for `(n, diff)`: the median of the embedded
/// bank when that tier is banked (16×16 all tiers, 9×9 Hard), else a live deal's
/// count (9×9 Easy/Medium, all 4×4). Mirrors exactly the path a real request
/// takes — bank fast-path or live hole-dig — so the ladder it asserts is the one
/// a user actually experiences.
fn served_givens(n: u32, diff: Difficulty, seed: u64) -> usize {
    let bank = embedded_templates(n, diff);
    if bank.is_empty() {
        givens(&generate_board_seeded(n, diff, seed))
    } else {
        let mut gs: Vec<usize> = bank.iter().map(|b| givens(b)).collect();
        gs.sort_unstable();
        gs[gs.len() / 2]
    }
}

/// GEN-1 disposition (b) — clue-count honesty. `measure_difficulty` (the FC proxy)
/// is *bimodal* at 9×9 and 16×16 — a board is either propagation-solvable (0
/// backtracks) or runs to millions, with nothing between — so it cannot separate
/// two propagation-solvable tiers (9×9 Easy ≡ Medium, both 0; the flatness r2
/// GEN-1 recorded). That live search grade is W7's technique tier. What the
/// Easy/Medium/Hard axis DOES mean honestly, at every size, is a monotone
/// clue-count ladder — strictly fewer givens as the label rises — and this gate
/// pins it so the label means something true before W7 lands. (The 16×16 rung of
/// this ladder is also the disposition-(a) fix's clue side: the regenerated Hard
/// bank at ~94 givens sits strictly below Medium's ~113.)
#[test]
fn clue_count_ladder_is_monotone_across_served_tiers() {
    for n in SERVED_SIZES {
        for seed in [1u64, 7, 42] {
            let easy = served_givens(n, Difficulty::Easy, seed);
            let medium = served_givens(n, Difficulty::Medium, seed);
            let hard = served_givens(n, Difficulty::Hard, seed);
            assert!(
                easy > medium && medium > hard,
                "N={n} seed={seed}: served givens must fall strictly easy>medium>hard, got \
                 {easy}/{medium}/{hard} — the clue-count ladder (the honest difficulty signal) \
                 is not monotone"
            );
        }
    }
}
