//! Thermo-Sudoku generation + solve correctness (T4-W13, ROW 1).
//!
//! Thermo ships with ZERO new engine constraints — a thermometer is a chain of binary
//! `less_than`, the propagating path. These tests hold the generation contract (every dealt
//! board is unique, its thermometers hold on the unique solution) and prove the free path
//! actually prunes (the binary chain tightens domains — the point of shipping thermo first).

use csp_solver::domain::Domain;
use csp_solver::ordering::Ordering;
use csp_solver::puzzles::sudoku::Difficulty;
use csp_solver::puzzles::thermo::{create_thermo_csp, generate_thermo_seeded, solve_thermo};
use csp_solver::{Pruning, SolveConfig};

fn enumerate_config(max_solutions: usize) -> SolveConfig {
    SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::FailFirst,
        max_solutions,
        ..Default::default()
    }
}

/// A dealt board's thermometer values strictly increase bulb → tip on `solution`.
fn thermometers_hold(solution: &[u32], thermos: &[Vec<usize>]) -> bool {
    thermos.iter().all(|t| {
        t.windows(2)
            .all(|pair| solution[pair[1]] > solution[pair[0]])
    })
}

#[test]
fn dealt_thermo_boards_are_unique_by_construction() {
    // The uniqueness gate (rides W2's uniqueness lane): a `max_solutions: 2` sweep on a
    // dealt batch must return exactly one solution per board.
    for &n in &[2u32, 3] {
        for &difficulty in &[Difficulty::Easy, Difficulty::Medium] {
            for &seed in &[1u64, 7, 42, 2026] {
                let (board, thermos) = generate_thermo_seeded(n, difficulty, seed);

                let solutions = {
                    let (mut csp, given) = create_thermo_csp(&board, n, &thermos);
                    csp.solve_with_given(&enumerate_config(2), &given)
                };
                assert_eq!(
                    solutions.len(),
                    1,
                    "thermo n={n} {difficulty:?} seed={seed} is not unique ({} solutions)",
                    solutions.len()
                );

                // The unique solution respects every thermometer.
                assert!(
                    thermometers_hold(&solutions[0], &thermos),
                    "thermo n={n} {difficulty:?} seed={seed}: solution violates a tube"
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
fn dealt_boards_carry_holes_and_thermometers() {
    let (board, thermos) = generate_thermo_seeded(3, Difficulty::Easy, 99);
    assert_eq!(board.len(), 81);
    let holes = board.iter().filter(|&&v| v == 0).count();
    assert!(holes > 0, "an Easy 9×9 must be dug (had {holes} holes)");
    assert!(!thermos.is_empty(), "a dealt board carries thermometers");
    // Thermometer cells are in range and disjoint across tubes.
    let mut seen = std::collections::HashSet::new();
    for t in &thermos {
        assert!(t.len() >= 2);
        for &c in t {
            assert!(c < 81, "thermo cell {c} out of range");
            assert!(seen.insert(c), "thermo cell {c} shared between two tubes");
        }
    }
}

#[test]
fn solve_thermo_finds_the_dealt_solution() {
    let (board, thermos) = generate_thermo_seeded(2, Difficulty::Medium, 7);
    let config = enumerate_config(1);
    let solved = solve_thermo(&board, 2, &thermos, &config).expect("dealt board solves");
    assert_eq!(solved.len(), 16);
    assert!(solved.iter().all(|&v| (1..=4).contains(&v)));
    assert!(thermometers_hold(&solved, &thermos));
}

#[test]
fn a_thermometer_chain_prunes_the_free_path() {
    // The point of shipping thermo FIRST: its clue needs zero new constraint code because a
    // binary `less_than` already propagates (Wall-1's free path). Prove it — a bare chain
    // a<b<c on an empty 9×9 (no givens) must tighten domains at the root AC-3 fixpoint: the
    // bulb loses the top values, the tip loses the bottom, or the constraint did nothing.
    let n = 3u32; // 9×9, values 1..=9
    let board = vec![0u32; 81];
    let thermo = vec![vec![0usize, 1, 2, 3]]; // a 4-cell tube along the first row: c0<c1<c2<c3

    let (mut csp, given) = create_thermo_csp(&board, n, &thermo);
    assert!(given.is_empty());
    csp.propagate()
        .expect("an empty board with one tube is consistent");

    // Bulb (cell 0): three cells must exceed it, so it can be at most 9−3 = 6.
    let bulb = &csp.variables[0].domain;
    assert!(
        !bulb.contains(&7),
        "bulb kept 7 — the less_than chain did not prune the top"
    );
    assert!(
        !bulb.contains(&9),
        "bulb kept 9 — the less_than chain did not prune the top"
    );
    assert!(bulb.contains(&1), "bulb should still admit 1");

    // Tip (cell 3): three cells below it, so it must be at least 4.
    let tip = &csp.variables[3].domain;
    assert!(
        !tip.contains(&3),
        "tip kept 3 — the less_than chain did not prune the bottom"
    );
    assert!(
        !tip.contains(&1),
        "tip kept 1 — the less_than chain did not prune the bottom"
    );
    assert!(tip.contains(&9), "tip should still admit 9");
}
