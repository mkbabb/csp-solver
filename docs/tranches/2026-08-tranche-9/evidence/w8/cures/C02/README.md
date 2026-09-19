# C02 — PRE-WARM THE OTHER THEME'S STACKS AT IDLE · LANDED ON BRANCH

2026-09-18 · track `bake`, worktree `.claude/worktrees/w8-bake`, branch `w8/bake` ·
preSha `854b562b` (C01's last fix) · cure `84a4ad45` · library `617720b` on `pencil-boil` `t9-w8`.

    BASE ARM   AUDIT: build-identity — dist entry index-DOFGihfY7ZtC.js · index.html md5
               7241f47bba33881658ad9e63061fa9e3 · 43 files / 807.4 KB      (C01 at 854b562b)
    CURED ARM  AUDIT: build-identity — dist entry index-BtBRoiyMlXuV.js · index.html md5
               451155dd6cc88b523bd75d57723fb788 · 43 files / 810.9 KB      (C02 at 84a4ad45)

Both arms served from the worktree's `web/frontend` by `vite preview`, base on :4252 and cured
on :4253, identity printed at both ends of every reading set. The committed HEAD rebuilds to
the cured identity above, so the arm measured is the arm committed. Up to ten sibling agents
measured on this host throughout; `sysctl -n vm.loadavg` is stamped at both ends of every set
and sits in each set's log. Readings are interleaved b,c,b,c…, one window per invocation.

The library is NOT the registry's: `node_modules/@mkbabb/pencil-boil` is 0.12.1 from the local
pack (`dist/vue.js` md5 `aa27f230ef7f7dce4ddbb594ae00fe7f`; the registry 0.12.0's is
`e4527557bd917949724aeca81b06ae46`). `package.json` / `package-lock.json` are untouched on the
branch — the version bump rides the chair's release.

## 1. The cure

The theme token is in both theme-keyed surfaces' `cacheKey`s, so the first flip to a theme the
page has not shown MISSES the stack cache and bakes four 1272² grid poses and four wordmark
poses inside the gesture. Nothing about that bake is wrong. It is LATE. So the same eight are
bought at idle, under the identity the flip will look up, and the first flip becomes the cache
hit the second one already is.

**The seam is the library's, and it had to be.** The cache is per-surface-instance and private;
the only route to it from the app is the reactive `opts`, which would drive the LIVE handle
through a foreign identity (nulling its `urls`, landing the other theme's stack on the rendered
surface) and would still bake all four poses in one burst, because `useRasterStack`'s `bake()`
is atomic per stack — the charter's "ONE pose per idle callback" is unreachable from outside.
The one app-side alternative, a theme-independent `cacheKey`, is on the charter's REFUSED list.
So `pencil-boil` 0.12.1 adds `RasterStackHandle.prewarm(alt, beforePose?)`: it files a stack
under an alternate identity **without touching `urls`, `ready`, the live key or the bake
token**, one pose per call of the caller's clock, revoking everything it minted if the warm is
abandoned — and the cap may no longer evict the entry the surface is RENDERING.

**The other theme's ink is read off a probe, not off the document.** A shallow clone of the real
element inside an off-screen wrapper, created and torn down inside one synchronous task (no
`await`, so no query from outside — this app's or its rig's — can ever see a second
`.handwritten-logo` in the page). The clone is there because a value arrives by either route:
`--grid-line-color` is INHERITED (the wrapper supplies it) and `color` comes from a rule that
matches the element itself (`.handwritten-logo { color: var(--color-foreground) }`).

The two directions are NOT symmetric, and that is the part a reading would get wrong:

- dark: the wrapper carries `class="dark"`, and nothing else is needed.
- light: NOT its absence. Under `<html class="dark">` an unclassed wrapper INHERITS the dark
  ladder. The light wrapper re-declares, inline, every custom property the document's own
  `:root` / `:host` rules declare — 116 declarations, 4,957 B — honouring each conditional
  group's condition: `@media print` sets `--grid-line-color` black for `:root, .dark` at once,
  and a collector blind to that reads the printed board's ink (`#000`) as the light theme's.

Spiked before a line of the cure was written (`probe-spike.txt`, the built dist, booted light
AND booted dark): the probe's value equals the value a REAL flip produces, per surface, per
direction, **8 of 8**, and the filter defs serialize byte-identical across a flip.

**When.** After the board is drawn, after EVERY baked surface has admitted its first stack (the
boot round is over — each one registers through `retainedPoseUrls`, so the count is exact),
one pose per `requestIdleCallback` with no timeout, on one app-wide queue. Abandoned by any
gesture — `click` included, because a scripted `element.click()` fires no `pointerdown` — or by
the theme flipping underneath it.

It is upside-only in every regime but one, and that one is named in §4.

## 2. The numbers

B2's mark is `N1 − median(N2..N4)` click→settle, with `N1 bakes == 0`. Instrument: A5's banked
`toggle-probe.mjs`, copied VERBATIM into `instr/` (md5 equal to the lane's) — **only `--port`
differs between the arms**. `toggle-stats.mjs` prints each arm's own spread beside its median.

| regime (engine · CPU · link · cache · viewport · dpr) | windows | base delta | cured delta | Δ | N1 bakes | outside both spreads |
|---|---|---|---|---|---|---|
| chromium · 4× · Fast-3G · cold · desk 1280×800 dpr2, **warm landed** | 6 of 10 cured | **1,428.3** | **25.3** (−80.4–374.6) | **−1,403.0** | 8 → 0 | YES (categorical on bakes) |
| chromium · 4× · Fast-3G · cold · desk dpr2, **warm missed** (host load ≥ 15) | 4 of 10 cured | 1,428.3 | 1,513.7 | +85.4 | 8 → 5 | the residue of §4 |
| chromium · 4× · Fast-3G · cold · mobile 390×844 dpr3 | 3+3 | **903.7** (811.7–935.1) | **286.7** (16.5–296.6) | **−617.0** | 8 → 0, 3/3 | YES |
| chromium · 1× · unthrottled · cold · desk dpr2 | 3+3 | **343.8** (343.5–346.2) | **0.0** (0.0–0.0) | **−343.8** | 8 → 0, 3/3 | YES |
| chromium · 4× · Fast-3G · cold · desk dpr2, **booted DARK** (the light direction) | 3+3 | **1,112.8** (1,085.7–1,114.1) | **24.8** (23.1–364.0) | **−1,088.0** | 8 → 0, 3/3 | YES |
| webkit · unthrottled, NO CDP · cold · desk dpr2 | 3+3 | **296.0** (295.0–308.0) | **37.0** (37.0–40.0) | **−259.0** | 8 → 0, 3/3 | YES |
| chromium · 6× · Fast-3G · cold · desk dpr2 | 3+3 | 2,529.8 (1,829.6–2,696.7) | 2,808.8 (2,800.6–2,844.1) | **+279.0** | 8 → 9 | YES — §4 |

The whirl, same windows — the Bloom stops being starved:

| regime | base frames / worst frame | cured frames / worst frame |
|---|---|---|
| chromium 4× desk dpr2 (warm landed) | **0** / 208.4 ms | **91** / 79.7 ms |
| chromium 4× mobile dpr3 | 32 / 148.0 ms | **100** / 50.2 ms |
| chromium 1× desk dpr2 | 98 / 116.7 ms | 130 / 9.4 ms |
| webkit desk dpr2 | 49 | 64 |
| booted dark, chromium 4× desk | 5 | 94 |

The refuter's lens (`refute/A5/critpath-ablate.mjs --mode live`, VERBATIM, 3+3, chromium 4× ·
desk dpr2 · cold) on G1's companion mark — the background repaint the flip holds:

| arm | N1 classFlip | N1 bgPaint | N1 bakes | N2 bgPaint |
|---|---|---|---|---|
| base | 30.7 ms | **383.0 ms** (381.3–387.6) | 8 | 24.2 ms |
| cured | 39.4 ms | **135.5 ms** (128.0–161.3) | 0 | 23.8 ms |

−247.5 ms, disjoint. The residue is named: the first flip's repaint is still ~110 ms longer
than the steady state's with zero bakes — first-time invalidation of the dark ladder, not a
bake, and it belongs to G8's row rather than this one.

**Row G8, re-read as the charter asks.** The `UpdateLayoutTree` the whirl carries, per
invocation, chromium 4× · desk dpr2, 5+5:

| arm | N1 | N2 | N3 | N4 |
|---|---|---|---|---|
| base | 86.0 ms / 48 elements / **3 whirl frames** | 256.6 / 105 / 97 | 272.5 / 109 / 99 | 283.4 / 104 / 96 |
| cured | 277.2 / 102 / **92** | 276.4 / 109 / 100 | 282.2 / 108 / 99 | 266.4 / 108 / 100 |

The +191 ms on N1 is not a cost the cure added: the base arm's N1 restyle is TRUNCATED because
the whirl never ran (3 frames of ~100). With the bakes gone, N1 restyles exactly like N2, N3
and N4. G8's long frame is what remains, unchanged and now the top item on that surface.

## 3. π

**Goldens: 4 passed, exit 0**, `playwright-golden.config.ts` against the cured dist
(`gates.txt`). No `--update-snapshots`, ever.

**Per-pose bitmap digests: identical.** `instr/pose-hash-toggle.mjs` is C01's π instrument with
ONE thing added — after the settle it clicks the theme toggle — which is what makes the arms
comparable: in the base arm the other theme's eight poses are encoded BY that click; in the
cured arm they were encoded at idle before it. Each surface's LAST round is therefore the other
theme's stack in both arms. 3+3 windows, chromium 4× · Fast-3G · cold · desk dpr2, 24 encodes
per window in both arms, 0 tainted:

    grid  base r2 t0 9,866→11,607 (inside the gesture)  [95f54de5 a885e347 e3829e30 6fe33241]
    grid  cured r2 t0 5,928→ 7,400 (at idle)            [95f54de5 a885e347 e3829e30 6fe33241]
    logo  base r2 t0 9,694→11,415                       [71c256fa 46eda3c1 1f52e7c7 1f5350de]
    logo  cured r2 t0 5,714→ 5,905                      [71c256fa 46eda3c1 1f52e7c7 1f5350de]

`pi-compare.mjs` exit 0 on all four surfaces — the celestials carry no theme token and are
untouched (4 encodes, identical). **π: HOLDS.** `filterBudget` 9 and pose count 4 are
untouched; no bake dropped, no boil thinned, no filter removed, no transition shortened.

## 4. WHAT IT COSTS — reported, not buried

**One warm pose can be in flight when the gesture arrives, and an encode is atomic.** The warm
stands down at the next pose boundary, so the residue is bounded at ONE pose — but one pose is
not nothing where poses are expensive:

- chromium **6×** · Fast-3G · desk: N1 bakes 8 → **9**, delta 2,529.8 → 2,808.8 (**+279 ms**,
  disjoint). The extra encode is visible in the raw census as a wordmark bake whose start is
  NEGATIVE relative to the click (−76, −242, −271 ms in the three windows): it began before the
  tap and finished after it. At 6× the boot round runs so long that the warm has only reached
  its first pose when the probe taps at board-ready + 3.5 s, so it contributes nothing and costs
  one encode. Before `click` joined the gesture list and the identity check was added, the same
  cell read **+874 ms** — the warm and the gesture encoding the same eight poses side by side.
- The same residue is what the 4 of 10 desk windows at host load ≥ 15 show (+85 ms), and what
  one of three cured drawer windows shows (below).

**TBT(3000) at mobile dpr3 moves, and it is the one budget row this cure worsens.** A6's banked
`readiness-timeline.mjs`, VERBATIM, 4+4 interleaved:

| cell | mark | base | cured | verdict |
|---|---|---|---|---|
| desk-cr-4x-f3g-cold (dpr **1**) | boardReady | 1,412 [1,395–1,707] | 1,425 [1,409–1,641] | inside the spread |
| | **boardDrawn** (`firstBoilTick`) | 2,186 [2,183–2,981] | 2,245 [2,234–2,729] | inside the spread |
| | **TBT(3000)** | 170 [147–650] | 187 [176–507] | inside the spread |
| | controlsInteractive | 70 [59–79] | 63 [57–128] | inside the spread |
| mob-cr-4x-f3g-cold (dpr 3) | boardReady | 1,388 [1,379–1,401] | 1,407 [1,386–1,728] | inside the spread |
| | **boardDrawn** | 2,561 [2,556–3,682] | 2,568 | inside the spread |
| | **TBT(3000)** | **550.5 [544–567]** | **662 [650–1,329]** | **DISJOINT, +111.5** |

Reproduced three times across three builds of this cure (+97, +90, +111.5), so it is the
mechanism and not the host. The mechanism is exact, from the encode census at that pose
(`raw/pi/cured-c4x-mob-probe.jsonl`): at dpr3 the boot round ends at 2,474 ms, the warm starts
at 2,746, the wordmark's four poses run 2,746→2,872 and the grid's first lands 2,888→3,777 — so
about 238 ms of encode falls inside a census window that closes at 3,000 ms. It is idle work,
after the board is drawn, on a page that is ready; TBT(3000)'s window is fixed to
navigationStart and counts it anyway.

Two gates were tried and are recorded because they FAILED in instructive ways. Arming on
`boardDrawn` + a timer alone put the first pose at 2.9 s (+97 ms TBT, the first reading).
Requiring `IdleDeadline.timeRemaining() >= 25 ms` per pose pushed the WHOLE warm from 3.1 s to
5.7 s at chromium 4× desk — because an instrument, or an app, holding a `requestAnimationFrame`
chain caps every idle slice at the gap to the next frame — and the warm then finished after the
probe's tap and bought nothing (n1Bakes 8 in three regimes). The gate that shipped is the fact
itself: every baked surface has admitted its first stack.

**GATE D is unmoved.** `perf-rig/ci-subset.mjs` (no `--build`), 2 runs per arm interleaved,
`--dist dist-base` / `--dist dist`, port 4254:

| run | arm | boot TBT median | ceiling | GATE D | GATE A / B / C |
|---|---|---|---|---|---|
| 1 | base | 194 ms (194–219, 6 tasks) | 1,750 | PASS | PASS / PASS / PASS |
| 1 | cured | 251 ms (249–381, 10 tasks) | 1,750 | PASS | PASS / PASS / PASS |
| 2 | base | 256 ms (190–288, 6 tasks) | 1,750 | PASS | PASS / PASS / PASS |
| 2 | cured | 226 ms (225–252, 10 tasks) | 1,750 | PASS | PASS / PASS / PASS |

Four more tasks, each short: that is one pose per idle callback working. 11–15 % of budget in
both arms, WebKit NOT MEASURED (no `longtask`), exactly as it was.

**The drawer's first gesture, with the pre-warm in flight** (A4's `drawer-trace.mjs` VERBATIM,
chromium 6× · mobile 390×844 **dpr 1** — A4 sets no scale factor, the gap its own §15 records —
3 windows × 3 cycles, interleaved):

| arm | gesture | dir | worst (median) | spread | long33 | long50 |
|---|---|---|---|---|---|---|
| base | FIRST | open | 49.2 | 49.1–50.7 | 1 | 0 |
| cured | FIRST | open | 50.2 | 49.1–**66.9** | 1 | 1 |
| base | steady | open | 24.9 | 16.7–33.4 | 0 | 0 |
| cured | steady | open | 24.6 | 16.7–33.7 | 0 | 0 |

No worse on the median (+1.0 ms, inside the spread) and unmoved in steady state; one of three
cured windows carries a 66.9 ms open frame against the base's worst of 50.7 — the same single
in-flight pose. The drawer's tab click fires a real `pointerdown`, so the warm stands down; what
it cannot do is un-encode the pose already in the canvas.

## 5. Gates, run bare in the worktree, exit codes as read

| gate | exit | note |
|---|---|---|
| `npm run test:unit` | 0 | **Test Files 66 passed (66)** · **Tests 810 passed (810)** |
| `npm run lint:eslint` | 0 | |
| `npm run lint` | 0 | prettier; `rasterPose.ts` was formatted before the commit |
| `npm run lint:knip` | 0 | |
| `npm run lint:boundary` | 0 | |
| `npm run lint:tdz` | 0 | |
| `npm run lint:copy` | 0 | no user-readable string added |
| `npm run lint:live-regions` | 0 | |
| `npm run lint:motion` | 0 | |
| `npm run typecheck:e2e` | 0 | |
| `npm run typecheck:node` | 0 | |
| `vue-tsc --noEmit -p tsconfig.json` | 0 | no `.at()` |
| goldens (cured :4253) | 0 | 4 passed |
| `playwright-throttle.config.ts` → cured :4253 | 0 | **67 passed** — filter-census, wordmark-integrity, theme-bake-freshness, theme-quadrants, throttled-void, both engines |
| default-suite surface specs, both engines → cured :4253 | 0 | **126 passed** (gallery incl. CH-67, masthead-alignment, font-census, visual-regression, affordances, drawer) |

The surface set red ONCE per run at 9–12 workers, on two different WebKit rows
(`drawer.spec.ts:394` `scrollHeight 500 > 500`, then `masthead-alignment.spec.ts:112` — a
NEGATIVE CONTROL that injects the superseded head CSS and asserts a misalignment > 0.5 px, and
read 0). Both pass 3 of 3 isolated against the CURED arm, and the whole set passes 126/126 at
4 workers; the base arm passed the same set at the same parallelism. Load flakes on a host
carrying ten sibling agents, named here rather than swept.

## 6. The library change

`git -C .claude/worktrees/pencil-boil-t9 log`: `617720b` (the cure) on `93075fd` (a revert,
explained below) on `v0.12.0`. Local only — never pushed, never published, no tag.

- **`93075fd` reverts `3db66cf`**, a library-side font gate an earlier link left on this branch
  and did NOT land: C01's cure is app-side and is committed against the STOCK 0.12.0 package.
  Carrying the library twin as well would gate the same round twice in two places with only one
  of them measured. The branch is v0.12.0 exactly at that point (`git diff v0.12.0` empty).
- **`617720b`** adds `prewarm` to `RasterStackHandle` (+ the cap's `protect` rule), 15 new
  assertions as arms (i)–(n) of `raster-stack-cache.proof.ts`, the CHANGELOG entry, and the
  version 0.12.0 → **0.12.1**.
- `npm test`: **265 assertions passed**, package boundary `terminal: CLEAN` at 0.12.1, three
  `tsc` module resolutions (Bundler / Node16 / NodeNext) exit 0.
- Tarball: `.claude/worktrees/pencil-boil-t9-packs/mkbabb-pencil-boil-0.12.1.tgz` (38,700 B).

API delta, additive only:

    prewarm(alt: RasterStackOptions, beforePose?: (pose: number) => boolean | Promise<boolean>)
      → Promise<'hit' | 'warmed' | 'abandoned' | 'declined'>

## 7. Held for the device, and what did not land

- **The hold-through-the-whirl fallback is NOT taken.** The charter says a cache miss at toggle
  time (DPR or box changed since boot) needs W7's written acceptance before a retained stack may
  ride the whirl. It has none, so the miss path is exactly what ships today: the library bakes
  inside the gesture. **A W7 ask, recorded and not exercised.**
- **Real Safari and iOS are forbidden here (M19).** Every number above is a proxy: Playwright
  chromium under CDP throttle, or Playwright WebKit unthrottled with no CDP, no CPU rate, no
  link shaping and no `longtask`. No WebKit number is a Safari number and none is an iOS claim.
  B2's shape (`≤ 150 ms` proposed) is SET from the device, through 8.3.
- **Not taken:** `A6/toggle-and-trace.mjs` (the 436 ms first-toggle blocking companion at mobile
  dpr3) — the session ran out of host before it; the mark it reads is the one `n1LongTaskMs` and
  `bgPaintMs` above bracket. The warm cell (`--warm`) was not re-taken on the committed arm
  either; 8.1 records the flip costs the same warm (1,233.9), and nothing in this cure is
  HTTP-cache-sensitive.
- **The 6× cell and the mobile TBT(3000) row are the two places the chair has a decision**: the
  residue is one in-flight pose, and the only ways to zero it are to warm later (which at 4×
  desk pushes the warm past a tap at board-ready + 3.5 s and buys nothing) or not to warm on a
  machine this slow (which needs a device-class judgment this session cannot make).

## 8. Files

Cure, in the worktree:

- `web/frontend/src/pencil/composables/rasterPose.ts` — the probe (`resolveThemedCssValue`, the
  light ladder), the warm's clock (`usePosePrewarm`, `markBoardDrawn`, the boot-round count),
  and the registration inside `retainedPoseUrls`.
- `web/frontend/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue` — the ink becomes a parameter
  (`gridPoseSvgInked`), `gridCacheKey`/`gridDpr` are shared by both paths, `boardDrawn` is
  stamped where the baked stack becomes the rendered layer, and the warm is armed.
- `web/frontend/src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue` — the same two moves
  (`logoPoseSvgInked`, `logoCacheKey`) and the warm.

Library, in `.claude/worktrees/pencil-boil-t9`: `src/vue.ts`, `proofs/raster-stack-cache.proof.ts`,
`CHANGELOG.md`, `package.json`.

Instruments, all in `instr/`: `toggle-probe.mjs`, `toggle-and-trace.mjs`, `critpath-ablate.mjs`,
`readiness-timeline.mjs`, `summarize-readiness.mjs`, `drawer-trace.mjs` (all VERBATIM copies of
the banked 8.1 originals — only `--port` / `--base` differ), `pose-hash.mjs` + `pi-compare.mjs`
(C01's), `pose-hash-toggle.mjs` (C01's plus the flip), `probe-spike.mjs` / `probe-spike2.mjs`
(the seam spike), `interleave.sh`, `interleave-readiness.sh`, `toggle-stats.mjs`,
`playwright-cured.config.ts`.
