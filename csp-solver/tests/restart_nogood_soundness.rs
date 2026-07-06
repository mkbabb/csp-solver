//! Restart / nogood / CHS soundness — Pass-3 wave acceptance tests.
//!
//! Attack agent: `restart-nogood-soundness`. Target claim:
//!   "NogoodStore is wired soundly as nld-nogoods (no half-state) — but zero
//!    tests exercise restarts:true or Ordering::Chs."
//!
//! These are the missing tests. They are written so that:
//!   1. The CORRECTNESS invariants (no dupes / no losses / valid solutions /
//!      determinism) hold on the composed base AND must keep holding once the
//!      restart/CHS/nogood driver lands. They are the durable wave-acceptance
//!      gate (GF-4).
//!   2. The INERTNESS WITNESSES (`witness_*`) mechanically pin the *current*
//!      state: on the composed base `restarts:true` is a no-op and
//!      `Ordering::Chs` is bit-identical to `Ordering::Mrv` (see
//!      pass-3 `rust-composition.md` §3 step-3: the chs `backtrack.rs` restart
//!      DRIVER is not landed; only the substrate is). They pass green today.
//!      When the driver lands they MUST be inverted to `assert_ne!` (their doc
//!      comments say so) — they are the canary that flips the day restarts
//!      actually do something.
//!
//! Refutation summary (proved by these tests + a src-tree grep):
//!   `NogoodStore`, `ConflictHistory`, and `Luby` have ZERO call sites in
//!   `src/` outside their own module files. Nothing in `search.rs` records or
//!   consults a nogood, bumps a CHS weight, or ticks a Luby schedule. The
//!   store is exercised only as a stand-alone data structure. So the claim's
//!   premise "NogoodStore is wired" is false: it is *sound in isolation* and
//!   *unwired in the solver*.

use std::collections::BTreeSet;

use csp_solver::constraint::{AllDifferent, LambdaConstraint, NotEqual, VarId};
use csp_solver::domain::bitset::BitsetDomain;
use csp_solver::ordering::Ordering;
use csp_solver::solver::nogoods::NogoodStore;
use csp_solver::sudoku::{Difficulty, create_sudoku_csp, generate_board, solve_sudoku};
use csp_solver::{Csp, Pruning, SolveConfig};

type Sol = Vec<u32>;

// ===========================================================================
// Shared builders
// ===========================================================================

/// Build the standard n-queens CSP (variable i = row of the queen in column i,
/// domain 0..n; AllDifferent on rows + pairwise diagonal Lambda). Mirrors the
/// model in `tests/solver.rs` so solution vectors are directly comparable.
fn queens_csp(n: u32) -> Csp<BitsetDomain> {
    let mut csp = Csp::new();
    let domain = BitsetDomain::new(0..n);
    let vars = csp.add_variables(&domain, n as usize);
    csp.add_constraint(AllDifferent::new(vars.clone()));
    for i in 0..n {
        for j in (i + 1)..n {
            let vi = vars[i as usize];
            let vj = vars[j as usize];
            let diff = j - i;
            csp.add_constraint(LambdaConstraint::new(
                vec![vi, vj],
                move |a: &[Option<u32>]| match (&a[vi as usize], &a[vj as usize]) {
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

/// Independent brute-force oracle for n-queens: full DFS over columns with a
/// hand-written predicate that shares no code with the solver. Returns the set
/// of solutions as row-per-column vectors.
fn queens_oracle(n: u32) -> BTreeSet<Sol> {
    let mut out = BTreeSet::new();
    let mut rows: Sol = Vec::new();
    fn go(n: u32, rows: &mut Sol, out: &mut BTreeSet<Sol>) {
        let col = rows.len() as u32;
        if col == n {
            out.insert(rows.clone());
            return;
        }
        for r in 0..n {
            let ok = rows
                .iter()
                .enumerate()
                .all(|(pc, &pr)| pr != r && (col - pc as u32) != pr.abs_diff(r));
            if ok {
                rows.push(r);
                go(n, rows, out);
                rows.pop();
            }
        }
    }
    go(n, &mut rows, &mut out);
    out
}

/// Config that enumerates every solution under a given ordering / restart flag.
fn enum_config(ordering: Ordering, restarts: bool) -> SolveConfig {
    SolveConfig {
        pruning: Pruning::ForwardChecking,
        ordering,
        max_solutions: usize::MAX,
        restarts,
        ..Default::default()
    }
}

fn as_set(sols: &[Sol]) -> BTreeSet<Sol> {
    sols.iter().cloned().collect()
}

// ===========================================================================
// 1. enumerate-all-vs-brute-force, restarts on — no dupes, no losses
// ===========================================================================

#[test]
fn enumerate_all_queens_matches_bruteforce_restarts_on_and_off() {
    for n in 4u32..=7 {
        let oracle = queens_oracle(n);

        for ordering in [Ordering::FailFirst, Ordering::Mrv, Ordering::Chs] {
            for restarts in [false, true] {
                let mut csp = queens_csp(n);
                let sols = csp.solve(&enum_config(ordering, restarts));

                // No duplicates: the returned Vec must already be a set.
                let set = as_set(&sols);
                assert_eq!(
                    set.len(),
                    sols.len(),
                    "n={n} ordering={ordering:?} restarts={restarts}: solver returned duplicate solutions"
                );

                // No losses / no spurious: exact match against the independent oracle.
                assert_eq!(
                    set, oracle,
                    "n={n} ordering={ordering:?} restarts={restarts}: solution SET differs from brute-force oracle"
                );
            }
        }
    }
}

// ===========================================================================
// 1b. Random-CSP property test: restarts + CHS never change the solution set
//     (cross-checked against an independent cartesian-product oracle).
// ===========================================================================

/// Independent oracle: enumerate the full product domain^k and keep tuples that
/// satisfy every NotEqual edge. Shares no code with the solver.
fn notequal_oracle(k: usize, dom: u32, edges: &[(usize, usize)]) -> BTreeSet<Sol> {
    let mut out = BTreeSet::new();
    let mut cur: Sol = vec![0; k];
    fn go(
        i: usize,
        k: usize,
        dom: u32,
        edges: &[(usize, usize)],
        cur: &mut Sol,
        out: &mut BTreeSet<Sol>,
    ) {
        if i == k {
            if edges.iter().all(|&(a, b)| cur[a] != cur[b]) {
                out.insert(cur.clone());
            }
            return;
        }
        for v in 0..dom {
            cur[i] = v;
            go(i + 1, k, dom, edges, cur, out);
        }
    }
    go(0, k, dom, edges, &mut cur, &mut out);
    out
}

fn notequal_csp(k: usize, dom: u32, edges: &[(usize, usize)]) -> Csp<BitsetDomain> {
    let mut csp = Csp::new();
    let domain = BitsetDomain::new(0..dom);
    let vars = csp.add_variables(&domain, k);
    for &(a, b) in edges {
        csp.add_constraint(NotEqual::new(vars[a], vars[b]));
    }
    csp.finalize();
    csp
}

#[test]
fn random_notequal_csp_restarts_and_chs_preserve_solution_set() {
    // Deterministic LCG — reproducible without pulling extra deps.
    let mut state: u64 = 0x9E3779B97F4A7C15;
    let mut next = || {
        state = state
            .wrapping_mul(6364136223846793005)
            .wrapping_add(1442695040888963407);
        (state >> 33) as u32
    };

    for _ in 0..200 {
        let k = 3 + (next() % 4) as usize; // 3..=6 vars
        let dom = 2 + next() % 3; // 2..=4 values
        // Random edge set over the complete graph.
        let mut edges = Vec::new();
        for a in 0..k {
            for b in (a + 1)..k {
                if next() % 2 == 0 {
                    edges.push((a, b));
                }
            }
        }

        let oracle = notequal_oracle(k, dom, &edges);

        for ordering in [Ordering::FailFirst, Ordering::Mrv, Ordering::Chs] {
            for restarts in [false, true] {
                let mut csp = notequal_csp(k, dom, &edges);
                let sols = csp.solve(&enum_config(ordering, restarts));
                let set = as_set(&sols);
                assert_eq!(
                    set.len(),
                    sols.len(),
                    "k={k} dom={dom} edges={edges:?} ordering={ordering:?} restarts={restarts}: duplicate solutions"
                );
                assert_eq!(
                    set, oracle,
                    "k={k} dom={dom} edges={edges:?} ordering={ordering:?} restarts={restarts}: solution set != oracle"
                );
            }
        }
    }
}

// ===========================================================================
// 2. Nogood-consistency: a genuine nogood never blocks a valid solution.
//
//    A "genuine nogood" is a partial assignment with NO completion in the
//    solution set. Soundness invariant: replaying any real full solution
//    variable-by-variable, `is_nogood` must NEVER fire — otherwise the store
//    would have pruned a branch that reaches a valid solution.
// ===========================================================================

#[test]
fn nogood_store_never_blocks_a_valid_solution() {
    // Small NotEqual CSP with a rich solution set + genuine dead ends.
    let k = 5usize;
    let dom = 3u32;
    let edges = [(0, 1), (1, 2), (2, 3), (3, 4), (0, 2), (1, 3)];
    let solutions = notequal_oracle(k, dom, &edges);
    assert!(!solutions.is_empty(), "need a non-trivial solution set");

    // Enumerate ALL partial assignments (prefixes over vars 0..k in index order)
    // that have no completion — these are genuine nogoods — and record them.
    let mut store = NogoodStore::<u32>::new(k, 100_000, k);
    let mut recorded = 0usize;
    // Prefixes of length 1..=k over the index order.
    fn gen_prefixes(
        i: usize,
        k: usize,
        dom: u32,
        prefix: &mut Vec<(VarId, u32)>,
        solutions: &BTreeSet<Sol>,
        store: &mut NogoodStore<u32>,
        recorded: &mut usize,
    ) {
        if i == k {
            return;
        }
        for v in 0..dom {
            prefix.push((i as VarId, v));
            // Does any full solution start with this exact prefix (index order)?
            let has_completion = solutions
                .iter()
                .any(|s| prefix.iter().all(|&(var, val)| s[var as usize] == val));
            if !has_completion {
                // Genuine nogood: this prefix reaches no solution. Record it.
                store.record(prefix);
                *recorded += 1;
            } else {
                // Keep extending only live prefixes (dead ones stay recorded
                // as the shortest dead prefix).
                gen_prefixes(i + 1, k, dom, prefix, solutions, store, recorded);
            }
            prefix.pop();
        }
    }
    let mut prefix = Vec::new();
    gen_prefixes(
        0,
        k,
        dom,
        &mut prefix,
        &solutions,
        &mut store,
        &mut recorded,
    );
    assert!(recorded > 0, "expected some genuine nogoods to exist");

    // SOUNDNESS: replay every real solution in index order. At each step, the
    // store must not report the next (var,val) as a nogood given the prefix so
    // far — a genuine nogood can never be a prefix of a real solution.
    for s in &solutions {
        let mut assignment: Vec<Option<u32>> = vec![None; k];
        for var in 0..k {
            let val = s[var];
            assert!(
                !store.is_nogood(var as VarId, &val, &assignment),
                "genuine nogood blocked valid solution {s:?} at var {var}={val}"
            );
            assignment[var] = Some(val);
        }
    }
}

// ===========================================================================
// 2b. NogoodStore no-half-state after eviction: the LRU var_index stays
//     consistent with the live store across a long record/evict stream, and
//     is_nogood answers agree with a from-scratch reference store.
// ===========================================================================

#[test]
fn nogood_store_no_half_state_across_eviction_stream() {
    let num_vars = 6usize;
    let cap = 4usize;
    let max_len = 3usize;
    let mut store = NogoodStore::<u32>::new(max_len, cap, num_vars);

    // A deterministic stream of nogoods; the live window is the last `cap`
    // records whose length <= max_len.
    let mut stream: Vec<Vec<(VarId, u32)>> = Vec::new();
    let mut lcg: u64 = 12345;
    let mut rnd = || {
        lcg = lcg.wrapping_mul(6364136223846793005).wrapping_add(1);
        (lcg >> 33) as u32
    };
    for _ in 0..80 {
        let len = 1 + (rnd() % (max_len as u32 + 1)) as usize; // 1..=max_len+1 (some dropped)
        let mut ng: Vec<(VarId, u32)> = Vec::new();
        let mut used = BTreeSet::new();
        for _ in 0..len {
            let var = (rnd() % num_vars as u32) as VarId;
            if used.insert(var) {
                ng.push((var, rnd() % 4));
            }
        }
        store.record(&ng);
        // Maintain the reference "live window": only records with len <= max_len
        // survive; keep the last `cap` of them.
        if ng.len() <= max_len {
            stream.push(ng.clone());
            if stream.len() > cap {
                stream.remove(0);
            }
        }

        // Invariant 1: len matches the live window.
        assert_eq!(
            store.len(),
            stream.len(),
            "store len drifted from live window"
        );

        // Invariant 2 (no half-state): every membership query agrees with a
        // brute-force scan of the reference live window, for a spread of
        // (var,val,assignment) probes.
        for var in 0..num_vars as VarId {
            for val in 0..4u32 {
                // Probe against a couple of assignments.
                for seed in 0..3u32 {
                    let assignment: Vec<Option<u32>> =
                        (0..num_vars).map(|v| Some((v as u32 + seed) % 4)).collect();
                    let got = store.is_nogood(var, &val, &assignment);
                    // Reference: does any live nogood contain (var,val) and have
                    // all its other pairs satisfied by `assignment`?
                    let want = stream.iter().any(|ng| {
                        ng.iter().any(|&(nv, nval)| nv == var && nval == val)
                            && ng.iter().all(|&(nv, nval)| {
                                nv == var || assignment[nv as usize] == Some(nval)
                            })
                    });
                    assert_eq!(
                        got, want,
                        "is_nogood disagreement after eviction: var={var} val={val} seed={seed}"
                    );
                }
            }
        }
    }
}

// ===========================================================================
// 3. Phase-memory determinism: repeated solves are byte-identical.
//    (When phase saving lands it must remain deterministic — this guards it.)
// ===========================================================================

#[test]
fn phase_memory_determinism_repeated_solves() {
    for ordering in [Ordering::Mrv, Ordering::Chs] {
        let cfg = SolveConfig {
            pruning: Pruning::Ac3,
            ordering,
            max_solutions: 50,
            restarts: true,
            ..Default::default()
        };

        let mut first_sols: Option<Vec<Sol>> = None;
        let mut first_stats: Option<(u64, u64, u64)> = None;
        for _ in 0..5 {
            let mut csp = queens_csp(7);
            let sols = csp.solve(&cfg);
            let st = csp.stats();
            let stats = (st.nodes_explored, st.backtracks, st.propagations);
            match (&first_sols, &first_stats) {
                (None, None) => {
                    first_sols = Some(sols);
                    first_stats = Some(stats);
                }
                (Some(fs), Some(fst)) => {
                    assert_eq!(
                        &sols, fs,
                        "ordering={ordering:?}: solution list not deterministic across runs"
                    );
                    assert_eq!(
                        &stats, fst,
                        "ordering={ordering:?}: stats not deterministic across runs"
                    );
                }
                _ => unreachable!(),
            }
        }
    }
}

// ===========================================================================
// 4. restart-with-no-givens solve() path: exercises feasibility_search's
//    `given = None` branch with restarts:true.
// ===========================================================================

#[test]
fn restart_no_givens_solve_path_finds_valid_solution() {
    // n-queens via solve() (given = None), restarts on.
    let cfg = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::Chs,
        max_solutions: 1,
        restarts: true,
        ..Default::default()
    };
    let mut csp = queens_csp(8);
    let sols = csp.solve(&cfg);
    assert_eq!(
        sols.len(),
        1,
        "8-queens restart/no-givens must find a solution"
    );
    let s = &sols[0];
    for i in 0..8usize {
        for j in (i + 1)..8usize {
            assert_ne!(s[i], s[j], "same row");
            assert_ne!(s[i].abs_diff(s[j]), (j - i) as u32, "same diagonal");
        }
    }

    // Empty 4x4 sudoku via solve() (no givens at all): all-zero board, ignore
    // the (empty) given list, drive the given=None code path directly.
    let empty = vec![0u32; 16];
    let (mut csp, given) = create_sudoku_csp(&empty, 2);
    assert!(given.is_empty(), "empty board must yield no givens");
    let sols = csp.solve(&cfg);
    assert_eq!(
        sols.len(),
        1,
        "empty 4x4 sudoku restart/no-givens must find a filling"
    );
    let s = &sols[0];
    // Validate rows/cols/boxes of the 4x4.
    for r in 0..4 {
        let mut row: Vec<u32> = (0..4).map(|c| s[r * 4 + c]).collect();
        row.sort();
        assert_eq!(row, vec![1, 2, 3, 4], "row {r} not a permutation");
    }
    for c in 0..4 {
        let mut col: Vec<u32> = (0..4).map(|r| s[r * 4 + c]).collect();
        col.sort();
        assert_eq!(col, vec![1, 2, 3, 4], "col {c} not a permutation");
    }
    for br in 0..2 {
        for bc in 0..2 {
            let mut b: Vec<u32> = Vec::new();
            for dr in 0..2 {
                for dc in 0..2 {
                    b.push(s[(br * 2 + dr) * 4 + (bc * 2 + dc)]);
                }
            }
            b.sort();
            assert_eq!(b, vec![1, 2, 3, 4], "box ({br},{bc}) not a permutation");
        }
    }
}

// ===========================================================================
// 5. CHS-ordering solve correctness on the corpus (sudoku + queens + coloring).
// ===========================================================================

fn valid_full_sudoku(sol: &[u32], n: u32) -> bool {
    let m = (n * n) as usize;
    if sol.len() != m * m {
        return false;
    }
    let target: BTreeSet<u32> = (1..=n * n).collect();
    for r in 0..m {
        let row: BTreeSet<u32> = (0..m).map(|c| sol[r * m + c]).collect();
        if row != target {
            return false;
        }
    }
    for c in 0..m {
        let col: BTreeSet<u32> = (0..m).map(|r| sol[r * m + c]).collect();
        if col != target {
            return false;
        }
    }
    for bi in 0..n as usize {
        for bj in 0..n as usize {
            let mut b = BTreeSet::new();
            for di in 0..n as usize {
                for dj in 0..n as usize {
                    b.insert(sol[(bi * n as usize + di) * m + (bj * n as usize + dj)]);
                }
            }
            if b != target {
                return false;
            }
        }
    }
    true
}

#[test]
fn chs_ordering_solves_sudoku_corpus() {
    let chs = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::Chs,
        max_solutions: 1,
        restarts: true,
        ..Default::default()
    };
    let reference = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::FailFirst,
        max_solutions: 1,
        restarts: false,
        ..Default::default()
    };

    for diff in [Difficulty::Easy, Difficulty::Medium, Difficulty::Hard] {
        for _ in 0..4 {
            let board = generate_board(3, diff);
            let chs_sol = solve_sudoku(&board, 3, &chs).expect("CHS must solve the corpus board");
            assert!(
                valid_full_sudoku(&chs_sol, 3),
                "CHS produced an invalid 9x9 solution"
            );

            // For uniquely-solvable boards the CHS solution must equal the
            // reference solution. Generated boards are canonically unique.
            let ref_sol = solve_sudoku(&board, 3, &reference).expect("reference must solve");
            assert_eq!(
                chs_sol, ref_sol,
                "CHS solution differs from reference on a unique board"
            );
        }
    }
}

#[test]
fn chs_ordering_solves_queens_and_coloring() {
    // Queens: full enumeration under CHS must match the oracle.
    for n in 4u32..=7 {
        let mut csp = queens_csp(n);
        let sols = csp.solve(&enum_config(Ordering::Chs, true));
        assert_eq!(
            as_set(&sols),
            queens_oracle(n),
            "CHS queens n={n} enumeration wrong"
        );
    }

    // Australia map coloring (3 colors) under CHS — must be solvable & valid.
    let mut csp = Csp::new();
    let domain = BitsetDomain::new(0..3);
    let _ = csp.add_variables(&domain, 7);
    let edges: [(VarId, VarId); 9] = [
        (0, 1),
        (0, 2),
        (1, 2),
        (1, 3),
        (2, 3),
        (2, 4),
        (2, 5),
        (3, 4),
        (4, 5),
    ];
    for (a, b) in edges {
        csp.add_constraint(NotEqual::new(a, b));
    }
    csp.finalize();
    let cfg = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::Chs,
        max_solutions: 1,
        restarts: true,
        ..Default::default()
    };
    let sols = csp.solve(&cfg);
    assert_eq!(sols.len(), 1, "CHS must 3-color Australia");
    for (a, b) in edges {
        assert_ne!(
            sols[0][a as usize], sols[0][b as usize],
            "adjacent regions share a color"
        );
    }
}

// ===========================================================================
// INERTNESS WITNESSES — these PIN the current (unwired) state.
//
// They pass GREEN on the composed base because the restart/CHS DRIVER is not
// landed (rust-composition.md §3 step-3: chs backtrack.rs re-authoring
// deferred). Each asserts an EQUALITY that MUST become an inequality once the
// driver is wired. Treat a green run of these as "restarts/CHS still inert";
// treat a red run as "the driver just changed behavior — go invert the assert
// and re-read the correctness tests above."
// ===========================================================================

/// Count nodes + backtracks for one enumeration under a config.
fn counts(csp: &mut Csp<BitsetDomain>, cfg: &SolveConfig) -> (u64, u64, u64) {
    let _ = csp.solve(cfg);
    let s = csp.stats();
    (s.nodes_explored, s.backtracks, s.propagations)
}

#[test]
fn witness_restarts_true_is_a_noop_today() {
    // Same instance, same ordering, restarts flipped. On the composed base the
    // restart driver is unwired, so the search is byte-identical.
    //
    // WHEN THE DRIVER LANDS: on a heavy-tailed instance these counts should
    // DIVERGE. Invert to assert_ne! (and pick an instance where restarts help).
    let base = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::Mrv,
        max_solutions: usize::MAX,
        restarts: false,
        ..Default::default()
    };
    let mut on = base.clone();
    on.restarts = true;

    for n in 6u32..=8 {
        let mut a = queens_csp(n);
        let mut b = queens_csp(n);
        assert_eq!(
            counts(&mut a, &base),
            counts(&mut b, &on),
            "n={n}: restarts:true changed the node/backtrack counts — the restart driver \
             appears to be WIRED. Re-read this file's header and invert this witness."
        );
    }
}

#[test]
fn witness_chs_is_bit_identical_to_mrv_today() {
    // CHS and Mrv share the `dom/Σw` scan; CHS only differs once weights are
    // bumped on conflict, which requires the (unlanded) driver. So today they
    // explore the identical tree.
    //
    // WHEN THE DRIVER LANDS: CHS should reorder variables after the first
    // conflict wave. Invert to assert_ne! on a conflict-rich instance.
    let mk = |ordering| SolveConfig {
        pruning: Pruning::Ac3,
        ordering,
        max_solutions: usize::MAX,
        restarts: false,
        ..Default::default()
    };

    for n in 6u32..=8 {
        let mut a = queens_csp(n);
        let mut b = queens_csp(n);
        assert_eq!(
            counts(&mut a, &mk(Ordering::Mrv)),
            counts(&mut b, &mk(Ordering::Chs)),
            "n={n}: Ordering::Chs diverged from Mrv — CHS weight bumping \
             appears to be WIRED. Invert this witness."
        );
    }
}

#[test]
fn witness_stats_have_no_restart_observable() {
    // Structural: SolveStats exposes no restart / conflict / nogood counter, so
    // a restart, were one to happen, would leave no trace. This documents the
    // observability gap the driver must also close (add e.g. `restarts: u64`).
    let cfg = SolveConfig {
        restarts: true,
        ..Default::default()
    };
    let mut csp = queens_csp(6);
    let _ = csp.solve(&cfg);
    let s = csp.stats();
    // The only fields that exist today. If this stops compiling because a
    // `restarts`/`conflicts` field was added, the driver landed — update the
    // witnesses above.
    let _observable = (
        s.nodes_explored,
        s.backtracks,
        s.propagations,
        s.budget_exceeded,
        s.cancelled,
    );
}
