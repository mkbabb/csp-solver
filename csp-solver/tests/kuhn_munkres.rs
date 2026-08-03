//! Kuhn-Munkres LAP tests — extracted from `src/builder/kuhn_munkres.rs` at T7-W6 (T7-R01).
//!
//! They were an inline `#[cfg(test)] mod tests`, the only one in the workspace, born 19 h 18 m
//! after `ed07ba6b` certified the estate at zero. The assertions are unchanged — five tests,
//! same names, same numbers; only their address moved, one directory over, the U-09 precedent
//! (`cage.rs`). `scripts/check-inline-tests.mjs` now holds the line the edict only declared.
//!
//! WHY `#[path]` AND NOT A WIDER API: `builder::kuhn_munkres` is a private module and
//! `minimize` is `pub(crate)`, so an integration test cannot reach it through the crate root.
//! The alternative — publishing a module for the sake of its tests — widens a released crate's
//! surface to buy a file move, which is the contrivance this wave exists to root out. The module
//! has zero `use` statements and zero crate-internal callers of its own, so it compiles
//! standalone here from the SAME source file: one implementation, one address, no copy.

#[path = "../src/builder/kuhn_munkres.rs"]
mod kuhn_munkres;

use kuhn_munkres::minimize;

/// Brute-force minimum-cost assignment (rows ≤ cols) for cross-checking:
/// every row picks a distinct column, minimize the total.
fn brute_force(cost: &[i64], rows: usize, cols: usize) -> i64 {
    let mut used = vec![false; cols];
    fn rec(
        cost: &[i64],
        rows: usize,
        cols: usize,
        row: usize,
        used: &mut [bool],
        acc: i64,
        best: &mut i64,
    ) {
        if row == rows {
            *best = (*best).min(acc);
            return;
        }
        for j in 0..cols {
            if !used[j] {
                used[j] = true;
                rec(
                    cost,
                    rows,
                    cols,
                    row + 1,
                    used,
                    acc + cost[row * cols + j],
                    best,
                );
                used[j] = false;
            }
        }
    }
    let mut best = i64::MAX;
    rec(cost, rows, cols, 0, &mut used, 0, &mut best);
    best
}

fn assignment_cost(cost: &[i64], cols: usize, assign: &[Option<usize>]) -> i64 {
    assign
        .iter()
        .enumerate()
        .filter_map(|(i, a)| a.map(|j| cost[i * cols + j]))
        .sum()
}

#[test]
fn known_3x3() {
    // Classic textbook instance; the optimal picks the diagonal-ish minimum.
    let cost = [4, 1, 3, 2, 0, 5, 3, 2, 2];
    let assign = minimize(&cost, 3, 3);
    // All rows matched to distinct columns.
    let cols: std::collections::HashSet<_> = assign.iter().flatten().collect();
    assert_eq!(cols.len(), 3, "must be a perfect matching");
    assert_eq!(assignment_cost(&cost, 3, &assign), brute_force(&cost, 3, 3));
}

#[test]
fn rectangular_more_cols() {
    // rows < cols: every row matched, one column left free.
    let cost = [7, 2, 9, 5, 1, 8]; // 2 rows × 3 cols
    let assign = minimize(&cost, 2, 3);
    assert!(assign.iter().all(|a| a.is_some()));
    let seen: std::collections::HashSet<_> = assign.iter().flatten().collect();
    assert_eq!(seen.len(), 2);
    assert_eq!(assignment_cost(&cost, 3, &assign), brute_force(&cost, 2, 3));
}

#[test]
fn rectangular_more_rows() {
    // rows > cols: transpose branch. Only `cols` rows can be matched.
    let cost = [7, 2, 8, 3, 1, 6];
    let assign = minimize(&cost, 3, 2); // 3 rows, 2 cols
    let matched = assign.iter().filter(|a| a.is_some()).count();
    assert_eq!(matched, 2, "at most cols rows can match");
    let seen: std::collections::HashSet<_> = assign.iter().flatten().collect();
    assert_eq!(seen.len(), 2, "distinct columns");
}

#[test]
fn degenerate_shapes() {
    assert_eq!(minimize(&[], 0, 0), Vec::<Option<usize>>::new());
    assert_eq!(minimize(&[], 3, 0), vec![None, None, None]);
    assert_eq!(minimize(&[5], 1, 1), vec![Some(0)]);
}

#[test]
fn brute_force_agreement_small() {
    // Deterministic LCG over a spread of small shapes; hand impl == brute.
    let mut state: u64 = 0x1234_5678_9abc_def0;
    let mut next = || {
        state = state
            .wrapping_mul(6364136223846793005)
            .wrapping_add(1442695040888963407);
        ((state >> 40) % 50) as i64
    };
    for &(r, c) in &[
        (1usize, 1usize),
        (2, 2),
        (3, 3),
        (4, 4),
        (2, 4),
        (4, 2),
        (3, 5),
    ] {
        let cost: Vec<i64> = (0..r * c).map(|_| next()).collect();
        let assign = minimize(&cost, r, c);
        let rc = r.min(c);
        let seen: std::collections::HashSet<_> = assign.iter().flatten().collect();
        assert_eq!(seen.len(), rc, "distinct columns for {r}x{c}");
        let got = assignment_cost(&cost, c, &assign);
        let want = if r <= c {
            brute_force(&cost, r, c)
        } else {
            // transpose for the oracle too
            let mut t = vec![0i64; r * c];
            for i in 0..r {
                for j in 0..c {
                    t[j * r + i] = cost[i * c + j];
                }
            }
            brute_force(&t, c, r)
        };
        assert_eq!(got, want, "cost mismatch for {r}x{c}");
    }
}
