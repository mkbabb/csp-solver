//! Killer-Sudoku generation — the `CageSum` consumer (ROW 3).
//!
//! Generation is the three-beat dealer every [`PuzzleClass`] shares:
//!
//! 1. **seed** — a full Sudoku solution (the sudoku skeleton solved with a
//!    shuffled first row), reusing the crate solver, never a bespoke square.
//! 2. **place clues** — partition the seed into contiguous, size-banded cages
//!    whose cells hold DISTINCT seed values (so each cage's all-different holds)
//!    and sum each cage on the seed (so each `CageSum` target holds). Every cell
//!    lands in exactly one cage — the seed already satisfies every cage.
//! 3. **dig** — the uniqueness-checked hole-dig, with the full cage set present
//!    in every candidate CSP (the cages are never blanked; a singleton cage even
//!    keeps a dug cell determined by its sum).
//!
//! [`KillerClass`] names those beats as [`PuzzleClass`] seams; the shared
//! [`generate_by_digging`](crate::puzzles::class::generate_by_digging) dealer
//! drives them — Killer lands with one impl and one payload builder, no new
//! generator and no new constraint (it consumes lane P's `CageSum`). Difficulty
//! is the sudoku [`Difficulty`] axis reused verbatim (a Killer-Sudoku *is* a
//! Sudoku variant — same keep bands, no fourth mirror).

use crate::ordering::Ordering;
use crate::puzzles::class::{PuzzleClass, SimpleRng, generate_by_digging};
use crate::puzzles::sudoku::Difficulty;
use crate::puzzles::sudoku::csp::{sudoku_csp_skeleton, sudoku_given};
use crate::{Pruning, SolveConfig};

use super::csp::{KillerCage, create_killer_csp};

/// Largest cage grown. Kept small so a dealt board stays legible and the cage
/// all-different / sum stay quick — classic Killer cages run 1..5 cells; 2..4
/// (with singleton fallback) is a clean, well-conditioned band.
const MAX_CAGE_LEN: usize = 4;

/// Build the seed/uniqueness solve config: the `Ac3` + `FailFirst` pairing the
/// sudoku, futoshiki, and thermo generators seed and uniqueness-check with.
/// `Ac3` is the load-bearing choice (`ForwardChecking` cannot seed larger
/// boards).
fn gen_config(max_solutions: usize) -> SolveConfig {
    SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::FailFirst,
        max_solutions,
        ..Default::default()
    }
}

/// Seed a complete Sudoku solution for sub-grid size `n`: fix a shuffled first
/// row on the reusable skeleton and solve. Dense, `0`-free, length `(n²)²`.
fn seed_sudoku_solution(n: u32, rng: &mut SimpleRng) -> Vec<u32> {
    let m = n * n;
    let total = (m * m) as usize;

    let mut csp = sudoku_csp_skeleton(n);
    let mut seed_board = vec![0u32; total];
    let mut first_row: Vec<u32> = (1..=m).collect();
    rng.shuffle(&mut first_row);
    seed_board[..m as usize].copy_from_slice(&first_row);

    csp.solve_with_given(&gen_config(1), &sudoku_given(&seed_board))
        .into_iter()
        .next()
        .expect("a seeded Sudoku board with a fixed first row is always solvable")
}

/// The orthogonal (row/column) neighbours of `cell` on an `m×m` grid.
fn ortho_neighbours(cell: usize, m: usize) -> Vec<usize> {
    let (r, c) = (cell / m, cell % m);
    let mut out = Vec::with_capacity(4);
    if c + 1 < m {
        out.push(cell + 1);
    }
    if c > 0 {
        out.push(cell - 1);
    }
    if r + 1 < m {
        out.push(cell + m);
    }
    if r > 0 {
        out.push(cell - m);
    }
    out
}

/// Partition the `solution` into contiguous cages whose cells hold distinct seed
/// values. Every cell lands in exactly one cage.
///
/// Cells are visited in shuffled order; each unassigned cell seeds a fresh cage
/// with a random target size in `2..=MAX_CAGE_LEN`, then grows by absorbing a
/// random unassigned orthogonal neighbour of ANY cage cell whose seed value is
/// not already in the cage — so the cage all-different holds on the seed. A cell
/// hemmed in by taken / same-value neighbours simply stays a singleton (a cage
/// of one, sum = its own value: the [`CageSum`] pins the cell even when dug).
///
/// Value-distinctness is always reachable (a cell can always be its own cage),
/// so the partition never wedges — the mirror of `place_inequalities` /
/// `place_thermometers` picking clue furniture the seed already satisfies.
fn partition_into_cages(solution: &[u32], n: u32, rng: &mut SimpleRng) -> Vec<KillerCage> {
    let m = (n * n) as usize;
    let total = solution.len();

    const UNASSIGNED: usize = usize::MAX;
    let mut cage_of = vec![UNASSIGNED; total];
    let mut cages: Vec<Vec<usize>> = Vec::new();

    let mut order: Vec<usize> = (0..total).collect();
    rng.shuffle(&mut order);

    for &start in &order {
        if cage_of[start] != UNASSIGNED {
            continue;
        }
        let id = cages.len();
        let mut cells = vec![start];
        cage_of[start] = id;
        let target = 2 + rng.next_usize(MAX_CAGE_LEN - 1); // 2..=MAX_CAGE_LEN

        while cells.len() < target {
            // Unassigned orthogonal neighbours of ANY cage cell whose seed value
            // is not already in the cage (dedup preserves the deterministic scan
            // order — no sort, which would drag the unstable-sort codegen in).
            let mut candidates: Vec<usize> = Vec::new();
            for &c in &cells {
                for nb in ortho_neighbours(c, m) {
                    if cage_of[nb] == UNASSIGNED
                        && !cells.iter().any(|&cc| solution[cc] == solution[nb])
                        && !candidates.contains(&nb)
                    {
                        candidates.push(nb);
                    }
                }
            }
            if candidates.is_empty() {
                break;
            }
            let next = candidates[rng.next_usize(candidates.len())];
            cage_of[next] = id;
            cells.push(next);
        }

        cages.push(cells);
    }

    cages
        .into_iter()
        .map(|mut cells| {
            cells.sort_unstable(); // stable corner = smallest index (the sum label cell)
            let sum = cells.iter().map(|&c| solution[c]).sum();
            KillerCage { sum, cells }
        })
        .collect()
}

/// Sudoku hole bands (reused verbatim): the clue-count target for a `board_len`
/// board at `difficulty`.
fn target_holes_for(difficulty: Difficulty, board_len: usize) -> usize {
    match difficulty {
        Difficulty::Easy => board_len / 4,
        Difficulty::Medium => (board_len as f64 / 1.75) as usize,
        Difficulty::Hard => (board_len as f64 / 1.25) as usize,
    }
}

/// A Killer-Sudoku instance to deal: sub-grid size `n` (3 ⇒ 9×9) at
/// `difficulty`.
///
/// The [`PuzzleClass`] witness expressing Killer-Sudoku's generation as the
/// generic dealer's seams — the fourth family, plugged in with a clue kind
/// ([`KillerCage`]) that is none of sudoku's `()`, futoshiki's `(a, b)`, or
/// thermo's `Vec<usize>`, and CONSUMING lane P's `CageSum` (no new constraint).
pub struct KillerClass {
    /// Sub-grid size — the board is `n²×n²` (3 ⇒ 9×9).
    pub n: u32,
    /// Difficulty rung — the sudoku [`Difficulty`] axis, reused.
    pub difficulty: Difficulty,
}

impl KillerClass {
    /// Build the instance for a `difficulty` rung.
    pub fn from_difficulty(n: u32, difficulty: Difficulty) -> Self {
        Self { n, difficulty }
    }
}

impl PuzzleClass for KillerClass {
    /// A Killer cage — the fourth clue kind.
    type Clue = KillerCage;
    /// The dense board paired with its cage furniture.
    type Puzzle = (Vec<u32>, Vec<KillerCage>);

    fn seed_solution(&self, rng: &mut SimpleRng) -> Vec<u32> {
        seed_sudoku_solution(self.n, rng)
    }

    fn place_clues(&self, solution: &[u32], rng: &mut SimpleRng) -> Vec<KillerCage> {
        partition_into_cages(solution, self.n, rng)
    }

    fn solve_candidate(
        &self,
        board: &[u32],
        clues: &[KillerCage],
        max_solutions: usize,
    ) -> Vec<Vec<u32>> {
        let (mut csp, given) = create_killer_csp(board, self.n, clues);
        csp.solve_with_given(&gen_config(max_solutions), &given)
    }

    fn target_holes(&self, board_len: usize) -> usize {
        target_holes_for(self.difficulty, board_len)
    }

    fn assemble(&self, board: Vec<u32>, clues: Vec<KillerCage>) -> Self::Puzzle {
        (board, clues)
    }
}

/// Generate a Killer-Sudoku puzzle for `n` and `difficulty`, seeding from the
/// wall clock. Returns `(board, cages)`: `board` is the dense given grid
/// (`0` = blank), `cages` the contiguous all-different sum-cages partitioning it.
pub fn generate_killer(n: u32, difficulty: Difficulty) -> (Vec<u32>, Vec<KillerCage>) {
    generate_by_digging(
        &KillerClass::from_difficulty(n, difficulty),
        &mut SimpleRng::from_time(),
    )
}

/// Seeded, platform-independent counterpart of [`generate_killer`].
///
/// Threads an explicit `seed` instead of the wall clock (which panics on
/// `wasm32-unknown-unknown` — no clock there). Same `seed` + `n` + `difficulty`
/// ⇒ the same puzzle on native and wasm, the client-solve parity invariant.
pub fn generate_killer_seeded(
    n: u32,
    difficulty: Difficulty,
    seed: u64,
) -> (Vec<u32>, Vec<KillerCage>) {
    generate_by_digging(
        &KillerClass::from_difficulty(n, difficulty),
        &mut SimpleRng::new(seed),
    )
}
