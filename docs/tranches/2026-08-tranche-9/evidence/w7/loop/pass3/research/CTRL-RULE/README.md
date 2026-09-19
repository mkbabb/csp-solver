# T9-W7 · pass 3 · RESEARCH · CTRL-RULE — the margin column (arm b)

Research lane, read-only on product files. Server `127.0.0.1:4231` on the pass-2 worktree
`.claude/worktrees/wf_8630d340-e56-29` with a private vite `cacheDir`
(`instruments/vite.r3.config.mjs` → `.vite-cache-r3rule`), killed on return. Every arm below is
a `page.addStyleTag`; nothing under `src/` moved. Instruments and readings sit beside this file.

**The headline.** The chair refused arm (b)'s retirement of W2 §2.6 and told the lane to re-cut
to KEEP the pin (`pass3/CHAIR-RULINGS.md` §6.3a). Measured here: a name pinned inside the margin
column cures the orphaned field completely and occludes nothing — **orphan 4/14 → 0/14 chromium
and 4/13 → 0/13 webkit at 1280×800, with the pinned name covering 0.000 of any control at every
state, every cell, both engines**. The margin column is the shape that lets M03's "properly be
sticky" and the class invariant hold at the same time. Two things it does NOT close, both
measured: r7's instrument I3 gets WORSE by its own predicate (2 → 4 violations at 1440×900), and
the fold sentinel plus the armed ribbon are still opaque surfaces over live controls.

---

## 1 · The base moved, and only four files are in the replay's way

Pass 2 served `a8fee1f5`; pass 3's control is `74a2b5d9` (chair, "the base moved"). Of the
thirteen files arm (b) modifies, the fold touched **four**:

| file | a8fee1f5 → 74a2b5d9 | what it means for the replay |
|---|---|---|
| `scripts/check-copy-register.mjs` | **+892 / −45** | the copy gate's discovery grammar (G17, three commits); arm (b)'s strike of one ADMITTED row must be re-cut ONTO the fold's version — the fold is law |
| `scripts/check-font-coverage.mjs` | +32 / −2 | arm (b)'s `ruledGroupNames` / `confirmLines` extractors rebase onto it |
| `src/games/shared/GameControlPanel.vue` | +10 / −3 | the coarse tape's focus law |
| `src/games/shared/GameControlPanel.test.ts` | +3 / −1 | its test |

The other nine (`index.css`, `typography.css`, `GameScene.vue`, `scene.css`, `GameGallery.vue`,
`OptionSelector.vue`, `pencilConfig.ts`, `SheetWashiLabel.vue`, the woff2) are **unchanged
between the two bases** — the replay is four hunksets, not thirteen.

---

## 2 · The pin, re-measured: the margin column can carry it

`instruments/sticky-margin.mjs` → `readings/sticky-margin.json`. Three arms, 1280×800 and
390×844, both engines, light, the sheet settled. `base` = arm (b) as built;
`stickyTop0` = `.rp-name{position:sticky;top:0;z-index:31}`; `stickyBand` = the same at
`top:2rem`, which parks the name below the fold sentinel's band.

| cell / engine | arm | orphan states | worst control covered by a name |
|---|---|---|---|
| 1280×800 chromium | base | **4 / 14** (`Size` 70·105, `Level` 210·245) | 0.000 |
| 1280×800 chromium | stickyTop0 | **0 / 14** | **0.000** |
| 1280×800 chromium | stickyBand | **0 / 14** | **0.000** |
| 1280×800 webkit | base | **4 / 13** (`Size` 72·108, `Level` 216·252) | 0.000 |
| 1280×800 webkit | stickyTop0 | **0 / 13** | **0.000** |
| 1280×800 webkit | stickyBand | **0 / 13** | **0.000** |
| 390×844 both | all three | 0 / 9 | 0.000 |

**Why the occlusion is zero and stays zero.** `RuledGroup.vue:70` is
`grid-template-columns: var(--rp-margin) 0.5rem minmax(0,1fr)` with the name at 1/1 and the
field at 1/3. Measured boxes at 1280: name `[821.25, 942.84]`, field starts **950.84** — an 8px
gutter, zero overlap. At 390: name `[8, 129.59]`, field starts **137.59**. A `position: sticky`
grid item is constrained by its GRID AREA, so the name rides its own group and releases at the
group's end; it can never enter column 3, where every control lives. **The class invariant is
satisfied by the COLUMN, not by the absence of a sticky surface** — which is also the sentence
§0.2/§2.6 has to be re-written to, and it is a stronger claim than the one pass 2 made.

**Instrument caveat, declared.** `SCAN` sets `scrollTop` and reads in the same tick while
`data-fold-above` is published asynchronously, so the `foldBandWorst` column in
`sticky-margin.json` is timing-flaky (`bandH` null in three cells) and **is not a reading**. The
band's authority remains the critic's `pin-census.mjs` (`Medium` 1.000 chromium / 0.944 webkit at
scrollTop 200, 1280×800). A pass-3 prototype must settle the attribute (rAF or a 260ms wait, I3's
own settle) before reading the band.

---

## 3 · I3 is the row that decides the fork, and its subject has MOVED

`instruments/pinned-name-i3.mjs` → `readings/pinned-name-i3.json`. r7's instrument I3
(`r0/r7-owners-eye/instruments/owners-eye.instruments.mjs:119`) reads *"a pinned compartment tape
names a group at least half on screen, at every scroll state"* and is **RED at HEAD** — 3
violating states at 1440×900 webkit, `new game` at 0.401 / 0.058 / 0.050
(`r7-owners-eye.md` §M03 b′). Transplanted onto the margin arms:

| cell / engine | arm | I3 violations | states with NO pinned name | name over a control | name over another rule |
|---|---|---|---|---|---|
| 1440×900 chromium | base | 2 / 5 | 2 / 5 | 0.000 | 0.000 |
| 1440×900 chromium | stickyTop0 | **4 / 5** | **0 / 5** | 0.000 | 0.000 |
| 1440×900 chromium | stickyBand | 4 / 5 | 1 / 5 | 0.000 | 0.000 |
| 1440×900 webkit | base · sticky0 · band | 2 · **4** · 4 | 2 · **0** · 1 | 0.000 | 0.000 |
| 1280×800 both | base · sticky0 · band | 0 · **2** · 2 | 2 · **0** · 3 | 0.000 | 0.000 |

The per-state rows say exactly what happened (chromium 1440×900, max scroll 392):

    stickyTop0   at   0   pinned Size      own 1.000    ok
                 at 125   pinned Size      own 0.282    I3 violation
                 at 255   pinned Level     own 0.392    I3 violation
                 at 392   pinned new game  own 0.239    I3 violation
    base         at 125   pinned —                      vacuously ok
                 at 255   pinned —                      vacuously ok

**I3's predicate cannot be satisfied by any pin that holds to the last pixel of its group**, and
the margin's pin is truthful at exactly those states: at scrollTop 125 the name at the port's top
is `Size` and the thing at the port's top IS `Size`'s remaining field. HEAD's failure is a
different animal — `new game` pinned while `pencils / checking / players` sit at 1.000 and none
of them is the pinned title. I3's ≥50% proxy catches HEAD's lie and also fires on a truthful
margin pin; **arm (b) moves I3's subject and the row is reported MOVED**, with the successor
predicate proposed below rather than the gate re-worded to pass.

W2 anticipated this and handed it here: *"§2.6 asserts a tag stays while its group is in view; it
does not assert a tag LEAVES when its group does. Not a row — a question for W7's voice"*
(`evidence/w2/prove/prove-record.md:47-49`). And the wave's own §10 text is
*"section titles larger and PROPERLY STICKY (mechanics in W2 §2.6, the voice here)"*
(`waves/T9-W7-design.md:53`) — the wave asks for the pin in its own words, which settles the
fork before the owner ever sees it.

**The successor, proposed as a diff** (`instruments/name-truth.mjs.proposed`): two rows, both
directions, layout-neutral.

    A · NO ORPHANED FIELD   ∀ group: fieldVis ≥ 0.33  ⟹  nameVis > 0
        HEAD's tape RED (r7 §M03 b′: 4 of 5 states) · arm (b) base RED 4/14 · margin+sticky GREEN 0/14
    B · NO STALE NAME       ∀ name on screen: the name's box ∩ its OWN group's box = 1.000
        HEAD's tape RED (the tape pins for a well that has left) · margin+sticky GREEN by construction

Row B is what I3 was reaching for through the ≥50% proxy, and it is the row a margin passes
honestly and a detached pinned tape cannot.

---

## 4 · The two occluders the predicate still cannot see

### 4.1 The fold sentinel (critique gap 1/2) — not this family's to delete

`scene.css:356` (arm b) / `:308` (HEAD, byte-identical — the file is unchanged between the two
bases) is `.controls-card::before { position: sticky; top: calc(-1 * var(--card-pad-t)); z-index:
30; height: calc(2rem + var(--card-pad-t)); background: linear-gradient(to bottom,
var(--color-card) var(--card-pad-t), transparent) }`, `opacity: 0 → 1` under `[data-fold-above]`
(`:373`). It is W2's landed scroll cue, it is a pseudo-element, and `querySelectorAll` +
`getComputedStyle(el).position` can never return it — `pins 0` was the instrument's number. The
band is **52px at 1280 / 38px at 390** and the first `--card-pad-t` (20px) of it is SOLID card.

The predicate's cure is one argument: `getComputedStyle(el, "::before" | "::after")`, with the
band's rect derived from the card's own client rect (the critic's method,
`pin-census.mjs` §`FOLD_OVERLAP`). The spec sentence's cure is the §2 column claim. The BAND
itself is W2's decided cue and the honest disposition is to state it, bound it and carry the
number — not to cure it in a §10 voice lane.

### 4.2 The confirm ribbon (critique gap 3/4) — measured for the first time

`instruments/ribbon-intersect.mjs` → `readings/ribbon-intersect.json`, 390×844 coarse, light,
dirty board, `clear` armed, chromium:

    ribbon   x 16.00  y 678.84  w 142.13  h 87.19   position absolute · z 70 · bg rgb(253,253,252)
    share of #card-foot's width                      0.364
    controls INTERSECTED                             "Off" 0.395 · "Off" 0.029
    controls SHARING THE RIBBON'S BAND (y 729.8)     "Off" x137.6 · "Ask" x196.8 · "Live" x256.0

So the armed ribbon **covers 39.5% of a live control** and puts three more on its own baseline —
the critic's frame-3 reading (`keep [clear] ff Ask Live` on one line) now has its numbers. The
ribbon is 36.4% of the foot's width; giving the confirm the foot's FULL width is the cure that
removes both the ∩ and the shared baseline in one move, and it needs no ground (the deleted 8%
wash stays dead).

**Arming needs a second press, in BOTH engines** (`readings/webkit-ribbon-twopress.json`):

    webkit    press 1 → ribbon false, activeElement ""          press 2 → ribbon true, .confirm-btn
    chromium  press 1 → ribbon false, activeElement .icon-btn   press 2 → ribbon true, .confirm-btn

CTRL-COST's WEBKIT PRE-CLICK BLUR row (the charter's graft 1) is not webkit-only on this path: the
first press is spent while focus sits inside the board. Reported, not claimed — the press count
has to be the explicit variable in the prototype's row, with the sheet's settle honored, because
`ribbon-intersect.mjs` armed chromium on ONE press with a slightly different boot. Two instruments
of mine disagree about the press count and that disagreement is the row.

---

## 5 · The R6 rows, run — and one of them is the base's, not this lane's

`instruments/law-probe-copy.mjs` (r0's probe copied and re-pointed at `FE`, per the freeze;
`hue-census-copy.mjs` likewise). Readings: `law-probe-armb.txt`, `law-probe-HEAD-74a2b5d9.txt`.

| row | at r0's HEAD | at main `74a2b5d9` | on arm (b) | disposition |
|---|---|---|---|---|
| **L1** filter population 9 | GREEN | GREEN | **GREEN** | static source read of `filterBudget.ts` — this is NOT the dist census; `e2e/filter-census.spec.ts` against a BUILT dist is still unrun (critique gap 14) |
| **L3** copy register | GREEN | **RED** | **RED** | **the fold's row, not this lane's**: the probe asserts `since: "` count `=== 2` and both trees now read **1**. The W7 exec fold landed B1's copy and struck a row. MOVED — the chair's, wave-wide |
| **L5** one box grammar | GREEN | GREEN | **GREEN** | unmoved: the probe reads `GameGallery.vue` only, and arm (b) does not touch the gallery's `keep` |
| **R3** the bar's drawn edge | RED | RED | **RED, and VACUOUSLY** | the probe regexes `.action-bar { … }` for `border|HandDrawnOutline`; arm (b) keeps the class (`GameControlPanel.vue:2053`) and puts the drawn edge in a SIBLING node — `<RuledLine class="outline-svg bar-rule">` at `:1224`. MOVED: re-aim to the bar's SUBTREE and arm (b) flips it GREEN |
| R1, R2, L2, L4, L6 | unchanged both trees | | | not this family's |

**L5 is a live constraint on the "one face" cure, and it points one way only.** The probe's window
is `class="guard-btn guard-keep"` … 400 chars … `HandDrawnOutline`. Measured in the file: the keep
button's own outline sits at **+105**; the leave button's at **+526**. So if the one-face cure
makes the GALLERY's `keep` bare to match the card's, the window finds nothing and **L5 flips
RED** — with only 22 characters of margin (422 vs 400) between "red" and "green by accident",
which is its own fragility row. The lawful direction for gap 6 is therefore the OTHER one: the
CARD's `keep` takes `HandDrawnOutline`, or the sentence in `GameGallery.vue`'s diff comment is
struck. A lane may not re-word L5.

---

## 6 · The rule's numbers, re-derived at their citation (critique gaps 7, 8)

`readings/rule-ink.json` (pass 2's bank, re-read here), worst PAINTED column, light:

| key | overall worst | the seven card rules | the foot's rule |
|---|---|---|---|
| 390×844 chromium 1.8 | 2.946 | **2.946 – 2.983** | 3.304 |
| 390×844 chromium 2.0 | 3.304 | **3.437 – 3.530** | 3.304 |
| 1280×800 chromium 1.8 | 2.946 | 2.946 | 3.530 |
| 1280×800 chromium 2.0 | 3.347 | **3.347 – 3.530** | 3.530 |
| 390 / 1280 webkit 1.8 | 3.021 | 3.021 – 3.060 | 3.530 |
| 390 / 1280 webkit 2.0 | 3.483 | 3.483 – 3.530 | 3.530 |

`RuledLine.vue:86` ships *"1.8 — chromium **2.366** at 390 / **2.909** at 1280, webkit 3.021"*.
**Neither 2.366 nor 2.909 appears anywhere in the bank**; the bank's 1.8 chromium figures are
2.946 at both cells. Line `:88`'s *"2.0 — chromium 3.437–3.53"* IS the bank (card rules only), and
the README §3 table quotes the OVERALL worst (3.304 / 3.347) including the foot's rule at its own
stroke. Three citations, two of them wrong, one of them silently mixing two populations. The
re-derivation must say WHICH population each number is (seven card rules vs the foot's line) and
at which stroke, because that is the whole of the confusion.

The phase finding stands and is the reason the sweep must widen: same ink, same component,
390×844 chromium — a card rule at y 302.83 reads **3.530** and the foot's at y 766.03 reads
**2.413** at the same stroke 2 (`bar-stroke-sweep.txt`); fifteen seeds at the foot all land
2.41–2.59. The ink is read at **two** of R1's **seven** census cells and **never in dark**.
`rule-ink.mjs` at 900×500, 844×390, 375×812, 430×932, 320×568 and in dark is the gap's whole
content, and `y` — the quantity that produced 2.413 against 3.530 — moves at every one of them.

---

## 7 · The surfaces, tokens and primitives this family touches

**Files (arm b, worktree -29, 13 M + 4 new, nothing committed).**

| surface | what it owns here |
|---|---|
| `src/games/shared/RuledGroup.vue` (new, 135 ln) | the two-column grid `:70`; `.rp-name` `:79` (display, φ/800, `--color-muted-foreground`); `.rp-field` `:99`; `.rp-rule` `:105` spanning `1 / -1`; the `:deep(.options-row)` re-aim `:118` |
| `src/games/shared/RuledLine.vue` (new, 97 ln) | `wobbleLine` at `RULE_CHORD 300`, `RULE_H 5`, roughness 0.4, segments 8, ONE static `<path>`, `pathLength="1"` + `.pencil-draw-on`; `stroke: var(--ink-press-rule)`; `stroke-width: var(--rp-rule-stroke, 2)` `:94` |
| `src/games/shared/ConfirmRibbon.vue` (new, 209 ln) | `.confirm-ribbon` `:113` (absolute, `bottom: 100%`, z 70, `background: var(--color-card)`, `width: max-content`, `max-width: min(20rem, 92%)`); `.confirm-face` `:159`; the coarse floor `:180` (`min-height` + `min-inline-size`, `var(--tap-floor, 2.75rem)`); `outline: 2px solid var(--ring-ink)` `:193` |
| `src/games/shared/GameControlPanel.vue` | `--rp-margin: 7.6rem` `:1462`, the 320-arm `6.4rem` + the `:deep(.rp-name)` rung `:1470-1474`, `--rp-rule-stroke: 3` `:2090`, the `#card-foot` Teleport `:1222` with `<RuledLine class="outline-svg bar-rule">` `:1224`, `--card-foot-h`'s publisher `:717`, `MOTION.confirmWindowMs` `:596` |
| `src/games/shared/scene.css` | the fold sentinel `:356`, `scroll-padding-top: 2.4rem` `:270`, `--sheet-chrome: 12.6rem` `:536` / `4rem` `:669`, the two `--card-foot-h, 0px` consumers `:138` and `:582` |
| `src/pencil/chrome/GameGallery/GameGallery.vue` | the other ribbon: `.guard-face` `:1414` and the coarse arm `:1475-1476` — `min-height: 44px` ALONE |

**Tokens.** Mints exactly one (`--rp-margin`, a length). Consumes `--type-heading`,
`--type-subheading`, `--type-tracking-wide`, `--color-muted-foreground`, `--ink-press-rule`,
`--tap-floor` (declared once at `App.vue:961`, `2.75rem`), `--color-red-ink`, `--color-card`,
`--card-pad-t`, `--card-foot-h`, `--sheet-chrome`, and `--ring-ink` — which **does not exist at
HEAD** (grepped: `--ring-ink` has no declaration in `index.css` or `scene.css`). Registry §2.4:
MRK-LIVE mints it once; every §10 lane consumes `var(--ring-ink, currentColor)`. Arm (b) currently
writes bare `var(--ring-ink)` at `ConfirmRibbon.vue:193` — take CTRL-FACE's form.

**Primitives to reuse, named.** `wobbleLine` (already), `mulberry32` (the seed walk),
`createStrokeDrawIn` / `.pencil-draw-on` (the rule's draw-in, already), `wobbleRect` via
`HandDrawnOutline` (the drawn box grammar L5 protects), `MOTION.ruleDrawMs` and
`MOTION.confirmWindowMs` from `pencilConfig.ts:188`. **Do not reach for `boilLineFrames` /
`boilRectFrames` / `useLineBoil`** — every one of those mints a `url(#…)` filter and `filterBudget`
is 9 and never grows. The rule's whole economy is that it is ONE static path with no beat.

**`@property` exists NOWHERE in this estate** (grepped across `src/**/*.css`). Chair §6.5 makes the
registration the wave's first use of it, landed ONCE by §10's leader (CTRL-TAPE, worktree -28) —
this family CITES it and strikes its two `, 0px` fallbacks rather than minting a publisher. Note
that `--card-foot-h` HAS a real publisher on this tree (`GameControlPanel.vue:717`) while
`--masthead-foot` exists on NEITHER tree — two different problems wearing one word.

---

## 8 · Three sketches

**(a) The pin the chair asked for, drawn in the column it cannot leave.**

    .controls-card  (scrollport)
    ┌─────────────────────────────────────────────────────┐
    │▒▒▒▒ fold sentinel · ::before · sticky · z 30 · 52px ▒│  ← W2's cue, a PSEUDO-element
    ├──────────── margin ────────┬──┬──── field ──────────┤
    │  size            [sticky]  │  │  3×3  4×4  5×5      │  ← name pinned at top: 2rem
    │  ·············· 121.6px ···│8 │  ·· minmax(0,1fr) ··│    (below the band, so no wash)
    │                            │  │  ...                │
    │╌╌╌╌╌╌╌╌╌╌ rule spans 1 / -1 ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌│
    │  level                     │  │  Easy Medium Hard   │
    └─────────────────────────────────────────────────────┘
       col 1: names only            col 3: EVERY control
       ⇒ a pinned name ∩ a control = 0.000 BY CONSTRUCTION, at every state, both engines

**(b) What the two instruments each see, and why one row must replace both.**

    HEAD (a detached sticky tape)          arm (b) + margin pin
    ┌──────────────┐ new game  ← pinned    ┌──────────────┐ size  ← pinned, own 0.282
    │ pencils  ▓▓▓ │ own 0.058             │ size   ▓▓▓▓▓ │
    │ checking ▓▓▓ │  ⇒ I3 RED             │ level  ▓▓▓▓▓ │   ⇒ I3 "RED" — but the name
    │ players  ▓▓▓ │  ⇒ the eye reads a    └──────────────┘     at the top IS the field
    └──────────────┘    title for a group                       at the top. TRUTHFUL.
                        that has left
    ROW A  field readable ⇒ its name on screen      HEAD RED · base RED 4/14 · pin GREEN 0/14
    ROW B  a name on screen ⊂ its own group's box   HEAD RED · pin GREEN by construction

**(c) The confirm, at the width that removes both defects at once.**

    now (measured)                          the cure the numbers point at
    #card-foot 390px                        #card-foot 390px
    ┌─────────────────────────────────┐     ┌─────────────────────────────────┐
    │        ┌────────────┐           │     │ clear the board?                │
    │        │clear the…? │ w 142.13  │     │  keep          clear            │  full width
    │ Off ◀──│ keep clear │──▶Ask Live│     ├─────────────────────────────────┤  0.364 → 1.000
    │  0.395 └────────────┘  same y   │     │ ╌╌╌╌╌ the foot's rule ╌╌╌╌╌╌╌╌╌ │  ∩ 0.395 → 0
    │        z 70 · opaque card       │     │ clear  fill  solve  share       │  band share → 0
    └─────────────────────────────────┘     └─────────────────────────────────┘

---

## 9 · The numbers a synthesizer must hit

| row | the number | where it comes from |
|---|---|---|
| orphaned field | **0** states at every cell, both engines | `sticky-margin.json`; base is 4/14 · 4/13 |
| a pinned name over a control | **0.000** at every state | `sticky-margin.json`, `pinned-name-i3.json` |
| the rule's worst painted column | **≥ 3.000** at all SEVEN R1 cells, BOTH themes | 1.4.11; today 2 cells, light only |
| the card rules at stroke 2.0 | 3.347–3.530 chromium · 3.483–3.530 webkit | `rule-ink.json` |
| the foot's rule at stroke 3 | 3.330 (2.413 at stroke 2 — the phase) | `bar-stroke-sweep.txt` |
| both ribbons' verbs | **≥ 44 in BOTH dimensions**; the gallery's `keep` is **39 × 44** today | `GameGallery.vue:1475`, `ribbon-floor.json` |
| the armed ribbon ∩ any control | **0.000** (0.395 today) and 0 controls on its baseline (3 today) | `ribbon-intersect.json` |
| name voices / rung | 1 voice · 7 of 7 at the heading rung · ratio **1.2944** at ≥375 | `readings/census.json` (pass 2) |
| the 320 cell | 1.0176 — REPORTED, never claimed | pass-2 §1 |
| the height ledger | 683 / 540 at 390 (HEAD 699/628) · 952 / 531 at 1280 (HEAD 1142/608) | pass-2 §5 |
| σ per rule | 8 seeds, [0.722, 2.886], worst headroom 0.160 | pass-2 §3 |
| filterBudget | **9**, unchanged, read off a BUILT dist | `e2e/filter-census.spec.ts` — unrun |
| AA, composited | `--ring-ink` 3.701 / 4.678 · muted-fg 4.659 / 7.681 · red-ink 4.990 / 6.303 | critique §1.8, re-derived §6.3 |
| π | the gallery's five readings Δ 0.00 against a **`74a2b5d9`** control server | chair §2.7 |

---

## 10 · The e2e re-aim, as a LIST (critique gap 15)

22 failed / 19 passed of 41, chromium only (`readings/e2e-bare-chromium.log`). The webkit half is
unrun. Every failure addresses grammar arm (b) deleted; they are re-aim work priced for the
landing commit, not defects:

- `zone-grammar.spec.ts` — **9**: `:55` rendered-name census · `:127` every zone named by its
  VISIBLE tape · `:179` the permanent tape is a LABEL · `:227` the staged headings are HEADINGS ·
  `:319` the action bar rides the scrollport · `:359` a frozen well mints ONE pose node ·
  `:548` the coarse card's two eyebrows · `:591` the heading lock on the CARD · `:669` the
  checking well says one thing
- `viewport-law.spec.ts` — **4**: `:575` §2.6 the tag pins (rail) · `:610` §2.6 (drawer) — **both
  of these are the chair's §6.3a row and the margin pin is what re-aims them** · `:396` §2.5 the
  washi tape yields · `:287` §2.4 the toggle stops stealing
- `share-truth.spec.ts` — **3**: `:63`, `:97`, `:122`
- `access.spec.ts` — **2**: `:255` the marks-mode `Normal` button reachable · `:375` the roster
  announces
- `font-census.spec.ts` — **2**: `:231`, `:344`
- `join-language.spec.ts` — **2**: `:69`, `:134`

The `:575`/`:610` pair is the one that changes character under the chair's ruling: with a pinned
margin name they are **re-aimed** (the selector moves from `.washi-tag` to `.rp-name`), not deleted.

---

## 11 · Risks

1. **The sticky name is washed by the fold sentinel.** The band is z 30 and card-coloured;
   `top: 0` parks the name inside it. `stickyBand` (`top: 2rem`) clears it and costs 32px of the
   port's top; `z-index: 31` rides over it and costs nothing but paints the name over the
   PREVIOUS group's rule — measured `name over another rule` **0.000** at every state in both
   arms, so the collision is theoretical today, but it is one grid-gap change away.
2. **I3 reads RED under the cure.** If the chair takes I3 literally, the pin the chair ordered
   fails the instrument the chair's own round zero minted. The successor rows (§3) must be on the
   table BEFORE the prototype, or the lane ships a cure that reds a gate.
3. **L5 forbids the obvious "one face" cure** (§5). Making the gallery's `keep` bare flips a
   standing law; the card's `keep` taking `HandDrawnOutline` costs the confirm its middle channel
   (drawn vs bare), which pass 2 measured as one of three. The third way — keep both drawn and
   carry the destructive channel on colour + stroke weight (2.5 vs 2) alone — needs its own
   contrast row before it is chosen.
4. **Two of my own instruments disagree on the press count** that arms the confirm (§4.2). The
   prototype must resolve it with the settle honored, or `confirmWindowMs`'s lapse row (critique
   gap 16) will be measured on a surface that was never armed.
5. **The 1280 rail spends 129.6px of 324 on the margin** and every field stacks one chip per line.
   That is the form-tell's worst case and it is U-10's question, not a number's.
6. **`--sheet-chrome` and `--card-foot-h` are two different problems in one sentence**: one has no
   publisher anywhere, one has a real publisher and a `, 0px` mask. Chair §6.5 strikes both
   fallbacks, but only after §10's leader lands the `@property` registration — which this estate
   has never used once. A lane that strikes its fallback first ships an invalid declaration.
7. **The band's reading is timing-sensitive** (§2 caveat) and `data-fold-above` is published
   async; a prototype that reads it in the same tick as its `scrollTop` write will bank a zero and
   call it a cure.
8. **filterBudget and the goldens are still unread** — no `vite build` has run in this worktree at
   either pass. `RuledLine` mints no filter by construction (one static path, no beat), but
   "by construction" is an argument and the dist census is a number.
9. **The pin dies silently if `align-items` ever goes back to `stretch`.** A stretched grid item
   fills its area and has no travel, so `position: sticky` on it is a no-op that reds nothing —
   the general trap named in the background reading and the reason the charter's graft 3
   (CTRL-FACE's `align-self: flex-start`) matters here. `RuledGroup.vue:73` ships
   `align-items: first baseline`, which is why the arms above measure at all; the spec must pin
   `align-self` on `.rp-name` explicitly with the reason in the comment, and the born-RED row is
   an ablation that sets `align-items: stretch` and watches ROW A go RED again.

---

## Files

    instruments/vite.r3.config.mjs          the private-cache dev-server config (port 4231)
    instruments/sticky-margin.mjs           the three arms, orphan + name-occlusion  → readings/sticky-margin.json
    instruments/pinned-name-i3.mjs          r7's I3 transplanted onto the margin      → readings/pinned-name-i3.json
    instruments/ribbon-intersect.mjs        the armed ribbon's ∩ and its baseline     → readings/ribbon-intersect.json
    instruments/webkit-ribbon-twopress.mjs  the press count that arms the confirm     → readings/webkit-ribbon-twopress.json
    instruments/law-probe-copy.mjs          r0's law probe, COPIED and re-pointed     → readings/law-probe-armb.txt
                                                                                       readings/law-probe-HEAD-74a2b5d9.txt
    instruments/hue-census-copy.mjs         r0's hue census, COPIED and re-pointed (unrun here — it reads
                                            index.css, which arm (b) modifies; the 29 rows are the
                                            PROTOTYPE stage's to bank against the 74a2b5d9 control)

No crops banked: every finding in this lane is a number. The server on 4231 was killed and the
band verified empty before return.
