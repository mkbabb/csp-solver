//! `#[wasm_bindgen_test]` coverage for the morph wasm bindings.
//!
//! Run with: `wasm-pack test --node csp-solver/wasm-morph`
//!
//! wasm-only: the whole file is gated on `target_arch = "wasm32"` so a
//! native `cargo test --workspace` compiles it to an empty test binary
//! (these tests exercise the JS boundary and only mean anything under
//! wasm-bindgen-test); wasm-pack builds for wasm32, so the gate is a no-op
//! there and both tests are collected.
//!
//! Two tests, both driving the real `alignForms()` JS boundary end to end
//! (serde-wasm-bindgen request in, response out):
//!
//! - [`align_forms_round_trip_smoke`] — a Tier-1 alignment survives the
//!   JsValue round-trip with its form ids, pair, and anchor counts intact.
//! - [`point_pairs_forwarding_regression`] — a `pointPairs` hint reaches
//!   morph-core's Step 8 and measurably changes the alignment. Guards the
//!   Pass-1 W4 "silently-dropped-hints" regression: if `convert_hints` ever
//!   drops `point_pairs` again, or the camelCase wire field names drift out
//!   of sync with bbnf-buddy's `CorrespondenceHints.pointPairs`, the hint is
//!   ignored and this differential collapses to zero — failing the test.
#![cfg(target_arch = "wasm32")]

use serde::{Deserialize, Serialize};
use wasm_bindgen::JsValue;
use wasm_bindgen_test::*;

// --- request wire mirror (Serialize; camelCase must match `wire::Wire*`) ---

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct WSeg {
    id: u32,
    point: [f64; 2],
    handle_in: [f64; 2],
    handle_out: [f64; 2],
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct WSub {
    id: String,
    role: String,
    segments: Vec<WSeg>,
    signed_area: f64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct WForm {
    id: String,
    subpaths: Vec<WSub>,
    view_box: [f64; 4],
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct WPointPair {
    source_subpath: usize,
    target_subpath: usize,
    source_index: usize,
    target_index: usize,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct WHints {
    point_pairs: Vec<WPointPair>,
    procrustes: bool,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct WReq {
    source: WForm,
    target: WForm,
    #[serde(skip_serializing_if = "Option::is_none")]
    hints: Option<WHints>,
}

// --- response wire mirror (Deserialize) ---

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct RSeg {
    #[allow(dead_code)]
    id: u32,
    point: [f64; 2],
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct RPair {
    source_index: usize,
    target_index: usize,
    #[allow(dead_code)]
    source_segments: Vec<RSeg>,
    target_segments: Vec<RSeg>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct RAlign {
    source_form_id: String,
    target_form_id: String,
    pairs: Vec<RPair>,
    unmatched_source: Vec<usize>,
    unmatched_target: Vec<usize>,
}

// --- helpers ---

fn seg(id: u32, x: f64, y: f64) -> WSeg {
    WSeg {
        id,
        point: [x, y],
        handle_in: [0.0, 0.0],
        handle_out: [0.0, 0.0],
    }
}

fn outer(id: &str, points: &[[f64; 2]], signed_area: f64) -> WSub {
    WSub {
        id: id.to_string(),
        role: "outer".to_string(),
        segments: points
            .iter()
            .enumerate()
            .map(|(i, p)| seg(i as u32, p[0], p[1]))
            .collect(),
        signed_area,
    }
}

fn form(id: &str, sub: WSub) -> WForm {
    WForm {
        id: id.to_string(),
        subpaths: vec![sub],
        view_box: [0.0, 0.0, 100.0, 100.0],
    }
}

/// Invoke the real `alignForms` export across the JsValue boundary.
fn align(req: &WReq) -> RAlign {
    let input: JsValue = serde_wasm_bindgen::to_value(req).expect("serialize request");
    let output = match morph::align_forms(input) {
        Ok(v) => v,
        Err(_) => panic!("alignForms returned an error for a valid request"),
    };
    serde_wasm_bindgen::from_value(output).expect("deserialize response")
}

// A regular hexagon (radius 40, centre (50,50)) and the SAME hexagon rotated
// by exactly half an anchor step (30°). The half-step makes two integer
// rotation offsets structurally tied, so a single weighted anchor (Step 8)
// decisively flips the alignment — a large, deterministic differential.
const C: f64 = 34.641016151377544; // 40 * sqrt(3) / 2
const HEX_AREA: f64 = 4156.921938165307; // shared by both -> area_ratio == 1

fn hex_source() -> WForm {
    form(
        "hex-src",
        outer(
            "outer",
            &[
                [90.0, 50.0],
                [70.0, 50.0 + C],
                [30.0, 50.0 + C],
                [10.0, 50.0],
                [30.0, 50.0 - C],
                [70.0, 50.0 - C],
            ],
            HEX_AREA,
        ),
    )
}

fn hex_target() -> WForm {
    form(
        "hex-tgt",
        outer(
            "outer",
            &[
                [50.0 + C, 70.0],
                [50.0, 90.0],
                [50.0 - C, 70.0],
                [50.0 - C, 30.0],
                [50.0, 10.0],
                [50.0 + C, 30.0],
            ],
            HEX_AREA,
        ),
    )
}

// --- tests ---

#[wasm_bindgen_test]
fn align_forms_round_trip_smoke() {
    // Two single-outer square forms with equal anchor counts -> Tier 1,
    // trivial i<->i zip, no resample.
    let square = |id: &str, ox: f64| {
        form(
            id,
            outer(
                "outer",
                &[[ox, 0.0], [ox + 20.0, 0.0], [ox + 20.0, 20.0], [ox, 20.0]],
                400.0,
            ),
        )
    };
    let req = WReq {
        source: square("src", 0.0),
        target: square("tgt", 1.0),
        hints: None,
    };

    let out = align(&req);

    assert_eq!(out.source_form_id, "src");
    assert_eq!(out.target_form_id, "tgt");
    assert_eq!(out.pairs.len(), 1, "one subpath each -> one pair");
    assert_eq!(out.pairs[0].source_index, 0);
    assert_eq!(out.pairs[0].target_index, 0);
    assert_eq!(
        out.pairs[0].target_segments.len(),
        4,
        "equal anchor count is preserved through the pipeline"
    );
    assert!(out.unmatched_source.is_empty());
    assert!(out.unmatched_target.is_empty());
}

#[wasm_bindgen_test]
fn point_pairs_forwarding_regression() {
    // Baseline: no hints.
    let base = align(&WReq {
        source: hex_source(),
        target: hex_target(),
        hints: None,
    });
    // With a pointPairs hint biasing source anchor 1 of the (0,0) pair.
    let hinted = align(&WReq {
        source: hex_source(),
        target: hex_target(),
        hints: Some(WHints {
            point_pairs: vec![WPointPair {
                source_subpath: 0,
                target_subpath: 0,
                source_index: 1,
                target_index: 0,
            }],
            procrustes: false,
        }),
    });

    assert_eq!(base.pairs.len(), 1);
    assert_eq!(hinted.pairs.len(), 1);

    let b = &base.pairs[0].target_segments;
    let h = &hinted.pairs[0].target_segments;
    assert_eq!(b.len(), h.len());

    // If the hint were silently dropped, the two alignments would be byte
    // identical. The half-step hexagon makes the weighted rotation shift the
    // target contour by a full anchor step (~40 units) -> a large, non-flaky
    // differential.
    let max_delta = b
        .iter()
        .zip(h.iter())
        .map(|(bs, hs)| {
            ((bs.point[0] - hs.point[0]).powi(2) + (bs.point[1] - hs.point[1]).powi(2)).sqrt()
        })
        .fold(0.0_f64, f64::max);

    assert!(
        max_delta > 1.0,
        "pointPairs hint must reach morph-core Step 8 and move the alignment; \
         observed max anchor delta = {max_delta} (0 => hint was dropped)"
    );
}
