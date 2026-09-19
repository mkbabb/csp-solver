# MOT-VERB — pass 2 SYNTHESIS · the pencil verbs, made enforceable and made honest

T9-W7 §13 the transition grammar · §7's exit · §12's motion half · M02 / M09 (design half).
Input: `../research/MOT-VERB/README.md` + `sweep-table.md` (55 rows, every delta costed), the
pass-1 spec, prototype and critique, the chair's rulings, the pass-1 worktree diff
`wf_e58b4764-0fc-52` (26 files +351/−89). Read-only on product files; nothing closes (U-10).
Method: the frontend-design two passes — plan, review against the tells, then specify.

Two facts from outside the family bind it. **W8 C06 (`0bf9cb0e`, `w8/app`) has landed the I1
cure in exactly this family's proposed shape** — `anim.id = FLIP_GLIDE_ANIM_ID` in
`useFlipGlide.run`, `boardAnimations()` filters by id — so the ballot on `restoreBoardAnims` is
moot: W8 owns the mechanism, TURN is provable on an exit that plays, and this family cites.
And **MOT-LADDER's pass-2 synthesis adopts the delay fence section-wide** (its gate B9), so the
rule that restores this family's erased beats is no longer the family's alone.

---

## 0 · The plan, and the review against the tells

**Subject.** A pencil-and-paper puzzle. Motion is what a hand does on paper; a transition that
is not one of those acts is undefined, which is M09's word. Pass 1 proved the primitive (RUB
OUT, the twins, PRM at the ladder) and then broke six decided beats with a sweep its own gate
could not see. Pass 2 does three things: fences the delay out of the rung layer, makes the verb
enforceable by what a declaration MOVES, and rules every one of the 55 changed rows KEEP, REVERT
or ADMIT with its number.

**Tokens (the plan).**

| axis | the set | home |
| --- | --- | --- |
| rungs | page 520 · step 440 · sheet 280 · mark 250 · breath 200 · touch 150 (unchanged; the histogram given travel names) | `MOTION.rungs` → `--rung-*` |
| verbs | LAY DOWN · LIFT · TURN · SLIDE · WRITE IN · RUB OUT · DUSK (unchanged count; two tuples widened by one word each, §1.2) | `MOTION.verbs` → `--verb-<name>-ease` |
| fill | a VALUE (`"none" \| "backwards"`) plus a `mechanism` list, read by `spend()` | the verb tuple |
| PRM | a value of the ladder, emitted by the publisher beside the rungs (composes with MOT-LADDER's `<style>` publisher; never inline, never `!important`) | the published block |
| colour | none. Zero hex, zero `--color-*`; the measured AA ratios in `index.css` are untouched by construction | — |
| copy | none rendered. Gate messages in M16's register | — |

**Voice.** The one memorable thing in this pass is a fence, not a token: **a delay keeps its
number; only travel takes a rung.** `transition: opacity var(--rung-breath) var(--verb-lift-ease)
240ms` — the first time value is how far, the second is when, and the gate reads them
differently. Everything else is quiet: HEAD's beats come back, the toggle stays the owner's,
the players well keeps its lighter return, and the verbs the pass is proudest of (RUB OUT, the
twins) stand exactly as pass 1 built them.

**Layout (the grammar, with the fence).**

```
   SHAPE  (index.css §THE MOTION VOCABULARY)        TIMING  (pencilConfig MOTION)
   @keyframes + --ease-*  ──consumes──▶  --rung-* × --verb-*-ease
   transition: opacity  var(--rung-breath)  var(--verb-lift-ease)  240ms ;
               ▲        ▲                   ▲                       ▲
               │        │                   │                       └─ DELAY: a literal (rule 2′)
               │        │                   └─ rule 1′: a --verb-*, never --ease-* here
               │        └─ rule 2: the FIRST time value is a rung
               └─ rule 5: opacity ∈ lift.props   rule 5b (keyframes): this row LEAVES
```

**Principles.** (1) Name what ships, retune nothing — now with a per-row ledger that proves it.
(2) A delay is a wait, not a gesture; no verb and no rung owns it. (3) A verb is enforced by
what its consumer moves, or it is a comment. (4) A character gesture is admitted whole, never
half-assigned (the toggle). (5) A graded set keeps its literals until the owner auditions it on
rungs (the players well). (6) Every changed pixel is declared with its number.

**Review against the tells.** The generic version is a Material duration scale with
`standard`/`decelerate`/`accelerate` and a lint that checks spelling. Four things in my first
plan were that default and were revised:

1. I had rule 5 growing the ledger by three `layout` rows AND restoring "a return is lighter"
   on the sheet/mark + mark/breath ladder (research §3.3). That restoration SHORTENS
   (`.is-arriving .player-name` 380 → 250, −130 ms) and B6 NO-SHORTEN / the QUALITY LAW forbid
   it as a sweep. **Revised: the players well is ADMITTED whole as one GRADED set at HEAD's
   literals; the rung ladder that would express it is BANKED as a pass-3 audition, not
   shipped.** The decision survives by definition, and the comment is corrected to the truth.
2. I had the toggle assigned row by row with the delay fence reverting its delays — the
   research's FENCE timeline. Even with the fence, four of its durations move (wring 340 → 250,
   the rise 300 → 280, the icons 100 → 150) on the owner's most-audited surface. **Revised: the
   whole `.is-turning` gesture is ONE admitted `signature` (eleven values, the beat table as its
   cite), and the verbs reach only the toggle's chrome rows (hover, rest swap).** The closed-set
   test still passes: DUSK is the verb for the page's light; the whirl is a character.
3. I had SLIDE gaining an `opacity` arm as a special case for `GameCard.vue:410`. It is not a
   special case: a card's opacity along the rail IS its depth on the rail. **Revised: `slide.props`
   is `transform, opacity` by definition, one word, no new verb, no rung-set change.** LAY DOWN
   likewise gains `breath` (research owner row 2): a ground arriving at 200 ms is the estate's
   second-commonest length, and without it three rows were silently lengthened to `mark`.
4. I had the 17 `standard → layDown` hover grounds as "pure renames" because pass 1 called them
   assignments. Δprogress 0.548 is not a rename. **Revised: one declared class row with the
   number, U-10 owns the look.**

Kept that looks like a default: four names for the glass curve. It is grammar because rule 5
makes the names mean different things (turn: transform, page only · slide: transform + opacity,
four rungs · layDown: six properties, four rungs), and a four-line gate names the declared
pairs so a fifth cannot appear unannounced.

---

## 1 · The tokens

### 1.1 Rungs — unchanged

`page` 520 · `step` 440 · `sheet` 280 · `mark` 250 · `breath` 200 · `touch` 150. `beatMs` is the
boil's clock, not a rung. (The dock's rung is a BAND question — MOT-LADDER's audition is the
evidence; this family spends `slide` at whatever rung the section rules, and its law permits a
per-pose rung on one engine, never a second engine or a re-eased curve.)

### 1.2 Verbs — two tuples widened by one word, fill made a value

| verb | ease | props | fill | mechanism | rungs |
| --- | --- | --- | --- | --- | --- |
| layDown | `(0.32, 0.72, 0, 1)` | opacity, transform, background-color, color, box-shadow, stroke, **filter** | none | transition, keyframe | page · sheet · mark · **breath** · touch |
| lift | `(0.32, 0, 0.67, 0)` | opacity, transform, scale | none | transition, keyframe | breath · mark · touch |
| turn | `(0.32, 0.72, 0, 1)` | transform | none | waapi | page |
| slide | `(0.32, 0.72, 0, 1)` | transform, **opacity** | none | waapi, transition | page · step · sheet · touch |
| writeIn | `(0.22, 1, 0.36, 1)` | clip-path, stroke-dashoffset, opacity | backwards | keyframe | mark · breath · touch |
| rubOut | `(0.32, 0, 0.67, 0)` | clip-path, opacity | backwards | keyframe | breath · mark |
| dusk | `(0.25, 0.1, 0.25, 1)` | background-color, color | none | transition | its own `ms: 350` |

`filter` joins LAY DOWN because the `transition: all` cure names `filter, transform` and the
family's own property law must not red its own cure. A property-alias table travels with rule 5:
`background ⊃ background-color`, `scale`/`translate`/`rotate` ⊂ transform-family, `inset`,
`border`.

```ts
fill: "none" | "backwards";                            // a value, read by spend()
mechanism: ("transition" | "waapi" | "keyframe")[];    // where the verb may be spent
```

`spend(verb, rung)` returns `{ duration, easing, fill: verbs[verb].fill, composite: "replace" }`
and its `verb` type is derived — `keyof verbs` narrowed to those whose `mechanism` includes
`"waapi"` — so `spend("writeIn", …)` is a type error, not a masked fallback. `FILL_ALLOWLIST`
(`filterBudget.ts:252`) is untouched: no verb fills `forwards`.

**The scheduler is out of the verbs' scope, in writing.** pencil-boil's
`createSequenceSubscription({ easing })` takes `(t: number) => number` and its vocabulary is
four functions disjoint from the verbs; seven sites (`useJoinWash.ts` ×2, `glyphAnimations.ts`,
`usePathAnimation.ts`, `DifficultyTally.vue`, `GameCard.vue`, `GameGallery.vue`) cannot spell a
verb. The gate walks `.ts` for `.animate(` only (2 sites, both already `spend()`). A `spend().fn`
arm (`cubicBezier(x1,y1,x2,y2)` exported from pencil-boil) is a library release and is banked
as the pass-after-next's row, not this diff.

### 1.3 The published block and its PRM arm

Generated by `publish-verbs.mjs` from a MARKER PAIR in the TS (`/* @verbs-begin */ … /* @verbs-end */`),
never by indentation or a literal end sentinel (research risk 8: a prettier reflow redded the
pass-1 gate). The block carries `--rung-*`, `--verb-*-ease`, `--verb-dusk-ms` and its own reduce
arm:

```css
@media (prefers-reduced-motion: reduce) {
  :root { --rung-page: 0ms; … --rung-touch: 0ms; --verb-dusk-ms: 0ms; }
}
```

This composes with MOT-LADDER's `<style>` publisher because neither writes inline properties;
if the section ships one publisher, this block is its output. The two admitted PRM fallbacks
(the toggle's 200 ms crossfade, the laminate's 150 ms linear) keep their literals and keep
breathing.

**Declared duplicate pairs** (a four-line gate row, `check-theme-tokens` catches zero-consumer
tokens, not byte-duplicates): `--ease-glassGlide` ≡ `--verb-layDown-ease` ≡ `--verb-slide-ease`
(+ `turn`, unpublished — I3-A holds); `--verb-lift-ease` ≡ `--verb-rubOut-ease`;
`--ease-noteWrite` ≡ `--verb-writeIn-ease`. Any other pair of published curve tokens resolving
to the same points is RED.

---

## 2 · The rules, made enforceable (the gate's law, measured costs)

| rule | law | cost on the pass-1 branch | catches |
| --- | --- | --- | --- |
| **1′** | outside a `@keyframes` body a `transition:` curve is `var(--verb-*-ease)` or `v-bind`; `--ease-*` is legal only as `animation-timing-function` inside a keyframe or on an `animation:` in the ledger's `shape` kind | 1 uncured row (`GameCard.vue:410`, now SLIDE @ step by §1.2) + 3 admitted | negative control A (a legacy token with the rung kept) |
| **2′ the delay fence** | rule 2 applies only to the FIRST time value in a term; the second and later are delays, keep their literal, and may not read a rung | 9 delay terms revert to literals (two already equal a rung and lose nothing) | six moved beats come back with zero new tokens |
| **5** | the properties a declaration moves ⊆ its verb's `props`, through the alias table; for an `animation:` the moved set is read from the `@keyframes` body (29 in the tree, censused) | 7 reds → 0 after §3's dispositions | negative control B (an erase curve on `note-in`); `SolverErrorNote:63` and `HandwrittenLogo:647` were WRITE IN on a rise-and-fade — LAY DOWN, mechanically |
| **5b** | a keyframe whose `to` reduces coverage (opacity 0, `inset(… 100%)`, scale down) is a LEAVE and takes lift/rubOut; one whose `to` restores it is an ARRIVAL and takes layDown/writeIn. Keyframes enforced; transitions advisory (their direction lives in the rule pair) | 1 red on the branch (`DMT:883/884`, LIFT on the star's arrival) → moot under §3's toggle admission | the sharpest shipped error |
| **6 the ledger key** | `${file} :: ${body} #${n}` — an occurrence ordinal, so two identical declarations in one file are two rows | HEAD 4 collisions, branch 6 → 0 | the ledger can SEE a graded pair collapse into one text |
| **7 walk `.ts`** | every `.animate(` options object is a `spend(` call or a spread of one | 0 (both sites already spend) | a future mover typing a number |
| **8 the beat table is a fixture** | `DarkModeToggle.vue`'s beat table is written ONCE as data beside the gesture; the runtime roster reads each `.is-turning` rule's computed duration + delay and compares | RED on the pass-1 branch (rise 150 vs 60; star 1 520 vs 560; wring 250 vs 340) | a comment that contradicts its declaration, for the one surface where it matters most |

The `SHAPE_KEYFRAME` hard-coded list (29 names, a second unnamed ledger) is DERIVED from every
`@keyframes` the tree defines; a keyframe is `shape` by existing, and its number's home is T6's
own law (bind from CELEBRATION, file by file).

---

## 3 · The 55 rows, ruled (the sweep-table's numbering)

| disposition | rows | ruling |
| --- | --- | --- |
| KEEP, pure rename (Δ 0.000) | 5, 7, 10, 20*, 28, 29, 30, 40, 44†, 45*, 46, 48, 50 | declared in one sentence. *20 and 45 are re-assigned by rule 5 to LAY DOWN (`note-in` and the caret rise-and-fade), noteWrite → glass, ΔAUC 0.018 — declared, tiny. †44 the guard ribbon: MOT-LADDER files the R6 row (240 → 250); this family cites it |
| KEEP, the family's thesis | 4 (deck leave, glass → lift, Δ 0.852), 27 (controls fade-in, drawOn → writeIn, 0.189), 47 (RUB OUT, new), 49 (laminate lift, accelIn → lift, 0.032) | these are the design; 4 is the one visible change on the gallery and the owner disposes it |
| KEEP, declared class: the naked and the standard | 15, 17, 21, 26, 55 (none → layDown, 0.375) · 14, 41, 43, 51, 52 (standard → layDown, 0.548) · 6 (DrawerTab `ease-out` → layDown, 0.406; not an R6 row, R6:49 names no curve) | one row, one number each; a ground arriving in this house is LAY DOWN, and `--ease-standard` is Material's curve under Material's name |
| KEEP, +0 ms by the widened tuple | 16 (sparkle `all` → `filter, transform`, now layDown @ **breath**: 200 → 200, was +50), 31 (toggle hover transform @ breath, was +50), 42 (gallery pip @ breath, was +50) | §1.2's `breath` arm removes three silent retimes |
| KEEP, follows the section's length rows | 1, 2 (win flood 500 → 520, none → layDown 0.375), 53, 54 (progress trace 240 → 250 writeIn 0.380 / 500 → 520 layDown) | +≤5 %, declared; §4's leader (the fill meter) is told; the completion moment gets its numbers in the record, not a crop |
| REVERT to HEAD, ADMIT whole as `signature` | 3 (dusk, already Δ 0) · 32, 33, 34, 35, 36, 37, 38 (the toggle's gesture: wring 340 on accelIn, rise 300 delay 60, out 100 delay 240, tuck 150/100 ease-in, stars 150 anticipatePop / 120 ease-out at 560/640/720) | ONE character; the beat table (research §3.2 HEAD row) is its cite and gate 8's fixture; every beat back |
| REVERT to HEAD, ADMIT whole as `graded` + `layout` | 8, 9, 10, 11, 12, 13 (the players well, 320/380·140/280/320·120/320·420/260·260 on glass/drawOn/standard) | the property `grid-template-rows` is admitted `layout` (like `GCP:2290`); the six numbers are one graded set ("a return is lighter"); the comment at `:1732` is corrected: the fold lands 40 ms sooner, the write-in 80 ms sooner. The rung expression (arriving sheet/mark · returning mark/breath) is BANKED for a pass-3 audition — it shortens, so it is never a sweep |
| REVERT to HEAD, ADMIT as `shape` | 18 (`share-pop` 500), 19 (`eraser-scrub` 400) | press flourishes; T6's cure path binds them from CELEBRATION file by file |
| REVERT, hand to §6 | 22, 23 (`marks-fade-in` ease-out, `gameCell.css`), 24, 25 (`ghost-draw-on` 180, R6 law 39) | `gameCell.css` is MRK-LIVE's file under the chair's §6.11; the ring's draw-on is §6's surface. Read-only there this pass |
| KEEP, hygiene only | 39 (CrayonHeart `.face`) | `.face` renders under `variant === 'blush'` and no shipped surface passes it; source hygiene kept, the runtime PRM claim drops to two arms + the sparkle narrowing, R4 §5's "3 unarmed" corrected to 2 |

Counts after ruling: 55 → **40 rows change**, 15 revert to HEAD byte-for-byte; every changed
row carries its resolved ms, delay, curve and max Δprogress in `sweep-table.md`'s columns;
**zero delays move**; two durations move outside the ≤5 % lengthening class and both are the
family's declared thesis (none — row 4 and 27 are curve-only; the +50 s are gone). The 32
"outside the declared surfaces" drop to 17, each in a named class row above.

The eleven falsified comments (`DMT:790`, `:865`, `:776-782`, `GCP:1732`, `:1810-1815`,
`scene.css:620-627`, `index.css:657-659`, `AnswerKeyLaminate:220`, `GameGallery:1470`,
`useCarouselGlide:22`, `DrawerTab`) are each re-written or made true by the reverts; gate 8
holds the one that matters, the toggle's.

---

## 4 · The surfaces — one memorable thing each, desktop and mobile, light and dark

Motion is theme-blind; no colour moves, so every row is identical on `--color-card` and
`--color-background`, light and dark.

- **The gallery, in and out.** The twins finally are: chrome and deck leave on one curve. The
  exit is the entry reversed, and on C06's build it paints for the first time: TURN @ page on
  the board and the wordmark, LIFT @ breath on the deck, WRITE IN @ mark (+150 literal) on the
  chrome. Nothing else moves.
- **The drawer, desk and dock.** TURN @ page on the desk, verbatim (R6 #1/#2). The dock is
  SLIDE at the section's rung (MOT-LADDER's `rise` 600 proposed / `page` 520 shipped) — this
  family declines the number and permits a per-pose rung on one engine. The tongue's straighten
  is LAY DOWN @ touch, declared (Δ 0.406 from `ease-out`).
- **The dusk.** Its own verb, its own 350, `ease`'s own points under a name: paint byte-identical.
  The toggle's whirl beside it is a character, admitted whole; every beat is HEAD's.
- **The margin note's exit.** RUB OUT @ breath (200 — the section's one rub-out duration,
  MOT-LADDER §1.5; 125 rejected for the beat collision; `touch` 150 the lawful faster answer if
  §7 wants the erase asymmetry). The keyframe's `to` is the cascade rest pose; fill `backwards`;
  PRM shows the end pose in the same frame. Exactly as pass 1 built it.
- **The hover rows.** Law 14's three forms are the verbs: ink lift = LIFT @ touch, a drawn mark
  = WRITE IN @ touch, a ground = LAY DOWN @ touch or breath.
- **The players well.** Untouched in paint. A return is still lighter than an arrival, and now
  the comment says by how much.

---

## 5 · Copy

None rendered. Gate messages in M16's register, e.g. `src/App.vue:1142 spends 200ms with no
rung. Name a verb and a rung, or admit it with a ruling.` and `DarkModeToggle.vue: the rise
starts at 150ms; the beat table says 60ms. Fix the declaration or the table, in the same
change.`

---

## 6 · Plan — files, order, what dies

1. `pencilConfig.ts` — the marker pair; `fill` split + `mechanism`; `slide.props` + `layDown.props`
   / `layDown.rungs` widened; `spend()` reads fill, derived verb type. Head comment unchanged.
2. `scripts/publish-verbs.mjs` (marker-pair parse) + `scripts/check-pencil-verbs.mjs` (rules 1′,
   2′, 5, 5b, 6, 7, 8; the derived shape set; the duplicate-pair row; the ledger's new kinds
   `layout`/`graded` with the players well and `shape` with the two flourishes; the two PRM
   fallbacks) + `--self-test` with both negative controls and the delay-fence sabotage. Born-RED
   on the pass-1 branch before step 3.
3. The reverts (§3): `DarkModeToggle.vue` (rows 32–38 back to HEAD + the beat-table fixture),
   `GameControlPanel.vue` (rows 8–13 back to HEAD, `:1732` corrected, `:2087` at `breath`),
   `gameCell.css` (rows 22–25 back to HEAD — hands off), `share-pop`/`eraser-scrub` back.
4. The `breath` arm: `GameGallery.vue` pip, `DarkModeToggle.vue:717`, the sparkle.
5. `GameCard.vue:410` → `var(--rung-step) var(--verb-slide-ease)`.
6. `App.vue:461`'s `animKey === ""` guard REMOVED in favour of C06's id filter (already on
   `w8/app`; the prototype builds on it).
7. The eleven comments.
8. The r0 record: R6:42 re-worded (MOVED narrowly — both numbers hold, the asymmetry survives,
   the token's name and 3.2 % of curve moved), as a proposed diff under
   `instruments/R6-laminate-row.diff` beside this file; R6:48 cited from MOT-LADDER's diff.

Dies: the `SHAPE_KEYFRAME` list · the indentation parse and its end sentinel · `fill` as prose ·
the `animKey === ""` guard · ten rung-spelled delays · three silent +50 ms · the wring-down
retime · the players well's collapse. Stays from pass 1, untouched: RUB OUT, the twins, PRM at
the ladder, `--ease-fadeOut` folded, `turn` unpublished.

---

## 7 · Prototype brief

**Build.** A FRESH worktree from `aab67b92` under the scratchpad with `0bf9cb0e` (C06)
cherry-picked, then the pass-1 worktree's diff replayed (`git -C wf_e58b4764-0fc-52 diff` as a
patch) and §6 applied on top. `npx vite build` → `dist-after`; control = base + C06 alone →
`dist-control`; dist identities banked. Served on 127.0.0.1:4247 and the next free in
4230–4249, `--strictPort`; scratch vite config with a private `cacheDir` for any dev server;
scratch Playwright config; chromium + webkit headless; 390×844 dsf3 touch and 1280×800; both
themes. No osascript, no Safari.app. Every server killed before return. Read-only in
`gameCell.css`.

**Order.** Step 2 RED on the replayed pass-1 branch (bank: rule 1′ 1, rule 5 7, rule 5b 1, the
fence 10, gate 8 three beats, collisions 6) → steps 1, 3–7 → GREEN (0 / 0 / 0 / 0 / 0 / 0) →
the self-test (negative controls A and B RED, the fence sabotage RED, a comment inserted into
the marker pair still parses).

**What proves it (numbers first; crops zero).**

| probe | success |
| --- | --- |
| gate 8, the toggle's beats | computed `transition-duration`/`-delay` on `.is-turning` rules read HEAD's table exactly (rise 300 @ 60, wring 340, stars @ 560/640/720 with 80/80 stagger), both engines |
| the players well | `.is-arriving` vs `.is-returning` computed durations differ by 40 ms, their names by 80 ms — the comment is true; 0 ledger collisions |
| proof 9 by derivation | `enforce-cost.mjs` re-run on `dist-after`'s source: 0 disagreements with the shipped assignment (was 7) |
| the twins (P5) | opacity of `.scene-controls` and `.gallery-fade-leave-active` at t=100 ms of the exit: ratio 1.00 both engines (control 19.3) |
| TURN on the exit | I1 GREEN on C06's build: `.board-peek-host` running ≥3 frames with a live transform, both engines both widths; the entry as control |
| RUB OUT live | inject `.is-rubbing-out` on a real hint note: 1 glyph box across 14 frames, clip retreats to `inset(0 0 0 100%)`, 0.2 s; PRM end pose same frame with `animation: none`, both engines both themes |
| PRM at the ladder | under `reduce`, `:root` reads every rung 0s; `DrawerTab:144`, `CrayonHeart:329`, `SheetWashiLabel:109` read 0s; the two admitted fallbacks read 200/150 |
| the duplicate-pair row | exactly the three declared pairs; plant a fourth → RED |
| dusk | six alternating flips at 4×: control-vs-prototype parity per flip and an identical long-frame list; the painted `background-color` sequence byte-identical. The absolute fps / "≤17 steps" clause is retired by name (r0 R4 :201-202; r7 M09 16 vs 33 steps by engine); the device floor is W8 §8.3 |
| frame trace, 15 gestures at 1× | zero new >33 ms frames against the control; nothing shortened |
| π | goldens 4/4; `check-font-coverage` unchanged; filter census with the load state declared (bare load, 1280×800, both engines; allowlist 9 exact); r6 `hue-census.mjs` stdout banked, 29 rows identical; r1 heading and r3 wobble probes from copies with `OUT` re-pointed, identical |
| instruments | `lint:verbs` 0 unadmitted / N admitted (the ledger's exact count stated) / 0 stale · publisher 13/13 · I3-A/B GREEN · I6 GREEN · I2 recorded superseded · `lint:motion` GREEN · `lint:copy` GREEN · `vue-tsc` 0 |

**Frames.** Zero. Pass 1 banked the half-erased word and the deck-beside-chrome frame; nothing
in this pass moves a pixel those did not already show. If the critic asks, one crop ≤150 KB:
the exit at t=260 ms on C06's build, 390×844 dark, both engines — the first picture of the
board mid-unfold.

**Cost.** ≤26 files (the pass-1 count; the reverts remove lines), deletions stated.

---

## 8 · Gates this family lands with (born-RED; reading on the replayed pass-1 branch in brackets, at HEAD where it differs)

| id | asserts | RED |
| --- | --- | --- |
| V1 rule 1′ | a `transition:` curve outside `@keyframes` names a verb | 1 (`GameCard.vue:410`); at HEAD every row |
| V2 rule 5 + alias table | moved properties ⊆ the verb's props | 7 |
| V2b direction (keyframes) | a leaving keyframe takes lift/rubOut, an arriving one layDown/writeIn | 1 (`DMT:883`) |
| V3 the delay fence | the second and later time values are literals | 10 terms |
| V4 walk `.ts` | every `.animate(` spends | GREEN by construction; sabotage → RED |
| V5 fill from the verb | `spend("rubOut","breath").fill === "backwards"`; `spend("writeIn",…)` a type error | RED (hardcoded `"none"`) |
| V6 the ordinal key | 0 colliding ledger keys | 6 (HEAD 4) |
| V7 marker-pair publisher | a comment inserted inside `RUNGS` still publishes | throws |
| V8 declared duplicates | no two published curve tokens share points undeclared | 3 undeclared |
| V9 the beat table | the toggle's computed beats equal its fixture | 3 beats |
| V10 the players well | arriving − returning = 40 ms (row) and 80 ms (name), computed | 0 and 0 |
| I1 (C06) | the exit fold paints | RED at HEAD, GREEN on C06 — cited |
| P4, P5, RUB OUT live, PRM at the ladder | as pass 1 | as pass 1 |

---

## 9 · What the owner disposes at the re-look (U-10)

1. The deck's leave on LIFT — the one visible change on the gallery (row 4, Δ 0.852).
2. The 17 hover grounds on LAY DOWN instead of Material's `standard` (Δ 0.548).
3. The tongue's straighten on LAY DOWN (Δ 0.406).
4. The players well on rungs (arriving sheet/mark, returning mark/breath) — a pass-3 audition
   that shortens, shown beside HEAD; or the graded literals stay forever.
5. The dock's rung — MOT-LADDER's `rise` 600 or `page` 520; this family spends whichever.
6. RUB OUT at `breath` 200 (the section's ruling) or `touch` 150 (the erase asymmetry).
7. The toggle's reduced-motion crossfade: keep the 200 ms fallback (admitted) or cut.
