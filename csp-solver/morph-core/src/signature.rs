//! Canonical subpath signatures — deterministic identity tuples that
//! identify a classified subpath within its parent form by topology,
//! not by index.
//!
//! Ported from `bbnf-buddy/src/geometry/signature.ts`.
//!
//! A signature is a four-tuple `(role, area_bucket, centroid_quadrant, winding)`.
//! Each field is deliberately coarse: exact equality would be defeated
//! by floating-point drift, while anything finer discriminates genuinely
//! distinct subpaths. Two loads of the same asset produce bit-identical
//! signatures.
//!
//! The morph pipeline uses signatures for the Tier 1 fast path: when
//! source and target forms have pointwise-equal signatures, the trivial
//! `i <-> i` zip is provably correct and the CSP solver is skipped.

use crate::types::{Role, Signature, Subpath, Vec2};

/// Minimum absolute signed area before `area_bucket` degrades to the
/// clamped floor. Guards `log2(0)` for degenerate zero-area subpaths.
const AREA_EPSILON: f64 = 1e-9;

/// Centroid-coincidence threshold. Below this distance the subpath
/// centroid is treated as identical to the form centroid.
const CENTROID_COINCIDENCE_EPSILON: f64 = 1e-6;

/// Clamp bounds for `area_bucket` (int8-compatible range).
const AREA_BUCKET_MIN: i16 = -128;
const AREA_BUCKET_MAX: i16 = 127;

/// Compute the `|signedArea|`-weighted mean of per-subpath centroids,
/// used as the reference frame for [`canonical_signature`].
///
/// Weighting by absolute area biases the result toward the visually
/// dominant outer silhouette so a thin counter cannot drag the reference
/// point away from the glyph mass.
///
/// Ported from `signature.ts::formCentroid`.
pub fn form_centroid(subpaths: &[Subpath]) -> Vec2 {
    let mut cx = 0.0_f64;
    let mut cy = 0.0_f64;
    let mut total_weight = 0.0_f64;
    for sp in subpaths {
        let w = sp.signed_area.abs();
        if w <= 0.0 {
            continue;
        }
        let c = sp.centroid;
        cx += c[0] * w;
        cy += c[1] * w;
        total_weight += w;
    }
    if total_weight <= AREA_EPSILON {
        return [0.0, 0.0];
    }
    [cx / total_weight, cy / total_weight]
}

/// Compute a canonical signature for a single subpath given its parent
/// form's centroid.
///
/// Pure function of `sub.segments`, `sub.signed_area`, `sub.role`, and
/// `form_centroid` — reload-stable by construction.
///
/// Ported from `signature.ts::canonicalSignature`.
pub fn canonical_signature(sub: &Subpath, form_centroid: Vec2) -> Signature {
    let abs_area = sub.signed_area.abs();
    let raw_bucket = (abs_area + AREA_EPSILON).log2().floor() as i64;
    let area_bucket = clamp_int8(raw_bucket);

    let sub_centroid = sub.centroid;
    let dx = sub_centroid[0] - form_centroid[0];
    let dy = sub_centroid[1] - form_centroid[1];
    let centroid_quadrant = octant_of(dx, dy);

    let winding: i8 = if sub.signed_area >= 0.0 { 1 } else { -1 };

    Signature {
        role: sub.role,
        area_bucket,
        centroid_quadrant,
        winding,
    }
}

/// Lexicographic comparison of two signatures.
///
/// Returns `Ordering` following the tuple order:
///   1. `role` — Outer precedes Counter
///   2. `area_bucket` — ascending
///   3. `centroid_quadrant` — ascending
///   4. `winding` — descending (+1 before -1)
///
/// Ported from `signature.ts::compareSignatures`.
pub fn compare_signatures(a: &Signature, b: &Signature) -> std::cmp::Ordering {
    // Role: Outer < Counter.
    let role_ord = role_rank(a.role).cmp(&role_rank(b.role));
    if role_ord != std::cmp::Ordering::Equal {
        return role_ord;
    }
    // Area bucket: ascending.
    let bucket_ord = a.area_bucket.cmp(&b.area_bucket);
    if bucket_ord != std::cmp::Ordering::Equal {
        return bucket_ord;
    }
    // Centroid quadrant: ascending.
    let quad_ord = a.centroid_quadrant.cmp(&b.centroid_quadrant);
    if quad_ord != std::cmp::Ordering::Equal {
        return quad_ord;
    }
    // Winding: descending (+1 before -1).
    b.winding.cmp(&a.winding)
}

/// Check whether two signatures are equal (all four fields match).
///
/// Equivalent to `compareSignatures(a, b) == 0` but avoids the
/// multi-field ordering chain when only equality is needed.
pub fn signatures_equal(a: &Signature, b: &Signature) -> bool {
    a.role == b.role
        && a.area_bucket == b.area_bucket
        && a.centroid_quadrant == b.centroid_quadrant
        && a.winding == b.winding
}

// -- Internals ---------------------------------------------------------------

fn role_rank(r: Role) -> u8 {
    match r {
        Role::Outer => 0,
        Role::Counter => 1,
    }
}

fn clamp_int8(n: i64) -> i16 {
    if n < AREA_BUCKET_MIN as i64 {
        AREA_BUCKET_MIN
    } else if n > AREA_BUCKET_MAX as i64 {
        AREA_BUCKET_MAX
    } else {
        n as i16
    }
}

fn octant_of(dx: f64, dy: f64) -> u8 {
    let dist = (dx * dx + dy * dy).sqrt();
    if dist < CENTROID_COINCIDENCE_EPSILON {
        return 0;
    }
    let mut angle = dy.atan2(dx);
    if angle < 0.0 {
        angle += 2.0 * std::f64::consts::PI;
    }
    let oct = (angle / (std::f64::consts::PI / 4.0)).floor() as u8;
    // atan2 can return exactly 2*pi at the -0 boundary; clamp to 7.
    oct.min(7)
}
