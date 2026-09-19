# T9-W7 · pass 3 · SYNTHESIZE · CTRL-TAPE — the taped case (§10 LEADER)

Section §10 (§1 §2 §8 §14 §15 inside) · marks M01 M03 M04 M05 M12 M13 · leader at 72.
Synthesizer: Fable 5.1 (frontend-design invoked; the two-pass method is §0). Read-only on the
product. Inputs: `../CHAIR-RULINGS.md` (every §6 row binds), the pass-2 spec
(`../../pass2/synthesize/CTRL-TAPE.md`, which STANDS where not amended here), the pass-2
critique, the pass-3 research (`../research/CTRL-TAPE/README.md`, `readings/r3-atproperty.json`),
registry-v2 §2/§3/§5/§6, r0 R6/R7, Frame B. Base: `74a2b5d9`. Nothing closes here (U-10).

The chair decided four of the fourteen rows before this pass opened (§6.1, §6.2, §6.3c, §6.5).
This document is what is left: six pieces of work, two of them the SECTION's (the registration
and the confirm's face), and the housekeeping that lets the leader's number move.

---

## 0 · The plan re-read, then the tell review

**Subject, unchanged.** A pencil case: a drawn case at stroke 3, drawn compartments at 1.5,
torn paper tape naming each compartment, the tape crossing the compartment's stroke, the bar as
the case's foot below the scrollport.

**Tokens.** No new hex. No new length token. What is new is a REGISTRATION (§1.1) and a MIRROR
(`--safe-b`, §1.3). `--ring-ink` consumed per registry §2.4, this lane's mint struck.

| token | light | dark | job |
|---|---|---|---|
| `--color-card` | hsl(48 12% 99%) ≈ #FDFDFC | hsl(24 6% 7%) ≈ #131211 | the case's paper |
| `--color-foreground` | #0A0A0A | hsl(48 10% 92%) ≈ #EDEBE7 | every name, every pressed word |
| `--color-muted-foreground` | #737373 (4.66:1) | ≈ #A8A69F (7.69:1) | verbs at rest |
| `--sheet-washi-neutral` | fg 6% into white/.82 | fg 6% into hsl(24 5% 21%/.92) | the tape's paper (R6 law 17) |
| `--ink-press-rule` | fg 55% mix | same formula | the row rule, the bar's drawn edge |
| `--color-red-ink` | #D02A52 (4.99:1 on card) | #FF5C7C (6.30:1) | the destructive word, on BARE card |
| `--ring-ink` | consumed `var(--ring-ink, currentColor)` | same | one ring per control (§2.4; MRK-LIVE mints) |

**Type, unchanged.** Patrick Hand 500 lowercase at `--type-name` (= `--type-heading`, 1.618rem
= 25.888px, line-height 1.2) for the eight names; Fira Code 20px chips; Patrick Hand
`--type-verb` (14) for the bar's verbs. Ratio name/option 1.2945 at every cell.

**Layout, one sentence.** Unchanged from pass 2: a stack of drawn compartments inside a case
whose top padding is a reserved band (`--pin-band` 43.87px) a pinned tape lives in, wells whose
own top padding holds a resting tape's hang, and the bar as the case's foot in `#card-foot`
OUTSIDE the scrollport — now with the foot standing on the safe-area inset instead of the
viewport's edge. Left-aligned throughout.

```
 wordmark foot ────────────────────────── --masthead-foot (registered, 0px initial, PUBLISHED)
      | seam ≥ 8.00 (portrait <1024 only; §6.2)
 ┌ case (3) ══════════════════════════════════════════════════════════╗
 │▒▒▒▒▒▒▒▒▒▒▒▒ --pin-band 43.87 = 0.6rem + tag-h ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ ← the pinned tape's only home
 │   ┏[ new game ]━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓   │
 │   ┃   size   4×4  9×9  16×16      level   easy  medium  hard  ┃   │
 │   ┃            ╔══════╗  dealt ⊪                              ┃   │
 │   ┃            ║ deal ║                                       ┃   │
 │   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛   │
 │   ┏[ pencils ]━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓   │
 │   … checking … players …   padding-bottom 3.5rem (the note berth, KEPT)
 ├────────────────────────────────────────────────────────────────────┤ ← the card ENDS
 │ #card-foot ┏[ clear   fill   solve   share   i ]━━━━━━━━━━━━━━┓    │   the fifth compartment
 │            ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛    │   (HandDrawnOutline 1.5, pose 0)
 │            padding-bottom: 0.5rem + --safe-b   ← the foot STANDS on the inset (§6.3c)
 └════════════════════════════════════════════════════════════════════╝
```

**Principles.** Pass 2's six stand. The seventh, and it is this pass's law for the whole
section: **a measured token has one registered home with an absolute initial value; the paint
never breaks, and the GATE is where an absent publisher is loud.** The memorable thing is still
the tape crossing the stroke; nothing here adds a second.

**The tell review.** (a) Nothing on the skill's default list appears (no cream-and-clay, no
eyebrow caps, no card kit, no arrows, no unbidden motion). (b) The first draft of §1.1 registered
only this family's four tokens; the review struck that as the half-row the next lane re-opens
(research risk 1) — the block names every measured token the wave publishes, including §13's
rungs, once. (c) The first draft of §1.3 chose a 0 floor under the inset ("flush is honest");
the review struck it: a drawn frame at outset 4 needs air below its stroke or the stroke IS the
viewport edge on a non-notched device. The floor is 8px — the house's one air number (the seam
≥ 8, the tongue's 8 tuck, the crossing's 8). (d) The confirm's face (§2.5) was first written
"keep bare, clear boxed" as pass 2 had it; CTRL-RULE's research measured R6 L5 flipping RED at
422 characters against a 400 window if the gallery's `keep` goes bare. Revised: BOTH answers
drawn, ranked by the house's own stroke ladder (1.5 vs 2.5), red ink on the destructive word.
Weight already encodes rank everywhere in this case (3 · 2.5 · 1.5, R1 census); the confirm
stops being the one place it does not.

---

## 1 · The six pieces of work, each with its number

### 1.1 THE REGISTRATION — one block, wave-wide, in `index.css` beside the theme tokens (chair §6.5)

```css
/* ── T9-W7 §6.5 · THE MEASURED TOKENS ARE REGISTERED, ONCE (CTRL-TAPE, §10's leader) ──
   Every token a ResizeObserver or a publisher writes is registered here with an ABSOLUTE
   initial value (a rem/em/var() initial-value un-registers the rule SILENTLY on both engines —
   research readings/r3-atproperty.json). Consumers write var(--x) with NO fallback. The paint
   never collapses (no `max-height: none` boot frame); the LOUDNESS lives in the gate
   (e2e: value ≠ initial after settle, born-RED by deleting the publisher).
   A registered <length> is animatable: `transition: all` is forbidden on any element that
   carries one (grep gate, §5). */
@property --masthead-foot   { syntax: "<length>"; inherits: true; initial-value: 0px; }
@property --case-offset     { syntax: "<length>"; inherits: true; initial-value: 0px; }
@property --sheet-chrome    { syntax: "<length>"; inherits: true; initial-value: 0px; } /* derived; registered so a gate reads px, not token text */
@property --card-foot-h     { syntax: "<length>"; inherits: true; initial-value: 0px; }
@property --card-pad-t      { syntax: "<length>"; inherits: true; initial-value: 0px; }
@property --card-pad-b      { syntax: "<length>"; inherits: true; initial-value: 0px; }
@property --card-pad-x      { syntax: "<length>"; inherits: true; initial-value: 0px; }
@property --pin-band        { syntax: "<length>"; inherits: true; initial-value: 0px; }
@property --washi-tag-rung  { syntax: "<length>"; inherits: true; initial-value: 14px; } /* the DECLARED value stays var(--type-name); only the initial must be absolute */
@property --motion-whisper  { syntax: "<time>";   inherits: true; initial-value: 0ms; }  /* §13's six rungs: registered here, PUBLISHED by MOT-LADDER's publishMotionRungs() */
@property --motion-leave    { syntax: "<time>";   inherits: true; initial-value: 0ms; }
@property --motion-note     { syntax: "<time>";   inherits: true; initial-value: 0ms; }
@property --motion-dusk     { syntax: "<time>";   inherits: true; initial-value: 0ms; }
@property --motion-step     { syntax: "<time>";   inherits: true; initial-value: 0ms; }
@property --motion-throw    { syntax: "<time>";   inherits: true; initial-value: 0ms; }
```

- Registration is NOT publication: `--masthead-foot`/`--case-offset` are published by
  `App.vue`'s wordmark observer (pass 2 §1.5), the four card tokens by GCP's one ResizeObserver
  (:661-677), `--pin-band` and `--washi-tag-rung` are declared on `.controls-card` /
  `.control-panel-wrap` in CSS (closed form), the rungs by §13's publisher. This block gives
  each a home the cascade cannot lose.
- OUT of the block, with the reason: `--tap-floor` (declared in CSS at `.page-root`, never
  published; its `, 2.75rem` fallbacks at index.css:834/849 are W2's ledger row and the
  documentElement trap is banked); `--vv-height, 100dvh` (scene.css:473 — a defended fallback by
  its own comment: an unpublished anchor is still a defined pose; CTRL-TABS's finding, kept);
  `--face-*` (CTRL-FACE's declared aliases, not measured; `*`-syntax has no initial and no
  guarantee — a static gate covers them).
- The `, 0px` fallbacks STRUCK in this family's files: `--card-pad-t` at GCP:1693 (the ONE
  load-bearing one — absent, the pin lands 43.87px lower on live controls; research finding 5),
  `--card-pad-x` at scene.css:291, `--card-foot-h` at scene.css:600, `--card-pad-b` on
  `.controls-card::after` (four declarations). `scene.css:556`'s `--sheet-chrome` chain keeps no
  fallback and now cannot go IACVT.
- Support: browserslist floor safari ≥16.4 / chrome ≥111 = `@property`'s; the dist already
  carries 42 Tailwind `--tw-*` registrations under `minify: 'esbuild'`, so the pipeline is
  proven. Pi: a registered token computes to the same px it computed to unregistered whenever a
  publisher exists; the deck and the board read Δ 0.00 (gated §6).

### 1.2 THE TWO LOUD ROWS (the only reading of §6.5 that is not self-contradictory)

| row | assertion | born-RED by |
|---|---|---|
| the registration took | on the served page, `getComputedStyle(html).getPropertyValue('--masthead-foot')` ≠ `""` with the publisher DELETED (a registered unset property computes to its initial; an unregistered one to `""`) — every name in the block, both engines | deleting the `@property` rule (or a rem initial-value: same signature) |
| the publisher ran | at <1024 portrait after settle (≥700ms, the sheet slides): `--masthead-foot` ≠ `0px`, `--sheet-chrome` ≠ `192px` (= max(12rem, 8px) when the foot is 0), `--card-pad-t` ≠ `0px`, `--card-foot-h` ≠ `0px` with the bar teleported | deleting `publishMastheadFoot()` / the GCP observer |

The boot-frame claim is RESTATED: "the uncapped pose is the first rAF-visible state" (the
critic's sampler runs before the resize-observation steps; research finding 6). The prototype
may upgrade it to a paint-anchored claim with `PerformanceObserver('paint')` vs the first frame
where `max-height` ≠ `none`; it does not repeat the pass-2 wording.

### 1.3 THE FOOT STANDS ON THE INSET (chair §6.3c's condition; the berth's acceptance hangs on it)

```css
/* index.css :root — the mirror; the instrument overrides THIS, not env() */
:root { --safe-b: env(safe-area-inset-bottom, 0px); }
/* scene.css:291 — the whole rule today is padding-inline; this is additive */
.card-foot { padding-inline: var(--card-pad-x); padding-bottom: calc(0.5rem + var(--safe-b)); }
```

8px floor (the house's air number) so the bar's drawn frame (outset 4, stroke 1.5) never lies
on the viewport edge on a flat device; on a notched device the foot rises by the inset. The
`--card-foot-h` publisher already reads `#card-foot`'s height, so the card's cap shrinks by
the same number and nothing is covered. The estate's own idiom for proving an `env()` spend
(walk `document.styleSheets`, mobile-platform.spec.ts:188-222) is kept as the authored-rule
row; the mirror adds a NUMBER: set `--safe-b: 34px` on `:root` → foot height +34.00, verbs'
bottom −34.00, `foot.bottom` unchanged; revert to flush → both deltas 0.00.

### 1.4 THE SEAL AND THE CROSSING (chair §6.1)

- `visual-regression.spec.ts:847` `SEAL = 1283.5` is RESTAMPED to the value measured on THIS
  tree at the iPad coarse cell (expected ≈ 1283.5 + 19.9; the number is read, not carried —
  pass 2's 1303.44 is a pass-2 reading and is not written), with the six-term table re-ablated
  in the comment and the delta DECLARED with W2 §2.5's row cited (the tranche pays §2.5). The
  412.4px² lever stays refused. Both negative controls kept; CTRL-FACE's "captions back to the
  hand rung must drop the card ≥ 28px" added as the second.
- T9-R3 (LEDGER.md:66) lives in the same spec: a red on the :790 row under contention is
  diagnosed as the race first (re-run alone; the 120ms wait) and never re-baselined.
- The crossing: the reference line is the painted path's bounding box TOP of the tape's own
  `<path>` (`.washi-tag > svg path`, `getBoundingClientRect()` of the path element), stated in
  the instrument; the number is read once per well, both engines, and reported. The −3.47 is
  struck. No target is set on it (§6.1 asks for a reading).

### 1.5 THE BAR ROW AT §2.5b's FIVE OFFSETS; I2/I3/I4; L3

- `zone-grammar.spec.ts:372` sweeps `[0, 0.5, 1]`; the bar row is re-cut to viewport-law's
  `[0, 0.25, 0.5, 0.75, 1]` (gap 5) with a stated sub-pixel tolerance: `covers` ≤ 0.25px² for
  the 0.23px WebKit clip seam, else RED. HEAD control 74a2b5d9 on a second server.
- I2 runs and reads GREEN for the right reason (term 1: `:scope > .outline-container` IS the
  bar-frame HandDrawnOutline; term 2: the bar is out of the scrollport). I3 runs; its margin is
  STATED: a pinned tape lands ≈ card.top + 9.6 against a +30 threshold because
  `--washi-tag-top` cancels the band — 20.4px of discrimination. I4 reported RED until W1 §1.5
  (the ask is pointer-agnostic there; §2.5 below is the FACE).
- L3 gains its floor: `check-copy-register` exit 0 AND `ADMITTED.length === 0` (HEAD's state),
  born-RED by planting a synthetic admission. R6 rows L3/R3 reported MOVED with the copies.

### 1.6 HOUSEKEEPING CURES (each in the commit that makes it true)

- `typography.css:378-386` `.section-heading { font-family: var(--font-display) }` DIES in the
  face-move commit (GCP:1838-1850 already owns the face); one rule per role.
- `index.css:276`'s `--ring-ink` mint is STRUCK; GCP:2238 reads `var(--ring-ink, currentColor)`
  (registry §2.4's form; until MRK-LIVE's mint lands the ring is the tongue's dashed
  currentColor, 4.59:1, and the return says which value was read).
- The landscape arm (scene.css:689) is DECIDED: it returns to HEAD's flat `4rem`. §6.2 scopes
  the seam law to portrait; the card at 844×390 is a READING (72.3px is not a red) and W2 §2.2's
  reachability row (viewport-law.spec.ts:173-262, already at 844×390 and 812×375) is asserted
  green as the cell's law.
- The `transition: all` grep runs before the diff lands (a registered length animates).
- The lowercase re-authoring of five spec files is DECLARED as a copy ruling for U-10 (the
  ransom-note near miss), not silently carried.

---

## 2 · Components and states (pass 2 §2 stands; the deltas)

| component | pass-2 state | pass-3 delta |
|---|---|---|
| the name (×8) | Patrick Hand 25.888 · 500 · lowercase · tape; `heading` prop scopes the `<h2>` | `--washi-tag-rung` registered (14px initial), declared `var(--type-name)` |
| GROUP rank | pinned only inside `--pin-band`; hang inside the well's padding | `--card-pad-t` fallback struck at the pin's cancel; unchanged geometry (43.8656 everywhere) |
| the bar | fifth compartment in `#card-foot`, HandDrawnOutline 1.5 pose 0 | stands on `0.5rem + --safe-b`; M04 term 1 = the drawn edge, term 2 = the berth |
| focus | `2px dashed var(--ring-ink)` offset 3 | `var(--ring-ink, currentColor)`; this lane's mint struck |
| the confirm (§15, THE SECTION'S FACE) | `sure?` two-tap; Escape/focusout disarm | see §2.5 |
| the quick set (§14) | landscape teleport of the shipped row | unchanged |

### 2.5 The confirm's face — the section rule (carried by RULE, COST, TABS)

While a destructive verb is armed: one sentence, two answers, no ground, no modal.
`clear the board?` · `keep` (drawn, HandDrawnOutline pose 0 **stroke 1.5**, foreground word) ·
`clear` (drawn, pose 0 **stroke 2.5**, `--color-red-ink` word on BARE card: 4.99 light / 6.30
dark). Three channels, none of them a ground: the sentence names the act; the weight ladder
ranks the answers (1.5 vs 2.5 = the wells vs the tongue, the case's own grammar); the ink is
red. R6 L5 holds (the gallery's `keep` keeps its HandDrawnOutline at +105; nothing is made
bare). Both answers ≥ 44×44 per dimension from `--tap-floor`. The ribbon takes the FULL width
of its row (`#card-foot` on the phone) so it intersects no live control (RULE's ∩ 0.395 → 0)
and shares no baseline with one. Non-colour-channel gate: computed `stroke-width` 1.5 vs 2.5
on the two frames, and painted mean ink density of the destructive frame ≥ 1.5× the keep's
(both engines, both themes).

The arming law (W1 §1.5 owns the mechanism; this is the FACE's contract, COST's measured cure
adopted section-wide): **a POINTER arm moves no focus** (WebKit fires 0 focusouts on the
face; the second tap reaches `press()` armed and fires; the port does not scroll); a
KEYBOARD arm focuses `keep` with `{ preventScroll: true }` so a second Enter never acts;
Escape disarms (bubble handler, `stopPropagation` only while armed); a null `relatedTarget`
on focusout is NOT a departure (the belt — `disarmElsewhere` on pointerdown.capture and the
2500ms lapse cover real departures). The press count is the explicit variable in the row:
"press 1 arms, press 2 fires, both engines, sheet settled".

---

## 3 · Copy (M16; lowercase by CSS; no j or x in the hand)

Unchanged: `new game · size · level · pencils · marks · what fits · checking · players`;
`clear the board? · start a new board? · fill in the sure cells? · fill in the whole board?`;
`keep`; `undo · redo · controls`; `clear · fill · solve · share`. Zero new rendered strings.
`ADMITTED` stays EMPTY. The five lowercase-re-authored spec files are a declared copy ruling.

## 4 · Motion (curve · duration · home)

| verb | what | duration | curve | home |
|---|---|---|---|---|
| ink lift / tape settle | muted → fg; lifted tab ±1.5° → 0° | `var(--motion-whisper)` 150 | `--ease-standard` | §13's ladder (`MOTION.rungs.whisper`); `MOTION.inkLiftMs` is NOT minted (0 consumers at HEAD, TABS finding) |
| confirm window | the disarm timer | 2500 | — | `MOTION.confirmWindowMs: 2500`, consumed by `useTwoTap` in the same commit (a hold, not travel: keeps its literal, MOT-VERB's delay fence) |
| pin / release · arm / disarm | state swaps | 0 | — | — |

PRM: the rung reads 0ms from the publisher; the lift is a same-frame swap. Nothing moves
unbidden. Desk and dock identical; light and dark identical in motion.

---

## 5 · Plan — files, order, what dies (replay = four hunks against 74a2b5d9)

Replay the pass-2 worktree (`-28`) onto a fresh worktree cut from `74a2b5d9`. The fold is
law for the five intersecting files: `check-copy-register.mjs` — DROP the pass-2 hunk
entirely (ADMITTED is empty at HEAD); `check-font-coverage.mjs` — hand-merge in the FACES
table (keep the fold's `what fits` row and `paperNoteCopy`; re-apply only the `.section-heading`
face MOVE); `GameControlPanel.vue` — resolve the three fold sites (comments + two strings)
toward the fold verbatim; `GameControlPanel.test.ts`, `zone-grammar.spec.ts` — the caption
census, trivial. Then, in order:

1. `index.css` — the §6.5 block (§1.1) + `--safe-b` mirror; `--ring-ink` mint STRUCK; the
   ring reads `var(--ring-ink, currentColor)`. `transition: all` grep.
2. `GameControlPanel.vue` — `--washi-tag-top: calc(0.6rem - var(--card-pad-t))` (fallback
   struck); the confirm's face per §2.5 (`useTwoTap`: pointer arm no focus move, keyboard arm
   → `keep` with preventScroll, null-relatedTarget belt); ribbon full-width; `MOTION.
   confirmWindowMs` consumed; `.section-heading` dead face deleted in `typography.css` here.
3. `scene.css` / `GameScene.vue` — `.card-foot` padding-bottom (§1.3); the four `::after`
   `--card-pad-b` fallbacks struck; `:600`'s `--card-foot-h` fallback struck; the landscape arm
   (`:689`) back to `4rem`; `:556` unchanged (no fallback, now registered).
4. `App.vue` — publisher unchanged (wordmark observer); the WebKit desk-staleness prose at
   :377-388 becomes the ASSERTION "no desk rung spends `--sheet-chrome`" (gap 8).
5. `visual-regression.spec.ts` — SEAL restamped by the measured delta with the table; second
   negative control; T9-R3 diagnosis note.
6. `zone-grammar.spec.ts:372` — five offsets + 0.25px² tolerance; `viewport-law.spec.ts` §2.5
   proposed diff (pass 2) kept; the crossing instrument names its line.
7. Instruments under `pass3/prototype/CTRL-TAPE/instruments/`: I2/I3/I4 COPIED and re-pointed
   (BASE/OUT), L3 with the ledger floor, the registration + publisher rows, the safe-area
   number row, the paint-anchored boot clock (optional upgrade).

Dies: this lane's `--ring-ink` mint; five `, 0px` fallbacks; the dead `.section-heading` face;
the landscape derived arm; `MOTION.inkLiftMs`. Stays: every W2 mechanic (sticky tag, dock,
bottom tab, tap floor), the note berth 3.5rem, `BoilDivider` ×1, filterBudget EXACTLY 9,
`--vv-height`'s defended fallback.

---

## 6 · Prototype brief

Worktree from `74a2b5d9`; server `127.0.0.1:4230 --strictPort` via the two-line scratch config
(`cacheDir: <worktree>/.vite-cache`); the HEAD control `74a2b5d9` on the next free port in
4230–4249, named in the return; scratch Playwright config (no webServer); chromium AND webkit;
settle ≥700ms after every sheet open; goldens and `filter-census` off `npx vite build` in the
worktree previewed on a lane port; every server KILLED before return; ≤2 workflows on the box.

**Crops (≤4, ≤150 KB, each cited, only where a number cannot say it):** (1) 390×844 dark, sheet
up, the foot with `--safe-b: 34px` set — the bar standing above the viewport edge beside its
flush HEAD twin (the §6.3c condition, seen); (2) 390×844 dark, the confirm armed on `clear`:
`keep` at 1.5 and `clear` at 2.5 in red, full-width, nothing under it (the section's face);
(3) 1440×900 rail at scrollTop 0.5, the pinned tape inside the band, first chip clear (the
owner's M03 second look). No fourth unless a π number moves.

**Censuses to re-run (COPIED, OUT re-pointed; r0 untouched):** R1 heading-voice (desk, dock,
900×500; expect 1 voice, 8/8 headings, 1.2945); R7 I2 (GREEN, term 1 via the drawn edge) / I3
(with the 20.4px margin stated) / I4 (RED, reported); R6 law-probe COPY with L3 (exit 0 + ledger
0) and R3 (template edge), L1 = 9, L4, L5 GREEN; the hue census COPY (29 rows, Δ 0 — no colour
minted); `probe/r2-tape.mjs` 5 states × 3 cells × 2 engines (`belowExemptBand` ≤ 0.00; tape ∩
control 0.00px²); the deck π census vs the HEAD control (band, first card y, tape box,
ariaSnapshot headings — Δ 0.00); the registration row and the publisher row (§1.2) both
directions; the safe-area number row (+34.00 / −34.00 / 0.00 reverted); the seam ≥ 8.00 at
375/390/430 portrait, and W2 §2.2's reachability row green at 844×390 + 812×375 with the card's
clientHeight REPORTED; the seal at the iPad cell with the six-term ablation and both negative
controls; §2.5b at five offsets ≤ 0.25px²; the crossing per well (read, reported); `transition:
all` grep 0 on token-carrying elements; `check-theme-selectors`, `check-copy-register`
(ADMITTED 0), `check-font-coverage`, `lint:motion`, prettier, `vue-tsc -b`, vitest (Test Files
AND Tests) — all BARE, exit codes unpiped; filter census EXACTLY 9; goldens 4/4 off the
worktree dist, no re-mint.

**Numbers that mean success:** voices 1; headings 8/8; ratio 1.2945 ×3 cells; `belowExemptBand`
≤ 0.00 everywhere; tape ∩ control 0.00px² ×4 wells at rest; bar ∩ control 0.00 at 5 offsets ×3
cells (≤ 0.25px² tolerance stated); seam ≥ 8.00 ×3 portrait cells; reachability GREEN ×2
landscape cells; every registered name computes non-empty with the publisher deleted; every
published name ≠ initial after settle at <1024; foot +34.00/−34.00 under the mirror, 0.00
reverted; `keep`/`clear` computed stroke 1.5/2.5, density ratio ≥ 1.5, red word ≥ 4.5 both
themes on bare card; ring ≥ 3:1 on four grounds (report the value read); deck Δ 0.00 ×5;
seal ≤ the restamped value with the table; L3 exit 0 + ledger 0; filter 9; goldens 4/4.

**The fresh-reader protocol (U-10):** hand crop (3) to another lane's agent — "which of these
eight names are groups?" — record verbatim, score /8, hand to the owner. Never self-scored.

---

## 7 · Gates the family lands with

Born-RED at HEAD (RED today, GREEN under the build, both engines):
1. THE REGISTRATION TOOK — every name in §1.1 computes non-empty with its publisher deleted
   (HEAD: `""`, `max-height: none`).
2. THE PUBLISHER RAN — at <1024 portrait after settle `--masthead-foot` ≠ 0px, `--sheet-chrome`
   ≠ 192px, `--card-pad-t` ≠ 0px, `--card-foot-h` ≠ 0px; born-RED by deleting the publisher
   (HEAD: the tokens do not exist).
3. THE FOOT ON THE INSET — `--safe-b: 34px` → foot +34.00, verbs −34.00; flush → 0.00; the
   authored rule carries `safe-area-inset-bottom` (HEAD: scene.css:291 has no padding-bottom).
4. §2.5 at rest AND five offsets (pass 2's proposed diff + gap 5): `belowExemptBand` ≤ 0.00,
   bar ∩ control ≤ 0.25px² (HEAD: 358.6px² rail, 0.782 dock).
5. THE CONFIRM'S FACE — two drawn answers at 1.5/2.5, density ratio ≥ 1.5, red word ≥ 4.5 on
   bare card, ribbon width = its row's, ∩ live control 0 (HEAD: `sure?` sublabel, no answer).
6. THE ARM'S FOCUS CONTRACT — pointer: press 1 arms with 0 focus moves and scrollTop Δ 0;
   press 2 fires, both engines; keyboard: Enter arms, focus on `keep`, Enter disarms, board
   unchanged; Escape disarms, sheet stays (HEAD: WebKit never fires on press 2 under any
   focus-moving arm; Escape closes the sheet armed).
7. `--card-pad-t`'s cancel with NO fallback — the pin lands inside the band (HEAD's `, 0px`:
   43.87px lower when absent).
8. M04 term 1 (I2 own = the drawn edge) + term 2 (berth coverage 0.00) — I2 GREEN (HEAD RED).
9. L3 with the ledger floor (exit 0 AND ADMITTED 0; planted admission → RED).
10. Deck π ×5 readings Δ 0.00 vs 74a2b5d9 (RED under any shared-rule leak).
Guards (GREEN at HEAD, must hold): filter census EXACTLY 9; goldens 4/4; L1/L4/L5; W2 §2.2's
reachability at 844×390 + 812×375; the seal ≤ restamped with its table; `check-theme-selectors`
exit 0; M16 0 unadmitted; the note berth's 3.5rem; `transition: all` 0 hits on token carriers;
`--vv-height` fallback present (declared exception).

MOVED rows (proposed diffs, never re-cut in place): R6 L3, R6 R3, the boot-frame claim's
wording, `zone-grammar.spec.ts:372`'s offsets. TO THE CHAIR: §6.5's literal text and the
registration are reconciled by §1.2 (loudness in the gate); rule once, not in fifteen returns.
MERGE WATCH: the pin band is ONE mechanism (same token, same 0.6rem term, same consumer, same
cancel) with two publishers — TAPE derives, COST samples; the derived form wins on the evidence
(COST's own: 38/41/42 engine-split vs 43.87 everywhere). `useTwoTap` and `askingAct` are one
machinery with two policies; §2.5 adopts COST's focus contract as the section's. YES on both
halves from this side.
