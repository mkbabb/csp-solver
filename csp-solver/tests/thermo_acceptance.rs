//! `PuzzleClass` acceptance — the third family (T4-W13's Thermo-Sudoku) plugs into the trait
//! with a NOVEL clue type and ZERO trait edits.
//!
//! This is the Rust half of the W11 keystone's contract-acceptance proof (the FE half is
//! `web/frontend/src/games/registry.test.ts`). Thermo-Sudoku carries a clue kind that is
//! NEITHER sudoku's `()` NOR futoshiki's `(usize, usize)` — a *thermometer*, an ordered path
//! of cells whose values strictly increase from the bulb. That it satisfies [`PuzzleClass`]
//! unchanged is the proof the trait is the intersection, not a fork point: W13 lands the real
//! bodies + the generic `generate_by_digging<C>` dealer; here the impl is a compile-time stub
//! (un-shipped, un-registered — it lives in a test crate, never in the built lib).

use csp_solver::PuzzleClass;
use csp_solver::puzzles::class::SimpleRng;

/// A thermometer: cell indices from bulb to tip; the solution's values strictly increase along
/// it. The THIRD clue kind — distinct from sudoku's `()` and futoshiki's `(a, b)`.
type Thermometer = Vec<usize>;

/// Thermo-Sudoku: a standard `n`-subgrid sudoku plus thermometer clue furniture.
struct ThermoClass {
    n: usize,
}

impl PuzzleClass for ThermoClass {
    type Clue = Thermometer;
    type Puzzle = (Vec<u32>, Vec<Thermometer>);

    fn seed_solution(&self, rng: &mut SimpleRng) -> Vec<u32> {
        // STUB (W13 lands the real seed): a dense, 0-free grid the dig can bite into — a
        // shifted-row square, every value in `1..=n²`, no zero. The `&mut SimpleRng` seam is
        // genuinely threaded (a real rng consumer), matching how the shipped seeds start.
        let side = self.n * self.n;
        let base = rng.next_usize(side);
        let mut grid = vec![0u32; side * side];
        for r in 0..side {
            let shift = (base + r * self.n + r / self.n) % side;
            for c in 0..side {
                grid[r * side + c] = ((c + shift) % side) as u32 + 1;
            }
        }
        grid
    }

    fn place_clues(&self, solution: &[u32], _rng: &mut SimpleRng) -> Vec<Self::Clue> {
        // STUB: one two-cell thermometer along the first satisfied ascending adjacency — enough
        // to exercise the clue seam with a real `Thermometer` value (W13 places the full set).
        let side = self.n * self.n;
        for c in 1..side {
            if solution[c] > solution[c - 1] {
                return vec![vec![c - 1, c]];
            }
        }
        Vec::new()
    }

    fn solve_candidate(
        &self,
        board: &[u32],
        _clues: &[Self::Clue],
        max_solutions: usize,
    ) -> Vec<Vec<u32>> {
        // STUB (W13 builds the thermo CSP behind this seam): echo the candidate as its own
        // completion so the dealer's uniqueness probe (`max_solutions: 2`) has a shape to count.
        if max_solutions == 0 {
            Vec::new()
        } else {
            vec![board.to_vec()]
        }
    }

    fn target_holes(&self, board_len: usize) -> usize {
        board_len / 4
    }

    fn assemble(&self, board: Vec<u32>, clues: Vec<Self::Clue>) -> Self::Puzzle {
        (board, clues)
    }
}

/// The generic hole-digging dealer, driven ENTIRELY through [`PuzzleClass`] — the shape W13
/// ships as `generate_by_digging<C>`. That a `C` the trait's authors never saw (Thermo) threads
/// it unchanged is the acceptance proof. Threads one seeded rng across seed → clue placement →
/// dig, exactly as the shipped generators do.
fn deal_via_trait<C: PuzzleClass>(class: &C, seed: u64) -> C::Puzzle {
    let mut rng = SimpleRng::new(seed);
    let solution = class.seed_solution(&mut rng);
    let clues = class.place_clues(&solution, &mut rng);
    let target = class.target_holes(solution.len());

    let mut board = solution.clone();
    let mut indices: Vec<usize> = (0..solution.len()).collect();
    rng.shuffle(&mut indices);
    for &idx in indices.iter().take(target) {
        board[idx] = 0;
        // uniqueness-probe seam (max_solutions: 2), exactly as the shipped generators call it.
        let _ = class.solve_candidate(&board, &clues, 2);
    }
    class.assemble(board, clues)
}

#[test]
fn thermo_sudoku_plugs_into_the_contract_unchanged() {
    let class = ThermoClass { n: 3 };

    // The seed seam yields a dense, 0-free 9×9 grid (seed_solution's contract).
    let mut rng = SimpleRng::new(42);
    let seed = class.seed_solution(&mut rng);
    assert_eq!(seed.len(), 81);
    assert!(seed.iter().all(|&v| v != 0));

    // Dealing through every trait seam yields the paired puzzle + its NOVEL clue furniture
    // (a `Vec<Thermometer>` — neither sudoku's `()` nor futoshiki's `(a, b)`).
    let (board, thermos): (Vec<u32>, Vec<Thermometer>) = deal_via_trait(&class, 42);
    assert_eq!(board.len(), 81);
    assert!(thermos.iter().all(|t| t.len() >= 2));
}
