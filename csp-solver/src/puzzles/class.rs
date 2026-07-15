//! The puzzle-family generator contract.
//!
//! Sudoku and futoshiki generate by the *same* three beats — seed a full
//! solution, place clue furniture, then uniqueness-checked hole-dig — and
//! diverge only where [`PuzzleClass`] names seams. The trait is the intersection
//! their two generators already satisfy, drawn so one generic dealer can drive
//! both; T4-W13's `generate_by_digging<C: PuzzleClass>` is that dealer, and a
//! third family (Thermo/Killer/KenKen) ships as one impl of this trait plus a
//! payload builder, no new generator.

pub use crate::puzzles::sudoku::rng::SimpleRng;

/// The generator contract a puzzle family satisfies so one generic hole-digging
/// dealer deals them all.
///
/// Divergence between families is expressed as associated types and methods —
/// the clue furniture a board carries ([`Clue`](Self::Clue)), the puzzle the
/// caller receives ([`Puzzle`](Self::Puzzle)), and the family CSP a candidate
/// board solves against ([`solve_candidate`](Self::solve_candidate)) — never as
/// config flags. Every method is a per-family seam; a boolean toggle would be a
/// seam this trait missed.
pub trait PuzzleClass {
    /// Clue furniture beyond the board's givens: an inequality caret `(a, b)`
    /// meaning `board[a] > board[b]` (futoshiki), nothing at all (`()`, sudoku),
    /// a cage (W13).
    type Clue;

    /// The dealt puzzle as the caller receives it: the dense board alone
    /// (sudoku) or the board paired with its clue furniture (futoshiki).
    type Puzzle;

    /// Seed a complete, valid solution grid — dense, `0`-free — by fixing a
    /// shuffled first row and solving the rest through the crate solver (never a
    /// bespoke square builder). Its length is the board's cell count, which
    /// drives the dig.
    fn seed_solution(&self, rng: &mut SimpleRng) -> Vec<u32>;

    /// Place clue furniture over the seed `solution`. Sudoku places none (empty);
    /// futoshiki picks orthogonally-adjacent pairs the seed already satisfies, so
    /// the seed stays a valid start and every clue renders as a boundary caret.
    fn place_clues(&self, solution: &[u32], rng: &mut SimpleRng) -> Vec<Self::Clue>;

    /// Solve a candidate `board` (`0` = blank) under this family's constraints
    /// plus `clues`, returning up to `max_solutions` solutions — the base-CSP
    /// seam the seed solve and the dig's `max_solutions: 2` uniqueness check both
    /// call. Each family builds its own CSP behind this, so the `Csp`/`VarId`/
    /// domain machinery stays implementation detail.
    fn solve_candidate(
        &self,
        board: &[u32],
        clues: &[Self::Clue],
        max_solutions: usize,
    ) -> Vec<Vec<u32>>;

    /// Holes to dig for this instance's difficulty, given the seed board's
    /// `board_len`. Sudoku's clue-count bands and futoshiki's keep-density both
    /// resolve here.
    fn target_holes(&self, board_len: usize) -> usize;

    /// Assemble the dealt puzzle from the dug `board` and its `clues`.
    fn assemble(&self, board: Vec<u32>, clues: Vec<Self::Clue>) -> Self::Puzzle;
}
