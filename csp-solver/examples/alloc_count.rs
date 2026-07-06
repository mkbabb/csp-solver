//! Allocation-call counter: wraps `System` with a counting `GlobalAlloc` and
//! runs a fixed corpus (8-queens all-solutions worst case, queens_all under
//! Ac3+FailFirst, and the criterion 16x16 sudoku fixture under Ac3+FailFirst
//! and Ac3+Mrv) reporting `alloc` call counts and solve outputs for a
//! before/after allocation-count comparison. Never touches the tracked repo
//! — throwaway prototype-evidence harness (Pass-2 zero-alloc-hot-path beat).
//!
//! Feature-gated behind `alloc-count` (off by default): this example claims
//! the process-wide `#[global_allocator]` slot, which would hard-conflict
//! ("cannot define multiple global allocators") with any future mimalloc
//! `#[global_allocator]` once both are reachable from the same build graph
//! (e.g. `cargo check --all-targets --features mimalloc`). Run the harness
//! with `cargo run --release --example alloc_count --features alloc-count`.

// The entire harness — including the counting `#[global_allocator]` — lives
// in this module and is compiled only under `--features alloc-count`. A
// crate-level `#![cfg(...)]` can't be used here: cfg'ing out the whole file
// still leaves the example binary needing a `fn main`, so instead the harness
// is scoped to a module and `main()` itself is the cfg switch point (see
// bottom of file).
#[cfg(feature = "alloc-count")]
mod harness {
    use std::alloc::{GlobalAlloc, Layout, System};
    use std::sync::atomic::{AtomicU64, Ordering as AtomicOrdering};

    struct CountingAlloc;
    static ALLOC_CALLS: AtomicU64 = AtomicU64::new(0);

    unsafe impl GlobalAlloc for CountingAlloc {
        unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
            ALLOC_CALLS.fetch_add(1, AtomicOrdering::Relaxed);
            unsafe { System.alloc(layout) }
        }
        unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
            unsafe { System.dealloc(ptr, layout) }
        }
    }

    #[global_allocator]
    static GLOBAL: CountingAlloc = CountingAlloc;

    fn reset() -> u64 {
        ALLOC_CALLS.swap(0, AtomicOrdering::Relaxed)
    }
    fn count() -> u64 {
        ALLOC_CALLS.load(AtomicOrdering::Relaxed)
    }

    use csp_solver::constraint::{LambdaConstraint, VarId};
    use csp_solver::domain::bitset::BitsetDomain;
    use csp_solver::ordering::Ordering;
    use csp_solver::{Csp, Pruning, SolveConfig};

    fn build_queens(n: u32) -> Csp<BitsetDomain> {
        let mut csp = Csp::new();
        let domain = BitsetDomain::range(n);
        let vars = csp.add_variables(&domain, n as usize);
        csp.add_all_different(vars.clone());
        for i in 0..n {
            for j in (i + 1)..n {
                let vi = vars[i as usize];
                let vj = vars[j as usize];
                let diff = j - i;
                csp.add_constraint(LambdaConstraint::new(
                    vec![vi, vj],
                    move |assignment: &[Option<u32>]| match (
                        &assignment[vi as usize],
                        &assignment[vj as usize],
                    ) {
                        (Some(ri), Some(rj)) => ri.abs_diff(*rj) != diff,
                        _ => true,
                    },
                    format!("diag({i},{j})"),
                ));
            }
        }
        csp.finalize();
        csp
    }

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
        let _vars: Vec<VarId> = (0..256).map(|_| csp.add_variable(domain.clone())).collect();
        for r in 0..16 {
            let row_vars: Vec<VarId> = (0..16).map(|c| (r * 16 + c) as VarId).collect();
            csp.add_all_different(row_vars);
        }
        for c in 0..16 {
            let col_vars: Vec<VarId> = (0..16).map(|r| (r * 16 + c) as VarId).collect();
            csp.add_all_different(col_vars);
        }
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

    pub(crate) fn run() {
        // (1) 8-queens, all 92 solutions, Pruning::None + Chronological — the
        // exact rust-domain.md P1 repro (worst case: maximizes node count).
        {
            let _ = reset();
            let mut csp = build_queens(8);
            let config = SolveConfig {
                pruning: Pruning::None,
                ordering: Ordering::Chronological,
                max_solutions: 10_000,
                ..Default::default()
            };
            let solutions = csp.solve(&config);
            let calls = count();
            println!(
                "8-queens/None+Chrono/all-solutions:        {calls:>12} alloc calls | {} solutions",
                solutions.len()
            );
        }

        // (2) queens_all, Ac3+FailFirst, n=8 — exercises the worklist reuse
        // (item 3) and default-revise change-mask (item 5) on Custom/Lambda
        // diagonal constraints (97-98% of queens' constraints per rust-constraint F2).
        {
            let _ = reset();
            let mut csp = build_queens(8);
            let config = SolveConfig {
                pruning: Pruning::Ac3,
                ordering: Ordering::FailFirst,
                max_solutions: 10_000,
                ..Default::default()
            };
            let solutions = csp.solve(&config);
            let calls = count();
            println!(
                "8-queens/Ac3+FailFirst/all-solutions:      {calls:>12} alloc calls | {} solutions",
                solutions.len()
            );
        }

        // (3) queens_all, Ac3+FailFirst, n=12 — larger corpus, same shape.
        {
            let _ = reset();
            let mut csp = build_queens(12);
            let config = SolveConfig {
                pruning: Pruning::Ac3,
                ordering: Ordering::FailFirst,
                max_solutions: 10_000,
                ..Default::default()
            };
            let solutions = csp.solve(&config);
            let calls = count();
            println!(
                "12-queens/Ac3+FailFirst/all-solutions:     {calls:>12} alloc calls | {} solutions",
                solutions.len()
            );
        }

        // (4) 16x16 sudoku, Ac3+FailFirst (criterion's own fixture) — the
        // assignment's target workload.
        {
            let _ = reset();
            let (mut csp, given) = build_sudoku_16x16(&SUDOKU_16X16);
            let config = SolveConfig {
                pruning: Pruning::Ac3,
                ordering: Ordering::FailFirst,
                max_solutions: 1,
                ..Default::default()
            };
            let solutions = csp.solve_with_given(&config, &given);
            let calls = count();
            let bt = csp.stats().backtracks;
            println!(
                "16x16 sudoku/Ac3+FailFirst/first-solution: {calls:>12} alloc calls | {} solutions | {bt} backtracks",
                solutions.len()
            );
            if let Some(sol) = solutions.first() {
                let sum: u64 = sol.iter().map(|&v| v as u64).sum();
                println!("  solution checksum (sum of 256 cells): {sum}");
            }
        }

        // (5) 16x16 sudoku, Ac3+Mrv.
        {
            let _ = reset();
            let (mut csp, given) = build_sudoku_16x16(&SUDOKU_16X16);
            let config = SolveConfig {
                pruning: Pruning::Ac3,
                ordering: Ordering::Mrv,
                max_solutions: 1,
                ..Default::default()
            };
            let solutions = csp.solve_with_given(&config, &given);
            let calls = count();
            let bt = csp.stats().backtracks;
            println!(
                "16x16 sudoku/Ac3+Mrv/first-solution:   {calls:>12} alloc calls | {} solutions | {bt} backtracks",
                solutions.len()
            );
            if let Some(sol) = solutions.first() {
                let sum: u64 = sol.iter().map(|&v| v as u64).sum();
                println!("  solution checksum (sum of 256 cells): {sum}");
            }
        }
    }
} // mod harness

#[cfg(feature = "alloc-count")]
fn main() {
    harness::run();
}

#[cfg(not(feature = "alloc-count"))]
fn main() {
    eprintln!(
        "alloc_count: skipped — this example's counting #[global_allocator] is feature-gated \
         off by default (it would otherwise conflict with any future mimalloc \
         #[global_allocator]). Run with: cargo run --release --example alloc_count \
         --features alloc-count"
    );
}
