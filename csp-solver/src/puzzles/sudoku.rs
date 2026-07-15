//! Sudoku puzzle creation, solving, generation, and symmetry transforms.

pub mod csp;
pub mod generate;
pub mod rng;
pub mod transform;

pub use csp::{create_sudoku_csp, solve_sudoku};
pub use generate::{
    Difficulty, SudokuClass, embedded_template_count, embedded_templates, generate_board,
    generate_board_seeded, generate_board_with_templates, generate_board_with_templates_seeded,
    measure_difficulty,
};
pub use transform::{SudokuTransform, apply_random_transform};
