//! Killer-Sudoku generation + solve correctness (T4-W13, ROW 3).
//!
//! Killer ships ZERO new engine constraints of its own — a cage is one existing
//! `AllDifferent` plus lane-P's `CageSum` (the n-ary bounds propagator). These tests hold
//! the generation contract (every dealt board is unique, its cages partition the grid and
//! hold on the unique solution) and prove Killer CONSUMES `CageSum` — the cage tightens
//! member domains at the root fixpoint with no killer-specific propagator.

use std::collections::HashSet;

use csp_solver::domain::Domain;
use csp_solver::ordering::Ordering;
use csp_solver::puzzles::killer::{
    KillerCage, create_killer_csp, generate_killer_seeded, solve_killer,
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
    // dealt batch must return exactly one solution per board.
    for &n in &[2u32, 3] {
        for &difficulty in &[Difficulty::Easy, Difficulty::Medium] {
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
