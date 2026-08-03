# The gallery's press refusal at `gallery.spec.ts:300` — the mechanism, and the cure

**2026-08-03 · T7-WGATE · field red at `4d74afe8`, run 30818874512 (e2e-webkit shard 2, workers=1,
the only red job in 19) · second field occurrence at `a7bf7a3e`, run 30814609152 · cured on the
working tree**

The row: *"drag: a flick moves exactly one card; a release over the centered card selects nothing."*
It reds at its LAST step — `pressCommitted(#gallery-card-0, …)` throwing *"nothing committed after 5
press(es) in 20000ms"* — with all five `trigger.click()` calls having SUCCEEDED. Two workers=1 hits
retire the *"load-only watch note"* this row was booked as at the tail of
`gallery-swallow-cure.md`.

**MID-WORK SCOPE CHANGE (owner ruling, 2026-08-03): all browser Playwright jobs are being removed
from CI, so this row no longer gates the close.** The question was re-put as the product question
alone — *can a real hand press the centered card and be refused?* — and that is the question this
file answers. The CI-shaped work (a born-RED row minted to keep a lane green, README count trues)
was dropped on the same order; the spec row below stays because it is a local instrument that
photographs a real defect, not a lane keeper.

---

## 1. WHAT THE FIELD ACTUALLY BANKED

From the run's own `e2e-report.json` (artifact `e2e-webkit-report-shard-2`, the only machine-readable
thing the red left):

```
=== drag: a flick moves exactly one card; a release over the centered card selects nothing
    gallery.spec.ts:300
status failed  dur 24929  retry 0
ERR: Error: the centered card selects and the deck leaves: nothing committed after 5 press(es) in
     20000ms — that is no longer the dropped-press race this budget covers (T7-W3 §9); read it as
     a real defect
```

24.9s total, of which 20s is the press budget — so everything before the press ran in ~4.9s against
a green-run baseline of ~3.5s. **The runner was not thrashing.** The helper reported honestly: five
presses landed on a card that could not commit, which is what a FLANK does. The deck was not on
card 0.

## 2. THE RIG — and the finding that load is the wrong axis

Own dev server on `:4237` (4230/4241/4250 were foreign), the repo's own specs, `workers=1`.

| rig | tree | rounds | reds |
|---|---|---|---|
| quiet darwin webkit | uncured | 4 + 1 | 0 |
| **28 CPU burners, load avg 33**, webkit | uncured | 14 | **0** |
| **28 burners + `taskpolicy -b`** (background QoS → E-cores), webkit, load 33→47 | uncured | 14 | **3** |
| **`taskpolicy -b`, load 86** (sibling agents' load, harsher than the red arm) | **cured** | 6 | **0** |

**Load alone does not reproduce it; CPU-CLASS STARVATION does.** `taskpolicy -b` puts the whole
browser in macOS background QoS, which pins it to efficiency cores and coalesces its timers — the
honest darwin analogue of a two-core runner, and the piece every previous attempt at this row was
missing. Recorded here because it is reusable: the recipe is `taskpolicy -b npx playwright test …`
with a bounded burner pool (`timeout 600 yes`, killed in a trap), and it turns a 70/70-green row
into a 3-in-14 red.

The cured arm is the closest thing to a like-for-like the box allowed: **6/6 green under the same
`taskpolicy -b` starvation at load 86**, harsher than the 33→47 that red the uncured tree 3 in 14. A
14-round on the cured tree was abandoned mid-flight (`exit 143` — my own SIGTERM) when sibling agents
took the box to load 86 and one probe run stretched from 3.3s to 2.7 minutes; its single `✘` is that
kill, not a red, and it is counted as nothing. Past a point the rig stops measuring the product and
measures the box: an earlier attempt at load 83 produced no completed tests at all inside five
minutes.

## 3. THE MECHANISM, MEASURED — and it is not any of the four suspects

A document-capture tap (pointer/mouse/click/scroll, `composedPath()[0]`, `defaultPrevented`, plus a
`MutationObserver` on `#gallery-card-0`'s subtree) ran the row's exact gesture sequence.

**The click swallow is innocent, re-measured on the engine that reds.** A capture listener on
`.gallery-viewport` registered AFTER the composable's own runs after it on the same node, so
`defaultPrevented` there is the swallow's fingerprint:

```
t=1428 ev=DOC:click       tgt=div.live-face-fit prev=false ad=gallery-card-0 sl=0 tx=-20
t=1428 ev=VP-AFTER:click  tgt=div.live-face-fit prev=true                              ← the release's own click, eaten
t=2374 ev=VP-AFTER:click  tgt=div.live-face-fit prev=false                             ← the plain press, NOT eaten
t=2396 ev=CARD0:click     tgt=div.live-face-fit prev=false                             ← reaches the card root → selects
```

**No tear-out under the pointer (H1/CH-66 is not this).** The subtree observer logged no `childList`
removal inside any press window. The centered card's press surface is `div.live-face-fit` — the
teleported live board — and it stays mounted across the press.

**What actually reds is the RELEASE'S OWN FOLD, and it destroys a flick it measured correctly.**
Temporary instrumentation inside `onPointerUp`/`onPointerMove`, driving a 160px push over ~100ms
(1.6 px/ms — an ordinary flick, 3.5× the deck's declared 0.45 px/ms threshold) and releasing 33ms
later with the pointer still:

```
t=431 ev=MOVE dt=101 x=480 v=-1.113 sampled=true
t=465 ev=UP   legMs=33 legV=0 vPre=-1.113 v=-0.334 from=0 dir=0 target=0 sl=160
----- aria-activedescendant = gallery-card-0        (chromium AND webkit, both runs)
```

The sampler did its job: `v = -1.113`, two and a half times the threshold. The release's leg carried
**zero travel**, and the fold's first arm (`legMs >= SAMPLE_MS`) folded it anyway —
`0.7 × 0 + 0.3 × −1.113 = −0.334` — putting the gesture under the threshold. `dir` read 0, `target`
fell back to `from`, and the deck snapped back to the card it came from. **The push was never lost;
the fold destroyed it.**

That is the same one defect CH-67 already names — *the release's outstanding leg* — found a third
time because the first two passes both drew the guard on DURATION. This pass is the axis correction.

## 4. IS IT REACHABLE BY A REAL HAND? — yes, and about half the time

The re-scoped question. `pointermove` is coalesced by both engines to at most **one per rendering
frame**; `pointerup` is not coalesced at all. So a release lands a uniform **0–16.7ms** after the
last move a 60Hz page dispatched — wider as the page slows, and this page runs a boil — and through
that gap the hand is still travelling with no move event in existence to say so. Whenever that gap
cleared `SAMPLE_MS = 8` — roughly half of all releases at 60Hz, more on a busy page — the deck
multiplied the whole gesture by 0.3.

The arithmetic of what that cost: surviving the fold required `|v| > 1.5` px/ms. **The deck declared
a 0.45 px/ms flick threshold and honoured 1.5** — 3.3× — with which one applied decided by where the
release happened to land inside a frame. Every flick a user threw between those two numbers stepped
or didn't by coin flip. This is a product defect on a real surface; the harness merely photographed
it.

What is NOT a product defect, and is stated so the record is honest: the *press refusal itself*. A
flank is not selectable and `onCardClick`'s `if (props.isActive && !props.guard)` is correct. And the
"aria says card-0 while the deck rests on card-1" divergence is a HARNESS artifact by construction —
`aria-activedescendant` and `isActive` read the same `activeIndex`, so they cannot disagree; what
disagreed was the row's earlier sample and the deck's later state.

## 5. THE CURE — three arms collapse into one invariant

`useCarouselGlide.onPointerUp`:

```diff
-    if (legMs >= SAMPLE_MS || d.v === 0 || Math.abs(legV) > FLICK_VPX) {
-      d.v = 0.7 * legV + 0.3 * d.v;
-    }
+    const folded = 0.7 * legV + 0.3 * d.v;
+    if (Math.abs(folded) > Math.abs(d.v)) d.v = folded;
```

**The invariant, as it appears at the site: THE RELEASE MAY ONLY ADD TO WHAT THE GESTURE MEASURED,
NEVER SUBTRACT FROM IT.** A `pointerup` carries no position of its own — it is dispatched at the last
coordinate the engine reported — so its leg can hold a real outstanding push the sampler skipped, and
can never hold evidence that the hand slowed.

It is safe by construction rather than by argument: the fold only ever changed an OUTCOME by lowering
`|v|` across the threshold, because `dir` is a magnitude test. A fold that may only raise the reading
therefore cannot turn a settle into a flick — it can only stop turning flicks into settles. Fewer
lines than the arm list it replaces, and it subsumes both earlier passes: a gesture that never
sampled (`d.v = 0`) takes any fold, a fast tail folds because it reads faster, a slow or zero tail is
left alone.

**What it gives up, named at the site rather than hidden:** a hand that throws a real push and then
holds still, button down, before releasing still reads as the push. The two cases are
indistinguishable in the event stream; one is common and one is deliberate, and only one of them
makes the deck feel broken.

## 6. THE PROOF

**Born RED, in both engines, deterministic on a quiet box.** `gallery.spec.ts` gains *"drag: a
release that lands a frame after the last move is still a flick"* — a 160px push dispatched over a
real ~100ms leg (so it genuinely samples), then a real 30ms gap with the pointer still, then the
release. Ablated against `HEAD` (`4d74afe8`) via `git show HEAD:… > file`, not a stash:

| tree | chromium | webkit |
|---|---|---|
| **uncured (`4d74afe8`)** | **FAIL** — expected `gallery-card-1`, received `gallery-card-0` | **FAIL** — same |
| **cured** | PASS (614ms) | PASS (1.2s) |

The row is red for any first-leg duration `> 75ms` (the fold's 0.3 keeps it under the threshold) and
green for any `< 249ms` (the cure's arm), so a `setTimeout(100)` cannot undershoot the red direction
and carries 2.5× slack on the green — deterministic where determinism is claimed for it.

**Everything else on the surface that could feel it:**

| gate | result |
|---|---|
| `gallery.spec.ts` whole file, **chromium + webkit** | **32 passed** (21.6s) |
| — incl. `drag:` row `:300` (the field's row), both engines | pass |
| — incl. both prior mechanism rows (sample floor · slow first sample) | pass |
| — incl. `kenken — the LAST card` (four consecutive SETTLE drags), both engines | pass |
| `npm run test:unit` | 47 files, **483 passed** |
| `npx vue-tsc -b` | clean |
| `npm run lint:sleep` | OK — 25 specs, 4 stale |
| `npm run lint:motion` | OK — 25 specs |
| `npx prettier --check src/…/useCarouselGlide.ts` | clean |

## 7. FILES

- `web/frontend/src/pencil/chrome/GameGallery/useCarouselGlide.ts` — the fold's invariant (+26/−15,
  net −2 lines of logic, the rest comment).
- `web/frontend/e2e/gallery.spec.ts` — the born-RED row (+51).

Nothing else. All instrumentation (a document tap, temporary `__log` lines in the composable,
`GameCard.onCardClick`, `GameGallery.syncFromScroll`) is REVERTED; the probe specs and configs live
in scratch and are not in the repo. `ci.yml` / README / `scripts/` changes present in the tree at
handoff are the chair's concurrent Playwright-removal work, not this one's.

## 8. WHAT WAS NOT DONE

1. **The CI red itself was never reproduced in its exact tail form.** What was reproduced is the
   mechanism that produces it — a flick read as a settle — plus three reds of its aria-gate
   presentation under the QoS rig. The chain from *lost flick* → *deck stranded on a flank* → *five
   refused presses* is the one `gallery-swallow-cure.md` §2 already photographed at
   `:302`/`:306`/`:316`; this file does not re-photograph it, and says so rather than implying it.
2. **No unit row for the composable.** `useCarouselGlide` needs a mounted component plus scroll
   geometry stubs; the e2e row is the deterministic instrument and it runs in both engines.
3. **The `getCoalescedEvents()` reading is still not taken.** It carries true hardware input times
   and would let the deck read a real push through a stalled main thread instead of inferring it.
   Named in the previous pass, still unacted, still with no field defect of its own.
4. **The stale-swallow arm on hybrid devices** (`gallery-swallow-cure.md` §6) is untouched — a touch
   tap or right-click after a mouse drag does not disarm `suppressClick`. Unreachable on the desktop
   surface these rows drive.
5. **The new row has no automated home.** With the browser Playwright jobs removed from CI, the
   deterministic detector for this mechanism runs only when somebody runs it. It is named here as a
   consequence of the ruling rather than an objection to it: three passes of this one defect were
   each caught by that lane, and the lane's replacement — visual validation on the live site — does
   not throw a flick. Whoever owns deployment validation should know that a lost flick is invisible
   to a screenshot.

## 9. BOOKING — an amendment to CH-67, not a new row

One defect, three passes, one id. The mechanism has been *the release's outstanding leg* every time;
what moved is where the guard was drawn.

> **CH-67 amendment (2026-08-03, third and final pass).** The first two cures drew the fold's guard
> on the leg's DURATION and the third species walked straight through both: a leg that spans a full
> sample window but carries ZERO TRAVEL is not information, and folding it multiplied a correctly
> measured flick by 0.3. Measured in BOTH engines — a 160px push over 101ms stood `v = −1.113`, two
> and a half times the 0.45 threshold, and a release 33ms later with the pointer still folded to
> `−0.334`, so `dir` read 0 and the deck snapped back to the card it came from. The exposure is a
> real hand's, not a driver's: `pointermove` is coalesced to one per rendering frame and `pointerup`
> is not coalesced at all, so a release lands 0–16.7ms after the last reported move at 60Hz with the
> hand still travelling — which made a declared 0.45 px/ms flick threshold behave like 1.5, decided
> by where the release fell inside a frame. CURED by replacing the arm list with the invariant it
> was groping for: **the release may only ADD to what the gesture measured, never subtract from it**
> (`Math.abs(folded) > Math.abs(d.v)`), which is safe by construction because `dir` is a magnitude
> test — a fold that may only raise cannot turn a settle into a flick. Born-RED row *"a release that
> lands a frame after the last move is still a flick"*, red in chromium AND webkit against
> `4d74afe8`, green cured; `gallery.spec.ts` 32/32 both engines. Field evidence: runs 30818874512
> (`4d74afe8`) and 30814609152 (`a7bf7a3e`), both `workers=1`, which also retires the load-only
> reading this row carried. `docs/tranches/2026-08-tranche-7/evidence/wgate/gallery-press-refusal.md`

The CH-64 credit stands and gains a third entry: a one-worker red refuted contention as sufficient
cause again, and the reproduction rig confirms why — what reproduces this class is CPU-CLASS
starvation, not load.
