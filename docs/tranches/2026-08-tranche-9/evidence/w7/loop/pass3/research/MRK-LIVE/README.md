# PASS-3 RESEARCH · MRK-LIVE · The living mark (§5/§6 leader)

Read-only lane. Every number below was taken by THIS run against the **HEAD control at
`74a2b5d9`** — a private dev server on `127.0.0.1:4238` with its own `cacheDir` in the session
scratchpad, killed before this file was written (port verified free). No product file was
touched; the pass-2 worktree was read, never edited; nothing under `loop/r0/`, `loop/pass1/` or
`loop/pass2/` was written.

- Probes: `probe/motion.probe.ts`, `probe/stops.probe.ts`, configs `probe/vite.head.config.ts`
  and `probe/pw.head.config.ts`.
- Readings: `readings/A-travel-{chromium,webkit}.json`, `readings/C-tiers-*.json`,
  `readings/E-stops-*.json`, `readings/law-probe-74a2b5d9.txt`.
- Copied r0 instrument, re-pointed: `instruments/law-probe.COPY.mjs` (OUT → `readings/`).
- Zero crops cut. Numbers and text only.

---

## 0 · The headline: the critique's cure does not fire

The pass-2 critique's gap 1 says *"re-arm `settle()` on a `transitionend`/`animationend` from the
target or its ancestors (the estate's one-shots all end in one)"*. **They do not.** Measured at
HEAD, pressing `.drawer-tab` with focus resident on it:

| reading | chromium | webkit |
|---|---|---|
| travel with focus resident (`stillFocused: true`, `:focus-visible` true) | **190.11px** | **194.16px** |
| `transitionend` / `animationend` on the tab **or any ancestor** | **0** | **0** |
| events fired anywhere in the document, 1.6s window | 3 (`clip-path`, `visibility` ×2 — off the tab's path) | 3 (same) |
| animations on the tab's path, peak | **2** | **2** |
| what they are | `div.board-peek-host` **waapi**, `button.drawer-tab` **waapi** | identical |
| their duration / easing | **520ms** / `cubic-bezier(0.32, 0.72, 0, 1)` | identical |
| first visible to `getAnimations()` | t = **7ms** | t = **3ms** |
| last rect change after the press | t = **515ms** | t = **516ms** |
| `document.getAnimations().length` at rest | **1** | **1** |

`readings/A-travel-chromium.json`, `readings/A-travel-webkit.json`.

The mechanism is in the source and the measurement agrees: the drawer glide is a **WAAPI FLIP**,
never a CSS transition — `useControlsDrawer.ts:86` `GLIDE_MS = 520`, `:232` `useFlipGlide({
durationMs: GLIDE_MS })`, `:281-311` the four movers (worksheet, case, **the tab's own
counter-scale**, masthead), `useFlipGlide.ts:164` `spec.el.animate([...])`. A WAAPI animation
fires `finish`/`cancel` on the `Animation`, not `transitionend`/`animationend` on the element.
**A listener-based cure is green-and-inert on the one motion that produced the defect.**

Two further numbers the synthesizer must carry:

1. **The prototype's settle bound already fails even with a correct re-arm.** `FocusRing.vue:125`
   bounds the rAF loop at `MOTION.boardFoldMs` = **520ms** (`pencilConfig.ts:157`) and requires
   `stable >= 3` frames (`:128-129`). The last rect change lands at **515/516ms**; three stable
   frames after it land at ≈**565ms** on a 60Hz box — **~45ms past the bound**, and earlier still
   on a 120Hz box where the loop's own frames are cheaper but the bound is the same wall clock.
   The bound must become the glide's own clock (`GLIDE_MS + the never-never guard 220` = **740**,
   `useControlsDrawer.ts:229`) or, better, must not be a duration at all.
2. **`document.getAnimations().length > 0` is not an "in motion" test** — it reads **1** on a
   resting board in both engines. The filter must be by target path (peak 2 there), which is
   exactly the shape `App.vue:427` already uses: `host.getAnimations({ subtree: true })`.

**The estate already owns the right primitive, twice**: `useFlipGlide.ts:179`
`Promise.allSettled(movers.map((m) => m.anim.finished))`, and `App.vue:400-427`'s
`document.getAnimations()` / `getAnimations({subtree:true})` forensics. `useFlipGlide` also
exposes `onSettle` (`:96`, `:145-151`) — but a ring that subscribes to the *drawer* is coupled to
one mechanic; the general form is the animation set on the target's own ancestor chain.

---

## 1 · The surfaces and tokens this family touches, at HEAD

### 1.1 The six bespoke outline rules the one ring replaces (measured, both engines)

Every rule below is a `:focus-visible` rule that **declares an outline** at `74a2b5d9`
(`grep`-verified, one pass over `src/`):

| # | file:line | declaration |
|---|---|---|
| 1 | `DrawerTab.vue:151` | `outline: 2px dashed currentColor; outline-offset: 3px` |
| 2 | `HandwrittenLogo.vue:544` | `outline: 2px solid color-mix(in srgb, var(--color-foreground) 40%, transparent)` |
| 3 | `StagingBand.vue:431` (`.staging-face`; the button itself is `outline: none` at `:427`) | `2px solid color-mix(… 45%)` |
| 4 | `GameCard.vue:436` (`.gallery-viewport:focus-visible .game-card.is-center`) | `2px solid color-mix(… 40%)` |
| 5 | `GameGallery.vue:1450` (`.guard-face`; `.guard-btn:focus-visible` is `outline: none` at `:1446`) | `2px solid color-mix(… 45%)` |
| 6 | `DarkModeToggle.vue:740` | `outline: 2px solid var(--color-ring)`, offset `calc(2px - var(--toggle-bleed, 0px))` |

Plus the forced-colors rule at `gameCell.css:353` (`2px solid Highlight`, offset `-2px`) — not a
normal-mode ring, and a floor the drawn ring must keep — and the global sweep at
`index.css:445` `* { @apply border-border outline-ring/50 }`.

**Computed, by programmatic focus, both engines** (`readings/E-stops-*.json`):

```
.sun-moon-toggle      button 104x104      solid 2px  off=54px   fv=true
.logo-trigger         button 425.58x111.92 (wk 423.72) solid 2px off=4px fv=true
.drawer-tab           button 48x92        dashed 2px off=3px    fv=true
.attribution-trigger  button 75.53x39.75  auto 1px (wk 3px) off=0  fv=true
.ctrl-btn             button 268.22x38 (wk 276.31x38) auto 1px (wk 3px) fv=true
.icon-btn             button 71.19x72.8   auto 1px (wk 3px)     fv=true
.info-btn             button 32x32        auto 1px (wk 3px)     fv=true
a[href]  (masthead)   a 45.37x17.10 (wk 45.36x16.53)  outline-style: NONE   fv=FALSE
input.cell-native-input input 70.66x70.66 outline-style: none   fv=true   (the board's own hand)
```

Three facts fall out that no prior pass banked:

- **`--focus-ring-outset` reads the empty string at every stop.** It does not exist at HEAD, and
  the estate has **zero `@property` registrations anywhere in `src/`** (grep, whole tree). The
  prototype's `index.css:456` registration would be the estate's **first** — which makes it the
  natural landing site for chair §6.5's no-fallback law, not a bespoke seam.
- **The UA ring is 1px in chromium and 3px in webkit** on the four `auto` stops — R3's "the
  product has no focus look" re-measured at the new base, with the engine spread named.
- **The masthead `<a>`s compute `outline-style: none` and do not match `:focus-visible` under
  programmatic focus in either engine.** Two shipped stops have no indicator on that route today.

### 1.2 The modality reading that the estate's own comments contradict

`gameCell.css:243` claims *"a mouse click keeps the instant graphite tier and only keyboard focus
gets the drawn-on ring"*; `:315` claims *"tap = no ring, key = ring"*. R3's round-zero census
measured the opposite in both engines (`r0/r3-marks/logs/click-*.json`, `phone-*.json`): the
focus target is an `<input type="text">`, which always matches `:focus-visible`, so a click, a
click-then-move and an arrow key all paint tier 2. **Tier 1 graphite paints only on hover without
focus.** Nothing in this run moved that; it is carried as a cite, and it is a §2.5 row — MRK-LIVE
owns "the header must agree with its rules", and these two headers do not.

The converse reading is this lane's own and it cuts the other way:
`GameControlPanel.vue:1606` records *"the drawer's programmatic focus is `:focus-within` true /
`:focus-visible` FALSE"*, and R3 says *"programmatic focus does not match `:focus-visible` on a
button in either engine"*. **Measured here on a freshly loaded page with no prior pointer
interaction: every button reads `fv=true`** (`readings/E-stops-*.json`). Both readings are true —
`:focus-visible` on a programmatic focus follows the *last input modality*, so the ring's gate
(`FocusRing.vue:150` `a.matches(":focus-visible")`) paints or does not depending on how the
reader arrived. A born-RED row must pin **both** modalities at the same seam (pointer-then-
programmatic, and cold-then-programmatic), or the gate is a coin toss the spec never declared.

### 1.3 `:focus-visible` is also load-bearing STATE, not only paint

Five rules consume the pseudo-class for something other than a ring. Deleting six rings must not
touch them:

- `SheetWashiLabel.vue:121` `.group:focus-visible .washi-label` — the keyboard's tooltip reveal
  (`:8` "closing the pure-pencil keyboard-tooltip gap").
- `GameControlPanel.vue:1611` `.tray-well:has(:focus-visible) > .zone-hint`.
- `GameControlPanel.vue:2162` `.control-panel-wrap:has(.invite-btn:focus-visible) .berth-note`.
- `GameGallery.vue:1193` + `GameCard.vue:436` — the deck's state/paint split (state on the
  scrollport, paint on the option).
- `gameCell.css:245` tier 2 itself.

### 1.4 The four-tier rank, measured — §2.5's table

`readings/C-tiers-{chromium,webkit}.json`, **byte-identical between engines**, cell 40 on a 9×9:

| tier | selector · line | width | stroke-opacity | fill-opacity | ink (computed) | `prefers-contrast: more` |
|---|---|---|---|---|---|---|
| 1 hover/base | `.cell-ghost-path` · `gameCell.css:189-196` | 5 | **0.65** | 0.06 | `rgb(38,38,38)` graphite | **0.9** (`:331`) |
| 4 peer cursor | `.game-cell.is-peer-cursor .cell-ghost-path` · `:229-236` | 4 | **0.55** | 0.04 | `rgb(37,99,235)` (the `--color-user-ink` fallback — solo page) | **0.8** (`:340`) |
| 2 focus | `.game-cell:has(input:focus-visible) .cell-ghost-path` · `:245-252` | 7 | **0.9** | 0.08 | `rgb(58,123,196)` = `#3a7bc4` | 0.9 (inherits base) |
| 3 invalid | `.game-cell.is-invalid .cell-ghost-path` · `:273-279` | 9 | **1** | 0.1 | `rgb(232,49,91)` | **1** (`:335`) |
| 2×3 | `.game-cell.is-invalid:has(input:focus-visible)` · `:286-292` | 10 | 1 | 0.16 | teacher-red | 1 |

**The 0.55 → 0.80 move breaks the ladder in three places, and the third is new:**

1. `join-language-prm.spec.ts:153` `expect(parseFloat(tier.opacity)).toBeCloseTo(0.55, 2)` reds,
   and its `:151` comment ("tier 1 graphite is 5 at 0.65") becomes false.
2. `gameCell.css:198-205`'s header — *"LIGHTER THAN YOURS, deliberately, **on every axis a tier
   has**: stroke 4 against tier 1's graphite 5 …, stroke-opacity 0.55 (present, never
   competing), fill 0.04 below tier 1's 0.06"* — becomes false on exactly one of its three axes.
   That is the sentence §2.5 means by "`gameCell.css:196`'s header must agree with its rules".
3. **The `prefers-contrast` arm already encodes the rank and would invert against it**: peer
   **0.8** < base **0.9** there. At 0.80 in the normal arm the rank reads peer 0.80 **>** base
   0.65 in one arm and peer 0.80 **<** base 0.90 in the other. A rank ruling that does not move
   `gameCell.css:340` in the same diff ships two contradictory ladders.

A fourth consideration the rank must state rather than assume: on a solo page tier 4's ink falls
back to `--color-user-ink` `rgb(37,99,235)` — R7's census puts the entered-digit blue at 213.1°
and the focus ink at 211.7°, **1.4° apart** (`r0/r7-owners-eye/r7-owners-eye.md:439`). In a real
session the peer ink is the golden-angle formula (`playerIdentity.ts` `inkFor`, `--peer-ink-l`
0.5 light / 0.8 dark at `index.css:162`, `:375`). So "lighter" is an opacity comparison in one
regime and a cross-hue comparison in the other; the gate must read the SHIPPED tier values, not a
composited ratio that only exists in a session.

### 1.5 `--color-focus-sketch` and `--ring-ink`

`index.css:219` `--color-focus-sketch: #3a7bc4`. **Consumers at HEAD: exactly two**, both in
`gameCell.css` (`:246` fill, `:248` stroke), both written `var(--color-focus-sketch,
var(--color-crayon-blue))`. The charter's "only zero-consumer hex" is a *prototype-world*
reading (tier 2 keeps it at HEAD); what is true at HEAD is narrower and still decisive: it is the
**only literal hex in the semantic-token block** (`--color-teacher-red` and `--color-gold-star`
are `var()` aliases), and its two consumers each carry a fallback onto the very token
ACC-GRAPHITE retires. Registry §2.4's mint (`--ring-ink`, consumed as `var(--ring-ink,
currentColor)` by every §10 lane) is therefore the reconciliation: one comment must say what the
two are to each other, and per chair §6.5 the *measured* tokens lose their fallbacks while
`--ring-ink`'s `currentColor` fallback is CTRL-FACE's declared form and survives.

### 1.6 `--focus-ring-outset`, and the one host the pass-2 diff under-declares

Prototype declarations (worktree `wf_8630d340-e56-36`): `index.css:456` `@property` (`<length>`,
`inherits: false`, `initial-value: 3px`), `DrawerTab.vue:79` `6.5px`, `StagingBand.vue:379`
`5.5px`, `GameGallery.vue:1410` `5.5px`, `DarkModeToggle.vue:742`
`calc(2px - var(--toggle-bleed, 0px))`.

Measured at HEAD the toggle's own offset is **+54px** in both engines, because `--toggle-bleed`
is **negative** (`App.vue:963` `calc((var(--toggle-hit) - var(--toggle-size)) / 2)` = −52px). So
the drawn ring at the toggle is a **212×212** box around a 104×104 button — the largest ring in
the estate, and the one geometry a `<length>` seam exists for. Two rows follow: the `, 0px`
fallback inside that `calc()` is struck by chair §6.5 (it is a measured token), and the toggle's
ring is the first place a reviewer should look at a crop.

---

## 2 · The primitives to reuse, named

| need | primitive at HEAD | cite |
|---|---|---|
| wait out a travel of any kind (CSS transition, CSS animation, WAAPI) | `el.getAnimations({ subtree: true })` + `Promise.allSettled(a.finished)` | `App.vue:427`, `useFlipGlide.ts:179` |
| the domain's own settle hook, if coupling is acceptable | `FlipGlideOptions.onSettle` | `useFlipGlide.ts:96`, `:145-151` |
| animationend with a timeout backstop, and `animationcancel ≠ animationend` | the toggle's crest | `DarkModeToggle.vue:619`, `:682` |
| a drawn rect with baked grain, filterless poses | `generateRectBoilFrames(x,y,w,h,opts,boilAmount,frameCount,radius,grain)` | `gridPaths.ts:213` |
| the cell ring's own wobble | `generateCellRects` → `wobbleRect(..., {roughness: 0.4, segments: 4, jagged: true})` | `gridPaths.ts:42`, `:59` |
| shared LRU vs a caller that mints a key per keystroke | `useBoilCache` (cap 24) and the prototype's module-local two-entry memo | `gridPaths.ts:32`, `:432` |
| one-shot pose off the shared beat | prototype `useMarkPose` (boilBeat.ts:95), `BOIL_CONFIG.markSettleBeats: 4` → 4 × 125 = **500ms** | worktree `boilBeat.ts`, `pencilConfig.ts:266-285` |
| conditional enrolment decided once at setup (the estate's own precedent) | `HandDrawnOutline.vue:73-79` — *"the enrolment decision is made ONCE here at setup"* | same |
| box-size tracking | `useResizeObserver` (vueuse) | `rasterPose.ts:68`, `HandDrawnOutline.vue:54` |
| the house's one glass curve | `MOTION.curves.drawerGlide` / `--ease-glassGlide`, byte-identical (R6 law L2, GREEN) | `pencilConfig.ts:193`, `index.css:358` |

### 2.1 `boilBeat`'s floor, priced — the critique's gap 8 is softer than it reads

`boilBeat.ts:18-19` promises *"an empty page returns to the zero-subscriber ambient floor"*, and
`:45-53` enrols at **setup** and releases only in `onUnmounted`. But `<DarkModeToggle />` is
mounted **unconditionally** at `App.vue:816` (inside `.corner-right`, no `v-if`/`v-show`) and
calls `useBoilBeat()` unconditionally at `DarkModeToggle.vue:378`. **The zero-subscriber floor is
therefore already unreachable on every rendered page at HEAD**, before this family adds anything.

Eight call sites exist in `src/`: `DifficultyTally.vue:116`, `BoilDivider.vue:58`,
`HandwrittenLogo.vue:127`, `GameGallery.vue:282`, `DarkModeToggle.vue:378`,
`HandDrawnGrid.vue:73`, `HandDrawnOutline.vue:75`, and (prototype) `useMarkPose`.

So the honest row is not "restore the floor" — it is **price the marginal subscriber**. One
driver runs regardless of N (`boilBeat.ts:32` one `createBoilTicker`); an extra enrolment is one
more `watch` callback per 125ms beat, not an extra rAF chain. The spec should either (a) measure
that marginal cost against T4-P1's census and say the floor was already gone, naming
`App.vue:816` + `DarkModeToggle.vue:378`, or (b) take `HandDrawnOutline.vue:73-79`'s
decided-once-at-setup shape and make `useMarkPose`'s enrolment conditional — which does not
restore the floor either, and should not be sold as if it did.

---

## 3 · The R6 rows, re-run at the new base (all three MOVED)

`instruments/law-probe.COPY.mjs` → `readings/law-probe-74a2b5d9.txt`. Run bare, exit **1**.
Diff against the frozen `r0/r6-idiom-history/law-probe-HEAD.txt`:

| row | r0 | at `74a2b5d9` | why |
|---|---|---|---|
| **L3** | GREEN | **RED**, and it fails the run | The probe counts `since: "` occurrences in `check-copy-register.mjs` and wants **2**; HEAD has **1**. It is a proxy, not the law. The law itself is green with room: `node scripts/check-copy-register.mjs` at HEAD reads **0 em/en dashes, 0 jargon hits, 0 admitted, lexicon 25 entries, exit 0** (run bare, this lane). The W7 fold's B1 cure retired an admission and the proxy followed it down. |
| **R2** | RED | **RED — but for the wrong reason now** | `/solver's answer/` still matches `useGameCell.ts`, in the **comment the fold wrote to record the cure** (`:140-144`, "The third core USED to read `solver's answer N`"). The shipped string is `revealed answer` (`:158`). The probe reads the file, not the assignment. |
| **R1** | RED | RED | `--color-focus-sketch` is declared only in `:root`. This is the family's thesis (one value on purpose), and **CHAIR-RULINGS §6.7 ACCEPTS the rebase and instructs the lane to LAND it and return R1 MOVED with the diff cited** — which **overrules the charter's item 8** ("carry it, do not apply it"). The chair's rulings bind and are read before the charter; the synthesizer must write it as landed, not carried. |

L3 and R2 are the FOLD's doing, not this design's, so neither is a subject this family moved —
but a pass-3 lane that claims "law-probe byte-identical to r0" (pass 2's own sentence) would be
wrong at the new base. Recommendation: MRK-LIVE banks ONE `instruments/R6-rebase.diff` carrying
all three rows (R1's value rebase, L3's proxy → the gate's own exit code, R2's read → the
assignment rather than the file) and reports three MOVED rows, since it is already the only lane
holding an R6 diff.

---

## 4 · The new base's own collision: the tape now rides the focused cell

The W7 fold (`74a2b5d9`) changed the very surface this family frames, and pass 2 never saw it:

- `GameBoard.vue:507-523` — `hoveredPos` became a computed: on a **coarse pointer** it is
  `pointedPos ?? (unitFocused ? focusedPos : null)`. The attribution tape now mounts over the
  **focused** cell on a phone.
- `GameBoard.vue:473-482` — `onGridFocusout` clears `pointedPos` on a coarse pointer (3C-4b).
- `GameBoard.vue:1255-1261` — the `@media not all and (hover: hover)` block that used to
  `display: none` the tape is **deleted**.

So on a coarse pointer the focused cell now carries, simultaneously: tier 2's `#3a7bc4` ring
(measured above — an `<input>` always matches `:focus-visible`, so a tap paints tier 2), and a
washi label in the peer's own ink hanging `bottom: 100%` + `margin-bottom: 0.5rem` above it
(`GameBoard.vue:1230-1253`, `SheetWashiLabel` z-index **50**). The drawn chrome ring is
`position: fixed; z-index: 70` (`FocusRing.vue:229-230`), and the shipped z ladder tops out at
**60** (`App.vue:1036`, `GameControlPanel.vue:2194`, `scene.css:475`; the only 100s are
`FilterTuner.vue:423`/`:456`, DEV-only). The ring is above everything shipped, including the
tape's label — correct, and now worth asserting rather than assuming.

The geometry is untested by anyone: the label's bottom edge sits 8px above the cell's top edge;
a cell-scoped ring at outset 3 + stroke 2.5 reaches 4.25px out, leaving ≈**3.75px**. It is the
board, so the drawn ring is EXEMPT there (`FocusRing.vue:30`) and only tier 2 paints — but the
§6 spec now has to say what the focused cell looks like on a phone **with a name over it**, and
no pass has measured it. It needs a session (the tape mounts only on `hoveredAuthor &&
tapeAnchor`), which is why this lane reports it as a named collision with cites rather than a
number.

---

## 5 · Sketches

### 5.1 The stranding, and where a cure can attach

```
  press .drawer-tab            FLIP: layout first, then WAAPI inverts and animates to identity
  t=0 ─────────────────────────────────────────────────────────────────────► t=520
      │                                                                     │
      │ getAnimations() on the tab's ANCESTOR PATH:                         │
      │   t=7 (wk 3) ─── 2 animations ──────────────────────── t=515/516 ───┘
      │      · div.board-peek-host   waapi 520ms  cubic-bezier(.32,.72,0,1)
      │      · button.drawer-tab     waapi 520ms  (its counter-scale mover)
      │
      │ transitionend / animationend on the tab or any ancestor:   0     0     0
      │ ^ the critique's proposed hook. It never fires.
      │
      │ FocusRing.settle() as written: armed only when take() sees a NEW target
      │   (FocusRing.vue:136 `if (el === target.value) return measure()`) — so today
      │   it is not armed at all; and if it were, its bound is 520ms (:125) while the
      │   last move is at 515/516 and `stable>=3` needs ~+50ms more. Bound fails by ~45ms.
      │
      ▼
  ring stays at left=761.89 (wk 757.84) while the tab lands at left=952
  → framing error 190.11px chromium · 194.16px webkit, focus still on the tab
```

The cure's shape, in the estate's own idiom:

```
  onLandingOrPress(target):
      anims = ancestorsOf(target).flatMap(el => el.getAnimations())      // App.vue:427's read
      if (anims.length) await Promise.allSettled(anims.map(a => a.finished))  // useFlipGlide:179
      measure()                                                          // and re-arm while any remain
  ── no duration constant; the motion's own clock ends the wait, and a cancelled
     animation settles the promise too (allSettled, not all — DarkModeToggle:682's lesson)
```

### 5.2 The opacity ladder, both arms (the §2.5 ruling's subject)

```
                    normal arm            prefers-contrast: more
  tier 3 invalid    1.00  w9   ██████     1.00  w9   ██████      ← unchanged, top of both
  tier 2 focus      0.90  w7   █████      0.90  w7   █████
  tier 1 hover      0.65  w5   ███        0.90  w5   █████
  tier 4 peer       0.55  w4   ██         0.80  w4   ████        ← always UNDER tier 1 today

  PAL-WALK / PAL-TIN's proposal, normal arm only:
  tier 4 peer       0.80  w4   ████       0.80  w4   ████
                    ^^^^ now ABOVE tier 1's 0.65 in one arm and BELOW its 0.90 in the other.
                    Ranks disagree across arms → gameCell.css:340 must move in the same diff,
                    or the ladder is two ladders.
```

### 5.3 The ring band and its clearance seam

```
   host box (measured at HEAD)              --focus-ring-outset (registered <length>, init 3px)
   ┌───────────────────────────┐            declared by 4 hosts in the pass-2 diff:
   │  .drawer-tab  48 x 92     │              DrawerTab 6.5 · StagingBand 5.5 · guard-btn 5.5
   │   ┌───────────────────┐   │              DarkModeToggle calc(2px - var(--toggle-bleed))
   │   │ drawn frame band  │   │                = +54px measured  (bleed is NEGATIVE, -52px,
   │   │   [1.75, 4.25]    │   │                  App.vue:963) → a 212x212 ring on a 104x104 button
   │   └───────────────────┘   │
   └───────────────────────────┘            clearance law = frame outset + frame stroke/2
        ring band [5.25, 7.75]                             + ring stroke/2 + 1px air
        ── 1.00px of air ──                  pass-2 measured air: staging 1.25 · keep 1.25
                                                                  leave 1.00 · tab 1.00
   deck ceiling (r0 R3): the option's ring may reach 6px with air 9.6/713.6/24/24 at 1280x800
   → 3.6px of headroom AS AN OUTLINE. A position:fixed ring is unclippable, which is exactly
     why spoken-gallery's ringWhole() went inert (critique gap 10).
```

---

## 6 · Constraints this design collides with, with cites

- **Chair §6.5, the no-fallback law.** It lands here: the estate has **no `@property` at all**, so
  `--focus-ring-outset`'s registration (`index.css:456` in the prototype) is the first, and §10's
  leader is told to land the registration once. Two of this family's own declarations carry
  fallbacks that the law strikes: `DarkModeToggle.vue:742` `var(--toggle-bleed, 0px)` and
  `FocusRing.vue:81-83`'s JS-side `Number.isFinite(declared) ? declared : OUTSET`. The registered
  `initial-value: 3px` is what makes the JS fallback dead code; keeping both is the masked
  fallback the checklist names.
- **Chair §6.7 overrules the charter on R6 R1** (land it, return MOVED — §3 above).
- **Chair §6.6**: the rank is §6's; PAL-WALK/PAL-TIN ship 0.55 and keep
  `join-language-prm:153` green, so **the 0.80 move and the spec change land in MRK-LIVE's diff
  or nowhere**.
- **MOT-LADDER's two rows travel here**: `gameCell.css:35` and `:154` are the two
  `animation: marks-fade-in 250ms ease-out backwards` declarations. `--motion-note` does not
  exist at HEAD (grep, whole `src/`), so the rows read `var(--motion-note)` **with no fallback**
  under §6.5 — not the `var(--motion-note, 250ms)` the charter's prose carries.
- **forced-colors**: `gameCell.css:353` must keep a real outline; the prototype's `index.css`
  block restores `:focus-visible { outline: 2px solid Highlight }` and hides `.focus-ring`. PW
  **cannot emulate forced-colors in WebKit** — the arm is chromium-only *by instrument* and the
  row must say so (critique gap 5).
- **a11y floors**: `access.spec.ts:232` (no control focuses into a burial ≥96% of 25 points),
  `:325` (drawer-open inert census), `a11y.spec.ts:536` (the 81 ghost `<svg>`s are `aria-hidden`
  — a ring must mint no named image node).
- **filterBudget 9** at 4×4/9×9/16×16 (`filterBudget.ts`; r0 `budget-chromium.json`), and the DOM
  budget r0 names beside it: the ghost `<svg>`+`<path>` is resident on **16/81/256** cells, so a
  four-pose stack must belong to the ACTIVE cell only (pass 2 measured **+3** exactly).
- **`elementFromPoint` is blinded by `inert`** (standing trap) and, per MRK-ABS's critic, returns
  `input.cell-native-input` on `.drawer-tab`'s left band — the RING BAND graft's `isTheRing` flag
  is what catches it; a per-side form or an `elementFromPoint` filter closes it.
- **The six dist-bound suites** ride two configs, not the default: `playwright-golden.config.ts`
  (`visual-golden`) and `playwright-throttle.config.ts` (`throttled-void`, `filter-census`,
  `wordmark-integrity`, `theme-bake-freshness`, `theme-quadrants`). Both read
  **`PLAYWRIGHT_BASE_URL`** (`playwright-golden.config.ts:107-109`,
  `playwright-throttle.config.ts:81`, `:174-183`) and only spawn `:3000` when it is absent — so
  the recipe is: build in the worktree with its own `cacheDir`, `vite preview` on a free
  4230–4249 port, and export `PLAYWRIGHT_BASE_URL` at that port. `npm run build` is
  `vue-tsc -b && vite build` (`package.json:23`), and W8 §8.1 holds **main's** dist fixed — the
  build belongs in the worktree, never on main.
- **M16 / `lint:copy`**: clean at HEAD (0/0/0, lexicon 25) and the gate now reads computed
  accessible names (the fold's 937-line `check-copy-register.mjs`), so any new `aria-label` this
  family writes is inside the corpus and must pass.

---

## 7 · Risks, ranked

1. **The cure is written against the wrong event and ships green.** A `transitionend`/
   `animationend` re-arm fires 0 times on the defect's own motion (§0). A G-LIVE-4 row that
   presses the tongue and asserts ≤0.5px would catch it — a row that merely asserts "a listener
   is attached" would not. The gate must be the pixel, not the wiring.
2. **A correct re-arm still fails on the 520ms bound.** 515/516ms + 3 stable frames ≈ 565ms
   against `MOTION.boardFoldMs` 520 (§0). Raising the constant is the shallow cure; keying on the
   animation set is the one that survives `cardStepMs` 440, the never-never 740, and whatever W8
   retunes.
3. **A rAF follower is the shape `boilBeat.ts` exists to kill.** `FocusRing.vue:20-22` measured
   255 repositions per 900ms idle for the follower form against 4 for the event form. Any cure
   that widens the follower must price idle against T4-P1's census, and the 90-second stall law
   makes that a background run with a log.
4. **The rank ruling splits across two media arms** and reds `join-language-prm:153` (§1.4). A
   diff that moves `:234` without `:340` and without the `:198-205` header ships a lie in the file
   the ruling is about.
5. **`:focus-visible` on programmatic focus is modality-dependent** (§1.2), and the estate carries
   both readings as fact in two places. The ring's whole target rank rests on that one `matches()`.
6. **The masthead `<a>`s have no indicator on the programmatic route today** (`fv=false`,
   `outline-style: none`, both engines) — the drawn ring inherits that hole unless the spec says
   what a link gets.
7. **The tape now rides the focused cell on coarse** (§4) — a surface the family frames, changed
   under it by the fold, unmeasured by anyone.
8. **`fromDocument()`'s exempt fallthrough** (`FocusRing.vue:171` `el.querySelector(FIRST_OPTION)`)
   can return `null` while the spec says "never null" — a one-line guard or a one-word spec edit.
9. **`ringWhole()` is inert** (`spoken-gallery.spec.ts:219-234`): a `position: fixed` ring cannot
   be clipped by the scrollport, so `air.some(a => a < out)` can never fire for the reason it was
   written. W3 owns the spec; the proposal belongs in `instruments/` as a diff, and the natural
   replacement is "the ring's rect equals the active option's rect within 0.5px **and** the option
   is fully inside the scrollport" — which keeps the 3.6px headroom reading meaningful.
10. **Evidence cap.** MRK-ABS's critic measured `evidence/w7/` at **41 MB** against a 2 MB stated
    cap. This lane banked 0 crops and ~40 KB of JSON; the sweep is the orchestrator's.

---

## 8 · What the synthesizer should write, in one paragraph

Keep the design — the law in the selector, the registered `@property` seam, one attribute write
per beat — and change the cure. Replace the duration-bounded rAF settle with an
animation-bounded one: on a landing **and on any press/activation of the resident target**,
collect `getAnimations()` over the target's ancestor chain, `Promise.allSettled` their `finished`
promises, re-measure, and repeat while the set is non-empty, with the rAF follower kept only as
the within-animation sampler and a hard ceiling of `GLIDE_MS + 220 = 740ms`. Gate it born-RED at
190.11/194.16px. Land `--ring-ink` beside the registered `--focus-ring-outset`, with the one
comment that says `--color-focus-sketch` is the value and `--ring-ink` is the name; strike the
`, 0px` and the JS `OUTSET` fallbacks under §6.5. Rule the four-tier rank with the table in §1.4
across **both** media arms, move `gameCell.css:198-205`'s header, `:234`, `:340` and
`join-language-prm:153` in one diff, and reconcile `:243`/`:315`'s modality sentences with what
an `<input>` actually matches. Land the R6 rebase (chair §6.7), and carry L3 and R2 as MOVED
readings of the fold's own cure. Bank chair §6.11 gate 2 in a laminate instrument that scans the
rim rather than the centre 40%.
