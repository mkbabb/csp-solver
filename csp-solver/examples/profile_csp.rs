//! Unified CSP profiling harness — Sudoku, N-Queens, Map Coloring.
//!
//! Usage: samply record --no-open target/release/examples/profile_csp

use csp_solver::constraint::{LambdaConstraint, VarId};
use csp_solver::domain::bitset::BitsetDomain;
use csp_solver::ordering::Ordering;
use csp_solver::*;

// ── Sudoku ──────────────────────────────────────────────────────────────────

fn solve_sudoku(grid: &[u32; 81], config: &SolveConfig) -> bool {
    let mut csp = Csp::new();
    let domain = BitsetDomain::new(1..=9);
    for _ in 0..81 {
        csp.add_variable(domain.clone());
    }
    let mut add_group = |vars: Vec<VarId>| {
        for i in 0..vars.len() {
            for j in (i + 1)..vars.len() {
                csp.add_not_equal(vars[i], vars[j]);
            }
        }
    };
    for r in 0..9u32 {
        add_group((0..9).map(|c| r * 9 + c).collect());
    }
    for c in 0..9u32 {
        add_group((0..9).map(|r| r * 9 + c).collect());
    }
    for bi in 0..3u32 {
        for bj in 0..3u32 {
            add_group(
                (0..3)
                    .flat_map(|di| (0..3).map(move |dj| (bi * 3 + di) * 9 + (bj * 3 + dj)))
                    .collect(),
            );
        }
    }
    csp.finalize();
    let given: Vec<(VarId, u32)> = grid
        .iter()
        .enumerate()
        .filter(|(_, v)| **v != 0)
        .map(|(i, v)| (i as VarId, *v))
        .collect();
    !csp.solve_with_given(config, &given).is_empty()
}

// ── N-Queens ────────────────────────────────────────────────────────────────

fn solve_queens(n: u32, config: &SolveConfig) -> usize {
    let mut csp = Csp::new();
    let domain = BitsetDomain::range(n);
    for _ in 0..n {
        csp.add_variable(domain.clone());
    }
    // Column uniqueness
    csp.add_all_different((0..n).collect());
    // Diagonal constraints
    for i in 0..n {
        for j in (i + 1)..n {
            let diff = (j - i) as u32;
            csp.add_constraint(LambdaConstraint::new(
                vec![i, j],
                move |assignment| {
                    match (&assignment[i as usize], &assignment[j as usize]) {
                        (Some(a), Some(b)) => {
                            let da = (*a as i32 - *b as i32).unsigned_abs();
                            da != diff
                        }
                        _ => true,
                    }
                },
                format!("diag_{i}_{j}"),
            ));
        }
    }
    csp.finalize();
    let mut config = config.clone();
    config.max_solutions = usize::MAX;
    csp.solve(&config).len()
}

// ── Map Coloring ────────────────────────────────────────────────────────────

fn solve_map_coloring(n_nodes: usize, edges: &[(u32, u32)], n_colors: u32, config: &SolveConfig) -> usize {
    let mut csp = Csp::new();
    let domain = BitsetDomain::new(0..n_colors);
    for _ in 0..n_nodes {
        csp.add_variable(domain.clone());
    }
    for &(a, b) in edges {
        csp.add_not_equal(a, b);
    }
    csp.finalize();
    let mut config = config.clone();
    config.max_solutions = usize::MAX;
    csp.solve(&config).len()
}

fn main() {
    let ac3_dw = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::DomWdeg,
        max_solutions: 1,
        backjumping: false,
        ..Default::default()
    };
    let ac3_ff = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::FailFirst,
        max_solutions: 1,
        backjumping: false,
        ..Default::default()
    };

    // ── Sudoku (3 hard puzzles × 1000 iterations) ───────────────────────
    #[rustfmt::skip]
    let puzzles: &[(&str, [u32; 81])] = &[
        ("Al Escargot", [
            1,0,0,0,0,7,0,9,0, 0,3,0,0,2,0,0,0,8, 0,0,9,6,0,0,5,0,0,
            0,0,5,3,0,0,9,0,0, 0,1,0,0,8,0,0,0,2, 6,0,0,0,0,4,0,0,0,
            3,0,0,0,0,0,0,1,0, 0,4,0,0,0,0,0,0,7, 0,0,7,0,0,0,3,0,0,
        ]),
        ("Golden Nugget", [
            0,0,0,0,0,0,0,3,9, 0,0,0,0,0,1,0,0,5, 0,0,3,0,5,0,8,0,0,
            0,0,8,0,9,0,0,0,6, 0,7,0,0,0,2,0,0,0, 1,0,0,4,0,0,0,0,0,
            0,0,9,0,8,0,0,5,0, 0,2,0,0,0,0,6,0,0, 4,0,0,7,0,0,0,0,0,
        ]),
        ("Inkala 2010", [
            0,0,5,3,0,0,0,0,0, 8,0,0,0,0,0,0,2,0, 0,7,0,0,1,0,5,0,0,
            4,0,0,0,0,5,3,0,0, 0,1,0,0,7,0,0,0,6, 0,0,3,2,0,0,0,8,0,
            0,6,0,5,0,0,0,0,9, 0,0,4,0,0,0,0,3,0, 0,0,0,0,0,9,7,0,0,
        ]),
    ];

    eprintln!("=== Sudoku (1000 iterations × 3 puzzles) ===");
    let t = std::time::Instant::now();
    for _ in 0..1000 {
        for (_, grid) in puzzles {
            std::hint::black_box(solve_sudoku(grid, &ac3_dw));
        }
    }
    eprintln!("  {:.1}s ({:.2} ms/puzzle)", t.elapsed().as_secs_f64(), t.elapsed().as_secs_f64() / 3.0);

    // ── N-Queens (8-queens all solutions × 200 iterations) ──────────────
    eprintln!("=== 8-Queens all solutions (200 iterations) ===");
    let t = std::time::Instant::now();
    for _ in 0..200 {
        let n = std::hint::black_box(solve_queens(8, &ac3_ff));
        debug_assert_eq!(n, 92);
    }
    eprintln!("  {:.1}s ({:.2} ms/solve)", t.elapsed().as_secs_f64(), t.elapsed().as_secs_f64() / 200.0 * 1000.0);

    // ── Map Coloring (Australia × 5000 + random 50-node × 200) ──────────
    let australia_edges: Vec<(u32, u32)> = vec![
        (0, 1), (0, 2), (1, 2), (1, 3), (2, 3), (2, 4), (2, 5), (3, 4), (4, 5),
    ];
    eprintln!("=== Australia 3-coloring all solutions (5000 iterations) ===");
    let t = std::time::Instant::now();
    for _ in 0..5000 {
        let n = std::hint::black_box(solve_map_coloring(7, &australia_edges, 3, &ac3_ff));
        debug_assert_eq!(n, 18);
    }
    eprintln!("  {:.1}s ({:.2} ms/solve)", t.elapsed().as_secs_f64(), t.elapsed().as_secs_f64() / 5000.0 * 1000.0);

    // Random 50-node graph
    let mut edges_50 = Vec::new();
    let mut rng = 42u64;
    for i in 0..50u32 {
        for j in (i + 1)..50 {
            rng = rng.wrapping_mul(6364136223846793005).wrapping_add(1);
            if rng % 5 == 0 {
                edges_50.push((i, j));
            }
        }
    }
    eprintln!("=== 50-node 4-coloring first solution (200 iterations, {} edges) ===", edges_50.len());
    let t = std::time::Instant::now();
    for _ in 0..200 {
        std::hint::black_box(solve_map_coloring(50, &edges_50, 4, &ac3_ff));
    }
    eprintln!("  {:.1}s ({:.2} ms/solve)", t.elapsed().as_secs_f64(), t.elapsed().as_secs_f64() / 200.0 * 1000.0);
}
