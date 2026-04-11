.PHONY: wasm docs clean

# Build the cdylib via wasm-pack into pkg/. The --target web flag
# emits an ES module loadable from a browser via dynamic import().
# wasm-pack auto-generates `pkg/.gitignore` containing `*` on every
# build, which would hide the artifact from git; we strip it so the
# committed `pkg/` stays in sync with what the build produces.
wasm:
	wasm-pack build --target web --release --out-dir pkg
	rm -f pkg/.gitignore

# Render the rustdoc surface for the wasm sub-crate.
# Useful for verifying that the isomorphic mirror documents every
# #[wasm_bindgen] item.
docs:
	cargo doc --no-deps -p csp-solver-wasm

clean:
	rm -rf pkg target
