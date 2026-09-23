# prototype:G-BAR — T9-M18 "This needs to have a border in some way" (T9-M04 restated)

The mark stays the owner's (U-10). Nothing here retires it. This is the adjudicated apotheosis
(`adjudicate/G-BAR.md`) built from source for the first time, measured against the HEAD control in
the same runs. It becomes pass-5 charter rows for CTRL-TAPE (the foot's mover), CTRL-RULE,
CTRL-FACE, MOT-LADDER, G-PANEL and PLR-PLACE (§7).

- **Tree:** worktree `.claude/worktrees/wf_3b66f064-970-21`, cut at `b9ba5c42`, which is docs-only
  over `1e6cfbbf` (`git diff --stat 1e6cfbbf b9ba5c42 -- web/frontend/src web/frontend/e2e
  web/frontend/scripts` is empty). Nothing committed. Source diff: `prototype.diff` (this folder).
- **Served:** built dists under `vite preview`, 127.0.0.1, `--strictPort`, private cacheDir
  (`web/frontend/.intake/build.mts`). Prototype `dist-proto` on 4259 (listener PID 53351), HEAD
  control `dist-base` on 4260 (listener PID 53347), built before the first edit. Both killed by
  PID before return.
- **Board:** one encoded `?board=` payload in every read (the golden spec's `PINNED_GIVENS`
  through `e2e/wire.ts` `encodeSudoku`), so both arms deal the same board.
- **Box:** loaded (load average 16–31 during the batteries; other lanes' Playwright running).
- **Instruments:** `instruments/gbar.mjs` (forks census/panel-bar/probe.mjs and
  opus-probe/probe.mjs; every arm in one run), `instruments/summarize.mjs`, `instruments/crops.mjs`.
  Raw JSON is not banked; everything below is its summary.

## 1 · What was built (web/frontend)

1. **The split** (`GameScene.vue`, `scene.css`). `.controls-card` is a two-row grid
   (`minmax(0,1fr) auto`) in every regime: `.card-body` (the slot, the scrollport, `min-height: 0`,
   `overflow-y` / `overscroll-behavior` moved here) and `<div id="card-foot" class="card-foot">`.
   The padding utilities are split in the same edit: body `px-5 pt-5` / `px-2 pt-1.5`, foot `px-5` /
   `px-2`; the foot's bottom in `scene.css` — rail `3.5rem` (the note berth, `:156` moved, not
   deleted), portrait dock `max(0.625rem, env(safe-area-inset-bottom))`, landscape dock `0.375rem`
   (its old `py-1.5`). The top sentinel, `scroll-padding-top`, the rail gutter block and the Gecko
   `@supports` arm re-target `.card-body`. `scroll-padding-bottom: var(--action-bar-h, 0px)` dies →
   static `2rem` on the body. `--card-gutter` gets a `0px` base on the card (no `var()` fallback).
2. **The lip** (`GameControlPanel.vue`). `.action-bar` → `<HandDrawnOutline class="tool-lip"
   :stroke-width="1.5" :outset="4" :radius="3" :pose="0">` wrapping `.strip-row` (the `1fr auto`
   grid + `padding-block: 0.4rem 0.15rem`, verbatim). `.action-bar` keeps `position: relative`;
   loses `background`, `::before`, `::after`, the sticky block and `z-index: 60`. The bar sits in
   `<Teleport defer to="#card-foot" :disabled="!footRegime">`, `footRegime` =
   `mediaRef('(min-width: 1024px), (max-width: 1023.98px) and (orientation: portrait)')` (the
   `useCoarsePointer` module; no-DOM default false, so the unit suite mounts it in place).
3. **The fade.** Not `.card-body::after` (the brief's form) but `.card-foot::before`: absolute,
   `inset: auto var(--card-gutter) 100% 0`, 2rem, the same gradient, `z-index: 40`, gated by
   `.card-body[data-fold-below] + .card-foot::before`; the 150ms literal moves un-retimed and PRM
   still cuts it. Reason: the foot spans the card's full width, so the band covers the body's
   PADDING box by construction with no per-regime negative margins, and it stops short of the rail's
   scrollbar track. `publishFold` publishes on the body (`cardEl` = `wrapEl.closest('.card-body')`
   on mount); `--card-pad-t` is re-read from the body in the `[cardEl, wrapEl]` observer; the
   `--card-pad-b` / `--action-bar-h` publisher and its bar observer die; `BAR_FADE_PX` stays (the
   fade is still 32). `data-under-bar` now reads the body's clip edge − 32 in every regime (the
   fade exists in all three).
4. **The ring.** `.info-glyph`'s `border`, `border-radius` and both `border-color` lines die;
   nothing drawn in their place (G-INFO's ballot 1 owns the form).
5. **The berth note seam** → `.controls-card:has(.invite-btn:hover|:focus-visible) .berth-note`.
6. **Ballot arm b** behind `?lip=tab` (PROTOTYPE SCAFFOLD, dies with one arm): 2.5 / 3 / 0.
7. **The gap above the strip** — two readings, one REFUTED on painted ink (§3 G4):
   `.card-foot .action-bar { margin-top: 0.5rem }` in the foot on rail AND dock (16px box gap =
   the rail's inter-well gap); landscape `.action-bar { margin-block: 1rem }` (collapses with the
   last well's 0.5rem and the play row's 0.35rem → 16/16). **Deviation from the brief:** no
   `--strip-outset` / `STRIP_OUTSET` binding. The gap is a well's own 0.5rem, which equals 2×outset
   only at outset 4; binding it to the outset would give the ballot arm a 6px gap for no reason.
   One rule, no custom property, no inline style.
8. **A defect the split exposed, cured:** `.legend-fold { contain: layout }`. The shut crib's `<dl>`
   overflows its 0-tall fold, and a clip is paint, not layout, so the overflow counted as the
   scrollport's scrollable overflow — **94px of blank scroll at the card's end** once the bar left
   the body (1280×800: body scrollHeight 1115 → 1021). The sticky bar + 56px pad used to sit over it
   on HEAD. Layout containment turns it into ink overflow; not size containment, so the crib's
   max-content still sizes the rail (G7 holds), and no text walker is clipped (a11y 3.4's reason
   for `clip-path` stands).
9. **Comments** at every site the brief named re-cut to say what is now true; `index.css`'s
   theme-turning ground list drops `.action-bar` (no slab, nothing to dusk); `SheetWashiLabel`'s 50
   note re-cut (its pair with the bar's 60 is gone).
10. **e2e:** `e2e/tool-strip.spec.ts` NEW (G1–G6, G10, G11, G13 geometry/DOM rows, each with its
    negative control; the painted reads stay in the instrument). `e2e/zone-grammar.spec.ts:303–360`
    re-aimed (strip in `#card-foot`, in frame at scrollTop 0; negative control strikes the grid row).
    Scroller reads re-aimed to `.card-body`: `viewport-law.spec.ts` :22 (selector list), :424,
    :581, :619, :805; `mobile-platform.spec.ts:536`.

Not moved: `#keys-fold`, the deck, the tab, the case, `OptionSelector`, any timing or curve.
Diff: 8 files +296/−321 ignoring whitespace (the Teleport re-indents the strip template), plus the
new spec.

## 2 · Mechanical (G15)

| check | result |
|---|---|
| `node scripts/check-copy-register.mjs` (bare) | 0 dashes, 0 unadmitted jargon |
| `npm run lint:motion` | OK, 36 specs (tool-strip declares `PRM: live, because …`) |
| `node scripts/ledger-diff.mjs --verify-cites` (repo root) | GREEN, CITES clean |
| `check-theme-selectors.mjs` | OK |
| `grep -c 'action-bar-h\|card-pad-b' src` | **0** (HEAD 12) |
| `env(safe-area-inset-bottom)` in `scene.css` | **1** (HEAD 0) |
| `vue-tsc --noEmit -p tsconfig.json` / `-p tsconfig.e2e.json` | exit 0 / exit 0 |
| `vitest run` | 69 files / 847 tests passed |
| e2e chromium on proto: tool-strip, zone-grammar, viewport-law, mobile-platform | 45 passed, 1 failed — `viewport-law.spec.ts:396` §2.5 "no washi tape covers…" @1440×900: `new game` tape over `Hard` 3.4% (358.6px²). **RED on HEAD too** (same run class on 4260: `new game` over `Medium` 11.4%, 1192.1px²). Pre-existing, not introduced. |
| e2e webkit on proto; tool-strip + zone-grammar on HEAD (born-RED) | see §2a |
| filter census (`filter-census.spec.ts`, throttle config) both engines | see §2a |

## 3 · The gates — prototype vs HEAD, same runs, both engines

Cells: 1280×800 / 1024×768 / 1440×900 fine; 1280×800 `hasTouch`; 390×844, 430×932 `hasTouch`
(dock settled, 3 agreeing polls); 844×390, 812×375 `hasTouch`; light + dark; DPR 2. Full battery
(v2) on all 8 cells × 2 themes × {proto, base} + tab arm at 1280 fine / 390 coarse; the final build's
gap rule re-confirmed (v3) at 1280 fine, 390, 430, 844, 812, both engines, light. Themes never moved
a geometry number; only contrast differs.

- **G1 — GREEN (rail + dock), instrument-limited in landscape.** One `path[stroke-width="1.5"]`,
  pruned, in every cell both engines (32/32); tab arm `2.5`. Coverage (lip shown vs hidden, DPR 2):
  **1.00 on all four sides** at every rail and dock cell, both engines, both themes. Landscape
  top 0.87–0.97 / bottom 0.82–0.88: the 828px side wanders 10.2–10.8 css off its box and the
  instrument's side band is 8 css wide, so those columns' ink lies outside the band — a band-width
  limit, not missing ink (left/right 1.00). Painted extent outside the box: rail 5.2–7.3, dock
  7.0–8.2, landscape 10.2–10.8. HEAD: no path, top-band ink 0 of ~3400–4500 px (n=32).
- **G2 — GREEN.** Census flanks (7px × lip height + 2px above its top stroke, wells' differential):
  **0 / 0** every scrolling cell both engines both themes; Opus differential (content edge → 8px,
  lip top → lip bottom + 60, clamped 2px inside the card): **0 / 0 / inside 0**. HEAD: 55.8–58.3
  (rail) and 125.8–132.8 (dock) per 7px flank; 161.3–166.8 / 121.8–128.8 per 8px flank. (Opus's
  window as written reached 4px below the card, where the CASE's 3px frame boils on the beat:
  136–153 px² of noise "inside" on BOTH arms until clamped. Measured.) The fade's own read: in the
  body's padding band over the fade's last 6px the wells' strokes leave 2.5–5.8 css px² (the
  gradient is 0.81–1.0 there); negative control, fade narrowed to the content box → **12** at
  every rail cell (whole 32px band 30–36 → narrowed 33–36 at rail). At 390 the pose is not
  reachable (the body scrolls 83px) and the control does not discriminate (3.3–7.3 vs 2.5–5.8).
- **G3 — GREEN, and the gutter cure is not needed.** Painted side-stroke centroids, lip vs the
  nearest well, scroll end: |ΔL| ≤ 0.25, |ΔR| ≤ 0.29 every cell both engines (rail ≤ 0.10, dock ≤
  0.13). WebKit (Playwright) reads classic 6px gutters, no overlay miss. Tab arm: ±0.9–1.15 (outset
  3 sits 1px inside, as priced). Real Safari's overlay scrollbars are unmeasured (M19).
- **G4 — GREEN on the box and on daylight; the nominal "8 ± 0.75 stroke-to-stroke" is not what any
  two wells paint.** Rail fine: box gap 15.92–16.36 (wells 16.00); painted daylight min 8.5–9.5
  (≥4 ✓); painted s2s median 13.5–14.0 vs the inter-well 16.6–17.1 (the jagged path puts strokes
  near the box edges, not at ±outset; the lip's top side wanders ~2.5px further up than a well's).
  Negative control (gap struck): daylight 0.5–1.5 — Opus's 0.5–1.5 reproduced. Dock (the refuted
  reading): at the dock's own 8px inter-well gap the lip's ink CROSSED the last well's — daylight
  min −0.5 to 1.0 both engines, coverage top 0.59–0.63 — while two wells at 8px keep 5.5–6.5. At
  16px (final): daylight min 7.5–9 at 390/430, both engines. Landscape at 16px: 4.5–5.0 (at 8px:
  −3.0 to −3.5). 430×932 does not scroll; its read is at rest.
- **G5 — GREEN at 0.625rem; 0.5rem REFUTED.** `env(safe-area-inset-bottom)` in the foot's rule;
  computed foot `padding-bottom` 10px at 390×844 both engines. The lip's lowest ink above the
  viewport bottom: **0.625rem → 2.5–3.0 (390), 2.0–2.5 (430)**; 0.5rem → 0.5–1.0 / 0–0.5. So the
  smaller pad that clears is 0.625rem, and WebKit 430 sits exactly on the 2.0 floor. Strip rises
  4px (pad − 6). HEAD: bar 6.00/6.02 above the bottom, no `env()`. RUNSHEET line: not written (the
  chair's file; §7).
- **G6 — GREEN.** Max computed border in `.action-bar` and every non-`kbd` descendant: 0 (n=32).
  HEAD: 1–1.5px (the `i` ring).
- **G7 — GREEN at every fine rung; named deltas elsewhere.** Card, board and masthead rects
  **identical to the hundredth** at 1280×800 / 1024×768 / 1440×900 both engines (card 324.22 /
  332.31 at 1280 as HEAD), and board + masthead identical at 390 and 430 settled and landscape. π
  signature (530 nodes rail / 497 dock / 496 landscape, tags + rect + 13 computed paint properties,
  svg interiors excluded for the beat): **0 tag deltas** (two `img.rest-pose.is-pose-active`
  swaps at 1024/1440 light are the wordmark's pose clock), paint delta 1 (`.controls-card`'s
  `display: grid`), rect delta 1 (`.control-panel-wrap` height, the strip left it). Named deltas
  (measured, several larger than the brief's): dock strip up 4 (pad − 6) ✓; **430 card +12, not +4**
  (8 foot gap + 4 pad; the sheet, tongue and handle rise 12 with it; board unmoved; the dock's
  8px alternative that would have met +4 is refuted under G4); **landscape +12
  of flow** (bar +8, play row +18.41; scrollHeight 743 → 755); coarse rail: the play row now sits in
  the body above the strip (−64.81 in content order) and, on WebKit, the strip sits 17px lower
  (HEAD's sticky bar stuck 73px above the card bottom there, chromium 56); landscape tags inside the
  last 32px now take `data-under-bar` (the fade exists there now): 3 tag paint deltas.
- **G8 — GREEN.** Lip core contrast on painted bytes: light median 17.61–17.78 (min 4.73–5.24),
  dark 14.20–14.31 (min 5.73–6.25), both engines, every cell; tab arm identical medians. Sublabels
  (darkest quarter of text pixels vs paper): **4.66 light / 7.68 dark**, identical to HEAD, both
  engines. They sit in the foot, never under the fade, so "at the fade's opaque end" reads the same
  paper.
- **G9 — GREEN (structural); the census spec: §2a.** Lip `.outline-svg.is-pruned` 32/32, 1 pose
  node, 0 `will-change`; the element-with-filter count equal proto vs HEAD in every cell.
- **G10 — GREEN, and HEAD is RED.** Focus walk over the body, 1280×800 + 390×844, both engines: 0
  controls under a painted fade (worst −0.5 to 0). Negative control `scroll-padding-bottom: 0` →
  2 (1280: Deal 31.6, Off 31.9) and 3 (390: Off/Ask/Live 21.0–21.5). HEAD: the same 2 and 3 under
  its fade — its measured `--action-bar-h` (121px at 1280) priced the bar and pad but never the 32px
  fade above the bar.
- **G11 — GREEN.** Each rail note's top 0.20–1.57 below the lip's box, i.e. astride its bottom
  stroke (2.4–3.8 above the svg's edge); 0 notes over a body control; the berth note reveals (opacity
  1) from the players well across the body/foot seam, in `#card-foot`. Both engines.
- **G12 — GREEN.** `--card-pad-t` 20px / 6px on the body = its padding-top; sentinel `top` −20 /
  −6; tag census over the full scroll: 0 orphans, 0 clipped above, both engines.
- **G13 — GREEN (final build).** Landscape 844×390 + 812×375: lip in place in the body's flow, no
  foot, `box-shadow: none`; top daylight per column to the last well min 4.5–5.0 (≥2); the lip's
  lowest ink 5.5 above the play row's box top. The play-row ink read returned 0 columns (the
  instrument's clip stopped short of the icons): a gap, the box read stands in.
- **G14 — GREEN (1.5), RED on the tab arm in WebKit.** Keyboard `:focus-visible` rings on the four
  verbs, notes hidden: 0 px of overlap with the lip's ink, both engines (chromium ring wholly inside
  the lip box; WebKit's ring puts 70px² outside the box but inside the stroke's inner edge). Tab arm:
  WebKit's fourth verb ring overlaps the 2.5 stroke by 15–17px².
- **G16** n/a (no Row A on this tree).
- **The discontinuity (the brief's generic row):** strip-vs-card offset per frame through the
  drawer glide and per step through a full scroll: **0 jumps, max step 0.00–0.09px** on the
  prototype, every cell both engines. HEAD: the sticky bar steps 2 frames × 2.2–2.4px in WebKit
  landscape / 390 glides, and **3 jumps of 37px (webkit) / 2 of 29px (chromium) on the coarse-rail
  scroll**. The foot has no sticky to lag.
- **The i's crib landing (M16, G-INFO's):** press → the crib is still below the frame on both arms
  (proto 102 / 106px over, HEAD 102 / 106). Not this group's to cure; the move does not change it.

### 2a · e2e webkit, HEAD born-RED, filter census

- **e2e webkit on proto** (tool-strip, zone-grammar, viewport-law, mobile-platform): 45 passed,
  1 failed — the same pre-existing `viewport-law.spec.ts:396` §2.5 tape row as chromium.
- **HEAD born-RED** (tool-strip + zone-grammar on 4260, chromium): all 11 `tool-strip.spec.ts`
  rows RED and the re-aimed `zone-grammar.spec.ts:323` RED; the other 10 zone-grammar rows pass on
  both arms.
- **Filter census** (`filter-census.spec.ts`, `playwright-throttle.config.ts`, both engines, on the
  served dists): **12/12 on the prototype and 12/12 on HEAD** — G3.1's exact budget (9, area and
  all), G3.3 below 1024, G3.5 hover rows. The lip mints no filter.

## 4 · Crops (≤150 KB, palette PNG)

1. `c1-chromium-dark-1280x800-fine-leakpose-lip1.5.png` — m18's pose, HEAD twin `census/panel-bar/c3`.
   The strip wears the frame; no bracket runs beside it. What does show: the incoming well's top
   stroke dissolving in the fade 8–12px above the lip, a faint second rule while the scroll is in
   that band.
2. `c2-webkit-light-390x844-coarse-dock-leakpose-foot-on-pad.png` — the dock settled, the foot on
   its 10px pad (HEAD twin `census/panel-bar/c4`). The leak pose is not reachable at 390 (83px of
   scroll); the `checking` well dissolves above the lip instead.
3. `c3-chromium-light-1280x800-fine-scrollend-twoup-lip1.5-vs-2.5.png` — ballot 1, rail.
4. `c4-webkit-light-390x844-coarse-scrollend-twoup-lip1.5-vs-2.5.png` — ballot 1, dock, down to the
   viewport's bottom edge (the lip's ink ends 2.5px above it).

## 5 · Gaps (this prototype's own)

- G5's real-device read (the home indicator on an iPhone) is unmeasured; Playwright supplies no
  inset, so `env()` resolved 0 and `max()` took 0.625rem everywhere. WebKit 430 sits ON the 2px floor.
- Real Safari (overlay scrollbars, M19) unmeasured; G3's gutter cure is held, not applied.
- G1 landscape coverage and G13's play-ink column read are instrument-limited (band 8 css, clip),
  stated above with the substitute read.
- The G2 negative control does not discriminate at 390 (pose unreachable). The rail discriminates.
- The painted inter-well rhythm is not the nominal 8px; G4's "8 ± 0.75" should be re-worded as
  "box gap = the inter-well box gap ± 0.5 and ink daylight ≥ 4 in every column". The lip's painted
  s2s runs 2.5–3px tighter than two wells' at the same box gap.
- The landscape lip, 828px wide, is the one pose where the hand-drawn side wanders ~10.5px off its
  box (the wells there wander as far; the jagged path's segments scale with the side). Framed only
  in a debug capture, not banked. A W2 §2.2 / PLR-PLACE question, not answered here.
- 430 grows 12, landscape flow 12: both larger than the adjudication's named deltas; G-PANEL's
  deal-row re-budget and PLR-PLACE's laps were not run. 390×664 / short landscape: unmeasured.
- The pre-existing `viewport-law` §2.5 red (tape over a level chip) is unchanged in kind.
- No goldens run (`visual-golden` / `visual-regression` pixel rows will move where the card's
  bottom and the strip changed); no production pass.

## 6 · Ballots, as framed

1. **The pen** — (a) 1.5 / 4 / 3, the wells' (default): coverage 1.00, contrast 17.6–17.8 / 14.2–14.3,
   side strokes on the wells' x (|Δ| ≤ 0.29), rings clear both engines. (b) 2.5 / 3 / 0, the tongue's:
   same coverage and median contrast, strokes 0.9–1.15px inside the wells' on both sides, WebKit's
   fourth focus ring touches it (15–17px²). Crops 3 and 4, two-up.
2. **The form** — only (a), the closed frame, was built. CTRL-RULE's one drawn top rule was not
   framed by this lane.

## 7 · Pass-5 charter rows (from this build)

- **CTRL-TAPE** (the foot's mover): land the split + lip + foot-hung fade as built here (§1), with
  `.legend-fold { contain: layout }` in the same commit (without it, 94px of blank scroll); the gap
  as one `0.5rem` rule, no `--strip-outset`; foot pad `max(0.625rem, env(safe-area-inset-bottom))`
  (0.5rem refuted, WebKit 430 on the 2px floor); `tool-strip.spec.ts` + the zone-grammar re-aim +
  the `.card-body` scroller re-aims in viewport-law / mobile-platform; its pass-3/4 `#card-foot`
  tree reconciles to this form. G4 re-worded (§5).
- **CTRL-RULE:** `scene.css`'s `var(--action-bar-h, 0px)` is dead (static 2rem); ballot 2's top
  rule is unframed.
- **CTRL-FACE:** the card has two stroke weights (case 3, compartments and strip 1.5); G14 on
  WebKit if arm (b) fires; the `i` has no ring now (G-INFO ballot 1 supplies it).
- **MOT-LADDER:** the fade's `150ms` moved to `.card-foot::before` un-retimed; name it as a rung.
- **G-PANEL:** the 430 card is 12px taller (not 4); pay it back in the deal-row budget if wanted.
- **PLR-PLACE:** 430's sheet top, tongue and handle rise 12; landscape flow +12; 390×664 and short
  landscape unmeasured.
- **Chair:** the RUNSHEET line for G5 (the lip's bottom stroke above the home indicator on a real
  iPhone); the named deltas above, which differ from the adjudication's; the pre-existing §2.5 tape
  red on HEAD; the HEAD G10 red (its bar-height publisher never counted the fade), cured by
  construction here; HEAD's WebKit sticky-bar steps (2.2–2.4px per glide frame, 29–37px on the
  coarse-rail scroll), cured by construction.
