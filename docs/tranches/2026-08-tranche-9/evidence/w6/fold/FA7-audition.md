# FA7 — the deck's CHOICE across a resize: the audition, measured

Lane FA7 of the T9 W3+W6 chair fold. Handoff `w6/handoffs/6d-r15-1.md`. All numbers below were
taken on the live edge (vite dev, 127.0.0.1:4237) at the fold tree, both engines.

## 0. THE HANDOFF'S OWN NUMBER HAS MOVED, and it is named rather than repeated

6d-r15-1 banked **0 of 4** arms keeping card 0 at 1440×900 → 390×844 in WebKit, with the R15 cure
**fully ablated**. At this tree the R15 cure is landed, and the same gesture measured 5 of 6 arms
holding (`FA7-arms/HEAD-webkit-390.json`). The walk is intermittent here, not terminal — which
makes six green arms of a candidate a coin landing the same way six times as easily as a cure.

So the audition was run on a sharper instrument and the verdict read back on the handoff's own.

## 1. THE INSTRUMENTS

| rig | what it does | file |
|---|---|---|
| **ribbon rig** (the handoff's gesture) | arm the deal ribbon on card 0 at 1440×900, rotate once, read `aria-activedescendant` + `.gallery-guard` + resting card | `FA7-resize-choice-probe.mjs` |
| **rate rig** (the discriminator) | bare deck, park on card 0, rotate, read — K times on one page | `FA7-resize-rate-probe.mjs` |

`restingCard` is nearest-slot-centre and is **honest only at the phone**. At the desk's
three-slot rung cards 0 and 1 share a rest position, so it reads 1 for a deck resting on 0 —
the exact reading `restingIndex`'s own prose refuses. Every desk row below shows `rest=1`; that
is the clamp, not a walk.

## 2. HEAD (born RED)

| tree | engine | pair | walks |
|---|---|---|---|
| HEAD | webkit | 1440×900 → 640×900 | **17 / 20**, and **14 / 20** on a re-measure |
| HEAD | webkit | 1440×900 → 390×844 | **4 / 20** |
| HEAD | chromium | 640 | 0 / 20 |
| HEAD | chromium | 390 | 0 / 20 |
| HEAD (ribbon rig) | webkit | 390 | 1 of 6 arms walked — ribbon destroyed with the card |
| HEAD (ribbon rig) | webkit | 640 | 1 of 6 arms walked |

640×900 is the sharp pair and is what the audition was run on.

## 3. THE MECHANISM (and it refutes candidate A before a single arm is run)

`FA7-walk-timeline-webkit-640.txt`, an rAF sampler across one rotation:

```
0ms   sl=0    snap=x mandatory  ad=gallery-card-0  vw=1440
31ms  sl=212  snap=x mandatory  ad=gallery-card-1  vw=640
90ms  sl=352  snap=none         ad=gallery-card-1  vw=640
103ms sl=352  snap=x mandatory  ad=gallery-card-1  vw=640
```

At **31ms** the choice is already gone, and nothing the composable writes has run yet. The only
seam that can publish that fast is `scrollend` → `reportSnap`, which is **undebounced** — the
90ms debounce sits on `scroll` alone. `restingIndex()` reads the engine's own 212 against the new
640 layout, answers 1, and `syncFromScroll(1)` takes the choice and dismisses the ribbon.

The ResizeObserver's re-pin fires at **90ms**, 59ms LATE, and pins `targetScrollLeft(1)` — it
re-pins a choice that was already stolen. **The re-pin was never the defect.**

## 4. THE TWO CANDIDATES, MEASURED

### A — the rAF re-pin in the observer body (the handoff's literal text)

```ts
resizeObs = new ResizeObserver(() => {
  jumpTo(currentIndex);
  requestAnimationFrame(() => jumpTo(currentIndex));
});
```

**webkit @640: 2 of 20 still walked.** It helps — a second re-pin sometimes wins the race against
the report — but it cannot close the seam, because by the time either `jumpTo` runs
`currentIndex` may already be 1. It does not hold the card in every arm. **REFUTED, on the count
and on the mechanism both.**

### B — a resize is not a gesture (landed)

`reportSnap` returns without reporting when the settle is measured against a frame the deck has
not pinned since it changed shape. The key is the frame's own `clientWidth`, not a timer and not
a resize flag; every position write the composable makes re-pins it; it is armed only when a
ResizeObserver exists to do the re-pinning (without one, nothing would ever re-arm the seam and
the deck would stop following touch for the rest of the page's life).

| rig | engine | pair | result |
|---|---|---|---|
| rate | webkit | 640 | **0 / 20**, twice — 0 / 40 |
| rate | webkit | 390 | **0 / 20** |
| rate | chromium | 640 / 390 | 0 / 20 each (no regression) |
| ribbon | webkit | 640 | **6 / 6 held**, ribbon standing in every arm |
| ribbon | webkit | 390 | **6 / 6 held**, ribbon standing in every arm |
| ribbon | chromium | 390 | 4 / 4 held |

0 walks in 80 rotations against 17/20 at HEAD on the same instrument. B also fixes the POSITION,
not only the label: with the choice held, the re-pin that was already written lands on card 0.

**B is the smaller claim and it needs no rAF, so it is what landed** — which is also the
handoff's own stated preference between two holders.

R15's second arm (the `passive` `scroll` listener feeding `anchorGuard` in `GameGallery.vue`) is
UNTOUCHED, per the handoff's caution.

## 5. THE UNIT ROWS (born RED)

`src/pencil/chrome/GameGallery/useCarouselGlide.test.ts`, five rows against a fabricated deck.

Against the pristine glide (`FA7-born-red-glide-unit.txt`): **Test Files 1 failed · Tests 2
failed | 3 passed**. The two reds are the cure's own rows —

- `onSnap` called with `1` where it must not be called at all;
- the re-pin landing on `250` (card 1) where it must land on `0`.

The other three are the anti-overreach rows and are banked AS GREEN at HEAD: the seam re-opens
in the new frame, an unchanged frame is always the reader's, and with no ResizeObserver nothing
is suppressed.

Against the cure: 5 passed.

## 6. THE SPEC RESIDUES (lane 6C's)

- **`drag: kenken — the LAST card` armed** with the premise assertion + `armSnapLedger` /
  `snapLedger` that `drag: pushing the deck left` carries, applied unchanged. It earned its keep
  on the first red it saw: the message named MECHANISM B and printed the trail
  `[1983ms gallery-card-1 → 3983ms gallery-card-2]` with a drag trail carrying only two real
  releases for four pushes — a reading the bare `Expected "gallery-card-4"` could never give.
- **`deckSettled` marker made per call.** Plant-proved on the live deck, both engines
  (`FA7-decksettled-plant.txt`): on its SECOND call the shared-marker helper answered "at rest"
  on reading 1, with a 352px move landing immediately after that reading; the per-call helper
  refused both readings across the same move and settled normally afterwards.

## 7. THE GALLERY BATTERY

`npx playwright test e2e/gallery.spec.ts --reporter=line --repeat-each=3` — 138 tests, both
engines, 9 workers, against 127.0.0.1:4237.

| tree | runs | result |
|---|---|---|
| FA7 (cure + spec changes) | 7 | **6 × 138 passed**; 1 run with 6 reds |
| control (my edits reverted) | 3 | 3 × 138 passed |

THE ONE RED RUN, NOT DRESSED: the first playwright invocation of the session redded 6 of 138,
all chromium — `drag: pushing the deck left`, `drag: a grab during a keyboard glide`,
`click: a flank warps the deck`, `drag: kenken` (×2 repeats) and `header: the masthead persists`.
It was never reproduced: 6 further full runs on the same tree are green, including two with the
sources touched immediately beforehand (HMR-cold) and one against a freshly restarted server with
`node_modules/.vite` deleted. The control was run under both of those conditions too and is green
in all three of its runs.

The rows are the deck-gesture family this file's own §6.3 prose already censuses as intermittent
under whole-suite contention ("run 1 RED in webkit … run 2 GREEN in both engines, same tree, same
command"). What is NEW and worth carrying forward is the ENGINE: that census recorded webkit, and
this red was chromium. One run is not a diagnosis, and it is banked as a count rather than a
cause.
