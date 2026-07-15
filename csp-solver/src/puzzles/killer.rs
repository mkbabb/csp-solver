//! Killer-Sudoku: a standard Sudoku whose cells partition into arithmetic cages.
//!
//! The T4-W13 `CageSum` consumer (ROW 3) — the fourth puzzle family, landing on
//! W11's [`PuzzleClass`](crate::PuzzleClass) with **zero new engine constraints
//! of its own**: a cage is one existing [`AllDifferent`](crate::Csp::add_all_different)
//! over its cells plus one [`CageSum`](crate::Csp::add_cage_sum) — lane P's n-ary
//! bounds-propagation primitive that clears the n-ary-lambda wall. Solving is the
//! Sudoku CSP with those cages added; generation is the shared hole-dig dealer
//! with the seed partitioned into contiguous, value-distinct, size-banded cages
//! before digging.

pub mod csp;
pub mod generate;

pub use csp::{KillerCage, create_killer_csp, solve_killer};
pub use generate::{KillerClass, generate_killer, generate_killer_seeded};
