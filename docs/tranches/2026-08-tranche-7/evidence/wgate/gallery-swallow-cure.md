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

---

# ADDENDUM — 2026-08-03, the second bite: the fold's excluded case

**Field red at `a7bf7a3e`, run 30814609152 — and it bit in CHROMIUM.**

The fold shipped above with two arms and a deliberate exclusion: *anything shorter than a sample
window on top of an existing `v` is left alone*, reasoned as "it holds no new information, and folding
a zero-travel leg would damp a real flick." The first half of that is false. A short leg holds no new
information **only when it is slow**. A short FAST leg is the most informative thing in the gesture,
and the exclusion discarded exactly that.

The shape the runner found:

> a gesture samples ONCE, early and slowly — a small `v` is now standing — and then throws its real
> push inside the final sub-8ms window. `legMs < SAMPLE_MS` and `d.v !== 0`, so neither arm fires,
> nothing folds, the stale small `v` survives, and a genuine flick reads as a settle.

It is the same lost flick, one arm further in — and because it needs no particular engine pacing, only
one early sample followed by a fast tail, **it reds in both engines**:

| job | row | error |
|---|---|---|
| `e2e-chromium` (workers=2) | `gallery.spec.ts:300` | the FIRST flick's gate — expected `gallery-card-1`, received `gallery-card-0` |
| `e2e-webkit (2)` (workers=1, shard 2/3) | `gallery.spec.ts:300` | the same row's tail, through CH-66's guarded press: *"nothing committed after 5 press(es) in 20000ms"* — the deck was on a flank, so no press could ever commit |

The WebKit form is worth reading twice: the guarded-press helper did its job and reported honestly
that this is **not** the dropped-press race its budget covers. A flank cannot be pressed into
committing, however many times you press it.

## The guard — a velocity arm, not a duration one

```diff
     const legMs = (e?.timeStamp ?? d.t) - d.t;
-    if (legMs >= SAMPLE_MS || d.v === 0) {
-      const span = Math.max(SAMPLE_MS, legMs);
-      d.v = 0.7 * (((e?.clientX ?? d.px) - d.px) / span) + 0.3 * d.v;
-    }
+    const span = Math.max(SAMPLE_MS, legMs);
+    const legV = ((e?.clientX ?? d.px) - d.px) / span;
+    if (legMs >= SAMPLE_MS || d.v === 0 || Math.abs(legV) > FLICK_VPX) {
+      d.v = 0.7 * legV + 0.3 * d.v;
+    }
```

**The invariant, stated at the site: fast tails always count, slow tails never damp.** The third arm
fires on the leg's OWN velocity rather than on its duration, and that is what makes it safe by
construction rather than by argument — a leg travelling faster than the flick threshold is not a
settle, whatever velocity is standing behind it, so the damping worry cannot apply to it. What stays
excluded is the only case that ever justified an exclusion: a short **slow** tail on top of an
existing `v`.

The arm is narrow by arithmetic as well as by intent. It can only fire when `legMs < SAMPLE_MS`, where
`span` is pinned at 8 — so it demands more than 3.6 px of travel inside a sub-8ms window. That is the
definition of a flick-rate leg, and nothing a settle produces: `dragDeck`'s settle paces ~10 px per
~55 ms and releases ≥50 ms after its last move with zero travel since, so its release leg takes the
FIRST arm and merely damps, exactly as before.

## Proofs

**The excluded case, made deterministic and born RED.** `gallery.spec.ts` gains
*"drag: a slow first sample does not swallow the flick that follows it"*, beside the first mechanism
row. Its two halves are paced by different mechanisms on purpose: a real 24 ms gap for the first leg
so it genuinely samples (8 px, 0.33 px/ms — a settle so far as the deck knows), then the remaining
152 px and the release in ONE synchronous task so the sampler is guaranteed to skip all of it.

Ablated against the **first cure** (the precise before-state, not the pristine tree):

| tree | *…inside the sample floor* | *…slow first sample* |
|---|---|---|
| first cure, chromium | PASS | **FAIL** — expected `gallery-card-1`, received `gallery-card-0` |
| first cure, webkit | PASS | **FAIL** — expected `gallery-card-1`, received `gallery-card-0` |
| guarded, both engines | PASS | PASS |

The original mechanism row stays green throughout — the guard adds folds, it changes none.

**Settles still undamped** — the guard's whole claim, proven on the rows that would feel it:

| | result |
|---|---|
| `kenken — the LAST card` (4 consecutive settle drags), both engines | PASS |
| the whole `drag:` block, both engines | 12 passed |
| `gallery.spec.ts` whole file, webkit `--workers=1` ×3 | 15 passed ×3 |
| `gallery.spec.ts` whole file, chromium ×2 | 15 passed ×2 |
| `npm run test:unit` | 483 passed |
| `lint:sleep` · `lint:motion` self-tests | OK — 25 specs each |
| `prettier --check` · `vue-tsc -b` · `doc-truth` · `pw-projects` | clean · clean · 32 GREEN · 426 resolved |

The new row uses no Playwright-side fixed wait — its 24 ms gap is an in-page timer inside the single
`page.evaluate`, which is why `lint:sleep` stays green with it in the file.

## The load-shaped residual — ablated, and it is HARNESS-SIDE

The guarded tree did **not** come back clean on the linux rig. Run under the whole `drag:` block at
`--repeat-each=14` (84 tests a round), `:294` still red — always the same symptom, the deck resting on
futoshiki, reported through `pressCommitted` as *"nothing committed after 5 press(es)"*, which is the
helper correctly refusing to call a flank a dropped press. So it was ablated against `a7bf7a3e` on the
same box, same server, same image, arms alternated:

| tree | round total (84 tests) | of which `:294` |
|---|---|---|
| **guarded** | 4 failed¹, 1 failed, 0 failed | 3, 1, 0 |
| **`a7bf7a3e`, no guard** | 11 failed² | ≥4 |
| **guarded, `:294` in ISOLATION** (`--repeat-each=14` × 5 rounds, 70 runs) | — | **0** |

¹ three `:294` plus one `page.goto` 30s timeout — my LAN-served dev server, not the row.
² inflated by design: the new `slow first sample` row is born-RED on this tree and accounts for most
of it. `:294` itself was counted red ≥4 times from the live artifact directory before the round was
capped. The comparison that matters is `:294`-to-`:294`, and there the unguarded tree is the worse of
the two.

**Present on both trees, and the guard is not the worse of them.** The
verdict is harness-side, and the isolation row is what settles it: the same row, same tree, same
engine, reds only when it runs inside the loaded block and never on its own. That is the exposure the
`dragDeck` comment has documented from the start — *a step stalling past ~118ms* — and it is the arm
no composable change may touch, because a gesture whose every leg is genuinely slow **is** a settle
and the deck is RIGHT to read one. The velocity guard is orthogonal to it by construction: it fires
only on a sub-window leg carrying >3.6 px, which a stalled driver never produces.

The population matters. This rig is a darwin box at load average 17+ running the vite server, the
container and sibling agents' suites at once, reaching the app over the LAN — one round even lost a
`page.goto` to a 30s timeout. CI's webkit shards run `workers=1` and the settling act runs quiescent.
**No cure is ordered; this books as a load-only watch note.**

One limitation of the new row, found by the same ablation and worth stating: on a box this loaded the
`slow first sample` row does not fail 14/14 on the unguarded tree the way it does on a quiet one. Its
burst relies on all four dispatches sharing a `timeStamp`, and each dispatch runs the composable's
`scrollLeft` write synchronously — under load a single dispatch can itself outlast the 8ms floor, at
which point the leg samples and the row passes even uncured. It is deterministic where determinism is
claimed for it (a quiet box, both engines, §Proofs) and merely a weaker detector under thrash. That is
the honest scope; it is not a reason to loosen the row.

One candidate is worth recording and NOT acting on: under a stalled main thread the engine stamps a
real user's fast flick with dispatch-time `timeStamp`s, so the composable under-reads a genuine push.
`PointerEvent.getCoalescedEvents()` carries true input times and would read it honestly. That is a
real improvement and a much larger change, unproven here, with no field defect behind it — named for
whoever next has a reason.

## The ledger amendment — one sentence, the chair applies it

CH-67's drafted CURED clause reads "the release folds its own outstanding leg in, over that leg's
duration floored at `SAMPLE_MS`, with a zero-travel leg deliberately left out so it cannot damp a real
flick." That sentence describes the cure that was field-falsified. Replace it with:

> CURED in two passes, and the second is the row's real lesson: the release folds its own outstanding
> leg in over that leg's duration floored at `SAMPLE_MS`, and folds it whenever the leg spans a full
> sample window, or the gesture never sampled at all, **or the leg's OWN velocity clears the flick
> threshold** — the third arm added after run 30814609152 at `a7bf7a3e` red the same row in CHROMIUM
> as well as WebKit, where a gesture that sampled once early and slowly then threw its real push
> inside the final sub-window folded nothing and kept the stale small velocity. The invariant is
> stated at the site — fast tails always count, slow tails never damp — and the guard is a VELOCITY
> one rather than a duration one precisely so it is safe by construction: a leg travelling faster than
> the flick threshold is not a settle, whatever velocity stands behind it.

The first draft's proof sentence should also gain: *the excluded case has its own born-RED row,
ablated against the first cure rather than the pristine tree, failing in BOTH engines there and
passing guarded.*

**Read this as a correction to the row, not a second row.** One mechanism — the release's outstanding
leg discarded — found twice because the first fix's exclusion was drawn on the wrong axis. Re-booking
it as CH-68 would split one defect across two ids.

## Residue, this pass

1. Not chased, reported as asked: `e2e-webkit (3)` in the same run red `mobile-affordances.spec.ts:401`
   once, its second sighting across engines. Nothing in the instrumented gallery runs touched that row
   and none of them caught it misbehaving — no evidence either way from here.
2. `multiplayer.spec.ts:925` also red in the chromium job of run 30814609152 (*"the real relay carries
   the board with RTCPeerConnection deleted"*, empty error body). Outside this fence, named so the
   chair's roster is complete.
