//! KenKen / Calcudoku generation + solve correctness (T4-W13, ROW 4).
//!
//! KenKen ships ZERO new engine constraints of its own — a `+` cage is lane-P's `CageSum`,
//! a `×` cage lane-P's `CageProduct`, and `−`/`÷` cages are 2-cell binary lambdas that
//! propagate via the engine's free binary-revise path. These tests hold the generation
//! contract (every dealt board unique, its cages partition the boxless Latin grid and hold
//! on the unique solution), prove all FOUR operator kinds are dealt and solve, and prove
//! KenKen CONSUMES `CageProduct` (the born-RED product gate) + `CageSum` + the binary path —
//! each tightens domains at the root fixpoint with no KenKen-specific propagator.

use std::collections::HashSet;

use csp_solver::domain::Domain;
use csp_solver::ordering::Ordering;
use csp_solver::puzzles::futoshiki::Difficulty;
use csp_solver::puzzles::kenken::{
    CageOp, KenKenCage, create_kenken_csp, generate_kenken_seeded, solve_kenken,
};
use csp_solver::{Pruning, SolveConfig};

fn enumerate_config(max_solutions: usize) -> SolveConfig {
    SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::FailFirst,
        max_solutions,
        ..Default::default()
    }
}

/// Every cage's cells produce its target under its operator, on `solution`.
fn cages_hold(solution: &[u32], cages: &[KenKenCage]) -> bool {
    cages.iter().all(|cage| {
        let vals: Vec<u32> = cage.cells.iter().map(|&c| solution[c]).collect();
        match cage.op {
            CageOp::Add => vals.iter().sum::<u32>() == cage.target,
            CageOp::Mul => vals.iter().product::<u32>() == cage.target,
            CageOp::Sub => {
                vals.len() == 2 && vals[0].max(vals[1]) - vals[0].min(vals[1]) == cage.target
            }
            CageOp::Div => {
                if vals.len() != 2 {
                    return false;
                }
                let (hi, lo) = (vals[0].max(vals[1]), vals[0].min(vals[1]));
                lo != 0 && hi.is_multiple_of(lo) && hi / lo == cage.target
            }
        }
    })
}

#[test]
fn dealt_kenken_boards_are_unique_by_construction() {
    // The uniqueness gate (rides W2's uniqueness lane): a `max_solutions: 2` sweep on a
    // dealt batch must return exactly one solution per board, and that solution must satisfy
    // every operator cage — so all four operator kinds are proven SOLVED wherever they appear.
    for &n in &[4u32, 5] {
        for &difficulty in &[Difficulty::Easy, Difficulty::Medium, Difficulty::Hard] {
            for &seed in &[1u64, 7, 42] {
                let (board, cages) = generate_kenken_seeded(n, difficulty, seed);
                assert_eq!(board.len(), (n * n) as usize);

                let solutions = {
                    let (mut csp, given) = create_kenken_csp(&board, n, &cages);
                    csp.solve_with_given(&enumerate_config(2), &given)
                };
                assert_eq!(
                    solutions.len(),
                    1,
                    "kenken n={n} {difficulty:?} seed={seed} is not unique ({} solutions)",
                    solutions.len()
                );

                // The unique solution respects every operator cage.
                assert!(
                    cages_hold(&solutions[0], &cages),
                    "kenken n={n} {difficulty:?} seed={seed}: solution violates a cage"
                );

                // The solution is a valid Latin square (row + column all-different).
                assert!(
                    is_latin_square(&solutions[0], n),
                    "kenken n={n} {difficulty:?} seed={seed}: solution is not a Latin square"
                );

                // Every given cell (rare for KenKen) agrees with the unique completion.
                for (i, &v) in board.iter().enumerate() {
                    if v != 0 {
                        assert_eq!(
                            v, solutions[0][i],
                            "given cell {i} contradicts the solution"
                        );
                    }
                }
            }
        }
    }
}

/// Row + column all-different (the KenKen Latin constraint — no boxes).
fn is_latin_square(sol: &[u32], n: u32) -> bool {
    let nn = n as usize;
    for r in 0..nn {
        let mut seen = HashSet::new();
        for c in 0..nn {
            if !seen.insert(sol[r * nn + c]) {
                return false;
            }
        }
    }
    for c in 0..nn {
        let mut seen = HashSet::new();
        for r in 0..nn {
            if !seen.insert(sol[r * nn + c]) {
                return false;
            }
        }
    }
    true
}

#[test]
fn kenken_deals_every_operator_kind() {
    // The gate: all four operator cage kinds are DEALT. `+`/`×` come from the n-ary cage
    // partition, `−`/`÷` from the 2-cell cages — the union across a small seed sweep carries
    // every one. (Each is proven SOLVED by the uniqueness sweep's `cages_hold` above.)
    let mut seen: HashSet<CageOp> = HashSet::new();
    for &n in &[5u32, 6] {
        for seed in 1u64..=8 {
            let (_board, cages) = generate_kenken_seeded(n, Difficulty::Medium, seed);
            for cage in &cages {
                seen.insert(cage.op);
            }
        }
    }
    for op in [CageOp::Add, CageOp::Sub, CageOp::Mul, CageOp::Div] {
        assert!(
            seen.contains(&op),
            "operator {op:?} was never dealt across the sweep — the wave must deal all four"
        );
    }
}

#[test]
fn dealt_boards_carry_a_cage_partition() {
    let (board, cages) = generate_kenken_seeded(6, Difficulty::Hard, 99);
    let total = 36usize;
    assert_eq!(board.len(), total);
    assert!(!cages.is_empty(), "a dealt board carries cages");

    // The cages PARTITION the board: every cell in exactly one cage, in range.
    let mut seen = vec![false; total];
    for cage in &cages {
        assert!(!cage.cells.is_empty(), "an empty cage is nonsense");
        assert!(cage.target > 0, "a cage target is positive");
        // `−`/`÷` are strictly 2-cell; `+`/`×` are n-ary.
        if cage.op.is_binary() {
            assert_eq!(cage.cells.len(), 2, "a {:?} cage must be 2-cell", cage.op);
        }
        for &c in &cage.cells {
            assert!(c < total, "cage cell {c} out of range");
            assert!(!seen[c], "cell {c} shared between two cages");
            seen[c] = true;
        }
    }
    assert!(seen.iter().all(|&s| s), "every cell must belong to a cage");
}

#[test]
fn solve_kenken_finds_the_dealt_solution() {
    let (board, cages) = generate_kenken_seeded(5, Difficulty::Medium, 7);
    let config = enumerate_config(1);
    let solved = solve_kenken(&board, 5, &cages, &config).expect("dealt board solves");
    assert_eq!(solved.len(), 25);
    assert!(solved.iter().all(|&v| (1..=5).contains(&v)));
    assert!(is_latin_square(&solved, 5));
    assert!(cages_hold(&solved, &cages));
}

#[test]
fn kenken_consumes_cage_product_and_prunes_at_the_root() {
    // The BORN-RED product gate: KenKen adds NO product propagator — a `×` cage is lane-P's
    // `CageProduct`. Build a bare 6×6 (values 1..=6) with one 3-cell `×` cage summing to a
    // product of 6 and confirm the root AC-3 fixpoint prunes 4 and 5 (neither divides 6) from
    // each member, leaving {1,2,3,6}. A pure n-ary lambda would leave every domain at 1..=6
    // (the wall lane P cleared for the product shape).
    let n = 6u32;
    let board = vec![0u32; 36];
    let cages = vec![KenKenCage {
        op: CageOp::Mul,
        target: 6,
        cells: vec![0, 1, 2], // three cells of the top row
    }];

    let (mut csp, given) = create_kenken_csp(&board, n, &cages);
    assert!(given.is_empty());
    csp.propagate()
        .expect("an empty 6×6 with one product-6 cage is consistent");

    for &c in &[0usize, 1, 2] {
        let dom = &csp.variables[c].domain;
        assert!(
            dom.contains(&1) && dom.contains(&2) && dom.contains(&3) && dom.contains(&6),
            "member {c} lost a divisor of 6"
        );
        assert!(
            !dom.contains(&4) && !dom.contains(&5),
            "member {c} kept 4/5 — CageProduct did not prune; KenKen would search blind"
        );
    }
}

#[test]
fn kenken_consumes_cage_sum_and_prunes_at_the_root() {
    // The `+` cage is lane-P's `CageSum` (shared with Killer). A 3-cell sum-6 cage caps each
    // member at 6 − (others' min 2) = 4 at the root, pruning 5/6.
    let n = 6u32;
    let board = vec![0u32; 36];
    let cages = vec![KenKenCage {
        op: CageOp::Add,
        target: 6,
        cells: vec![0, 1, 2],
    }];

    let (mut csp, given) = create_kenken_csp(&board, n, &cages);
    assert!(given.is_empty());
    csp.propagate()
        .expect("an empty 6×6 with one sum-6 cage is consistent");

    for &c in &[0usize, 1, 2] {
        let dom = &csp.variables[c].domain;
        assert!(dom.contains(&1) && dom.contains(&4), "member {c} lost 1/4");
        assert!(
            !dom.contains(&5) && !dom.contains(&6),
            "member {c} kept 5/6 — CageSum did not prune"
        );
    }
}

#[test]
fn kenken_binary_cages_propagate_free() {
    // `−`/`÷` cages are 2-cell binary lambdas — they prune via the engine's free
    // `revise_binary_default` path (Wall-1's binary sugar), no new constraint. Two bare 6×6
    // boards, each with one binary cage, confirm the prune.

    // `−` cage |a − b| = 5 over 1..=6: only (1,6)/(6,1) satisfy it, so each member collapses
    // to {1, 6}.
    {
        let cages = vec![KenKenCage {
            op: CageOp::Sub,
            target: 5,
            cells: vec![0, 1],
        }];
        let (mut csp, _given) = create_kenken_csp(&[0u32; 36], 6, &cages);
        csp.propagate().expect("consistent");
        for &c in &[0usize, 1] {
            let dom = &csp.variables[c].domain;
            assert!(
                dom.contains(&1) && dom.contains(&6),
                "− member {c} lost 1/6"
            );
            assert!(
                !dom.contains(&2) && !dom.contains(&3) && !dom.contains(&4) && !dom.contains(&5),
                "− member {c} kept an unsupported value — the binary lambda did not prune"
            );
        }
    }

    // `÷` cage max/min = 2 over 1..=6: 5 has no partner (needs 10 or 2.5), so 5 is pruned; the
    // divisor-reachable values {1,2,3,4,6} survive.
    {
        let cages = vec![KenKenCage {
            op: CageOp::Div,
            target: 2,
            cells: vec![0, 1],
        }];
        let (mut csp, _given) = create_kenken_csp(&[0u32; 36], 6, &cages);
        csp.propagate().expect("consistent");
        for &c in &[0usize, 1] {
            let dom = &csp.variables[c].domain;
            assert!(
                !dom.contains(&5),
                "÷ member {c} kept 5 — the binary lambda did not prune"
            );
            assert!(
                dom.contains(&1)
                    && dom.contains(&2)
                    && dom.contains(&3)
                    && dom.contains(&4)
                    && dom.contains(&6),
                "÷ member {c} lost a supported value"
            );
        }
    }
}
