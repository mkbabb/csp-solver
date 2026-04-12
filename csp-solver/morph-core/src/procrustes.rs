//! 2D Procrustes alignment — optimal rigid (rotation + uniform scale)
//! transform that maps one point set onto another.
//!
//! Ported from `bbnf-buddy/src/geometry/procrustes.ts`. Uses the
//! closed-form 2D SVD reduction: for a 2x2 cross-covariance matrix H,
//! the optimal rotation is `theta = atan2(H01 - H10, H00 + H11)` —
//! NOT a library SVD.
//!
//! References:
//!   - Umeyama, "Least-squares estimation of transformation parameters
//!     between two point patterns," IEEE PAMI 1991.
//!   - Schoenemann, "A generalized solution of the orthogonal Procrustes
//!     problem," Psychometrika 1966.

use crate::types::{ProcrustesResult, Vec2};

/// Compute the optimal rigid + uniform-scale transform taking `source`
/// onto `target`, both indexed correspondences with `source[i]` mapping
/// to `target[i]`. Inputs must be the same length and contain > 1 point.
///
/// Returns identity if the input is degenerate (fewer than 2 points or
/// zero source variance).
///
/// The algorithm:
/// 1. Compute centroids of both point sets.
/// 2. Build the 2x2 cross-covariance matrix H and source variance sigma^2.
/// 3. Extract the optimal rotation angle via `atan2(H01 - H10, H00 + H11)`.
/// 4. Compute scale as `trace(R * H) / sigma^2`.
/// 5. Compute translation as `target_centroid - scale * R * source_centroid`.
///
/// Ported from `procrustes.ts::procrustes2d`.
pub fn procrustes_2d(source: &[Vec2], target: &[Vec2]) -> ProcrustesResult {
    let n = source.len().min(target.len());
    if n < 2 {
        return ProcrustesResult::default();
    }

    // Centroids.
    let mut sx = 0.0_f64;
    let mut sy = 0.0_f64;
    let mut tx = 0.0_f64;
    let mut ty = 0.0_f64;
    for i in 0..n {
        sx += source[i][0];
        sy += source[i][1];
        tx += target[i][0];
        ty += target[i][1];
    }
    let n_f = n as f64;
    sx /= n_f;
    sy /= n_f;
    tx /= n_f;
    ty /= n_f;

    // Cross-covariance H = sum_i S_i^T T_i and source variance sigma^2.
    let mut h00 = 0.0_f64;
    let mut h01 = 0.0_f64;
    let mut h10 = 0.0_f64;
    let mut h11 = 0.0_f64;
    let mut sigma_sq = 0.0_f64;
    for i in 0..n {
        let ax = source[i][0] - sx;
        let ay = source[i][1] - sy;
        let bx = target[i][0] - tx;
        let by = target[i][1] - ty;
        h00 += ax * bx;
        h01 += ax * by;
        h10 += ay * bx;
        h11 += ay * by;
        sigma_sq += ax * ax + ay * ay;
    }

    if sigma_sq < 1e-12 {
        return ProcrustesResult {
            theta: 0.0,
            scale: 1.0,
            translation: [tx - sx, ty - sy],
        };
    }

    // 2D SVD: the rotation is the principal angle of H.
    //   theta = atan2(H01 - H10, H00 + H11)
    let theta = (h01 - h10).atan2(h00 + h11);
    let cos = theta.cos();
    let sin = theta.sin();

    // Scale factor: trace(R * H) / sigma^2.
    let scale = (cos * (h00 + h11) + sin * (h01 - h10)) / sigma_sq;

    // Translation: T_bar - s * R * S_bar.
    let translation: Vec2 = [
        tx - scale * (cos * sx - sin * sy),
        ty - scale * (sin * sx + cos * sy),
    ];

    ProcrustesResult {
        theta,
        scale,
        translation,
    }
}

/// Apply a Procrustes result to a single point.
///
/// Computes: `scale * R * p + translation` where `R` is the rotation
/// matrix for `result.theta`.
///
/// Ported from `procrustes.ts::applyProcrustes`.
pub fn apply_procrustes(r: &ProcrustesResult, p: Vec2) -> Vec2 {
    let cos = r.theta.cos();
    let sin = r.theta.sin();
    [
        r.scale * (cos * p[0] - sin * p[1]) + r.translation[0],
        r.scale * (sin * p[0] + cos * p[1]) + r.translation[1],
    ]
}
