# PASS 6 · LANE BC — the encode question answered, and the stack cached per size

**Tree** `abe533c4` (the pass-5 seal, MAIN, unmoved by this lane's product diff — see §7).
**Upstream** `~/Programming/pencil-boil`, commit `3f41141`. **No release. No tag. No publish.**
**Evidence** everything cited below is in this directory; every rig script is banked beside its
runs (BC5-G2's policy, kept).

---

## 1 · BC5-G4 — ANSWERED FIRST, BEFORE ANY CURE WORK

**The question, from the pass-5 registry:** 0.11.0 moved the pose encode from
`OffscreenCanvas.convertToBlob` to the capture `HTMLCanvasElement.toBlob`. *Whether that
forfeits an off-main-thread encode in any engine is UNMEASURED and deliberately not asserted
either way.*

**The answer: it forfeits nothing, in either engine.**

`rig/g4-encode.mjs` + `rig/g4.html` encode the SAME EIGHT canvases through three APIs. The
canvases are painted once, before any window opens, at the shipped bake's real geometry
(4 × 794×234, 4 × 1320×1320) and auto-calibrated at load until their PNGs land inside the
pass-5 byte bands — 883,885 B total against the shipped bake's 888,789 B, 0.55% low. Nothing is
drawn, copied or awaited inside a measurement window; the window holds encodes and nothing else.
`blockedMs` and `worstGapMs` are stall5's own statistics, kept verbatim.

| engine | arm | wall ms (3 reps) | **blocked ms** | worst gap ms |
|---|---|---|---|---|
| **webkit** | idle (negative control) | 401 / 401 / 402 | **0 / 0 / 0** | 12 / 12 / 13 |
| webkit | `toBlob` | 62 / 70 / 57 | **72 / 77 / 63** | 72 / 77 / 63 |
| webkit | `convertToBlob` (main thread) | 59 / 64 / 65 | **69 / 74 / 66** | 69 / 74 / 66 |
| webkit | worker (`ImageBitmap` → `OffscreenCanvas`) | 90 / 60 / 75 | **0 / 0 / 0** | 12 / 12 / 11 |
| **chromium** | idle (negative control) | 401.5 / 401 / 401.3 | **0 / 0 / 0** | 9.5 / 9.7 / 9.9 |
| chromium | `toBlob` | 33.2 / 25.7 / 46.2 | **0 / 0 / 0** | 8.8 / 9.7 / 8.5 |
| chromium | `convertToBlob` (main thread) | 30.9 / 40.5 / 30.8 | **0 / 0 / 0** | 8.1 / 8.1 / 8.4 |
| chromium | worker | 31.7 / 20.4 / 32 | **0 / 0 / 0** | 9.7 / 8.3 / 8 |

Logs `logs/G4-webkit.log`, `logs/G4-chromium.log`; runs `runs/g4-*.jsonl`.

- **WebKit — no forfeit.** `convertToBlob` called on the main thread blocks the main thread
  *exactly as* `toBlob` does: 66–74 ms against 62–77 ms, overlapping ranges, both ~70× the
  0 ms idle floor measured in the same session. The pre-0.11 shape built its `OffscreenCanvas`
  on the main thread, so it was never off-thread either — it was the same block plus a copy.
  The ONLY off-main-thread encode is a real `Worker`: 0 ms blocked, at the idle floor.
- **Chromium — no forfeit, and nothing to forfeit.** All three arms read 0 ms blocked at the
  idle floor. Chromium already encodes off the main thread whichever entry point is used.
- **Byte identity across arms, per engine:** all three arms produce identical FNV-1a hashes for
  all eight blobs (webkit `ea4fc5d2…c664b447`, chromium `aad9ffef…02f6065f`). Without this the
  comparison would be void — the arms could have been encoding different pixels.
- **The provenance control** (`logs/G4-provenance.log`): the shipped path fills its canvas from
  `drawImage(<img src=svg-blob>)`, not from 2D stroke calls, so the eight canvases were REFILLED
  through that exact path (hashes unchanged, proving the round trip preserved pixels) and
  re-encoded. WebKit 75 / 64 / 70 ms blocked, chromium 0 / 0 / 0 — indistinguishable from the
  direct arms. How the canvas got its pixels does not change what the encode costs.

**The consequence, and it is what routes the rest of this lane:** no rearrangement of the
capture recovers a thread, because there is no thread to recover. A `Worker` is not available
to this library — a worker cannot rasterize an SVG that resolves against the page's cascade,
which is the whole self-contained-capture contract. **The encode a surface does not perform is
the only encode that is free.** Option B was the right charter, and BC5-G4 is why.

**Harness limit, stated because pass 5 made it load-bearing:** this is Playwright's WebKit, not
real Safari 26.4, so absolute milliseconds do not transfer. The threading conclusion does: it is
read as blocked-vs-idle *within one session*, against an in-session negative control, not against
a remembered number.

---

## 2 · OPTION B — landed UPSTREAM, in `useRasterStack`

**Where, and why there.** Upstream, in the library. Three reasons, in order of force:
(1) BC5-G4 says the encode cannot be threaded away, so avoiding it is the only cure, and the
only place that can avoid it is the code that decides whether to capture; (2) the cache key IS
the string `useRasterStack`'s own opts-watch already computes — an app-side cache would have to
reconstruct the library's private capture identity and would drift from it; (3) the composable
OWNS the object-URL lifetime and revokes on swap, so an app-side cache literally cannot hold
what it would be caching. Parsimony rules, and app-side would have been the larger change.

**The shape.** Stacks are held by the full capture identity — `cacheKey` + dpr + `cssSize` +
`poseCount`. A hit is taken before anything costs anything: no token bump, no `urls = null`, no
paint boundary, no encode. `poseCacheSize` caps residency, **default 4**; at **1** the composable
reproduces the 0.11 shape exactly, so the incumbent survives as a configuration rather than as a
deleted branch (the "audition the incumbent" rule, made mechanical). `rebake()` drops the live
entry first, so force still forces. The font gate CLEARS the cache rather than keying around it:
every stack baked before the face landed is stale, not merely the current one.

**Product code in this repo: +0.** The cure is entirely upstream.

### 2.1 Born-RED

`proofs/raster-stack-cache.proof.ts` (24 assertions) run against `src/{vue,raster}.ts` restored
to the upstream HEAD `f8ab8b7` — the 0.11 shape — by file copy, no git state changed:

```
raster-stack-cache.proof: 11 FAILED, 13 passed     ← born RED, logs/PB-born-RED.log
raster-stack-cache.proof: 24 assertions passed     ← after,   logs/PB-green.log
```

The 13 that pass on HEAD are the point, not an accident: they are the cap/eviction arms and the
**live control arm (g)**, which re-runs the entire size walk at `poseCacheSize: 1` and asserts the
re-encode is PRESENT. If the harness could not see a re-encode, arm (a) would pass falsely; (g) is
what makes (a) a measurement rather than a tautology.

### 2.2 The measurement — `rig/stall6.mjs`, both arms on ONE instrument

stall5 measured a single gesture: land closed, settle, open. That gesture is a cold miss under
any cache, so stall5 run unchanged against the cure would have measured the cure's worst case and
reported it as the cure. stall6 walks the toggle — **open, close, open** — one fresh page per rep
so every rep's first open is a genuine cold miss, three reps, viewport/DPR/regime guards and
statistics inherited verbatim from stall5.

Both arms are the same app tree at `abe533c4` and the same rig. The AFTER arm replaces
`node_modules/@mkbabb/pencil-boil/src/{vue,raster}.ts` with the 0.12.0 candidate — published
0.11.0 ships raw TypeScript, so this is exact and **`package.json` is untouched, still `^0.11.0`**.
The restore was md5-verified and the rebuilt BEFORE bundle came back byte-identical
(`index-BNMQu01IbxTY.js` both times), which is the control on the swap itself.

| | BEFORE (0.11.0) | AFTER (0.12.0 candidate) |
|---|---|---|
| encodes per gesture, 9 gestures | 8,8,8,8,8,8,8,8,8 | **8,0,4,8,4,0,0,0,0** |
| gestures re-encoding the **grid** stack | **9 / 9** | **2 / 9** — and both are a fresh page's FIRST open |
| gestures re-encoding the **wordmark** stack | 9 / 9 | 4 / 9 (§2.4) |
| `blocked600` ms | min 261 · med 281 · max 383 | min 0 · med 78 · max 447 (the 447 is a cold g1) |
| object-URL revokes, all 9 gestures | 144 | **30** |
| **pure cache-hit gestures (0 encodes)** | — | **5 of 9** |
| &nbsp;&nbsp;their `blocked600` ms | — | **0, 68, 78, 78, 0** |
| &nbsp;&nbsp;their worst gap ms | — | **38, 68, 78, 78, 35** |

Logs `logs/S6-before-webkit-v2.log`, `logs/S6-after-webkit-v2.log`; runs
`runs/s6-*-v2.jsonl`. The first-cut run (`s6-{before,after}-webkit.jsonl`) is banked too — its
census sampled at a fixed t+950 ms while the wordmark box was still gliding and produced a false
π alarm; §2.4 is what that alarm turned out to be, and the rig now polls the boxes to rest first.

**The headline, stated at the altitude the evidence supports.** The grid stack — 4 poses at
1320×1320, ~198 KB each, 791 KB of the 1.16 MB baked on the surface — **re-encoded on every one
of nine gestures before, and after its first bake per page it never re-encodes again.** The
1296×1296 closed-drawer capture does not appear anywhere in the AFTER arm: it is baked once at
mount and served from cache for the rest of the page's life. A gesture that hits the cache
outright blocks **0–78 ms** where a full bake blocks **261–383 ms**.

**What this does NOT claim.** The first open at a never-seen size still pays the full bill —
a cache is a claim about the second time, and the 447 ms cold g1 in the AFTER arm is that bill,
honestly in the table. And these are Playwright-WebKit milliseconds; the *ratio* and the *encode
counts* transfer to Safari, the absolute numbers do not.

### 2.3 π — byte identity on a cache hit

Checked by fetching every baked blob back off the live DOM and hashing the payload (FNV-1a), not
by comparing handle strings — an implementation that re-encoded to a fresh URL could not pass.

**The exact comparison, cross-arm:** AFTER rep 1's `g2` and `g3` are *pure cache hits* (0 encodes,
measured). Their pose-byte multisets are **identical to the BEFORE arm's same gestures**, where
every pose was freshly encoded — `true` for both. Across all AFTER gestures, every pose artifact
served on a hit appears in the BEFORE arm's set of fresh encodes. What the cache hands back is
what a fresh encode produces, byte for byte.

The settled capture boxes are identical in every rep of both arms (board 650/666,
wordmark 380.5×111.9 open / 399.6×117.5 closed), so nothing about the layout moved.

### 2.4 The residual, and the control that exonerates the cure

The 4 remaining re-encodes are **the wordmark stack only**, and their cause is a **two
device-pixel key jitter**: the wordmark's capture width alternates between `792x234` and
`794x234` — 396 vs 397 CSS px at DPR2 — while its *settled rendered box never moves* (380.5 px,
identical in all nine gestures of both arms). `HandwrittenLogo.vue` rounds a fractional measured
width into `cssSize`, and the rounding lands on either side. Every alternation is a cache miss.

**This is not caused by the cache, and the BEFORE arm proves it:** the BEFORE arm shows the same
`792`/`794` alternation, and its own g1-vs-g3 byte comparison reads DIFFERENT in 2 of 3 reps for
exactly this reason. 0.11 re-encoded unconditionally, so the jitter cost nothing visible and no
gate could see it. The cache did not introduce the defect; it made a pre-existing measurement
defect *legible* as a residual encode.

**LEDGERED, NOT CURED — fence.** The cure is one rounding decision in
`web/frontend/src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue`, which is not this lane's
fence. Raised as **BC6-G1** for the lead to route. Cost of leaving it: 4 × ~24 KB re-encoded on
some toggles, against the grid's 4 × ~198 KB that the cache now always avoids.

---

## 3 · The 44px floor, stated where it lives (lead's §3 ruling)

`web/frontend/src/assets/index.css`, at the shared `@media (pointer: coarse)` block. The comment
names the dependents and says why the statement belongs to the block rather than to any branch
that enforces it — pass 5 red the wrong assertion first precisely because the property read as
the branch's own.

**The count was re-derived at the citation and pass 5's is corrected in place: FOUR, not three.**
A grep over rendered `class=` attributes returns one component per selector —
`.ctrl-btn` (OptionSelector.vue), `.mobile-heading-btn` (GameControlPanel.vue),
`.attribution-trigger` (AttributionCard.vue), `.error-note-retry` (SolverErrorNote.vue) — and the
two halves of the floor do not reach the same set (`min-width` reaches only the first two). The
comment also names what is NOT a dependent though it gates on the same number: `.icon-btn` and
`.peek-hold-surface` clear 44 px on their own geometry, so deleting this rule would not move
them. The gate stays where the branch exists (`e2e/zone-grammar.spec.ts`), per the ruling.

**Artifact-neutral, proved not assumed:** the CSS bundle hash is `index-BJ36koLSifhi.css` both
before and after the comment landed (`logs/build-BEFORE.log` vs `logs/build-BEFORE-v2.log`) — the
comment is stripped at build, so no golden can move on its account. `prettier --check` clean.

---

## 4 · Pass-5 §7's floor disclaimer — the premise was false, corrected in place

`pass5/BC/BC-report.md` §7 claimed the `options 5/5` (W3.3) and `k-peek` (W3.4) floors "were NOT
run by this lane". Both live in `e2e/a11y.spec.ts` — `3.3 optionsInPicker` at line 323, `3.4
ctrlKDoesNotPeek` at line 369, re-derived by grep at `abe533c4`, not carried from the registry —
which is the very file that section reports at **30/30**, and pass 5's own banked
`logs/floors-a11y.log` carries six passing rows for the two guards, three per engine. The
disclaimer also mis-located them: neither lives in the picker/mobile specs whose concurrent
editing it invoked, so the attribution hazard did not apply either.

Corrected as a note beside the line, not an erasure (the estate's own D5-G1 pattern). The
conclusion it changes is small and named: **lane BC's pass-5 W3-floor tally is complete, not
partial.**

---

## 5 · THE RELEASE — NOT SHIPPED, and the reason is not the quarantine

**No 0.12.0 was published. No tag. No version bump.** Upstream commit `3f41141` lands the source
and the proofs only.

Two independent reasons, and the *first* is the one that would have bitten:

1. **The upstream working tree carries another lane's unfinished packaging migration.**
   19 files are modified there — `package.json` moving `main`/`module`/`types`/`exports`/`files`
   from `src` to `dist`, the release and CI workflows, `tsconfig.json`, the ts-ext resolver, the
   browser proof server. Published 0.11.0 ships **raw TypeScript**, and the consuming app's Vite
   pipeline compiles it. A 0.12.0 cut from this tree would ship that migration under this
   change's version number and change the artifact's shape for every consumer — a blast radius
   far larger than the cache, and not this lane's to detonate.
2. **0.12.0 arms the linux-WebKit bake quarantine's re-entry guard** (`e2e/linux-webkit-bake-
   quarantine.ts` throws at `>=0.12.0`; W2 seal ruling, ledger CH-62). That is the lead's
   judgment to make with the quarantine in hand, and per orders **I did not touch the app's
   dependency** — `web/frontend/package.json` still reads `^0.11.0`.

**LOUD, as ordered:** if the lead elects to publish, the version WILL be 0.12.0 (the default
`poseCacheSize` changes behaviour), and it WILL throw the quarantine's re-entry guard the moment
the app declares `>=0.12.0`. The two must be sequenced together. One further item rides along:
the new proof's one-line wiring into `npm run proof` is **not** in the commit, because
`package.json` is entangled with the migration above — the proof runs standalone and passes
24/24, but it is not yet in the upstream gate.

---

## 6 · Gates

| gate | result | log |
|---|---|---|
| pencil-boil `npm test` (tsc + 13 proofs + package boundary) | **248 assertions, 0 failed; boundary CLEAN** | `logs/PB-npm-test.log` |
| `proofs/raster-stack-cache.proof.ts` | **24/24** (born RED 11/24 on parent) | `logs/PB-green.log`, `logs/PB-born-RED.log` |
| app `npm run build`, BEFORE | green, `index-BNMQu01IbxTY.js` | `logs/build-BEFORE.log` |
| app `npm run build`, AFTER (0.12 candidate) | green, `index-BQy9PfMUBqCO.js` | `logs/build-AFTER.log` |
| app `npm run build`, BEFORE restored | green, **`index-BNMQu01IbxTY.js` — byte-identical to the first** | `logs/build-BEFORE-v2.log` |

Two incumbent upstream proofs were amended, and both amendments are disclosed rather than
buried, because amending a proof to fit a change is exactly the move that needs watching:

- `vue-raster-stack.proof` (e) asserted "the superseded set is revoked once its successor lands".
  Under the cache a superseded set is RETAINED and revoked on eviction. The assertion is
  **inverted, not weakened**, and the safety property it protected (the outgoing images stay
  decodable) is now structural. **Separately, its teardown arm revoked the handles ITSELF and
  then asserted they were revoked — a check that could not fail.** With teardown moved to
  `onScopeDispose` the composable's own cleanup runs, and the arm now asserts the composable did
  the work. Same family as BC5-G2: the record could not verify the record.
- `raster-theme-flip.proof` (d) asserted a double flip re-captures the final cascade. Landing
  back on a resident theme now captures nothing, so the arm split: **(d1)** asserts the surface
  ends on the final cascade's own handles (stricter than re-reading ink) and never nulls;
  **(d2)** re-runs the same race onto a key never baked, so the born-RED-at-0.10.0 coverage —
  that a capture reads the theme it LANDED on — still actually runs.

**Not run, and stated rather than elided:** the app's e2e suite. Product code changed by +0 lines
in this repo, the only app-tree edits are a CSS comment and two evidence documents, and the
0.12.0 candidate is not declared as a dependency — so there is nothing in the app for a suite to
judge. The W3 floors bank green from pass 5 unchanged (§4 above corrects the record of that, and
raises the tally rather than lowering it).

---

## 7 · Fence and hygiene

- **MAIN tree, no git state changed.** Product diff: `web/frontend/src/assets/index.css` (comment
  only) + `pass5/BC/BC-report.md` (correction note) + this directory.
  `GameControlPanel.vue` untouched — the LAND lane owns the drawer estate.
- **`node_modules` restored to published 0.11.0**, md5-verified against the backup taken before
  anything was touched, and the rebuilt bundle hash proves it.
- **Ports:** 4243 (G4 page) and 4245 (app preview), both inside the assigned 4230–4260, both
  killed at close. `:3000` never touched.
- **Every rig script is banked beside its runs** — `g4-encode.mjs`, `g4.html`, `serve.mjs`,
  `stall6.mjs` — with AUDIT prepends on every log (BC5-G7's discipline row, paid).
- **No dist directory is banked**, hollow or otherwise (BC5-G2's policy); the arms are identified
  by bundle hash in the build logs instead.

---

## 8 · New gaps

- **BC6-G1 · the wordmark's 2-device-pixel key jitter.** §2.4. `HandwrittenLogo.vue` rounds a
  fractional measured width, so the capture key oscillates 792↔794 while the rendered box holds
  still. Pre-existing (present and measured in the BEFORE arm), made legible by the cache, costs
  4 × ~24 KB of needless encoding on some toggles. Outside this lane's fence — LEDGERED for the
  lead to route.
- **BC6-G2 · pass 5's stall attribution over-attributed the encode, and this lane's own §1 is how
  we know.** Pass 5 concluded "eight PNG encodes back to back on the main thread … that span IS
  the rAF gap" for a 286–298 ms window. §1 measures those same eight encodes, at the same
  geometry and the same byte sizes, at **62–77 ms** in the same engine. The encode is roughly a
  quarter of the window, not all of it; the rest is the capture path around it (SVG serialize,
  blob, `<img>` decode, `drawImage`) plus the gesture's own layout. This does not change any
  disposition — the cache removes the whole bake, encode and capture alike, which is why the
  measured cure is larger than the encode share — but the *sentence* in the pass-5 record is
  wrong and should not be cited again. Booked against my own lane's predecessor.
- **BC6-G3 · the new proof is not in the upstream gate.** §5. It passes 24/24 standalone; its
  one-line wiring into `npm run proof` is blocked on another lane's `package.json` migration
  landing. Until then a regression in the cache would not red upstream CI.
- **BC6-G4 · `poseCacheSize: 4` is measured-adequate here, not derived.** Four covers two boxes
  across a theme flip, which is the shape the cure exists for, and the 9-gesture walk never
  evicted a settled stack. A surface that walks many sizes (a freely resizable board, a
  drag-resize rail) would thrash it, and nothing in the library warns. No such surface exists in
  this estate today; the number should be re-derived if one is built.

---

## 9 · What the lead now owns

1. **The release election** — publish 0.12.0 or not, sequenced with the CH-62 quarantine
   re-entry, and NOT before the upstream packaging migration lands or is reverted (§5).
2. **The app's dependency bump** — untouched by this lane, by order.
3. **BC6-G1's routing** — a one-line rounding fix in a component this lane may not edit.
