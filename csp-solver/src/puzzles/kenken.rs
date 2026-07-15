//! KenKen / Calcudoku: a Latin square whose cells partition into arithmetic
//! *cages*, each carrying an operator (`+ − × ÷`) and a target its cells produce.
//!
//! The T4-W13 second consumer of the cage-primitive wave (ROW 4) — the fifth
//! puzzle family, landing on W11's [`PuzzleClass`](crate::PuzzleClass) with **zero
//! new engine constraints of its own**. A cage is one of:
//!
//! - `+` → [`CageSum`](crate::Csp::add_cage_sum) (lane P's n-ary bounds
//!   propagator; also serves Killer);
//! - `×` → [`CageProduct`](crate::Csp::add_cage_product) (lane P's n-ary product
//!   propagator — KenKen's exclusive consumer);
//! - `−` / `÷` → a 2-cell binary [`LambdaConstraint`](crate::constraint::LambdaConstraint)
//!   that propagates via the engine's free binary-revise path (Wall-1's binary
//!   sugar, the same path `add_less_than` rides).
//!
//! The board is a plain `n×n` Latin square (rows + columns all-different, **no
//! sub-grid boxes** — the new geometry vs Sudoku/Killer): the seed reuses the
//! solver over an empty board with a fixed first row, exactly as futoshiki's
//! `seed_latin_square` does. Generation partitions the seed into contiguous
//! cages, assigns each an operator + target the seed satisfies, then hole-digs
//! (aiming to blank every cell) while the full cage set keeps the solution
//! unique — classic cages-only KenKen, with a given left only where the cages
//! underdetermine.

pub mod csp;
pub mod generate;

pub use csp::{CageOp, KenKenCage, create_kenken_csp, solve_kenken};
pub use generate::{KenKenClass, generate_kenken, generate_kenken_seeded};
