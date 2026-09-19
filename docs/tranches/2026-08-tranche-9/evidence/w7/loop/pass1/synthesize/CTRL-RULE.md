# T9-W7 · pass 1 · SYNTHESIZE · CTRL-RULE — the ruled page

Section §10 (§1 §2 §8 §14 §15 inside) · marks M01 M03 M04 M05 M12 M13
Synthesizer: Fable 5.1. Read-only on the product. Inputs: the pass-1 research record
(`../research/CTRL-RULE/README.md`, `probe/*.json`, the two crops), r0 R1/R6/R7, the owner's
frames, `T9-W7-design.md`, the charter. Nothing closes here (U-10).

Verdict carried in: DEVELOP with two adjustments — arm (a) with the RELEASE, and M04 as a
layout row (the bar becomes the case's foot). This spec spends both and carries the three
smaller numbers (the 22px arm, the 44 floor on the confirm, the seam).

---

## 0 · The design plan, then the tell review

**Subject.** A ruled worksheet page inside the case. Not a form and not a broadsheet: a page
a pencil ruled by hand, one line per group, the group's name written above its line, and the
acts drawn as the only boxes on it because a box is what you draw around the thing you must
not press by accident.

**Tokens.**

| token | light | dark | job |
|---|---|---|---|
| `--color-card` | `hsl(48 12% 99%)` ≈ #FDFDFB | #131211 | the page |
| `--color-foreground` | #0A0A0A | ≈ #EDEBE7 | names, chosen chips |
| `--color-muted-foreground` | #737373 | ≈ #A8A69F | `size`'s ink, the verbs, unchosen chips |
| `--ink-press-rule` | graphite 55% (≈ #8A8A89 on card) | ≈ #7C7A75 | THE RULE — 3.53:1 light / 4.35:1 dark painted (worst sample 3.06) |
| `--color-orange-ink` / the tier's ink | #A26009 · green/rose inks | crayon arms | `level`'s ink = the selected tier (DATA inside one voice, kept deliberately) |
| `--color-red-ink` | #D02A52 | #FF5C7C | the destructive verb's face and word |
| `--ring-ink` (new alias) | `color-mix(in srgb, var(--color-foreground) 50%, transparent)` | same formula | the card's FIRST authored focus ring; 45% measured 3.145 light with 0.145 headroom, 50% buys margin |

One new alias, zero new hexes.

**Type.** Fraunces is what the page came PRINTED with: every group name at φ
(`--type-heading` 1.618rem = 25.888px) · 800 · lowercase, one right-hand side at every
viewport. Patrick Hand is what a pencil put there: verbs, sublabels, tally, notes, the confirm.
Fira Code: the chips at ONE number, 20px, every width. Ratio name:chip 1.2945 everywhere.

**Layout.** A single column; each group is `name / rule / field`; the name sits on its rule,
left-aligned at the page's margin; nothing nested, nothing hidden at any pose; the bar is the
case's foot below the page, outside the scrollport.

```
   ┌ case ──────────────────────────────┐
   │  size                              │  Fraunces 25.9 · 800 · muted
   │  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  │  the pencil rule, σ ≈ 1.05px
   │   4×4     9×9     16×16            │  Fira 20; the seeded scribble under the chosen
   │  level                             │  ink = the chosen tier's crayon ink
   │  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  │
   │   Easy    Medium    Hard           │
   │  new game                          │
   │  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  │
   │   ╔══════╗                         │
   │   ║ deal ║   dealt ⊪               │  the ONLY boxed things: acts (pose-0, stroke 2)
   │   ╚══════╝                         │
   │  marks                             │
   │  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  │
   │   Normal   Corner   Center         │
   │  what fits  ·  checking  ·  players│  (each its own name / rule / field)
   ├────────────────────────────────────┤  the card ENDS
   │  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  │  the bar's ONE rule; the bar is the CASE'S FOOT
   │  [clear] [fill] [solve] [share] (i)│  coverage 0.0% at every scroll state
   └────────────────────────────────────┘
```

**Principles.** (1) One voice, one rung, one rule. (2) Nothing hidden: the tabs die because
`size` and `level` are two groups like the others. (3) Boxes mean consequence. (4) The
memorable thing is the hand-ruled line under a printed name; everything else is quiet.

**The tell review.** (a) Broadsheet: hairline rules, zero radius, dense columns — one step
away. Answered by measurement, not assertion: the rule is `wobbleLine` from the board's own
generator at σ 1.05px (inside the grid's band [0.722, 2.886]), never a CSS hairline; the page
is one column; the only zero-radius things are drawn. (b) Settings form: arm (b)'s
`[name] | [field]` column — the research banked the crop that proves it reads as a form at
1280 and dies on width at 390 (short by 77.6px). REVISED: arm (a) only, at every width; no
split grammar (B6). (c) "High-contrast serif display everywhere": seven small copies of the
masthead's voice in one card. Held, deliberately: the print/pencil split IS the hierarchy
device, and the ink axis (muted for `size`, the tier's crayon for `level`) keeps the rank from
flattening. The critique pass should test whether seven Fraunces 800 names read as a rank or
as a shout; the fallback is weight 600 (a second woff2 subset, priced). (d) Motion: one
orchestrated moment — the rules draw on once when the card mounts, 260ms, seed-staggered;
never again.

---

## 1 · Tokens the family re-points

```css
/* typography.css:124 — ONE right-hand side */
:root { --type-group-title: var(--type-heading); }   /* was --type-subheading */
/* DELETE :133-137 (the min-width:768 arm). */

/* :149-153 — the 768–1023 arm of --type-option: 1.375rem → 1.25rem. The chip is ONE number. */

/* index.css @theme — the ring */
:root { --ring-ink: color-mix(in srgb, var(--color-foreground) 50%, transparent); }
/* GameGallery.vue's ribbon face reads --ring-ink too (one ring, two consumers). */
```

Radii: **0** on every drawn thing; **0.5rem** on invisible hit boxes only. Stroke ladder: case
**3** · tongue **2.5** · destructive act face **2.5** · act box **2** · the rule **1.6**.

---

## 2 · Components and states

### 2.1 The name (seven of them)

`size · level · new game · marks · what fits · checking · players`. `pencils` DIES (a name
over two names is the nesting the family refuses). `new game` changes office: it names the
DEAL group (die + sublabel + tally), so the page reads three asks and one commit in order.

| property | value |
|---|---|
| element | `<h2 class="section-heading">` for all seven (ROW 2: 7 of 7); the well's `role=group aria-labelledby` points at it |
| face · size · weight · transform | Fraunces · `--type-group-title` = 25.888px · 800 · lowercase (CSS) |
| leading | 1.2 (31.06px line box — the 217.4px the seven names cost, priced in §7) |
| ink | `--color-muted-foreground`; `level` in the selected tier's ink (`--color-orange-ink` etc.) — one voice, two inks, BY DATA |
| position | above its field, sitting on its rule, left at the page margin (`padding-left: 0.75rem`, the shipped md arm, now every width) |
| sticky | pinned to the card's top while its group is in its top half (§2.3) |

### 2.2 The rule

`wobbleLine(0, h/2, W, h/2, { roughness: 0.4, segments: 8, seed })` from
`@mkbabb/pencil-boil` (the board's generator), one seed per name, rendered ONCE as a static
`<path>` in an inline `<svg class="rp-rule">` at `stroke-width: 1.6`, `stroke: var(--ink-press-rule)`,
`pathLength="1"`, class `pencil-draw-on` with `--draw-dur: var(--rule-draw-ms)` and
`--draw-delay: calc((seed % 7) * 22ms)`. Measured: σ 1.0509 / 1.0507px at chord 284.67 against
the board's own 1.108 on the same page; painted contrast 3.53:1 light / 4.35:1 dark, worst
sample 3.06 — **never thinner than 1.6, never below 55%**. Filter census 9 under every pose.
The incumbent CSS hairline (`.staged-section + .staged-section`, `:1543-1546`) and every
`.tray-well` frame DIE. `BoilDivider` ×1 stays (the peek hold surface, not a group rule).

### 2.3 Sticky — the RELEASE (look here; mechanism to W2 §2.6)

What the reader sees: a name holds at the card's top while its group is under the eye and
leaves WITH its group when the group is half gone; the next name takes its place. The push law
cannot do this (proved: the floor on a group's visible fraction is head/group = 0.306 at the
dock; the shortest buildable group is 70.59px against a 62.1px ceiling). The release does:
0 violations at five states, desk and dock, both engines.

The mechanism, named for W2: the head's sticky containing block is the group's TOP HALF
(`position: absolute; inset: 0 0 50% 0`, the head `position: sticky; top: 0` inside it), with
the REAL head in the box and a spacer of the head's height in flow (never a clone: the
prototype's clone doubled the heading count 7 → 14). Layout-neutral, mints no filter.

Two laws the pinned head obeys (the research's two defects): its background is the page
(`--color-card`) but stops at its own rule; and every field carries
`scroll-margin-top: var(--rp-head-h)` so a focus that lands under a pinned head scrolls clear
of it (measured 1:1 under an opaque head vs 3.15:1 with air). Class-invariant, written once:
**a sticky surface with a ground never paints over a control** — the bar bit it, the head bit
it, this is the law.

### 2.4 The button system — acts are the only boxed things

| treatment | controls | form | hover | focus |
|---|---|---|---|---|
| **ACT** (boxed) | deal · clear · fill · solve · share · invite | `HandDrawnOutline :pose="0" :stroke-width="2"`, radius 0, glyph + Patrick Hand word; destructive (clear · solve · deal on a dirty board) at **2.5** | ink lift only (the accent fill retires) | `--ring-ink` 2px solid, offset 4 |
| **WORD** (bare) | undo · redo · hint · peek · leave · the `i` | glyph + word, no border, no ground; `.info-glyph`'s ring DIES | ink lift | same ring |
| **CHIP** | every option | Fira Code 20px, the seeded scribble under the chosen | the seeded ghost | same ring |

### 2.5 The tabs die (§8)

`.mobile-heading-row` and `showTabs` go; both `OptionSelector`s are laid down at every pose;
`level` drops from three taps to two. The `.legend-fold` tween (`:2278-2290`) is the crib's,
not a group's, and survives untouched.

### 2.6 The bar (M04) — the case's foot

The bar leaves the scrollport: `.action-bar` re-homes as the last child of `.drawer-case`
below `.controls-card`, the card shortened by the bar's band (67px dock / 65px desk). One
drawn top rule (§2.2's generator, its own seed, stroke 1.6). Coverage, CLIPPED to the
scrollport: **0.0% at every scroll state, three cells, both engines**; the bar's top edge lands
0.19–0.23px below the card's bottom. The landscape dock gets a sticky bar for free (the
media pair at `:2173` was written for two scrollports; there are three). Price stated to the
owner: 67/65px of scrollport. Cross-references to re-cut in the same commit: `--action-bar-h` /
`--card-pad-b` (`:607-628`), the `::after` skirt's argument (`:2221`), `scroll-padding-bottom`
(`scene.css:250-264`), the z-ladder note at three ends. **This is a W2 layout row**; the
spec names it as the dependency it is, and the family's M04 claim is the RULE (the face), not
the burial.

### 2.7 The confirm (§15, M12) — the ribbon in the bar's note berth

The house's one confirm (`GameGallery.vue:1003-1065`), berthed in the bar's `.berth-note`
(W2 §2.5), anchored under the armed verb (`--guard-x`), 240ms on `--ease-glassGlide`, PRM:
appears in place. Zero reflow on the verb, the bar and the wrap (Δ 0 0 0 0 measured). Both
verbs ≥ **44×44 in both dimensions**: `min-inline-size: var(--tap-floor)` joins the ribbon's
`min-height` (measured today: `keep` 39×44, `clear` 41.6×44 — the per-dimension negative
control catches exactly this). The destructive verb's face at 2.5 + 8% graphite ground, worded
in `--color-red-ink`. One mechanism for deal · clear · fill · solve; the in-place `sure?` arm
retires with it (the bare `no` measured 12×21). W1 §1.5 owns the arming; not in the tree.

### 2.8 The quick set (§14, M13)

The tongue's band carries `hint` and the pencil MODE chip showing its current word
(`normal` / `corner` / `center`, a tap steps it) on every mobile pose. In landscape that band
is the only control in the viewport (900×500: `.fold-tools` is `display: none`), which is
where it earns its place; in portrait it duplicates one of the ribbon's four acts and adds the
setting whose well is deepest. Never `deal`, never `clear` (arming a guarded act then making
it cheaper works against W1 §1.5). Fits: the board's free bottom edge is 274px at 390
(two 44px targets plus seams beside the 92px tongue).

### 2.9 The 390 seam

`--sheet-chrome: max(12.6rem, calc(var(--masthead-foot) + 8px))`. The 12.6rem floor alone
puts 390 at +6.3 and 375 at +14.8 (two stroke widths = 6px); the `max()` arm guards 430,
where a taller card can hit its cap (the coupling CTRL-TAPE's lane measured). Derive after the
voice lands. The masthead-to-board gap is not touched.

---

## 3 · Copy (M16; lowercase by CSS; no j, no x in the hand)

| site | string |
|---|---|
| names | `size` · `level` · `new game` · `marks` · `what fits` · `checking` · `players` |
| confirm, clear | `clear the board?` — `keep` · `clear` |
| confirm, deal | `start a new board?` — `keep` · `deal` |
| confirm, fill | `fill in the sure cells?` — `keep` · `fill` |
| confirm, solve | `fill in the whole board?` — `keep` · `solve` (B1's recut of the Solve tape, registry §5) |
| quick set | `hint` · `normal` / `corner` / `center` |

Every confirm line is a NEW rendered string: price each with `node scripts/check-font-coverage.mjs`
before it ships; the letters above avoid j and x. `candidates` → `what fits` strikes its
ADMITTED row in `check-copy-register.mjs` in the same commit.

---

## 4 · Motion

| verb | what | duration | curve | home |
|---|---|---|---|---|
| draw on | the seven rules + the bar's rule at card mount, once | 260ms, delay (seed % 7) × 22ms | `--ease-drawOn` | `MOTION.ruleDrawMs: 260` (published as `--rule-draw-ms`) |
| ink lift | muted → foreground on hover | 150ms | `--ease-standard` | `MOTION.inkLiftMs: 150` |
| ribbon | the confirm's slide into the berth | 240ms | `--ease-glassGlide` | `MOTION.ribbonMs: 240` (the gallery's literal comes home) |
| pin / release | sticky ↔ its half | 0 | — | — |

PRM: draw-on drops to `--draw-opacity` (the primitive's own arm, `index.css:765-791`); the
ribbon appears in place. Cost measured: 22.6ms chromium / 55ms webkit for 14 rules + faces.

---

## 5 · Plan — files, order, what dies

1. `typography.css` — :124 re-point; delete :133-137; the 22px arm → 20.
2. `index.css` — `--ring-ink`; `MOTION` rows in `pencilConfig.ts` (`ruleDrawMs`, `inkLiftMs`, `ribbonMs`).
3. `GameControlPanel.vue` — the seven `<h2>`s (`pencils` deleted; `new game` re-homed over the
   deal group; `marks`/`what fits`/`checking` become `<h2>`); `.rp-rule` inline SVG per group
   from `wobbleLine`; **DELETE** the four `.tray-well` `HandDrawnOutline`s, the CSS hairline
   (`:1543-1546`), `.mobile-heading-row` + `showTabs`, `.info-glyph`'s border (`:2321-2333`),
   the `.icon-btn:hover` ground; acts take pose-0 frames at 2 / 2.5; the release box + spacer
   (W2 §2.6 row); `scroll-margin-top` on fields; the shared ring.
4. `GameScene.vue` + `scene.css` — the bar re-homed as the case's foot (W2 layout row):
   `--action-bar-h`, the skirt, `scroll-padding-bottom`, the sticky key retire together;
   `--sheet-chrome` derivation at `scene.css:467`.
5. The confirm: `GameGallery.vue`'s ribbon lifted into a shared component, berthed in
   `.berth-note`, `min-inline-size` on both verbs; the `sure?` arms (`:506-567`) retire when
   W1 §1.5 lands the general arming.
6. `DrawerTab.vue` — the band: `hint` + the mode chip.
7. Gates and ledgers: `check-copy-register.mjs` (strike `candidates`), `check-font-coverage.mjs`
   (the new confirm strings), `filterBudget.ts` untouched (9).

Dies: the compartments; the tape as a NAME (the tape keeps three jobs: the five hover
explications, the `center` tape on the divider, the bar's berth note); the hairline; the
tabs; `pencils`; the info ring; the accent hover fill; the in-place `sure?`. Stays: every W2
mechanic; `BoilDivider` ×1; the `.legend-fold` tween.

---

## 6 · Prototype brief

Build: `../research/CTRL-RULE/proto/ruled-page.js` (`__rp({arm:'a', release:true, barOut:true,
drawOn:true, names:7})` + `__rpConfirm('ribbon')`) promoted to a source patch in a throwaway
worktree; the real head in the release box (no clone), `scroll-margin-top` on fields, the
ribbon's `min-inline-size`, the 22px arm at 20, `--sheet-chrome` derived. Dev server in the
4230 band; scratch config; both engines; settle 700ms.

Screenshots: (1) 390×844 dark sheet-up — seven printed names on hand-ruled lines, the boxed
deal, the bar as the foot below the card's end (beside Frame B); (2) 1440×900 at scrollTop
500 — the pinned name is the group under the eye (beside R7 p7); (3) 900×500 sheet-up — the
foot bar present in the landscape dock; (4) the ribbon berthed under `clear` at 390, both
verbs 44×44.

Censuses unchanged: R1 `heading-voice.spec.ts` (+ the 900×500 cell); R7 I2 (clipped
coverage) / I3 / I4; `access.spec.ts` 2.1/2.2/2.3; R3's wobble method on the rule (σ vs the
grid band); R6 `law-probe` L1/L5; the hue census (`level`'s ink unchanged → 29 rows).

Success: voices 1, headings 7/7, ratio 1.2945 at desk/dock/900×500; I3 0 violations at five
states both engines; clipped coverage 0.0% at every state, three cells; rule σ inside
[0.722, 2.886] and painted ≥3:1 both themes (worst sample ≥3.0); filter census 9; `level` at
2 taps from the playing view; ribbon verbs ≥44 both dimensions with the per-dimension control;
ring ≥3:1 on `--color-card` light and dark (expect ≥3.4 at 50%); seam ≥6px at 375/390/430;
draw-on ≤60ms both engines; content/scrollport reported at four cells with the height budget
(§7) spent.

---

## 7 · The height budget (the standing kill, paid in the open)

Arm (a) at the dock: 699 → 999 in a 628 scrollport (10.2% → 37.1% below the fold). Of the
+300, 217.4 is seven name lines at 31.06 each. Paid back: the wells' padding and margins 122,
the hairline 17.2, the tabs' death −52 (a cost: `level`'s three chips laid down). Owed:
~180px. The spec spends it on (1) the deal group inline — die, sublabel and tally on ONE row,
the 181px group to ~100 (−80); (2) the players well inline — the invite verb beside its status
line (−40 est.); (3) the bar as the foot (−67 of card content, since the reserve dies).
Remainder ≈ 0 ± 30px at the dock; the desk stays a scrolling page (1305 in 608), which is the
family's honest nature and the release makes it navigable. The prototype reports the final
numbers at four cells; the critique judges whether a page that scrolls beats a case that hides.

---

## 8 · Gates the family lands with

Born-RED at HEAD: R1 ROW 1/2/3 at four cells + 900×500 (1.1767 → 1.2945); I3 (3 violating
states → 0) via the release; I2 CLIPPED coverage (85.6% dock worst → 0.0%) — the clipped
predicate added beside r0's unclipped one; the rule's σ row (a CSS hairline is σ 0 → RED;
must land in [0.722, 2.886]) and its painted ≥3:1 row; `level` reachable in 2 taps (3 today);
the confirm's verbs ≥44×44 per dimension (absent today → RED by absence, labelled); the card's
authored focus ring ≥3:1 (webkit 2.15:1 today); the bar sticky/present in the landscape
scrollport (`position: relative` at 900×500 today); the seam at 390 (−2.73 → ≥6). I4 stays RED
until W1 §1.5 executes and is reported beside, never claimed.
Guards (GREEN at HEAD, must hold): filter census 9 exact; `FILTER_BUDGET_UNION_AREA` ±2%;
the goldens; the masthead-to-board gap; no `[role=dialog]` in the card; M16 gate 0 unadmitted.
