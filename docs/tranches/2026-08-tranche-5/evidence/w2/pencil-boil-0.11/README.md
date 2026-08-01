# LANE P — `@mkbabb/pencil-boil` 0.11.0, one tagged release train

**Shipped 2026-08-01.** Upstream `~/Programming/pencil-boil` → `github.com:mkbabb/pencil-boil`.
Release commit `4e9bbc1`; tag **`v0.11.0` pushed** (at `f8ab8b7`, see the CI note below);
`@mkbabb/pencil-boil@0.11.0` published, shasum `fd40671555eab161786f0ff79aac65a374746d20`,
verified by unpacking the published tarball. Upstream CI green: `ci` on master
(run `30721193947`) and `release` on the tag (run `30721208768`). The sudoku repo was not
committed to by this lane, and `web/frontend` was not touched — the app-side bump is W2's
later step under the team lead's π gate.

## The three moves, in one release

| Move | What landed | Gate |
|---|---|---|
| **2.4-upstream** — the `stop()` no-throw contract (J2's residual) | One ordered `withdraw()` behind every handle: the two total statements first, only the host-facing teardown guarded. Documented on `BoilHandle.stop` / `SequenceHandle.stop` and in the CHANGELOG | `proofs/stop-contract.proof.ts`, 26 assertions — every lifecycle phase, both kinds, a hostile host, and the negative control (the withdrawal still lands; a stopped mark never advances) |
| **W4b's cure** — `rasterizePoseToBlob()` | One internal `capturePoseCanvas`; the encode reads THAT canvas. `rasterizePose`'s bitmap and the consumer's re-draw + `convertToBlob` are gone. `useRasterStack` hands back `urls` and owns their lifetime | `proofs/browser/blob-identity.spec.ts` — 0/921,600 differing bytes, maxΔ 0, PNG bytes identical, chromium AND webkit at DPR2. `proofs/raster-blob.proof.ts` (18) — one canvas, one encode, zero `createImageBitmap` |
| **2.8-upstream** — the 20/44 unconsumed exports | 4 pruned, 16 kept with their intended consumer; table in the CHANGELOG and in `export-adjudication.md`. Surface 44 → 41 | `createStrokeDrawIn`, `boilRectFrames`, `ellipsePoints` verified still exported (`api-shape.md`) |
| **D9's cure** — the tag | `v0.11.0` annotated and pushed. The untagged-but-published 0.10.0 / 0.10.1 were retro-tagged on their own release commits, so `git tag` now matches the registry | `git ls-remote --tags origin` in the publish transcript |

## The files

| File | What it is |
|---|---|
| `api-shape.md` | The 41-export surface, the delta, the contract as stated, and the map the app-side adoption owes |
| `export-adjudication.md` | E6 ruled row by row, with the rule applied and one census reason corrected at citation |
| `pixel-identity-measurements.txt` | The byte comparison, per engine, per pose |
| `born-red-stop-contract.txt` | RED: 4 hostile-host arms throw, 22 pass, every negative control already green |
| `born-red-raster-blob.txt` | RED: the module provides no export named `rasterizePoseToBlob` |
| `born-red-blob-identity-browser.txt` | RED: both engines, the fixture cannot even load the entry |
| `green-node-proofs.txt` | GREEN: 12 lanes, 219 assertions |
| `green-browser-proofs.txt` | GREEN: 6 tests, chromium + webkit |
| `publish-and-tag-transcript.txt` | Token-free: whoami, the commit, the tags local and remote, the registry read-back |

## Born-RED discipline, and one honest note about it

Both new lanes were born RED and banked before the cure. The first bank was written to this
directory at 18:0x and **wiped by a concurrent operation in the sudoku repo** (HEAD moved
`71456713` → `a3ada202` mid-lane, and this directory was untracked). The transcripts here were
**re-derived** at 18:17–18:19 by parking the cure with `git stash push src/` in the upstream
repo and re-running the same three lanes against the pre-cure `src/` — same proofs, same
failures, and each file says so in its own header. Nothing was reconstructed by hand.

## One defect the cure itself exposed, and its cure

Pushing `v0.11.0` reded the upstream `release` workflow: it publishes on a `v*.*.*` tag, the
version was already published from the workstation, and npm answers a duplicate publish with a
hard 403. The two retro-tags reded the same way, for the same reason. Tagging cannot be the
routine act D9 asks for if it reds CI every time — so `f8ab8b7` makes the job ask the registry
first and skip a version already there, and `v0.11.0` points at that commit. The published
tarball is unaffected: workflows aren't in `package.json` `files`, so both commits ship a
byte-identical `src/` tree (shasum unchanged). The three red runs stay in the history with
this row as their disposition.

## What this lane does NOT claim

The pixel identity is proven; the *timing* is not. The browser lane's per-arm wall times
(7–14 ms both ways on a 480×480 headless box) neither reproduce nor contradict the estate's
79–195 ms + 87–112 ms device-side attribution — a headless host at a fraction of the board
area is not that surface. What is proven upstream is that the new path does strictly less
work: one canvas, one encode, zero bitmap copies, asserted by count. The stall measurement
belongs to W4b, on the real board, after adoption.
