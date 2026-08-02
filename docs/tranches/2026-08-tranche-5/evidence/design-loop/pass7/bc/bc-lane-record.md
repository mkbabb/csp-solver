# PASS 7 · LANE BC — THE RELEASE ROW

Six ordered steps, each banked. Every number below was produced on this machine
(node 26.0.0 / npm 11.12.1, darwin 25.4.0) against the artifact whose md5s sit in
`artifact-md5.txt`, and re-derived at the point it is cited rather than carried forward.

---

## (1) UPSTREAM DISPOSITION — the WIP is a superseded draft, and it is PARKED

The 19-file `src`→`dist` packaging migration sitting uncommitted in
`/Users/mkbabb/Programming/pencil-boil` was not another lane's in-flight work. Its finished
successor was already committed, tagged and **published**:

| | |
|---|---|
| local `master` | `3f41141` — the pose-stack cache, version `0.11.1`, no packaging migration |
| `origin/master` | `ac878c3` — `68b6ed6` + `ac878c3`, version `0.11.2`, no cache |
| registry | `@mkbabb/pencil-boil@0.11.2`, `dist-tag latest`, published before this lane opened |

Byte comparison of the dirty tree against `codex/package-boundary-0.11.1` (whose tip is
`ac878c3`): **12 of the 19 files identical**; the five that differ are precisely the ones the
successor fixed —

- `package.json` still at `0.11.1`, and its `proof` script still omits
  `--experimental-strip-types`, which Node 22.9 requires to execute the TypeScript proof
  entrypoints. That is the exact defect `ac878c3` names.
- `proofs/package-boundary.proof.mjs` still packs its own tarball rather than binding the
  browser lane's single immutable one (`PENCIL_PACKAGE_TARBALL`).
- `proofs/browser/identity.spec.ts` missing the nine assertions that authenticate the served
  tarball through the health identity (sha256, byte count, installed identity, runtime export
  count, type modes, caller ownership).
- `CHANGELOG.md` carries no 0.11.2 entry.

**Ruling: it does not ride 0.12.0 as its own line.** Publishing it would ship a boundary the
registry has already superseded and would erase the successor's cure. It is parked byte-whole
— all 18 modifications, the `mkbabb-pencil-boil-0.9.2.tgz` deletion, and the untracked draft
proof — on `park/pass7-bc-package-boundary-draft` (`a97642e`, pushed to origin), and master
was restored clean at `3f41141`.

**The migration still rides 0.12.0, by the merge of its published successor rather than by the
draft.** `3f41141` was rebased onto `origin/master`, conflict-free, becoming `448a896`. History
in this repo is linear (`git log --merges` is empty), so a rebase is the norm; the pre-rebase
`3f41141` remains reachable as the park branch's parent, so pass 6's recorded SHA still
resolves.

This ordering is not cosmetic. A 0.12.0 cut from the un-rebased master would have carried the
**0.11.1 src-publish shape** and superseded 0.11.2's compiled boundary for every consumer on
`^0.11.0`.

## (2) THE CUT — 0.12.0, published and verified from the registry

Three changes rode the version bump:

- **BC6-G3 closed.** `proofs/raster-stack-cache.proof.ts` is wired into `npm run proof`. This
  was the one line the cache commit could not land, blocked on the packaging migration's hold
  over `package.json`; until now a cache regression would not have redded upstream CI. Proof
  lane **13 entrypoints / 248 assertions** (0.11.2: 12 / 219).
- **BC6-G4 answered** at the option site — see (5).
- CHANGELOG entry in the file's register.

Battery, this tree:

| gate | result |
|---|---|
| `npm test` | CLEAN — `tsc --noEmit` + 13 proofs 248/248 + package boundary |
| package boundary | `npm pack` → `@mkbabb/pencil-boil@0.12.0`, sha256 `8e8a094e8d5b75f72a7c5bc32a9388eddb8d3e0e8f1330e8b13ca04433d24dcf`, 36,432 B, 21 entries; `file:`-installed into a scratch consumer with Vue; 33 runtime exports imported off the **installed** artifact; strict Bundler + Node16 + NodeNext consumers typecheck |
| `npm run proof:browser` | **6/6** — chromium 3/3, webkit 3/3; SSIM 1.0000 per pose per engine; blob-identity 0 of 921,600 bytes differing, maxΔ 0 |
| born-RED, **re-derived not inherited** | the cache proof run against a scratch checkout of `ac878c3` fails **11 of 24** — the zero-encode return, the identical handles, non-revocation of resident stacks, the no-null-flicker, unmount's full sweep, and the font-gate clear |

Tagged `v0.12.0`; `master`, the tag and the park branch pushed. Published from the workstation
(the release workflow is idempotent and skips a version already on the registry).

**Registry verification** — `npm view @mkbabb/pencil-boil@0.12.0 version` → `0.12.0`;
`dist-tags.latest` → `0.12.0`; `dist.shasum` `b161ed6e6388fc75ab76871a434282013992853c`, equal
to the local pack's shasum.

## (3) APP ADOPTION — and the quarantine throw fired by design

`web/frontend` declares `^0.12.0`; the lockfile's `integrity` for the resolved tarball equals
the published `sha512-gU4fYELJ8IPVEt7mmj68iQegAz9nkSM4tBAtkj18O0+QxKn/LbpWhHq4QoKnmorgf9/NqhKqGwnX/pp/DxOrkg==`.
No app source imports a subpath, so the narrowed `exports` map (`.` and `./package.json`
only) is consumed as published. `npm run build` (vue-tsc + vite) clean.

`e2e/linux-webkit-bake-quarantine.ts` armed its re-entry throw at `>=0.12.0`, so its own
written instructions were followed literally: **the helper file, both call sites, and
`assertAgrees`'s now-unused `game` parameter are deleted.** Both spec headers carry the second
removal, including the half the pass-6 registry's narrative had not yet absorbed — the first
de-quarantine's judge spoke twice and disagreed with itself (run 30727947148 green, run
30728779986 red-4), which is why the class was re-pinned at all.

**Stated plainly so no one reads a cure into a cache: 0.12.0 is a pose-stack cache and is NOT
hypothesized to fix the linux-WebKit blank-bake race.** What the removal buys is a live census
at `retries: 0`. Linux judgment is the lead's, multi-run by protocol; LEDGER row CH-62 still
carries the class. The risk is named in the return.

Local batteries, darwin, against the built dist served from `:4251`:

| battery | result |
|---|---|
| built-dist (`playwright-throttle.config.ts`) | **39/39** — `wordmark-webkit` 6, `theme-bake-{chromium,webkit}` 20, `filter-census-{chromium,webkit}` 12, `throttled-void` 1 |
| the two bake specs, full strength, both engines | inside the 39, unquarantined, all five games |
| goldens (`playwright-golden.config.ts`) | **4/4**, and the four `-darwin.png` md5s are **byte-identical before and after** (`goldens-md5.txt`) — the π law holds |
| unit (`vitest run`) | **41 files / 448 tests**, 0 failed |

On the unit count: an earlier run in this same lane read 445. The delta is **not** this lane's
— `GameControlPanel.{vue,test.ts}` were edited by a concurrent lane between the two runs
(`git diff --stat` on the test file: +63/−7). The floor gate is 300.

## (4) BC6-G1 — the capture key LATCHES; quantization was auditioned and rejected

`HandwrittenLogo.vue` fed `Math.round(logoW)` into the bake's cache key, putting it on a 1 px
grid. Measured on this rig (DPR2, 1280×800, built dist, `measure-logo.mjs`):

| label | WebKit rendered px | distance to the 1 px flip boundary | Chromium rendered px | distance |
|---|---|---|---|---|
| sudoku / kenken | 380.5313 | **0.0313** | 382.3906 | 0.1094 |
| futoshiki | 471.9219 | 0.4219 | 473.7969 | 0.2969 |
| thermo | 384.2500 | 0.2500 | 386.1250 | 0.3750 |
| killer | 287.2656 | 0.2344 | 289.1250 | 0.3750 |

`sudoku` and `kenken` in WebKit sit **0.0313 css px — a sixteenth of a device pixel — from the
boundary**, so noise smaller than that re-keys the whole stack and buys a full round of PNG
encodes for a box that never moved. Pass 6 read the same class as a 792↔794 device-px flip on
its own rig; label set and viewport differ, the class is the same (U-10: the flip itself was
not reproduced here, the margin that permits it was).

**Quantization — HandDrawnGrid's own `Math.round(s / 4) * 4` idiom — was tried first and
measured, not assumed.** At a 2 px grid it moves `sudoku`/`kenken` a comfortable 0.2344 px
clear, and moves **`killer` in Chromium ONTO a boundary**: 289.125 lands 0.0625 px from a
288↔290 flip where the 1 px grid had it 0.375 px clear. A fixed grid relocates the hazard; it
does not remove it, and this surface has five labels × two engines to relocate it onto. So the
quantization patch was withdrawn.

The shipped cure is a latch: a measurement re-keys only when it moves a **whole pixel** from
the value the bake was captured at. There is no boundary for noise to straddle. The seed stays
0, so the library still declines to bake at a non-positive `cssSize` rather than baking wrong.
Height latches on the same argument — the `--logo-height` ladder's ≥640px rung is 5.724rem =
91.584 px at a 16 px root, 0.084 px from *its* boundary.

**Live proof, both arms, 5 labels × 2 engines = 20 rows, `latch-proof.mjs`.** The nudge rides
`--logo-scale`, which the SFC's CSS already multiplies into `--logo-height`, so it is a real
layout change a ResizeObserver sees rather than a poked ref.

- **ARM A — sub-pixel (+0.23 to +0.41 css px): the key HELD, 20/20.** Both the blob href and
  the decoded `naturalWidth` are unchanged. Three of those ten label×engine rows cross a
  `Math.round` boundary under the nudge and would have re-keyed under the incumbent —
  `killer`/WebKit 287.2656→287.5000 (287→288), `sudoku` and `kenken`/Chromium
  382.3906→382.7188 (382→383).
- **ARM B — negative control, whole-pixel (+14.4 to +23.8 css px): the key RE-KEYED, 20/20.**
  The latch is stable, not frozen: every row's baked bitmap moved to the new size.

The latch reproduces the incumbent's first-observation value exactly (`round(380.5313)` = 381 →
762 device px, and so on for all ten rows), which is why no golden moved.

**Not gated by a unit.** The quantizer would have to be extracted to `rasterPose.ts` to be
unit-testable, and that file is outside this lane's fence. A source-shaped assertion would be
vacuous. Booked as a new gap below rather than papered over.

## (5) BC6-G4 — measured-not-derived STANDS, and the trigger is now written at the option site

A resizable surface does exist — `HandDrawnGrid`'s `captureSide` tracks the host box — but it
is **already quantized to 4 px** ("so a drag-resize doesn't thrash the bake"), so its size
ladder is short and the default 4 is not thrashed. No re-derivation is owed.

What was missing is the trigger, and it now sits on `poseCacheSize` in `src/raster.ts`: four
was read off the shape the cache exists for (a box toggling between two values, across a theme
flip — 2 × 2 residents), it is a bound on nothing, and at **any** finite cap an unquantized
continuously-resizable box is a pure eviction treadmill — correct, and exactly as expensive as
the pre-0.12 single-slot shape. The cure there is upstream of the option: quantize the box
first; only then does raising the number buy anything. Re-derive when a consumer's quantized
ladder is longer than four rungs and it walks them.

## (6) PORTS

- `4243` and `4245` — BC6-G5's own gap, `serve.mjs` and a stale `vite preview`: **already dead
  at lane open**, verified by `lsof -nP -iTCP -sTCP:LISTEN`.
- `4247` — the upstream browser proof lane, moved off its default `4337` onto the band.
  Playwright's `webServer` reaped it; verified dead by `lsof` immediately after the run.
- `4251` — this lane's `vite preview` of the built dist, the only server it kept. Killed and
  verified dead at close.
- `:3000` is foreign and was never touched: every Playwright run was driven through
  `PLAYWRIGHT_BASE_URL`, so neither config fell back to spawning a dev server.
- **Left standing, and not this lane's to kill: `4237` and `4238`**, both
  `pass6/land/rig/serve.mjs`, started 07:00:11 and 07:13:40 — i.e. *during* this lane, by a
  concurrent one that is presumably still using them. Reported rather than reaped, because
  killing a live lane's server is the mirror of BC6-G5's fault, not its cure. Whoever owns
  them owes the verified line at their own close.

Note for the reader of the diff: this lane's window overlapped other lanes' edits to the same
tree (`GameControlPanel.{vue,test.ts}`, `PRECEPTS.md`, `LEDGER.md`, several `scripts/*`, and
`package.json`'s `lint` script). None of those are BC's; the fence is listed under FILES.

## FILES

Upstream (`/Users/mkbabb/Programming/pencil-boil`): `src/raster.ts`, `package.json`,
`package-lock.json`, `CHANGELOG.md`; branch `park/pass7-bc-package-boundary-draft`; tag
`v0.12.0`.

This repo: `web/frontend/package.json`, `web/frontend/package-lock.json`,
`web/frontend/src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue`,
`web/frontend/e2e/wordmark-integrity.spec.ts`, `web/frontend/e2e/theme-bake-freshness.spec.ts`,
and the deletion of `web/frontend/e2e/linux-webkit-bake-quarantine.ts`.


---

**TESTIMONY MARKER — appended at the pass-7 seal (P7X-G6, the audit's row 8).** The battery
figures this record states (upstream `npm test` 13 entrypoints / 248 assertions; `proof:browser`
6/6 SSIM 1.0000; the 39/39 built-dist run; the full-strength bake-spec runs) were executed and
read live by the lane but their streams were NOT banked beside this record — the lane banked
five files and zero logs. Under the estate's own grammar (`pass5-adjudications-at-seal.md` §2)
those figures stand as **testimony, artifact not banked**: independently corroborated where the
audit re-ran them (the release verification, the registry shasum, the adoption build), and
citable as claims, never as proof. The pass that landed the swallowed-stream law does not get
to exempt its own lane from it.
