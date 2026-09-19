# MOT-LADDER — pass 2 SYNTHESIS · the duration ladder (absorbing MOT-DERIVE)

T9-W7 §13 the transition grammar · §12's motion half · M02 / M09 (design half). Leader of §13.
Input: `../research/MOT-LADDER/README.md` (pass 2, 14 findings), the pass-1 spec, prototype and
critique, the chair's rulings (`../CHAIR-RULINGS.md`), the pass-1 worktree diff
`wf_e58b4764-0fc-51` (+195/−97, 30 files + the 715-line gate) and MOT-DERIVE's grafts. Read-only
on product files; nothing closes (U-10). Method: the frontend-design two passes — plan, review
against the tells, then specify. §0 is the plan and the review; §1 onward is the spec.

One fact moved between the passes and reshapes the section: **W8 C06 has cured the exit cut**
(`0bf9cb0e` on `w8/app`, `.claude/worktrees/w8-app`; `anim.id = FLIP_GLIDE_ANIM_ID` in
`useFlipGlide.run`, `boardAnimations()` filters it; exit travel NO TRAVEL 6/6 → GLIDE 264–296 px
desk / 73–78 px mobile, 36/36 windows, both engines). Research F3 is therefore not a §13 row
to cure. It is the build base every §13 reading stands on, and the choreography table below
says what runs ON C06, with HEAD's cut named as the control.

---

## 0 · The plan, and the review against the tells

**Subject.** A hand-drawn puzzle page whose chrome moves like paper. The owner's eye on a real
phone (M02, M09). This family's job is unchanged from pass 1: every length the product spends is
a NAMED decision read from one place. Pass 2's job is narrower and harder: make the gate that
sells that claim able to fail, name the three vocabularies it could not see, rule the dock's
clock on the band it actually governs, and write a retune policy so a shared rung cannot
surprise anyone.

**Tokens (the plan).**

| axis | the set | home |
| --- | --- | --- |
| length | six shipped rungs: whisper 150 · leave 200 · note 250 · dusk 350 · step 440 · throw 520, plus ONE proposed: **rise 600** (the dock, U-10) | `MOTION.rungs` (TS), published as `--motion-<rung>` by a `<style>` node |
| curve | the ten `--ease-*` in `@theme §EASING` + `MOTION.curves.drawerGlide`, plus one named copy of the UA's `ease` (`--ease-dusk`, byte-identical paint) | index.css / pencilConfig, the two-layer rule |
| PRM | a VALUE of the ladder: every `--motion-*` reads `0ms` under reduce, emitted by the same publisher; reduced-motion FALLBACKS never read a rung | the publisher's own reduce arm |
| colour | none. No hex, no `--color-*`, no `oklch` moves; the measured AA ratios in `index.css` (gold 11.48:1 / rose 6.44:1 dark, the light ink tier) are untouched by construction | — |
| copy | none rendered. Gate messages obey M16 (plain English, no em dash) | — |

**Voice.** A rung is named for how it feels, never for who spends it. A site reads as a sentence
— `opacity var(--motion-leave) var(--ease-fadeOut)` — and that sentence at every site is the
family's one memorable thing. The dock's clock is the second, and only, place this pass spends
boldness: a named length seen against the band it governs, 302 px to 681 px, both ends
auditioned. Everything else is quiet: no owner-ruled number moves, nothing shortens, zero
rest-state pixels move.

**Layout (where a length lives after this pass).**

```
pencilConfig.ts   MOTION.rungs { whisper leave note dusk step throw rise }   ← THE home
                  MOTION.settleGuardMs 220                                     ← the FLIP backstop, EXEMPT by cite
                  publishMotionRungs(): ONE <style data-motion-rungs> node →
                      :root{--motion-*: Nms} @media (prefers-reduced-motion: reduce){:root{--motion-*: 0ms}}
index.css         :root{--default-transition-duration: var(--motion-whisper, 150ms)}   ← Tailwind's tier joins
                  --ease-dusk: cubic-bezier(0.25, 0.1, 0.25, 1)                        ← ease's own points, named
call site         transition: <prop> var(--motion-<rung>, <rung ms>) var(--ease-<curve>);
TS consumer       useFlipGlide({ durationMs: MOTION.rungs.throw })   glideCtl.run(specs, MOTION.rungs.rise)
gate              scripts/check-motion-bands.mjs B1..B8 + a banked inventory (the ratchet) + --self-test
```

**Principles.** (1) Lengths, not meanings. (2) One home; the CSS copy is emitted, never typed,
and the PRM arm is emitted beside it. (3) Nothing the owner ruled moves; nothing shortens
(W8 QUALITY LAW) — and the gate that says so is anchored to a bank it can fail against. (4) A
keyframed character gesture is auditioned whole; a graded set is auditioned whole. (5) A delay
is not travel: delays keep their literal (MOT-VERB's fence, adopted section-wide). (6) A rung
retune re-auditions the rulings pinned to it and moves its followers silently, and the policy
says which is which.

**Review against the tells.** The generic motion-token page is an ordinal ramp, `ease-in-out`
on everything, a `:root` block duplicating a JS file, and a reduced-motion arm that is one
`0.01ms !important`. Four things in my first plan were that default and were revised:

1. I had the PRM graft as `@media (reduce) { :root { --motion-*: 0ms !important } }` in
   `index.css` — research §3's option 1, one keyword, measured to work. It puts a bang in the
   sheet and leaves `<html>` wearing an inline style attribute. **Revised: the publisher emits
   ONE `<style>` node carrying the rungs AND their reduce arm** (option 3, extended). No inline
   properties, no `!important`, `:root` owned by CSS alone, and B3's "one home" becomes a
   read of one node.
2. I had the dock's fallback as pass 1 wrote it: "if W8 convicts the clock, `step` 440 — never a
   seventh rung". The band audition kills that sentence on arithmetic: a shorter clock raises
   the worst frame at every pose (520 → 440 would push 768×1024's 91.0 px past 100), and the
   QUALITY LAW forbids buying anything with a shorter clock. **Revised: the dock is a seventh
   rung, `rise` 600, proposed for the owner's re-look, with the band declared on its line.**
   Pass 1's own words are reversed here, and the reversal is the audition's, not taste.
3. I had 280 as a rung (three homes: the laminate's lay-down, `gridSubgrid`, the returning
   player row). Each of the three is a member of a GRADED set whose differences are the design
   (R6 §1.2's erase asymmetry; the draw-in tuple; "a return is lighter"). A rung that only ever
   appears inside graded sets is a number, not a length. **Revised: 280 stays GRADED-admitted;
   the ladder is 6 + 1.**
4. I had the 16 incidental curve assignments riding inside the length row, as the pass-1 diff
   does. Research F10 is right that it is a second claim. **Revised: its own row (§2.4), its
   own before/after table, its own commit.**

Kept, and it looks like a default: `var(--motion-x, 150ms)` fallbacks. A missed publish must be a
no-op, not a page of zero-length transitions; B3 FALLBACK holds every fallback byte-equal to its
rung. Also kept: the ladder still assigns no meaning. MOT-VERB's verbs are a separate spec; the
agglomerator decides whether the section ships lengths, verbs, or lengths under verbs.

---

## 1 · The ladder

### 1.1 Seven rungs: six the product ships, one it proposes

| rung | ms | the ruling it carries | consumers after this pass |
| --- | --- | --- | --- |
| whisper | 150 | the estate's most-used length; ratified as shipped | 18 CSS sites · `usePathAnimation.ts:163` (the grid erase, already PRM-armed) · Tailwind's default tier (17 `.transition-colors` els, 14 `.duration-150`) |
| leave | 200 | was `chromeLeaveMs`; chrome leaving the page | the twins (`scene.css` ×2, `App.vue` deck leave) · the laminate's lift · **the section's one RUB OUT** (§1.5) · `.duration-200` ×2 |
| note | 250 | the note-write family | MarginNote/SolverErrorNote/CompletionVignette · `controls-fade-in` · the guard ribbon (**MOVED 240 → 250**, §5) · the progress trace's dashoffset (**MOVED 240 → 250**) · `.duration-250` |
| dusk | 350 | the theme turn (T3-W10) | `index.css` the five narrowed selectors |
| step | 440 | was `cardStepMs`; RATIFY-ME T4-W12 row 4 (auditioned 380/440/520) — **PINNED** | `useCarouselGlide` · `GameCard.vue` flank pose |
| throw | 520 | was `boardFoldMs` + `GLIDE_MS`; R6 standing ruling 1 (audit 4, auditioned 480/520/560) — **PINNED** | drawer desk (4 movers) · fold in/out · five followers at 500 → 520 (§2.3) · `.duration-500` |
| **rise** | **600** | **PROPOSED, U-10.** The dock sheet, `<1024` both orientations. Auditioned at the band's ends against 520/600/680 on one dist, both engines: worst 60 Hz frame 91.0/83.7/40.3 px at 520 → 78.6/72.3/34.9 at 600 (−13…14 % at every pose; the band's only >40 px frame goes to zero); 680 reads 0.444 px/ms at 844×390 against the desk's 0.402, a shorter distance at the desk's own speed. `travel: 302px @844x390 … 681px @768x1024 (sheet) · 0.503…1.136 px/ms`. If the owner keeps 520, the rung dies and the dock reads `throw`; a number the dock inherited unseen is what may not ship again. | `useControlsDrawer` dock pose only |

Closed set: seven, ≤8 by gate (`LADDER_MAX`). `beatMs` 125 is a cadence, EXEMPT by cite. A
second exemption joins it: `settleGuardMs: 220`, the FLIP engines' never-never backstop
(§1.6) — never painted, never a gesture. Two keys in `EXEMPT_KEYS`, each with its sentence.

What this does NOT say: that the dock's rise reads at the desk's weight. It cannot — the desk's
27.9 px worst frame would need ≈1,607 ms at 628 px — and the desk's own audited gesture already
carries a 1.65× velocity spread on one clock (board 0.371 · case 0.402 · masthead 0.611 px/ms).
The sentence to bank: **the dock's clock is its own named decision, seen against its band's
ends.** Rule on the worst frame, never on `framesOver40px` (non-monotone in duration). The mark
served is M02, not M06.

### 1.2 The TS home and the publisher

```ts
export const MOTION = {
  beatMs: 125,                       // cadence, not a rung (EXEMPT)
  settleGuardMs: 220,                // the FLIP engines' backstop, not a rung (EXEMPT)
  rungs: {
    whisper: 150, leave: 200, note: 250, dusk: 350, step: 440, throw: 520,
    /** PROPOSED (U-10) — the dock sheet's clock. travel: 302px @844x390 … 681px @768x1024 (sheet) ·
     *  0.503…1.136 px/ms · auditioned 520/600/680 at both ends of the <1024 band, both engines
     *  (pass2/research/MOT-LADDER/data/band-*.json). Dies to `throw` if the owner keeps 520. */
    rise: 600,
  },
  bands: { sun: 2, moon: 1.5 },      // unchanged
  curves: { drawerGlide: "cubic-bezier(0.32, 0.72, 0, 1)" },  // unchanged
} as const;

/** THE ONE PUBLISHER — called once from main.ts before mount. It emits a <style> node, never
 *  inline properties: an inline declaration outranks every author rule, so a reduce arm could
 *  never reach it (measured both engines: inline beats `:root{--x:0ms}` inside a reduce block).
 *  The reduce arm is emitted HERE, beside the values, so PRM is a value of the ladder and lives
 *  in the ladder's one home. */
export function publishMotionRungs(doc: Document = document): void {
  const rows = Object.entries(MOTION.rungs);
  const live = rows.map(([n, ms]) => `--motion-${n}:${ms}ms`).join(";");
  const still = rows.map(([n]) => `--motion-${n}:0ms`).join(";");
  const el = doc.createElement("style");
  el.dataset.motionRungs = "";
  el.textContent = `:root{${live}}@media (prefers-reduced-motion: reduce){:root{${still}}}`;
  doc.head.append(el);
}
```

The comment block above `rungs` carries the rulings (1.1), the admitted classes (2.2), the
retune policy (2.3) and the choreography table (1.4). No `@theme` duplicate, no `--card-step-ms`,
no `html.style.setProperty`.

### 1.3 The CSS grammar — one sentence per site

```
transition: <property> var(--motion-<rung>, <rung ms>) var(--ease-<curve>) [<delay literal>];
animation:  <keyframes> var(--motion-<rung>, <rung ms>) var(--ease-<curve>) [<delay literal>] backwards;
```

Rules the gate reads: the fallback equals the rung (B3); the FIRST time value in a term is a rung
or an ADMITTED literal (B1); the second and later time values are delays and keep their literal
(the delay fence — the ladder never governs a beat alignment); `all` never appears (B4); a bare
`ease`/`ease-in`/`ease-out`/`linear` never appears on a `transition:` (B8, i2 folded in);
`linear` stays legal on an `animation:` whose keyframes carry per-step easing.

### 1.4 The three gestures M09 names, defined — as they RUN on C06

Written into `MOTION`'s comment as the choreography table. The exit is described for the build
this pass measures on (HEAD + C06); HEAD's cut is the paired control and is named as such.

| gesture | beat | what moves | rung | curve | PRM |
| --- | --- | --- | --- | --- | --- |
| gallery IN | 0 | `.scene-controls` opacity → 0 (`scene.css` `html.gallery-leaving`) | leave | `--ease-fadeOut` | same-frame cut |
| | 1, at +leave (`App.vue:630`) | board folds into the centre card + the wordmark, one clock (`useFlipGlide`) | throw | glass | cut |
| | the deal, at +round(0.42·throw) after beat 1 (`GameGallery.vue:371`) | the card draw-ins | — (a DERIVED delay; the delay fence keeps the coefficient literal, and the record names it: the deal begins at 42 % of the fold, so a fold retune moves it by design) | — | settled |
| gallery OUT (C06) | 0 | board unfolds + the wordmark, one clock (`App.vue:639`; the mover survives to its own settle, CANCEL at 518–530 ms) | throw | glass | cut |
| | 0 | the deck's leave-only dissolve (`App.vue:1142`) | leave | `--ease-fadeOut` (the twins share one curve) | cut |
| | +150 ms | `controls-fade-in` (`scene.css:612`; T3-W10's grid-leads beat — the delay is a literal and stays) | note | `--ease-drawOn` | no-preference gated |
| | 0 | `.washi-label` / `.action-bar` whisper fades fire at frame 0 but are masked under `.scene-controls` at opacity 0 for the first 150 ms (a claim the roster proves, §4) | whisper | `--ease-standard` | cut |
| | | chrome lands at 400 ms; the paper (board + wordmark) settles at 520. The paper stops last. That is the definition, and nothing moves to make it true. | | | |
| gallery OUT (HEAD, control) | 0 | the board's mover is born finished (`restoreBoardAnims` sweeps it); the wordmark glides alone. R4 headline 1, W8 G3, cured by C06. | — | — | — |
| card step | — | track FLIP (`useCarouselGlide`) + three cards' transform/opacity (`GameCard.vue`) | step | glass | cut |
| drawer, desk ≥1024 | — | sheet · case · masthead · tab counter-scale, one WAAPI clock | throw (PINNED, R6 #1) | glass | cut |
| dock <1024 | — | the sheet alone, 302…681 px; the tongue swaps berth UNDER COVER (§1.7) | **rise 600 proposed** / throw 520 shipped | glass (the curve is never re-eased — R6 #2) | cut |
| dusk | — | background-color + color on the five narrowed selectors | dusk | `--ease-dusk` (= `ease`'s own points; paint byte-identical) | no-preference gated |

Mobile exit asymmetry (research F3b): at 390×844 the wordmark's declared exit travel is 10.0 px
against 145.5 px on entry. The table calls the exit "one gesture reversed", so the prototype
measures it on C06's build with a born-RED mirror gate (§6, G-EXIT-MIRROR); if the 10 px is the
wordmark's true playing-pose geometry at 390, the row is corrected to say so, and if it is a
stale `headFirst` rect the cure is App.vue's and is handed to the agglomerator with the number.

### 1.5 One RUB OUT for §13

Claimants: MOT-VERB 200 · NOTE-ERASE 125 · `AnswerKeyLaminate` lift 200 (shipped) ·
`usePathAnimation` 150 (shipped, PRM-armed). **Ruling: rubOut = leave = 200 ms.** `leave` is
already a rung, already the scene's leaving fade, already the laminate's lift — the incumbent
with two consumers. **125 is REJECTED** for the beat collision, not taste: R6 law 7 fences 125 ms
as the boil's raster cadence, and a motion length at that number invites a retune of one to move
the other. `usePathAnimation`'s 150 is admitted as `whisper` because it erases strokes, not a
note. If §7 wants the erase deliberately faster than the write (R6 §1.2's own asymmetry), the
lawful answer is `whisper` 150, never 125. §7's leader consumes this number.

### 1.6 Two FLIP engines, one backstop

`useFlipGlide.ts:116` guards at `durationMs + 220`; `useCarouselGlide.ts:31` at `GLIDE_MS + 200`.
Two engines, two constants, one unruled. Ruling: `MOTION.settleGuardMs: 220` (EXEMPT, a backstop),
`useFlipGlide` derives its guard from it per run (MOT-DERIVE's `run(specs, durationMs?)` seam,
guard = `durationMs + MOTION.settleGuardMs`), and `useCarouselGlide` imports the same constant.
Folding the carousel whole onto the primitive is a larger seam (drag, flick, snap) and is not
this pass; the guard is one line each side.

### 1.7 The tongue's berth swap (W8 G7, routed to §13)

W2 §2.7 landed one law and four berths; the SWAP between berths is a one-frame rect jump of
157–158 px (chromium) / 130–136 px (WebKit) on open, and 459 px on close but occluded ≈100 ms
under the risen sheet. The close is already invisible because the swap happens while the tongue
is covered. **Ruling: the berth swap is always made under cover.** On close it already is (at
onset, the sheet still over it). On open the swap moves from the gesture's onset to its settle:
the tongue stays in its shut berth until the sheet has risen over it, then appears in the sheet-up
berth in the same frame the glide settles. A key on `phase === "idle"` instead of `open` in the
berth class; no new berth, no new mover, no new mechanic — the voice on top of W2's mechanics.
Gate G-TONGUE (§6) is born-RED at 157 px.

### 1.8 Curves: nothing new, one named copy

- **The twins ride one curve**: the deck leave (`App.vue:1142`) leaves glass for `--ease-fadeOut`.
- **The dusk keeps its paint.** Pass 1 assigned `--ease-standard`; MOT-VERB's pass-1 spec objected
  that this is Material's curve and a retune wearing an assignment, and it is right. The dusk
  takes `--ease-dusk: cubic-bezier(0.25, 0.1, 0.25, 1)` — CSS `ease`'s own control points under
  a house name — so i2/B8 green honestly and the painted `background-color` sequence is
  byte-identical to HEAD. The two families converge here from opposite directions.
- **The 16 incidental sites** take the house curve their motion implies (§2.4, its own row).

---

## 2 · Every site, classed

### 2.1 The script class — value unchanged, or lengthened ≤5 %

Unchanged from pass 1: exact matches (150 ×18, 200 ×14, 250 ×7, 350 ×4, 440 ×2 = 45 positions)
plus 240 → 250 ×4 and 500 → 520 ×5 (≤5 %, below the ~10 % duration JND) = 9. **54 of 78
positions read a rung.** Zero shortened. The nine lengthened rows are each NAMED in the record
with their surface (the guard ribbon, the progress trace, CrayonHeart's dead `.face`, the win
flood's stroke and box-shadow, `sparkleGrow`, `diceRoll`, the progress trace's opacity).

### 2.2 The ADMITTED ledger — four classes, closed both ways, content-anchored

Line cites rotted twice inside one pass. Every row is keyed `file :: <literal> :: <a nearby
stable string>` (e.g. `DarkModeToggle.vue :: 800ms :: springPop`), never a line number.

| class | positions | rows | ruling |
| --- | --- | --- | --- |
| CHARACTER | 13 | the whole dark-toggle gesture (100/120/120/300/340/800/1010 — ONE character, admitted whole with its beat table as the cite), `cell-reveal` 300, `eraserScrub` 400, `sharePop` 500, `refuse-shake` 600, ScribbleLoader 1000 loop, the wordmark's 1200 wipe | a keyframed gesture is auditioned whole; the ladder sets a gesture's length only where the gesture is one length |
| GRADED | 15 | the player rows 320/380/280/320/320/260 ("a return is lighter"), the laminate 280 ×2 (R6 §1.2), `--draw-dur` 160, `ghost-draw-on` 180 ×2 (R6 law 39; §6's surface, handed to MRK-LIVE), **`DRAW_IN_PRESETS` 350/280/200/350** (the stagger/jitter/baseDelay tuple IS the design; B2 walks it as an admitted TS class) | a set whose differences are the design; auditioned whole, never snapped |
| PRM-FALLBACK | 2 | `DarkModeToggle.vue :: 200ms :: reduced` (the rest-stack crossfade), `AnswerKeyLaminate.vue :: 150ms :: linear` | a reduced-motion fallback never reads a rung, because the ladder reads 0 there (§3) |
| RETUNE | 0 | (empty; the class exists) | a SHORTENING the owner cites at a re-look lands here with its cite, and B6 reads it |

54 + 13 + 15 + 2 = 84 duration positions (research counts 84 at HEAD; pass 1's 78 predates the
Tailwind and TS rows). i3-B is RETIRED into B1 (its five remaining rows are five GRADED
admissions; B1 subsumes it). I6 is taught `var(--motion-` as NAMED and the ledger as admitted,
with the before/after banked (unwidened it reports 36 literals against 35 — a `var()` fallback is
literal text to the old reader).

### 2.3 The retune policy — pin-by-cite

A rung's consumers are of two kinds, and the site says which:

- **PINNED** — a site whose length carries its own ruling records that its value IS that ruling's:
  `useControlsDrawer` (`throw`, R6 standing ruling 1), `App.vue` fold (`throw`, T4-W12 Wave C),
  `useCarouselGlide` (`step`, RATIFY-ME T4-W12 row 4). A retune of the rung is a re-audition of
  that ruling, by name, before the number moves.
- **FOLLOWS** — every other site follows silently. The five 500 → 520 rows and the derived deal
  delay (`round(throw × 0.42)`) are followers by declaration; the record says so beside them.

The policy is two words in a comment at three sites and one paragraph in `MOTION`; nothing
executes. B6's bank (§3) is what makes a silent shortening visible.

### 2.4 The curve row — 16 incidental sites, declared as its own claim

R4 measured 16 of 39 `transition:` declarations with no house curve. Assigning them one is a
real cure and a SECOND claim. It lands as its own commit with this table (values from the pass-1
diff; the prototype re-derives each Δprogress and banks the numbers):

| site | from | to | why |
| --- | --- | --- | --- |
| `.washi-label`, `.action-bar::before`, `.controls-card::before`, `.icon-btn` ×2, `SolverErrorNote` background, `SheetWashiLabel` | (none → UA `ease`) | `--ease-standard` | a ground or ink swap |
| `.progress-trace` dashoffset | bare `ease` | `--ease-drawOn` | a stroke drawing on |
| `.progress-trace` opacity, `.solve-success` stroke + box-shadow, `share-pop`, `eraser-scrub` | bare `ease` | `--ease-standard` | a fade/ground; the two keyframes are CHARACTER for length, the curve is the transition's |
| `DrawerTab` tongue | `ease-out` | `--ease-drawOn` | a tilt straightening |
| `marks-fade-in` ×2 (`gameCell.css`) | `ease-out` | **untouched this pass** | §6's file; MRK-LIVE edits it under the chair's §6.11 ruling — coordinate, never re-time the hint laminate |
| the twinkle stars' tuck (`ease-in`) | `ease-in` | **untouched** | inside the admitted toggle CHARACTER |
| the dusk | bare `ease` | `--ease-dusk` | ease's own points, named (§1.8) |

Max Δprogress of `none → standard` is 0.375 (MOT-VERB's arithmetic); it is declared here with
that number, and U-10 owns the look.

### 2.5 What dies

`MOTION.cardStepMs` / `boardFoldMs` / `chromeLeaveMs` (rulings move into the rung rows) ·
`--card-step-ms` and its single-quoted component publisher (`GameGallery.vue:930`) · `GLIDE_MS`
(`useControlsDrawer.ts:86`) and `useCarouselGlide`'s own guard constant · `html.style.setProperty`
as the publisher's idiom · `transition: all` (`GameControlPanel.vue:2082` → `filter, transform`)
· the bare `ease` on 14 transitions · the glass curve on the deck leave · i3-B (into B1) · the
absolute theme-flip >100 ms criterion (§4).

---

## 3 · PRM — the posture, ruled

The estate ships two postures at once: `index.css:744-748` kills every ANIMATION (`*`,
specificity 0) and leaves every TRANSITION alive "so components can provide their own graceful
reduced-motion fallback"; R6 law 43 says the named gestures collapse to a same-frame swap. The
runtime roster (research §3) reads 28 rules still tweening under reduce, incl. `.icon-btn` ×10
and Tailwind's `.transition-colors` ×17.

**Ruling.** A rung reads `0ms` under reduce — PRM is a value of the ladder — so every rung
consumer collapses to a same-frame swap, transitions included. The two shipped fallbacks that the
`index.css` comment protects (the toggle's 200 ms crossfade, the laminate's 150 ms linear fade)
are PRM-FALLBACK admissions: they never read a rung, so they keep breathing. Tailwind's default
tier joins the ladder through `--default-transition-duration`, so its 17 elements collapse too.
This changes what a reduced-motion user sees across 28 rules and 60+ elements, and the goldens
are PRM-frozen and blind to it, so the assertion is a born-RED runtime roster (B5, §6), never a
bitmap. The `index.css` universal reset stays as the animation floor for anything outside the
ladder; its comment is re-written to say what is now true.

---

## 4 · The plan — files, order, what each commit is

Three commits, one row each, so the ceiling holds per row rather than being raised:

1. **THE GATE, born-RED** (`scripts/check-motion-bands.mjs` + `scripts/motion-inventory.base.json`).
   B3 widened to `["']`; B5 rule-level (§6); B6 anchored to the banked inventory as a ratchet
   (values may only rise; a shortening needs a RETUNE row with a cite), the base ref `aab67b92`
   as the git fallback, and the self-test calling `b6NoShorten` itself; B7 reads Tailwind
   `duration-N` / `transition-*` class attributes; B8 = i2 folded in; `EXEMPT_KEYS` gains
   `settleGuardMs`; `LADDER_MAX` 8; the ADMITTED ledger content-anchored; the inventory's
   negative control (shorten one banked row → RED). `npm run lint:bands` + the CI lane in the
   same commit. ≤3 files.
2. **THE HOME** (`pencilConfig.ts`, `main.ts`, `index.css` root line + `--ease-dusk`,
   `useFlipGlide.ts`, `useCarouselGlide.ts`, `useControlsDrawer.ts`, `App.vue` ×2 sites,
   `GameGallery.vue` ×2, `GameCard.vue`, `usePathAnimation.ts`, `DrawerTab.vue` berth key, the
   six Tailwind class attributes, the R6 MOVED rows diff). The `<style>` publisher; the seven
   rungs; the band keys deleted; the dock reads `rise`; the guard constant; the tongue's swap
   keyed on settle; i3-B retired and I6 widened in the same commit that would blind them. ≤16
   files, vue-tsc 0.
3. **THE SITES** (the 54 script-class positions + the 16-site curve row + the twins + the dusk +
   the PRM arms). `apply-ladder.mjs` re-run, anchored edits that fail loud. ≤16 files.

Order matters at 1 → 2 (the gate is RED before the home lands) and inside 2 (the instruments are
widened in the commit that would blind them). Nothing in `gameCell.css` this pass.

---

## 5 · The MOVED record (R6, proposed as a diff, never re-cut in place)

`instruments/R6-moved-rows.diff` beside this file proposes three re-wordings of
`r0/r6-idiom-history/R6-census.md`, each reported MOVED:

- §1.3 the guard ribbon: 240 ms → `note` 250 ms on `--ease-glassGlide` (note 250 is exactly two
  boil beats; 240 is not — the argument FOR the move, in the row that moves the record).
- §2 law 4: "No timing constant outside `pencilConfig`" — the three named keys become
  `MOTION.rungs` (seven), `beatMs`, `settleGuardMs`, and the CELEBRATION budget.
- §1.1 `HandDrawnGrid`'s progress trace is not an R6 row, but its own comment at `:620-623`
  reasons about 240 ms against J3's window; the diff re-writes that comment to 250 in the same
  hunk, because a comment that contradicts its declaration is the defect this section exists
  to kill.

MOT-VERB cites the ribbon row; it does not file it twice.

---

## 6 · Gates this family lands with (born-RED, reading at HEAD `a8fee1f5` in brackets)

| id | asserts | RED at HEAD | negative control |
| --- | --- | --- | --- |
| B1 NAMED | every first time value in a `transition:`/`animation:` term is a rung or an ADMITTED row; the ledger is closed both ways and content-anchored | 59 unadmitted | remove one ledger row → RED |
| B2 CLOSED | `MOTION.rungs` has ≤8 keys; every other numeric MOTION member is EXEMPT by cite or an admitted GRADED class (`DRAW_IN_PRESETS`) | 4 unruled band keys | add `dockGlideMs: 600` as a bare key → RED |
| B3 MIRROR + FALLBACK + ONE HOME | the `<style data-motion-rungs>` text equals the TS rungs byte for byte incl. the reduce arm; every `var(--motion-r, n)` has `n === rungs.r`; no second publisher in `["']` | RED (no publisher) | the single-quoted `:style` shadow → RED (was GREEN, research F6) |
| B4 NO-ALL | `transition: all` nowhere | 1 | — |
| **B5 PRM (rule-level, runtime)** | on the built dist under `reduce`, both engines, 390×844 dock open and 1280×800: no live rule reading `var(--motion-*)` resolves a nonzero duration; every OTHER live nonzero rule is in the PRM-FALLBACK class (2 rows) | **28 rules tween** | append one un-admitted live rule to the fixture → RED |
| **B6 NO-SHORTEN (banked)** | every duration in the tree ≥ the banked inventory's value for that row; a lower value needs a RETUNE row with a cite; the self-test CALLS `b6NoShorten` | cannot yet fail (GREEN over 59 literals) → RED at first run against the bank with one row shortened | shorten one banked row → RED |
| B7 TAILWIND | no `duration-\d+` class attribute; `--default-transition-duration` reads `var(--motion-whisper)`; each override is an arbitrary-value utility naming a rung | 6 sites, 0 root line | plant `duration-300` → RED |
| B8 CURVE (i2 folded) | no bare `ease`/`ease-in`/`ease-out`/`linear` on a `transition:` | 16 | — |
| B9 DELAY FENCE | the second and later time values in a term are literals, never `var(--motion-*)` | GREEN at HEAD by vacuity; RED on the MOT-VERB pass-1 branch (10 terms) — a section gate | plant `… var(--motion-note) var(--motion-whisper)` → RED |
| G-DOCK-BAND (i7 + runtime) | `rungs.rise`'s docstring carries `travel: <a>px @<w>x<h> … <b>px @<w>x<h>`; the live sheet's travel at 844×390 / 390×844 / 768×1024 matches the declared ends within 5 % | 0 of 1 declared | edit the declared px → RED |
| G-EXIT-MIRROR | on C06's build, each exit mover's declared travel mirrors its entry's within 10 %, 1440×900 and 390×844, both engines | 390×844 wordmark 10.0 vs 145.5 px | — |
| G-TONGUE | the tongue's rect never moves >8 px between two consecutive frames while not occluded by the sheet, open and close, both engines | 157–158 px on open | key the swap back on `open` → RED |
| G-GUARD | one settle-guard constant, read by both FLIP engines | 200 vs 220 | — |
| I6 (widened) | every non-admitted duration NAMED | 77/35/4 | — |

Plus the runtime probes banked, not gated: the reduce roster both regimes, the dock settle rect
after 700 ms (identity), the 15-gesture frame trace on paired dists (no new >33 ms frame; the
cold-bake frames are W8's, cite G1/G2/C02/C05), and six alternating theme flips at 4× reported
as control-vs-prototype parity plus a long-frame list — **the absolute >100 ms criterion is
retired by name**; the device floor is W8 §8.3's owner-run instrument (M06/M09, M19).

---

## 7 · The prototype brief

**Build.** A FRESH worktree from `aab67b92` under the scratchpad (never the pass-1 worktrees —
chair §7), with `0bf9cb0e` (W8 C06, two lines) cherry-picked so the exit plays, then the pass-1
`proto/apply-ladder.mjs` replayed and the pass-2 delta applied (§4's three commits, as three
patches in the worktree, never committed on the main tree). `npx vite build` → `dist-after`.
Control: the same base + C06 alone → `dist-control`. Bank both dist identities (entry chunk +
`index.html` md5). Serve on 127.0.0.1:4246 (after) and the next free in 4230–4249 (control),
`--strictPort`; vite dev only through a two-line scratch config with a private `cacheDir`; a
scratch Playwright config; chromium + webkit headless; 390×844 dsf3 touch, 768×1024, 844×390,
1440×900; both themes. No osascript, no Safari.app. Every server killed before return.

**Static readings, both trees, bare (a pipe eats the exit code):** the table in §6 — every gate RED
at the control and GREEN after, plus the self-test (every check shown able to fail, B6 by calling
the function), `lint:motion`, `vue-tsc --noEmit` 0, `lint:copy` GREEN, `check-font-coverage`
unchanged, bundle delta (ceiling +400 B raw / +150 B gzip).

**Runtime readings.**

| probe | success |
| --- | --- |
| the published node | `<style data-motion-rungs>` reads all seven rungs; under `reduce` every `--motion-*` resolves `0s` at `:root` AND on `.icon-btn`, `.washi-label`, `.drawer-tab-text`, a `.transition-colors` element, both engines |
| B5 roster | 0 live rules reading a rung with a nonzero duration under reduce; exactly the 2 PRM-FALLBACK rows nonzero |
| dock band (`dock-band-audition.mjs`, copied and re-pointed) | at `rise` 600 on the built dist: worst 60 Hz frame ≤78.6 / 72.3 / 34.9 px at 768×1024 / 390×844 / 844×390; the desk control 209 px @520 unchanged to ±0.7 px; both engines within 5 % |
| dock settle | open, wait 700 ms: 0 running animations; rest rect equals control's to the pixel, both engines, both themes |
| tongue | per-frame rect over open + close at 390×844: max frame-to-frame move while unoccluded ≤8 px (control 157) |
| exit on C06 | `.board-peek-host` running ≥3 frames with a live transform (i1 GREEN); per-mover travel enter vs exit within 10 % or the row corrected with the number |
| exit roster at +90 ms | exactly the table in §1.4: 5 animations (6 with the board), lengths note/whisper/leave/throw, curves standard/fadeOut/drawOn/glass, no bare `ease`; the tag/bar whisper fades masked (parent opacity <0.05 at their first 150 ms) |
| frame trace, 15 gestures | no gesture gains a >33 ms frame against the control; bake frames unchanged in kind (W8's) |
| theme flips ×6 at 4× | parity with the control per flip; long-frame list identical; the dusk's painted `background-color` sequence byte-identical (`--ease-dusk` = `ease`) |

**π identity (surfaces this family does not claim), all on `dist-after` with the control paired,
raw output BANKED under `readings/`:** goldens 4/4 unmoved; `filter-census` + `theme-quadrants`
with the load state declared (bare load, 1280×800, both engines) — the allowlist count 9 exact;
`check-font-coverage`; r6's `hue-census.mjs` (it writes nothing — run it and bank its stdout here)
29 rows byte-identical; r1's `heading-voice.spec.ts` and r3's wobble probe re-run from COPIES
with `OUT` re-pointed into this lane's dir, readings identical.

**Frames.** Zero. Every claim above is a number. If the critic wants a picture, ONE crop ≤150 KB:
the tongue at the open's settle frame, 390×844 dark, chromium beside webkit.

**Cost.** Three commits, each ≤16 files; total deletions may exceed pass 1's −80 because the band
keys, the component publisher and the Tailwind classes die — state the count, never hide it.

---

## 8 · Risks carried forward

- `rise` 600 is a proposal. If the owner keeps 520 at the re-look, the seventh rung dies in one
  line and every reading above still stands for `throw`. A rung with one consumer is legitimate
  only because that consumer's number was never seen; say so at the fold.
- The PRM posture change is user-visible for reduced-motion users across 28 rules. It is R6 law
  43's direction and B5 asserts it at runtime; a bitmap cannot.
- The tongue's settle-keyed swap is a timing change on W2's landed mechanics. If W2's leader
  reads it as a mechanic, the row moves to W2 with G-TONGUE attached; the grammar stays here.
- The exit is measured on C06's build. If W8 §8.2 does not merge before W7 executes, the §1.4
  table's exit column is aspiration again — the record says which build it describes.
- `gameCell.css` is untouched by this family this pass (MRK-LIVE's file under §6.11); its two
  `ease-out` rows stay B8-RED and are ADMITTED to §6 by name until that leader rules.
- The bench acquits nothing about the real iPhone. M02's arbiter is W8 §8.3.
