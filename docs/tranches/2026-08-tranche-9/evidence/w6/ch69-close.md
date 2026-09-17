# CH-69 — the close, verified by a second pair of hands

**Lane:** T9-W6 substrate · **Date:** 2026-08-28 · **Estate:** `csp-solver/`, the
record files, the gates. Nothing published, nothing committed.

This lane was resumed after a session wall took its predecessor mid-flight. Every
figure below was re-derived here, on this tree, rather than copied from
`ch69-green.md` — which is the point of the pass: the record cannot verify the
record.

## The mechanism, confirmed

`ch69-mechanism.md`'s account holds, and it is Régin's criterion rather than a
paper-over. The residual graph orients unmatched edges var→val and matched edges
val→var. An alternating path out of a free **variable** therefore runs along
`res_adj` and justifies the unmatched edges LEAVING a reachable variable; a path
out of a free **value** runs along the TRANSPOSE and justifies the unmatched
edges ENTERING a reachable value. The shipped code seeded free values into
`res_adj`, where they have no out-arc, so that second walk marked nothing past
its own seeds — and the keep-test read `reachable[val_node]`, which is the free-
VARIABLE walk read at the wrong end (safe but weak in one direction, unsound in
the other). Post-cure the test is `same SCC || val_reach[value] ||
reachable[variable]`: each walk read at the end it actually justifies. Square
scopes never build the transpose, so sudoku/futoshiki/thermo prune exactly as
before — `p5_bnb_node_counts_frozen` holds its frozen node counts.

Completeness is what proves it is not blanket over-keeping: `p7` asserts equality
with a brute-force oracle in BOTH directions, so a cure that merely kept more
would fail it.

## The battery — run bare, exit read from the shell

```
cargo test --workspace                                   exit 0
  218 passed · 0 failed · 6 ignored
  33 result lines = 31 test binaries + 2 doctest sections (4 doctests)
  the 6 ignored: measure_9x9_leash_table, measure_leash_sweep,
  measure_skeleton_hoist, measure_thermo_16x16_hard,
  measure_thermo_16x16_leash_table, measure_thermo_16x16_medium
  — all generation_leash measurement harnesses, ignored with a stated reason,
  the same six as before the cure
cargo clippy --workspace --all-targets -- -D warnings    exit 0
cargo fmt --check                                        exit 0
```

The only warning in either run is the pre-existing `proc-macro-error2 v2.0.1`
future-incompat note, which is a dependency's and predates this lane.

Full tally banked at `ch69-battery.txt`.

## The four CH-69 rows, non-ignored, green

`p7_gac_equals_brute_force_support_on_slack_bearing_scopes`,
`p7b_free_value_walk_keeps_a_supported_edge`,
`a_satisfiable_killer_board_never_solves_to_zero`, and the Hard arm inside
`dealt_killer_boards_are_unique_by_construction` all ran and passed in the
workspace battery, and again on a re-run of the two binaries alone (14/14 in
33.28s, 5/5 in 0.77s). None carries `#[ignore]`.

**Hard-tier exposure: CLOSED, not booked.** The ledger row's exposure was that
the uniqueness sweep covered Easy/Medium only. `Difficulty::Hard` now rides that
sweep for both `n=2` and `n=3` across four seeds, non-ignored, and the whole
binary finishes in 0.77s — no leash needed.

## Wasm

Rebuilt from the recipe, not trusted from disk: `make -C csp-solver/wasm wasm`
(`wasm-pack build --scope mkbabb --target web --profile wasm-release
--no-default-features`). The artifact was rewritten (mtime moved) and came back
**byte-identical** to the predecessor's:

```
wc -c csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm  →  123,336 B
sha256                                                b908e586ad84508829edcbcf49080cf05d3bd63d5110390dd078425a9db2fc50
```

| | bytes |
|---|---|
| pre-cure darwin stamp | 122,541 |
| measured here (darwin) | 123,336 |
| delta | +795 |
| band (CI lean fail) | 127,500 |
| headroom | 4,164 |

**Corrected this pass:** the predecessor rebuilt the artifact but never restamped
the sites, so `lean-wasm-4-sites` was RED on a canon 795 B behind the tree. All
four sites now carry the darwin-labelled 123,336 B — `docs/benchmarks.md:55`,
`csp-solver/wasm/README.md:64`, `csp-solver/wasm/pkg/README.md:64` (a wasm-pack
copy of the same file), and `.github/workflows/ci.yml` at both :565 and :664.
`docs/benchmarks.md` also claimed `pkg/` was byte-identical to the shipped
`dist/` asset with a shared sha256, which the cure made false; it now states the
two artifacts have parted, with each digest against its own bytes.

Nothing was published or deployed.

## Doc-truth

```
node scripts/check-doc-truth.mjs   →  1 RED / 40 GREEN, exit 1
```

Every row this lane owns is GREEN, including `lean-wasm-4-sites` (123,336 B
across 4/4 sites, inside the band), `wasm-artifact-sha`, `ci-band-comment-406`
and `test-count-208-vs-204` (220 native `#[test]` attributes, 31 binaries — the
218/6/31 stamp reconciles).

The single RED is **NOT THIS LANE'S**: `directory-count-claims` at
`web/frontend/README.md:53`, which pins 21 `.mjs` in `web/frontend/scripts` where
the tree now has 22 — the concurrent frontend workflow added
`check-live-regions.mjs` in this same tree and its README restamp is theirs to
land. `ch69-green.md`'s doc-truth table is superseded by this section: it named
`relay-origin-pair` as a standing RED, and that row is GREEN here, cured by the
`RELAY_URLS` → `RELAY_URL` read in `scripts/check-doc-truth.mjs`.

## The ledger row, and its probe

`docs/tranches/LEDGER.md` CH-69 read OPEN → CURED, but the row's body still
asserted the W4 exposure — that Hard was untested — and its re-trigger still
described the repro as an ignored test. The registered probe caught exactly that:

```
node scripts/ledger-diff.mjs --require-ledger --assert-state --verify-cites --self-test
  BEFORE:  RED — 1 PROBE. exit 1
           CH-69 · the tree refutes it — the sweep's difficulty list NOW NAMES
           Difficulty::Hard. The record cannot verify the record.
  AFTER:   GREEN. exit 0
```

Cured both ends. The row carries a dated addendum naming the mechanism, the cure,
the four guards, the counts and the owed `dist/` rebuild. The probe registration
(`scripts/ledger-diff.mjs` `PROBES`) was re-aimed off the spent trigger — a claim
that can only ever be refuted now, which is the vacuity that arm exists to refuse
— and onto the GUARD: losing `Difficulty::Hard` from the sweep, or losing
`a_satisfiable_killer_board_never_solves_to_zero`, reds this row on contact. Its
self-test carries both colours.

## Also corrected

`p7`'s own comment cited "1,620 over-pruning cases out of 4,000" — neither figure
is what the banked RED recorded. It now reads 2,013 of the 3,676 satisfiable
scopes, and cites `ch69-red.md` so the number has a run behind it.

## Standing, owed to another lane

`web/frontend/dist/assets/csp_solver_wasm_bg-qsXwlUEX.wasm` is still the pre-cure
122,541 B artifact. The shipped bundle does not carry this cure, so no deploy may
claim killer soundness on the live site until the frontend rebuilds. Stated in
`docs/benchmarks.md`, in the ledger row, and here.

## What this pass did NOT touch

`web/frontend/` source, `e2e/`, and every other lane's file in this shared tree —
including the `LIVE_REGION_ADMITTED` change in `scripts/ledger-diff.mjs` and the
`RELAY_URL` rename read in `scripts/check-doc-truth.mjs`, both of which arrived
from the concurrent workflow and were left exactly as found. No commit, no push,
no publish.
