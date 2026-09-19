# T9-W7 pass 1 · PROTOTYPE · CTRL-RULE — the ruled page, RUNNING

Prototyper: Opus 5. **It runs on the real surface.** Worktree
`.claude/worktrees/wf_e58b4764-0fc-38`, branch `worktree-wf_e58b4764-0fc-38`, cut at
`aab67b92`; dev server `npx vite --host 127.0.0.1 --port 4230 --strictPort` on the worktree,
HEAD's own server on `:4232` (the main tree, read-only) for every born-RED and π row. Both
engines headless, chromium and webkit, deviceScaleFactor 1, sheet settled 950ms after every
open. Nothing is committed; `git -C <worktree> diff --stat` is the artefact.

Probes: `scratchpad/ctrl-rule/{census,probe2,probe3,probe4,seam,occl,frames}.mjs`. Nothing in
this file is carried forward from the research lane — every number below was re-measured
against the patch.

---

## 0 · What was built

| file | what |
|---|---|
| `src/games/shared/RuledLine.vue` (new, 83) | the hand-ruled line: `wobbleLine` from `@mkbabb/pencil-boil`, ONE static `<path>`, `pathLength=1`, `.pencil-draw-on` at `--rule-draw-ms`, delay (seed % 7) × 22ms, stroke 1.6 at `--ink-press-rule` |
| `src/games/shared/RuledGroup.vue` (new, 150) | one group: the REAL head inside the release box (`inset: 0 0 50% 0`, head `sticky top:0`) + a measured spacer in flow — never a clone; the field at the page's margin |
| `src/games/shared/ConfirmRibbon.vue` (new, 198) | the confirm, berthed in the bar under the armed verb; both verbs floored in BOTH dimensions; `--ring-ink`; destructive face 2.5 + 8% ground in `--color-red-ink` |
| `GameControlPanel.vue` (1462 lines changed, net shorter) | seven `<h2>`s; the four `.tray-well` frames, the CSS hairline, `.mobile-heading-row`/`showTabs`, the `.info-glyph` ring and the accent hover fill DELETED; the deal group and the players head inlined; the bar teleported to `#card-foot` |
| `GameScene.vue` (+10) | `#card-foot` — the berth below the card, inside the case |
| `scene.css` | the card's cap less `--card-foot-h`; `scroll-padding-bottom` retired, `scroll-padding-top: max(2.4rem, var(--rp-head-h))`; `--sheet-chrome: max(12.6rem, calc(var(--masthead-foot, 0px) + 8px))` |
| `typography.css` | `:124` re-pointed to `--type-heading`, the ≥768 arm DELETED, the `.section-heading` md arm folded into the base, the 768–1023 `--type-option` arm 1.375rem → 1.25rem |
| `index.css` | `--ring-ink: color-mix(in srgb, var(--color-foreground) 50%, transparent)` |
| `pencilConfig.ts` | `MOTION.ruleDrawMs 260 · inkLiftMs 150 · ribbonMs 240`, published as `--rule-draw-ms` / `--ink-lift-ms` / `--ribbon-ms` |
| `scripts/check-copy-register.mjs` | the `candidates` ADMITTED row STRUCK |
| `scripts/check-font-coverage.mjs` | `zoneRowLabels` → `ruledGroupNames`; a `confirmLines` extractor; the seven names priced on Fraunces, the guard's lines on the hand |

`git diff --stat`: 8 tracked files, +825 / −896, plus 431 lines in three new components.

---

## 1 · The census, four cells × two engines — HEAD (`:4232`) → PROTOTYPE (`:4230`)

Chromium and webkit read identically at every cell unless noted.

| row | HEAD | prototype |
|---|---|---|
| ROW 1 · voices | **3** | **1** — Fraunces · 25.89 · 800 · lowercase, every cell |
| ROW 2 · group names that are document headings | **2 of 8** | **7 of 7** |
| ROW 3 · name ÷ chip, desk 1280 | 1.2945 | **1.2945** |
| ROW 3 · dock 390 | **1.0175** | **1.2945** |
| ROW 3 · landscape 900×500 | **1.1768** | **1.2945** |
| ROW 3 · rail 1440 | 1.2945 | **1.2945** |
| heading count in the card (the clone trap's guard) | 2 | **exactly 7**, all four cells, both engines |
| hidden option rows (the tabs) | 1 at 390 and at 900 | **0** everywhere |
| `[role=dialog]` in the card | 0 | **0** |
| live `url(#…)` filters, whole document | 24 | **24** — unmoved |

Heading texts read back: `Size · Level · new game · marks · what fits · checking · players`
(the first two are the games' own `defineGame` strings; all seven render lowercase by CSS).

### Height, content / scrollport

| cell | HEAD | prototype | below the fold |
|---|---|---|---|
| desk 1280×800 | 1122 / 608 | **1109 / 531** | 46.8% → 53.0% |
| dock 390×844 | 681 / 628 | **733 / 540** | 10.2% → 28.7% |
| landscape 900×500 | 719 / 284 | **819 / 196** | 61.8% → 76.7% |
| rail 1440×900 | 1124 / 640 | **1112 / 563** | 44.1% → 50.3% |

**The budget was paid, and then some.** The spec's arm (a) projected the dock at **999**; the
inlined deal group, the inlined players head, the compartments' 122px and the hairline's 17.2
bring it in at **733** — 266px under the projection, +52 over HEAD against the +300 the research
measured for the naive arm. The desk and the rail are both SHORTER than HEAD. The scrollport is
what pays: −77 at the dock (67 to the foot, 9.6 to the seam), −77 at the desk. The brief's target
was "dock ≤ 660 in 628"; the reading is **733 in 540**, so the dock sits 28.7% below the fold
where HEAD was 10.2%. The release is what makes that navigable, and the critique should judge
the trade with the frame beside it.

---

## 2 · The gates

| gate | HEAD | prototype | verdict |
|---|---|---|---|
| R1 ROW 1/2/3, four cells + 900×500 | 3 voices · 2/8 · 1.0175 dock · 1.1768 landscape | 1 · 7/7 · 1.2945 everywhere | **GREEN** |
| R7 I3 — a pinned name names a group ≥ half on screen, 5 states | desk **2** · rail **3** · landscape **1** · dock 0 | **0 violations**, all four cells, both engines | **GREEN** |
| R7 I2 CLIPPED to the scrollport, 5 states × 3 cells | dock **88.9%** · desk **45.4%** · rail **45.6%** worst | **0.0% at every state**, three cells, both engines | **GREEN** |
| the bar's own chrome | `ownChrome=false` | **true** — `svg.outline-svg`, a one-sided drawn rule | **GREEN** |
| the bar present/pinned in the <1024 landscape scrollport | `position: relative`, inside the card | the case's foot at every regime; `inCard=false`, top gap **0.00px** under the card's bottom | **GREEN** |
| `level` in 2 taps from the playing view | 3 | **2** (open the sheet, tap the tier); `.mobile-heading-row` absent | **GREEN** |
| the confirm's verbs ≥44 in BOTH dimensions | absent | `keep` **51.73×44** · `clear` **54.39×44**, both engines | **GREEN**, with a caveat (§4) |
| the confirm's Δ on four sides | — | verb 0 0 0 0 · bar 0 0 0 0 · wrap 0 0 0 0, both engines | **GREEN** |
| the 390 seam ≥ 6.00px | 375 **+5.77/+5.48** · 390 **−2.73/−3.02** · 430 +14.11/+13.98 | 375 **+15.41/+15.48** · 390 **+6.91/+6.98** · 430 **−17.09/−17.02** | **390 GREEN, 430 RED** (§4b) |
| the rule's σ inside R3's band [0.722, 2.886] | a CSS hairline, σ 0 | seven rules **0.5486 – 1.0498**, mean 0.781 | **PARTIAL RED** (§3) |
| the rule painted ≥3:1, worst antialiased sample ≥3.0 | — | median **3.53 light / 4.364 dark**; worst column **2.451 / 2.635 light** | **RED on the worst sample** (§3) |
| the card's authored ring ≥3:1 from painted bytes | none authored (the UA's own) | **2px solid `--ring-ink` @4px**; painted median **3.53 light / 4.364 dark**, both engines | **GREEN** at the median |
| `access.spec` 2.1 / 2.2 / 2.3 at 390 | — | 21 tabbables, **0** burials ≥96%; nothing covered, nothing to inert; **14/14** chips carry text + `aria-pressed`; **0** controls under 44 in either dimension inside the card | **GREEN** |
| R6 law-probe | L1 GREEN · L5 GREEN | **L1 GREEN** (FILTER_BUDGET sums to 9, untouched) · **L5 GREEN** | **HELD** |
| the hue census | 29 rows | **byte-identical to `hue-census-HEAD.txt`** | **HELD** |
| M16 `check-copy-register` | 1 failure (the stale `candidates` admission) | **0 em dashes, 0 unadmitted, 1 admitted** (B1's Solve tape, W7 §9's) | **GREEN** |
| draw-on cost | — | **12.8ms chromium / 34.0ms webkit** for 8 rules | **GREEN** (≤60) |
| R7 I4 — every destructive verb asks first | Fill writes 52–57 cells on one tap | `clear`/`deal` ask (0 cells written on the first tap, both engines); **`fill` and `solve` still write on one tap** | **RED, reported, never claimed** — W1 §1.5 owns the arming |

---

## 3 · The rule, measured — and where the spec's own numbers do not survive

**σ, per seed, screen px, chord 374.59 at the dock, both engines agreeing to 0.001:**

| name | size | level | new game | marks | what fits | checking | players | the bar |
|---|---|---|---|---|---|---|---|---|
| seed | 13 | 29 | 23 | 19 | 43 | 31/41/59 | 67 | 83 |
| σ | **1.0498** | **0.5486** | 0.7408 | 0.8758 | 0.8535 | 0.8714 | 0.5553 | 0.7488 |

The board's OWN rule on the same page, same run: σ **0.3017 – 1.6875** over eight sampled grid
lines (mean 0.942, chord ~344).

**The research's 1.0509 was ONE rule's** — seed 13, which this patch reproduces at 1.0498. Over
all eight seeds the family's rules mean **0.781** against the board's **0.942** on the same
screen, so the page is ruled by a hand 17% steadier than the grid's. **Two of eight fall below
R3's band floor of 0.722** (0.5486, 0.5553). The band is a population statistic, not a per-line
law — the board itself puts three of eight sampled lines under it — so the gate as the brief
states it ("σ inside [0.722, 2.886]") is RED per-rule and GREEN per-population. The
synthesizer's choice: restate the row as a mean, or pick seeds whose σ clears the floor. Seed
choice is free.

**Painted contrast, canvas read-back of the engine's own bytes, 350 columns:**

| reading | light | dark |
|---|---|---|
| median (the rule's core) | **3.53** | **4.364** |
| p25 | 3.060 chromium / 3.261 webkit | 3.822 / 4.049 |
| **worst antialiased column** | **2.451 chromium / 2.635 webkit** | 2.969 / 3.252 |
| columns under 3:1 | **21.4% chromium / 15.7% webkit** | 1.4% / 0% |

**The spec's "worst sample 3.06" is the p25, not the worst.** At stroke 1.6 and graphite 55% a
fifth of the rule's columns paint under 3:1 in light, because the wobble crosses pixel rows and
splits its coverage between them. The spec's own floors — never thinner than 1.6, never below
55% — sit exactly at that edge and do not hold the worst sample above 3.0. The levers are one
notch each (stroke 1.8, or the ink at 60%) and the critique should price one. The median is
comfortably over and the mark is non-text, so this is a judgement about the thinnest part of a
drawn line, not about the line.

---

## 4 · The gaps, and the hard parts

### (a) THE PINNED HEAD PAINTS OVER ITS OWN FIRST CONTROL — the pass's chief finding

The spec wrote the class invariant — *a sticky surface with a ground never paints over a
control* — and the release as built does not hold it. A head that holds at the card's top is
opaque, and the field it names scrolls UNDER it:

| cell | worst covered control, five scroll states |
|---|---|
| rail 1440×900 | **37.7% of `Normal`** at scrollTop 500 (chromium) · 37.9% (webkit) |
| desk 1280×800 | **38.8% / 38.9% of `Normal`** at scrollTop 500 |
| dock 390×844 | **13.6% of `Deal`** at scrollTop 217, both engines |

`frames/2-pinned-name-1440-chromium.png` shows it: the `marks` rule bisects the `Normal` chip.
It is under the 96% burial `access.spec` 2.1 fires on and it is not an I3 violation, so every
instrument the brief names reads GREEN while the eye reads a cut chip. `scroll-padding-top`
answers a FOCUS landing, not a scroll, and is not the cure. The cure is a reserve — the field's
first row must not enter the pinned head's band — and it costs the height budget the head's own
31px per pinned group, or the release trades back some of what it bought on I3. **This is the
synthesizer's chief decision.**

### (b) THE 430 SEAM IS A NEW RED

390 is cured (−2.73 → **+6.91**) and 375 improves (+5.77 → **+15.41**), but 430 goes **+14.11 →
−17.09**: the card's content grew past its cap there, so the case fills to the `--sheet-chrome`
floor and rises over the wordmark. The spec anticipated exactly this and wrote the guard —
`max(12.6rem, calc(var(--masthead-foot) + 8px))` — but `--masthead-foot` is W2 §2.5's publisher
and is **not in this tree**, so the arm resolves to the floor and the guard is inert. The
dependency is named, not claimed: the seam row is GREEN at 375/390 and RED at 430 until W2 §2.5
lands.

### (c) THE FONT SUBSET OWES ONE CODEPOINT

`check-font-coverage.mjs`, with its extractor re-cut to read `<RuledGroup name>`, fails with
exactly one miss:

```
Fraunces · .section-heading: "players" misses "p"
```

The subset (`src/assets/fonts/fraunces-subset.woff2`, 14,636 B) declares
`U+0020, U+0042-0044, U+004C-004E, U+0053, U+0061-0069, U+006B-006F, U+0072-0077, U+0079-007A`
— it skips `j p q x`. Five names came BACK to Fraunces from the pencil hand; four of them
(`new game`, `marks`, `what fits`, `checking`) are covered and `players` is not. The price is
ONE glyph: extend the range through `U+0070`, re-cut with the standing recipe (instancer
SOFT=0 WONK=1, then `pyftsubset`), re-declare the `unicode-range` in the same commit. Un-cut,
`players` paints its `p` in the Georgia fallback mid-word — the ransom note, caught by the gate
on its first run, which is the gate working.

### (d) SEVEN UNIT ROWS ADDRESS THE DEAD GRAMMAR

`vue-tsc --noEmit` is **clean (exit 0)**. `vitest run`: **803 passed, 7 failed, 1 file** — every
failure is `GameControlPanel.test.ts`'s zone-grammar block addressing `.tray-well`,
`.washi-tag`, `.mobile-heading-row` and "six co-equal eyebrows become two". They are the
compartments' and the tabs' own rows; they must be re-cut to the seven names in the same commit,
and the prototype did not re-cut them.

### The smaller ones, stated

- **The per-dimension negative control did not fire.** `min-inline-size: var(--tap-floor)` is on
  both confirm faces and computes to 44px, but `keep` and `clear` measure 51.73 and 54.39 wide
  from their own ink, so ablating the declaration at runtime changed nothing: the floor is
  bought by the word today and the rule is a guard against a shorter word tomorrow. The brief's
  named control (the gallery's ribbon at 39×44) could not be armed from the game route in this
  rig; its defect is confirmed statically instead — `GameGallery.vue` declares
  `@media (pointer: coarse) { .guard-face { min-height: 44px } }` and nothing for the inline
  axis. **The predicate remains unproven on a live surface.**
- **The option chips carry no authored ring.** `--ring-ink` is spent on `.icon-btn`,
  `.info-btn`, `.players-leave` and `.confirm-btn`; `.ctrl-btn` still wears the UA's. The
  spec's own table says CHIP takes the same ring.
- **WebKit's ring could not be read through a Tab walk** — 60 presses never reach a button
  (WebKit's keyboard model), so the ring's INK was painted from the authored declaration and
  read from bytes. The focus MECHANISM is measured in chromium only.
- **The r0 law-probe's R3 predicate is blind to this cure.** It greps the `.action-bar { … }`
  CSS block for `border|HandDrawnOutline`; the bar's edge is a `<RuledLine class="outline-svg">`
  in the TEMPLATE, so the probe reads RED while the live reading is `ownChrome = true` at three
  cells, both engines. The predicate needs widening before it can score this family.
- **Not run, and named:** `e2e/filter-census.spec.ts` and the goldens (both want a built dist;
  the live whole-document filter count is 24 → 24 and `FILTER_BUDGET_TOTAL` is untouched at 9);
  `FILTER_BUDGET_UNION_AREA ±2%`; the masthead-to-board gap. **§14's quick set was not built** —
  `DrawerTab.vue` is untouched, so `hint` + the mode chip on the tongue's band is spec-only in
  this pass.
- The confirm ribbon is out of flow and therefore Δ 0, but while armed it paints over the card's
  last ~87px (`frames/4-…`). It is transient and `role="alertdialog"`, so it is not the sticky
  invariant — noted so the critique decides rather than discovers.

---

## 5 · π — the surfaces this family does not claim

Rects at 1280×800 and 390×844, both engines, light: the wordmark, the board's frame layer, the
first cell, the tongue and `#fold-tools`, read at both ports. The board and the wordmark are
unmoved in X and W at every cell; the whole scene below 1024 moves in Y with `--sheet-chrome`'s
+9.6px, which is the family's own declared price and the only Y that moves. The hue census is
byte-identical to HEAD's 29 rows. `filterBudget.ts` is untouched.

---

## 6 · Frames (8, 283 KB total, each ≤ 69 KB)

- `1-ruled-page-390-dark-{chromium,webkit}.png` — the seven printed names on hand-ruled lines,
  the boxed `deal` with its tally inline, the bar as the case's foot below the card's end.
- `2-pinned-name-1440-{chromium,webkit}.png` — the release at scrollTop 500: the pinned name IS
  the group under the eye, **and** §4(a)'s defect, in one crop.
- `3-landscape-900x500-{chromium,webkit}.png` — the foot bar present in the landscape dock.
- `4-confirm-berth-390-{chromium,webkit}.png` — the ribbon berthed under `clear`, both verbs at
  the floor, the destructive face at 2.5 in `--color-red-ink`.

Nothing here closes a mark. U-10 stands; the owner disposes at the re-look.
