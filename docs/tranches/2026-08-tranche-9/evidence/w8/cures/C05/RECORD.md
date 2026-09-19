# C05 — THE WORDMARK'S STACK SURVIVES THE VIEW FLIP

Track `bake`, branch `w8/bake`, preSha `aa2573a6` (C02's second fix), commits `c003c1d0` (the
cure), `da33cb8e` (repair round 1) and `66e34b23` (repair round 2). The preSha of round 2 is
`da33cb8e`. Both fix commits are comment-only; the bundle is byte-identical across all three.
Base arm = the build of HEAD as found. Ports 4252 (dist-base) / 4253 (dist).

    base  AUDIT: build-identity — dist entry index-CS-Vym5OZcaO.js · index.html md5 c07ba6d9f80a8b26559c0765120fe79d · 43 files / 811.1 KB
    cured AUDIT: build-identity — dist entry index-LjRNU9f7iIUb.js · index.html md5 b4865f796519e83934879968e3fbd4f0 · 43 files / 811.3 KB

Printed at both ends of every reading set and re-read over HTTP at both. Host darwin 25.4.0
arm64; `sysctl -n vm.loadavg` per set in `fix-r2/load.txt` and each census's `load.txt`
(round 2: frames 5.85 → 8.90, identity 8.90 → 6.98, label 6.98 → 6.87).

**NO LINE CITES IN THIS FILE.** Three rounds ran aground on the same defect — a cite that was
right when it was written and wrong one commit later, because the commit that corrected it
moved the lines. Every cite below names a FILE and a SYMBOL. `grep -n` resolves them at any
HEAD; a line number does not.

**REPAIR ROUND 2** (`verify-r2/VERDICT.txt`, a second non-author, ruled REPAIR — "the cure
stands; the record still does not", no code change owed, do not reset). Five things were owed:
three repairs and two corrections that run in the cure's favour. All five are paid below with a
re-measure rather than an argument, in `fix-r2/` — one sequential battery so no two of its
censuses ever shared the host: 6 + 6 interleaved frame windows, 3 + 3 capture-identity runs, and
3 + 3 label-change runs on a new instrument that reads the charter's third Accept clause by
name. Findings (1) cites, (2) the Accept clauses, (3) the exit marks, (4) the base arm's own
late warm, (5) the pooled rate — §0, §5, §3, §1, §4 in that order.

## 0. THE VERDICT'S FIVE FINDINGS AND WHERE EACH IS PAID

| # | the finding | where it is paid |
|---|---|---|
| 1 | the probe's cite was right at `c003c1d0` and wrong at HEAD — the fix commit moved the lines | this file's head: cites are symbols now, everywhere |
| 2 | the record never reports against the charter's **Accept** clauses | §5, with the third clause measured by name for the first time |
| 3 | exit p95 and fps were called "the exit marks that improve"; they are inside spread | §3, restated as medians beside the two marks that are disjoint |
| 4 | the base arm's account is incomplete — it carries a late logo warm too | §1 and §4, pooled at 6 of 9 base runs |
| 5 | the cured arm's second surface reproduces more often than "1 of 3" | §4, pooled at 5 of 9 cured runs |

## 1. THE ATTRIBUTION STEP THE CHARTER OWED FIRST

`attrib/fold-identity.mjs` logs every fold bake with the library's own capture identity —
`cacheKey|dpr|WxH|poseCount` (`pencil-boil/dist/vue.js`, `stackKey`) — reconstructed from the
page with no `src/` change: the capture canvas is `round(cssW*dpr) × round(cssH*dpr)`
(`raster.js`), `cacheKey` is `logo-${label}-${d|l}-${vbWidth}` (`HandwrittenLogo.vue`,
`logoCacheKey`) and every part of it is in the DOM, and a ResizeObserver on the same `<svg>`
logs the layout box `captureH` latches from. Banked: `attrib/identity-*.jsonl`,
`fix-r1/identity/`, `fix-r2/identity/`, pooled in `fix-r2/ENCODES.txt` (chromium 4× · desk
1280×800 dpr 2 · warm).

**The miss is a LEGITIMATE re-key, and it happens ONCE.** The gallery pose really moves the
wordmark's layout box: `.board-group.is-gallery .masthead { --logo-scale: 0.72 }` (`App.vue`)
takes the `<svg>`'s `contentRect` from **382.3906 × 111.9219** to **275.3594 × 80.5938**, so
`captureH` latches 112 → 81 and the key goes `logo-sudoku-l-205|2|382.5x112|4` →
`…|2|277x81|4`. Four real encodes, on the first entry only.

**The 4-slot cache does NOT miss on the flip, and the cure proves it by moving one bake and not
the other.** Pooled over three rounds, 9 runs per arm (`fix-r2/ENCODES.txt`): the four encodes
that follow the gallery box within ~40 ms sit at 310–350 ms in **9 of 9 runs on BOTH arms**,
untouched by the deferral, because a live bake is not deferrable; the four on the unfold move
to 1,168–1,262 ms in **9 of 9 cured runs**, past `GESTURE_QUIET_MS`, where the base has **0 of
9** past that line. Only the warm path is deferred, so those four are the warm and never were a
miss. The cache holds both boxes, the four resident identities are exactly `DEFAULT_POSE_CACHE`,
and every logged key carries `poseCount` 4. Not an eviction, not an element-identity
invalidation.

**What the warm path bakes, named this round.** `usePosePrewarm(logoRaster, alt)` in
`HandwrittenLogo.vue` computes `alt()` with `warmDark = !isDark`: the warm is the ALTERNATE
THEME's stack of whatever identity is live. So it is never ink the current view is waiting for
— and the census's reconstructed key reads its theme letter from the DOM at `drawImage` time,
which means a dark warm prints as `…-l-…`. That is a limit of the instrument, stated here so
the four "gallery-key" encodes are not read as a second bake of the live identity.

**CORRECTED in round 1** (`verify-r1` finding 1): the original "cycles 1 and 2 bake the wordmark
0 times in either direction" is true of the BASE arm (0 of 9 runs, every steady-state window)
and false of the cured one — see §4.

**CORRECTED in round 2** (`verify-r2` finding 4): the base arm's account was incomplete, and the
omission ran against the cure. The base ALSO lands a late four-encode warm past the 1,160 ms
line inside or just past the first entry's window — **6 of 9 base runs** (1,415–1,481 ·
1,515–1,592 · a straggler at 1,602, `fix-r2/ENCODES.txt`), against 3 of 9 cured runs in that
same window. A late wordmark warm is a base-arm fact too; the cure changes which fold pays it,
not whether it is paid.

**So what did A7 count?** `fold-frames.mjs` counts `CanvasRenderingContext2D.drawImage`, and the
CH-62 paint probe in `rasterPose.ts` — the function `posePaints`, which draws the admitted image
into a `PROBE_PX`² canvas — is a `drawImage` too: 24 × 24 device px, one per pose, on every
ADMITTED stack. The wordmark re-admits a stack on every fold (a cache HIT re-admits), so the
probe fires four times per direction, forever, at a cost the census reads as a **1.2–3.0 ms
burst**; this round counts it beside every label change as well (`probe24=4`, 9 of 9 snaps, both
arms). G2's "4 bakes per direction, every fold" is that probe. Corrected, not disputed: the
magnitude A7 measured is real; the surface it was attributed to is not.

**What is actually in the fold's long frames** (base, 38 of 38 acceptance windows across five
batteries): idle PRE-WARM poses. A 1,272² grid pose is a 206–213 ms task at 4×, and
`BOOT_CENSUS_MS` releases the warm chain at 3,000 ms, which is where an instrument (or a person)
folds. Base entry bakes at ~310–370 (the wordmark's live re-key), then four 1,272² warm poses
straight through the choreography.

## 2. THE CURE

`web/frontend/src/pencil/composables/rasterPose.ts` — `GESTURE_QUIET_MS` (the file's §A WARM MAY
NOT OPEN INSIDE A GESTURE'S OWN CHOREOGRAPHY), `lastGestureAt` stamped in the existing gesture
count, and one reschedule in `usePosePrewarm`'s `start()`, beside the boot-census one. App-side,
46 added lines, no deletion. The window is `MOTION.chromeLeaveMs + MOTION.boardFoldMs +
MOTION.cardStepMs` = 1,160 ms — every term a `MOTION` row, no new literal.

The incumbent guard abandons a warm that is already running when a gesture lands
(`gestures !== mark`). It says nothing about the warm that OPENS a moment later, while the
gesture's motion is still playing, and that is the one the fold walks into. The wait reschedules
rather than consuming an attempt, so a page at rest warms exactly as it did, one window later at
worst.

**Not the library.** Nothing here is the library's to know: `useRasterStack` already serves the
flip correctly (both boxes resident, hit synchronous, zero encodes). What was wrong was WHEN the
app asked it to warm.

## 3. THE NUMBERS (chromium · 4× · unthrottled link · warm · desk 1280×800 dpr 2)

Instrument: `fold-frames.mjs`, A7's, copied verbatim — only `--port` differs between arms.
Interleaved b,c,b,c…; `fix-r2/pool.mjs` reads every battery whose RAW windows are banked and
reports each one separately AND pooled (`fix-r2/STATS.txt`): round 0 (author, n=14), repair
round 1 (n=6), the second non-author (n=6), this round (n=6) — **n=32 per arm, 0 tainted**.
`verify-r1`'s 6 + 6 is quoted from its own `STATS.txt`; its raw windows were not banked, so it
sits outside the pool and makes the five-battery counts below.

**THE HEADLINE.** The claim this cure is read on is a per-window count, not a frame: **a task
over 150 ms inside the entry's choreographed window — 38 of 38 base windows carry one, 0 of 38
cured windows do**, across five independently launched batteries and three authors, two of them
non-authors. A 1,272² grid warm pose is the only thing on this page that reaches 150 ms.

| mark (cycle 0 entry, 1,100 ms window) | base, pooled n=32 | cured, pooled n=32 | verdict |
|---|---|---|---|
| **tasks > 150 ms inside the window** | **2** (1–3) | **0** (0–0) | **DISJOINT pooled and in 5 of 5 batteries** |
| **fps** | **80.9** (50.9–91.8) | **108.2** (97.3–119.1) | **DISJOINT pooled and in 5 of 5** |
| p95 | 16.8 ms (13.6–91.6) | 10.3 ms (9.8–14.7) | disjoint in 5 of 5 separately; POOLED the ranges overlap by 1.1 ms |
| worst frame | 208.7 ms (80.1–231.4) | 87.5 ms (68.2–117) | median −121.2 ms; **not disjoint** |
| long33 | 3 (2–4) | 2 (2–2) | inside spread pooled |
| jank (Σ frames > 50 ms) | 350.9 ms (136.2–593.4) | 142.7 ms (74.1–185.4) | inside spread pooled |

Two marks survive pooling as disjoint: the task count and the frame rate. p95 is disjoint in
every battery taken alone and overlaps once the batteries are pooled, because base windows from
a cool host (13.6 ms) undercut cured windows from a hot one (14.7 ms) — it is quoted as a
median, not as a disjoint mark. The worst-frame row's `insideSpread: false` was withdrawn in
round 1 and stays withdrawn: the medians move in every battery, but base windows read 80.1 and
91.6 ms while still carrying a >150 ms task, because the task straddles the window's edge and
the rAF gap it causes is scored outside. Frame and task disagree there, which is exactly why the
task count is the mark.

**EXIT, first fold — RESTATED (`verify-r2` finding 3).** Every exit mark is INSIDE SPREAD
pooled, and the round-1 sentence calling p95 and fps "the exit marks that improve" is withdrawn.

| mark (cycle 0 exit) | base, pooled n=32 | cured, pooled n=32 | verdict |
|---|---|---|---|
| worst frame | 59.6 ms (48.9–265.6) | 60.7 ms (49.4–223.6) | inside spread — **not a move**, 5 batteries running |
| p95 | 14.7 ms (9.7–16.7) | 10.2 ms (9.4–17.8) | median −4.5 ms, inside spread |
| fps | 109.2 (82.9–121.1) | 119.7 (77.6–126.3) | median +10.5, inside spread (disjoint in `fix-r1` alone; not on a second host) |

The base's exit frame was never the warm — relocating the warm leaves the frame where it was.
What is there is the deck unmount and the killed board mover, W7 §13's.

**Steady state (cycles 1–2, pooled n=26 per arm per direction):** frames unmoved in both arms —
entry worst 57.5 → 52.7, exit 50.2 → 51.3, p95 10.1 → 9.7, every mark inside spread. What is NOT
unmoved is where the bake sits: §4.

WebKit (unthrottled, NO CDP; task ms NOT MEASURED), desk dpr 2, n=4+4, first fold: frames unmoved
(entry worst 48 → 50, exit 25 → 29, long33 1 → 1 / 0 → 0 — the fold was never red on this
engine), and the mechanism moves anyway: bakes inside the window **10 → 9** entry and **6 → 5**
exit, both DISJOINT.

## 4. THE TRADE, NAMED — NOW WITH BOTH ARMS' RATES

The warm is moved, not removed, and a 1,272² pose is 206–213 ms wherever it lands.

**Leg (a), the grid.** Under an instrument that folds every ~1.9 s the relocated chain can
straddle a LATER press. Pooled over the four raw-banked batteries, steady-state windows (cycles
1–2, both directions): **6 of 104 cured windows** carry a task over 150 ms (worst frames 198.6 /
206.3 / 226.7 / 238 / 282.6 / 291.7 ms) against **0 of 104 base windows**, whose chain had
already burned itself inside the first entry. Medians are unmoved. Slicing the pose is on the
charter's REFUSED list, so this is a placement question.

**Leg (b), the wordmark — SMALLER THAN ROUND 1 CONCEDED (`verify-r2` findings 4 and 5).** Its
own four-pose warm (4 encodes at the gallery identity, ~1.2–3 ms each) lands past the quiet
window and can therefore arrive inside the NEXT fold's window. Pooled, 9 runs per arm:

| where the wordmark's late warm lands | base | cured |
|---|---|---|
| past 1,160 ms in the cycle-0 ENTRY window | **6 of 9** | 3 of 9 |
| past 1,160 ms in the cycle-0 EXIT window | 0 of 9 | 9 of 9 |
| inside the cycle-1 ENTRY window | 0 of 9 | **5 of 9** |

Round 1 quoted one battery ("1 of 3 runs here"); the pooled rate is 5 of 9, and the base arm
lands its own late warm past the same line in 6 of 9. No frame moves with it in either arm
(cycle-1 entry worst 57.5 → 52.7 ms pooled, inside spread), and the session's total encode count
is unchanged; what changes is which window pays. **The chair's ruling, not the code's** — but it
is a ruling about placement between two arms that both defer, not about a cost the base does not
carry.

## 5. THE CHARTER'S ACCEPT CLAUSES, REPORTED AGAINST (`verify-r2` finding 2)

The charter asks for three things. **One is reached; two are not; and the number this cure moved
is not the one G2 quotes.** Stated plainly, because the Accept clause is the chair's decision
surface.

**Clause 1 — "bakes per fold 0 (first fold included; if the first still bakes, say why and how
many)". NOT REACHED.** The cured first fold bakes **4 logo encodes on the entry** (9 of 9 runs,
310–350 ms) plus **4 `posePaints` probe `drawImage`s per direction**, and the probe fires forever
on every fold in both arms. Why the four: the gallery pose really changes the capture box, so it
is a LEGITIMATE re-key — the case the charter itself says must be cured by pre-warming that
identity, never by suppressing the bake. §6 is that pre-warm, designed and not shipped, with the
measurement that says its number does not move here. Steady-state folds bake 0 logo encodes in
the base arm and, in the cured arm, carry the relocated warm's 4 in 5 of 9 runs (§4).

**Clause 2 — "worst frame at 4× within the glide's p95 (≈ 9–17 ms)". NOT REACHED.** The cured
cycle-0 entry worst is **87.5 ms** (68.2–117) pooled, not 9–17. What does sit in that band is
the window's p95: 10.3 ms cured against 16.8 base. And the frame G2 budgets at 57.7 ms is the
STEADY-STATE fold's, where this cure moves nothing: base cycle-1 entry worst 57.5 (40–68.3) →
cured 52.7 (43.9–68.3), inside spread, against G2's quoted 57.7. The residue there is the deck's
+558-node mount and the killed board mover — W7 §13's, not this cure's.

**Clause 3 — "a label change still bakes 4". REACHED, and measured by name for the first time**
(`attrib/label-change.mjs`, `fix-r2/LABEL.txt`). In the gallery the masthead names the snapped
card, so an ArrowRight on the deck is a real label change on a live wordmark. 9 label changes per
arm, 3 runs each, interleaved, 0 tainted: **4 live encodes at the new key at 41–98 ms in 9 of 9
snaps on BOTH arms**, `poseCount` 4 in every key, `probe24` 4 in every snap. The cure does not
touch the live bake. The same census proves the cure's attribution a third way, on a surface that
is not a fold: the warm round that follows moves from 309–488 ms (base) to **1,168–1,253 ms**
(cured), 9 of 9 — exactly `GESTURE_QUIET_MS` past the keypress.

**THE NUMBER THAT MOVED IS NOT G2's ROW.** G2 quotes the steady-state fold (entry worst 57.7 at
253–284 ms; exit 42.5–68), and this cure leaves that inside spread. What moved is the **first**
fold — the same instrument, the same regime, a window G2 did not quote: 38 of 38 base windows
carrying a >150 ms task to 0 of 38, and 81 → 108 fps. The chair should read the cure on that
mark or not at all.

## 6. π AND THE MUST-NOTS

Re-run in repair round 2 on this tree, cured dist served on :4253 (`fix-r2/pi-and-gates.sh`):

- Goldens: `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253 npx playwright test --config
  playwright-golden.config.ts` — **4 passed, exit 0**, no `--update-snapshots`
  (`fix-r2/golden.txt`).
- The three specs that assert over the BUILT dist — `filter-census` (both engines; it is what
  holds `filterBudget` at 9), `wordmark-integrity` (WebKit, over the baked pose bitmaps) and
  `theme-bake-freshness` (both engines): **38 passed, exit 0** (`fix-r2/e2e-bake-surface.txt`).
- The gallery and masthead surface, both engines, through `playwright-c05.config.ts` (webServer
  dropped, baseURL → :4253): **124 passed, exit 0** (`fix-r2/e2e-surface.txt`).
- Gates, bare, each with its own exit code (`fix-r2/gates.txt`): `test:unit` **0** (Test Files
  66/66 · Tests 810/810) · `lint:eslint` 0 · `lint` 0 · `lint:knip` 0 · `lint:boundary` 0 ·
  `lint:tdz` 0 · `lint:copy` 0 · `lint:live-regions` 0 · `lint:motion` 0 (34 specs) ·
  `typecheck:e2e` 0 · `typecheck:node` 0.
- Same stack, by construction and by census: the cure changes no capture input. Both arms bake
  `logo-sudoku-l-205|2|382.5x112|4` and `…|2|277x81|4`, and boot is **33 bakes with the identical
  split** — `{celestial 17, grid 12, logo 4}` in 6 of 6 runs of this round, both arms.
- `filterBudget` 9 (`filterBudget.ts` is not in the diff — the diff is one file); pose count 4 in
  every logged key of 18 identity runs and 18 label snaps; no bake dropped, no boil thinned, no
  filter removed, no transition shortened, no DPR lowered, no `cacheKey` theme-stripped.
- Nothing from the charter's REFUSED or REFUTED lists, checked by name.
- The seam is in the cured bundle and absent from the base one, grepped over HTTP on both ports:
  `Oi=Je.chromeLeaveMs+Je.boardFoldMs+Je.cardStepMs` — cured 1 hit, base 0.
- The round-2 source change is the comment block in `rasterPose.ts` only. The build strips
  comments: the rebuilt cured bundle is **byte-identical** to the one every number above was read
  on (`cmp` over HTTP, md5 `c948750838e611b5e13a404799573632` before and after).

## 7. WHAT DID NOT LAND

The charter's named cure for a legitimate re-key — **pre-warm the gallery identity before the
fold** — was designed and NOT shipped, because its number does not move on any instrument
available here. The warm chain cannot reach the wordmark before a fold taken at board-ready +
2,000 ms: `BOOT_CENSUS_MS` releases it at 3,000 ms and four 1,272² grid poses stand in front of
it, so the wordmark's gallery stack would land at ~4.5 s against a fold at ~3.4 s. Shipping it
would add four idle encodes for a row that reads "inside spread". It also needs the alternate
box, which no component owns today: `--logo-scale: 0.72` is `App.vue`'s CSS and the wordmark
cannot read a scope it is not in. The clean form is one token (`.board-group {
--logo-scale-alt: 0.72 }`, consumed by the gallery rule so the literal stays single) plus a
second `usePosePrewarm` on the logo handle, which self-cancels in the gallery because there the
alternate IS the live identity. Left for the chair with its measurement, not with an argument.

Also unshipped, and for the same reason: latching the capture box across the glide and re-keying
at settle — `App.vue` already declares that design ("one re-bake at settle") — moves the four
encodes from ~310 ms to ~750 ms, which is still inside the 1,100 ms window A7 grades. It changes
where the bake sits in the motion, not what the instrument reads.

## 8. THE TWO REPAIR ROUNDS — WHAT WAS RE-RUN AND WHERE IT SITS

Neither verdict owed a code change and neither reset the cure; `rasterPose.ts`'s seam is
untouched since `c003c1d0`. Both rounds re-measured rather than argued.

- **Round 1** (`verify-r1/VERDICT.txt`, three documentary counts): `fix-r1/battery.sh` +
  `topup.sh` (6 + 6 interleaved windows, three attempts retried after the instrument lost its
  browser under host load — those produced no reading and are named in
  `fix-r1/raw/c4x-desk/console.txt`), `fix-r1/STATS.txt`, `fix-r1/summarize.mjs`,
  `fix-r1/identity.sh` + `IDENTITY.txt` (3 + 3 capture-identity runs).
- **Round 2** (`verify-r2/VERDICT.txt`, five counts): `fix-r2/battery.sh` — one sequential run of
  three censuses, 6 + 6 frame windows, 3 + 3 identity runs, 3 + 3 label-change runs, all 24 exit
  0, 0 tainted — plus `fix-r2/pool.mjs` (per battery AND pooled, so "disjoint" survives or does
  not), `fix-r2/encodes.mjs`, and the new instrument `attrib/label-change.mjs`. Banked:
  `fix-r2/STATS.txt`, `fix-r2/ENCODES.txt`, `fix-r2/LABEL.txt`, `fix-r2/golden.txt`,
  `fix-r2/e2e-bake-surface.txt`, `fix-r2/e2e-surface.txt`, `fix-r2/gates.txt`, `fix-r2/load.txt`.

Every number in this file is chromium at 4× on desk 1280×800 dpr 2 unless it says otherwise. It
is a proxy, not a device claim: no real Safari, no iOS, no `osascript`, no perf-rig script was
used (M19). The device closes each budget through 8.3.
