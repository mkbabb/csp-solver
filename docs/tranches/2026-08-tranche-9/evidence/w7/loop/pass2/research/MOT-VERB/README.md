# MOT-VERB — pass 2, RESEARCH · the pencil verbs, made enforceable

T9-W7 §13 the transition grammar · §7's exit · §12's motion half · M02 / M09 (design half).
Read-only on product files; nothing committed anywhere; no dev server started (every number
below is a file read or arithmetic, so the band stayed free for the lanes that need a browser).
Read against the chair's rulings (`pass2/CHAIR-RULINGS.md`), the pass-1 charter, the pass-1
record (spec · prototype · critique), r0's R4/R6/R7 censuses and the pass-1 worktree
`.claude/worktrees/wf_e58b4764-0fc-52` at `aab67b92`.

Instruments here, all read-only and all re-runnable: `probe/sweep-tabulate.mjs` (the sweep
table), `probe/enforce-cost.mjs` (what the two new rules would cost),
`probe/ledger-collisions.mjs` (the key collision, measured on both trees),
`probe/curve-deltas-p2.mjs` (the bezier arithmetic, widened by five pairs pass 1 never costed).
Readings in `readings/`. The table is `sweep-table.md`.

---

## 0. The one-line finding

The family's claim is sound and its gate does not carry it — but the gap is **narrower and more
fixable than pass 1 found**, and the thing that actually broke the estate's decided beats is not
the verbs at all. **It is the rungs, spent on DELAYS.** The gate's own comment says "a delay is a
wait, not a gesture, so no verb owns it" and then the sweep spelled ten delays as rungs anyway,
with no law governing them. Every erased decision pass 1 names traces back through that one
hole: the toggle's 60 ms rise (→150), the twinkle stagger's 560 (→520), the return-is-lighter
pair. Fence the delay out of the rung layer and six moved beats come back with one rule.

---

## 1. The sweep, declared (charter item 1)

`sweep-table.md` is the full tabulation: **55 declarations changed** (54 edited, 1 new) where the
record declares two visible retimes. Counts:

| | |
|---|---|
| durations moved | **22 declarations**, −130 ms (`GCP:1728`) to +50 ms (`GG:1320`, `DMT:774`, …) |
| delays re-spelled as rungs | **10 terms / 7 declarations**; **8 terms MOVED** |
| curves moved | **43 declarations**, 13 distinct substitutions |
| outside the five declared surfaces | **32 of 55** |

Pass 1's critic banked max \|Δprogress\| 0.749. Re-derived and widened, the true maximum is
**glass → lift, 0.852 at t=0.40, ΔAUC −0.560** — and four substitutions were never costed at
all: glass→lift (0.852), standard→lift (0.663), ease-out→lift (0.569), ease→writeIn (0.380).
At a mid-gesture frame glass paints 0.955 and lift paints 0.128, so `.player-row.is-leaving`
(`GCP:1746`) is **7.5× less far along at its own midpoint** than it was — an undeclared change
on the multiplayer surface §12 is about to re-cut.

**The ruling the synthesizer must write, per row.** Three defensible dispositions and nothing
else: KEEP (the curve/number is the verb's and the delta is argued), REVERT (spend the rung that
preserves the shipped number; the ladder has one within 20 ms for most rows), or ADMIT (the row
is a signature/shape/beat and goes in the ledger with a ruling). My recommendation per class:

| class | rows | disposition |
|---|---|---|
| pure rename, Δ 0.000 | 5, 7, 10, 20, 28–30, 40, 44–46, 48, 50 | KEEP, declare in one sentence |
| the family's own thesis rows | 4 (deck leave), 27, 47, 49 | KEEP — these are the design |
| +10/+20 ms rung snaps on non-signature chrome | 1, 2, 18, 24, 25, 39, 44, 53, 54 | KEEP, but each named in the record (four of them are the win flood and the progress trace — the completion moment, undeclared) |
| the toggle's beat table | 32, 33, 35–38 | REVERT the delays (see §3); the durations are the owner's (U-10) |
| the players well | 8, 9, 11, 12, 13 | REVERT to the lighter-return ladder (§3); 12's curve is right, its delay is not |
| a verb that does not fit | 16, 19, 20, 45 | RE-ASSIGN (see §2's rule 5 reds) |

---

## 2. Making the verb enforceable (items 2, 3, 4, 5) — measured, with costs

`readings/enforce-cost.txt` runs both candidate rules over the prototype's own `src/`
(100 declarations read). The result: **both rules are enforceable, both are cheap, and both find
real bugs the pass-1 gate is blind to.**

### 2.1 RULE 1′ — a transition names a VERB, not "a house token"

Today `HOUSE_CURVE = /var\(--(?:ease-[A-Za-z]+|verb-[A-Za-z]+-ease)\)/` accepts either layer,
which is why the critic's negative control A (a cured row reverted to `var(--ease-glassGlide)`
with its rung kept) stays GREEN. The cure is one regex split plus one exemption:

> **Outside a `@keyframes` body, a `transition:` term's curve must be `var(--verb-*-ease)` or
> `v-bind`. An `--ease-*` is the SHAPE layer and is legal only as an `animation-timing-function`
> inside a keyframe, or on an `animation:` shorthand that is in the ledger's `shape` kind.**

Cost, measured: **5 red terms across 4 declarations**, of which **3 declarations are already in
the ledger** (`GCP:2290` the one layout row, `DMT:810` the bloom, `HandwrittenLogo:560` the
wordmark wipe). The fourth is a genuine hole the pass-1 gate could not see:
**`GameCard.vue:410`** (two terms) — `transform/opacity var(--card-step-ms, 440ms)
var(--ease-glassGlide)`, the deck's flank depth pose. The sweep never touched it,
`--card-step-ms` satisfies `NAMED_DUR` and `--ease-glassGlide` satisfies `HOUSE_CURVE`, so the
row passes today while naming no verb at all. Negative control A goes RED under rule 1′.
**Cost of the rule: one uncured row.**

Eighteen further rows are `animation:` shorthands naming an `--ease-*` (the icons, the loader,
`cell-reveal`, `pencil-draw-on`). Those are the shape layer and stay legal — but note the gate's
present exemption is `SHAPE_KEYFRAME.test(body) && !RAW_MS.test(body)`, a hard-coded list of 29
keyframe names. That list is a second ledger nobody calls one; it should be derived (every
`@keyframes` the tree defines) or folded into the ledger proper.

### 2.2 RULE 5 — the properties must be the verb's (the distinguishing set)

`enforce-cost.mjs` reads what every `@keyframes` in the tree actually moves
(`readings/enforce-cost.txt` §KEYFRAMES, 29 of them) and checks each declaration's moved
properties against its verb's `props`. **7 reds in the shipped prototype**, and they decompose
into exactly the three things a property law should find:

| red | what it is |
|---|---|
| `GCP:1724`, `:1736`, `:1746` — layDown/lift on `player-row-open/close` | those keyframes move **`grid-template-rows`**, a LAYOUT property. The family's own ledger says "no verb owns a layout property" and admits `GCP:2290` for exactly that — but the players well's three rows wear hand verbs over the same property class. **Admit them, or say layout is a verb.** |
| `SolverErrorNote:63` — writeIn on `note-in` | `note-in` is `opacity + transform` (a slide-up fade). WRITE IN owns clip-path/dashoffset/opacity. **The verb is wrong**: a note that rises and fades in is a LAY DOWN. A mis-assignment the sweep shipped, found mechanically. |
| `HandwrittenLogo:647` — writeIn on `transform` | the caret's `translateY + rotate(90deg)`. Not ink arriving. **LAY DOWN @ breath.** Second mechanical catch. |
| `GCP:2087` — layDown on `filter` | the pass's own `transition: all` cure names `filter, transform`; `filter` is in no verb's set. Widen layDown, or admit. |
| `SolverErrorNote:97` — layDown on `background` | layDown owns `background-color`; the declaration says the shorthand `background`. The rule needs a **property-alias table** (`background ⊃ background-color`, `inset`, `border` …) or it reds on spelling. |

Negative control B (`note-in … var(--verb-rubOut-ease)`) goes RED under rule 5 — `note-in` moves
`transform`, which rubOut does not own. **Both charter negative controls go red under the pair.**

**Where rule 5 stops.** LAY DOWN and LIFT share `opacity, transform`, so the property set alone
cannot separate an arrival from a departure — the sharpest error in the sweep (the twinkle star's
ARRIVAL on LIFT, `DMT:883/884`, Δ 0.749/0.569) survives rule 5. What separates them is
**DIRECTION**, and direction is readable for keyframes without any new convention: a keyframe
whose `to` reduces coverage (`opacity: 0`, `clip-path: inset(… 100%)`, `scale` down) is a LEAVE;
one whose `to` restores it is an ARRIVAL. `ink-rub-out` and `player-row-close` read LEAVE;
`ink-write-in`, `note-in`, `marks-fade-in`, `sticker-pop` read ARRIVAL. **Rule 5b is therefore
enforceable on every `animation:` row with no new vocabulary.** For transitions the direction
lives in the rule pair, not the declaration — the estate's own naming carries it
(`-leave-active`/`-enter-active`, `.is-leaving`, `:not(.is-active)`), so rule 5b on transitions
is a selector-name convention and should be scoped honestly: **keyframes enforced, transitions
advisory, and say so.**

### 2.3 The gate walks only `.vue`/`.css` (item 3) — the scope, counted

Walking `.ts` is not one seam but two, and only one of them can hold a verb today:

| mechanism | sites | what a verb costs there |
|---|---|---|
| **WAAPI** `element.animate()` | **2**: `useFlipGlide.ts:164`, `useCarouselGlide.ts:328` | free — both already take `spend()`. Fence = "an `.animate()` options object is a `spend()` call or a spread of one", one AST-free regex. |
| **pencil-boil** `createSequenceSubscription({durationMs, easing})` | **7**: `useJoinWash.ts:222/:243`, `glyphAnimations.ts:68`, `usePathAnimation.ts:66`, `DifficultyTally.vue:147`, `GameCard.vue:189`, `GameGallery.vue:376` (+ `createStrokeDrawIn`) | **a verb cannot be spelled there.** Its `Easing` is `(t: number) => number` (`@mkbabb/pencil-boil/dist/easings.d.ts`) and its whole vocabulary is four functions — `easeOutCubic`, `easeInCubic`, `easeInOutCubic`, `linear` — disjoint from both the ten `--ease-*` tokens and the six verbs. |

So: **`spend()` reaches 2 of 9 script movers.** The honest options, in parsimony order:
1. **Declare the scheduler out of the verbs' scope this pass, in writing**, and gate only WAAPI
   in `.ts`. (Cheapest, and the truthful version of the present claim.)
2. **Give `spend()` a second arm**: `spend(verb, rung).fn` — a 12-line Newton bezier solver
   returning `(t)=>number` — so a verb is one tuple with two representations. The sibling
   constellation already has the shape (`resolveEasing(name)` maps a string to a curve); the
   library-level move is `cubicBezier(x1,y1,x2,y2)` exported from pencil-boil, which is a
   pencil-boil release, not a W7 diff.
3. Leave it unsaid, which is the present state and the reason TURN is outside the law.

`usePathAnimation.ts:163` (`duration: 150, easing: "easeInCubic"`) and `DRAW_IN_PRESETS`
(350/280/200/350 at `pencilConfig.ts:480-501`) are the only raw script numbers; MOT-LADDER's
charter item 4 already books them. Do not double-book.

### 2.4 `spend()`'s fill (item 4)

`spend()` hardcodes `fill: "none", composite: "replace"` while `writeIn`/`rubOut` declare
`fill: "backwards"`. Today no caller is harmed — the two consumers spend `turn` and `slide`,
whose declared fill is `"none (WAAPI, composite replace)"` — so this is a latent, not a live,
defect. The blocker is that **`fill` is PROSE**: `"by mechanism"`, `"none (WAAPI, composite
replace)"`, `"backwards"`. It cannot be read off the verb until it is a value. The fix is one
field split, and it also makes rule 5's mechanism dimension machine-readable:

```ts
fill: "none" | "backwards",        // the value, read by spend()
mechanism: ("transition" | "waapi" | "keyframe")[],   // where the verb may be spent
```

Then `spend()` returns the verb's own fill and refuses a verb whose `mechanism` excludes
`"waapi"`; the type narrows from `Exclude<…,"dusk">` to a derived union. `FILL_ALLOWLIST`
(`pencil/config/filterBudget.ts:252`) stays untouched — no verb fills `forwards`.

### 2.5 The ledger's key (item 5) — measured, and the sweep makes it worse

`probe/ledger-collisions.mjs`, run on both trees:

| tree | declarations | distinct keys | **colliding keys** |
|---|---|---|---|
| HEAD (main) | 79 | 75 | **4** |
| prototype | 80 | 74 | **6** |

The sweep raises the collision count from 4 to 6 because it collapses declarations that were
distinct into identical text: `player-row-open` 320/280 → both `--rung-sheet`, and both
`ink-write-in` player-name rows → identical. **The ledger's key is an instrument that can see
the return-is-lighter erasure, and the fix and the finding are the same object.** The ordinal is
one line — `${file} :: ${body} #${n}` where `n` counts prior occurrences in the file — and the
four HEAD collisions (`gameCell.css` ×2, `scene.css:617/629`, `MarginNote` ×2) prove it is not a
prototype-only concern.

### 2.6 The I1 cure, by identity (item 6)

`animKey(a)` is `animationName ?? transitionProperty ?? ""` (`App.vue:424-427`), so
`animKey(a) === ""` skips **every** script-made animation on the board subtree, forever. One
line each side closes it: in `useFlipGlide.ts:164` the mover already lands in a local
(`const anim = spec.el.animate(…)`), so `anim.id = "flip-glide"` costs nothing; in
`restoreBoardAnims` the guard becomes `if (a.id === "flip-glide") continue;`. `Animation.id` is
standard WAAPI and survives `getAnimations({subtree:true})`.

**The ballot.** `restoreBoardAnims` is `App.vue`'s seam, not this family's file, and the W7
registry has no App.vue owner. Two readings: (a) MOT-VERB carries it because TURN is unprovable
on an exit that never paints — the tuple and its proof are one row; (b) it is an App-seam
mechanism row and belongs to the agglomerator's integration slice. **State it as a ballot with
(a) as the firing default**, because the gate "the exit fold paints ≥3 frames with a live
transform" is meaningless in any other family's diff.

---

## 3. The decided beats, and how to get them back (items 7, 8, 9)

### 3.1 The real mechanism: rungs were spent on delays

The gate's rule 3 already says a delay is not a gesture and exempts it from the rung-set fence.
The sweep spelled ten delays as rungs anyway. Eight moved. **Nothing in the family's law governs
a delay**, so every one of them snapped to whatever rung was nearest, and the estate's beat
alignments — which are relationships between two gestures, not travel — broke silently.

**The rule that closes it, and it is the family's own principle applied consistently:**

> A delay is not travel. The second and later time values in a term are OUT of the rung layer:
> they keep their literal, rule 2 (`a number typed here instead of a rung`) applies only to the
> first time in each term, and the gate's existing top-level-comma split already identifies it.

Cost: nine delay terms revert to literals (two of which — 150 ms at `scene.css:613` and
`AttributionCard:186` — happen to equal a rung and lose nothing). Gain: **six moved beats
restored**, no ledger rows added, no new token minted, and the law reads the same on both sides.

### 3.2 The toggle's beat table, arithmetically (item 8)

Resolved from the file, ms from `.is-turning` (`DarkModeToggle.vue`, the shipped comments are
the source of the named beats — "crests ~1.09 around t≈560", "STAR POP (~560/640/720ms)"):

```
                 0      120    250   340   360  430   520 560   640  720      860    1010
HEAD      squash [=====]                                                                     0-120   ADMITTED
          wring  [==================]                                                        0-340
          rise        60[==================]                                                 60-360
          out            240[=====]                                                          240-340
          bloom       60[==============================================]                     60-860  ADMITTED, crest ~560
          star1                                    560[==]                                   560-710
          star2                                        640[==]                               640-790
          star3                                            720[==]                           720-870

PROTO     squash [=====]                                                                     0-120   unchanged
          wring  [============]                                                              0-250   -90
          rise             150[==============]                                               150-430 +90 start
          out                 250[=====]                                                     250-400 +10
          bloom       60[==============================================]                     60-860  unchanged
          star1                                520[==]                                       520-670 -40
          star2                                        640[==]                               640-790 unchanged
          star3                                            720[==]                           720-870 unchanged
```

Three breaks, all of them delay-side:

1. **The rise no longer starts with the bloom.** Its own comment says "incoming icon: 60-360ms
   rise with the bloom's first beats"; the bloom is ADMITTED and still starts at 60. The icon is
   now invisible for the bloom's first 90 ms of growth. **60 ms is not a rung and never can be**
   (the ladder's floor is 150) — so this row can only be reverted by the §3.1 rule, admitted as
   a `beat` kind, or re-auditioned by the owner. The bloom's own 60 ms delay is already in the
   ledger as a `signature`; **admitting its twin is the consistent act.**
2. **The star stagger breaks.** Star 1's delay moves 560 → 520 (`--rung-page`) while stars 2 and
   3 keep their literal 640/720 — the spacing goes **80/80 → 120/80**, and star 1 now fires
   40 ms before the overshoot crest its own comment says it pops onto. This one is pure
   collateral: nothing wanted it, a rung was simply nearest.
3. **The fling becomes a leave.** `--ease-anticipatePop` (the back-out overshoot that IS "a
   150 ms back-out fling", per the comment two lines above) → LIFT, Δ 0.749; and the star's
   opacity `ease-out` → LIFT, Δ 0.569. **LIFT is "a hand takes something off the page", spelled
   on an arrival.** This is the critic's negative control B, shipped: at the midpoint the star
   is 12.8% risen instead of 60.7%, so it sits nearly invisible and then snaps on.

Also stale in the source after the sweep: the wring's comment still reads "Wring-down 0-340ms"
against a 250 ms declaration (`:790`), and the star comment still reads "~560/640/720ms".
**A comment that contradicts its own declaration is the defect this family exists to kill**; the
synthesizer should add a gate row or re-write every comment the sweep falsified (11 found by
eye: `DMT:790`, `:865`, `:776-782`, `GCP:1732`, `:1810-1815`, `scene.css:620-627`,
`index.css:657-659`, `AnswerKeyLaminate:220`, `GameGallery:1470`, `useCarouselGlide:22`,
`DrawerTab` R6's row).

### 3.3 "A RETURN IS LIGHTER THAN AN ARRIVAL" — restorable inside the closed ladder (item 7)

The rule's comment (`GCP:1732`) says "the fold and the write-in both land 40ms sooner".
Measured at HEAD it is *itself* wrong: the row lands 40 ms sooner (320 vs 280) and the name lands
**80 ms** sooner (380+140=520 vs 320+120=440). After the sweep both pairs are byte-identical and
the decision is dead in the built CSS. It does **not** need a seventh rung:

| row | HEAD | prototype | **restored** |
|---|---|---|---|
| `.is-arriving` | 320 | 280 sheet | 280 **sheet** |
| `.is-returning` | 280 | 280 sheet | **250 mark** (−30) |
| `.is-arriving .player-name` | 380 · 140 | 250 mark · 150 | 250 **mark** · 140 |
| `.is-returning .player-name` | 320 · 120 | 250 mark · 150 | **200 breath** · 120 (−50) |

Both rungs are inside their verbs' declared sets (layDown: page/sheet/mark/touch; writeIn:
mark/breath/touch), so the ladder expresses the decision as it stands. The return then lands
50 ms sooner than the arrival and the comment becomes true for the first time. **This is the
strongest argument in the family's favour**: a closed ladder that can still say a designed thing
is a grammar; one that cannot is a snap-to-grid.

### 3.4 R6's three rows (item 9) — one of the three is not a violation

| R6 row | what R6 banks | what the sweep does | disposition |
|---|---|---|---|
| `R6-census.md:42` laminate | "Lay-down 280 ms on `--ease-glassGlide`; lift-away 200 ms on `--ease-accelIn` (**the erase-family asymmetry**)" | 280 sheet layDown (glass, byte-identical) / 200 breath lift (Δ 0.032 from accelIn) | **MOVED, narrowly.** Both numbers hold and the asymmetry SURVIVES — layDown and lift are still two different curves. What changes is the token's name and a 3.2% curve. Correction to the pass-1 critique, which read this as "folded into LIFT". Propose the row's re-wording under `instruments/`. |
| `R6-census.md:48` guard ribbon | "**240 ms** slide on `--ease-glassGlide`" | **250 mark**, curve byte-identical | **MOVED, genuinely.** +10 ms on a decided row. Either revert (the ladder has no 240) or propose the superseding row. MOT-LADDER's charter item 5 books the same row — **coordinate, do not double-file.** |
| `R6-census.md:49` DrawerTab | "a 1.4° tilt that **straightens to 0° on hover over 150 ms**" | 150 touch, curve `ease-out` → glass (Δ 0.406) | **NOT an R6 violation.** R6 banks the duration and the pose; it names no curve. The curve change is real and undeclared, but it is a §1 row, not an R6 one. Second correction to pass 1. |

---

## 4. The duplicate spellings (item 11) — the ruling, with its condition

Measured at `:root` in the published block: 6 rungs + 6 verb eases + 1 dusk-ms = **13 rows
carrying 8 distinct values**. Three collapses:

```
cubic-bezier(0.32, 0.72, 0, 1)   --ease-glassGlide · --verb-layDown-ease · --verb-slide-ease   (+ turn, unpublished)
cubic-bezier(0.32, 0,  0.67, 0)  --verb-lift-ease  · --verb-rubOut-ease                        (= the retired --ease-fadeOut)
cubic-bezier(0.22, 1,  0.36, 1)  --ease-noteWrite  · --verb-writeIn-ease
```

The pass retires two tokens for having no consumer and unpublishes a third, then mints four
names for curves that already had one. **The ruling is conditional, and the condition is §2:**

> Duplicate control points are GRAMMAR if and only if the gate distinguishes the names.
> With rule 3 (rung sets) and rule 5 (property sets), `turn` (transform, page only), `slide`
> (transform, page/step/sheet/touch) and `layDown` (six properties, page/sheet/mark/touch) are
> three different types that happen to share a curve — the way `px` and `em` share a number.
> **Without rule 5, they are three spellings of one curve and the next dead-ink row**, by the
> family's own census law.

Two structural notes for the synthesizer. (a) The estate's dead-token gate
(`check-theme-tokens`) catches zero-consumer tokens, not byte-duplicates; a new row — "no two
published `:root` curve tokens resolve to the same points unless the pair is declared" — would
name exactly these three pairs and is four lines. (b) `--ease-glassGlide` must stay byte-
identical to `MOTION.curves.drawerGlide` (I3-A) whatever happens, so the glass curve keeps at
least two spellings by prior ruling; the question is only whether it gets four.

Prior art, background only and not the verdict: the semantic-token literature independently
arrives at the same two rules — components consume the *semantic* layer and never the core
primitives (that is rule 1′), and a motion token is duration + easing + **property** rather than
duration + easing (that is rule 5). The enter/exit asymmetry is likewise encoded in the token
name (`--motion-enter` / `--motion-exit`), which is LAY DOWN / LIFT under a duller name.

---

## 5. The proofs (items 10, 12)

**Proof 9 — the independent re-assignment.** Do not re-argue 61 rows by hand. `enforce-cost.mjs`
*is* an independent re-assignment: it derives each row's admissible verbs from what the
declaration actually moves, mechanically, and disagrees with the sweep on **7 rows** (§2.2), of
which two are outright mis-assignments (`SolverErrorNote:63`, `HandwrittenLogo:647`). A
derivation beats a second opinion. Bank the run, plus the ms delta per disagreement (they are in
`sweep-table.md`'s Δ column), and the charter's proof 9 is closed by construction rather than by
a second reader's taste.

**The pixel arm of proof 5.** The pass-1 record is honest that 0 differing pixels is unreachable
(two loads deal different puzzles and start the boil on different phases: 225,811 differing px
measured). Both knobs exist in-tree and neither was used:
- a **seeded deal** — the golden harness already pins the board by URL
  (`loadSettled(page, { pinBoard: true })` → `./?board=${PINNED_BOARD}`,
  `e2e/visual-golden.spec.ts:191/204/236`), and pencil-boil exports the seeded RNG
  (`mulberry32`, `@mkbabb/pencil-boil/random`) the card poses ride. **Take the goldens' own
  pin** — it is four characters of URL and it removes the deal from the diff.
- a **frozen boil** — the estate's grain hoist is a pre-rastered opacity swap and pencil-boil
  exposes `boilHoldGate`; the golden config already runs against a settled page.
Deliver it with both, or state the weaker claim in the record's own words: *the movers are
identical (duration, easing, fill, matrix at t=260 ms, both engines); the frame is not compared.*

**The dusk floor's rig (item 12).** The family's guard (≥116 fps / ≤34 ms / ≤17 colour steps) is
not reproducible here and **should not be**: r0's own R4 census rules that "headless chromium
runs rAF uncapped (~130 fps idle), so read the long-frame list, never the fps"
(`r0/r4-transition-grammar/census.md:201-202`). Worse, the "≤17 steps" clause has no engine:
r7 measured **16 distinct body colours on webkit and 33 on chromium** for one flip
(`r0/r7-owners-eye/r7-owners-eye.md` §M09), so the threshold is a webkit number wearing no
label. **Name the rig honestly:** the floor belongs to **W8 §8.3, the owner-run real-iOS
instrument** (M06/M09's real-iOS law, M19-compliant — an owner-run device script or an
authorised `safaridriver` session). Locally, ship two things instead: control-vs-prototype
parity on the same box, and a long-frame list (frames > 33 ms, zero new). Delete the absolute
fps clause or move it to W8's budget table, never re-word it to pass.

**Goldens and font coverage.** `npm run test:golden` (darwin, `playwright-golden.config.ts`) and
`npm run test:font-coverage` — both un-run in pass 1. Structurally the sweep should not move any
of the four (`cell-light`, `grid-corner-light`, `logo-light`, `toggle-crest-dark`): all are rest
poses after `loadSettled`, and `toggle-crest-dark` is a 72×72 crop of the moon body taken at
rest, deliberately excluding the twinkle cluster whose delays the sweep moved
(`e2e/visual-golden.spec.ts:360-372`). **But that is an argument, not a reading** — run them.
`check-font-coverage` is genuinely structural (zero rendered strings change; `lint:copy` GREEN),
but it is one command.

---

## 6. What the synthesizer can reuse, by name

| primitive | where | what it gives |
|---|---|---|
| `MOTION.rungs` / `MOTION.verbs` | `pencilConfig.ts:129-284` (proto) | the two-layer source; the publisher already diffs it byte for byte |
| `spend(verb, rung)` | `pencilConfig.ts:321` | the WAAPI tuple; needs the fill split (§2.4) |
| `useFlipGlide({durationMs, easing, settleGuardMs})` | `useFlipGlide.ts:86-115` | already takes an `easing` override; already has the local `anim` for the `id` |
| `createSequenceSubscription({durationMs, delayMs, easing})` | `@mkbabb/pencil-boil` `vue.d.ts:104` | the OTHER mover; `Easing = (t)=>number`, four house curves |
| `FILL_ALLOWLIST` | `pencil/config/filterBudget.ts:252` | untouched by RUB OUT — keep it that way |
| the ledger's exact-match-both-ways shape | `check-pencil-verbs.mjs:44-127` | copied from `FILL_ALLOWLIST`; add the ordinal |
| `--empty-ledger` + SKIPPED-never-pass | MOT-LADDER pass 1 (graft) | a gate whose ledger is empty must still run; a SKIP is never a PASS |
| content-anchored cites | MOT-LADDER (graft) | file + literal + a nearby stable string — line cites rotted **inside** pass 1 |
| the band sweep | `pass1/critique/data/MOT-DERIVE-band-sweep.mjs` | the dock's rung is a BAND question, not a pose question (§7) |
| the flush-post sampling trap | NOTE-LEDGER (graft) | for any FLIP reading |
| the golden board pin | `e2e/visual-golden.spec.ts` `loadSettled(page,{pinBoard:true})` | the seeded deal proof 5 needs |
| `boilHoldGate` | `@mkbabb/pencil-boil/boilHoldGate` | the frozen boil proof 5 needs |

---

## 7. Sketches

**(a) The grammar, with the delay fenced out — the one structural change.**

```
   SHAPE  (index.css §THE MOTION VOCABULARY)      TIMING  (pencilConfig MOTION)
   what geometry does                             how long, on which curve
   @keyframes + --ease-*  ────consumes────▶  --rung-*  ×  --verb-*-ease
        │                                          │            │
        │                                     [ DURATION ]  [ CURVE ]      ◀── the gate reads both
        │                                          ▲
        └──── properties ──────────────────────────┘  rule 5: the moved props ⊆ the verb's props

   transition: opacity  var(--rung-breath)  var(--verb-lift-ease)   240ms ;
               ▲        ▲                   ▲                       ▲
               │        │                   │                       └── DELAY: a literal.
               │        │                   │                           Not travel. No rung.
               │        │                   └── rule 1′: must be --verb-*, never --ease-*
               │        └── rule 2: a rung (first time in the term only)
               └── rule 5: opacity ∈ lift.props ✓   rule 5b: is this rule a LEAVE? ✓
```

**(b) The toggle's broken hand-off, and what the delay fence restores.**

```
        the bloom (ADMITTED, 60→860, crest ~560)
   60 ├──────────────────────────────────────────────────┤ 860
      │                                                  │
HEAD  ├─rise 60→360─┤        star1 560→710 ┤ star2 640 ┤ star3 720 ┤
      ↑ starts WITH the bloom      ↑ pops ON the crest   ↑ even 80/80 stagger

PROTO       ├─rise 150→430─┤   star1 520→670 ┤ star2 640 ┤ star3 720 ┤
            ↑ 90ms late              ↑ 40ms EARLY         ↑ 120/80 — the stagger bends

FENCE ├─rise 60→340──┤           star1 560→710 ┤ 640 ┤ 720 ┤
      ↑ delay keeps its literal; only the DURATION is a rung (280 sheet)
```

**(c) Where `spend()` reaches, and where it cannot.**

```
                        ┌─ CSS transition  ──▶ --rung-* / --verb-*-ease      55 decls  ✓ gated
   MOTION.verbs ────────┼─ CSS animation   ──▶ same, + the SHAPE exemption   29 kfs    ✓ gated
     (one tuple)        ├─ WAAPI .animate()──▶ spend() → {duration, easing}   2 sites  ✓ (walk .ts)
                        └─ pencil-boil seq ──▶ needs (t)=>number              7 sites  ✗ UNREACHABLE
                                                  easeOutCubic · easeInCubic · easeInOutCubic · linear
                                                  ← a disjoint vocabulary; say so, or ship spend().fn
```

---

## 8. Risks, and what collides

1. **Rule 5 makes the players well unspendable.** Three rows animate `grid-template-rows`; the
   family's own ledger forbids a verb owning layout. Either the ledger grows by three
   `layout` rows (consistent, cheap) or "no verb owns layout" is retracted. Decide before the
   sweep, not after.
2. **`GameCard.vue:410` is unspendable under rule 5 too**: `transform + opacity` at 440 ms.
   SLIDE owns `transform` only; LAY DOWN owns both but may not spend `step`. The row therefore
   proves either that the rung sets are too tight or that the row splits into two verbs. It is
   the first honest pressure on the closed set and it is on a surface the sweep never touched.
3. **The dock's rung is a BAND question.** MOT-DERIVE's critic measured the sheet's travel across
   `<1024` whole and found the audited 390×844 pose is *not* the band's worst case (768×1024 is
   8% faster). `spend("slide","page")` inherits that: one rung, many travels. Bank the band
   sweep before the owner disposes `page` vs `step` (U-10).
4. **Sibling collision, RUB OUT.** MOT-LADDER's charter carries the ruling of ONE rub-out
   duration for the section. Three numbers are live: **NOTE-ERASE 125 ms** (1 beat × `beatMs`
   125, clip + opacity, `--ease-accelIn`), **MOT-VERB 200 ms** (`--rung-breath`, clip + opacity,
   `--verb-rubOut-ease` = `(0.32,0,0.67,0)`), **AnswerKeyLaminate 200 ms** lift-away (already on
   the same points, Δ 0.032 from accelIn). §5 hands MOT-LADDER the argument in §9 below.
5. **Sibling collision, the guard ribbon.** MOT-LADDER's charter item 5 books the same R6 240→250
   row. One family files the superseding row; the other cites it.
6. **The chair's §6.11 ruling touches `gameCell.css:154`** — `.cell-because`'s body yields under
   selection. Rows 23 (`marks-fade-in` on `.cell-because`) and 24/25 (`ghost-draw-on`) are in
   the same file, and §6's leader (MRK-LIVE) is editing it in the same pass. **Read-only there;
   coordinate the file, do not re-time the hint laminate.**
7. **π rows all still unmeasured**: goldens 4/4, `check-font-coverage`, the filter census. The
   filter figure is state-dependent (pass 1 read 27/13/15, its critic 25/12/15 on a bare load) —
   **declare the load state with the number or it is not a π reading.** filterBudget is EXACTLY
   9 to R6 law 9 / L1 and the diff touches no filter config.
8. **The publisher parses TS by exact indentation** (`^ {2}([a-z]+): (\d+),$` plus a literal end
   sentinel `  },\n  /** House easing`). One prettier reflow or one inserted comment reds a gate
   nobody caused — the exact defect this same pass cured in the ledger. Fold the parse onto a
   marker pair, like the CSS half already has.
9. **AA, M16, W2's mechanics, pi on unclaimed surfaces**: the diff moves zero colour literals and
   zero `--color-*` rows (grep over every +/- line: no hits), zero rendered strings, zero W2
   bytes. Those constraints are met by construction — but §1's 32 undeclared surfaces are the π
   row, and π is not "no colour moved", it is "no pixel moved that was not declared".

---

## 9. For MOT-LADDER: the RUB OUT numbers and the argument (charter graft)

The tuple, measured: **RUB OUT = `cubic-bezier(0.32, 0, 0.67, 0)` · props `clip-path, opacity` ·
fill `backwards` · rungs {breath 200, mark 250} · PRM free**. The rub-out shipped in the
prototype at `MarginNote.vue:163` as `ink-rub-out var(--rung-breath) var(--verb-rubOut-ease)
backwards`, measured live in pass 1 at 0.2 s, 1 distinct glyph box across 14 frames, clip
retreating to `inset(0 0 0 100%)`, and under `reduce` the rest pose IS the end pose in the same
frame (so no `fill: forwards`, no `FILL_ALLOWLIST` row).

**The argument for 200 over 125.** (i) The erase family is one curve and one length across the
section; the laminate's lift-away is already 200 ms on those very points, so 200 is the
incumbent with two consumers and 125 has none yet. (ii) 125 is `beatMs`, the boil's clock — not
travel. The ladder's own law is that a duration names how far a thing goes; borrowing the boil's
beat re-introduces exactly the cross-vocabulary the rungs exist to kill. (iii) The clip retreats
the full width of a note; at 125 ms the webkit reading in NOTE-ERASE's own record is 9 distinct
clip states, which is a rub-out an eye reads as a cut. **If the section rules 125, it should be
because the ERASE IS DELIBERATELY FASTER THAN THE WRITE (the erase asymmetry, R6 §1.2's own
principle) — in which case the honest ladder answer is not 125 but `touch` 150**, which is a
rung, keeps the asymmetry (write-in 250 mark → rub-out 150 touch, a 100 ms lightening), and costs
no new vocabulary. That is the compromise I would carry.

---

## 10. Open owner rows (U-10) — nothing here closes a mark

1. The dock's rung: `page` (520, as shipped) or `step` (440) — and it governs the whole `<1024`
   band, not the audited pose (§8.3).
2. LAY DOWN gains `breath`, or the sparkle row becomes `touch` — the spec assigned a rung the
   verb may not spend and the prototype silently used `mark` (200 → 250 on a hover).
3. Return-is-lighter: restore on the `sheet/mark` + `mark/breath` ladder (§3.3), or retire the
   decision in writing and delete its comment.
4. The toggle's rise at 60 ms and the twinkle stagger at 560/640/720: revert by the delay fence,
   admit as `beat`, or re-audition. The owner's most-watched surface.
5. Four names for the glass curve: grammar (with rule 5) or dead ink (without it).
6. The wring-down at `mark` (340 → 250) and the deck's leave on LIFT — the two visible retimes
   the record does declare.
7. The toggle's reduced-motion crossfade: keep the 200 ms fallback (admitted) or cut it.
