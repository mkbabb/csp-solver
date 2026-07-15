//! KenKen / Calcudoku generation — the second cage-primitive consumer (ROW 4).
//!
//! Generation is the three-beat dealer every [`PuzzleClass`] shares:
//!
//! 1. **seed** — a full `n×n` Latin square (an empty board solved with a shuffled
//!    first row), reusing the crate solver, never a bespoke square. The KenKen
//!    twin of futoshiki's `seed_latin_square`, over KenKen's own boxless CSP.
//! 2. **place clues** — partition the seed into contiguous cages, then assign
//!    each an operator + a target the seed already produces (`+`→Σ, `×`→Π,
//!    `−`→|a−b|, `÷`→max/min). Every cell lands in exactly one cage; the seed
//!    satisfies every cage by construction (targets are read off the seed).
//! 3. **dig** — the uniqueness-checked hole-dig, aiming to blank EVERY cell
//!    (`target_holes` = the whole board), with the full cage set present in every
//!    candidate CSP. Classic KenKen is cages-only; a given is left only where the
//!    cages underdetermine (the digger reverts any blank that admits a second
//!    solution), so every dealt board is unique by construction.
//!
//! [`KenKenClass`] names those beats as [`PuzzleClass`] seams; the shared
//! [`generate_by_digging`](crate::puzzles::class::generate_by_digging) dealer
//! drives them — KenKen lands with one impl and one payload builder, no new
//! generator and no new constraint (it consumes lane P's `CageSum`/`CageProduct`
//! and the free binary-lambda path). Difficulty reuses the futoshiki
//! [`Difficulty`] axis verbatim (KenKen *is* a Latin-square family — no fourth
//! `Difficulty` mirror; `difficulty_parity` unedited), mapped to a cage-size band.

use crate::ordering::Ordering;
use crate::puzzles::class::{PuzzleClass, SimpleRng, generate_by_digging};
use crate::puzzles::futoshiki::Difficulty;
use crate::{Pruning, SolveConfig};

use super::csp::{CageOp, KenKenCage, create_kenken_csp};

/// Build the seed/uniqueness solve config: the `Ac3` + `FailFirst` pairing every
/// generator seeds and uniqueness-checks with. `Ac3` is load-bearing —
/// `ForwardChecking` cannot seed larger Latin boards.
fn gen_config(max_solutions: usize) -> SolveConfig {
    SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::FailFirst,
        max_solutions,
        ..Default::default()
    }
}

/// Largest cage grown, banded by difficulty. Easy stays to pairs (simplest
/// arithmetic), Hard grows to 4-cell cages (harder sums/products). Classic KenKen
/// cages run 1..4; the singleton fallback (a cell hemmed in by taken neighbours)
/// is always available, so the partition never wedges.
fn max_cage_len(difficulty: Difficulty) -> usize {
    match difficulty {
        Difficulty::Easy => 2,
        Difficulty::Medium => 3,
        Difficulty::Hard => 4,
    }
}

/// Seed a complete `n×n` Latin square by fixing a shuffled first row on the
/// boxless KenKen CSP and solving the rest — reusing the solver rather than
/// building a square by hand (the KenKen twin of `seed_latin_square`). Dense,
/// `0`-free, length `n²`.
fn seed_latin_square(n: u32, rng: &mut SimpleRng) -> Vec<u32> {
    let total = (n * n) as usize;

    let mut first_row: Vec<u32> = (1..=n).collect();
    rng.shuffle(&mut first_row);

    let mut board = vec![0u32; total];
    board[..n as usize].copy_from_slice(&first_row);

    // The seed carries NO cages — a bare Latin square with a fixed first row is
    // always solvable.
    let (mut csp, given) = create_kenken_csp(&board, n, &[]);
    csp.solve_with_given(&gen_config(1), &given)
        .into_iter()
        .next()
        .expect("an empty KenKen board with a fixed first row is always solvable")
}

/// The orthogonal (row/column) neighbours of `cell` on an `n×n` grid.
fn ortho_neighbours(cell: usize, n: usize) -> Vec<usize> {
    let (r, c) = (cell / n, cell % n);
    let mut out = Vec::with_capacity(4);
    if c + 1 < n {
        out.push(cell + 1);
    }
    if c > 0 {
        out.push(cell - 1);
    }
    if r + 1 < n {
        out.push(cell + n);
    }
    if r > 0 {
        out.push(cell - n);
    }
    out
}

/// Assign an operator + target to a cage's cells, read off the `solution` so the
/// seed satisfies the cage by construction. `cells` is expected pre-sorted (the
/// smallest is the corner label cell).
///
/// - **singleton** → a "given" cage: `+` with the cell's own value (the
///   [`CageSum`] pins it even when the cell is dug).
/// - **2-cell** → one of `− × + ÷` at random; `÷` only when the larger value is
///   divisible by the smaller (else it is simply not offered). Orthogonally
///   adjacent cells share a row or column, so their Latin values differ and
///   `|a−b| ≥ 1`.
/// - **3+-cell** → `+` or `×` at random (the n-ary operators — the ones that
///   cross the n-ary-lambda wall via `CageSum`/`CageProduct`).
fn assign_operator(cells: Vec<usize>, solution: &[u32], rng: &mut SimpleRng) -> KenKenCage {
    let vals: Vec<u32> = cells.iter().map(|&c| solution[c]).collect();

    if cells.len() == 1 {
        return KenKenCage {
            op: CageOp::Add,
            target: vals[0],
            cells,
        };
    }

    if cells.len() == 2 {
        let hi = vals[0].max(vals[1]);
        let lo = vals[0].min(vals[1]);
        // Sub / Mul / Add are always valid for a distinct pair; Div only when
        // lo divides hi.
        let mut choices = vec![CageOp::Sub, CageOp::Mul, CageOp::Add];
        if lo != 0 && hi.is_multiple_of(lo) {
            choices.push(CageOp::Div);
        }
        let op = choices[rng.next_usize(choices.len())];
        let target = match op {
            CageOp::Sub => hi - lo,
            CageOp::Div => hi / lo,
            CageOp::Mul => hi * lo,
            CageOp::Add => hi + lo,
        };
        return KenKenCage { op, target, cells };
    }

    // 3+ cells: an n-ary operator.
    let op = if rng.next_usize(2) == 0 {
        CageOp::Add
    } else {
        CageOp::Mul
    };
    let target = match op {
        CageOp::Add => vals.iter().sum(),
        CageOp::Mul => vals.iter().product(),
        // Unreachable: 3+ cells only ever take Add / Mul above.
        _ => vals.iter().sum(),
    };
    KenKenCage { op, target, cells }
}

/// Partition the `solution` into contiguous cages and assign each an operator +
/// target. Every cell lands in exactly one cage.
///
/// Cells are visited in shuffled order; each unassigned cell seeds a fresh cage
/// with a random target size in `2..=max_len`, then grows by absorbing a random
/// unassigned orthogonal neighbour of ANY cage cell. Unlike Killer there is NO
/// value-distinctness filter — a KenKen cage may repeat a value across cells that
/// share neither row nor column (the Latin constraint is the only all-different).
/// A cell hemmed in by taken neighbours stays a singleton (a `+` given cage).
fn partition_into_cages(
    solution: &[u32],
    n: u32,
    max_len: usize,
    rng: &mut SimpleRng,
) -> Vec<KenKenCage> {
    let nn = n as usize;
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
        // Target size 2..=max_len (max_len ≥ 2 for every difficulty band).
        let target = 2 + rng.next_usize(max_len - 1);

        while cells.len() < target {
            // Unassigned orthogonal neighbours of ANY cage cell (dedup preserves
            // the deterministic scan order — no sort, which would drag the
            // unstable-sort codegen into the lean build).
            let mut candidates: Vec<usize> = Vec::new();
            for &c in &cells {
                for nb in ortho_neighbours(c, nn) {
                    if cage_of[nb] == UNASSIGNED && !candidates.contains(&nb) {
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
            cells.sort_unstable(); // stable corner = smallest index (the target label cell)
            assign_operator(cells, solution, rng)
        })
        .collect()
}

/// A KenKen instance to deal: board side `n` (4 ⇒ 4×4) at `difficulty`.
///
/// The [`PuzzleClass`] witness expressing KenKen's Latin-square-plus-cages
/// generation as the generic dealer's seams — the fifth family, plugged in with a
/// clue kind ([`KenKenCage`]) that is none of the four prior kinds, and CONSUMING
/// lane P's `CageSum` + `CageProduct` plus the free binary-lambda path (no new
/// constraint).
pub struct KenKenClass {
    /// Board side — the board is `n×n` (4 ⇒ 4×4). Values run `1..=n`.
    pub n: u32,
    /// Difficulty rung — the futoshiki [`Difficulty`] axis, reused (mapped to a
    /// cage-size band).
    pub difficulty: Difficulty,
}

impl KenKenClass {
    /// Build the instance for a `difficulty` rung.
    pub fn from_difficulty(n: u32, difficulty: Difficulty) -> Self {
        Self { n, difficulty }
    }
}

impl PuzzleClass for KenKenClass {
    /// A KenKen cage — the fifth clue kind.
    type Clue = KenKenCage;
    /// The dense board paired with its cage furniture.
    type Puzzle = (Vec<u32>, Vec<KenKenCage>);

    fn seed_solution(&self, rng: &mut SimpleRng) -> Vec<u32> {
        seed_latin_square(self.n, rng)
    }

    fn place_clues(&self, solution: &[u32], rng: &mut SimpleRng) -> Vec<KenKenCage> {
        partition_into_cages(solution, self.n, max_cage_len(self.difficulty), rng)
    }

    fn solve_candidate(
        &self,
        board: &[u32],
        clues: &[KenKenCage],
        max_solutions: usize,
    ) -> Vec<Vec<u32>> {
        let (mut csp, given) = create_kenken_csp(board, self.n, clues);
        csp.solve_with_given(&gen_config(max_solutions), &given)
    }

    /// Dig every cell — classic KenKen is cages-only. The dealer reverts any blank
    /// that admits a second solution, so a given survives only where the cages
    /// underdetermine.
    fn target_holes(&self, board_len: usize) -> usize {
        board_len
    }

    fn assemble(&self, board: Vec<u32>, clues: Vec<KenKenCage>) -> Self::Puzzle {
        (board, clues)
    }
}

/// Generate a KenKen puzzle for `n` and `difficulty`, seeding from the wall
/// clock. Returns `(board, cages)`: `board` is the dense given grid (`0` = blank,
/// usually all-blank for KenKen), `cages` the operator cages partitioning it.
pub fn generate_kenken(n: u32, difficulty: Difficulty) -> (Vec<u32>, Vec<KenKenCage>) {
    generate_by_digging(
        &KenKenClass::from_difficulty(n, difficulty),
        &mut SimpleRng::from_time(),
    )
}

/// Seeded, platform-independent counterpart of [`generate_kenken`].
///
/// Threads an explicit `seed` instead of the wall clock (which panics on
/// `wasm32-unknown-unknown` — no clock there). Same `seed` + `n` + `difficulty`
/// ⇒ the same puzzle on native and wasm, the client-solve parity invariant.
pub fn generate_kenken_seeded(
    n: u32,
    difficulty: Difficulty,
    seed: u64,
) -> (Vec<u32>, Vec<KenKenCage>) {
    generate_by_digging(
        &KenKenClass::from_difficulty(n, difficulty),
        &mut SimpleRng::new(seed),
    )
}
