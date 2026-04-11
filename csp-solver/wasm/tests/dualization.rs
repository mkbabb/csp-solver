//! Brute-force parity test for `solveAssignmentCop`.
//!
//! This test enforces the **dualization invariant** the C5 binding
//! relies on: the branch-and-bound search inside the upstream
//! [`csp_solver::AssignmentBuilder`] is solving the same minimum-cost
//! bipartite matching problem that an exhaustive permutation
//! enumeration would solve. If the two ever diverge — say, because
//! of a regression in `CostFiniteDomain`, `AllDifferentExcept`, or
//! the `OptimizationMode::MinimizeCost` pathway — the COP-side cost
//! will drift away from the brute-force minimum and this test will
//! fail loudly.
//!
//! The check is exhaustive over the 4! = 24 permutations of a 4×4
//! cost matrix and runs across ten deterministic random matrices,
//! covering both ties and clean separations.
//!
//! Run via `wasm-pack test --node` from `csp-solver/wasm/`.

#![cfg(target_arch = "wasm32")]

use csp_solver_wasm::{AssignmentRequest, AssignmentResponse, solve_assignment_cop};
use wasm_bindgen_test::*;

// `wasm-bindgen-test` defaults to running on Node when invoked via
// `wasm-pack test --node`. The `wasm_bindgen_test_configure!` macro
// only takes `run_in_browser`, so the absence of an explicit
// configuration line is the way to opt into the Node runner.

/// Every 4! = 24 permutation of `[0, 1, 2, 3]`. Hard-coded so the
/// test has zero runtime dependencies and is trivially auditable.
const PERMS_4: [[usize; 4]; 24] = [
    [0, 1, 2, 3],
    [0, 1, 3, 2],
    [0, 2, 1, 3],
    [0, 2, 3, 1],
    [0, 3, 1, 2],
    [0, 3, 2, 1],
    [1, 0, 2, 3],
    [1, 0, 3, 2],
    [1, 2, 0, 3],
    [1, 2, 3, 0],
    [1, 3, 0, 2],
    [1, 3, 2, 0],
    [2, 0, 1, 3],
    [2, 0, 3, 1],
    [2, 1, 0, 3],
    [2, 1, 3, 0],
    [2, 3, 0, 1],
    [2, 3, 1, 0],
    [3, 0, 1, 2],
    [3, 0, 2, 1],
    [3, 1, 0, 2],
    [3, 1, 2, 0],
    [3, 2, 0, 1],
    [3, 2, 1, 0],
];

/// Linear-congruential RNG for reproducible cost generation. Numbers
/// match Knuth's MMIX constants; the generator is intentionally
/// trivial because we only need a deterministic stream of `f64`s.
fn lcg_next(state: &mut u64) -> f64 {
    *state = state
        .wrapping_mul(6364136223846793005)
        .wrapping_add(1442695040888963407);
    let bits = (*state >> 33) as u32;
    (bits as f64) / (u32::MAX as f64) * 100.0
}

#[wasm_bindgen_test]
fn brute_force_parity_4x4() {
    let mut state: u64 = 0xDEAD_BEEF;

    for trial in 0..10 {
        let cost: Vec<f64> = (0..16).map(|_| lcg_next(&mut state)).collect();

        // Brute-force minimum over every full assignment.
        let bf_min: f64 = PERMS_4
            .iter()
            .map(|p| (0..4).map(|i| cost[i * 4 + p[i]]).sum::<f64>())
            .fold(f64::INFINITY, f64::min);

        let req = AssignmentRequest {
            cost_matrix: cost.clone(),
            rows: 4,
            cols: 4,
            row_roles: vec![],
            col_roles: vec![],
            hint_pairs: vec![],
            // Astronomical penalty so the solver never prefers
            // SENTINEL over a real column — keeps the search space
            // identical to the brute-force enumeration.
            unmatch_penalty: 1.0e9,
            node_budget_ms: None,
        };

        let req_js = serde_wasm_bindgen::to_value(&req)
            .expect("AssignmentRequest serializes");
        let resp_js = solve_assignment_cop(req_js)
            .expect("solveAssignmentCop returns Ok");
        let resp: AssignmentResponse = serde_wasm_bindgen::from_value(resp_js)
            .expect("AssignmentResponse deserializes");

        // Sanity-check the structure of the result before we trust
        // its cost.
        assert_eq!(
            resp.assign.len(),
            4,
            "trial {trial}: assign vector must have length rows ({})",
            4
        );
        let mut seen = [false; 4];
        for &col in &resp.assign {
            assert!(
                (0..4).contains(&(col as i64)),
                "trial {trial}: column {col} out of 0..4 (no SENTINEL expected with huge penalty)"
            );
            assert!(
                !seen[col as usize],
                "trial {trial}: column {col} assigned twice",
            );
            seen[col as usize] = true;
        }

        assert!(
            (resp.cost - bf_min).abs() < 1e-9,
            "trial {trial}: COP cost {} differs from brute-force minimum {} (delta {})",
            resp.cost,
            bf_min,
            (resp.cost - bf_min).abs()
        );
        assert!(
            !resp.budget_exceeded,
            "trial {trial}: budget exceeded on a 4×4 matrix — solver regression?",
        );
    }
}

#[wasm_bindgen_test]
fn pin_forces_assignment() {
    // Diagonal-cheap matrix; the obvious optimum is the identity
    // permutation. Pinning row 0 to column 1 should force the
    // solver away from that, picking the next-best permutation that
    // has `assign[0] == 1`.
    let cost: Vec<f64> = vec![
        0.0, 5.0, 5.0, 5.0, // row 0
        5.0, 0.0, 5.0, 5.0, // row 1
        5.0, 5.0, 0.0, 5.0, // row 2
        5.0, 5.0, 5.0, 0.0, // row 3
    ];

    let req = AssignmentRequest {
        cost_matrix: cost,
        rows: 4,
        cols: 4,
        row_roles: vec![],
        col_roles: vec![],
        hint_pairs: vec![0, 1],
        unmatch_penalty: 1.0e9,
        node_budget_ms: None,
    };

    let req_js = serde_wasm_bindgen::to_value(&req).unwrap();
    let resp_js = solve_assignment_cop(req_js).unwrap();
    let resp: AssignmentResponse = serde_wasm_bindgen::from_value(resp_js).unwrap();

    assert_eq!(
        resp.assign[0], 1,
        "pin (0, 1) must force assign[0] = 1, got {:?}",
        resp.assign
    );
    // Best alternative under the pin: assign[0]=1 (cost 5),
    // remaining rows take the diagonal-cheap entries that are still
    // available. The cheapest packing is `assign = [1, 0, 2, 3]`
    // with cost 5 + 5 + 0 + 0 = 10 (because rows 0 and 1 swap their
    // diagonals, both pay 5).
    assert!(
        (resp.cost - 10.0).abs() < 1e-9,
        "expected cost 10.0 under pin (0, 1), got {}",
        resp.cost
    );
}

#[wasm_bindgen_test]
fn role_groups_partition_assignment() {
    // 4 rows, 4 cols. Rows 0/1 are role 0, rows 2/3 are role 1.
    // Cols 0/1 are role 0, cols 2/3 are role 1. The cheapest move
    // for each role-0 row is into a role-1 col, but the constraint
    // forbids that — so the solver must pick the role-0/role-0
    // sub-assignment.
    let cost: Vec<f64> = vec![
        10.0, 11.0, 1.0, 2.0, // row 0
        12.0, 13.0, 3.0, 4.0, // row 1
        5.0, 6.0, 14.0, 15.0, // row 2
        7.0, 8.0, 16.0, 17.0, // row 3
    ];

    let req = AssignmentRequest {
        cost_matrix: cost,
        rows: 4,
        cols: 4,
        row_roles: vec![0, 0, 1, 1],
        col_roles: vec![0, 0, 1, 1],
        hint_pairs: vec![],
        unmatch_penalty: 1.0e9,
        node_budget_ms: None,
    };

    let req_js = serde_wasm_bindgen::to_value(&req).unwrap();
    let resp_js = solve_assignment_cop(req_js).unwrap();
    let resp: AssignmentResponse = serde_wasm_bindgen::from_value(resp_js).unwrap();

    // Role-0 rows (0, 1) must land in role-0 cols (0, 1); role-1
    // rows (2, 3) must land in role-1 cols (2, 3).
    assert!(
        resp.assign[0] == 0 || resp.assign[0] == 1,
        "row 0 (role 0) escaped role-0 cols: {:?}",
        resp.assign
    );
    assert!(
        resp.assign[1] == 0 || resp.assign[1] == 1,
        "row 1 (role 0) escaped role-0 cols: {:?}",
        resp.assign
    );
    assert!(
        resp.assign[2] == 2 || resp.assign[2] == 3,
        "row 2 (role 1) escaped role-1 cols: {:?}",
        resp.assign
    );
    assert!(
        resp.assign[3] == 2 || resp.assign[3] == 3,
        "row 3 (role 1) escaped role-1 cols: {:?}",
        resp.assign
    );
    assert_ne!(
        resp.assign[0], resp.assign[1],
        "AllDifferentExcept failed within role 0",
    );
    assert_ne!(
        resp.assign[2], resp.assign[3],
        "AllDifferentExcept failed within role 1",
    );

    // Cheapest role-0 packing: assign[0]=0 (10), assign[1]=1 (13)
    // → 23. Cheapest role-1 packing: assign[2]=2 (14), assign[3]=3
    // (17) → 31. The other intra-role packings are strictly worse,
    // so the optimum is 23 + 31 = 54.
    assert!(
        (resp.cost - 54.0).abs() < 1e-9,
        "role-grouped optimum should be 54.0, got {}",
        resp.cost
    );
}
