//! Killer-Sudoku generation + solve correctness (T4-W13, ROW 3).
//!
//! Killer ships ZERO new engine constraints of its own — a cage is one existing
//! `AllDifferent` plus lane-P's `CageSum` (the n-ary bounds propagator). These tests hold
//! the generation contract (every dealt board is unique, its cages partition the grid and
//! hold on the unique solution) and prove Killer CONSUMES `CageSum` — the cage tightens
//! member domains at the root fixpoint with no killer-specific propagator.

use std::collections::HashSet;

use csp_solver::PuzzleClass;
use csp_solver::domain::Domain;
use csp_solver::ordering::Ordering;
use csp_solver::puzzles::class::SimpleRng;
use csp_solver::puzzles::killer::{
    KillerCage, KillerClass, create_killer_csp, generate_killer_seeded, solve_killer,
};
use csp_solver::puzzles::sudoku::Difficulty;
use csp_solver::{Pruning, SolveConfig};

fn enumerate_config(max_solutions: usize) -> SolveConfig {
    SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::FailFirst,
        max_solutions,
        ..Default::default()
    }
}

/// Every cage's cells are all-different on `solution` and sum to its target.
fn cages_hold(solution: &[u32], cages: &[KillerCage]) -> bool {
    cages.iter().all(|cage| {
        let sum: u32 = cage.cells.iter().map(|&c| solution[c]).sum();
        let mut seen = HashSet::new();
        let distinct = cage.cells.iter().all(|&c| seen.insert(solution[c]));
        sum == cage.sum && distinct
    })
}

#[test]
fn dealt_killer_boards_are_unique_by_construction() {
    // The uniqueness gate (rides W2's uniqueness lane): a `max_solutions: 2` sweep on a
    // dealt batch must return exactly one solution per board. Hard rides here since
    // CH-69's cure (T9-W6): it is the tier that digs to 17 givens, where the unsound
    // GAC over-prune bit hardest, and the oracle grading it is the same solve path — so
    // this row is only worth reading with that cure in the tree. It costs ~0.25s.
    for &n in &[2u32, 3] {
        for &difficulty in &[Difficulty::Easy, Difficulty::Medium, Difficulty::Hard] {
            for &seed in &[1u64, 7, 42, 2026] {
                let (board, cages) = generate_killer_seeded(n, difficulty, seed);

                let solutions = {
                    let (mut csp, given) = create_killer_csp(&board, n, &cages);
                    csp.solve_with_given(&enumerate_config(2), &given)
                };
                assert_eq!(
                    solutions.len(),
                    1,
                    "killer n={n} {difficulty:?} seed={seed} is not unique ({} solutions)",
                    solutions.len()
                );

                // The unique solution respects every cage (all-different + sum).
                assert!(
                    cages_hold(&solutions[0], &cages),
                    "killer n={n} {difficulty:?} seed={seed}: solution violates a cage"
                );

                // Every given cell agrees with the unique completion.
                for (i, &v) in board.iter().enumerate() {
                    if v != 0 {
                        assert_eq!(
                            v, solutions[0][i],
                            "given cell {i} contradicts the solution"
                        );
                    }
                }
            }
        }
    }
}

/// Assert `solution` is a completion of `board` under `cages` — every given agrees,
/// the grid is sudoku-valid, every cage sums and is all-different, and the cages are
/// an exact 81-cell partition. If this holds, the true solution count is >= 1.
fn assert_completes(board: &[u32], solution: &[u32], cages: &[KillerCage]) {
    assert_eq!(board.len(), 81);
    assert_eq!(solution.len(), 81);
    for (i, &v) in board.iter().enumerate() {
        assert!(
            v == 0 || v == solution[i],
            "given at {i} ({v}) contradicts the solution ({})",
            solution[i]
        );
    }
    for g in 0..9usize {
        for (name, vals) in [
            (
                "row",
                (0..9).map(|c| solution[g * 9 + c]).collect::<Vec<u32>>(),
            ),
            (
                "col",
                (0..9).map(|r| solution[r * 9 + g]).collect::<Vec<u32>>(),
            ),
            (
                "box",
                (0..9)
                    .map(|k| solution[((g / 3) * 3 + k / 3) * 9 + (g % 3) * 3 + k % 3])
                    .collect::<Vec<u32>>(),
            ),
        ] {
            let mut s = vals.clone();
            s.sort_unstable();
            assert_eq!(
                s,
                (1..=9).collect::<Vec<u32>>(),
                "{name} {g} is not a permutation of 1..=9"
            );
        }
    }
    let mut covered = vec![0usize; 81];
    for (ci, c) in cages.iter().enumerate() {
        let vals: Vec<u32> = c.cells.iter().map(|&i| solution[i]).collect();
        assert_eq!(vals.iter().sum::<u32>(), c.sum, "cage {ci} sum");
        let mut u = vals.clone();
        u.sort_unstable();
        u.dedup();
        assert_eq!(u.len(), vals.len(), "cage {ci} all-different");
        for &i in &c.cells {
            covered[i] += 1;
        }
    }
    assert!(
        covered.iter().all(|&k| k == 1),
        "cages are not an exact partition"
    );
}

#[test]
fn a_satisfiable_killer_board_never_solves_to_zero() {
    // CH-69 regression (found T9-W4, root-caused + cured T9-W6). Blank a valid Killer
    // solution one cell at a time, re-asserting BEFORE every solve that the solution is
    // still a completion of the board — so the true count can never be zero. It was:
    // the cage `AllDifferent`'s Régin GAC pruned values a maximum matching supported,
    // because the free-value walk ran along the residual graph in the orientation that
    // gives a free value no out-arc (`solver/gac.rs`). Sudoku's row/column/box scopes are
    // square (every value matched, no free vertex) and never tripped it; a cage, whose
    // 2–4 cells range over 9 values, tripped it constantly. Pre-cure this fired at 53
    // blanks on seed 1.
    for &seed in &[1u64, 7, 42] {
        let class = KillerClass::from_difficulty(3, Difficulty::Hard);
        let mut rng = SimpleRng::new(seed);
        let solution = class.seed_solution(&mut rng);
        let cages = class.place_clues(&solution, &mut rng);

        let mut board = solution.clone();
        let mut order: Vec<usize> = (0..81).collect();
        rng.shuffle(&mut order);

        for (k, &idx) in order.iter().enumerate() {
            board[idx] = 0;
            assert_completes(&board, &solution, &cages);

            let (mut csp, given) = create_killer_csp(&board, 3, &cages);
            let n = csp.solve_with_given(&enumerate_config(2), &given).len();
            assert!(
                n >= 1,
                "seed {seed}: after blanking {} cells (last {idx}), a board the seed \
                 solution provably completes solved to ZERO solutions \
                 (budget_exceeded={})",
                k + 1,
                csp.stats().budget_exceeded
            );
        }
    }
}

#[test]
fn dealt_boards_carry_holes_and_a_cage_partition() {
    let (board, cages) = generate_killer_seeded(3, Difficulty::Easy, 99);
    assert_eq!(board.len(), 81);

    let holes = board.iter().filter(|&&v| v == 0).count();
    assert!(holes > 0, "an Easy 9×9 must be dug (had {holes} holes)");
    assert!(!cages.is_empty(), "a dealt board carries cages");

    // The cages PARTITION the board: every cell in exactly one cage, in range.
    let mut seen = [false; 81];
    for cage in &cages {
        assert!(!cage.cells.is_empty(), "an empty cage is nonsense");
        for &c in &cage.cells {
            assert!(c < 81, "cage cell {c} out of range");
            assert!(!seen[c], "cell {c} shared between two cages");
            seen[c] = true;
        }
        // The printed sum is the sum of the cage's cells on the dealt solution.
        assert!(cage.sum > 0, "a cage sum is positive");
    }
    assert!(seen.iter().all(|&s| s), "every cell must belong to a cage");
}

#[test]
fn solve_killer_finds_the_dealt_solution() {
    let (board, cages) = generate_killer_seeded(2, Difficulty::Medium, 7);
    let config = enumerate_config(1);
    let solved = solve_killer(&board, 2, &cages, &config).expect("dealt board solves");
    assert_eq!(solved.len(), 16);
    assert!(solved.iter().all(|&v| (1..=4).contains(&v)));
    assert!(cages_hold(&solved, &cages));
}

#[test]
fn killer_consumes_cage_sum_and_prunes_at_the_root() {
    // The consumption proof: Killer adds NO killer-specific propagator — its cage is lane
    // P's `CageSum` (plus the existing cage `AllDifferent`). Build a bare 9×9 board with a
    // single 3-cell cage summing to 6 and confirm the root AC-3 fixpoint caps each member at
    // 4 (others' min is 1+1 = 2, so each cell ≤ 6 − 2 = 4) — the values 5..9 are pruned. A
    // pure n-ary lambda would leave every domain at 1..=9 (the wall lane P cleared).
    let n = 3u32; // 9×9, values 1..=9
    let board = vec![0u32; 81];
    let cages = vec![KillerCage {
        sum: 6,
        cells: vec![0, 1, 2], // three cells of the top row (contiguous)
    }];

    let (mut csp, given) = create_killer_csp(&board, n, &cages);
    assert!(given.is_empty());
    csp.propagate()
        .expect("an empty 9×9 with one sum-6 cage is consistent");

    // CageSum bounds-consistency caps each member at 6 − (others' min 2) = 4: 1..=4 survive,
    // 5..=9 are pruned. This is the same window `cage.rs`'s unit test banks.
    for &c in &[0usize, 1, 2] {
        let dom = &csp.variables[c].domain;
        assert!(
            dom.contains(&1) && dom.contains(&4),
            "member {c} lost a supported value (1 or 4)"
        );
        assert!(
            !dom.contains(&5) && !dom.contains(&9),
            "member {c} kept 5/9 — CageSum did not prune; Killer would search blind"
        );
    }
}
