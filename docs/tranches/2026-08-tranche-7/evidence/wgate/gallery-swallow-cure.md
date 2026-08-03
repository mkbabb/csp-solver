# The gallery's WebKit red at `gallery.spec.ts:294` — the mechanism, and the cure

**2026-08-03 · T7-WGATE · red at `fd6a141a`, run 30806419008 shard 2, 2/2 attempts · cured on `141fdbad`**

The row: *"drag: a flick moves exactly one card; a release over the centered card selects nothing."*
It reds on its LAST step — a plain `.click()` on `#gallery-card-0` that must select, with
`.game-gallery` then at count 0. Chromium never reds it.

The suspicion carried into this work was the click swallow: the composable arms a one-shot swallow at
a drag release, WebKit natively suppresses the post-drag click, the swallow is never consumed, and it
eats the user's next legitimate press. **That is refuted below, measured on the engine that reds.**
The real defect is one millisecond wide and lives in the velocity sampler.

---

## 1. THE SWALLOW IS INNOCENT — refuted, not argued

Two independent reasons, both measured rather than reasoned.

**By reading.** `useCarouselGlide.onPointerDown` already clears the flag on every press
(`suppressClick = false`, with its own comment: *"a release that landed outside the deck can't leave
this armed"*). The listener sits on the viewport and every card is inside it, so a press on a card
disarms the swallow before its own click is dispatched. The one-shot cannot survive into a later
press by construction.

**By measurement.** A capture-phase listener registered on `.gallery-viewport` AFTER the composable's
own runs immediately after it on the same node — `stopPropagation` does not stop siblings, only
`stopImmediatePropagation` would — so `e.defaultPrevented` there IS the swallow's fingerprint. Driven
through the row's exact gesture sequence on **linux WebKit** (the engine of the red):

```
── settle-drag -20 (THE ARMING RELEASE) ──
   win-capture              click   t=13350  prevented=false  div.live-face-fit
   vp-capture-after-swallow click   t=13350  prevented=true   div.live-face-fit   ← swallowed, correctly
   >>> a click followed the drag release? true

── PLAIN CLICK on #gallery-card-0 ──
   vp-capture-after-swallow click   t=14751  prevented=false  div.live-face-fit   ← NOT swallowed
   REACHED #gallery-card-0  click   t=14751  prevented=false
```

The guarded behaviour holds (the release's own click IS eaten) and the next press passes through
untouched. On the run where the row nonetheless reds, the plain click reached the option root with
`prevented=false` and still selected nothing — so the swallow is not the cause of anything.

One WebKit behaviour the probe did confirm, and it is worth banking because it is real and was the
premise of the suspicion: **WebKit does sometimes withhold the release's click entirely** — a fast
160px flick produced `pointerdown, mousedown, pointerup` and no `mouseup`, no `click`, on darwin and
linux alike. The armed swallow then survives that gesture. It is harmless only because the next
`pointerdown` disarms it. See §6 for the one arm of that where it is NOT harmless.

## 2. WHAT ACTUALLY REDS — the lost flick

At the moment of the failing click the deck is **not on card 0**. From the failure's own ARIA
snapshot the masthead reads `futoshiki` — card 1 — and the probe's state dump agrees:

```
activedescendant=gallery-card-1   centerCards=["gallery-card-1"]   scrollLeft=352
c0_class="game-card"  (no is-center)     liveFaceIn="NO LIVE FACE"
```

The click's target is the bare option root `div#gallery-card-0.game-card` rather than the live face —
which is the *signature of a flank*, whose internals are `inert` so the hit-test resolves on the root
(`GameCard.vue`'s own note). `onCardClick` then does exactly what it is written to do:
`if (props.isActive && !props.guard) emit('select')` — a flank is not selectable. Nothing selects,
the gallery stays up, the row reds at `:316`. **The click machinery is correct throughout; the deck is
in the wrong place.**

### Why the deck is in the wrong place

Instrumented history of a red, `.gallery-viewport` sampled on every scroll and pointer event
(`ts` is the event's own `timeStamp`):

```
1018  pointerdown x=640  ts=1018   sl=352      ← the +160 flick, from card 1
1020  pointermove x=693  ts=1020   sl=351          dt=2  → under the floor, SKIPPED
1025  pointermove x=746  ts=1025   sl=298          dt=7  → under the floor, SKIPPED
1026  pointermove x=800  ts=1025   sl=245          dt=7  → under the floor, SKIPPED
1027  pointerup   x=800  ts=1027   sl=191      ← released at v = 0
1031  click                        sl=352  tx=161 ← glideTo(1): BACK to the card it came from
```

and the same push in the run before it, green:

```
1546  pointerdown x=640  ts=1546   sl=352
1548  pointermove x=693  ts=1548       dt=2   SKIPPED
1554  pointermove x=746  ts=1553       dt=7   SKIPPED
1554  pointermove x=800  ts=1554       dt=8   SAMPLED → v = 0.7·(160/8) = 14 px/ms
1555  pointerup   x=800  ts=1555   sl=191
1563  ARIA=gallery-card-0                   ← stepped, correctly
```

`onPointerMove` samples velocity only when a leg spans `SAMPLE_MS = 8` ms, and leaves shorter travel
to accumulate against the last anchor. **A gesture that ENDS inside that window accumulated into
nothing** — `d.v` is still its initial `0`, and `onPointerUp` reads a 160 px push thrown in 9 ms
(17.8 px/ms, forty times the 0.45 threshold) as a dead settle. `dir` reads 0, `target` falls back to
`centeredIndex()` at the release position, and the deck snaps back where it started.

`dt = 8` samples. `dt = 7` does not. That is the entire defect, and the driver's pace decides it:
Playwright's WebKit emits the three interpolated steps 2–8 ms apart, Chromium's 47–163 ms apart —
which is exactly why this is a WebKit-only red of an engine-independent bug.

### Why it presents at three different lines

A lost flick leaves the deck **stranded between two snap points** at `sl = 191`, where the composable
and the engine disagree about which card that is: `centeredIndex()` measures 191 from card 0 and 161
from card 1 → card 1; but the release position is only 15 px past the 176 px midpoint, and which
authority writes last — `glideTo`'s exact snap-point write, or the mandatory-snap re-arm resolving the
same position for itself — decides the outcome. Line numbers below are the red head's, `fd6a141a`:

- **`:302`** — the FIRST flick never leaves card 0. Captured whole on the uncured tree
  (`gallery-swallow-probe.txt` §B): legs of 1 / 6 / 7 ms, `v = 0`, released at `sl = 160`,
  `centeredIndex` picks card 0, and `glideTo(0)` walks the deck back to where it started.
- **`:306`** — the return flick never leaves card 1. Same mechanism, released at `sl = 191` where
  `centeredIndex` picks card 1 instead. Reproduced 6 times in 66 linux-WebKit runs.
- **`:316`** — the deck reads card 0 at the gate and is on card 1 by the click. Reproduced 4 times in
  25 linux-WebKit runs — the CI form, both attempts, shard 2.

The first two are the mechanism photographed: which card a lost flick lands on is decided by where
the release happened to stop, and 176 px is the coin's edge. The third is the same coin landing on
its edge — `sl = 191` is 15 px past the midpoint, `centeredIndex` says card 0 by its `offsetLeft`
basis while the re-armed mandatory snap resolves the same position to card 1 by its own, and whoever
writes last wins. **That last step is stated as a reading, not a captured race** — the two writers
were never photographed disagreeing. What IS measured is that curing the lost flick kills all three
presentations (§4): 0 reds in 48 runs of the `:316` row against 4 in 25 before, and 0 in 48 of the
flick gates against 6 in 66.

## 3. THE CURE — `useCarouselGlide.onPointerUp`

The release is a sample, and it is the one that decides the gesture. It now folds its own outstanding
leg in, over that leg's real duration, floored at the same half-frame the sampler uses:

```diff
-  function onPointerUp() {
+  function onPointerUp(e?: PointerEvent) {
     …
     suppressClick = true;
+    const legMs = (e?.timeStamp ?? d.t) - d.t;
+    if (legMs >= SAMPLE_MS || d.v === 0) {
+      const span = Math.max(SAMPLE_MS, legMs);
+      d.v = 0.7 * (((e?.clientX ?? d.px) - d.px) / span) + 0.3 * d.v;
+    }
     const from = centeredIndex();
     const dir = d.v < -FLICK_VPX ? 1 : d.v > FLICK_VPX ? -1 : 0;
```

Two arms and deliberately no third. A leg that spans a full sample window carries information; a
gesture that never sampled at all has nothing else to go on. Anything shorter than a window on top of
an existing `v` is **left alone** — it holds no new information, and folding a zero-travel leg in would
damp a real flick by the EMA's 0.7 weight. The `Math.max` floor is the existing `SAMPLE_MS`
discipline, unchanged in meaning: never divide a real delta by ~0.

The cure cannot turn a settle into a flick, which is the property the deck's other rows depend on. A
`dragDeck` settle paces ~10 px per ~55 ms from Node and releases ≥50 ms after its last move with zero
travel since — so the release leg contributes `0.7 × 0` and only *damps* the standing velocity. Proven
on the surface: the `kenken — the LAST card` row, four consecutive settle drags, 14/14 green on linux
WebKit after the cure (§4).

`onPointerUp` is bound to `pointerup` and `pointercancel` on `window`; both deliver a `PointerEvent`,
and the parameter is optional so the composable is unchanged for any caller that has none.

## 4. THE PROOF

**Reproduction rig.** The runner ran `workers=1`, shard 2 of 3 — not a contention flake. Darwin WebKit
would not red it (5/5, then 52/52 at nine workers). It reproduces on real **linux WebKit**:
`mcr.microsoft.com/playwright:v1.61.1-noble` — the CI image and version — against the repo's own dev
server on the host at `:4246`, driven through the repo's own `playwright.config.ts` with only the
`webServer` block dropped (the app is served from the host).

| | rig | runs | reds |
|---|---|---|---|
| **Before** `:294`, linux webkit | repeat 3 / 4 / 8 / 10 | 25 | **4** at `:316` |
| **Before** the same row body, instrumented copy | repeat 10 / 14 × 4 | 66 | **6** at `:302`/`:306` |
| **After** `:294`, linux webkit | repeat 14 / 14 / 20 | 48 | **0** |
| **After** the new mechanism row, linux webkit | repeat 14 / 14 / 20 | 48 | **0** |
| **After** the whole `drag:` block, linux webkit | repeat 14 × 2 rounds | 140 | 1 (§7 residue) |
| **After** `kenken`, linux webkit | repeat 14 | 14 | 0 |

Ten reds before, none after, on the same box against the same server through the same image.

**The new row is born RED, in both engines.** `gallery.spec.ts` gains
*"drag: a flick whose every move lands inside the sample floor is still a flick"*, which dispatches the
gesture in one synchronous task so every move carries the same `timeStamp` and the sampler is
*guaranteed* to skip all of them — the worst case the driver can produce, produced on purpose. Against
the uncured tree it fails `webkit` AND `chromium` (`Expected "gallery-card-1" · Received
"gallery-card-0"`), which is the proof that the defect was never an engine's: WebKit merely paces its
driver fast enough to hit it. Against the cured tree both pass.

**The rest.**

| gate | result |
|---|---|
| `gallery.spec.ts` whole file, **darwin webkit**, `--workers=1`, 5 consecutive | 14 passed ×5 |
| `gallery.spec.ts` whole file, **chromium** | 14 passed |
| `npm run test:unit` | 47 files, **483 passed** |
| `vue-tsc -b` | clean |
| `lint:sleep` / `lint:motion` self-tests | OK — 25 specs each |
| `lint:ink` / `lint:catch` / `lint:lanes` | OK |
| `prettier --check`, `eslint` | clean |

The `:294` row's guarded middle steps re-prove themselves in every one of those runs: the release's own
click over the centered card is still swallowed (§1's `prevented=true` trace), and the deck still moves
exactly one card per flick.

## 5. FILES

- `web/frontend/src/pencil/chrome/GameGallery/useCarouselGlide.ts` — the release sample (+22/−1).
- `web/frontend/e2e/gallery.spec.ts` — the born-RED mechanism row, plus one paragraph appended to
  `dragDeck`'s comment: it documented only the stall direction ("until a step stalls past 118ms") and
  the runner red came from the opposite exposure, three steps landing too CLOSE.

Nothing else. `HandwrittenLogo`/`DarkModeToggle`/`rasterPose`, `ci.yml`, configs, goldens and every
other spec are untouched.

## 6. THE ARM THAT STAYS OPEN

§1 measured that WebKit can withhold a release's click entirely. The swallow survives that gesture and
is disarmed by the next `pointerdown` — but `onPointerDown` returns early on `e.pointerType === "touch"`
and on `e.button !== 0`, so a **touch tap or a right-click following a mouse drag does not disarm it**,
and the stale swallow would eat the tap. Unreachable on the desktop surface these rows drive, real on a
hybrid device. Not cured here (out of this fix's fence, and un-evidenced on a real surface); recorded so
the next reader has it.

## 7. RESIDUE

1. One red in 140 cured linux-WebKit `drag:` rows: `kenken — the LAST card`, on a box simultaneously
   running the vite server, the container and a sibling agent's suite. It re-ran 14/14 green in
   isolation, it uses settle drags only (no velocity arm), and the cure provably cannot raise a settle's
   velocity. Attributed to rig load, not to this diff — but it is a WebKit-shaped reach row and it is
   named here rather than swept.
2. The `:306`/`:316` coin flip is inferred from geometry (§2), not captured. The evidence for the
   unification is the after-tally, not a photograph of the race.
3. `dragDeck`'s flick arm still depends on the driver's pace for the rows that use it. The new row is
   the deterministic one; the others remain integration rows by choice, and that is why the mechanism
   got its own row instead of a rewrite of theirs.

## 8. DRAFTED LEDGER NOTE — the chair decides the row

**Recommendation: its own row, NOT CH-66-adjacent.**

CH-66 is a *dropped press*: WebKit synthesizes `click` only from a paired mousedown/mouseup, and a DOM
tear-out under the pointer destroys one half so no click ever exists. This is not that. No press is
dropped — every event arrives, in order, at the right target, and the click reaches the card. What is
lost is a NUMBER: the release's velocity, discarded by the estate's own sampler. It is engine-agnostic
in mechanism (born-RED in Chromium as well as WebKit) and engine-localized only in exposure, where
CH-66's mechanism is WebKit's event synthesis itself. Filing it under CH-66 would make that row's
trigger — *"any webkit spec red whose document capture shows a lone mousedown or mouseup"* — read as
covering a red where both halves are present. Two mechanisms, two rows.

Proposed row:

> | CH-67 | CLOSED | The deck's LOST FLICK. `useCarouselGlide`'s velocity sampler skips any leg under its
> `SAMPLE_MS = 8` floor and leaves the travel to accumulate — so a gesture that ENDS inside that window
> accumulated into nothing and released at `v = 0`: a 160 px push thrown in 9 ms (17.8 px/ms, forty
> times the 0.45 flick threshold) read as a dead settle, `dir` read 0, and the deck snapped back to the
> card it came from. The defect is one millisecond wide — `dt = 8` samples, `dt = 7` does not — and the
> driver's pace decides it, which is why it is a WebKit-only red of an engine-independent bug:
> Playwright's WebKit emits a flick's three interpolated steps 2–8 ms apart, Chromium's 47–163 ms apart.
> It reds `gallery.spec.ts:294` at THREE lines, decided by where the stranded release stopped relative
> to the 176 px midpoint between two snap points (`:302` and `:306` when the deck's own `centeredIndex`
> wins, `:316` — CI's form, 2/2 at `fd6a141a` run 30806419008 — when the re-armed mandatory snap does;
> that third step is a reading, not a captured race). **The click swallow, this row's first suspect,
> is refuted by measurement**: the release's click is still eaten and the next press still passes, on
> the engine that reds. CURED: the release folds its own outstanding leg in, over that leg's duration
> floored at `SAMPLE_MS`, with a zero-travel leg deliberately left out so it cannot damp a real flick.
> Proven 10 reds before and 0 after across 91 / 110 linux-WebKit runs on one box, plus a born-RED
> mechanism row that dispatches the gesture in one synchronous task so every move is guaranteed to skip
> the sampler — it fails in BOTH engines uncured. `docs/tranches/2026-08-tranche-7/evidence/wgate/gallery-swallow-cure.md` (+ `gallery-swallow-probe.txt`) |

If the chair would rather this not close on its own evidence, the one honest BANKED trigger is: *any
gallery drag row reding on a card index, in either engine* — the mechanism row is the detector and it
is deterministic, so the trigger is script-evaluable.

There is also a **CH-64 credit** to record: this is the second head row of that class dissolved into a
named mechanism (CH-66 was the first), and the second one where the "contention-amplified" reading
was refuted at one worker. CH-64's own field verdict said a one-worker red would refute contention as
sufficient cause; this red was one-worker, shard 2, 2/2.
