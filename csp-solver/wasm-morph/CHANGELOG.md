# Changelog — @mkbabb/morph (wasm-morph)

WebAssembly bindings for `morph-core`, published to npm as `@mkbabb/morph`. The
npm identity derives from the Cargo package name `morph`, **not** the directory —
so the excision-day directory rename (`wasm-morph/` → `morph-wasm/`) leaves the
published package name untouched (morph-excision-spec §2.3). Versioned in lockstep
with `morph-core`.

Staged for the morph excision (`github.com/mkbabb/morph`): on excision day the
directory moves to `morph-wasm/` and this file moves with it verbatim.

## Unreleased

Landed in csc411 ahead of the excision (grand-uplift W11).

### Added

- **`pointPairs` wire-through**: `WireHints` gains `point_pairs:
  Vec<WirePointPair>` (`#[serde(default)]`, camelCase — `sourceSubpath`,
  `targetSubpath`, `sourceIndex`, `targetIndex`, identical to bbnf-buddy's
  already-declared `CorrespondenceHints.pointPairs`); `convert_hints` maps them
  into `morph_core::PointHintPair`. Additive and wire-compatible (old callers
  omitting `pointPairs` are unaffected). Closes the silently-dropped-hints gap:
  manual anchor-correspondence hints previously reached this boundary and were
  discarded (`point_pairs: Vec::new()`), so the editor's "mark corresponding
  anchors" affordance was dead. They now reach morph-core's Step 8 weighted
  rotation.
- **First `#[wasm_bindgen_test]`s** (`tests/web.rs`, `wasm32`-gated): an
  `alignForms()` round-trip smoke test and a `pointPairs`-forwarding regression
  (a half-step-rotated hexagon where the hint measurably shifts the alignment).
  Run under `wasm-pack test --node`.

### Changed

- `Makefile`: dropped the vestigial `rm -f pkg/.gitignore` step. `pkg/` is
  gitignored at the repo root and never tracked, so the strip served no purpose.

## 0.1.1 — 2026-05-28

npm publish from csc411 as `@mkbabb/morph` (`@mkbabb`-suite release, commit
`aef9eae`). wasm-bindgen wire layer over `morph-core`'s `alignForms` pipeline:
camelCase serde wire types, a thread-local scratch arena, and the single
`alignForms` export. Consumed by bbnf-buddy through the npm registry
(`"@mkbabb/morph": "^0.1.1"`).
