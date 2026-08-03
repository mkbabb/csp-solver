//! Hand-rolled O(n³) Kuhn-Munkres linear-assignment solver.
//!
//! Tests: `tests/kuhn_munkres.rs` (textbook instance, both rectangular branches,
//! degenerate shapes, brute-force agreement) — it reaches this private module by
//! `#[path]`, so no surface widens for them.
//!
//! A single drop-in [`minimize`] over the flat `Vec<i64>` cost matrix that
//! [`super::assignment::AssignmentBuilder`] already materializes for its
//! group-free / pin-free LAP dispatch (`assignment.rs`). It replaces the
//! `hungarian` crate — whose one function dragged a nine-crate 2020-era numeric
//! subtree (`ndarray`, `num-complex`, `matrixmultiply`, …) for an integer LAP —
//! with ~90 lines of safe Rust and zero transitive dependencies.
//!
//! The implementation is the classic potential / shortest-augmenting-path form
//! (Jonker-style, O(rows² · cols)). The `AssignmentBuilder` B&B fallback is only
//! proven-optimal to n≈15–18, so real instances are small and no
//! Jonker-Volgenant speedup is warranted.
//!
//! The internal core [`solve_rows_le_cols`] requires `rows ≤ cols`; [`minimize`]
//! guarantees that by transposing when `rows > cols` and inverting the result,
//! so the public contract matches `hungarian::minimize` for any rectangular
//! shape (unmatched rows come back as `None`).

/// Minimum-cost assignment over a row-major `rows × cols` integer cost matrix.
///
/// Returns a `Vec<Option<usize>>` of length `rows`: entry `i` is `Some(col)` for
/// the column matched to row `i`, or `None` if the row is left unmatched (only
/// possible when `rows > cols`). A drop-in for `hungarian::minimize(&matrix,
/// rows, cols)`.
///
/// `cost.len()` must be `rows * cols`.
pub(crate) fn minimize(cost: &[i64], rows: usize, cols: usize) -> Vec<Option<usize>> {
    debug_assert_eq!(cost.len(), rows * cols, "cost matrix must be rows * cols");
    if rows == 0 || cols == 0 {
        return vec![None; rows];
    }

    if rows <= cols {
        return solve_rows_le_cols(cost, rows, cols);
    }

    // rows > cols: solve the transpose (cols rows × rows cols, so rows' ≤ cols')
    // and invert the col→row matching back into a row→col vector.
    let mut transposed = vec![0i64; rows * cols];
    for i in 0..rows {
        for j in 0..cols {
            transposed[j * rows + i] = cost[i * cols + j];
        }
    }
    let col_to_row = solve_rows_le_cols(&transposed, cols, rows);

    let mut result = vec![None; rows];
    for (col, matched_row) in col_to_row.iter().enumerate() {
        if let Some(row) = *matched_row {
            result[row] = Some(col);
        }
    }
    result
}

/// Core solve for the `rows ≤ cols` case. Every row is matched to a distinct
/// column at minimum total cost (a perfect matching on the row side always
/// exists because `cols ≥ rows`), so the returned vector is all-`Some`.
fn solve_rows_le_cols(cost: &[i64], rows: usize, cols: usize) -> Vec<Option<usize>> {
    const INF: i64 = i64::MAX;

    // 1-indexed potentials / matching state (index 0 is a scratch sentinel, the
    // convention of the classic augmenting-path formulation).
    let mut u = vec![0i64; rows + 1]; // row potentials
    let mut v = vec![0i64; cols + 1]; // column potentials
    let mut col_match = vec![0usize; cols + 1]; // col j → matched row (0 = free)
    let mut way = vec![0usize; cols + 1]; // augmenting-path back-pointers

    for cur_row in 1..=rows {
        col_match[0] = cur_row;
        let mut j0 = 0usize; // current column on the alternating path
        let mut min_slack = vec![INF; cols + 1];
        let mut used = vec![false; cols + 1];

        // Grow the shortest alternating path until it reaches a free column.
        loop {
            used[j0] = true;
            let i0 = col_match[j0];
            let mut delta = INF;
            let mut j1 = 0usize;

            for j in 1..=cols {
                if !used[j] {
                    let reduced = cost[(i0 - 1) * cols + (j - 1)] - u[i0] - v[j];
                    if reduced < min_slack[j] {
                        min_slack[j] = reduced;
                        way[j] = j0;
                    }
                    if min_slack[j] < delta {
                        delta = min_slack[j];
                        j1 = j;
                    }
                }
            }

            // Re-weight: tighten potentials along the used set, relax the slack
            // of the rest. Every unused column already has a finite `min_slack`
            // from the scan above, so no INF is ever touched by arithmetic.
            for j in 0..=cols {
                if used[j] {
                    u[col_match[j]] += delta;
                    v[j] -= delta;
                } else {
                    min_slack[j] -= delta;
                }
            }

            j0 = j1;
            if col_match[j0] == 0 {
                break;
            }
        }

        // Flip the alternating path, matching `cur_row` and shifting the rest.
        loop {
            let j1 = way[j0];
            col_match[j0] = col_match[j1];
            j0 = j1;
            if j0 == 0 {
                break;
            }
        }
    }

    let mut result = vec![None; rows];
    for j in 1..=cols {
        if col_match[j] != 0 {
            result[col_match[j] - 1] = Some(j - 1);
        }
    }
    result
}
