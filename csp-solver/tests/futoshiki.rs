//! Futoshiki puzzle tests.

use csp_solver::CspError;
use csp_solver::ordering::Ordering;
use csp_solver::puzzles::futoshiki::{
    create_futoshiki_csp, generate_futoshiki_seeded, generate_futoshiki_tuned_seeded,
    measure_difficulty, parse_futoshiki, solve_futoshiki, validate_futoshiki,
};
use csp_solver::{Pruning, SolveConfig};

// ─── Helpers ────────────────────────────────────────────────────────────────

/// Assert a flat `n²` vector is a valid Latin square: every row and every
/// column a permutation of `1..=n`.
fn assert_latin_square(sol: &[u32], n: u32) {
    let nn = n as usize;
    assert_eq!(sol.len(), nn * nn, "solution must be {nn}×{nn}");
    for r in 0..nn {
        let mut row: Vec<u32> = (0..nn).map(|c| sol[r * nn + c]).collect();
        row.sort_unstable();
        row.dedup();
        assert_eq!(row.len(), nn, "row {r} not all-different");
    }
    for c in 0..nn {
        let mut col: Vec<u32> = (0..nn).map(|r| sol[r * nn + c]).collect();
        col.sort_unstable();
        col.dedup();
        assert_eq!(col.len(), nn, "col {c} not all-different");
    }
}

/// Solve with a uniqueness-probing config (`Ac3` + `FailFirst`, up to 2
/// solutions) — enough to distinguish "unique" from "ambiguous".
fn solve_up_to_two(board: &[u32], n: u32, inequalities: &[(usize, usize)]) -> Vec<Vec<u32>> {
    let (mut csp, given) = create_futoshiki_csp(board, n, inequalities);
    let config = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::FailFirst,
        max_solutions: 2,
        ..Default::default()
    };
    csp.solve_with_given(&config, &given)
}

/// The shipped solve policy (the F1 override), at a caller-chosen solution cap.
fn production_config(max_solutions: usize) -> SolveConfig {
    SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::Mrv,
        max_solutions,
        ..Default::default()
    }
}

// ─── Solving (existing behavior, preserved across the F1 override) ───────────

#[test]
fn solve_4x4_futoshiki() {
    // 4×4 puzzle:
    // Fixed: cell 0 = 1, cell 5 = 3
    // Inequality: cell 1 > cell 2 (row 0: col 1 > col 2)
    let input = "4\n0 5\n1 3\n1\n2\n";
    let (n, board, inequalities) = parse_futoshiki(input);

    assert_eq!(n, 4);
    assert_eq!(board[0], 1);
    assert_eq!(board[5], 3);
    assert_eq!(inequalities, vec![(1, 2)]);

    // Every solution, not just the first: the enumerate-all set is the
    // trajectory-invariant one.
    let (mut csp, given) = create_futoshiki_csp(&board, n, &inequalities);
    let solutions = csp.solve_with_given(&production_config(usize::MAX), &given);
    assert!(
        !solutions.is_empty(),
        "puzzle should have at least one solution"
    );

    for sol in &solutions {
        assert_eq!(sol.len(), 16);
        assert_eq!(sol[0], 1);
        assert_eq!(sol[5], 3);
        assert!(
            sol[1] > sol[2],
            "cell 1 ({}) must be > cell 2 ({})",
            sol[1],
            sol[2]
        );
        assert_latin_square(sol, 4);
    }

    // The conforming first-solution seam agrees with the set.
    let first = solve_futoshiki(&board, n, &inequalities, &production_config(1))
        .expect("puzzle should have at least one solution");
    assert!(solutions.contains(&first));
}

#[test]
fn solve_3x3_trivial() {
    // 3×3, no fixed cells, no inequalities — 12 Latin squares. The Ac3+Mrv
    // override must still enumerate all of them exhaustively.
    let input = "3\n\n\n\n\n";
    let (n, board, inequalities) = parse_futoshiki(input);
    let (mut csp, given) = create_futoshiki_csp(&board, n, &inequalities);
    let solutions = csp.solve_with_given(&production_config(usize::MAX), &given);
    assert_eq!(
        solutions.len(),
        12,
        "3×3 unconstrained has 12 Latin squares"
    );
}

// ─── F1 regression (G0) ──────────────────────────────────────────────────────

/// The shipped `ForwardChecking` + `FailFirst` config blew the 1M-node budget
/// on an *empty* N≥6 board (4.56M backtracks at N=6). The `Ac3` + `Mrv`
/// production override finds a first solution in 0 backtracks. Guards N=4–7
/// (the max shipped size), asserting `budget_exceeded == false` throughout.
#[test]
fn empty_board_solves_within_budget_up_to_n7() {
    for n in 4u32..=7 {
        let board = vec![0u32; (n * n) as usize];
        validate_futoshiki(&board, n, &[]).unwrap();
        let (mut csp, given) = create_futoshiki_csp(&board, n, &[]);
        let solutions = csp.solve_with_given(&production_config(1), &given);

        assert_eq!(
            solutions.len(),
            1,
            "empty {n}×{n} board must yield a Latin square"
        );
        assert!(
            !csp.stats().budget_exceeded,
            "N={n}: empty board must solve within the node budget (F1 regression)"
        );
        assert_eq!(
            csp.stats().backtracks,
            0,
            "N={n}: empty board must solve in 0 backtracks under Ac3+Mrv"
        );
        assert_latin_square(&solutions[0], n);
    }
}

// ─── Validation: validate_futoshiki (G3, Rust boundary) ──────────────────────

#[test]
fn validate_accepts_valid_adjacent_pairs() {
    // 4×4: cell 5 (row 1, col 1) and cell 6 (row 1, col 2) share an edge;
    // cell 5 and cell 9 (row 2, col 1) share an edge (vertical).
    let mut board = vec![0u32; 16];
    board[0] = 1;
    validate_futoshiki(&board, 4, &[(5, 6), (5, 9)])
        .expect("adjacent pairs within range must be accepted");
}

#[test]
fn validate_rejects_nonadjacent_pair() {
    // Cells 0 (0,0) and 15 (3,3) are opposite corners — Manhattan distance 6.
    let err = validate_futoshiki(&[0u32; 16], 4, &[(0, 15)])
        .expect_err("a non-adjacent pair must be rejected");
    assert_eq!(err.code(), "INVALID_INPUT");
    assert!(matches!(err, CspError::InvalidInput { .. }));
}

#[test]
fn validate_rejects_diagonal_pair() {
    // Cells 0 (0,0) and 5 (1,1) are diagonal — Manhattan distance 2, not 1.
    let err = validate_futoshiki(&[0u32; 16], 4, &[(0, 5)])
        .expect_err("a diagonal pair must be rejected");
    assert_eq!(err.code(), "INVALID_INPUT");
}

#[test]
fn validate_rejects_out_of_range_inequality_index() {
    let err = validate_futoshiki(&[0u32; 16], 4, &[(0, 16)])
        .expect_err("an index >= n² must be rejected");
    assert_eq!(err.code(), "INVALID_INPUT");
}

#[test]
fn validate_rejects_bad_board() {
    // Value out of range (5 on a 4×4 board).
    let mut board = vec![0u32; 16];
    board[0] = 5;
    let err = validate_futoshiki(&board, 4, &[]).expect_err("value > n must be rejected");
    assert_eq!(err.code(), "INVALID_INPUT");
    // Board length that does not match n².
    let err = validate_futoshiki(&[0u32; 17], 4, &[])
        .expect_err("a board that is not n² cells must be rejected");
    assert_eq!(err.code(), "INVALID_INPUT");
}

// ─── Generation ──────────────────────────────────────────────────────────────

/// Every generated puzzle (N=4–7, shipped range) must: pass `validate_futoshiki`
/// validation (adjacency-valid carets, in-range givens), have exactly one
/// solution, and that solution must honor every inequality.
#[test]
fn generated_puzzles_are_unique_and_valid() {
    for n in 4u32..=7 {
        let (board, inequalities) = generate_futoshiki_seeded(n, 0xF0_00 + n as u64);
        assert_eq!(board.len(), (n * n) as usize);

        // Generation output must round-trip through the wire validator.
        validate_futoshiki(&board, n, &inequalities)
            .unwrap_or_else(|e| panic!("N={n}: generated puzzle failed validation: {e}"));

        // Inequalities must be renderable carets and correctly oriented.
        for &(a, b) in &inequalities {
            let (ra, ca) = (a / n as usize, a % n as usize);
            let (rb, cb) = (b / n as usize, b % n as usize);
            assert_eq!(
                ra.abs_diff(rb) + ca.abs_diff(cb),
                1,
                "N={n}: inequality ({a},{b}) is not orthogonally adjacent"
            );
        }

        let solutions = solve_up_to_two(&board, n, &inequalities);
        assert_eq!(
            solutions.len(),
            1,
            "N={n}: generated puzzle must have exactly one solution"
        );

        let sol = &solutions[0];
        assert_latin_square(sol, n);

        // The unique solution must agree with every given and satisfy carets.
        for (i, &v) in board.iter().enumerate() {
            if v != 0 {
                assert_eq!(sol[i], v, "N={n}: solution disagrees with given cell {i}");
            }
        }
        for &(a, b) in &inequalities {
            assert!(
                sol[a] > sol[b],
                "N={n}: solution violates inequality cell {a} > cell {b}"
            );
        }
    }
}

/// The parametric generator honors its keep-density: a ~75% tier keeps roughly
/// three-quarters of the cells as givens.
#[test]
fn tuned_generation_respects_keep_density() {
    let n = 6u32;
    let total = (n * n) as usize;
    let (board, _ineqs) = generate_futoshiki_tuned_seeded(n, 0.75, n as usize, 42);
    let kept = board.iter().filter(|&&v| v != 0).count();
    // Hole-digging stops at the target; it may keep more when uniqueness blocks
    // a removal, never fewer. Floor at the target, ceiling at total.
    let target_kept = (total as f64 * 0.75).round() as usize;
    assert!(
        kept >= target_kept && kept <= total,
        "N={n}: kept {kept} givens, expected >= {target_kept} (target) and <= {total}"
    );
}

/// `measure_difficulty` runs on a generated board with its inequality set and
/// returns a finite backtrack count (calibration input — G2). At the shipped
/// high-density tier the naive FC+FailFirst solver stays well within budget.
#[test]
fn measure_difficulty_is_bounded_at_shipped_density() {
    for n in 4u32..=7 {
        let (board, inequalities) = generate_futoshiki_seeded(n, 0xD1_00 + n as u64);
        let bt = measure_difficulty(&board, n, &inequalities);
        // A generated 75%-density board is trivially FC-solvable; a runaway
        // count here would mean the board is far harder than the tier claims.
        assert!(
            bt < 1_000_000,
            "N={n}: measure_difficulty returned {bt} backtracks (expected within budget)"
        );
    }
}
