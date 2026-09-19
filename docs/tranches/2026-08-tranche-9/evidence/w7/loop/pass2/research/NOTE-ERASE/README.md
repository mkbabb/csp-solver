# NOTE-ERASE · THE ERASER — pass-2 lane record (RESEARCH)

T9-W7 §7, the hint note's lifecycle. One family, alone. Read-only on every product file;
nothing closes (U-10).

Ran against the **pass-1 prototype worktree's own build**, `wf_e58b4764-0fc-53` (its diff
stands, nothing committed, nothing edited — `git status` identical before and after, and the
`.vite-cache` I pointed at it was removed on the way out). Dev server
`npx vite --config probe/vite.scratch.config.mjs --host 127.0.0.1 --port 4248 --strictPort`,
private `cacheDir`, **killed before this return**. Scratch playwright config (`probe/pw.config.ts`,
baseURL only — the estate's default starts :3000). chromium + webkit, 390×844 and 1280×800,
light and dark. Probes were run from a scratchpad mirror carrying a `node_modules` symlink;
`probe/` here is the authority and `logs/` is copied back byte-for-byte.

**Crops: two** (`frames/midErase-{chromium,webkit}.png`, 954 B and 5,351 B) — the one pose a
number cannot say. Everything else below is a number.

**THE ARM, stated (charter head).** The family is **arm (b) with one clock**: no clock on the
hint, a settle at 8 beats, and a hold on the refusal alone. The reading-time number the charter
asks for is in §7, and it derives the whole **24–40 beat band** from the house's own constants
rather than picking an endpoint.

---

## 0 · What this pass found that changes the design

Four measurements move the spec. Each is a section below.

1. **`mode="out-in"` is why the repeat cannot be announced, and it is the same property the
   critic praised.** The old span keeps its text until the new one mounts, so the region's
   accessible name never passes through `""` — not in a frame, and not in a MutationObserver
   callback either. The empty IS the announcement mechanism, and out-in deletes it. (§1)
2. **A park does not hide the note. It shrinks it.** The board is Teleported live into the
   gallery's centre card: `checkVisibility()` true, one client rect, effective font **8.63 px**
   at 1280 and **10.43 px** at 390. So the refusal's hold is not running behind a curtain — it
   is running against a sentence the reader can see and cannot read. (§2)
3. **The gold-dark figure is reconciled, and the loser is the painted-byte reader.** The
   arithmetic and the token comment agree at **11.478**; the prototype's `12.46` is the
   **inline star**, not the ink. (§6)
4. **`hintReasoning` can only ever carry three shapes, and the "other six `becauseCells`" are
   unreachable from the margin.** The retraction set is exactly **{1, n}**, n ∈ {4, 9, 16}. (§8)

---

## 1 · THE REPEAT (charter row 1) — the mechanism, named at the line

### 1.1 What the pass-1 build actually does, both engines

`logs/n1-repeat-{chromium,webkit}.json`. Refuse the same given twice, with a MutationObserver
on `.margin-note` reporting **the region's own `textContent` at mutation time** (what an AT
observes) rather than a record count.

| | chromium | webkit |
|---|---|---|
| mutation deliveries | 3 | 3 |
| region text at every delivery | `that's a given clue` | `that's a given clue` |
| `.margin-note-ink` spans in the region, every delivery | 1 | 1 |
| `animationstart` on the repeat | `ink-write-in`, classes `note-enter-from note-enter-active` | same |
| `ink-rub-out` | **never starts** | **never starts** |

So the ENTER runs on the repeat and the LEAVE does not, on both engines.

### 1.2 Why — the exact Vue line

`node_modules/@vue/runtime-core/dist/runtime-core.cjs.js` (Vue **3.5.39**):

```
1534   const leavingVNode = leavingVNodesCache[key];
1535   if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el[leaveCbKey]) {
1536     leavingVNode.el[leaveCbKey]();          // ← the leave is FINISHED EARLY, here
1537   }
```

`key` is `String(vnode.key)`. `:key="text"` makes the re-entering vnode's key equal to the
leaving one's, so `beforeEnter` early-finishes the leave before a single leave class resolves.
The prototype's gap 2 guessed "Vue re-uses the element"; it is the `leavingVNodesCache`, keyed
by the string, and **the cure is exactly "key on a write sequence"**.

### 1.3 But the key is NECESSARY AND NOT SUFFICIENT — the real defect

Even with the key fixed, `mode="out-in"` holds the OLD span in the DOM for the whole leave, so
`region.textContent` reads the old sentence until the new span mounts. The region's accessible
name therefore goes `X → X`, never `X → "" → X`. That is why the critic's C1 finding (*"0 frames
with an empty region — out-in opens no announcement hole"*) and G6's emptiness are **one
mechanism wearing two hats**: the closed hole is what makes the repeat unsayable.

The control proves the target is reachable. The board's own `announce()`
(`GameBoard.vue:659`) on two identical deals, measured in the same run:

```
chromium  t=1677.1 ""   t=1678.1 "new board. 9 by 9 sudoku board, easy"
          t=3685.3 ""   t=3687.5 "new board. 9 by 9 sudoku board, easy"
webkit    t=1930   ""   t=1935   …        t=4019 ""   t=4026 …
```

Two separate deliveries, the empty visible in both. The margin's copy of the same clause
produces **one** delivery with the text already restored, because `<Transition mode="out-in">`
sits between the ref and the region and `nextTick` is a microtask that never survives a flush
boundary the observer can see.

### 1.4 What the synthesizer must specify

- **`:key` = a monotonic write sequence**, not the string (closes §1.2).
- **the repeat's re-write is deferred by `rubOutMs + 1 frame`, on a CANCELLABLE timer**, not
  `nextTick` — long enough that the leave completes and the region genuinely empties (closes
  §1.3 *and* row 12's race with one counter).
- **out-in stays for a DIFFERENT sentence** (no hole, no double-speak) and the repeat is the
  one path that takes the hole deliberately.

### 1.5 G6, re-gated so it can fail

> **G6.** Refuse the same given twice; observe the region with `{childList, characterData,
> subtree}` and record `region.textContent` **inside each callback**. The trajectory must contain
> `""` strictly between two occurrences of the sentence.
>
> HEAD: `[]` (0 mutations — the sentence is never re-written at all).
> Pass-1 build: `["that's a given clue","that's a given clue","that's a given clue"]` — **RED**.
> Cured: `["that's a given clue","","that's a given clue"]`.

A record count cannot fail. A trajectory can, and does, today.

**What this gate still cannot prove** (state it, do not hide it): NVDA and VoiceOver may
coalesce identical successive utterances even across a real empty. The trajectory is the
closest a headless engine gets to an utterance; the AT claim stays a device row (M19).

---

## 2 · THE PARK (charter row 2) — the note is not hidden, it is 8.63 px

`logs/n2-park-chromium.json`, `logs/n2b-park-{chromium,webkit}.json`. Refuse a given, blur
(App.vue:774 refuses a bare `g` inside a cell input), press `g`, sample behind the park.

| at | 390×844 | 1280×800 |
|---|---|---|
| `boardStillInDom` | true | true |
| `checkVisibility()` on `.margin-note-ink` | **true** | **true** |
| `getClientRects().length` | **1** | **1** |
| `offsetParent === null` | false | false |
| ink box | 71.8 × 13.6 | 59.4 × 11.2 |
| cumulative scale | **0.6519** | **0.4750** |
| effective font size | **10.43 px** (from 16) | **8.63 px** (from 18.176) |
| the transform chain | `div.live-face-fit` `matrix(0.651877,…)` → `.outline-container` → `.game-card-deal` → `.game-card` | `div.live-face-fit` `matrix(0.474976,…)` → same |
| sentence at 3.7 s | `""` | `""` |
| sentence after cancel | `""` | `""` |

Both engines, identical to three decimals.

**Two corrections this forces.**

- **Pass-1 research §7's "0 × 0, neither painted nor in the a11y tree" is the PRM arm only.**
  `enterGallery` (`App.vue:606`) returns early under `reducedMotion` with a same-frame
  `openGallery` (the `v-show` park). With motion on, beat 1 folds the LIVE board into the centre
  card and the margin strip rides along, painted, at 47–65 % linear scale.
- **G9 is false for a refusal at BOTH widths**, and the mechanism is not "the timer fires behind
  a curtain" — it is "the timer fires against a line that is on screen at 8.63 px".

**The cure to specify — the park is a WRITER, not a pause.** A pause needs remaining-time
bookkeeping and a new signal; a retraction needs one watch and states the truth: a refusal
answered a keystroke on THIS board, and a sentence shrunk to 8.63 px inside a deck card is not a
message any more. The seam already exists in the shape the estate uses for `leaving`:

```
App.vue:89-93   const Scene: FunctionalComponent<{ leaving?: boolean }, …>
App.vue:864     <component :is="sceneFor(scene)" v-show="view === 'playing'" :leaving="leaving" …>
```

`:parked="view !== 'playing'"` is the same expression the `v-show` already evaluates; it rides
the same functional-component seam through `GameShell` (which already forwards `:leaving`,
GameShell.vue:51/153) to `GameBoard`. **Cost: one prop, two files, zero new mechanics** (W2's
landed mechanics untouched).

**The no-prop fallback**, if the synthesizer will not spend the prop: at fire time, check
`inkEl.getClientRects().length === 0` and re-arm one beat later. Measured above, that predicate
is **FALSE under a park** — the note has a rect — so the fallback does **not** work on this
estate. `offsetParent`, `checkVisibility()` and `display` all read visible too. Stated so nobody
re-invents it.

**G9, re-stated per voice** (it was one assertion over two different lives):

- **G9a (hint).** `g`, then cancel → the same sentence at the same box. Measured GREEN, both
  engines, 1280: `"5 goes nowhere else in this row"` at 213 × 23.6 → 101.2 × 11.2 parked →
  **213 × 23.6 restored** (`logs/n6b-{chromium,webkit}.json`).
- **G9b (refusal).** `g`, then cancel → **`""`**, and it must be `""` *because the park wrote it*,
  not because a clock fired behind the deck. Assert the retraction lands within one rub-out of
  the park, not at `refusalHoldBeats`.

**One risk the cure carries, with its mechanism.** A retraction under the park plays a
`<Transition>` leave on a transform-scaled subtree; CSS animations on it still run (the element
is not `display:none`), and Vue resolves the leave by `whenTransitionEnds`' duration timeout in
any case, so no node leaks. No new fill, no new filter.

---

## 3 · THE SEAM'S DEFAULT (charter row 3) — make it required, and the compiler names six sites

`origin: WriteOrigin = "self"` on both primitives is the masked fallback. Making the parameter
**required** (drop the `= "self"`) errors at exactly six call sites, each of which is a real
decision:

| site | today | what it is |
|---|---|---|
| `useGameState.ts:298` | `applyCellValue(pos, value)` | the undo/redo **replay** → `"self"` |
| `useGameState.ts:301` | `applyHintInk(pos, value)` | the undo replay of hint ink → `"self"` |
| `useGameState.ts:375` | `applyHintInk(…, "peer")` / `applyCellValue(…, "peer")` | the **wire** (pass-1 already passes it) |
| `useGameState.ts:500` | `applyCellValue(pos, value)` inside `setCell` | a keystroke → `"self"` |
| `useGameState.ts:735` | `applyHintInk(pos, val)` inside `inkReveal` | your own H press → `"self"` |

Typing `sessionSource` does **not** do this on its own: `SessionSource`
(`useSession.ts:215-217`) is `applyValue: (pos, value, solved) => void`, and `registerSessionSource`
checks it structurally — an object literal that forgot the origin would still satisfy it. The
enforcement has to be on the primitives. Belt-and-braces, if the synthesizer wants both:
annotate the literal `const sessionSource: SessionSource = { … }` (`useGameState.ts:373`) so the
seam is nominally typed as well.

---

## 4 · THE QUIET RUNG'S SEVENTH CONSUMER (charter row 4) — the gate already has the shape

`scripts/check-ink-pressure.mjs` (830 lines). Why the census is blind: **every ship-4 row resolves
against `--color-card`** (`:367`, `:779`, `:820`), and the `SHIP4` table (`:399-441`) is a
*source* census — selector → declaration → token — over five rules, with the count pinned at six
by the self-test (`:730-736`, `covered.size !== 6`). The settled note is painted on
`--color-background`, so no row of that table can price it.

**The primitive to reuse is already in the file: `TAPE` / `gateTape` (`:495-534`).** It is a
token + ink + **surface** + floor tuple that composites the ground and reds under the floor —
exactly the shape a surface not painted on the card needs:

```js
const TAPE = { token: "--sheet-washi-neutral", ink: "--color-foreground",
               surface: "--color-card", floor: 4.5, consumers: "SheetWashiLabel.vue:92, …" };
```

**The row to propose — ONE row, both note families** (registry §6.10):

```js
const NOTE_QUIET = {
  ink: "--ink-press-quiet",          // the rung, not a number
  surface: "--color-background",     // NOT the card: the strip is painted on the page
  floor: 4.5,                        // 1.4.3 text AA at 16px / 18.176px
  consumers: "MarginNote.vue .margin-note-ink[data-note-age='settled'] (NOTE-ERASE), " +
             "…the settled deictic record (NOTE-LEDGER)",
};
```

Token arithmetic, re-derived on this tree with no browser
(`probe/token-arithmetic.mjs`, graphite 68 % over `--color-background`):

| | light | dark |
|---|---|---|
| full graphite | 14.517 | 12.254 |
| **quiet 68 %** | **5.188** (`rgb(106,106,106)`) | **6.144** (`rgb(148,146,140)`) |
| teacher-red full / 68 % | 4.872 / 3.032 | 6.440 / 3.517 |
| gold full / 68 % | 4.850 / 2.703 | **11.478** / 5.758 |

The charter's `5.19 / 6.14` are the right figures; pass-1's `5.18 / 6.11` came from mixing the
resolved colour rather than reading the ramp's own token, and the Δ ≤ 0.04 is that, not a moving
rung. The verdict tones' 3.03 / 2.70 still forbid a settle by construction.

**A caveat the synthesizer must carry:** the self-test at `:730-736` pins the ship-4 census at
six surfaces. A `gateNote` written beside `gateTape` (its own function, its own closure) leaves
that six alone; a seventh *row in `SHIP4`* would red the self-test and force a second edit.
Propose the former.

---

## 5 · THE VERB (charter rows 5 and 6) — per-frame, and photographed live

### 5.1 The frame bar, measured on the same run as the states (row 5)

`logs/n3-frames-{chromium,webkit}.json` — an rAF train over the live retraction, reporting the
train's own median interval beside the clip states, so the bar is the engine's and not a guess.

| engine | median rAF interval | implied Hz | leaving frames | leaving window | **distinct clip states** | ⌊125 / interval⌋ |
|---|---|---|---|---|---|---|
| chromium | **8.4 ms** | 119 | 15 | 113.6 ms | **15** | 14 |
| webkit | **17.0 ms** | 58.8 | 8 | 117.0 ms | **8** | 7 |

**So the gate is per frame, not per number:**

> **G-verb.** `distinctClipStates ≥ ⌊rubOutMs / medianRafIntervalMs⌋`, both measured in the same
> run. chromium 15 ≥ 14 ✓ · webkit **8 ≥ 7** ✓.

webkit's eight is the 60 Hz raster's ceiling for a 125 ms verb, and the states are the curve's
own, not a sampler artefact: `0 · 1.68 · 3.28 · 8.49 · 21.65 · 28.99 · 49.45 · 84.33 %`.

### 5.2 The 125 ms argument, for MOT-LADDER (row 5)

**Hand MOT-LADDER this, and consume what §13 rules:**

- 125 ms **is** `MOTION.beatMs` (`pencilConfig.ts:123`) — the constant IS the beat, and the
  write-in is exactly two of them. Half the arrival is the erase asymmetry the family is about.
- It clears the frame bar on the slower engine with room (8 ≥ 7); there is **no per-frame
  argument for 200 ms**, only a ladder-parsimony one.
- The house's other erase verb is not the same object: `AnswerKeyLaminate.vue:225-226` lifts a
  full-bleed SHEET (opacity + transform, 200 ms); this rubs a LINE (clip + opacity). Sharing
  `--ease-accelIn` is the right kinship; sharing the duration is not entailed by it.

**If §13 rules 200 ms, the family consumes it and two things move, stated now so nobody
re-derives them:** the frame bar becomes ⌊200/17⌋ = **11** on webkit and ⌊200/8.4⌋ = **23** on
chromium; and the declared replacement latency goes from **+125 ms to +200 ms**, so the π
declaration ("+125 ms replacement latency is DECLARED — keep it so") must be restated at +200,
not silently kept.

### 5.3 The live mid-erase frame (row 6) — **CLOSED, both engines**

A wall-clock screenshot loop of the ink's exact rect during the verb, each raster measured for
its rightmost inked column against the settled reference (`logs/n4b-*.json`). The verb is
photographed, not paused:

| chromium (shot start) | 0 | 18 | 35 | 52 | **68** | **85** | 102 |
|---|---|---|---|---|---|---|---|
| width remaining | 1.000 | 0.971 | 0.923 | 0.837 | **0.664** | **0.462** | 0.164 |
| ink remaining | 1.000 | 0.961 | 0.905 | 0.812 | 0.637 | 0.384 | 0.095 |

| webkit (shot start) | 0 | **84** |
|---|---|---|
| width remaining | 1.000 | **0.634** |

**Banked, one per engine, inside the cap:**

- `frames/midErase-chromium.png` (954 B) — **46.2 % of the line left**, the hand caught mid-rub.
- `frames/midErase-webkit.png` (5,351 B) — **63.4 % left**.

And the pass-1 paused construction is **validated** by this: the live series interpolates
~0.75 at t = 62 ms against the paused frame's 0.858, inside the screenshot's own latency. The
gestalt claim ("86 % of the travel in the last ~50 ms") reproduces live: 0.837 → 0.164 between
52 ms and 102 ms.

---

## 6 · THE GOLD-DARK FIGURE (charter row 7) — reconciled, and the reader is the defect

| source | figure |
|---|---|
| spec §1 table | 11.48 |
| `index.css:382` token comment (`--color-crayon-gold`, "11.48:1 on dark paper") | 11.48 |
| prototype README G3 ("painted 12.46 dark") | 12.46 |

**Arithmetic, `probe/token-arithmetic.mjs`:** `#e5c74d` on `hsl(24 8% 6%)` = `rgb(17,15,14)` →
**11.478**. The spec and the comment are RIGHT. Nothing is stale.

**What 12.46 is.** `probe/star-arithmetic.mjs`: the inline star (`MarginNote.vue:63-75`,
`fill="#FDE68A"` at `fill-opacity="0.9"`) composited over the same paper is `rgb(229,209,126)` →
**12.520**. Pass-1's own banked reading
(`pass1/prototype/NOTE-ERASE/readings/p8-gold-chromium.json`) records
`inkCorePx: "rgb(230,208,125)"` — one unit per channel off the star, **and 48 units of blue off
the gold ink** (`rgb(229,199,77)`). The painted-byte reader takes "the 0.5th-percentile pixel
farthest from the modal paper pixel", and on the gold tone the farthest pixel is the **star**,
which is decorative, `aria-hidden`, and non-text.

**The reader, validated once against the ledger (the charter's ask).**

| tone | painted (pass 1) | arithmetic (this lane) | Δ |
|---|---|---|---|
| graphite quiet, light | 5.17 | 5.188 | 0.02 |
| graphite quiet, dark | 6.07 / 6.13 | 6.144 | ≤ 0.07 |
| teacher-red full, light / dark | 4.87 / 6.44 | 4.872 / 6.440 | 0.00 |
| **gold full, dark** | **12.46** | **11.478** | **0.98** |

The reader is accurate to ≤ 0.07 on every tone with no star and wrong by 0.98 on the one tone
that has one. **Fix to specify:** the reader validates its core against
`getComputedStyle(ink).color` and reds when any channel differs by more than ~12 — which would
have caught this (`|125 − 77| = 48`). Cropping past `.note-star`'s rect is not enough on its own
(`.note-star { overflow: visible }`, MarginNote.vue:~166).

**Two facts the synthesizer needs beside it.** At solve the margin block goes `is-quiet`
(`MarginNote.vue:~110`, the sr-only clip) in **light** at 1280 — pass-1's own p8 row records
`quiet: true` light, `quiet: false` dark — so **the gold tone has no light-mode painted witness
at all**, only the 4.850 arithmetic. And my own re-run (`logs/n5b-golddark-*.json`) landed
`quiet: true` in dark as well at the 4×4 default viewport, so any re-measurement must first
assert `is-quiet === false` or it reads bleed-through (2.17:1, both engines) and means nothing.

---

## 7 · THE HOLD (charter row 10) — the derivation, the band, and the SC

### 7.1 The reading-time derivation, from the house's own constants

The sentence is `that's a given clue` — **4 words, 19 characters**. Nothing may be read before
the last glyph lands, and nothing is read before the eye arrives at the strip.

```
hold ≥ writeInMs + noticeMs + words × msPerWord
```

| arm | writeIn | notice | rate | ms/word | total | beats |
|---|---|---|---|---|---|---|
| **fast** | 250 (`writeInBeats 2`) | 1000 (`settleAfterBeats 8` — the house's own "by now you have seen it") | 180 wpm | 333 | 2,582 ms | 20.7 → **24** |
| **slow** | 250 | 2000 (two settles) | 90 wpm | 667 | 4,918 ms | 39.3 → **40** |

Quantized up to the settle's own 8-beat grid, the two arms land on **24** and **40** — which is
the ballot band, derived rather than picked. So the answer to "the low end has no derivation" is
that both ends have one, and the band is the span between two defensible reading rates. **U-10
disposes; this lane supplies the derivation and the gate.**

### 7.2 The gate, so the number cannot drift under its own floor

> **G-hold.** `refusalHoldBeats × beatMs ≥ MOTION.note.writeInBeats × beatMs +
> MOTION.note.settleAfterBeats × beatMs + wordCount("that's a given clue") × 333`.
> At HEAD's values: 3000 ≥ 250 + 1000 + 1332 = **2582** ✓. A unit row, computed from `MOTION`
> and the string, so re-timing either end reds it.

### 7.3 The SC, cited

- **WCAG 2.2 SC 2.2.1 Timing Adjustable (Level A)** is the SC in question. Its exceptions —
  Real-time, Essential, 20 Hour — do not apply.
- The defensible position is that a `role="status"` line auto-dismissing is not a "time limit
  set by the content" **when the information remains obtainable**. On this estate it is: the
  given still shows, the cell still wears the shake, and **pressing the key again re-says it**.
- **That defence is load-bearing on §1.** Today, pressing the key again does **not** re-say it
  (0 mutations at HEAD; a silent re-render on the pass-1 build). So the WCAG answer to the
  refusal clock is only valid once the repeat speaks — the two rows are one row, and the spec
  must say so instead of asserting 2.2.1 in a sentence.
- **SC 4.1.3 Status Messages (AA)** is what the repeat cure actually serves.
- Background only, deciding nothing: scottohara.me's toast piece, `w3c/wcag#976`, Primer's
  notification pattern — all point the same way the measurements do.

---

## 8 · THE RETRACTION SET (charter row 11) — there are three shapes, not eight

The charter asks for "the other six `becauseCells` shapes". **They cannot reach the margin.**

`techniqueEngine.ts` mints `becauseCells` at nine sites across **two unrelated interfaces**:

| interface | site | shape | size |
|---|---|---|---|
| `Deduction` | `:175` naked-single | `[cell]` | 1 |
| `Deduction` | `:205` hidden-single | `[...house.cells]` | n |
| `Deduction` | `:245` naked-pair / triple | `subsetCells` | 2–3 |
| `Deduction` | `:291` pointing / box-line | `vCells` | 2–n |
| `Deduction` | `:351` x-wing | `[...baseCells]` | 4 |
| `Deduction` | `:410` inequality-forcing | `[greater, lesser]` | 2 |
| `Deduction` | `:490` inequality-chain | `chainComponent(...)` | 2–n |
| **`HintResult`** | `:738` `hiddenSingleForCell` | `[...house.cells]` | **n** |
| **`HintResult`** | `:769` `asNaked` | `[cell]` | **1** |

`hintReasoning` is `ref<HintResult | null>` (`useGameState.ts:272`), `domain.hint` returns
`HintResult | null` (`defineGame.ts:170`), and `HintResult.technique` is the closed union
`"naked-single" | "hidden-single" | "reveal"` (`techniqueEngine.ts:707-709`). The `"reveal"`
fallback is constructed at `useGameState.ts:828-833` with `becauseCells: [pos]`. **`Deduction` has
no consumer outside `techniqueEngine.ts` and its tests** (grepped).

So the peer-write retraction set is **exactly {1, n}**:

| board | n (a house's size) | naked single / reveal | hidden single |
|---|---|---|---|
| 4×4 | 4 | 1 | **4** |
| 9×9 | 9 | 1 | **9** |
| 16×16 | 16 | 1 | **16** |

and n is the house size at every game, because `boardHouses` builds rows + cols (+ boxes for the
boxed games) each of `side` cells (`techniqueAdapter.ts:48-75`). **Worst case: 16 of 256 squares,
6.25 %** — smaller as a fraction than the 9-of-81 (11.1 %) case pass 1 worried about. Risk 3 in
the pass-1 record ("nine squares… on a busy board most peer writes will still land inside
somebody's argument") is **overstated by measurement**, and the fix is a sentence, not a design.

---

## 9 · THE SMALL ROWS, each closed to a line

### 9.1 `.margin-note-meta`'s 250 ms and the `:13` comment (row 8)

`MarginNote.vue` carries the literal **four** times, not once:

| line | text |
|---|---|
| **13** | header comment: "Text writes in with a 250ms clip-path wipe" |
| **25** | header comment: "wipes in with the note's own 250ms clip-path write-in" |
| 149 | `.margin-note-ink { animation: ink-write-in 250ms … }` — **the only one pass 1 killed** |
| **180** | `.margin-note-meta { animation: ink-write-in 250ms … }` |

R6 law 4 is broken three more times inside the file the plan claims brings the timing home.
`.margin-note-meta` takes the same `v-bind(--note-write-ms)`; the two comments say "two beats"
and point at `MOTION.note.writeInBeats`.

### 9.2 The `--ease-accelIn` roll-call (row 9)

The comment to update is `index.css:341-344`. The tree's consumers, grepped whole:

| site | surface |
|---|---|
| `AnswerKeyLaminate.vue:225` + `:226` | the laminate's lift-away (two declarations) |
| `ScribbleLoader.vue:98` | the loader |
| `DarkModeToggle.vue:795` | the toggle |
| **`index.css:1036`** | `@keyframes bloom-out`'s 25 % plateau → **`.celebration-star.is-bloom`** (`CelebrationStar.vue:132`) |

**Five surfaces, six declarations today; six and seven with the rub-out.** Pass-1's diff named
four. (`useJoinWash.ts:142` is prose, not a consumer.)

**And the block argues against itself.** `index.css:336-338`: *"Site counts are census output —
`grep -rc "var(--ease-"` at a gate — and are not maintained here: a hand-kept column drifted
stale twice."* The roll-call is the same hand-kept prose in a different sentence, and it has now
drifted twice more. **Recommend: delete the enumeration**, keep the role sentence ("one role
token, not a laminate-scoped mis-name"), and let the census say who consumes it. If §13 prefers
to keep it, it names `bloom-out`/the celebration star AND the note, and the count stays out.

### 9.3 `setMargin`'s `nextTick` race (row 12) — one counter closes it with §1

Measured: both ref writes land in a single observer delivery, so a writer arriving in the same
tick is overwritten by the stale sentence with nothing to see it happen. The same monotonic
write sequence that fixes the `:key` guards the deferred write:

```
let writeSeq = 0;
function setMargin(text, tone) {
  const seq = ++writeSeq;                       // the key AND the guard
  …
  if (text && text === marginText.value) {
    marginText.value = "";
    repeatTimer = setTimeout(() => {            // cancellable, ≥ rubOutMs + 1 frame
      if (seq !== writeSeq) return;             // a later writer won: drop the stale re-write
      marginText.value = text; marginTone.value = tone;
    }, MOTION.note.rubOutBeats * MOTION.beatMs + 17);
    return;
  }
  …
}
```

Cleared by `clearRefusalHold`'s sibling on unmount and on every writer.

### 9.4 Testimony (row 13)

- **G9's deal half at 1280 — CLOSED.** Pass-1's P6 failed because it looked for
  `:has-text("Deal")` at 390, where the drawer is closed. The control is
  **`button[aria-label="Deal a new board"]`, `class="icon-btn deal-btn group relative"`**, visible
  at 1280 (`logs/n6b-*.json`). Park → cancel → Deal → the strip reads `""`, **both engines**.
- **The goldens and G3.2's live half are BLOCKED, and the blocker is named.** They need a built
  dist, and the campaign's own standing order freezes it: W8 §8.1's attribution run is pinned to
  `index-9rZPzI5DEcpe.js` and **no `npm run build` may run while it does**. Do not run them in
  this pass; book them for WGATE's rebuild.
  What can be said without building: the golden corpus is **four surfaces × two platforms** —
  `cell-light`, `grid-corner-light`, `logo-light`, `toggle-crest-dark` — and **none contains the
  margin note**, while the family's `index.css` delta is two added keyframes plus a comment.
  A DELTA of none is the honest declaration; the artifact is owed at WGATE, not here.
- **No device (M19).** Everything above is headless chromium + webkit.

### 9.5 Housekeeping (row 14)

`r0/` is **clean in the main tree at this moment** (`git status` on `loop/r0/` returns nothing) —
pass 1's overwrite was restored. `hue-census.probe.ts:23-24` still banks to an **absolute r0
path**. This lane **did not run it** (it mints no token and reads no accent), and has banked the
copy with `OUT` re-pointed into this directory at
`instruments/hue-census.probe.ts` (with `oklch.ts` beside it) so the next lane in this section
runs the copy, never r0's. **r0 row: NOT MOVED by this lane.**

---

## 10 · THE GRAFTS, taken

| graft | what this lane measured / owes |
|---|---|
| **NOTE-LEDGER's kind tag** (`record \| grade \| state \| empty`) | Takes cleanly: the four writers map `hint → record`, `verdict/solved → grade`, `receipts → state`, `""` → `empty`, and the **refusal is a fifth kind** — a `reply`, the only one that ages. The ageing gate the family already has (`tone === "graphite"`) is a proxy for the kind; the tag replaces it and is the honest predicate. |
| **the deal RE-DEAL model hole** | My deal row is GREEN, measured, both engines, at 1280: Deal → `""` (`logs/n6b-*.json`). And the board voice **did** speak on two identical deals in the same run (`["", line, "", line]`, both engines) — so on the Deal-button path the 0→N hole did not reproduce on this build. NOTE-LEDGER's hole is about the givens watch, a different path; reported as data, not as a refutation. |
| **the flush-post sampling trap** | Confirmed and generalised: a `flush: "post"` write and a `nextTick` write land in the SAME MutationObserver delivery, so any sampler that reads the region in the callback sees only the last value. **Sample the trajectory, never the endpoint.** |
| **MOT-VERB's RUB OUT rest-pose keyframe** | Not needed at 125 ms: the node is removed, so there is no rest pose. If §13 rules 200 ms the keyframes are unchanged — only `--note-rub-ms` moves (see §5.2 for what else moves with it). |
| **MOT-LADDER's PRM at `:root`** | **A collision to state.** The note's PRM collapse is load-bearing on `animation: none !important` reaching `.margin-note-ink` by name (`index.css:1157-1171`): Vue reads the element's computed duration, gets 0, and removes the node same-frame. If PRM re-homes to a `:root` scale token, `.margin-note-ink` keeps a non-zero computed duration and **the note hangs for a beat for exactly the readers who asked for less motion**. Whatever §13 lands must keep a rule that zeroes this element's animation duration, or the family ships its own PRM arm. |

**What this lane hands out:** `WriteOrigin` ("the margin speaks TO THE READER") to PLR-*,
MRK-LIVE and the receipts, now with the six-call-site enforcement in §3; `transition: none` on a
leaving element to MOT-VERB, MRK-WASH's heirs and CTRL-TAPE; the **rAF train with its own median
interval beside the states** (§5.1) to the wave, so a state-count bar is always the engine's;
and the **mutation-time trajectory** (§1.5) as the wave's replacement for MutationObserver record
counts.

---

## 11 · ASCII — the three things a synthesizer draws

**(a) Why the repeat is silent, and what the cure changes**

```
TODAY (pass-1 build)                       CURED
key = "that's a given clue"                key = ++writeSeq
                                           
region: [span "…given clue"]               region: [span "…given clue"]
  setMargin(same) → text=""                  setMargin(same) → text=""
  leave STARTS                               leave STARTS  (keys differ → no early-remove)
  |                                          |  rub-out plays, 1 beat
  beforeEnter: key matches                   |  leave ENDS, span REMOVED
  → leavingVNode.el[leaveCbKey]()          region: []            ◄── the empty an AT can hear
  → leave CANCELLED, span re-used            |  timer (rubOutMs+1f, cancellable, seq-guarded)
region: [span "…given clue"]               region: [span "…given clue"]  write-in, 2 beats

trajectory: [X, X, X]   ← cannot fail      trajectory: [X, "", X]   ← fails today
```

**(b) What a park really is** (numbers from §2)

```
  ON THE BOARD                     PARKED (g, motion on)          PARKED (g, PRM)
  ┌────────────────────┐           ┌──── game-card ────┐          app-layout v-show:false
  │ that's a given clue│           │ ┌ live-face-fit ┐ │
  │ 18.176px, 125×23.6 │   ──▶     │ │ that's a giv… │ │   vs     (no fold, 0×0,
  └────────────────────┘           │ │ 8.63px, 59×11 │ │          not painted)
   checkVisibility true            │ └───────────────┘ │
   rects 1                         └───────────────────┘
                                    checkVisibility TRUE, rects 1, offsetParent NOT null
                                    → no DOM predicate can tell you it is parked
                                    → the park must SAY so (:parked, App.vue:864's own expression)
```

**(c) The verb, photographed** (live rasters, §5.3)

```
 t=0    |only 8 fits here|   1.000 ─┐
 t=35   |only 8 fits he  |   0.923  │  86% of the travel
 t=52   |only 8 fits     |   0.837  │  lands in the last ~50ms
 t=68   |only 8 fi       |   0.664  │  (--ease-accelIn)
 t=85   |only 8          |   0.462 ◄── frames/midErase-chromium.png (954 B)
 t=102  |onl             |   0.164  │
 t=125  ||                   node REMOVED (no fill, no allowlist row)  ─┘
 webkit: 8 distinct clip states over 117ms of leaving frames — ⌊125/17⌋ = 7. The bar is the raster's.
```

---

## 12 · RISKS AND OPEN EDGES

1. **The repeat's empty re-opens the announcement hole on purpose.** For ~1 beat the region is
   `""`. That is the mechanism, not a defect — but it means the critic's C1 strength ("out-in
   opens no announcement hole") now holds only for a *replacement*. Say so in the spec.
2. **The AT claim is still untested.** The trajectory gate proves the DOM; NVDA/VoiceOver
   coalescing is a device row (M19).
3. **The park cure costs a prop through two files.** The no-prop fallbacks were measured and all
   fail (§2): under the fold the note has a rect, an offsetParent and `checkVisibility() === true`.
4. **G9b changes what a reader gets back.** Park with a refusal standing and it is gone on
   return. That is the design's claim (a reply whose act is over), but it is a behaviour change
   the owner's eye should see at the re-look, not a silent one.
5. **The duration is §13's to rule and two numbers move with it** (§5.2): the per-frame bar and
   the declared replacement latency.
6. **MOT-LADDER's PRM re-home can make the note immortal under PRM** (§10). The single most
   dangerous cross-family coupling this family has.
7. **The painted-byte reader is wrong on any tone carrying non-text ink inside the text's own
   box.** The gold star is the instance found; a future inline mark would do it again. The
   computed-colour cross-check (§6) is the class fix, and it belongs to whoever owns the reader,
   not only to this family.
8. **The goldens and G3.2's live half stay owed** until the W8 §8.1 dist freeze lifts (§9.4).
9. **The `is-quiet` state hides the margin at solve**, so gold has no light-mode painted witness
   at all. Any gate on a verdict tone must assert `is-quiet === false` first or it measures
   bleed-through (2.17:1, both engines, measured).
10. **filterBudget 9 exact, π, M16, AA both themes:** nothing in this lane's findings adds a
    filter, a string, a chromatic token or a layout box. The family's own π declaration is
    unchanged except as §5.2 notes.

---

## 13 · FILES

```
probe/pw.config.ts              scratch playwright config (baseURL only, :4248)
probe/vite.scratch.config.mjs   private vite cacheDir (the law's two-line spread)
probe/ne2.probe.ts              N1 repeat · N2 park · N3 frames · N4 mid-erase · N5 gold · N6 g9
probe/ne2b.probe.ts             N4b exact-rect mid-erase · N2b park detail · N6b g9@1280 · N5b gold dark
probe/token-arithmetic.mjs      the ramp, the tones, both themes, no browser
probe/star-arithmetic.mjs       the inline star composited — the 12.46 reconciliation
instruments/hue-census.probe.ts r0's probe, OUT RE-POINTED here (copied, NOT run; r0 NOT MOVED)
logs/*.json                     18 readings, chromium + webkit
frames/midErase-chromium.png    954 B — 46.2% of the line left, LIVE
frames/midErase-webkit.png      5,351 B — 63.4% left, LIVE
```

Stale logs: none banked. The pass-1 worktree was read only; its `git status` is byte-identical
to its pass-1 state and the private vite cache was removed. The dev server on :4248 is killed.
