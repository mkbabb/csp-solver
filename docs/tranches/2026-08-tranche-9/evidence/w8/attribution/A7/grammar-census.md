# A7 — THE GALLERY'S IN AND OUT: the grammar census

T9-W8 §8.1, attribution only. HEAD `58014efd`. Dist fixed by the chair: entry
`index-9rZPzI5DEcpe.js`, `index.html` md5 `fa3d1af9870916cc728de11e97f57a90`, 43 files /
806.1 KB — verified identical on disk and served before and after every reading. Served by
`vite preview` on **:4256** (assigned :4255 was held by another process; next free in band,
`--strictPort`). Host load printed at each reading set; every number names its engine,
throttle, viewport and cache state. This is a DESCRIPTION of what the transition is today,
not a design — W7 §13 writes the design.

**board-ready** (the one W8 definition): `.board-group` visible (it is `v-show`n) AND the
first `.cell`-class element's rect non-zero AND one rAF after that. Chromium 1× desk warm:
**464.6 ms** from navigationStart (`frames-chromium-1x-desk.jsonl` head).

---

## 1. ENTRY — playing → gallery (`enterGallery`, App.vue:606)

Sequenced in three beats. Every row measured from `document.getAnimations()` sampled on a
timeline (`fold-frames.mjs`, `animCensus`) and from `Element.animate` interception
(`mover-census.mjs`).

| # | element | property | duration | easing | delay / trigger | defined in |
|---|---|---|---|---|---|---|
| B0 | `.scene-controls` | `opacity` 1→0 | 200 ms | `cubic-bezier(0.32,0,0.67,…)` (`--ease-fadeOut`) | at keypress; `html.gallery-leaving` | CSS — `games/shared/scene.css:627` |
| B1 | `.board-peek-host` | `transform` (translate+scale 2.105→1) | 520 ms | `cubic-bezier(0.32,0.72,0,1)` (the one glass curve) | +200 ms (`setTimeout MOTION.chromeLeaveMs`) | WAAPI — `useFlipGlide.run`, App.vue:553 |
| B1 | `.logo-menu` (wordmark) | `transform` (translate+scale 1.546→1) | 520 ms | same curve, same `startTime` | same clock as the board | WAAPI — `mastheadMover`, App.vue:567 |
| B2 | 4 flank `.game-card-deal` | opacity + lift, 0→1 | 350 ms (`DRAW_IN_PRESETS.gridFrame`) | `easeOutCubic` | base `520×0.42 = 218 ms`, then **90 ms per slot outward** | pencil-boil `createSequenceSubscription` — GameGallery.vue:370 |
| — | `.game-card` depth pose | `transform`,`opacity` | 440 ms (`--card-step-ms`) | `--ease-glassGlide` | on snap only — at rest during entry | CSS — GameCard.vue:410 |

Measured onset of B1: **205–222 ms** after the keypress (chromium), **223–236 ms** (webkit).
Total choreography ≈ 200 + 520 = **720 ms**, plus the deal's tail to ~**790 ms**.

**Three clocks run this one gesture**: CSS transition (B0), WAAPI (B1), pencil-boil rAF
sequence (B2). They agree here only because B2's delay is hand-derived from B1's duration
(`Math.round(MOTION.boardFoldMs * 0.42)`) — a literal coupling, not a shared clock.

## 2. EXIT — gallery → playing (`unfoldToBoard`, App.vue:639)

| # | element | property | duration | easing | delay / trigger | defined in |
|---|---|---|---|---|---|---|
| — | `.board-peek-host` | `transform` (scale 0.520→1) | 520 ms **declared** | glass curve | at keypress, in `nextTick` | WAAPI — `runFold`, App.vue:584 |
| — | `.logo-menu` | `transform` (scale 0.647→1) | 520 ms | glass curve, same clock | at keypress | WAAPI — `runFold` |
| — | `.game-gallery` (whole deck) | `opacity` 1→0 | 200 ms | `--ease-glassGlide` | at keypress | CSS — `<Transition name="gallery-fade">`, App.vue:1141 |
| — | `.scene-controls` | `controls-fade-in` opacity 0→1 | 250 ms | `linear`, **150 ms delay** | on the scene's re-render | CSS — scene.css:611 |
| — | `.washi-label`, `.action-bar` | `opacity` | 150 ms | `ease` | at keypress | CSS (component-local) |

### THE UNDEFINED PARTS — what the census actually found

1. **The board's unfold does not happen.** Its 520 ms mover is created and then
   **`finish()`ed 0.2–0.4 ms later**, every cycle, so the board is an INSTANT SWAP while the
   wordmark glides 520 ms beside it. This is the "fight between two animations" in the mark,
   and it is a correctness defect, not a curve: `fold-geometry.mjs` reads the board's rendered
   width flat at 640 px (desk) / 366 px (mobile) for the whole window — **`NO TRAVEL`, 3/3
   cycles, chromium desk + chromium 4× mobile + webkit desk**, against a clean `GLIDE`
   (640→304 px over 45 distinct widths) on entry. Mechanism in §3.
2. **Asymmetric sequencing.** Entry SEQUENCES its beats (chrome out, then fold). Exit runs
   everything CONCURRENTLY from frame 0 — the deck dissolving over 200 ms, the controls
   fading in over 250 ms after a 150 ms delay, the wordmark gliding 520 ms. There is no
   beat-0 on the way out.
3. **No un-deal.** Entry deals four flanks IN on a 90 ms outward stagger. Exit has no
   counterpart: the whole deck takes one flat 200 ms `opacity` with no stagger and no
   per-card motion. The gesture is not reversible in its own vocabulary.
4. **Three easing vocabularies in one exit**: `--ease-glassGlide` (deck), `linear`
   (controls-fade-in), `ease` (washi-label, action-bar). `linear` and bare `ease` are
   defaults, not choices.
5. **The controls' return overshoots the fold.** `controls-fade-in` is `250 ms linear 150 ms`
   = settles at 400 ms; the wordmark settles at 520 ms. The chrome lands before the gesture
   that carries it finishes.

## 3. THE MECHANISM — why the board cuts on the way out

`mover-census.mjs` wraps `Element.animate`, `Animation.finish`, `Animation.cancel` and
`Element.getAnimations({subtree:true})`. One exit, chromium desk (`movers-chromium-desk.jsonl`):

```
SWEEP:board-peek-host @0.8ms     <- moveLiveBoard(null) snapshot   (unfoldToBoard, App.vue:645)
SWEEP:board-peek-host @4.2ms     <- its restore, nextTick          (nothing in flight, no-op)
SWEEP:board-peek-host @8.3ms     <- a SECOND moveLiveBoard(null) snapshot (the deck's unmount)
board-peek-host       @8.3ms/520ms  <- runFold creates the board mover
logo-menu             @8.3ms/520ms  <- ...and the wordmark mover, same clock
SWEEP:board-peek-host @8.4ms     <- the second restore
FINISH:board-peek-host @8.7ms    <- restoreBoardAnims finishes the fold's OWN mover
CANCEL:board-peek-host @522.4ms  <- the settle, on an animation that ended 514ms ago
CANCEL:logo-menu      @522.5ms   <- the wordmark, which actually ran
```

`restoreBoardAnims` (App.vue:447) is the T8-M7b cure for the Teleport's re-invented
`cell-reveal`s: it finishes every animation in the board subtree that its pre-move snapshot
did not contain. `getAnimations({subtree:true})` includes the host element itself, and the
second `moveLiveBoard(null)` takes its snapshot **before** `runFold` creates the mover and
restores **after**. The fold's own board mover is therefore always "invented by the move" by
that test, and is finished on the spot. The entry escapes only by ordering luck — there, the
fold is created in a later tick than the restore (movers at 214 ms, last sweep at 211 ms).

Two `moveLiveBoard(null)` calls per exit is the second half of it: `unfoldToBoard` parks the
board home, and the deck's unmount emits `onLiveFace(null)`, which parks it again.

## 4. FRAME CENSUS — medians of 3 cycles, the choreographed window

Entry window 1100 ms from keypress, exit 760 ms. Warm cache, unthrottled link, no tainted
windows in any set (`tainted:false` on every row). Host load 3.2–6.1 across all sets.

| engine | throttle | viewport | dir | long33 | long50 | worst | p95 | fps | bakes | longtask max |
|---|---|---|---|---|---|---|---|---|---|---|
| chromium | 1× | 1280×800 | entry | 0 | 0 | 9.4 ms | 9.0 | 120 | 4 | 0 tasks |
| chromium | 1× | 1280×800 | exit | 0 | 0 | 9.2 ms | 9.1 | 119.7 | 4 | 0 tasks |
| chromium | 4× | 1280×800 | entry | 1 | 1 | **57.7 ms** | 9.3 | 114.5 | 4 | 58 ms @205 ms |
| chromium | 4× | 1280×800 | exit | 1 | 0 | **42.5 ms** | 9.3 | 114.5 | 4 | — |
| chromium | 6× | 1280×800 | entry | 1 | 1 | **91.7 ms** | 9.3 | 109.1 | 4 | 94 ms @207 ms |
| chromium | 6× | 1280×800 | exit | 1 | 1 | **82.4 ms** | 9.3 | 107.9 | 4 | 53 ms @1.3 ms |
| chromium | 1× | 390×844 | entry | 0 | 0 | 16.8 ms | 9.0 | 119.1 | 4 | 0 tasks |
| chromium | 4× | 390×844 | entry | 1 | 1 | **58.1 ms** | 10.2 | 114.5 | 4 | 51 ms @206 ms |
| chromium | 4× | 390×844 | exit | 1 | 0 | **50.0 ms** | 10.1 | 113.2 | 4 | — |
| chromium | 6× | 390×844 | entry | 1 | 1 | **85.4 ms** | 10.2 | 110 | 4 | 80 ms @212 ms |
| chromium | 6× | 390×844 | exit | 1 | 1 | **75.7 ms** | 10.3 | 109.2 | 4 | 50 ms @42.9 ms |
| webkit | 1× | 1280×800 | entry | 1 | 0 | 35 ms | 19 | 59.1 | 4 | NOT MEASURED |
| webkit | 1× | 1280×800 | exit | 0 | 0 | 27 ms | 19 | 59.2 | 4 | NOT MEASURED |
| webkit | 1× | 390×844 | entry | 0 | 0 | 32 ms | 19 | 59.1 | 4 | NOT MEASURED |
| webkit | 1× | 390×844 | exit | 0 | 0 | 22 ms | 19 | 60.5 | 4 | NOT MEASURED |

WebKit ships no `longtask` entry type — its rows print NOT MEASURED, never 0. Playwright
WebKit is not Safari and none of these is an iOS claim.

**Where the long frame is.** Exactly ONE long frame per direction, and it is not spread
through the glide — the rest of both windows runs at p95 9–10 ms (chromium) / 19 ms (webkit).

- **Entry**: the long frame lands at **205–212 ms**, i.e. the instant `MOTION.chromeLeaveMs`
  expires and `openGallery` mounts the deck. DOM goes **1218 → 1776 nodes (+558)** in that
  one frame, and the fold's WAAPI starts on the same frame. The beat-0 delay does not cover
  the mount; it just guarantees the mount collides with the fold's first frame.
- **Exit**: the long frame is at the keypress (0–43 ms) — deck unmount, board reparent home,
  synchronous `select()` + `setGame()` state flip, all before the first painted frame.

**Bakes** (counted at `CanvasRenderingContext2D.drawImage`, which is where pencil-boil's
`raster.js:119-125` mints a bitmap): **4 per direction in steady state**, landing at 262–273 ms
on entry (chromium 4×) — i.e. ~60 ms INSIDE the 520 ms glide. The **first fold of every page
load pays 8**, in two batches (e.g. 337/348/360/372 then 441/442/443/443 ms), in all three
engines/viewports measured. That is the CH-67 shape: the `component :is` button↔span swap
re-creates the wordmark's `<svg>` on the view flip, forcing a bake tick, and the first
invocation pays it twice. A first-invocation re-bake mid-glide is the same species §8.1
predicts for the dark-toggle.

## 5. Files

| file | what it is |
|---|---|
| `fold-frames.mjs` | rAF delta census + longtask + bake count + animation-census timeline, per regime |
| `fold-geometry.mjs` | the CUT DETECTOR — per-frame rendered box of board and wordmark; GLIDE vs CUT verdict |
| `mover-census.mjs` | wraps `Element.animate` / `Animation.finish` / `.cancel` / `getAnimations` — names the killer |
| `fold-cdp-trace.mjs` | CDP `Tracing` summary — **NOT LANDED**, see below |
| `frames-*.jsonl` · `geometry-*.jsonl` · `movers-chromium-desk.jsonl` | the raws behind every number above |

Each script carries a one-line RUN header. All read a fixed dist over a running preview; none
builds.

**Not landed**: `fold-cdp-trace.mjs` returned zero trace events on two attempts
(`Tracing.start` with both a `categories` string and a `traceConfig`; `Tracing.dataCollected`
never fired under the Playwright CDP session). The per-frame Layout/RecalcStyle/Paint/Composite
split is therefore NOT MEASURED by this lane. What stands in its place is the rAF frame census
plus the chromium `longtask` census, which locate the blocking work in time (§4) but do not
split it by pipeline stage. The script is banked so the gap is re-runnable, not re-discovered.

`a7-fold-trace.mjs` and `runs/c-desk-1x.jsonl` in this directory were written at 15:26–15:28
by a process this session did not start (they reference :4255). They are left untouched and
are **not** the source of any number above.
