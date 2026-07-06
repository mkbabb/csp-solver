//! Core geometric types for the morph pipeline.
//!
//! Ported from `bbnf-buddy/src/geometry/types.ts` and
//! `bbnf-buddy/src/forms/types.ts`. These are the atoms every subsystem
//! builds on: a [`Segment`] is a bezier anchor; a [`Subpath`] is a
//! classified closed run of segments; a [`FormDef`] is the top-level
//! form the morph pipeline aligns.

use serde::{Deserialize, Serialize};

/// 2D point or vector. Matches TypeScript's `Vec2 = [number, number]`.
pub type Vec2 = [f64; 2];

/// SVG viewBox: `[min_x, min_y, width, height]`.
pub type ViewBox = [f64; 4];

/// Winding role of a classified subpath within a compound glyph.
///
/// - `Outer`: positive-winding silhouette contributing to fill.
/// - `Counter`: negative-winding hole cut from outer via evenodd.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum Role {
    Outer,
    Counter,
}

impl Role {
    /// Numeric tag for the CSP solver's role-group encoding.
    /// `0` = outer, `1` = counter — matches the TS `rowRoles`/`colRoles`
    /// convention in `align.ts`.
    pub fn tag(self) -> u8 {
        match self {
            Role::Outer => 0,
            Role::Counter => 1,
        }
    }
}

/// A single cubic bezier anchor with local handle offsets.
///
/// Ported from `bbnf-buddy/src/geometry/types.ts::Segment`.
///
/// The TS `SegmentId` is a branded string (`"outer-0"`, `"seg-42"`, etc.)
/// used for stable identity across inserts/deletes. In the Rust morph
/// pipeline we use a monotonic `u32` counter since the alignment logic
/// only needs uniqueness, not the string semantics. Callers bridging
/// back to the TS side can maintain a `u32 -> String` map externally.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Segment {
    /// Stable identity — unique within a form.
    pub id: u32,
    /// Anchor point in form-space coordinates.
    pub point: Vec2,
    /// Offset from `point` to the incoming control point.
    pub handle_in: Vec2,
    /// Offset from `point` to the outgoing control point.
    pub handle_out: Vec2,
}

/// Axis-aligned bounding box.
///
/// Ported from `bbnf-buddy/src/geometry/types.ts::BBox`.
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct BBox {
    pub min_x: f64,
    pub min_y: f64,
    pub max_x: f64,
    pub max_y: f64,
}

/// Canonical identity tuple for a classified subpath.
///
/// Ported from `bbnf-buddy/src/geometry/signature.ts::SubpathSignature`.
/// Two subpaths whose signatures compare equal are treated by the morph
/// pipeline as i-to-i correspondable without running the CSP assignment.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct Signature {
    pub role: Role,
    /// `floor(log2(|signedArea| + AREA_EPSILON))` clamped to `[-128, 127]`.
    pub area_bucket: i16,
    /// Octant (0..7) of the vector from the form centroid to the subpath centroid.
    pub centroid_quadrant: u8,
    /// `+1` for clockwise (SVG Y-down outer), `-1` for counter-clockwise.
    pub winding: i8,
}

/// A classified closed subpath — a segment loop annotated with its
/// signed area, bounding box, role, and canonical signature.
///
/// Ported from `bbnf-buddy/src/geometry/types.ts::ClassifiedSubpath`.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Subpath {
    /// Stable subpath id (e.g. `"outer"`, `"counter1"`). Kept as a
    /// string to match the TS `ClassifiedSubpath.id` field.
    pub id: String,
    /// Closed segment loop.
    pub segments: Vec<Segment>,
    /// Positive = CW in SVG Y-down; negative = CCW.
    pub signed_area: f64,
    /// Axis-aligned bounding box over anchor points.
    pub bbox: BBox,
    /// Signed-area-weighted centroid of the densified contour, precomputed
    /// once at construction (symmetric with `bbox`/`signed_area`). The
    /// alignment cost matrix and the per-pair pipeline read this instead
    /// of re-densifying the contour on every `pair_cost`/`align_pair`
    /// call — it collapses the former ~4n² densify passes to O(n).
    pub centroid: Vec2,
    /// Outer silhouette vs counter hole.
    pub role: Role,
    /// Canonical identity signature.
    pub signature: Signature,
}

/// A form the morph pipeline can align and morph between.
///
/// Ported from `bbnf-buddy/src/forms/types.ts::FormDef`. Stripped to
/// the fields the alignment pipeline actually reads — bones, bone
/// regions, and source SVG are omitted since they are irrelevant to
/// the geometric alignment.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FormDef {
    /// Stable id — free-string, used as registry key.
    pub id: String,
    /// Every classified subpath, in canonical sort order.
    pub subpaths: Vec<Subpath>,
    /// viewBox the subpath coordinates live in.
    pub view_box: ViewBox,
}

/// A single matched subpath pair in the alignment output.
///
/// Ported from `bbnf-buddy/src/forms/align.ts::SubpathPair`.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SubpathPair {
    /// Index into `source.subpaths`.
    pub source_index: usize,
    /// Index into `target.subpaths`.
    pub target_index: usize,
    /// Resampled source subpath with common anchor count.
    pub source_segments: Vec<Segment>,
    /// Resampled + aligned target subpath with the same anchor count.
    pub target_segments: Vec<Segment>,
}

/// The full pairwise alignment result.
///
/// Ported from `bbnf-buddy/src/forms/align.ts::PairwiseAlignment`.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PairwiseAlignment {
    pub source_form_id: String,
    pub target_form_id: String,
    pub pairs: Vec<SubpathPair>,
    /// Subpath indices of source that had no target match — collapse on morph.
    pub unmatched_source: Vec<usize>,
    /// Subpath indices of target that had no source match — grow on morph.
    pub unmatched_target: Vec<usize>,
}

/// Result of a 2D Procrustes alignment.
///
/// Ported from `bbnf-buddy/src/geometry/procrustes.ts::ProcrustesResult`.
#[derive(Debug, Clone, Copy)]
pub struct ProcrustesResult {
    /// Rotation angle in radians.
    pub theta: f64,
    /// Uniform scale factor.
    pub scale: f64,
    /// Translation applied to the (scaled, rotated) source.
    pub translation: Vec2,
}

impl Default for ProcrustesResult {
    fn default() -> Self {
        Self {
            theta: 0.0,
            scale: 1.0,
            translation: [0.0, 0.0],
        }
    }
}

/// Manual correspondence hints for the alignment pipeline.
///
/// Ported from `bbnf-buddy/src/forms/align.ts::CorrespondenceHints`.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct CorrespondenceHints {
    /// Force-match specific subpaths by index into
    /// `source.subpaths` / `target.subpaths`.
    pub subpath_pairs: Vec<SubpathHintPair>,
    /// Force-match specific anchor indices within a matched subpath pair.
    pub point_pairs: Vec<PointHintPair>,
    /// Opt-in Procrustes fine-alignment. Default off.
    pub procrustes: bool,
}

/// A single subpath correspondence hint.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SubpathHintPair {
    pub source: usize,
    pub target: usize,
}

/// A single point correspondence hint within a matched subpath pair.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PointHintPair {
    pub source_subpath: usize,
    pub target_subpath: usize,
    pub source_index: usize,
    pub target_index: usize,
}

/// A dense polyline sample with arc-length annotation.
///
/// Ported from `bbnf-buddy/src/geometry/bezier.ts::PolylineSample`.
#[derive(Debug, Clone, Copy)]
pub struct PolylineSample {
    pub point: Vec2,
    pub tangent: Vec2,
    /// Cumulative arc length from the first sample.
    pub cumulative: f64,
}
