//! Futoshiki puzzle solver.
//!
//! N×N Latin square with inequality constraints between adjacent cells.

pub mod csp;
pub mod generate;

pub use csp::{create_futoshiki_csp, parse_futoshiki, solve_futoshiki, validate_futoshiki};
pub use generate::{
    Difficulty, FutoshikiClass, generate_futoshiki, generate_futoshiki_difficulty_seeded,
    generate_futoshiki_seeded, generate_futoshiki_tuned_seeded, measure_difficulty,
};
