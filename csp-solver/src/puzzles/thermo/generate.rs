//! Thermo-Sudoku generation — the contract proof (zero new constraints).
//!
//! Generation is the three-beat dealer every [`PuzzleClass`] shares:
//!
//! 1. **seed** — a full Sudoku solution (the sudoku skeleton solved with a
//!    shuffled first row), reusing the crate solver, never a bespoke square.
//! 2. **place clues** — grow thermometers on strictly-ascending orthogonal
//!    runs of the seed (the mirror of `futoshiki::place_inequalities`), so the
//!    seed already satisfies every tube and each renders as a bulb+tube.
//! 3. **dig** — the uniqueness-checked hole-dig, with the full thermometer set
//!    present in every candidate CSP (furniture is never blanked).
//!
//! [`ThermoClass`] names those beats as [`PuzzleClass`] seams; the shared
//! [`generate_by_digging`](crate::puzzles::class::generate_by_digging) dealer
//! drives them — Thermo lands with one impl and one payload builder, no new
//! generator. Difficulty is the sudoku [`Difficulty`] axis reused verbatim (a
//! Thermo-Sudoku *is* a Sudoku variant — the same keep bands, no fourth mirror).

use crate::ordering::Ordering;
use crate::puzzles::class::{PuzzleClass, SimpleRng, generate_by_digging};
use crate::puzzles::sudoku::Difficulty;
use crate::puzzles::sudoku::csp::{sudoku_csp_skeleton, sudoku_given};
use crate::{Pruning, SolveConfig};

use super::csp::{Thermometer, create_thermo_csp};

/// Longest thermometer tube placed. Kept short so a dealt board stays legible —
/// a carpet of one enormous snake is neither a good puzzle nor good furniture.
const MAX_THERMO_LEN: usize = 5;

/// Build the seed/uniqueness solve config: the `Ac3` + `FailFirst` pairing the
/// sudoku and futoshiki generators seed and uniqueness-check with. `Ac3` is the
/// load-bearing choice (`ForwardChecking` cannot seed larger boards).
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

/// Place up to `count` thermometers on strictly-ascending orthogonal runs of the
/// `solution`. Each tube starts at a random unused cell (the bulb) and greedily
/// climbs to an unused orthogonal neighbour of strictly greater value until it
/// stalls or hits [`MAX_THERMO_LEN`]. Cells are never shared between tubes.
///
/// Orthogonal neighbours in a Sudoku solution share a row or column and so
/// always differ, so the strict-increase direction is unambiguous — the mirror
/// of `place_inequalities` picking pairs the seed already satisfies.
fn place_thermometers(
    solution: &[u32],
    n: u32,
    count: usize,
    rng: &mut SimpleRng,
) -> Vec<Thermometer> {
    let m = (n * n) as usize;
    let total = solution.len();

    let mut used = vec![false; total];
    let mut starts: Vec<usize> = (0..total).collect();
    rng.shuffle(&mut starts);

    let mut thermos: Vec<Thermometer> = Vec::new();
    for &start in &starts {
        if thermos.len() >= count {
            break;
        }
        if used[start] {
            continue;
        }

        let mut path = vec![start];
        used[start] = true;
        let mut cur = start;

        while path.len() < MAX_THERMO_LEN {
            // `ortho_neighbours` yields a fixed order (right, left, down, up) and
            // `filter` preserves it, so the candidate list is already
            // deterministic — no sort (a `sort_unstable` here would drag the
            // entire unstable-sort codegen into the lean wasm for nothing).
            let candidates: Vec<usize> = ortho_neighbours(cur, m)
                .into_iter()
                .filter(|&nb| !used[nb] && solution[nb] > solution[cur])
                .collect();
            if candidates.is_empty() {
                break;
            }
            let next = candidates[rng.next_usize(candidates.len())];
            used[next] = true;
            path.push(next);
            cur = next;
        }

        if path.len() >= 2 {
            thermos.push(path);
        } else {
            used[start] = false; // a length-1 run is not a thermometer — free the cell
        }
    }

    thermos
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

/// A Thermo-Sudoku instance to deal: sub-grid size `n` (3 ⇒ 9×9) at
/// `difficulty`, carrying up to `thermo_count` thermometers.
///
/// The [`PuzzleClass`] witness expressing Thermo-Sudoku's generation as the
/// generic dealer's seams — the third family, plugged in with a clue kind
/// (`Vec<Thermometer>`) neither sudoku's `()` nor futoshiki's `(a, b)`, and
/// **zero new constraint code**.
pub struct ThermoClass {
    /// Sub-grid size — the board is `n²×n²` (3 ⇒ 9×9).
    pub n: u32,
    /// Difficulty rung — the sudoku [`Difficulty`] axis, reused.
    pub difficulty: Difficulty,
    /// How many thermometers to place (clamped to the disjoint-run budget).
    pub thermo_count: usize,
}

impl ThermoClass {
    /// Build the instance for a `difficulty` rung. The thermometer target is the
    /// board side `n²` — roughly one tube per row on average, clamped down by
    /// the disjoint-run budget at placement.
    pub fn from_difficulty(n: u32, difficulty: Difficulty) -> Self {
        Self {
            n,
            difficulty,
            thermo_count: (n * n) as usize,
        }
    }
}

impl PuzzleClass for ThermoClass {
    /// A thermometer path — the third clue kind.
    type Clue = Thermometer;
    /// The dense board paired with its thermometer furniture.
    type Puzzle = (Vec<u32>, Vec<Thermometer>);

    fn seed_solution(&self, rng: &mut SimpleRng) -> Vec<u32> {
        seed_sudoku_solution(self.n, rng)
    }

    fn place_clues(&self, solution: &[u32], rng: &mut SimpleRng) -> Vec<Thermometer> {
        place_thermometers(solution, self.n, self.thermo_count, rng)
    }

    fn solve_candidate(
        &self,
        board: &[u32],
        clues: &[Thermometer],
        max_solutions: usize,
    ) -> Vec<Vec<u32>> {
        let (mut csp, given) = create_thermo_csp(board, self.n, clues);
        csp.solve_with_given(&gen_config(max_solutions), &given)
    }

    fn target_holes(&self, board_len: usize) -> usize {
        target_holes_for(self.difficulty, board_len)
    }

    fn assemble(&self, board: Vec<u32>, clues: Vec<Thermometer>) -> Self::Puzzle {
        (board, clues)
    }
}

/// Generate a Thermo-Sudoku puzzle for `n` and `difficulty`, seeding from the
/// wall clock. Returns `(board, thermometers)`: `board` is the dense given grid
/// (`0` = blank), `thermometers` are bulb→tip cell paths, strictly increasing.
pub fn generate_thermo(n: u32, difficulty: Difficulty) -> (Vec<u32>, Vec<Thermometer>) {
    generate_by_digging(
        &ThermoClass::from_difficulty(n, difficulty),
        &mut SimpleRng::from_time(),
    )
}

/// Seeded, platform-independent counterpart of [`generate_thermo`].
///
/// Threads an explicit `seed` instead of the wall clock (which panics on
/// `wasm32-unknown-unknown` — no clock there). Same `seed` + `n` + `difficulty`
/// ⇒ the same puzzle on native and wasm, the client-solve parity invariant.
pub fn generate_thermo_seeded(
    n: u32,
    difficulty: Difficulty,
    seed: u64,
) -> (Vec<u32>, Vec<Thermometer>) {
    generate_by_digging(
        &ThermoClass::from_difficulty(n, difficulty),
        &mut SimpleRng::new(seed),
    )
}
