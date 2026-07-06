.PHONY: wasm clean

# Build the cdylib via wasm-pack into pkg/. The --target web flag
# emits an ES module loadable from a browser via dynamic import().
# pkg/ is gitignored at the repo root, so the build output is never
# tracked; wasm-pack's auto-generated pkg/.gitignore is left in place.
wasm:
	wasm-pack build --target web --release --out-dir pkg

clean:
	rm -rf pkg target
