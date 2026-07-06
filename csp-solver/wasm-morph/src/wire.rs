//! Serde wire types + JS-facing `alignForms` entry point.
//!
//! Defines camelCase wire types that mirror morph-core's domain types
//! for clean JS ergonomics, converts between them, and exposes a single
//! `#[wasm_bindgen]` export that accepts a `JsValue` request and returns
//! a `JsValue` response via serde-wasm-bindgen.
//!
//! Thread-local scratch arena persists across calls, avoiding
//! re-allocation on the hot path.

use morph_core::contour::{bbox, centroid};
use morph_core::scratch::AlignScratch;
use morph_core::signature::{canonical_signature, form_centroid};
use morph_core::types::{
    CorrespondenceHints, FormDef, PairwiseAlignment, PointHintPair, Role, Segment, Subpath,
    SubpathHintPair,
};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use wasm_bindgen::prelude::*;

// ---------------------------------------------------------------------------
// Thread-local scratch arena
// ---------------------------------------------------------------------------

thread_local! {
    static SCRATCH: RefCell<AlignScratch> = RefCell::new(AlignScratch::new());
}

// ---------------------------------------------------------------------------
// Request wire types
// ---------------------------------------------------------------------------

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlignRequest {
    pub source: WireFormDef,
    pub target: WireFormDef,
    #[serde(default)]
    pub hints: Option<WireHints>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WireFormDef {
    pub id: String,
    pub subpaths: Vec<WireSubpath>,
    #[serde(default = "default_view_box")]
    pub view_box: [f64; 4],
}

fn default_view_box() -> [f64; 4] {
    [0.0, 0.0, 100.0, 100.0]
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WireSubpath {
    /// Subpath identity string (e.g. "outer-0", "counter-1").
    #[serde(default)]
    pub id: Option<String>,
    /// `"outer"` or `"counter"`.
    pub role: String,
    pub segments: Vec<WireSegment>,
    pub signed_area: f64,
}

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WireSegment {
    pub id: u32,
    pub point: [f64; 2],
    pub handle_in: [f64; 2],
    pub handle_out: [f64; 2],
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WireHints {
    #[serde(default)]
    pub subpath_pairs: Vec<WireSubpathPair>,
    /// Manual anchor-correspondence hints, forwarded to morph-core's
    /// Step 8 weighted-rotation pass. Previously dropped at this boundary
    /// (the editor's "mark corresponding anchors" affordance was a dead
    /// feature); now threaded through.
    #[serde(default)]
    pub point_pairs: Vec<WirePointPair>,
    #[serde(default)]
    pub procrustes: bool,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WireSubpathPair {
    pub source: usize,
    pub target: usize,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WirePointPair {
    pub source_subpath: usize,
    pub target_subpath: usize,
    pub source_index: usize,
    pub target_index: usize,
}

// ---------------------------------------------------------------------------
// Response wire types
// ---------------------------------------------------------------------------

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WireAlignment {
    pub source_form_id: String,
    pub target_form_id: String,
    pub pairs: Vec<WirePair>,
    pub unmatched_source: Vec<usize>,
    pub unmatched_target: Vec<usize>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WirePair {
    pub source_index: usize,
    pub target_index: usize,
    pub source_segments: Vec<WireSegment>,
    pub target_segments: Vec<WireSegment>,
}

// ---------------------------------------------------------------------------
// Wire -> domain conversion
// ---------------------------------------------------------------------------

fn parse_role(s: &str) -> Result<Role, JsError> {
    match s {
        "outer" => Ok(Role::Outer),
        "counter" => Ok(Role::Counter),
        other => Err(JsError::new(&format!(
            "invalid role \"{other}\": expected \"outer\" or \"counter\""
        ))),
    }
}

fn wire_segment_to_domain(ws: &WireSegment) -> Segment {
    Segment {
        id: ws.id,
        point: ws.point,
        handle_in: ws.handle_in,
        handle_out: ws.handle_out,
    }
}

fn convert_form_def(wire: &WireFormDef) -> Result<FormDef, JsError> {
    let mut subpaths = Vec::with_capacity(wire.subpaths.len());
    for (i, ws) in wire.subpaths.iter().enumerate() {
        let role = parse_role(&ws.role)?;
        let segments: Vec<Segment> = ws.segments.iter().map(wire_segment_to_domain).collect();
        let bb = bbox(&segments);
        // Stamp the contour centroid once — the alignment cost matrix and
        // per-pair pipeline read this precomputed field, not a re-densify.
        let ctr = centroid(&segments);
        let id = ws.id.clone().unwrap_or_else(|| format!("{}-{i}", ws.role));
        subpaths.push(Subpath {
            id,
            segments,
            signed_area: ws.signed_area,
            bbox: bb,
            centroid: ctr,
            role,
            // Signature is computed below once all subpaths are built.
            signature: morph_core::types::Signature {
                role,
                area_bucket: 0,
                centroid_quadrant: 0,
                winding: if ws.signed_area >= 0.0 { 1 } else { -1 },
            },
        });
    }

    // Compute canonical signatures using form centroid.
    let fc = form_centroid(&subpaths);
    for sp in &mut subpaths {
        sp.signature = canonical_signature(sp, fc);
    }

    Ok(FormDef {
        id: wire.id.clone(),
        subpaths,
        view_box: wire.view_box,
    })
}

fn convert_hints(wire: &WireHints) -> CorrespondenceHints {
    CorrespondenceHints {
        subpath_pairs: wire
            .subpath_pairs
            .iter()
            .map(|p| SubpathHintPair {
                source: p.source,
                target: p.target,
            })
            .collect(),
        point_pairs: wire
            .point_pairs
            .iter()
            .map(|p| PointHintPair {
                source_subpath: p.source_subpath,
                target_subpath: p.target_subpath,
                source_index: p.source_index,
                target_index: p.target_index,
            })
            .collect(),
        procrustes: wire.procrustes,
    }
}

// ---------------------------------------------------------------------------
// Domain -> wire conversion
// ---------------------------------------------------------------------------

fn segment_to_wire(s: &Segment) -> WireSegment {
    WireSegment {
        id: s.id,
        point: s.point,
        handle_in: s.handle_in,
        handle_out: s.handle_out,
    }
}

fn convert_alignment(pa: &PairwiseAlignment) -> WireAlignment {
    WireAlignment {
        source_form_id: pa.source_form_id.clone(),
        target_form_id: pa.target_form_id.clone(),
        pairs: pa
            .pairs
            .iter()
            .map(|p| WirePair {
                source_index: p.source_index,
                target_index: p.target_index,
                source_segments: p.source_segments.iter().map(segment_to_wire).collect(),
                target_segments: p.target_segments.iter().map(segment_to_wire).collect(),
            })
            .collect(),
        unmatched_source: pa.unmatched_source.clone(),
        unmatched_target: pa.unmatched_target.clone(),
    }
}

// ---------------------------------------------------------------------------
// JS entry point
// ---------------------------------------------------------------------------

/// Align two SVG forms via the morph-core pipeline.
///
/// Accepts a JS object matching `AlignRequest` (camelCase fields):
///
/// ```js
/// alignForms({
///   source: { id: "b", subpaths: [...], viewBox: [0,0,100,100] },
///   target: { id: "d", subpaths: [...], viewBox: [0,0,100,100] },
///   hints:  { subpathPairs: [{ source: 0, target: 1 }] },  // optional
/// })
/// ```
///
/// Returns a JS object matching `WireAlignment`:
///
/// ```js
/// { sourceFormId, targetFormId, pairs, unmatchedSource, unmatchedTarget }
/// ```
#[wasm_bindgen(js_name = alignForms)]
pub fn align_forms(request: JsValue) -> Result<JsValue, JsError> {
    let req: AlignRequest = serde_wasm_bindgen::from_value(request)
        .map_err(|e| JsError::new(&format!("invalid AlignRequest: {e}")))?;

    let source = convert_form_def(&req.source)?;
    let target = convert_form_def(&req.target)?;
    let hints = req.hints.as_ref().map(convert_hints);

    let result = SCRATCH.with(|cell| {
        let mut scratch = cell.borrow_mut();
        morph_core::align_forms(&source, &target, hints.as_ref(), &mut scratch)
    });

    let wire_result = convert_alignment(&result);
    serde_wasm_bindgen::to_value(&wire_result)
        .map_err(|e| JsError::new(&format!("serialize response: {e}")))
}
