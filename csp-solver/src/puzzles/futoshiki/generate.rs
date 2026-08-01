//! Futoshiki board generation and difficulty measurement.
//!
//! Mirrors `sudoku/generate.rs`'s shape, adapted to the Latin-square-plus-carets
//! structure:
//!
//! 1. [`seed_latin_square`] — solve an *empty* board (reusing the solver, no
//!    bespoke Latin-square construction), exactly as Sudoku's seed step reuses
//!    its own solver.
//! 2. [`place_inequalities`] — **new logic, no Sudoku analog**: pick
//!    orthogonally-adjacent cell pairs whose seed values *already* satisfy the
//!    relation, so the seed itself stays a valid starting point and every clue
//!    is renderable as a boundary caret.
//! 3. [`dig_holes`] — hole-dig with a `max_solutions: 2` uniqueness check whose
//!    CSP at each removal carries **both** the surviving givens **and** the full
//!    inequality set. Inequalities are board furniture — present in every
//!    candidate CSP, never blanked.
//! 4. [`measure_difficulty`] — the Sudoku backtrack-count recipe verbatim
//!    (`ForwardChecking` + `FailFirst`), threaded with the inequality set.
//!
//! Difficulty is a [`Difficulty`] axis (T4-W6 GEN-2): a keep-density +
//! inequality-density ladder over the tuned generator, givens falling and carets
//! rising together Easy→Hard. The default (unparametrized)
//! [`generate_futoshiki`] / [`generate_futoshiki_seeded`] entries keep the
//! single high-density ~75% tier for callers that want one; the axis rides
//! [`generate_futoshiki_difficulty_seeded`].

use crate::ordering::Ordering;
use crate::puzzles::class::PuzzleClass;
use crate::puzzles::sudoku::rng::SimpleRng;
use crate::{Pruning, SolveConfig};

use super::csp::create_futoshiki_csp;

/// The single shipped tier keeps ~75% of cells as givens. The probe
/// (`pass3/futoshiki-gen-probe-output.txt` §3) shows uniqueness-checked
/// hole-digging at this density is 0–1 ms for N=5–7.
const KEEP_DENSITY: f64 = 0.75;

/// Futoshiki puzzle difficulty — a keep-density + inequality-density ladder.
///
/// The two knobs move in tandem: givens fall and carets rise Easy→Hard. The r2
/// density sweep (`evidence/r2/r2-generation-truth.md`, GEN-2) shows givens
/// carry uniqueness at high keep, so a genuinely inequality-driven low-keep deal
/// needs givens *down* AND carets *up* together — a near-full Latin square is
/// not a futoshiki. Mirrors `sudoku`'s [`Difficulty`](crate::sudoku::Difficulty)
/// shape without depending on it: each puzzle module owns its own axis.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Difficulty {
    Easy,
    Medium,
    Hard,
}

impl Difficulty {
    /// Fraction of cells kept as givens — the `keep_density` rung fed to
    /// [`generate_futoshiki_tuned_seeded`]. Easy 0.6 / Medium 0.45 / Hard 0.3
    /// (the ladder the wave spec names); givens fall as difficulty rises.
    fn keep_density(self) -> f64 {
        match self {
            Difficulty::Easy => 0.6,
            Difficulty::Medium => 0.45,
            Difficulty::Hard => 0.3,
        }
    }

    /// Inequality-clue count as a function of the board side `n` (the tuned
    /// generator clamps it to the available adjacent-pair budget). Carets rise
    /// Easy→Hard — ≈ one / one-and-a-half / two per row — to keep the sparser
    /// low-keep tiers both hand-solvable and unique as the givens thin out.
    fn inequality_count(self, n: u32) -> usize {
        let nn = n as usize;
        match self {
            Difficulty::Easy => nn,
            Difficulty::Medium => nn * 3 / 2,
            Difficulty::Hard => nn * 2,
        }
    }
}

/// Build the seed/uniqueness solve config: the same `Ac3` + `FailFirst` pairing
/// Sudoku's `generate.rs` seeds and uniqueness-checks with. `Ac3` is the
/// load-bearing choice — `ForwardChecking` cannot even seed an N≥6 board (F1).
fn gen_config(max_solutions: usize) -> SolveConfig {
    SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::FailFirst,
        max_solutions,
        ..Default::default()
    }
}

/// Seed a complete Latin square by fixing a shuffled first row and solving the
/// rest — reusing the solver rather than constructing a square by hand (mirrors
/// Sudoku's seed step). Returns the dense `n²` solution.
fn seed_latin_square(n: u32, rng: &mut SimpleRng) -> Vec<u32> {
    let total = (n * n) as usize;

    let mut first_row: Vec<u32> = (1..=n).collect();
    rng.shuffle(&mut first_row);

    let mut board = vec![0u32; total];
    board[..n as usize].copy_from_slice(&first_row);

    let (mut csp, given) = create_futoshiki_csp(&board, n, &[]);
    csp.solve_with_given(&gen_config(1), &given)
        .into_iter()
        .next()
        .expect("an empty Futoshiki board with a fixed first row is always solvable")
}

/// Place up to `count` inequality clues on orthogonally-adjacent cell pairs
/// whose seed values already satisfy the relation. Emits `(a, b)` meaning
/// `square[a] > square[b]`.
///
/// Orthogonally-adjacent cells in a Latin square are always in the same row or
/// column and therefore always differ, so the orientation is unambiguous.
fn place_inequalities(
    square: &[u32],
    n: u32,
    count: usize,
    rng: &mut SimpleRng,
) -> Vec<(usize, usize)> {
    let nn = n as usize;

    // Every orthogonally-adjacent unordered pair, enumerated once (right + down
    // neighbors cover all shared edges without duplication).
    let mut pairs: Vec<(usize, usize)> = Vec::new();
    for r in 0..nn {
        for c in 0..nn {
            let cell = r * nn + c;
            if c + 1 < nn {
                pairs.push((cell, cell + 1));
            }
            if r + 1 < nn {
                pairs.push((cell, cell + nn));
            }
        }
    }
    rng.shuffle(&mut pairs);

    pairs
        .into_iter()
        .take(count)
        .map(|(u, v)| {
            if square[u] > square[v] {
                (u, v)
            } else {
                (v, u)
            }
        })
        .collect()
}

/// Hole-dig a complete `solution` down toward `target_holes` blanks, keeping the
/// solution unique under the full (never-removed) `inequalities` set. Cells are
/// tried in random order; a removal that would introduce a second solution is
/// reverted.
fn dig_holes(
    solution: &[u32],
    n: u32,
    inequalities: &[(usize, usize)],
    target_holes: usize,
    rng: &mut SimpleRng,
) -> Vec<u32> {
    let total = (n * n) as usize;

    let mut board = solution.to_vec();
    let mut indices: Vec<usize> = (0..total).collect();
    rng.shuffle(&mut indices);

    let uniqueness_config = gen_config(2);
    let mut holes = 0usize;

    for &idx in &indices {
        if holes >= target_holes {
            break;
        }

        let saved = board[idx];
        board[idx] = 0;

        let (mut csp, given) = create_futoshiki_csp(&board, n, inequalities);
        let solutions = csp.solve_with_given(&uniqueness_config, &given);

        if solutions.len() == 1 {
            holes += 1;
        } else {
            board[idx] = saved;
        }
    }

    board
}

/// Default inequality-clue count for the single shipped tier: one per row on
/// average (`n`), clamped to the available adjacent-pair budget. Inequalities
/// tighten propagation and only help uniqueness, so this is a conservative,
/// visually-uncluttered default rather than a tuned one.
fn default_inequality_count(n: u32) -> usize {
    let nn = n as usize;
    let available = 2 * nn * (nn - 1);
    nn.min(available)
}

/// Convert a keep-density in `(0, 1]` to a hole count for an `n²` board.
fn holes_for_density(n: u32, keep_density: f64) -> usize {
    let total = (n * n) as usize;
    let keep = (total as f64 * keep_density).round() as usize;
    total.saturating_sub(keep.min(total))
}

/// Measure difficulty by backtrack count under the naive `ForwardChecking` +
/// `FailFirst` config — the Sudoku recipe verbatim, threaded with the full
/// inequality set. Higher counts mean a puzzle a non-arc-consistent solver finds
/// harder; v1 records but does not band these (no tiers ship).
pub fn measure_difficulty(board: &[u32], n: u32, inequalities: &[(usize, usize)]) -> u32 {
    let (mut csp, given) = create_futoshiki_csp(board, n, inequalities);
    let config = SolveConfig {
        pruning: Pruning::ForwardChecking,
        ordering: Ordering::FailFirst,
        max_solutions: 1,
        ..Default::default()
    };
    csp.solve_with_given(&config, &given);
    csp.stats().backtracks as u32
}

/// Generate a Futoshiki puzzle at the single shipped high-density tier, seeding
/// from the wall clock. Returns `(board, inequalities)`: `board` is the dense
/// given grid (`0` = blank), `inequalities` are `(a, b)` pairs with `a > b`,
/// each orthogonally adjacent.
pub fn generate_futoshiki(n: u32) -> (Vec<u32>, Vec<(usize, usize)>) {
    generate_with_rng(
        n,
        KEEP_DENSITY,
        default_inequality_count(n),
        &mut SimpleRng::from_time(),
    )
}

/// Seeded, platform-independent counterpart of [`generate_futoshiki`].
///
/// Threads an explicit `seed` instead of reading the wall clock (which panics on
/// `wasm32-unknown-unknown` — no clock there). Same `seed` + `n` ⇒ the same
/// puzzle on native and wasm, the invariant the client-solve wasm parity harness
/// relies on.
pub fn generate_futoshiki_seeded(n: u32, seed: u64) -> (Vec<u32>, Vec<(usize, usize)>) {
    generate_with_rng(
        n,
        KEEP_DENSITY,
        default_inequality_count(n),
        &mut SimpleRng::new(seed),
    )
}

/// Parametric, seeded generator used by the calibration/G1 probe: choose the
/// keep-density and inequality count directly. `keep_density` clamps to
/// `(0, 1]`; `inequality_count` clamps to the available adjacent-pair budget.
pub fn generate_futoshiki_tuned_seeded(
    n: u32,
    keep_density: f64,
    inequality_count: usize,
    seed: u64,
) -> (Vec<u32>, Vec<(usize, usize)>) {
    let available = 2 * (n as usize) * (n as usize - 1);
    let count = inequality_count.min(available);
    let density = keep_density.clamp(f64::MIN_POSITIVE, 1.0);
    generate_with_rng(n, density, count, &mut SimpleRng::new(seed))
}

/// Seeded, difficulty-parametric generator — the axis W6 (GEN-2) wires through
/// the tuned generator. Maps `difficulty` to its keep-density + inequality-count
/// rung ([`Difficulty::keep_density`] / [`Difficulty::inequality_count`]), then
/// defers to [`generate_futoshiki_tuned_seeded`]. Same `n` + `difficulty` +
/// `seed` ⇒ the same puzzle on native and wasm — the invariant the client-solve
/// wasm surface (`csp-solver/wasm/src/futoshiki.rs`) and its cross-target parity
/// harness rely on. The seeded twin of `sudoku`'s
/// [`generate_board_seeded`](crate::sudoku::generate_board_seeded).
pub fn generate_futoshiki_difficulty_seeded(
    n: u32,
    difficulty: Difficulty,
    seed: u64,
) -> (Vec<u32>, Vec<(usize, usize)>) {
    generate_futoshiki_tuned_seeded(
        n,
        difficulty.keep_density(),
        difficulty.inequality_count(n),
        seed,
    )
}

/// Shared generation pipeline: seed → place carets → uniqueness-checked
/// hole-dig.
fn generate_with_rng(
    n: u32,
    keep_density: f64,
    inequality_count: usize,
    rng: &mut SimpleRng,
) -> (Vec<u32>, Vec<(usize, usize)>) {
    let square = seed_latin_square(n, rng);
    let inequalities = place_inequalities(&square, n, inequality_count, rng);
    let target_holes = holes_for_density(n, keep_density);
    let board = dig_holes(&square, n, &inequalities, target_holes, rng);
    (board, inequalities)
}

/// A futoshiki instance to deal: side `n` at a keep-density + inequality-count
/// rung.
///
/// The [`PuzzleClass`] witness expressing futoshiki's Latin-square-plus-carets
/// generation as the generic dealer's seams. Its seed, caret placement,
/// uniqueness check, and hole target delegate to the exact functions
/// [`generate_with_rng`] uses, so dealing through the contract reproduces
/// [`generate_futoshiki_tuned_seeded`] byte-for-byte (`tests/puzzle_class.rs`).
/// `keep_density` is expected in `(0, 1]` — [`from_difficulty`](Self::from_difficulty)
/// always yields it so.
pub struct FutoshikiClass {
    /// Board side — the board is `n×n`.
    pub n: u32,
    /// Fraction of cells kept as givens (givens fall as difficulty rises).
    pub keep_density: f64,
    /// Inequality-caret count (clamped to the adjacent-pair budget on placement).
    pub inequality_count: usize,
}

impl FutoshikiClass {
    /// Build the instance for a `difficulty` rung — the keep-density +
    /// inequality-count mapping [`generate_futoshiki_difficulty_seeded`] threads.
    pub fn from_difficulty(n: u32, difficulty: Difficulty) -> Self {
        Self {
            n,
            keep_density: difficulty.keep_density(),
            inequality_count: difficulty.inequality_count(n),
        }
    }
}

impl PuzzleClass for FutoshikiClass {
    /// An inequality caret `(a, b)` meaning `board[a] > board[b]`.
    type Clue = (usize, usize);
    type Puzzle = (Vec<u32>, Vec<(usize, usize)>);

    fn seed_solution(&self, rng: &mut SimpleRng) -> Vec<u32> {
        seed_latin_square(self.n, rng)
    }

    fn place_clues(&self, solution: &[u32], rng: &mut SimpleRng) -> Vec<(usize, usize)> {
        let available = 2 * (self.n as usize) * (self.n as usize - 1);
        let count = self.inequality_count.min(available);
        place_inequalities(solution, self.n, count, rng)
    }

    fn solve_candidate(
        &self,
        board: &[u32],
        clues: &[(usize, usize)],
        max_solutions: usize,
    ) -> Vec<Vec<u32>> {
        let (mut csp, given) = create_futoshiki_csp(board, self.n, clues);
        csp.solve_with_given(&gen_config(max_solutions), &given)
    }

    fn target_holes(&self, _board_len: usize) -> usize {
        holes_for_density(self.n, self.keep_density)
    }

    fn assemble(&self, board: Vec<u32>, clues: Vec<(usize, usize)>) -> Self::Puzzle {
        (board, clues)
    }
}
