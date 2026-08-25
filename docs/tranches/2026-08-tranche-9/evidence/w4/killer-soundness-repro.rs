//! Scratch probe 7: bulletproof repro. Assert the solution completes the board,
//! then solve it.
use csp_solver::PuzzleClass;
use csp_solver::ordering::Ordering;
use csp_solver::puzzles::class::SimpleRng;
use csp_solver::puzzles::killer::{KillerCage, KillerClass, create_killer_csp};
use csp_solver::puzzles::sudoku::Difficulty;
use csp_solver::{Pruning, SolveConfig};

fn cfg(max: usize) -> SolveConfig {
    SolveConfig { pruning: Pruning::Ac3, ordering: Ordering::FailFirst, max_solutions: max,
                  node_budget: None, ..Default::default() }
}

fn assert_completes(board: &[u32], solution: &[u32], cages: &[KillerCage]) {
    assert_eq!(board.len(), 81);
    assert_eq!(solution.len(), 81);
    for (i, &v) in board.iter().enumerate() {
        assert!(v == 0 || v == solution[i], "given at {i} ({v}) contradicts the solution ({})", solution[i]);
    }
    for g in 0..9usize {
        for (name, vals) in [
            ("row", (0..9).map(|c| solution[g * 9 + c]).collect::<Vec<u32>>()),
            ("col", (0..9).map(|r| solution[r * 9 + g]).collect::<Vec<u32>>()),
            ("box", (0..9).map(|k| solution[((g / 3) * 3 + k / 3) * 9 + (g % 3) * 3 + k % 3]).collect::<Vec<u32>>()),
        ] {
            let mut s = vals.clone(); s.sort_unstable();
            assert_eq!(s, (1..=9).collect::<Vec<u32>>(), "{name} {g} is not a permutation of 1..=9");
        }
    }
    let mut covered = vec![0usize; 81];
    for (ci, c) in cages.iter().enumerate() {
        let vals: Vec<u32> = c.cells.iter().map(|&i| solution[i]).collect();
        assert_eq!(vals.iter().sum::<u32>(), c.sum, "cage {ci} sum");
        let mut u = vals.clone(); u.sort_unstable(); u.dedup();
        assert_eq!(u.len(), vals.len(), "cage {ci} all-different");
        for &i in &c.cells { covered[i] += 1; }
    }
    assert!(covered.iter().all(|&k| k == 1), "cages are not an exact partition");
}

#[test]
fn a_satisfiable_killer_board_must_not_solve_to_zero() {
    let class = KillerClass::from_difficulty(3, Difficulty::Hard);
    let mut rng = SimpleRng::new(1);
    let solution = class.seed_solution(&mut rng);
    let cages = class.place_clues(&solution, &mut rng);

    let mut board = solution.clone();
    let mut order: Vec<usize> = (0..81).collect();
    rng.shuffle(&mut order);

    for (k, &idx) in order.iter().enumerate() {
        board[idx] = 0;
        // The invariant, checked BEFORE every solve: `solution` is still a
        // completion of `board` under `cages`. So the true count is >= 1.
        assert_completes(&board, &solution, &cages);

        let (mut csp, given) = create_killer_csp(&board, 3, &cages);
        let n = csp.solve_with_given(&cfg(2), &given).len();
        assert!(
            n >= 1,
            "after blanking {} cells (last {idx}), a board the seed solution \
             provably completes solved to ZERO solutions (budget_exceeded={})",
            k + 1, csp.stats().budget_exceeded
        );
    }
}
