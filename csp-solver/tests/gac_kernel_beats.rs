//! Q9 kernel-beat invariant battery (T2-W3).
//!
//! Guards the two GAC-touching L26 beats against the warm-start / scratch
//! invariants nothing else asserts (see
//! `docs/tranches/2026-07-tranche-2/evidence/pass3/Q9-kernel-beat-risk.md`):
//!
//! * Beat 1 — the value→index adjacency scratch (`solver/gac/mod.rs`).
//! * Beat 2 — the pooled singleton buffer (`constraint/scratch.rs`).
//! * Beat 3 — the assignment Hungarian dispatch (`builder/assignment.rs`).
//!
//! P1 warm==cold pruning parity (incl. multi-call universe-shrink) · P2
//! cross-value-universe scratch reset (same-thread == fresh-thread) · P3
//! `Csp<FiniteDomain<String>>` monomorphizes & solves (generic bound
//! unbroken) · P4 singleton-removal snapshot equivalence · P5 one frozen
//! node-count tripwire (re-baseline lock) + n=20 LAP proven-optimal · P6
//! sudoku+futoshiki green under the pool.

use csp_solver::assignment;
use csp_solver::constraint::{AllDifferent, AllDifferentExcept, Constraint, Revision};
use csp_solver::domain::{BitsetDomain, FiniteDomain};
use csp_solver::solver::gac::{next_gac_id, propagate_gac_core};
use csp_solver::variable::Variable;
use csp_solver::{Csp, SolveConfig};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

fn vars_bit(sets: &[Vec<u32>]) -> Vec<Variable<BitsetDomain>> {
    sets.iter()
        .map(|s| Variable::new(BitsetDomain::new(s.iter().copied())))
        .collect()
}

fn snapshot(vars: &[Variable<BitsetDomain>]) -> Vec<Vec<u32>> {
    vars.iter()
        .map(|v| {
            let mut d: Vec<u32> = v.domain.iter().collect();
            d.sort_unstable();
            d
        })
        .collect()
}

/// Run the plain (sentinel-less) GAC core over a fresh set of variables built
/// from `sets`, returning `(revision, post-domains)`.
fn run_plain(sets: &[Vec<u32>], gac_id: Option<u32>) -> (Revision, Vec<Vec<u32>>) {
    let scope: Vec<u32> = (0..sets.len() as u32).collect();
    let mut vars = vars_bit(sets);
    let rev = propagate_gac_core::<BitsetDomain>(&scope, None, &mut vars, 0, gac_id);
    (rev, snapshot(&vars))
}

// ---------------------------------------------------------------------------
// P1 — warm(Some) == cold(None) pruning parity, incl. multi-call shrink
// ---------------------------------------------------------------------------

#[test]
fn p1_warm_cold_pruning_parity_single_call() {
    // A battery of Hall-set-shaped states across live counts and universes.
    let batteries: Vec<Vec<Vec<u32>>> = vec![
        // live=3, Hall set {0,1} forces the third var to {2}.
        vec![vec![0, 1], vec![0, 1], vec![0, 1, 2]],
        // live=4, two Hall pairs.
        vec![vec![0, 1], vec![0, 1], vec![2, 3], vec![0, 1, 2, 3]],
        // live=9 over 0..9 — nothing to prune (feasible permutation), parity
        // must still hold exactly.
        (0..9).map(|_| (0..9).collect()).collect(),
        // A sparse universe with gaps: values {5,9,20} exercise Vec growth in
        // the integer fast path.
        vec![vec![5, 9], vec![5, 9], vec![5, 9, 20]],
    ];

    for sets in &batteries {
        let (rev_cold, dom_cold) = run_plain(sets, None);
        let (rev_warm, dom_warm) = run_plain(sets, Some(next_gac_id()));
        assert_eq!(rev_cold, rev_warm, "revision parity for {sets:?}");
        assert_eq!(dom_cold, dom_warm, "domain parity for {sets:?}");
    }
}

#[test]
fn p1_warm_cold_parity_multi_call_universe_shrink() {
    // Replay a search path on ONE warm id whose value universe SHRINKS across
    // calls. At every step the warm result (reusing an accumulating matching
    // cache + the persistent value→index scratch) must equal an independent
    // cold recompute over the same pre-state.
    let warm_id = next_gac_id();

    // Progressively shrink 6 vars over {0..8} down through {0..4}, pinning as
    // we descend — the value universe contracts from 9 distinct values to 5.
    let steps: Vec<Vec<Vec<u32>>> = vec![
        vec![
            vec![0, 1, 2, 3, 4, 5, 6, 7, 8],
            vec![0, 1, 2, 3, 4, 5, 6, 7, 8],
            vec![0, 1, 2, 3, 4, 5, 6, 7, 8],
            vec![0, 1, 2, 3, 4, 5, 6, 7, 8],
            vec![0, 1, 2, 3, 4, 5, 6, 7, 8],
            vec![0, 1, 2, 3, 4, 5, 6, 7, 8],
        ],
        vec![
            vec![0, 1],
            vec![0, 1],
            vec![0, 1, 2, 3, 4],
            vec![2, 3, 4],
            vec![2, 3, 4],
            vec![2, 3, 4],
        ],
        vec![
            vec![0],
            vec![1],
            vec![2, 3, 4],
            vec![2, 3, 4],
            vec![2, 3, 4],
            vec![2, 3, 4],
        ],
        // Universe shrunk to {2,3,4}: three vars fight over three values,
        // the rest are pinned — Hall pruning bites.
        vec![
            vec![0],
            vec![1],
            vec![2, 3],
            vec![2, 3],
            vec![2, 3, 4],
            vec![4],
        ],
    ];

    for (i, sets) in steps.iter().enumerate() {
        let (rev_cold, dom_cold) = run_plain(sets, None);
        let (rev_warm, dom_warm) = run_plain(sets, Some(warm_id));
        assert_eq!(rev_cold, rev_warm, "step {i} revision parity");
        assert_eq!(dom_cold, dom_warm, "step {i} domain parity (warm shrink)");
    }
}

// ---------------------------------------------------------------------------
// P2 — cross-value-universe scratch reset: same-thread == fresh-thread
// ---------------------------------------------------------------------------

#[test]
fn p2_cross_universe_scratch_reset() {
    // Three constraint states over DISJOINT / shrinking value universes, each
    // with a known Hall prune. Run them in sequence on the main thread (which
    // reuses the persistent value→index scratch across all three), then verify
    // each result equals the same single call executed on a FRESH thread with
    // a pristine thread-local scratch. Any cross-call leakage (INV-A) makes the
    // same-thread result diverge from the fresh-thread one.
    let a: Vec<Vec<u32>> = vec![vec![1, 2], vec![1, 2], vec![1, 2, 15]];
    let b: Vec<Vec<u32>> = vec![vec![100, 101], vec![100, 101], vec![100, 101, 108]];
    let a2: Vec<Vec<u32>> = vec![vec![1, 2], vec![1, 2], vec![1, 2, 5]];

    // Same-thread, in sequence (fresh ids so no warm cache — this isolates the
    // adjacency/value→index scratch, not the matching cache).
    let same_a = run_plain(&a, Some(next_gac_id()));
    let same_b = run_plain(&b, Some(next_gac_id()));
    let same_a2 = run_plain(&a2, Some(next_gac_id()));

    // Fresh-thread recompute of each, in isolation.
    let fresh = |sets: Vec<Vec<u32>>| {
        std::thread::spawn(move || run_plain(&sets, Some(next_gac_id())))
            .join()
            .unwrap()
    };
    assert_eq!(same_a, fresh(a), "universe A same==fresh");
    assert_eq!(same_b, fresh(b), "universe B same==fresh");
    assert_eq!(same_a2, fresh(a2), "shrunk universe A2 same==fresh");

    // Spot-check the known prunes actually happened (guards against a
    // both-broken-identically false pass).
    assert_eq!(same_a.1[2], vec![15], "A: third var pruned to {{15}}");
    assert_eq!(same_b.1[2], vec![108], "B: third var pruned to {{108}}");
    assert_eq!(same_a2.1[2], vec![5], "A2: third var pruned to {{5}}");
}

// ---------------------------------------------------------------------------
// P3 — generic non-integer instantiation (INV-C, bbnf blast radius)
// ---------------------------------------------------------------------------

#[test]
fn p3_generic_finite_domain_string_monomorphizes_and_solves() {
    // Csp<FiniteDomain<String>> + add_all_different forces
    // propagate_gac_core::<FiniteDomain<String>> to monomorphize — String has
    // no Ord/Hash used by the core, so any bound narrowing on the integer fast
    // path would be a COMPILE error here. Four vars over four colors ⇒ 24
    // distinct permutations (live=4 ≥ GAC_MIN_PARTICIPANTS, so GAC runs).
    let colors: Vec<String> = ["red", "green", "blue", "yellow"]
        .iter()
        .map(|s| s.to_string())
        .collect();

    let mut csp: Csp<FiniteDomain<String>> = Csp::new();
    let vars = csp.add_variables(&FiniteDomain::new(colors.clone()), 4);
    csp.add_all_different(vars);
    csp.finalize();

    let config = SolveConfig {
        max_solutions: usize::MAX,
        ..SolveConfig::default()
    };
    let solutions = csp.solve(&config);

    assert_eq!(
        solutions.len(),
        24,
        "4 colors, 4 all-different vars ⇒ 4! = 24"
    );
    for sol in &solutions {
        let mut seen = sol.clone();
        seen.sort();
        seen.dedup();
        assert_eq!(
            seen.len(),
            4,
            "each solution is a permutation of 4 distinct colors"
        );
    }
}

// ---------------------------------------------------------------------------
// P4 — singleton-removal snapshot equivalence (INV-D/E/F)
// ---------------------------------------------------------------------------

#[test]
fn p4a_two_singletons_same_value_unsat() {
    // AllDifferent: two vars pinned to the same value ⇒ Unsatisfiable via the
    // singleton pass (GAC never sees assigned vars).
    let ad = AllDifferent::new(vec![0, 1, 2]);
    let mut vars = vars_bit(&[vec![5], vec![5], vec![5, 6, 7]]);
    assert_eq!(ad.revise(&mut vars, 0), Revision::Unsatisfiable);
}

#[test]
fn p4b_snapshot_not_fuse_live() {
    // The tripwire that pins the beat to a SNAPSHOT-faithful pool, not a
    // fuse-live rewrite. A={0} is the only singleton at snapshot; pruning 0
    // from B makes B={1} a NEW singleton mid-call. A snapshot pass does NOT
    // reprocess B, so C keeps {1,2}. A fuse-live pass would prune 1 from C.
    // (live drops to 1 after the pass ⇒ GAC is skipped, isolating the pass.)
    let ad = AllDifferent::new(vec![0, 1, 2]);
    let mut vars = vars_bit(&[vec![0], vec![0, 1], vec![1, 2]]);
    let rev = ad.revise(&mut vars, 0);
    assert_eq!(rev, Revision::Changed);
    assert_eq!(
        snapshot(&vars),
        vec![vec![0], vec![1], vec![1, 2]],
        "C must retain {{1,2}} — snapshot semantics, not fuse-live"
    );
}

#[test]
fn p4c_live_below_threshold_singleton_only() {
    // live = 2 (< GAC_MIN_PARTICIPANTS = 3): GAC is skipped, the singleton pass
    // is the ONLY propagation. A={2} prunes 2 from the two live peers.
    let ad = AllDifferent::new(vec![0, 1, 2]);
    let mut vars = vars_bit(&[vec![2], vec![0, 1, 2], vec![2, 3]]);
    let rev = ad.revise(&mut vars, 0);
    assert_eq!(rev, Revision::Changed);
    assert_eq!(snapshot(&vars), vec![vec![2], vec![0, 1], vec![3]]);
}

#[test]
fn p4d_all_different_except_small_scope_twin() {
    // AllDifferentExcept <4 twin path (scope len 3): non-sentinel singletons
    // prune peers; a sentinel singleton (C={0}=sentinel) is filtered out and
    // does NOT forbid peers from the sentinel. A={2} prunes 2 from B,C.
    let ade = AllDifferentExcept::new(vec![0, 1, 2], 0u32);
    let mut vars = vars_bit(&[vec![2], vec![0, 2], vec![0]]);
    let rev = ade.revise(&mut vars, 0);
    assert_eq!(rev, Revision::Changed);
    assert_eq!(
        snapshot(&vars),
        vec![vec![2], vec![0], vec![0]],
        "sentinel peers keep 0; only the non-sentinel value 2 is removed"
    );

    // And the same-value non-sentinel collision is UNSAT on the twin path.
    let ade2 = AllDifferentExcept::new(vec![0, 1, 2], 0u32);
    let mut vars2 = vars_bit(&[vec![3], vec![3], vec![3, 4]]);
    assert_eq!(ade2.revise(&mut vars2, 0), Revision::Unsatisfiable);
}

// ---------------------------------------------------------------------------
// P5 — node/backtrack freeze + queens8 + n=20 LAP proven-optimal
// ---------------------------------------------------------------------------

fn lcg_cost_matrix(rows: usize, cols: usize, seed: u64) -> Vec<f64> {
    let mut state = seed;
    (0..rows * cols)
        .map(|_| {
            state = state
                .wrapping_mul(6364136223846793005)
                .wrapping_add(1442695040888963407);
            ((state >> 33) as f64) / (u32::MAX as f64) * 100.0
        })
        .collect()
}

fn solve_bnb(n: usize) -> csp_solver::AssignmentSolution {
    let matrix = lcg_cost_matrix(n, n, 0xDEAD_BEEF);
    assignment()
        .rows(n)
        .cols(n)
        .cost(|i, k| matrix[i * n + k])
        .unmatch_penalty(1000.0)
        .solve_branch_and_bound()
        .expect("solvable")
}

#[test]
fn p5_bnb_node_counts_frozen() {
    // ── SEARCH-TRAJECTORY LOCK — improvements must re-baseline deliberately ──
    // ONE frozen node/backtrack count, deliberately exact. The dispatch-bypass
    // forces the CSP B&B path so this is the sole tripwire that reds on ANY shift
    // in the assignment B&B search order — a beat that moved propagation
    // strength, or a singleton pool that broke snapshot parity. It is EXPECTED to
    // red on a legitimate search-order IMPROVEMENT too: the new number is then
    // re-baselined here in a reviewed commit, never auto-relaxed. Soundness
    // itself is guarded elsewhere (solution-set invariance in
    // `oracle_and_invariance.rs` + the corpus node-spine, `ci.yml`); this locks
    // trajectory, nothing else does.
    let n10 = solve_bnb(10);
    assert_eq!(n10.stats.nodes_explored, 506, "assign n=10 nodes (frozen)");
    assert_eq!(n10.stats.backtracks, 515, "assign n=10 backtracks (frozen)");
    assert!(!n10.stats.budget_exceeded);

    // n=15 — a BAND, not a freeze. Catches a gross propagation regression at a
    // larger size without reddening on benign search-order drift (the freeze
    // above owns the exact-trajectory duty). Current value: 4016 nodes.
    let n15 = solve_bnb(15);
    assert!(
        !n15.stats.budget_exceeded,
        "assign n=15 completes in budget"
    );
    assert!(
        (3_000..5_000).contains(&n15.stats.nodes_explored),
        "assign n=15 nodes {} outside the sane band 3_000..5_000 — a gross regression",
        n15.stats.nodes_explored
    );

    // n=20 — a PROPERTY, not a trajectory count: this dense instance provably
    // blows the B&B node budget, halting at the deterministic 1_000_000 cap (a
    // hard ceiling the search stops at, not an order-sensitive value). The LAP
    // path beats it — see `p5_n20_lap_proven_optimal`.
    let n20 = solve_bnb(20);
    assert!(n20.stats.budget_exceeded, "n=20 B&B budget-blows");
    assert_eq!(
        n20.stats.nodes_explored, 1_000_000,
        "n=20 halts at the deterministic node-budget cap"
    );
}

#[test]
fn p5_n20_lap_proven_optimal() {
    // The n=20 group-free/pin-free instance now dispatches to the Hungarian LAP
    // path: proven-optimal, no budget blow, and STRICTLY better than the
    // budget-blown B&B best-so-far (86.985140407).
    let n = 20;
    let matrix = lcg_cost_matrix(n, n, 0xDEAD_BEEF);
    let lap = assignment()
        .rows(n)
        .cols(n)
        .cost(|i, k| matrix[i * n + k])
        .unmatch_penalty(1000.0)
        .solve()
        .expect("solvable");

    assert!(!lap.stats.budget_exceeded, "LAP path never budget-blows");
    assert_eq!(lap.stats.nodes_explored, 0, "LAP path runs no search nodes");

    // Every assigned column is a distinct real column (no unmatched rows are
    // needed for this dense square instance).
    let mut cols: Vec<i32> = lap.assign.clone();
    assert!(
        cols.iter().all(|&c| (0..n as i32).contains(&c)),
        "all rows matched to real columns"
    );
    cols.sort_unstable();
    cols.dedup();
    assert_eq!(cols.len(), n, "columns are pairwise distinct");

    // Proven-optimal cost, and beats the B&B budget-blown best-so-far.
    assert!(
        (lap.cost - 83.055652581).abs() < 1e-6,
        "LAP optimal cost, got {}",
        lap.cost
    );
    assert!(
        lap.cost < 86.985140407,
        "LAP beats the budget-blown B&B best-so-far"
    );
}

// (queens8=92 was here — collapsed into the canonical enumerate + set-equality
// in `oracle_and_invariance.rs::queens8_solution_set_invariant_*`, which runs
// the same build under all 4 prunings × 3 orderings. This file's beat coverage
// is P1–P4/P6; a bare queens8 re-enumeration added nothing here.)

// ---------------------------------------------------------------------------
// P6 — sudoku + futoshiki green under the pool (no RefCell panic)
// ---------------------------------------------------------------------------

#[test]
fn p6_sudoku_solves_under_pool() {
    use csp_solver::sudoku::{Difficulty, generate_board, solve_sudoku};
    use csp_solver::{Pruning, SolveConfig};

    // A generated 9×9 board exercises 27 concurrent AllDifferents (the borrow
    // path Q9 INV-E flags) plus the singleton pool + GAC core. No RefCell
    // double-borrow may occur.
    let board = generate_board(3, Difficulty::Easy);
    let config = SolveConfig {
        pruning: Pruning::Ac3,
        ..SolveConfig::default()
    };
    let sol = solve_sudoku(&board, 3, &config).expect("solvable 9×9");
    assert_eq!(sol.len(), 81);
    assert!(sol.iter().all(|&c| (1..=9).contains(&c)));
}

#[test]
fn p6_futoshiki_solves_under_pool() {
    use csp_solver::puzzles::futoshiki::{FutoshikiPuzzle, solve_futoshiki};

    // A 5×5 Latin square (no inequalities) drives row/col AllDifferents with
    // live=5 ⇒ GAC + the pool, under the public solve path.
    let puzzle = FutoshikiPuzzle {
        n: 5,
        fixed_cells: vec![],
        inequalities: vec![],
    };
    let solutions = solve_futoshiki(&puzzle);
    assert!(!solutions.is_empty(), "5×5 Latin square is satisfiable");
    assert_eq!(solutions[0].len(), 25);
}
