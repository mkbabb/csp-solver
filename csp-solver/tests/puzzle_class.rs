//! `PuzzleClass` acceptance: dealing a puzzle through the trait's seams must
//! reproduce the shipped seeded generators byte-for-byte.
//!
//! T4-W11 declares the [`PuzzleClass`] contract and implements it for both
//! shipped families; T4-W13 lands the generic `generate_by_digging<C>` that
//! consumes it. This test *is* that generic dealer, written locally over the
//! trait: if dealing via the seams matches `generate_board_seeded` /
//! `generate_futoshiki_*_seeded` bit-for-bit across sizes, seeds, and
//! difficulties, the trait is the true intersection of the two generators — the
//! contract is drawn right, not merely compiling.

use csp_solver::PuzzleClass;
use csp_solver::puzzles::class::SimpleRng;
use csp_solver::puzzles::futoshiki::{
    self, Difficulty as FutoDifficulty, FutoshikiClass, generate_futoshiki_difficulty_seeded,
    generate_futoshiki_tuned_seeded,
};
use csp_solver::puzzles::sudoku::{
    self, Difficulty as SudokuDifficulty, SudokuClass, generate_board_seeded,
};

/// The generic hole-digging dealer, driven entirely through [`PuzzleClass`] —
/// the shape T4-W13 ships as `generate_by_digging<C>`. Threads one seeded RNG
/// across seed → clue placement → dig, exactly as the shipped generators do.
fn deal_via_trait<C: PuzzleClass>(class: &C, seed: u64) -> C::Puzzle {
    let mut rng = SimpleRng::new(seed);

    let solution = class.seed_solution(&mut rng);
    let clues = class.place_clues(&solution, &mut rng);
    let target = class.target_holes(solution.len());

    let mut board = solution.clone();
    let mut indices: Vec<usize> = (0..solution.len()).collect();
    rng.shuffle(&mut indices);

    let mut holes = 0usize;
    for &idx in &indices {
        if holes >= target {
            break;
        }
        let saved = board[idx];
        board[idx] = 0;
        if class.solve_candidate(&board, &clues, 2).len() == 1 {
            holes += 1;
        } else {
            board[idx] = saved;
        }
    }

    class.assemble(board, clues)
}

#[test]
fn sudoku_dealt_via_trait_matches_shipped_seeded_generator() {
    for &n in &[2u32, 3] {
        for &difficulty in &[
            SudokuDifficulty::Easy,
            SudokuDifficulty::Medium,
            SudokuDifficulty::Hard,
        ] {
            for &seed in &[1u64, 7, 42, 12345] {
                let via = deal_via_trait(&SudokuClass { n, difficulty }, seed);
                let shipped = generate_board_seeded(n, difficulty, seed);
                assert_eq!(
                    via, shipped,
                    "sudoku n={n} {difficulty:?} seed={seed}: dealing through PuzzleClass \
                     diverged from generate_board_seeded"
                );
            }
        }
    }
}

#[test]
fn futoshiki_dealt_via_trait_matches_shipped_difficulty_generator() {
    for &n in &[4u32, 5, 6] {
        for &difficulty in &[
            FutoDifficulty::Easy,
            FutoDifficulty::Medium,
            FutoDifficulty::Hard,
        ] {
            for &seed in &[1u64, 7, 42] {
                let via = deal_via_trait(&FutoshikiClass::from_difficulty(n, difficulty), seed);
                let shipped = generate_futoshiki_difficulty_seeded(n, difficulty, seed);
                assert_eq!(
                    via, shipped,
                    "futoshiki n={n} {difficulty:?} seed={seed}: dealing through PuzzleClass \
                     diverged from generate_futoshiki_difficulty_seeded"
                );
            }
        }
    }
}

#[test]
fn futoshiki_dealt_via_trait_matches_shipped_tuned_generator() {
    // The tuned entry with explicit knobs — the same path the difficulty axis
    // rides, exercised directly to pin the keep-density + inequality-count seam.
    for &n in &[4u32, 5, 6] {
        for &(keep_density, inequality_count) in &[(0.6f64, 4usize), (0.4, 8), (0.75, 5)] {
            for &seed in &[3u64, 99] {
                let class = FutoshikiClass {
                    n,
                    keep_density,
                    inequality_count,
                };
                let via = deal_via_trait(&class, seed);
                let shipped =
                    generate_futoshiki_tuned_seeded(n, keep_density, inequality_count, seed);
                assert_eq!(
                    via, shipped,
                    "futoshiki n={n} keep={keep_density} ineq={inequality_count} seed={seed}: \
                     dealing through PuzzleClass diverged from generate_futoshiki_tuned_seeded"
                );
            }
        }
    }
}

#[test]
fn seed_and_clue_seams_have_the_expected_shape() {
    // Structural sanity on the two seams the families genuinely diverge on: the
    // seed is a full 0-free grid; sudoku places no clue furniture, futoshiki does.
    let mut rng = SimpleRng::new(7);
    let sudoku = SudokuClass {
        n: 3,
        difficulty: SudokuDifficulty::Easy,
    };
    let solution = sudoku.seed_solution(&mut rng);
    assert_eq!(solution.len(), 81);
    assert!(solution.iter().all(|&v| (1..=9).contains(&v)));
    assert!(sudoku.place_clues(&solution, &mut rng).is_empty());

    let mut rng = SimpleRng::new(7);
    let futoshiki = FutoshikiClass::from_difficulty(5, FutoDifficulty::Hard);
    let square = futoshiki.seed_solution(&mut rng);
    assert_eq!(square.len(), 25);
    assert!(square.iter().all(|&v| (1..=5).contains(&v)));
    let carets = futoshiki.place_clues(&square, &mut rng);
    assert!(!carets.is_empty());
    for &(a, b) in &carets {
        assert!(square[a] > square[b], "placed caret must hold on the seed");
    }

    // Keep the crate-root game re-exports referenced so the test also documents
    // the pub paths a downstream family declares against.
    let _ = (sudoku::Difficulty::Easy, futoshiki::Difficulty::Easy);
}
