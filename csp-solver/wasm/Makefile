.PHONY: wasm docs clean

# Build the LEAN deploy cdylib into pkg/ — the EXACT ship recipe, byte-identical
# to CI's build-lean-wasm lane and to what the frontend `file:` link expects.
# Each flag is load-bearing:
#   --scope mkbabb          package.json name `@mkbabb/csp-solver-wasm` — the
#                           frontend dependency key; a bare build names it
#                           `csp-solver-wasm` and the file: link can't resolve.
#   --target web            an ES module loadable from a browser via dynamic
#                           import() (the Worker's top-level import).
#   --profile wasm-release  the workspace `[profile.wasm-release]` (opt-level=z);
#                           plain --release is opt-level default = a ~2.8x larger,
#                           over-budget artifact that silently overwrites pkg/.
#   --no-default-features   sudoku + futoshiki only; the `assignment` feature and
#                           its whole serde/ndarray graph stay out of the compile.
# pkg/ is gitignored (root .gitignore) — a local build artifact, the file:-link
# target, never committed. wasm-pack drops a stray `pkg/.gitignore` of `*` on each
# build; strip it so the file:-linked package directory stays clean.
wasm:
	wasm-pack build --scope mkbabb --target web --profile wasm-release --no-default-features
	rm -f pkg/.gitignore

# Render the rustdoc surface for the wasm sub-crate.
# Useful for verifying that the isomorphic mirror documents every
# #[wasm_bindgen] item.
docs:
	cargo doc --no-deps -p csp-solver-wasm

clean:
	rm -rf pkg target
