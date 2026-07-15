//! `PuzzleClass` acceptance — Thermo-Sudoku (T4-W13's third family) plugs into the trait
//! with a NOVEL clue type and ZERO new constraint code.
//!
//! This is the Rust half of the W11 keystone's contract proof (the FE half is
//! `web/frontend/src/games/registry.test.ts`), grown from the W11 compile-time stub into
//! the shipped [`csp_solver::puzzles::thermo`] module. Thermo-Sudoku carries a clue kind
//! that is NEITHER sudoku's `()` NOR futoshiki's `(usize, usize)` — a *thermometer*, an
//! ordered path of cells whose values strictly increase from the bulb. That the real
//! [`ThermoClass`] satisfies [`PuzzleClass`] unchanged, and deals through the shared
//! [`generate_by_digging`] dealer W11 handed off, is the proof the trait is the true
//! intersection, not a fork point — the gate on the Killer/KenKen cage primitives.

use csp_solver::PuzzleClass;
use csp_solver::puzzles::class::{SimpleRng, generate_by_digging};
use csp_solver::puzzles::sudoku::Difficulty;
use csp_solver::puzzles::thermo::{ThermoClass, Thermometer};

#[test]
fn thermo_sudoku_plugs_into_the_contract_unchanged() {
    let class = ThermoClass::from_difficulty(3, Difficulty::Easy);

    // The seed seam yields a dense, 0-free 9×9 grid, every value in 1..=9.
    let mut rng = SimpleRng::new(42);
    let seed = class.seed_solution(&mut rng);
    assert_eq!(seed.len(), 81);
    assert!(seed.iter().all(|&v| (1..=9).contains(&v)));

    // Dealing through the SHARED generic dealer (the W11 `generate_by_digging<C>` handoff)
    // yields the paired puzzle + its NOVEL clue furniture (a `Vec<Thermometer>` — neither
    // sudoku's `()` nor futoshiki's `(a, b)`).
    let (board, thermos): (Vec<u32>, Vec<Thermometer>) =
        generate_by_digging(&class, &mut SimpleRng::new(42));
    assert_eq!(board.len(), 81);
    assert!(
        !thermos.is_empty(),
        "a dealt Thermo board carries thermometers"
    );
    assert!(
        thermos.iter().all(|t| t.len() >= 2),
        "every thermometer is a tube of at least two cells"
    );
}

#[test]
fn the_place_clues_seam_grows_ascending_orthogonal_tubes() {
    // Structural sanity on the clue seam the family genuinely diverges on: thermometers
    // are orthogonally-adjacent paths whose seed values strictly increase bulb → tip.
    let class = ThermoClass::from_difficulty(3, Difficulty::Medium);
    let mut rng = SimpleRng::new(7);
    let solution = class.seed_solution(&mut rng);
    let thermos = class.place_clues(&solution, &mut rng);
    assert!(!thermos.is_empty());

    for thermo in &thermos {
        for pair in thermo.windows(2) {
            let (a, b) = (pair[0], pair[1]);
            // Strictly increasing along the seed (the thermometer relation holds).
            assert!(
                solution[b] > solution[a],
                "tube must strictly increase: cell {a}={} !< cell {b}={}",
                solution[a],
                solution[b]
            );
            // Orthogonally adjacent (a renderable tube segment).
            let m = 9usize;
            let manhattan = (a / m).abs_diff(b / m) + (a % m).abs_diff(b % m);
            assert_eq!(
                manhattan, 1,
                "tube segment {a}→{b} must be orthogonally adjacent"
            );
        }
    }
}
