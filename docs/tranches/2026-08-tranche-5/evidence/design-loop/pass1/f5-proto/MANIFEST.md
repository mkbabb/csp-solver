# F5 · PROPORTION LEDGER — PROTOTYPE MANIFEST (pass 1, ordered slice D1+D2+D3)

Lane: PROTOTYPE. Built to falsify the family's center: **typography and ink pressure alone
can out-rank geometry.** Nothing under the project tree was modified — every source file was
read, copied, patched in place *here*, and kept beside its original.

## Artifacts

| artifact | status | what it is |
|---|---|---|
| `code/apply-slice.py` | **RUNS** — `python3 code/apply-slice.py` | reads the 6 real files, applies the slice as exact-string patches (a miss is a hard error), writes `*.before`/`*.after` + `f5-slice.diff`, prints the net-LOC ledger |
| `code/*.before` · `code/*.after` | **RUNS** (data) | the shipped bytes and the patched bytes, side by side, 6 files |
| `code/f5-slice.diff` | **RUNS** — `git apply -p1` from `web/frontend/` | 305-line unified diff, `a/src/…` `b/src/…` prefixes |
| `mock/build-mock.mjs` | **RUNS** — `node mock/build-mock.mjs` | generates the two mocks; inlines the app's own woff2 subsets, tokens, component CSS, icons, filter defs |
| `mock/f5-slice-desktop.html` | **RUNS** — open in a browser at 1440×900 | ≥lg drawer card, BEFORE ∥ AFTER, light+dark, 7 live toggles, live measurement ledger |
| `mock/f5-slice-mobile.html` | **RUNS** — open in a browser at 390×844 | <lg 366px card, same |
| `measure/measure.mjs` | **RUNS** — `node measure/measure.mjs` (needs the `node_modules` symlink already in `measure/`) | drives both mocks headless in the project's own playwright, writes `measurements.json` + 30 screenshots |
| `measure/measurements.json` | **RUNS** (data) | every number below, per regime × theme × pane |
| `measure/font-coverage.py` → `font-coverage.json` | **RUNS** — `python3 measure/font-coverage.py` | fontTools cmap ∩ declared `unicode-range` for the three subsets, per rendered string |
| `shots/*.png` (30, 5.1 MB) | **RUNS** (data) | before/after/side-by-side/ledger × desktop/mobile × light/dark, plus 5 priced variants |
| D4 (rhythm) · D5 (picker) · D6 | **SPEC-ONLY** | out of the ordered slice by the spec's own gate — they land only if the slice survives |

Everything is self-contained: no network, no dev server, no port. The mock never loads a
remote font, script, or style; the fonts are base64 data URLs of the app's own subsets.

## Measured — desktop, 1440×900 (`.controls-card`, the ≥lg rail)

| | before | after | Δ |
|---|---|---|---|
| panel content height | 934.5px | 792.0px | **−142.5** |
| card height (p-5) | 974.5px | 832.0px | −142.5 |
| **card width (intrinsic)** | 282.4px | **410.8px** | **+128.4** |
| die box (rendered) | 28×**17.6** | 32×32 | see finding 1 |
| Deal button box | 44×44 | 93×76.9 | |
| assist zone | 226.0px | 50.6px | −175.4 |
| new-game zone | 413.4px | 446.3px | +32.9 |
| first `.ctrl-btn` font-size | 20px | 20px | guard ≥19 **green** |

The 934.5px before-figure independently reproduces the app's own recorded 936px
(`scene.css:29` "the assist rows grew the card past the sheet (936px…)") — the mock is
measuring the same panel the app ships. Spec target was ≤780px content; the slice lands 792.
Against the 640px `max-height` cap the card still scrolls, by 192px (the spec conceded this).

## Measured — mobile, 390×844 (the 366px card; card content box 360px)

| | before | after | Δ |
|---|---|---|---|
| panel content | 561.9px | 494.8px | **−67.1** |
| card height | 585.9px | 518.8px | −67.1 |
| assist zone | 152.8px | 53.0px | −99.8 |
| new-game zone | 187.8px | 212.5px | +24.7 |
| die box | 28×28 | 32×32 | intact (coarse arm) |
| all 11 `.ctrl-btn` heights | 44px | 44px | 44 floors **kept** |
| all `.icon-btn` boxes | ≥44 | ≥44 | kept |

Spec claimed ≈125px mobile recovery; measured **67.1** — D3 gives 99.8 and D1 takes 24.7 back.

## The pressure ladder, measured vs the spec's ledger (on `--color-card`)

| rung | spec light/dark | measured light/dark |
|---|---|---|
| `--ink-press-firm` 85% (Deal label) | 9.19 / 8.90 | **9.27 / 8.82** |
| `--ink-press-med` 75% (headings) | 6.57 / 7.14 | **6.58 / 7.07** |
| `--ink-press-light` 68% (eyebrow, legend) | 5.23 / 6.06 | **5.16 / 5.96** |

All ≥4.5 in both themes — the D2 ledger holds within 0.1. The three sub-AA holes close:
legend text 3.53→5.16 light (4.35→5.96 dark), kbd border 2.36→3.53, armed rose→red-ink.
Rendered rungs after: 32.93 · 25.89 · 20 · 14.38 (desktop) — 4 rungs, monotone with rank.

## Slice verdict against the spec's own kill criteria

1. **"Deal still reads subordinate"** — *split, and the split is the finding.* In the SIZE
   channel D1 wins: 32.93px against the 20px option rung it commits, one √φ rung over the
   25.89px headings. In the MASS channel it loses: the headings are Fraunces-800 uppercase
   slabs, "Deal" is a 400-weight lowercase hand at 85% pressure, and the panel's loudest ink
   is still the selected option (`text-foreground`, 19.45:1) at 2.1× Deal's 9.27:1. Rank by
   point size ≠ rank by mass when the faces differ. Priced in the mock: `deal ink FULL`
   lifts Deal to 14.87:1 for one changed token reference (`shots/*-after-deal-full.png`).
2. **"The caption row reads inert"** — *survives.* One line, "CHECK Off Ask Live CANDS Off
   On", underline live on Ask/Off, real `.ctrl-btn`s, every emit seam and 44px floor intact.
   It reads as a preference footnote, not as a disabled control.
3. **"Graphite-75 headings read as a different notebook"** — *owner call, staged.* The tonal
   move is 6.58 vs 4.66 (a firmer, warmer graphite); `shots/{desktop,mobile}-{light,dark}-{before,after}.png`
   put it in front of the owner as the spec asked.

## Findings the build produced (not in the spec)

1. **The shipped desktop Deal die is crushed 28×17.6 — and D1 as written collapses it to
   height 0.** `.deal-btn` (GameControlPanel.vue:757) and `.icon-btn` (:804) are both
   single-class selectors; the later one wins, so `width/height: 2.75rem` overrides
   `.deal-btn`'s `width/height: auto`. The column content overflows the 44px box and the only
   shrinkable item — the inline SVG — absorbs all of it (fine pointers only; the coarse block
   at :874 re-sets auto, so mobile is fine). Evidence: `shots/desktop-light-deal-before.png`,
   and `measure/measurements.json` before-die `[28,17.6]`. At D1's sizes the overflow is
   32.9px and the die renders 0px tall (`drop the D1-a box fix` toggle reproduces it). **Fix
   folded into the slice at zero new lines**: the selector becomes `.icon-btn.deal-btn`.
   D1 is not shippable without it.
2. **The panel's whole heading register renders as a Fraunces/Georgia chimera, per glyph.**
   The `Fraunces` `@font-face` `unicode-range` (index.css) admits exactly 3 uppercase
   codepoints — B, D, S — and `.section-heading` is `text-transform: uppercase`. Measured
   (cmap ∩ range, `measure/font-coverage.json`, confirmed by an in-browser advance probe):
   `NEW GAME` all-fallback; `SIZE`→IZE, `DIFFICULTY`→IFFICULTY, `MARKS`→MARK, `CHECK` all,
   `CANDIDATES`→CANIATE fall to Georgia. Same defect on the other two faces: **every assist
   and Marks label** falls back in part (`Off`, `On` wholly; `Ask`→Ak, `Live`→Lv,
   `Normal`→Nol, `Corner`→Con, `Center`→Cnt), and the four sublabels added after the subset
   was derived — `Deal`, `Fill`, `Undo`, `Hint` — lose their capital to `cursive`. F5's thesis
   is rank-by-type; the type is a chimera on every surface the slice re-rungs.
3. **D1 magnifies that break 2.29× on the one word the family promotes.** "Deal"'s D comes
   from `cursive`, the "eal" from Patrick Hand; at 14.38px it's an oddity, at 32.93px it's the
   panel's largest glyph. `shots/desktop-light-deal-{titlecase,lowercase}.png` price the
   zero-byte cure: `text-transform: lowercase` renders "deal" wholly in the hand (d/e/a/l are
   all in range) and leaves the DOM text "Deal" — so `mobile-affordances.spec.ts:352,367`
   (`toHaveText("Deal")`, textContent) stays green. The alternative is re-subsetting three
   woff2s from upstream sources that aren't in the tree.
4. **D3 trades 175px of height for 128px of card WIDTH in the drawer regime.** `.scene-controls`
   is `lg:items-start` and `.controls-card` sets no width, so the card is intrinsically sized
   and the one-line assist row's max-content width becomes the rail's width: 282.4→410.8px.
   That is the exact failure class `scene.css:28-40` records (a wider rail pushing the
   centered `.app-layout`, masthead negative, wordmark off-screen). Priced alternate,
   `assist-stack` toggle: cells stacked instead of inline holds the rail at **278px** and
   still lands 828px content (−106.5 from 934.5) — desktop-only cost of 36px height for zero
   width growth. On mobile the width is fixed, so stacking only costs height (541.2 vs 494.8);
   the honest form is inline on the narrow arm, stacked on the wide one.
5. **The spec's `net LOC ≤ +20` gate measures prose, not code.** Measured: **code-only +16**
   (exactly the spec's estimate) but **raw +68** with the rationale comments this estate puts
   over every rule. 6 files, 0 new components, 0 new props, 0 filter-layer bytes, 0 pose
   bakes, OptionSelector API unchanged, `pencilConfig.ts` unchanged. Per file (raw | code):
   typography.css +35|+16 · GameControlPanel +14|−1 · AssistSettings +15|+5 ·
   PencilModeToggle 0|0 · KeyboardLegend +2|−4 · OptionSelector +2|0.

Also folded in, since the slice exposed them: `PencilModeToggle.vue` is a **7th** file the
spec's inventory missed — its "Marks" heading hardcodes `text-muted-foreground`, so without
one changed class the ladder is non-monotone across sibling headings (Marks at 4.66 beside
Size at 6.58). It is counted in the 6 above because OptionSelector's line is a no-op; the
honest count is 6 files with rendered change + 1 hygiene line.

## Fidelity

**Verbatim from source**: the √φ rungs + leading/tracking (`typography.css:24-66`, clamps
intact so every fluid rung reads the real viewport); the color tokens and the `.dark` block
(`index.css` `@theme`); `.section-heading` incl. its ≥768 arm; `.control-panel-wrap`,
`.control-panel-filtered`, `.new-game-*`, `.deal-*`, `.icon-btn`, `.icon-sublabel`,
`.heading-value`, `.mobile-heading-*`, `.play-controls`, `.peek-hold-surface`, OptionSelector's
`.ctrl-btn`/`.selected-item`/`.options-row`, KeyboardLegend's whole block — **in source
order**, which is what exposed finding 1; the coarse `@media` block plus index.css's §R3 44px
floor; `scribbleUnderline` + `mulberry32`; DiceIcon and the 4 action icons; the `#grain-static`
and `#stroke-light|dark` filter defs at their `pencilConfig.ts` params; the three woff2
subsets with their real `unicode-range`s; the real Tailwind class strings on the real markup
shapes, with the v4 preflight metrics (`line-height: 1.5`, `button { font: inherit }`,
`svg { display: block }`) that every height depends on.

**Approximated, declared**: BoilDivider → a 1px hairline (the boiled path stack isn't
reproduced); SheetWashiLabel → a static tape chip; HandDrawnOutline → a 3px border (this is
why the mobile card content box measures 360 and not 366); the Undo/Redo/Hint icons stand in
as DiceIcon (they're outside the slice); `prefers-reduced-motion`, the drawer glide, and the
board are absent.

**Artificial**: exactly one selector, `.f5-after .deal-btn .icon-sublabel` — both panes match
the bare selector, so the AFTER pane needs the prefix. Every other AFTER rule keys off markup
that exists only in the AFTER pane. The coarse-pointer block is duplicated under
`html.sim-coarse` (same declarations) so a fine-pointer desktop browser can render the touch
pose; the headless mobile run uses that mirror rather than Chromium mobile emulation, which
rewrites the layout viewport (390 came back as 411) and would corrupt every clamp.

## Harness toggles (both mocks)

`dark` · `ledger` (live per-pane rung/contrast/height readout) · `sim coarse pointer` ·
`eyebrow in mono` (the `text-mono-caption` alternative to the spec's Fraunces-800 eyebrow,
already a zero-consumer utility in the ladder) · `deal label lowercase` (finding 3) ·
`assist cells stacked` (finding 4) · `deal ink FULL` (kill criterion 1) ·
`drop the D1-a box fix` (finding 1).
