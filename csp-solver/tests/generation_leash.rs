//! The dig's two leashes: the budget-exhaustion law and the attempt-stop.
//!
//! `generate_by_digging` turns a candidate re-solve into a uniqueness verdict.
//! Two ways that reading can lie, both pinned here:
//!
//! 1. **Exhaustion read as proof.** A search that stopped on `node_budget`
//!    reports whatever it happened to find; one solution found before the stop
//!    is not one solution existing. Reading that count as unique mints a puzzle
//!    with more than one solution — the defect this file's first test plants.
//!    Against the pre-T9-W4 dealer (which compared `solutions.len() == 1`) it
//!    fails at budget 64 on every seed with true solution count 2; against
//!    [`CandidateOutcome`] it passes, because an
//!    [`Exhausted`](CandidateOutcome::Exhausted) outcome can never
//!    [`proves_unique`](CandidateOutcome::proves_unique).
//! 2. **An unreachable hole target.** The dig walks every shuffled index chasing
//!    a target no board of that size can reach, paying a full uniqueness solve
//!    per doomed index. [`PuzzleClass::rejection_leash`] bounds that tail; the
//!    second test counts the solves to prove the stop actually fires.
//!
//! The `#[ignore]`d entries at the foot are the measurement harness (16×16 deals
//! take seconds): run with
//! `cargo test --release --test generation_leash -- --ignored --nocapture`.

use std::cell::{Cell, RefCell};
use std::time::Instant;

use csp_solver::PuzzleClass;
use csp_solver::domain::BitsetDomain;
use csp_solver::ordering::Ordering;
use csp_solver::puzzles::class::{
    CandidateOutcome, DEFAULT_REJECTION_LEASH, SimpleRng, generate_by_digging,
};
use csp_solver::puzzles::killer::KillerClass;
use csp_solver::puzzles::sudoku::csp::{sudoku_csp_skeleton, sudoku_given};
use csp_solver::puzzles::sudoku::{Difficulty, SudokuClass};
use csp_solver::puzzles::thermo::{ThermoClass, generate_thermo_seeded};
use csp_solver::{Csp, Pruning, SolveConfig};

fn capped_config(max_solutions: usize, budget: u64) -> SolveConfig {
    SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::FailFirst,
        max_solutions,
        node_budget: Some(budget),
        ..Default::default()
    }
}

// ── 1. The budget-exhaustion law ────────────────────────────────────────────

/// A sudoku dealt through a candidate solver on a deliberately tiny node
/// budget — the "budget lever" any future tightening would pull.
///
/// Everything but the budget is the shipped `SudokuClass`: same seed, same clue
/// furniture (none), same hole target. Only the uniqueness re-solve runs under
/// `node_budget: Some(budget)`, small enough that the search stops before it can
/// close the tree on some candidates.
struct BudgetCappedSudoku {
    n: u32,
    difficulty: Difficulty,
    budget: u64,
}

impl PuzzleClass for BudgetCappedSudoku {
    type Clue = ();
    type Puzzle = Vec<u32>;
    type Solver = Csp<BitsetDomain>;

    fn seed_solution(&self, rng: &mut SimpleRng) -> Vec<u32> {
        let m = self.n * self.n;
        let total = (m * m) as usize;
        let mut csp = sudoku_csp_skeleton(self.n);
        let mut seed_board = vec![0u32; total];
        let mut first_row: Vec<u32> = (1..=m).collect();
        rng.shuffle(&mut first_row);
        seed_board[..m as usize].copy_from_slice(&first_row);
        csp.solve_with_given(&capped_config(1, u64::MAX), &sudoku_given(&seed_board))
            .into_iter()
            .next()
            .expect("a seeded board with a fixed first row is always solvable")
    }

    fn place_clues(&self, _solution: &[u32], _rng: &mut SimpleRng) -> Vec<()> {
        Vec::new()
    }

    fn build_solver(&self, _clues: &[()]) -> Csp<BitsetDomain> {
        sudoku_csp_skeleton(self.n)
    }

    fn solve_candidate(
        &self,
        solver: &mut Csp<BitsetDomain>,
        board: &[u32],
        max_solutions: usize,
    ) -> CandidateOutcome {
        let solutions = solver.solve_with_given(
            &capped_config(max_solutions, self.budget),
            &sudoku_given(board),
        );
        CandidateOutcome::from_search(solutions, solver.stats())
    }

    fn target_holes(&self, board_len: usize) -> usize {
        self.difficulty.target_holes(board_len)
    }

    fn assemble(&self, board: Vec<u32>, _clues: Vec<()>) -> Vec<u32> {
        board
    }
}

/// Count a board's solutions with no budget at all — the ground truth the dig's
/// capped verdict is measured against. Capped at 2: one is unique, two is not.
fn true_solution_count(board: &[u32], n: u32) -> usize {
    let mut csp = sudoku_csp_skeleton(n);
    csp.solve_with_given(&capped_config(2, u64::MAX), &sudoku_given(board))
        .len()
}

#[test]
fn a_budget_exhausted_dig_never_mints_a_non_unique_puzzle() {
    // Sweep the budget through the band where a 9×9 candidate's uniqueness solve
    // can find its first solution but not close the tree. Every dealt board must
    // still have exactly one solution: a hole the capped search could not prove
    // is kept filled, never counted.
    let mut minted = Vec::new();
    for &budget in &[8u64, 16, 32, 64, 128, 256] {
        for &seed in &[1u64, 7, 42, 12345, 99] {
            let class = BudgetCappedSudoku {
                n: 3,
                difficulty: Difficulty::Hard,
                budget,
            };
            let board = generate_by_digging(&class, &mut SimpleRng::new(seed));
            let count = true_solution_count(&board, 3);
            if count != 1 {
                minted.push((budget, seed, count));
            }
        }
    }
    assert!(
        minted.is_empty(),
        "the dig read a budget-exhausted search as a uniqueness proof and minted \
         non-unique puzzles (budget, seed, true solution count): {minted:?}"
    );
}

#[test]
fn exhaustion_is_a_distinct_outcome_the_count_cannot_hide() {
    // The unit under the law: identical solution vectors, opposite verdicts —
    // the reading `solutions.len() == 1` cannot tell these two apart, which is
    // exactly why the dealer no longer performs it.
    let one = vec![vec![1u32, 2, 3]];
    let complete = CandidateOutcome::Complete(one.clone());
    let exhausted = CandidateOutcome::Exhausted(one.clone());

    assert!(complete.proves_unique());
    assert!(!exhausted.proves_unique());
    assert_eq!(complete.solutions(), exhausted.solutions());

    // Neither a two-solution census nor an empty one proves uniqueness.
    assert!(!CandidateOutcome::Complete(vec![vec![1], vec![2]]).proves_unique());
    assert!(!CandidateOutcome::Complete(Vec::new()).proves_unique());

    // `from_search` classifies on the search's own early-stop flags, and either
    // flag means the same thing to a dig: the tree was not closed.
    let mut csp = sudoku_csp_skeleton(3);
    let hard = vec![0u32; 81];
    let solutions = csp.solve_with_given(&capped_config(2, 8), &sudoku_given(&hard));
    assert!(
        csp.stats().budget_exceeded,
        "budget 8 must not close an empty 9×9"
    );
    assert!(!CandidateOutcome::from_search(solutions, csp.stats()).proves_unique());
}

// ── 2. The attempt-stop ─────────────────────────────────────────────────────

/// A sudoku whose hole target is *unreachable* — every cell — wired to count
/// its candidate re-solves. Stands in for thermo 16×16 HARD (whose target asks
/// 204 holes of 256 and gets 172–180) at a size a debug test can afford.
struct CountingSudoku {
    n: u32,
    leash: usize,
    solves: Cell<usize>,
}

impl PuzzleClass for CountingSudoku {
    type Clue = ();
    type Puzzle = Vec<u32>;
    type Solver = Csp<BitsetDomain>;

    fn seed_solution(&self, rng: &mut SimpleRng) -> Vec<u32> {
        let m = self.n * self.n;
        let total = (m * m) as usize;
        let mut csp = sudoku_csp_skeleton(self.n);
        let mut seed_board = vec![0u32; total];
        let mut first_row: Vec<u32> = (1..=m).collect();
        rng.shuffle(&mut first_row);
        seed_board[..m as usize].copy_from_slice(&first_row);
        csp.solve_with_given(&capped_config(1, u64::MAX), &sudoku_given(&seed_board))
            .into_iter()
            .next()
            .expect("a seeded board with a fixed first row is always solvable")
    }

    fn place_clues(&self, _solution: &[u32], _rng: &mut SimpleRng) -> Vec<()> {
        Vec::new()
    }

    fn build_solver(&self, _clues: &[()]) -> Csp<BitsetDomain> {
        sudoku_csp_skeleton(self.n)
    }

    fn solve_candidate(
        &self,
        solver: &mut Csp<BitsetDomain>,
        board: &[u32],
        max_solutions: usize,
    ) -> CandidateOutcome {
        self.solves.set(self.solves.get() + 1);
        let solutions = solver.solve_with_given(
            &capped_config(max_solutions, u64::MAX),
            &sudoku_given(board),
        );
        CandidateOutcome::from_search(solutions, solver.stats())
    }

    /// Unreachable by construction: no sudoku is unique with every cell blank.
    fn target_holes(&self, board_len: usize) -> usize {
        board_len
    }

    fn rejection_leash(&self) -> usize {
        self.leash
    }

    fn assemble(&self, board: Vec<u32>, _clues: Vec<()>) -> Vec<u32> {
        board
    }
}

fn dig_counting(n: u32, leash: usize, seed: u64) -> (Vec<u32>, usize) {
    let class = CountingSudoku {
        n,
        leash,
        solves: Cell::new(0),
    };
    let board = generate_by_digging(&class, &mut SimpleRng::new(seed));
    (board, class.solves.get())
}

#[test]
fn the_attempt_stop_ends_a_dig_chasing_an_unreachable_target() {
    // Unleashed, the dig pays one uniqueness solve for every one of the 81
    // indices to learn that the last stretch is all refusals.
    for &seed in &[1u64, 7, 42, 12345] {
        let (full, full_solves) = dig_counting(3, usize::MAX, seed);
        assert_eq!(
            full_solves, 81,
            "seed {seed}: an unleashed dig walks every index"
        );

        // Leashed, it stops on the first run of `leash` consecutive refusals.
        // The leashed dig is a strict PREFIX of the unleashed one — same seed,
        // same index order, same verdicts — so it can only pay fewer solves and
        // only keep more givens. Monotone in the leash: a shorter leash never
        // walks further than a longer one.
        // The shipped default cannot bite at 9×9: the longest refusal run there
        // is under 8 (the leash sweep harness below), so a 32-leash dig is the
        // unleashed dig, cell for cell. This is the "no small-board ladder
        // moves" invariant — the stop is a 16×16 instrument.
        let (defaulted, default_solves) = dig_counting(3, DEFAULT_REJECTION_LEASH, seed);
        assert_eq!(
            (defaulted, default_solves),
            (full.clone(), full_solves),
            "seed {seed}: the default leash must not perturb a 9×9 deal"
        );

        let mut longer_solves = full_solves;
        let mut longer_givens = givens(&full);
        for &leash in &[4usize, 2, 1] {
            let (board, solves) = dig_counting(3, leash, seed);
            assert!(
                solves < full_solves,
                "seed {seed} leash {leash}: the stop must fire before the indices \
                 run out (got {solves} solves of {full_solves})"
            );
            assert!(
                solves <= longer_solves,
                "seed {seed} leash {leash}: a shorter leash cannot walk further \
                 (got {solves}, longer leash paid {longer_solves})"
            );
            assert!(
                givens(&board) >= longer_givens,
                "seed {seed} leash {leash}: stopping earlier can only keep more \
                 givens (got {}, longer leash kept {longer_givens})",
                givens(&board)
            );
            longer_solves = solves;
            longer_givens = givens(&board);
        }

        // leash = 1 is the degenerate floor: the dig ends at the first refusal,
        // so it pays exactly (holes dug + 1) solves.
        let (board, solves) = dig_counting(3, 1, seed);
        assert_eq!(
            solves,
            81 - givens(&board) + 1,
            "seed {seed}: leash 1 must stop at the very first refusal"
        );
    }

    // The shipped default is a real number a family can override, not a
    // sentinel that disables the stop.
    const { assert!(DEFAULT_REJECTION_LEASH > 0 && DEFAULT_REJECTION_LEASH < usize::MAX) };
}

/// The leash sweep behind [`DEFAULT_REJECTION_LEASH`]: how long a refusal run
/// gets at 9×9 before a removal succeeds again, which is the floor a leash must
/// clear to not cost givens. Reported as an `--ignored` harness rather than
/// asserted — it is a measurement, and the constant it justifies is documented
/// at its definition.
#[test]
#[ignore = "measurement harness — leash sweep"]
fn measure_leash_sweep() {
    for n in [2u32, 3] {
        let side = (n * n) * (n * n);
        for leash in [usize::MAX, 32, 16, 8, 4, 2, 1] {
            let label = if leash == usize::MAX {
                "MAX".to_string()
            } else {
                leash.to_string()
            };
            let mut cells = Vec::new();
            for seed in [1u64, 7, 42, 12345, 99] {
                let (board, solves) = dig_counting(n, leash, seed);
                cells.push(format!("s{seed}:{solves}/{}", givens(&board)));
            }
            println!(
                "{}×{} leash={label:>4}  (solves/givens) {}",
                n * n,
                n * n,
                cells.join("  ")
            );
        }
        println!("  ^ board is {side} cells\n");
    }
}

// ── measurement harness (ignored — 16×16 deals take seconds) ────────────────

fn givens(board: &[u32]) -> usize {
    board.iter().filter(|&&v| v != 0).count()
}

/// One candidate re-solve of a traced dig: how long it took, and whether the
/// dealer accepted it.
#[derive(Clone, Copy)]
struct Attempt {
    ms: f64,
    refused: bool,
    exhausted: bool,
}

/// Any family with the attempt-stop switched off, recording every attempt.
///
/// One unleashed run prices *every* candidate leash, because a leashed dig is a
/// strict PREFIX of the unleashed one — same seed, same shuffled index order,
/// same per-candidate verdicts (the leash only decides when to stop reading
/// them). So the trace replays exactly, and the sweep costs one deal per seed
/// instead of one deal per (seed, leash).
struct Traced<C: PuzzleClass> {
    inner: C,
    attempts: RefCell<Vec<Attempt>>,
}

impl<C: PuzzleClass> Traced<C> {
    fn new(inner: C) -> Self {
        Self {
            inner,
            attempts: RefCell::new(Vec::new()),
        }
    }
}

/// Replay a trace under `leash`: total wall time and holes dug before the stop
/// fires. Mirrors [`generate_by_digging`]'s loop exactly.
fn replay(attempts: &[Attempt], leash: usize) -> (f64, usize) {
    let mut ms = 0.0;
    let mut holes = 0usize;
    let mut refusals = 0usize;
    for a in attempts {
        if refusals >= leash {
            break;
        }
        ms += a.ms;
        if a.refused {
            refusals += 1;
        } else {
            holes += 1;
            refusals = 0;
        }
    }
    (ms, holes)
}

/// The longest run of consecutive refusals in a trace — the floor any leash must
/// clear to not truncate a dig that was still making progress.
fn longest_refusal_run(attempts: &[Attempt]) -> usize {
    let mut run = 0usize;
    let mut max = 0usize;
    for a in attempts {
        if a.refused {
            run += 1;
            max = max.max(run);
        } else {
            run = 0;
        }
    }
    max
}

impl<C: PuzzleClass> PuzzleClass for Traced<C> {
    type Clue = C::Clue;
    type Puzzle = C::Puzzle;
    type Solver = C::Solver;

    fn seed_solution(&self, rng: &mut SimpleRng) -> Vec<u32> {
        self.inner.seed_solution(rng)
    }

    fn place_clues(&self, solution: &[u32], rng: &mut SimpleRng) -> Vec<Self::Clue> {
        self.inner.place_clues(solution, rng)
    }

    fn build_solver(&self, clues: &[Self::Clue]) -> Self::Solver {
        self.inner.build_solver(clues)
    }

    fn solve_candidate(
        &self,
        solver: &mut Self::Solver,
        board: &[u32],
        max_solutions: usize,
    ) -> CandidateOutcome {
        let t0 = Instant::now();
        let outcome = self.inner.solve_candidate(solver, board, max_solutions);
        self.attempts.borrow_mut().push(Attempt {
            ms: t0.elapsed().as_secs_f64() * 1000.0,
            refused: !outcome.proves_unique(),
            exhausted: matches!(outcome, CandidateOutcome::Exhausted(_)),
        });
        outcome
    }

    fn target_holes(&self, board_len: usize) -> usize {
        self.inner.target_holes(board_len)
    }

    fn rejection_leash(&self) -> usize {
        usize::MAX
    }

    fn assemble(&self, board: Vec<u32>, clues: Vec<Self::Clue>) -> Self::Puzzle {
        self.inner.assemble(board, clues)
    }
}

fn summarize(label: &str, rows: &[(u64, f64, usize)]) {
    let mut times: Vec<f64> = rows.iter().map(|r| r.1).collect();
    times.sort_by(|a, b| a.partial_cmp(b).unwrap());
    let mut gs: Vec<usize> = rows.iter().map(|r| r.2).collect();
    gs.sort_unstable();
    println!(
        "{label} MEDIAN {:.1}ms  min {:.1}  max {:.1}  givens median {}  min {} max {}",
        times[times.len() / 2],
        times[0],
        times[times.len() - 1],
        gs[gs.len() / 2],
        gs[0],
        gs[gs.len() - 1]
    );
}

fn bench_thermo(label: &str, difficulty: Difficulty, seeds: &[u64]) {
    let mut rows = Vec::new();
    for &seed in seeds {
        let t0 = Instant::now();
        let (board, _) = generate_thermo_seeded(4, difficulty, seed);
        let ms = t0.elapsed().as_secs_f64() * 1000.0;
        rows.push((seed, ms, givens(&board)));
        println!("{label} seed={seed} {ms:.1}ms givens={}", givens(&board));
    }
    summarize(label, &rows);
}

#[test]
#[ignore = "measurement harness — 16×16 thermo deals take seconds"]
fn measure_thermo_16x16_hard() {
    bench_thermo(
        "thermo/16x16/HARD",
        Difficulty::Hard,
        &[1, 7, 42, 12345, 99],
    );
}

#[test]
#[ignore = "measurement harness — 16×16 thermo deals take seconds"]
fn measure_thermo_16x16_medium() {
    bench_thermo(
        "thermo/16x16/MEDIUM",
        Difficulty::Medium,
        &[1, 7, 42, 12345, 99],
    );
}

/// The skeleton-hoist A/B, repeated: same seeds, `REPS` deals each, median of
/// the per-seed medians. Cheap enough to repeat because it stays off the HARD
/// rung — this measures the *rebuild* the hoist removed, and MEDIUM is where
/// that cost is a visible fraction of the deal instead of noise under
/// multi-second solves.
#[test]
#[ignore = "measurement harness — the skeleton-hoist A/B"]
fn measure_skeleton_hoist() {
    const REPS: usize = 5;
    for (label, n, difficulty) in [
        ("thermo/9x9/MEDIUM", 3u32, Difficulty::Medium),
        ("thermo/9x9/HARD", 3, Difficulty::Hard),
        ("thermo/16x16/MEDIUM", 4, Difficulty::Medium),
    ] {
        let mut medians = Vec::new();
        for seed in [1u64, 7, 42, 12345, 99] {
            let mut runs = Vec::new();
            for _ in 0..REPS {
                let t0 = Instant::now();
                let (board, _) = generate_thermo_seeded(n, difficulty, seed);
                runs.push(t0.elapsed().as_secs_f64() * 1000.0);
                std::hint::black_box(board);
            }
            runs.sort_by(|a, b| a.partial_cmp(b).unwrap());
            let med = runs[runs.len() / 2];
            println!("{label} seed={seed} median-of-{REPS} {med:.2}ms");
            medians.push(med);
        }
        medians.sort_by(|a, b| a.partial_cmp(b).unwrap());
        println!(
            "{label} MEDIAN-OF-MEDIANS {:.2}ms  (min {:.2} max {:.2})\n",
            medians[medians.len() / 2],
            medians[0],
            medians[medians.len() - 1]
        );
    }
}

/// The leash table for a family/difficulty: one unleashed traced deal per seed,
/// replayed under every candidate leash. Prints wall time and given-count per
/// leash so the constant is chosen from the tail it actually collapses and the
/// givens it actually costs.
fn sweep_leash<C, F>(label: &str, cells: usize, seeds: &[u64], make: F)
where
    C: PuzzleClass,
    F: Fn() -> C,
{
    let leashes = [usize::MAX, 64, 32, 16, 12, 8, 6, 4, 3, 2, 1];
    let mut traces = Vec::new();

    for &seed in seeds {
        let class = Traced::new(make());
        let puzzle = generate_by_digging(&class, &mut SimpleRng::new(seed));
        let attempts = class.attempts.borrow().clone();
        let total: f64 = attempts.iter().map(|a| a.ms).sum();
        // The dealt board is `cells - holes`; recover holes from the trace so
        // this works for any `C::Puzzle` shape.
        let holes = attempts.iter().filter(|a| !a.refused).count();
        std::hint::black_box(puzzle);
        println!(
            "{label} seed={seed} unleashed {total:.1}ms attempts={} givens={} \
             longest-refusal-run={} exhausted={}",
            attempts.len(),
            cells - holes,
            longest_refusal_run(&attempts),
            attempts.iter().filter(|a| a.exhausted).count()
        );
        traces.push((seed, attempts));
    }

    println!("\n{label} LEASH TABLE (wall ms / resulting givens), board {cells} cells");
    for leash in leashes {
        let name = if leash == usize::MAX {
            "none".to_string()
        } else {
            leash.to_string()
        };
        let mut times = Vec::new();
        let mut gs = Vec::new();
        let mut per_seed = Vec::new();
        for (seed, attempts) in &traces {
            let (ms, holes) = replay(attempts, leash);
            let g = cells - holes;
            per_seed.push(format!("s{seed}:{ms:.0}/{g}"));
            times.push(ms);
            gs.push(g);
        }
        times.sort_by(|a, b| a.partial_cmp(b).unwrap());
        gs.sort_unstable();
        println!(
            "  leash={name:>4}  median {:>8.1}ms  max {:>8.1}ms  givens {}–{} (median {})   {}",
            times[times.len() / 2],
            times[times.len() - 1],
            gs[0],
            gs[gs.len() - 1],
            gs[gs.len() / 2],
            per_seed.join("  ")
        );
    }
    println!();
}

#[test]
#[ignore = "measurement harness — the unleashed 16×16 HARD deals take minutes"]
fn measure_thermo_16x16_leash_table() {
    const SEEDS: [u64; 5] = [1, 7, 42, 12345, 99];
    sweep_leash("thermo/16x16/MEDIUM", 256, &SEEDS, || {
        ThermoClass::from_difficulty(4, Difficulty::Medium)
    });
    sweep_leash("thermo/16x16/HARD", 256, &SEEDS, || {
        ThermoClass::from_difficulty(4, Difficulty::Hard)
    });
}

/// The same table at 9×9 — the rung the leash must NOT move. A constant chosen
/// off the 16×16 tail is only admissible if the shipped ladder below it is
/// untouched, so this prints the 9×9 refusal runs the leash has to clear.
#[test]
#[ignore = "measurement harness — leash table at 9×9"]
fn measure_9x9_leash_table() {
    const SEEDS: [u64; 5] = [1, 7, 42, 12345, 99];
    sweep_leash("sudoku/9x9/HARD", 81, &SEEDS, || {
        SudokuClass::from_difficulty(3, Difficulty::Hard)
    });
    sweep_leash("sudoku/9x9/MEDIUM", 81, &SEEDS, || {
        SudokuClass::from_difficulty(3, Difficulty::Medium)
    });
    sweep_leash("thermo/9x9/HARD", 81, &SEEDS, || {
        ThermoClass::from_difficulty(3, Difficulty::Hard)
    });
    sweep_leash("killer/9x9/HARD", 81, &SEEDS, || {
        KillerClass::from_difficulty(3, Difficulty::Hard)
    });
}
