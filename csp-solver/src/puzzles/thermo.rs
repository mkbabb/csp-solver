//! Thermo-Sudoku: a standard Sudoku plus thermometer clue furniture.
//!
//! The T4-W13 contract proof — the third puzzle family, landing on W11's
//! [`PuzzleClass`](crate::PuzzleClass) with **zero new engine constraints**. A
//! thermometer is an orthogonally-adjacent path of cells whose values strictly
//! increase from the bulb; it compiles to a chain of binary
//! [`add_less_than`](crate::Csp::add_less_than) — the propagating path, never an
//! n-ary lambda. Solving is the Sudoku CSP with those chains added; generation
//! is the shared hole-dig dealer with thermometers placed on ascending runs of
//! the seed before digging.

pub mod csp;
pub mod generate;

pub use csp::{Thermometer, create_thermo_csp, solve_thermo};
pub use generate::{ThermoClass, generate_thermo, generate_thermo_seeded};
