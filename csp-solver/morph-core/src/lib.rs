//! `morph-core` — native Rust alignment pipeline for the bbnf-buddy
//! morph system.
//!
//! This crate ports the TypeScript geometry primitives and alignment
//! orchestration from `bbnf-buddy/src/geometry/` and
//! `bbnf-buddy/src/forms/align.ts` into pure Rust, calling
//! [`csp_solver::AssignmentBuilder`] directly as a native rlib
//! dependency (zero FFI overhead) for the Tier 2 CSP path.
//!
//! # Architecture
//!
//! The alignment pipeline runs 9 steps:
//!
//! 1. Shape normalization (done at load time)
//! 2. Subpath role classification (done at load time)
//! 3. Subpath assignment (Tier 1 signature fast path + Tier 2 CSP)
//! 4. Centroid + scale normalization
//! 5. Arc-length resampling to common anchor count
//! 6. Rotational start-index alignment
//! 7. Procrustes fine-alignment (opt-in)
//! 8. Manual correspondence hints (soft constraint)
//! 9. Emit `PairwiseAlignment`
//!
//! Steps 3-9 are implemented in this crate. Steps 1-2 are the caller's
//! responsibility (SVG parsing, winding classification, signature
//! stamping).

pub mod align;
pub mod bezier;
pub mod contour;
pub mod procrustes;
pub mod resample;
pub mod scratch;
pub mod signature;
pub mod types;

pub use align::align_forms;
pub use types::{
    AlignInternalResult, BBox, CorrespondenceHints, FormDef, PairwiseAlignment, PointHintPair,
    PolylineSample, ProcrustesResult, Role, Segment, Signature, Subpath, SubpathHintPair,
    SubpathPair, Vec2, ViewBox,
};
