use criterion::{BenchmarkId, Criterion, criterion_group, criterion_main};
use csp_solver::constraint::VarId;
use csp_solver::domain::bitset::BitsetDomain;
use csp_solver::ordering::Ordering;
use csp_solver::{Csp, Pruning, SolveConfig};

// ---------------------------------------------------------------------------
// Puzzle data (verified unique-solution hard 9x9 puzzles)
// ---------------------------------------------------------------------------

#[allow(clippy::zero_prefixed_literal)]
const AL_ESCARGOT: [u32; 81] = [
    1, 0, 0, 0, 0, 7, 0, 9, 0, 0, 3, 0, 0, 2, 0, 0, 0, 8, 0, 0, 9, 6, 0, 0, 5, 0, 0, 0, 0, 5,
    3, 0, 0, 9, 0, 0, 0, 1, 0, 0, 8, 0, 0, 0, 2, 6, 0, 0, 0, 0, 4, 0, 0, 0, 3, 0, 0, 0, 0, 0,
    0, 1, 0, 0, 4, 0, 0, 0, 0, 0, 0, 7, 0, 0, 7, 0, 0, 0, 3, 0, 0,
];

#[allow(clippy::zero_prefixed_literal)]
const PLATINUM_BLONDE: [u32; 81] = [
    0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 3, 5, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 7, 0, 7, 0, 0,
    0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 8, 0, 4, 0, 0, 0, 2,
    0, 0, 0, 0, 0, 0, 1, 8, 0, 0, 0, 0, 2, 5, 0, 0, 0, 0, 0, 0, 0,
];

#[allow(clippy::zero_prefixed_literal)]
const GOLDEN_NUGGET: [u32; 81] = [
    0, 0, 0, 0, 0, 0, 0, 3, 9, 0, 0, 0, 0, 0, 1, 0, 0, 5, 0, 0, 3, 0, 5, 0, 8, 0, 0, 0, 0, 8,
    0, 9, 0, 0, 0, 6, 0, 7, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 9, 0, 8, 0,
    0, 5, 0, 0, 2, 0, 0, 0, 0, 6, 0, 0, 4, 0, 0, 7, 0, 0, 0, 0, 0,
];

#[allow(clippy::zero_prefixed_literal)]
const INKALA_2010: [u32; 81] = [
    0, 0, 5, 3, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 2, 0, 0, 7, 0, 0, 1, 0, 5, 0, 0, 4, 0, 0,
    0, 0, 5, 3, 0, 0, 0, 1, 0, 0, 7, 0, 0, 0, 6, 0, 0, 3, 2, 0, 0, 0, 8, 0, 0, 6, 0, 5, 0, 0,
    0, 0, 9, 0, 0, 4, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 9, 7, 0, 0,
];

#[allow(clippy::zero_prefixed_literal)]
const MINIMAL_17: [u32; 81] = [
    0, 0, 0, 0, 0, 0, 0, 1, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 5, 0, 4, 0, 7, 0, 0, 8, 0, 0, 0, 3, 0, 0, 0, 0, 1, 0, 9, 0, 0, 0, 0, 3, 0, 0, 4, 0, 0,
    2, 0, 0, 0, 5, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 6, 0, 0, 0,
];

// ---------------------------------------------------------------------------
// Builder: construct a fresh Sudoku CSP from a flat 81-element grid
// ---------------------------------------------------------------------------

fn build_sudoku_9x9(grid: &[u32; 81]) -> (Csp<BitsetDomain>, Vec<(VarId, u32)>) {
    let mut csp = Csp::new();
    let domain = BitsetDomain::new(1..=9);
    let _vars: Vec<VarId> = (0..81).map(|_| csp.add_variable(domain.clone())).collect();

    // Row constraints
    for r in 0..9 {
        let row_vars: Vec<VarId> = (0..9).map(|c| (r * 9 + c) as VarId).collect();
        csp.add_all_different(row_vars);
    }
    // Column constraints
    for c in 0..9 {
        let col_vars: Vec<VarId> = (0..9).map(|r| (r * 9 + c) as VarId).collect();
        csp.add_all_different(col_vars);
    }
    // 3x3 box constraints
    for bi in 0..3u32 {
        for bj in 0..3u32 {
            let box_vars: Vec<VarId> = (0..3)
                .flat_map(|di| (0..3).map(move |dj| (bi * 3 + di) * 9 + (bj * 3 + dj)))
                .collect();
            csp.add_all_different(box_vars);
        }
    }

    csp.finalize();

    let given: Vec<(VarId, u32)> = grid
        .iter()
        .enumerate()
        .filter(|&(_, v)| *v != 0)
        .map(|(i, &v)| (i as VarId, v))
        .collect();

    (csp, given)
}

// ---------------------------------------------------------------------------
// Benchmarks
// ---------------------------------------------------------------------------

struct PuzzleSpec {
    name: &'static str,
    grid: &'static [u32; 81],
}

const PUZZLES: &[PuzzleSpec] = &[
    PuzzleSpec {
        name: "al_escargot",
        grid: &AL_ESCARGOT,
    },
    PuzzleSpec {
        name: "platinum_blonde",
        grid: &PLATINUM_BLONDE,
    },
    PuzzleSpec {
        name: "golden_nugget",
        grid: &GOLDEN_NUGGET,
    },
    PuzzleSpec {
        name: "inkala_2010",
        grid: &INKALA_2010,
    },
    PuzzleSpec {
        name: "minimal_17",
        grid: &MINIMAL_17,
    },
];

struct ConfigSpec {
    name: &'static str,
    pruning: Pruning,
    ordering: Ordering,
    backjumping: bool,
}

const CONFIGS: &[ConfigSpec] = &[
    ConfigSpec {
        name: "fc_chrono",
        pruning: Pruning::ForwardChecking,
        ordering: Ordering::Chronological,
        backjumping: false,
        ..Default::default()
    },
    ConfigSpec {
        name: "ac3_failfirst",
        pruning: Pruning::Ac3,
        ordering: Ordering::FailFirst,
        backjumping: false,
        ..Default::default()
    },
    ConfigSpec {
        name: "ac3_domwdeg",
        pruning: Pruning::Ac3,
        ordering: Ordering::DomWdeg,
        backjumping: false,
        ..Default::default()
    },
];

fn bench_sudoku_9x9(c: &mut Criterion) {
    let mut group = c.benchmark_group("sudoku_9x9");

    for puzzle in PUZZLES {
        for cfg in CONFIGS {
            let id = BenchmarkId::new(puzzle.name, cfg.name);
            group.bench_function(id, |b| {
                b.iter(|| {
                    let (mut csp, given) = build_sudoku_9x9(puzzle.grid);
                    let config = SolveConfig {
                        pruning: cfg.pruning,
                        ordering: cfg.ordering,
                        max_solutions: 1,
                        backjumping: cfg.backjumping,
                    };
                    let solutions = csp.solve_with_given(&config, &given);
                    assert!(!solutions.is_empty());
                    solutions
                });
            });
        }
    }

    group.finish();
}

// ---------------------------------------------------------------------------
// 16x16 Sudoku (4x4 blocks, values 1..=16)
// ---------------------------------------------------------------------------

// A known hard 16x16 puzzle (sparse, 55 givens).
// 0 = empty. Values 1..=16.
#[rustfmt::skip]
const SUDOKU_16X16: [u32; 256] = [
     0, 0, 0, 0,  0, 0, 0,15,  0, 0, 3, 0,  0, 0,14, 0,
     0, 0,12, 0,  0, 0, 0, 0,  0, 6, 0,13,  0, 0, 0, 0,
     0, 0, 0, 6,  0, 9, 0, 0,  0, 0, 0, 0, 11, 0, 0, 0,
     0, 5, 0, 0,  0, 0,14, 0,  0, 0, 0, 0,  0, 0, 4, 0,
     0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 6,  0, 0, 0,15,
    13, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 2, 0, 0,
     0, 0, 0, 0,  0,12, 0, 0,  5, 0, 0, 0,  0, 0, 0, 0,
     0, 0, 7, 0,  0, 0, 0, 3,  0, 0,14, 0,  0, 0, 0, 0,
     0, 0, 0, 0,  0,14, 0, 0, 12, 0, 0, 0,  0, 7, 0, 0,
     0, 0, 0, 0,  0, 0, 0, 5,  0, 0,11, 0,  0, 0, 0, 0,
     0, 0, 2, 0,  0, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0,14,
    15, 0, 0, 0,  6, 0, 0, 0,  0, 0, 0, 0,  0, 0, 0, 0,
     0, 4, 0, 0,  0, 0, 0, 0,  0,16, 0, 0,  0, 0, 5, 0,
     0, 0, 0,11,  0, 0, 0, 0,  0, 0, 9, 0,  6, 0, 0, 0,
     0, 0, 0, 0, 14, 0, 6, 0,  0, 0, 0, 0,  0,12, 0, 0,
     0,16, 0, 0,  0, 3, 0, 0, 15, 0, 0, 0,  0, 0, 0, 0,
];

fn build_sudoku_16x16(grid: &[u32; 256]) -> (Csp<BitsetDomain>, Vec<(VarId, u32)>) {
    let mut csp = Csp::new();
    let domain = BitsetDomain::new(1..=16);
    let _vars: Vec<VarId> = (0..256)
        .map(|_| csp.add_variable(domain.clone()))
        .collect();

    // Row constraints
    for r in 0..16 {
        let row_vars: Vec<VarId> = (0..16).map(|c| (r * 16 + c) as VarId).collect();
        csp.add_all_different(row_vars);
    }
    // Column constraints
    for c in 0..16 {
        let col_vars: Vec<VarId> = (0..16).map(|r| (r * 16 + c) as VarId).collect();
        csp.add_all_different(col_vars);
    }
    // 4x4 box constraints
    for bi in 0..4u32 {
        for bj in 0..4u32 {
            let box_vars: Vec<VarId> = (0..4)
                .flat_map(|di| (0..4).map(move |dj| (bi * 4 + di) * 16 + (bj * 4 + dj)))
                .collect();
            csp.add_all_different(box_vars);
        }
    }

    csp.finalize();

    let given: Vec<(VarId, u32)> = grid
        .iter()
        .enumerate()
        .filter(|&(_, v)| *v != 0)
        .map(|(i, &v)| (i as VarId, v))
        .collect();

    (csp, given)
}

fn bench_sudoku_16x16(c: &mut Criterion) {
    let mut group = c.benchmark_group("sudoku_16x16");
    // Only AC3+FailFirst for 16x16 (other configs too slow)
    group.sample_size(10);

    group.bench_function("ac3_failfirst", |b| {
        b.iter(|| {
            let (mut csp, given) = build_sudoku_16x16(&SUDOKU_16X16);
            let config = SolveConfig {
                pruning: Pruning::Ac3,
                ordering: Ordering::FailFirst,
                max_solutions: 1,
                backjumping: false,
                ..Default::default()
            };
            let solutions = csp.solve_with_given(&config, &given);
            solutions
        });
    });

    group.bench_function("ac3_domwdeg", |b| {
        b.iter(|| {
            let (mut csp, given) = build_sudoku_16x16(&SUDOKU_16X16);
            let config = SolveConfig {
                pruning: Pruning::Ac3,
                ordering: Ordering::DomWdeg,
                max_solutions: 1,
                backjumping: false,
                ..Default::default()
            };
            let solutions = csp.solve_with_given(&config, &given);
            solutions
        });
    });

    group.finish();
}

criterion_group!(benches, bench_sudoku_9x9, bench_sudoku_16x16);
criterion_main!(benches);
