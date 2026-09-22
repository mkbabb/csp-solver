# NOTE-ERASE · pass-4 CRITIQUE — the adversarial read

Critic's lane. I did not write the charter, the spec or the prototype. Base and π control
`74a2b5d9`. I served the lane's own BUILT dist (`index-onAA0yf2gPvl.js`) on `127.0.0.1:4240`
and the shared control tree's pre-built dist (`index-CubiZsMVSwTc.js`) on `:4241` — both
verified by asset hash, never by a 200 — and ran my own instruments
(`.critic-erase/{a-clock,b-strip,c-park,d-landscape}.critic.ts`, deleted at return) on both
engines. Readings bank at `critique/NOTE-ERASE/logs/`. No crops of my own.

**Convergence: 89 %. Verdict: ADVANCE.**

Ten of the charter's twelve rows are genuinely closed with numbers I could reproduce. What is
not converged: G5 is still not a gate (it now fails in the *opposite* direction, and I proved
both halves with negative controls on this tree); the honest clock is a rule across AGES but
still a fence across SPECIFICITY, and its gate plants at exactly the rung it beats; the parked
record's paint failure is real (I reproduced it) and is disposed as a fork rather than cured;
the landscape cell the lane declared unrun carries a 1 px resting `docH` delta the record says
is zero everywhere; and every live gate this family owns is a throwaway probe — at the fold the
estate carries no runnable gate on the mechanism the family exists for.

---

## 1 · What I re-measured myself, on the BUILT dist, both engines

### A1 · the honest clock — reproduced, and taken one rung further than the lane took it

A `transition: color 350ms linear` PLANTED on bare `.margin-note-ink`, read off computed style
during the leave, node-absence traced on my own rAF train:

| arm (plant, then a repeated refusal) | chromium | webkit | the lane's number |
| --- | --- | --- | --- |
| as built · `transition-duration` / node absent / restored-ink frames | **0s · 147.4 ms · 0** | **0s · 167 ms · 0** | 0s · 149.7 / 166 ms |
| BORN-RED, `data-note-age` stripped | **0.35s · 363.5 ms** | **0.35s · 380 ms** | 0.35s · 368.3 / 379 ms |
| **MY THIRD ARM — the same transition at `#app .margin-note-ink` (1,1,0)** | **0.35s · 362.6 ms** | **0.35s · 368 ms** | **not run** |

`animation-name` is `ink-rub-out, ink-rub-out-fade` at `0.15s, 0.15s` in every arm. The
headline reproduces exactly. The third arm is the finding: the compound rule is `(0,4,0)` with
its scoping attribute, and a declaration one rung above it wins, so the drop clock stretches
back to 363/368 ms with the attribute fully in place. `MarginNote.vue:290` says "**any**
transition a later lane hangs on `.margin-note-ink` is neutralised for the whole leave whatever
the line's age." That sentence is false as written, and G16 cannot see the class because it
plants at `(0,1,0)` — the same shape of blindness pass 3 found in G16's age scope, one level up.

### A2 · G7 row E — reproduced, and all six rungs read

Deleting `style[data-motion-rungs]` on the built dist:

| | before | after |
| --- | --- | --- |
| publisher nodes | 1 | **0** |
| `--motion-{whisper,leave,note,dusk,step,throw}` | `0.15s · 0.2s · 0.25s · 0.35s · 0.44s · 0.52s` | **`0s` ×6, both engines** |
| `animation-name` during the leave | — | **`ink-rub-out, ink-rub-out-fade`** (shorthand still VALID) |
| `animation-duration` / node absent | — | `0s, 0s` · **13.8 ms** chromium / **28 ms** webkit |

Row E, as declared. The @property law's first clause is not ceremony here: it is the whole
difference between pass 3's row I (`""` → invalid shorthand → `animation-name: none`) and this.

### A3 · the filter budget on the built dist — it did not grow

Painted computed-`filter` population, `baked-hidden` and `logo-pose-parked` carved out,
zero-rect elements excluded, at 4×4 / 9×9 / 16×16, **both engines identically**:

`g.boil-pose` 4 · `svg.toggle-icon` 2 · `svg.sparkle-icon` 1 · `g.` (crayon heart) 1 =
**8 ≤ 9 at every size**. (The lane reads 9 because it counts the heart's second `g`, which has a
zero rect in my census. Either reconciliation is under budget; the budget did not grow.)

### B1 · the strip's reserve — both arms, one instrument

| | 390×844 | 1280×800 |
| --- | --- | --- |
| **prototype** `min-height` computed | `20.8px` | **`23.6288px`** |
| **prototype** block h, empty → fresh → settled | 20.8 → 20.8 → 20.8 | **23.63 → 23.63 → 23.63** |
| **control `74a2b5d9`** `min-height` | `20.8px` | `20.8px` |
| **control** block h, empty → fresh | 20.8 → 20.8 | **20.8 → 23.61 (+2.81)** |
| grid box, both arms | 362×362 @ (14, 252.52) | 636×636 @ (131.89, 124.45) |
| `docH`, both arms, both states | 844 | 800 |

Reproduced to the hundredth. The derivation is sound: `--type-body` and
`--type-leading-caption` are both `:root` tokens, so the block inherits exactly the values the
voice reads (`18.176px × 1.3 = 23.6288px`, and the note's own `line-height` computes to
`23.6288px`). The rule is now true instead of struck, and the trade is 2.83 px of resting strip
at 1280 with the board and the document unmoved.

### B2 · the settled rung, PAINTED, in DARK — the lane's dark number was arithmetic

`emulateMedia({ colorScheme: 'dark' })`, 1280×800, settled hint, raw bytes off the ink's box:
computed `color(srgb .819608 .811765 .780392 / .68)`, paper `rgb(17,15,14)`, ink core
`rgb(147,145,140)` → **6.07 : 1**, and 6.07 at the 0.5 % and 5 % columns too (the glyph is
solid at this size). The lane's "5.19 light / 6.12 dark" is `check-ink-pressure`'s **derived**
row, and its gap 10 calls those numbers "painted". They are not; mine are. They agree to
within 0.05, so the constraint holds either way — but the record should say which is which.

### C · the parked record — the lane's worst finding, CONFIRMED

Parked through the estate's own route (`g`), 1280×800, built dist:

| | chromium | webkit |
| --- | --- | --- |
| ink rect | x 137.89 · y **543.57** · 51.22 × 11.21 | x 137.89 · y **543.28** · 50.85 × 11.21 |
| `.live-face-slot` `overflow: hidden`, bottom edge | **540.55** (`containsNote: false`) | **540.25** (`containsNote: false`) |
| `elementFromPoint` at the ink's centre | `div.game-card-paper` | `div.game-card-paper` |
| bytes in the ink's own box | 984 px paper `rgb(253,253,252)` + **57 px `rgb(163,163,162)`** (one row — the card's bottom edge) + 1 | 967 + **57 px `rgb(162,162,161)`** + 1 |

Nothing of the sentence rasters. The grey the byte read finds is a single horizontal line, the
card's own edge, which the crop straddles. Pass 3's `300.18 × 11.21` was a rect; the lane found
that itself and retired its own crop, which is the right move and the strongest single act in
this return.

### D · the landscape cell — the lane declared it unrun; I ran it, and it carries a π row

844×390 and 812×375, `hasTouch: true`, regime witnessed on every page
(`(pointer: coarse)` true, `any-pointer: coarse` true), both arms, both engines:

| | prototype | control `74a2b5d9` |
| --- | --- | --- |
| 844×390 · `min-height` | `22.0984px` | `20.8px` |
| 844×390 · block h, empty → fresh | **22.09 → 22.09** | 20.8 → 22.09 (**+1.29**) |
| 844×390 · **`docH`, empty → fresh** | **410 → 410** | **409 → 410** |
| 812×375 · block h, empty → fresh | **21.98 → 21.98** | 20.8 → 21.97 (+1.17) |
| 812×375 · **`docH`, empty → fresh** | **395 → 395** | **394 → 395** |
| grid box, both arms | 362×362 @ y 16 · 347×347 @ y 16 | identical |

Two readings, opposite signs. In the family's favour: the growth is gone in the landscape cell
too, and the board pays nothing in any cell I measured. Against the record: the README says
"`docH` 0 in every cell" and "`docH` 0 at both widths in both states" — at rest in landscape it
is **+1 px** against control on both engines, because HEAD's strip has not grown yet. It is a
1 px declared-π miss, not a defect, and it is now measured instead of declared.

### The mechanical estate, all bare, exit code unpiped

`lint:copy` 0 · `check-copy-register.mjs` 0 (**137 files, 0 em/en dashes, 0 unadmitted, 0
admitted, lexicon 25**) · `lint:motion` 0 · `lint:ink` 0 · `lint:live-regions` 0 ·
`lint:sleep` 0 · `lint:theme-tokens` 0 (52 declared, 0 unreferenced, its own negative control
RED as required) · `lint:theme-selectors` 0 · `lint:knip` 0 · `check-ink-pressure.mjs` 0 ·
`check-ink-pressure.mjs --self-test` 0. **vitest whole estate 70 files / 849 tests passing**
(floor 729); `vue-tsc --noEmit` 0. `diff` of the lane's hue census against
`r0/r6-idiom-history/hue-census-HEAD.txt` is **empty** — R6 UNMOVED, verified by me. W2's
surfaces are not in the diff at all (no `scene`, `drawer`, `dock`, `tab` or `controls` file
touched). The diffstat at my return is byte-identical to the diffstat at my open (761 / 78).

---

## 2 · Every gate I tried to break, and what happened

| gate | my attempt | result |
| --- | --- | --- |
| the cross-channel unit row | put `clearBeat("voice")` back inside `clearRepeat()` (pass 3's one-Set behaviour) | **REDS**, on its own assertion: `expected '' to be 'new board. 4 by 4 kenken board'`. Restored, 16/16 green. The row is real. |
| G16 static half | — | reds on the selector or on a `transition:` in `.note-leave-active`. Real. |
| G16 **live** | plant at `(1,1,0)` | **CANNOT SEE IT** — the gate plants at `(0,1,0)` only (see §3.2) |
| **G5** | mint a SEVENTH rung in this family's own diff (`MOTION.rungs.erase = 125`) | **STAYS GREEN, 11/11.** The gate named "THE FOLD CARRIES NO LADDER ROW" passes the exact act it forbids. |
| **G5** | re-word the graft banner to §13's own wording, which is what the correct fold does | **REDS**: `expected … to contain "§13'S ROWS, GRAFTED"`. The gate reds on the fold it exists to survive. |
| the estate's own lanes | `grep` for `motion-rungs`, `publishMotionRungs`, `--motion-whisper`, `ink-rub-out`, `note-leave` across `e2e/` and `scripts/` | **zero hits.** Nothing that ships can red on this family's mechanism. |

---

## 3 · The open gaps, each a closable sentence with its number

1. **G5 is not a gate; it is a graft-detector wearing a no-graft gate's name, and it is STRUCK
   again (registry §2.10).** I ran both controls on this tree: minting `MOTION.rungs.erase =
   125` — §7 minting a ladder row, the act the gate's title forbids — leaves all 11 rows green;
   re-wording the `§13'S ROWS, GRAFTED` banner to §13's own phrasing reds it. So the gate passes
   its own subject and fails the correct fold. **Close it by:** landing MOT-LADDER's delta and
   re-running (the honest route, and it is in the same batch), or by asserting the *set* —
   `Object.keys(MOTION.rungs)` equals the six §13 names exactly, and `git`-independent
   provenance is not a comment string.
2. **The honest clock is a rule across AGES and still a fence across SPECIFICITY, and no gate
   reaches the class.** Measured on the built dist: a `transition: color 350ms linear` at
   `#app .margin-note-ink` yields `transition-duration 0.35s` and node absent **362.6 ms
   chromium / 368 ms webkit** with `data-note-age="fresh"` present — against 0s / 147.4 / 167 as
   built. **Close it by:** either bounding the claim in `MarginNote.vue:290` ("neutralised for
   any declaration below `(0,4,0)`") and planting the born-RED at one rung above the bound, or
   making the neutralisation specificity-proof at the Transition's `before-leave` hook
   (`el.style.transition = "none"`), which no arm in this family has costed.
3. **The parked record does not paint, and the cure is booked, not built.** Confirmed by me:
   ink y 543.57 / 543.28, `.live-face-slot` clip bottom 540.55 / 540.25, `containsNote: false`,
   `elementFromPoint` → `div.game-card-paper`, and the ink's own box contains 984/967 px of
   paper plus one 57 px row that is the card's edge. The record is announced and invisible.
   F-ERASE-2 arm 2 is unbuilt because it moves a §10/W2 surface. **Close it by:** the chair
   seating F-ERASE-2 with LEDGER's rest-state question (the lane proposes exactly this), or by
   §10's leader building arm 2 so the owner disposes with two frames rather than one.
4. **The landscape cell's resting `docH` is +1 px against control, and the record says it is
   zero everywhere.** 844×390: prototype 410 / 410, control 409 / 410. 812×375: prototype
   395 / 395, control 394 / 395. Both engines, `hasTouch` witnessed. **Close it by:** amending
   the README's "docH 0 in every cell" to name the two landscape cells and their +1, and adding
   the cell to F-ERASE-1's arm table (the owner is choosing a resting height; he should see all
   four cells).
5. **Every live gate this family owns is a throwaway.** `grep` over `e2e/` and `scripts/` for
   `publishMotionRungs`, `motion-rungs`, `--motion-whisper`, `ink-rub-out` and `note-leave`
   returns **zero hits**. G16, G7, G12, G14 and G17 live only in `pass4/prototype/NOTE-ERASE/
   probe/`. `pencilConfig.ts:252` states "the exit gate reds rather than shipping a silent
   no-op" — there is no exit gate in this tree. **Close it by:** naming the shipping home of ONE
   row (the drop clock off the leaving node, or the rung set resolving non-empty) in `e2e/` and
   landing it, or by striking that sentence and booking the mechanism as probe-covered only.
6. **The dark AA is derived where the record calls it painted.** `check-ink-pressure` computes
   5.19 / 6.12 by token arithmetic; my painted dark read is **6.07 : 1** (`rgb(147,145,140)` on
   `rgb(17,15,14)`). They agree, so nothing fails — but gap 10 says "5.19/6.12 painted" and that
   is the wrong provenance. **Close it by:** citing 6.07 as the painted dark number and 6.12 as
   the gate's derived one.
7. **Three of the six registered rungs have no consumer anywhere in `src/`.** `--motion-leave`
   (200), `--motion-step` (440), `--motion-throw` (520) are registered by six `@property` blocks
   this diff adds and published by this diff's publisher, and `grep -rn "var(--motion-"` finds
   only `note`, `whisper` and `dusk`. With `MOTION.chromeLeaveMs: 200` beside
   `MOTION.rungs.leave: 200` (the lane's own gap 7), that is a consumer-less substrate and a
   legacy alias, both graft-borne. **Close it by:** §13's fold, which the lane has already
   stated the order for — but until it lands, this diff carries them.
8. **The `becauseMember` peer row is vacuous on chromium** (`member: -1`,
   `distinctFromNamed: false`; webkit reads member 78 / named 51). **Close it by:** pinning the
   peer room's board through the estate's codec, which `c-peer.probe.ts` does not do.
9. **R3-d's `solve` round armed nothing** (`armed.text` empty), so one of its five acts is
   vacuous. **Close it by:** dealing a board whose solve arms a line, or reporting the act as
   unreachable on an EASY deal.
10. **G5's "the registration is static and complete" has no unit home.** `*.css?raw` returns the
    empty string under vitest and `node:fs` is untyped in `src/**`, so the claim lives only in a
    lane-local probe (which compounds gap 5). The lane proposes `check-theme-tokens.mjs` and
    does not write it because the block is §10's. **Close it by:** §10's leader taking the
    PROPOSED row, or the chair assigning it.
11. **The graft is still the fold's blocker.** Six `@property` blocks in `index.css` and
    `publishMotionRungs()` in `pencilConfig.ts` must leave this diff when MOT-LADDER's delta
    lands, and the fold order is stated but not executed. **Close it by:** the batch-3 sequence
    the chair set.
12. **PRM and the repeat's hole are carried, not re-measured** (pass 3's `animationDuration 0s`,
    node gone 17.5 / 43–49 ms; 133.4 ms margin, 123.6–127 ms voice). The lane declares both. The
    cancel changed this pass and is covered by the unit row and its born-RED, which I
    reproduced; the CLOCK is a carried number. **Close it by:** one re-run of each at the fold.
13. **The mid-verb crop clips at 21.73 %, where the charter asked ~50 %.** I looked at it: "only
    1 fits" over an empty band, legible, and it does carry its claim — but the frame the charter
    specified is a half-erased line and this is a four-fifths-intact one. **Close it by:**
    sampling the clip nearer the verb's midpoint, or stating that 21.73 % is what the polled
    pose caught.
14. **No dark-theme frame.** Both cited crops are light; the dark numbers (mine, 6.07 painted)
    carry it. **Close it by:** one dark replacement, or citing the number and saying so.

---

## 4 · Failure-mode checklist

| item | verdict |
| --- | --- |
| vacuous convergence | **CLEAR** — four born-RED demonstrations, of which I independently reproduced three (the clock strip, the cross-channel cancel, row E). Every headline names a number that moves. |
| spec-cites-itself circularity | **HIT (inverted, gap 1)** — G5 passes the act it names and reds on the correct fold. Proven with two negative controls on this tree. |
| gates that cannot fail | **HIT ×2** — G5 on its own subject (gap 1); G16 on the specificity class (gap 2). |
| elegant-reduction trap | **CLEAR** — nothing is deferred as "the hard part"; the two halves of the exit ship together and the lane published the measurement against its own spec's sentence. |
| legacy aliases | **HIT (graft-borne)** — `MOTION.chromeLeaveMs: 200` beside `MOTION.rungs.leave: 200`, two homes for one number, still here (gap 7). |
| masked fallbacks | **CLEAR** — zero `var(--motion-x, fallback)` in the SFC or the built CSS (asserted statically and read live); `kind` and `origin` are REQUIRED with TS2554 naming the sites; the `withDefaults` `kind: "state"` is a component boundary the domain always supplies. |
| unverified gestalt | **HIT (narrow, gaps 13/14)** — much better than pass 3: the mid-verb crop shows its claim and the park crop shows the clip that is the finding. But the mid-verb clip is 21.73 % not ~50 %, and there is no dark frame. |
| consumer-less substrate | **HIT (graft-borne, gap 7)** — three of six registered and published rungs have zero `var()` consumers in `src/`. |
| the generic default | **CLEAR** — no eyebrow, no card, no arrow; the exit is the arrival run backwards, which is the estate's own idiom. |
| the pixel it did not declare | **HIT (gap 4)** — the landscape cells' +1 px resting `docH` against a record that says zero everywhere. The 1280 strip's +2.83 IS declared and put to the owner, which is the right shape. |
| the constraint it forgot | **CLEAR under my own measurement** — M16 `check-copy-register` bare, 0 unadmitted; filterBudget **8 ≤ 9** painted on the BUILT dist at 4×4/9×9/16×16, both engines; AA painted light 4.87–5.17 (lane) and dark **6.07** (mine); π grid/doc identical across arms at 390×844 and 1280×800; R6 hue census byte-identical, verified by me; W2's surfaces untouched; the @property law's four clauses honoured in the direction runnable (first clause LANDED and measurably the row-I/row-E difference; `inherits: true`; `initial-value: 0ms` independent and visible at 13.8 / 28 ms; the ablation on a DECLARING host); the undefined-token census clean (`lint:theme-tokens` 0 unreferenced with its own negative control RED). |

---

## 5 · Strengths worth banking whatever the agglomerator decides

- **The lane published its own pass-3 frame as an error.** "300.18 × 11.21 was a RECT, not
  paint" is the single most valuable line in this return, it was found by not believing a
  number the lane itself had banked, and it retires the crop that carried the lie. I reproduced
  it to the hundredth.
- **The @property law's first clause is now a measured pair, not a principle.** Six rungs, one
  deletion, two trees' worth of behaviour: `""` → invalid shorthand → `animation-name: none`
  (pass 3, row I) against `0s` → shorthand valid → the verb runs with no length (pass 4, row E).
  Every lane that registers a token can cite these two lines instead of arguing.
- **"A per-channel GUARD is not a per-channel CANCEL"** is a general defect class in any helper
  that keeps handles in a shared Set, and the unit row that proves it fails correctly when the
  old behaviour is restored — I ran that myself.
- **The strip's rule became true instead of struck.** `calc(var(--type-body) *
  var(--type-leading-caption))` is the line at any width, confirmed at four viewports on two
  arms and two engines, and the price is put to the owner as a fork instead of buried.
- **Both arms were re-dealt the SAME board after the first π run proved why that matters**, and
  the struck numbers are named in the incidents rather than quietly dropped.
- **Ten lint gates, vitest 70/849, `vue-tsc` 0, goldens 4/4, filter census 12/12 on a dist built
  in the worktree with the main tree's dist untouched.** The W8 §8.1 freeze held.

---

## 6 · Cross-pollination

1. **To every lane registering a token (§13, §10, §11, MRK-LIVE):** the row-I/row-E pair above
   is the @property law's first clause with numbers. Cite it; do not re-derive it.
2. **To NOTE-LEDGER, ACC-SIX and every §10/W2 park or fold claim:** a rect is not paint. The
   standard is `elementFromPoint` at the subject's own centre PLUS a byte read of its box PLUS
   the clipping-ancestor walk with `containsNote`. Three lanes are currently citing rects.
3. **To every lane whose spec says "survives whatever a later lane does":** state the
   SPECIFICITY it survives to, and plant the born-RED one rung ABOVE that bound. Gap 2 is this
   wave's second instance of a gate written at the rung it beats.
4. **To every lane cropping a transitioning surface:** `page.screenshot({ animations:
   "disabled" })` fast-forwards the fold and moves the subject out from under its clip. The lane
   found this the hard way; it belongs in the traps ledger.
5. **To MOT-LADDER and MOT-VERB:** three of the six rungs land in the estate with no consumer,
   and `chromeLeaveMs`/`rungs.leave` are two homes for 200. §13's fold should retire the alias
   in the same commit that lands the ladder, per the "ruling lands with its enforcing config
   same-commit" rule.
6. **To any estate surface reserving a line:** `min-height: calc(var(--type-body) *
   var(--type-leading-caption))` instead of an `em` multiple of an inherited size. The `1.3em`
   bug was right at 390 by coincidence and wrong at every width above the clamp's floor.

---

## 7 · Verdict

**ADVANCE. Convergence 89 %.**

The centre is built, runs on a dist I built no part of, and I reproduced its three headline
numbers on both engines: the clock (0s / 147.4 / 167 ms against a planted transition), row E
(six rungs to `0s`, shorthand valid), and the strip (23.63 constant against the control's
20.8 → 23.61). Every constraint holds under my own measurement. Four born-RED rows exist and
three of them fail correctly when I break them.

100 is unreachable this pass because G5 still cannot fail on the act it names and reds on the
fold it must survive (I proved both); because the honest clock's generality is a specificity bet
with no gate that can see the class (0.35s / 362.6 ms at `(1,1,0)`); because the parked record
is confirmed invisible and disposed rather than cured; because a declared-zero π row is +1 px in
two landscape cells; and because the family cannot fold at all until §13's delta lands and takes
the six `@property` blocks and the publisher with it. None of that is a rewrite, and no
primitive is missing — which is why this is ADVANCE and not BLOCK.
