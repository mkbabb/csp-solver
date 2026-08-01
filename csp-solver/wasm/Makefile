.PHONY: wasm exports-check docs clean

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
#   --no-default-features   five families: sudoku, futoshiki, thermo, killer, kenken.
#                           The `assignment` feature and its whole serde/ndarray
#                           graph stay out of the compile.
# pkg/ is gitignored (root .gitignore) — a local build artifact, the file:-link
# target, never committed. wasm-pack drops a stray `pkg/.gitignore` of `*` on each
# build; strip it so the file:-linked package directory stays clean.
#
# THE POSTPROCESS (T5-W1 row 1.12, audit I3/N2). wasm-pack mints pkg/package.json
# wholesale and emits NO `exports` map, so the five workers' deep import of
# `@mkbabb/csp-solver-wasm/csp_solver_wasm_bg.wasm?url` resolves only by Node's
# legacy no-`exports` fallback. That contract belongs to the generator, not to
# this repo — a wasm-pack release that starts emitting an `exports` map without a
# `.wasm` row breaks all five workers with ERR_PACKAGE_PATH_NOT_EXPORTED and no
# diff to review. `pkg-exports.mjs --write` stamps the map on every build so the
# artifact declares its own resolution surface; `--check` is the same file read
# backwards, so the gate cannot drift from the postprocess. CI must run the same
# --write immediately after its own `wasm-pack build` (build-lean-wasm) — this
# Makefile is not on that lane's path.
wasm:
	wasm-pack build --scope mkbabb --target web --profile wasm-release --no-default-features
	rm -f pkg/.gitignore
	node scripts/pkg-exports.mjs --write

# Verify the shipped artifact answers to exactly the specifiers it declares:
# exact-map assertion + a live `import.meta.resolve` of every subpath through a
# throwaway node_modules link. Non-zero on any drift, either direction.
exports-check:
	node scripts/pkg-exports.mjs --check

# Render the rustdoc surface for the wasm sub-crate.
# Useful for verifying that the isomorphic mirror documents every
# #[wasm_bindgen] item.
docs:
	cargo doc --no-deps -p csp-solver-wasm

clean:
	rm -rf pkg target
