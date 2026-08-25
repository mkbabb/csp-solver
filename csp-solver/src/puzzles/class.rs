//! The puzzle-family generator contract.
//!
//! Sudoku and futoshiki generate by the *same* three beats — seed a full
//! solution, place clue furniture, then uniqueness-checked hole-dig — and
//! diverge only where [`PuzzleClass`] names seams. The trait is the intersection
//! their two generators already satisfy, drawn so one generic dealer can drive
//! both; T4-W13's `generate_by_digging<C: PuzzleClass>` is that dealer, and a
//! third family (Thermo/Killer/KenKen) ships as one impl of this trait plus a
//! payload builder, no new generator.
//!
//! Two leashes ride the dealer, both T9-W4:
//!
//! - the **budget-exhaustion law** — a candidate re-solve that stopped early
//!   proves nothing, so it can never mint a hole ([`CandidateOutcome`]);
//! - the **attempt-stop** — a run of consecutive refusals ends the dig instead
//!   of paying a uniqueness solve for every remaining index of an unreachable
//!   hole target ([`PuzzleClass::rejection_leash`]).

use crate::config::SolveStats;

pub use crate::puzzles::sudoku::rng::SimpleRng;

/// Consecutive refused removals after which the dig stops, for a family that
/// names no leash of its own.
///
/// Chosen by measurement on the estate's worst case — thermo 16×16 HARD, whose
/// hole target is 204 of 256 cells (a 52-given tier label) but which digs out at
/// 172–180 holes, so the last ~30 cells of the target are unreachable and the
/// dig pays a full 2-solution 16×16 solve for every one of the 256 shuffled
/// indices to discover that.
///
/// **8 is the knee, and it is pinned from both sides.** The table is
/// `tests/generation_leash.rs`'s `measure_thermo_16x16_leash_table` /
/// `measure_9x9_leash_table` (5 seeds each, medians; one traced unleashed deal
/// per seed replayed under every candidate leash, since a leashed dig is a
/// strict prefix of an unleashed one):
///
/// | leash | 16×16 HARD median | 16×16 HARD max | 16×16 HARD givens | 9×9 HARD givens |
/// |-------|------------------:|---------------:|-------------------|-----------------|
/// | none  | 11,220 ms         | 50,738 ms      | 76–84 (median 78) | 22–25 (23)      |
/// | 16    | 11,220 ms         | 38,957 ms      | 76–87 (78)        | 22–25 (23)      |
/// | **8** | **7,865 ms**      | **17,198 ms**  | **78–99 (84)**    | **22–25 (23)**  |
/// | 6     | 1,000 ms          | 5,549 ms       | 82–99 (86)        | 22–28 (25) ⚠    |
/// | 4     | 172 ms            | 2,146 ms       | 89–103 (100)      | 25–32 (28) ⚠    |
///
/// From above: 8 is the largest constant that actually bites. The longest
/// refusal run *preceding a further successful removal* is 12–21 at 16×16 HARD,
/// so every leash ≥ 32 — the value this constant shipped as before the table was
/// built — is inert: it never fires, and the tail it was introduced to cut
/// stands at its full 50.7 s.
///
/// From below: 8 is the smallest constant that moves no ladder under 16×16. At
/// 8, every 9×9 rung measured (sudoku HARD and MEDIUM, thermo HARD, killer HARD)
/// and thermo 16×16 MEDIUM deal *identical* given-counts to an unleashed dig —
/// the runs it truncates there are pure trailing refusals, after the last
/// removal that would ever have succeeded. At 6 the ladder moves for the first
/// time (sudoku 9×9 HARD 23 → 25 median givens, thermo 9×9 HARD 17 → 19 on seed
/// 12345), which is why the knee sits at 8 and not lower.
///
/// What 8 buys is honest and partial: the max collapses 2.95× (50.7 s → 17.2 s)
/// and the median 1.43× (11.2 s → 7.9 s). It is not the order-of-magnitude cut a
/// leash of 4 would give, because thermo 16×16 HARD spends most of its wall time
/// inside the *successful* removals late in the dig — each uniqueness solve on a
/// near-empty 16×16 board costs seconds — and a consecutive-refusal stop cannot
/// bill for those. Cutting deeper is a tier-honesty decision (W4 §4.3), not a
/// constant this default may make on its own: at leash 4 a HARD deal returns 100
/// givens against MEDIUM's 110, and the two rungs stop being different puzzles.
pub const DEFAULT_REJECTION_LEASH: usize = 8;

/// The verdict of one candidate re-solve — a solution count paired with whether
/// the search that produced it actually finished.
///
/// The count alone is unreadable. A search that stopped on
/// [`SolveConfig::node_budget`](crate::SolveConfig::node_budget) (or on a
/// [`CancelToken`](crate::CancelToken)) reports whatever it happened to reach,
/// so "one solution" from an exhausted search means *one was found before the
/// stop*, never *one exists*. Digging a hole on that reading mints a puzzle with
/// more than one solution — the defect `tests/generation_leash.rs` plants under
/// a deliberately tiny budget. Exhaustion is therefore a distinct state, and
/// [`proves_unique`](Self::proves_unique) is the only way to read a uniqueness
/// verdict off it.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum CandidateOutcome {
    /// The search closed: these are *all* the solutions, up to the
    /// `max_solutions` cap the caller asked for. Exactly one solution under a
    /// cap of ≥ 2 is a genuine uniqueness proof.
    Complete(Vec<Vec<u32>>),
    /// The search stopped early — node budget exhausted or cancellation
    /// requested — before the cap was filled or the tree closed. The solutions
    /// found are a floor, never a census: nothing is proven about uniqueness.
    Exhausted(Vec<Vec<u32>>),
}

impl CandidateOutcome {
    /// Classify a completed `solve*` call: the solutions it returned plus the
    /// [`SolveStats`] of the search that returned them. Either early-stop flag
    /// ([`budget_exceeded`](SolveStats::budget_exceeded),
    /// [`cancelled`](SolveStats::cancelled)) makes the outcome
    /// [`Exhausted`](Self::Exhausted) — both mean the same thing to a dig, that
    /// the tree was not closed.
    pub fn from_search(solutions: Vec<Vec<u32>>, stats: &SolveStats) -> Self {
        if stats.budget_exceeded || stats.cancelled {
            Self::Exhausted(solutions)
        } else {
            Self::Complete(solutions)
        }
    }

    /// The solutions the search returned, whether or not it closed. Read this
    /// only for the solutions themselves — never to re-derive a verdict from the
    /// count (that is [`proves_unique`](Self::proves_unique)'s job).
    pub fn solutions(&self) -> &[Vec<u32>] {
        match self {
            Self::Complete(s) | Self::Exhausted(s) => s,
        }
    }

    /// `true` only when the search **closed** and found exactly one solution —
    /// the single reading of this outcome that proves uniqueness. An
    /// [`Exhausted`](Self::Exhausted) outcome is always `false`, however many
    /// solutions it carries.
    pub fn proves_unique(&self) -> bool {
        matches!(self, Self::Complete(s) if s.len() == 1)
    }
}

/// The generator contract a puzzle family satisfies so one generic hole-digging
/// dealer deals them all.
///
/// Divergence between families is expressed as associated types and methods —
/// the clue furniture a board carries ([`Clue`](Self::Clue)), the puzzle the
/// caller receives ([`Puzzle`](Self::Puzzle)), the per-deal candidate solver it
/// builds ([`Solver`](Self::Solver)), and how a candidate board is re-solved
/// against it ([`solve_candidate`](Self::solve_candidate)) — never as config
/// flags. Every method is a per-family seam; a boolean toggle would be a seam
/// this trait missed.
pub trait PuzzleClass {
    /// Clue furniture beyond the board's givens: an inequality caret `(a, b)`
    /// meaning `board[a] > board[b]` (futoshiki), nothing at all (`()`, sudoku),
    /// a cage (W13).
    type Clue;

    /// The dealt puzzle as the caller receives it: the dense board alone
    /// (sudoku) or the board paired with its clue furniture (futoshiki).
    type Puzzle;

    /// The family's candidate solver, built **once** per deal from the clue
    /// furniture and re-used for every removal's re-solve. Every family's is a
    /// finalized CSP whose structure depends only on the board *size* and the
    /// clues — the givens ride
    /// [`solve_with_given`](crate::Csp::solve_with_given), which resets domains
    /// on entry — so the `Csp`/`VarId`/domain machinery stays implementation
    /// detail behind this type.
    type Solver;

    /// Seed a complete, valid solution grid — dense, `0`-free — by fixing a
    /// shuffled first row and solving the rest through the crate solver (never a
    /// bespoke square builder). Its length is the board's cell count, which
    /// drives the dig.
    fn seed_solution(&self, rng: &mut SimpleRng) -> Vec<u32>;

    /// Place clue furniture over the seed `solution`. Sudoku places none (empty);
    /// futoshiki picks orthogonally-adjacent pairs the seed already satisfies, so
    /// the seed stays a valid start and every clue renders as a boundary caret.
    fn place_clues(&self, solution: &[u32], rng: &mut SimpleRng) -> Vec<Self::Clue>;

    /// Build the reusable candidate solver for this instance's `clues` — the
    /// skeleton hoist, once per deal instead of once per removal. The
    /// constraint graph is identical for every candidate board of one size and
    /// clue set; only the givens change.
    fn build_solver(&self, clues: &[Self::Clue]) -> Self::Solver;

    /// Re-solve a candidate `board` (`0` = blank) on the hoisted `solver`,
    /// returning up to `max_solutions` solutions **and** whether the search
    /// closed — the dig's `max_solutions: 2` uniqueness check is the sole
    /// caller. Returning a bare count here is what made budget exhaustion
    /// readable as a proof; [`CandidateOutcome`] is that count's only honest
    /// shape.
    fn solve_candidate(
        &self,
        solver: &mut Self::Solver,
        board: &[u32],
        max_solutions: usize,
    ) -> CandidateOutcome;

    /// Holes to dig for this instance's difficulty, given the seed board's
    /// `board_len`. Sudoku's clue-count bands and futoshiki's keep-density both
    /// resolve here.
    fn target_holes(&self, board_len: usize) -> usize;

    /// Consecutive refused removals after which the dig stops — the attempt-stop
    /// this family tunes. A refusal is any removal the dealer puts back: a
    /// second solution appeared, or the re-solve did not close.
    ///
    /// Defaults to [`DEFAULT_REJECTION_LEASH`]. A family whose
    /// [`target_holes`](Self::target_holes) is deliberately unreachable — KenKen
    /// aims to blank the whole board and keeps only what the cages
    /// underdetermine — raises or removes it, since for that family a long
    /// refusal run is the normal end of the dig, not a stalled one.
    fn rejection_leash(&self) -> usize {
        DEFAULT_REJECTION_LEASH
    }

    /// Assemble the dealt puzzle from the dug `board` and its `clues`.
    fn assemble(&self, board: Vec<u32>, clues: Vec<Self::Clue>) -> Self::Puzzle;
}

/// The generic hole-digging dealer, driven entirely through [`PuzzleClass`] —
/// the three shared beats every family generates by: seed a full solution, place
/// clue furniture, then dig blanks while a `max_solutions: 2` re-solve keeps the
/// board unique (a removal that admits a second solution is reverted). One
/// seeded `rng` threads seed → clues → dig.
///
/// Two things a removal must clear to become a hole, and they are not the same
/// thing: the re-solve must have **closed** and it must have found exactly one
/// solution ([`CandidateOutcome::proves_unique`]). An unclosed re-solve is
/// NOT-PROVEN — the cell goes back, exactly as if a second solution had
/// appeared, because an exhausted search cannot tell those two cases apart.
///
/// The dig ends on the first of three conditions: the hole target is met, the
/// indices run out, or [`rejection_leash`](PuzzleClass::rejection_leash)
/// consecutive removals are refused. That last one is the attempt-stop: at
/// 16×16 Hard the target asks for 204 holes and the dig gets 172–180, so the
/// last ~30 are unreachable and without the stop the dig pays a full uniqueness
/// solve for every remaining index to discover that — a measured 50.7 s on the
/// worst of five thermo seeds. See [`DEFAULT_REJECTION_LEASH`] for the table.
///
/// This is the shape `tests/puzzle_class.rs` proved reproduces the shipped
/// `generate_board_seeded` / `generate_futoshiki_*_seeded` generators
/// byte-for-byte — the RS acceptance that the trait is the true intersection.
/// T4-W13's Thermo/Killer/KenKen deal through it, adding no new generator.
pub fn generate_by_digging<C: PuzzleClass>(class: &C, rng: &mut SimpleRng) -> C::Puzzle {
    let solution = class.seed_solution(rng);
    let clues = class.place_clues(&solution, rng);
    let target = class.target_holes(solution.len());
    let leash = class.rejection_leash();

    // The skeleton hoist: one finalized CSP for the whole dig. Byte-identical
    // deals — every uniqueness verdict depends only on the solve's solution
    // count, which reuse cannot perturb (`solve_with_given` resets domains and
    // stats on entry; the GAC warm-start cache is thread-local and
    // correctness-invariant).
    let mut solver = class.build_solver(&clues);

    let mut board = solution.clone();
    let mut indices: Vec<usize> = (0..solution.len()).collect();
    rng.shuffle(&mut indices);

    let mut holes = 0usize;
    let mut refusals = 0usize;
    for &idx in &indices {
        if holes >= target || refusals >= leash {
            break;
        }
        let saved = board[idx];
        board[idx] = 0;
        if class
            .solve_candidate(&mut solver, &board, 2)
            .proves_unique()
        {
            holes += 1;
            refusals = 0;
        } else {
            board[idx] = saved;
            refusals += 1;
        }
    }

    class.assemble(board, clues)
}
