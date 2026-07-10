# T2-W7 — upstream precepts flag: `canonical-readme-shape.md` csc411 row is stale

**This note is the flag.** `docs/precepts/` is a read-only vendored submodule—it is never edited from here. The correction lands upstream (in the precepts source repo) at the next sync; this file records what must change and why, so the next precept import doesn't re-seed a superseded model.

## The stale row

`docs/precepts/canonical-readme-shape.md` §"Per-repo divergences" (line 83, the **csc411** bullet) reads:

> **csc411** — One README at the HW2_ProgrammingQuestion root covers the four publishable artifacts (csp-solver crate + morph-core crate + @mkbabb/csp-solver-wasm + @mkbabb/morph). The `## Install` section enumerates the four install commands; the body carries the architecture + usage as currently written.

It's stale on **both** counts. (Q10 Finding 4.)

## Count 1 — artifact count: 4 → 2

Two of the four named artifacts left this repo. `morph-core` (the Rust crate) and `@mkbabb/morph` (the npm package) were excised to [github.com/mkbabb/morph](https://github.com/mkbabb/morph) (pre-deletion state tagged `pre-morph-excision`); morph now consumes `csp-solver` as an ordinary crates.io dependency. What csc411 still publishes:

| Artifact | Registry | Version |
|---|---|---|
| `csp-solver` | crates.io | 0.2.0 (workspace at 0.3.0; the 0.3.0 publish rides W-GATE) |
| `@mkbabb/csp-solver-wasm` | npm | 0.2.0 |

So the divergence row's "four publishable artifacts" is **two**, and the "enumerates the four install commands" clause over-counts by the same two.

## Count 2 — structure: "one README at root" → one-README-per-package

The row asserts a single root README covering everything. The landed shape is **one README per package**, authored by this wave's fold (R2):

- root `README.md` (product overview + install matrix)
- `csp-solver/README.md`
- `web/frontend/README.md`
- `games/sudoku/README.md` + `games/futoshiki/README.md`

The single-root-README model the precept encodes is superseded. The perimeter template's own divergence clause already permits substantive per-package content below the canonical five—the csc411 row just describes the wrong topology.

## The ask (for the upstream sync)

Replace the csc411 bullet with a two-artifact, per-package-README description:

> **csc411** — One README per published package: root overview + `csp-solver/README.md` + `web/frontend/README.md` + the two game READMEs. Two publishable artifacts—`csp-solver` (crates.io) and `@mkbabb/csp-solver-wasm` (npm); `morph-core`/`@mkbabb/morph` excised to `mkbabb/morph`. Each README follows the canonical five with substantive product content below.

Until that lands, the divergence row is a known-stale entry; the next precept import must not overwrite the landed per-package shape with it.
