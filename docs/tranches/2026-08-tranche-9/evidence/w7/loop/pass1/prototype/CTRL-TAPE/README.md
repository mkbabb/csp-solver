# T9-W7 pass 1 · PROTOTYPE · CTRL-TAPE — the taped case, on the real surface

Section §10 (§1 §2 §8 §14 §15 inside) · marks M01 M03 M04 M05 M12 M13.
**The spec is BUILT, not overlaid.** Every figure below is read off a source patch running in a
throwaway worktree, chromium and webkit, on `127.0.0.1:4244`. Nothing closes here (U-10).

    WORKTREE   /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-37
    BRANCH     worktree-wf_e58b4764-0fc-37 (on HEAD aab67b92) · NOT COMMITTED — read `git -C <worktree> diff`
    DIFF       17 files, +740 / −218
    REPLAY     npx vite --host 127.0.0.1 --port 4244 --strictPort     (from web/frontend)
               node probe/ctrl-tape.probe.mjs        · gunzip -k readings/readings-*.json.gz && node probe/digest.mjs
               node probe/ablate.mjs <out.json>      · node probe/ring-and-pin.mjs <out.json>
               node probe/one-dimming.mjs <out.json> · node probe/acts.probe.mjs
               node probe/frames.mjs <framesdir>
               LANE_TESTDIR=./e2e-ctrltape PLAYWRIGHT_BASE_URL=http://127.0.0.1:4244 \
                 npx playwright test --config=pw.config.ts     (config + spec must sit in
                 web/frontend — a config in the docs tree cannot resolve `@playwright/test`)

---

## A · THE GATES, AT HEAD AND UNDER THE BUILD

`readings-before.json` is HEAD on my own server and reproduces the research's figures to the
hundredth; `readings-after.json` is the built patch. Both engines agree unless stated.

| gate | HEAD | BUILT | verdict |
|---|---|---|---|
| R1 ROW 1 · one voice tuple (5 cells) | **3** voices | **1** — `Patrick Hand · 25.89 · 500 · lowercase` | GREEN |
| R1 ROW 2 · every name a document heading | 2/8 | **8/8**, population still **8** | GREEN |
| R1 ROW 3 · name ÷ option ≥ 1.23 | 1.0175 dock · 1.1768 at 900×500 | **1.2945 at every cell** | GREEN |
| r0 `heading-voice.spec.ts` | 4 cells / 4 failed | **6 passed** (the 900×500 cell added beside) | GREEN |
| R7 I3 BAND row (the added, two-sided one) | 2 / 3 / 1 violations | **0 at all five scroll states, every cell** | GREEN |
| R7 I2 term 1 · the bar carries its own chrome | false | **true**, drawn 1.5, five cells | GREEN |
| bar `position` at 900×500 | relative | **sticky** | GREEN |
| the card's focus ring, painted bytes, 4 grounds | chromium 3.72 · **webkit 2.15** | worst **4.59** (wk light, chip); 4.66 / 15.84 / 19.45 elsewhere; dark 7.35–16.33 | GREEN |
| tab tape 44×44 BOTH dims | 44×44 and 50.38×44 (`min-width` absent) | **52.52×44 / 94.78×44**; controls: kill `min-width` → 12×44, kill `min-height` → 52.52×12 | GREEN |
| one dimming · the lifted word painted | — | **6.51 / 6.47 light · 5.48 / 5.40 dark**; double-dim control **2.63–2.77** | GREEN |
| R7 I4 · fill and solve ask first | Fill wrote 43/49 cells, Solve unguarded | **all four armed, `sure?`, 0 cells, no dialog** | GREEN (see §C·1) |
| the 390 seam ≥ 6.00px | **−2.73 / −3.02** | **+35.00 / +33.98** (375: +35.00/+34.48 · 430: +35.00/+33.98) | GREEN, over-spent (§C·2) |
| first tape ≥ 8px inside the dock card | 3.75 | **8.23 / 8.22** (desk & rail 21.53) | GREEN (§C·3) |
| `access.spec.ts` 2.1 / 2.2 / 2.3 | 12 passed | **12 passed** | HELD |
| filter census (`url()` population, by id) | 24 | **24**, identical composition at 3 cells × 2 engines | HELD |
| card width at five cells | 390 · 324.22 · 224 · 330 · 900 | **byte-identical** | HELD |
| masthead-to-board gap | 7.00 / 6.41 | **7.00 / 6.41** | HELD |
| `check-copy-register` | 1 admitted (`candidates`) | **0 unadmitted, the admission STRUCK** | GREEN |
| `check-font-coverage` | OK | **OK** — and it reddened first (§C·4) | GREEN |
| `vue-tsc` · unit battery | — | **0 errors · 811/811** (810 at head + 1 new row) | GREEN |
| the iPad coarse seal | 1227.09 against 1227.5 | **1280.81 / 1280.69**, re-priced to **1283.5** by named ablation | RE-PRICED |

---

## B · THE HEIGHT, ITEMISED BY ABLATION (1280×800 coarse, both engines within 0.13px)

Each term is one declaration removed in-page and the same box re-read (`readings/ablate.json`).

| term | px |
|---|---|
| the eight names at 25.888 instead of 14.05 / 20.35 | **+41.72** |
| the row captions leaving their 3.75rem column for their own line | **+48.61** |
| the first well's `margin-top` at 2rem instead of 0.35rem | **+26.40** |
| the tape's `line-height` at 1.2 instead of 1.5 | **−62.12** |
| the wells' top padding at 0.35rem instead of 0.7rem | **−22.37** |
| the bar's drawn frame · Deal's drawn box | **0.00** each |

Base **1280.81**, head 1227.09, seal re-cut to **1283.5**. The terms do not sum to the base —
the stack and the rung share line boxes — so the base is measured, never added up.

**Two readings worth keeping.** A `HandDrawnOutline :pose="0"` is pre-baked geometry at an
outset: the fifth compartment and the one boxed control cost the card's height **nothing**. And
the spec's bar RESERVE is not in the tree: a sticky box already occupies its normal-flow slot,
so reserving its height is a second copy of a reservation the layout has. The research overlay's
`padding-bottom` cost **+64.81px** at this cell and bought **0.033** of burial. Not spent.

---

## C · WHAT THE SPEC SAID AND THE SURFACE DID NOT

### C·1 · The arming is IN the tree, not proxied

The spec expected the FACE only, behind a capture-phase guard, with W1 §1.5 owning the arm.
Building the face needed the arm anyway, so `useTwoTap` is a four-line factory and all four verbs
read it — Deal and Clear's shipped 2500ms timers come home to `MOTION.confirmWindowMs` with them.
I4 is GREEN in source at both engines. **This is W1's ruling to make**: if §1.5 lands a different
arm, this file loses ~20 lines and keeps its face.

### C·2 · The seam clears by 35px where 8 was asked

`--sheet-chrome: max(12rem, calc(var(--masthead-foot) + 8px))` clears the kill condition at every
portrait width — but by **35.00 / 34.48 / 33.98**, not 8. Two causes, both measured:

- the **reference is one term short**. The formula puts the SHEET's top 8px under the wordmark;
  the seam the mark is about is the CASE's drawn stroke, and the chrome reaches the card through
  its own cap, so the stroke lands elsewhere. `--sheet-chrome` resolves to 229.72 against a
  wordmark foot of 214.73 and a case stroke at 249.73.
- the published foot is the **SHUT pose's**. The observer watches the `<h1>`; the wordmark
  rescales inside it (`--logo-scale`), so the value banked at mount (221.73) is ~7px stale
  against the risen pose (214.73).

The cost is real: the card's client height at 390 reads **590** where the shipped chrome left
628. A second published term (the case's own offset from the sheet's top) closes it, and it is a
W2 §2.5 row like the publisher. **Named, not claimed.**

### C·3 · Two levers the spec named do not move what it said they move

- **`line-height: 1.2` does not buy the clip margin.** A pinned tape's top is
  `--card-pad-t + --washi-tag-top` less the tilt's bounding-box growth, and the leading is in
  none of those terms. Ablated on the real surface: 1.2 → 1.5 moved the first tape's clearance
  **1.04 → 1.04**; killing the tilt moved it to 2.41; only `--washi-tag-top` moved it at all.
  It is now `calc(0.6rem - var(--card-pad-t))` — 8px of margin plus the tilt's ~1.4px — which
  costs **zero height** at both regimes and loosens the pinned pose off the case edge by 7px.
  The leading still earns its place: it is worth **−62.12px** of card.
- **The well padding could not simply shrink.** −22.4px is real, but the crop found what no
  probe asked: the FIRST well sits close enough to the card's top that sticky CLAMPS its tape
  down into it (overhang 9.77 against the other three wells' 29.4–30.0), laying `new game`
  **19.07px on top of `size` and `level`** on the dock, 11.49 on the rail. `.tray-well:first-child`
  buys 2rem and the clamp releases. The other three wells clear by 2.1–2.7px and pay nothing.

### C·4 · "The font is free" is false, and the cure is a copy ruling

Moving `.section-heading` to the hand reddened `check-font-coverage` on its first run: the gate
requires BOTH cases of a transformed string and Patrick Hand's cut carries `{C,R,S}` alone, so
`Size` and `Level` wanted an `S`, a `B` and an `L`. Two exits — a woff2 re-cut for two capitals
(the T8 ransom note) or authoring the names in the case they paint in. The five `spec.ts` files
now say `size` / `level`, the gate is green, no byte of font moved. **It is a copy ruling and it
belongs to the owner (U-10)**; it is declared in the gate's own comment.
The class the research flagged is confirmed: this gate binds a string to a face by a hand-written
`where`, so a CSS-only face swap is invisible to it until someone edits the table.

### C·5 · Three declared deltas from the spec's letter

- **The half-life release is published in `publishFold`, not by an `IntersectionObserver`.** Same
  law, same 0.5 threshold, same rectangle the instrument reads — inside a pass that already runs
  rAF-coalesced on the card's scroll and already walks every tape. Four more rects in a pass that
  exists, against four observers that would have to agree with this one's root box to the pixel.
- **The row tape's tear is authored once, not seeded per instance.** The compartment tape's tear
  and tilt come from `SheetWashiLabel`'s seed; the four row tapes share one polygon at the
  component's median roll. Re-seeding them is the component's row to take.
- **The landscape quick set is the SHIPPED `.play-controls` row, teleported.** The spec drew three
  new tongues (`undo · redo · controls`). Building three new controls for two acts that already
  exist is the thing M13's fence forbids, and the estate already owns the mechanism: the row
  teleports into `#fold-tools` on the portrait dock, and into `#quick-set` on the tongue's flank
  in landscape. Measured: at 844×390 and 900×500 undo/redo go from unreachable to **0 taps, 0
  duplicated**, three 44×52.77 targets in a 44×158.3 strip, free board edge 322 / 296px. In
  portrait the tongue stands alone, 1 edge control, the ribbon's four acts at 0 taps, **0
  duplicated** — M13's fence firing on a number.

### C·6 · The one thing that broke and how it was found

`.controls-card :is(button, …):focus-visible` measured **inert**: Vue's scoped transform attached
the scope attribute to the FIRST compound (`.controls-card[data-v-…]`), and `.controls-card`
belongs to `GameScene`. The ring read WebKit's shipped 2.15:1 default for a full sweep before the
computed-style row caught it. `:deep(button:focus-visible)` compiles to `[data-v-…] button:…`,
reaches the chips inside `OptionSelector`, and the painted worst is 4.59:1. **A scoped rule that
starts at someone else's class is a dead rule** — worth a line in the wave's traps.

---

## D · FRAMES (crops, ≤58 KB each, 284 KB for ten)

| file | what it shows |
|---|---|
| `p1-dock390-dark-{chromium,webkit}.png` | 390×844 dark, sheet up — the eight tapes, `new game` and `pencils` astride their strokes, `size`/`level`/`marks`/`what fits` flat inside one gutter further in, the boxed `deal`, the wordmark clear of the case stroke |
| `p2-rail1440-scroll500-{…}.png` | the rail at R7's own `p7` pose — the tape at the top of the card names the group under the eye |
| `p3-land900-bar-{…}.png` | 900×500 sheet up — the bar sticky, drawn at the wells' 1.5 |
| `p4-dock390-tabs-{…}.png` | the two row tapes, pressed (0°, full ink) and lifted (1.5°, 0.68, value word at its right end) |
| `p5-land844-quickset-{…}.png` | the landscape flank — the play row on the tongue's edge |

**The critique's one question stands unanswered here** (it needs a reader, not a probe): put
`p1` in front of someone and ask which of the eight names are groups. The second axis is 12px of
inset plus one crossed stroke; the crop shows both, and whether that is enough is the thing to
test.

---

## E · GAPS, PLAINLY

1. **The seam over-spends 27px of sheet height** at every portrait width (§C·2). Clears its
   gate, costs the card 38px at 390. Needs one more published term.
2. **`--masthead-foot` is stale by ~7px** — the observer is on the `<h1>`, the ink rescales
   inside it. A second observer on `logoMenu.$el`, or a re-publish on the drawer's settle.
3. **M04 term 2 is not closed and is not claimed.** Worst visible burial after the build:
   0.874 dock / 0.078 desk / 0.121 coarse / 0.275 rail / 0.182 landscape. The landscape arm buys
   the bar its scrollport and brings 0 → 0.182 with it. Closing it needs the bar OUT of the
   scrollport — W2 layout.
4. **`.zone-row`'s `flex-wrap: wrap` died with the row pose.** No wrap is possible in a column;
   nothing measured moved, but it is a deletion nobody asked for.
5. **The quick set carries three acts, not the spec's two-plus-tongue** — undo · redo · hint,
   because it is the shipped row and the row has four members (peek is portrait-only). Whether
   `hint` belongs on the flank is a disposition.
6. **The e2e estate is unrun.** `zone-grammar`, `visual-regression` (beyond test 10's re-price),
   the goldens and `font-census` were not executed here — the lane ran the r0 instrument,
   `access.spec.ts` and its own probes. The goldens' inputs (card width, filter census,
   masthead gap) are all measured unmoved, but that is an argument, not a run.
7. **`--type-name` has one consumer per rank and no test pins the four non-names.** `--type-tag`
   is measured unmoved at 14.00 / 14.05 / 14.38 on `.heading-value` and `.players-status` at
   every cell, but nothing would red if a later hand re-pointed it.
