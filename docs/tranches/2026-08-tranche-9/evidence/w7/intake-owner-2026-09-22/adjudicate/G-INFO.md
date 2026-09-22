# G-INFO · adjudication — T9-M16, "The 'i' button clicking does not properly scroll the panel"

Adjudicator: Fable (claude-fable-5-1), 2026-09-22. Against MAIN `1e6cfbbf`. Inputs: the owner's marks
(`design-marks-2026-09-22.md`, frames m17/m18 viewed), `census/info` (24/24 desk cells, crops c1–c4
viewed), `census/panel-bar` (§2 the strip, the outset leak), `portfolio/G-INFO/fable.md`,
`portfolio/G-INFO/opus.md` (+ its two crops and probes), CHAIR-RULINGS §3 (B8 default, §6.1),
registry-v3 §1 (§10 leader CTRL-FACE 79; §13 MOT-VERB 71 / MOT-LADDER 61), R6 law 37 / L5, and
main's source (`GameControlPanel.vue` :143–156, :1210–1227, :1328–1341, :2104–2135, :2181–2235,
:2280–2360; `KeyboardLegend.vue`; `HandDrawnOutline.vue` :54–60, :110–124; `scene.css` :130–156, :264;
`pencilConfig.ts` :163 `chromeLeaveMs: 200`). This lane ran no server (no port in its prompt);
every number is a census's, Opus's, or arithmetic on them, and says which. U-10: the owner disposes
at the re-look; nothing here retires M16.

## 0 · The ruling in one line

**Opus's placement is the thesis (the crib is the strip's first row, in flow, in BOTH the sticky arm
main has today and the B8 foot arm; the press issues no scroll); Fable's instruments and rows are
grafted (the one-clock trace, the content-band floor, the coarse-cell π census, the a11y-3.4 survival
row, the rung's home); Fable's growing lid is REFUSED on a source fact; Fable's scroll-after-settle
fallback is DEAD because the thesis no longer needs it.**

## 1 · What each lane earned

**Opus** ran the design against main on its own server (127.0.0.1:4259) by moving `#keys-fold` into
`.action-bar` as its first grid row, 20 cells per arm both engines, and read: crib visible 1.000 in
20/20 (HEAD 0.001–0.004, reproducing the census), panel scrollTop Δ 0.00 from top and end, verbs +
"i" rect Δ 0.00 from the top, card width 324.22/332.31 and board-left identical to the hundredth (the
crib's max-content still sizes the rail from inside the bar), `--action-bar-h` following 121 → 223/227
so the Tab walk parks 0/16 focusables under the strip (6/16 with the publisher blinded: the negative
control fires), painted AA both themes both engines (dd 5.16–6.07, kbd 3.53–4.36, open "i" 19.45/15.84),
PRM a cut (settle 7–59 ms). It also read the one number that goes against it: WebKit long frames per
open 8 (median, n=16) vs HEAD's 3 for the in-flow grow; its transform-slide alternative read 3 but was
PARTIAL (grounds not split, fade not riding, one 181 ms outlier). And it read a source fact Fable's
design needs and does not have: `HandDrawnOutline` re-bakes on every ResizeObserver callback
(`:54–60`), its frames are a `computed` over width/height (`:110–124`), so a drawn frame whose height
tweens regenerates its path every frame of the rung.

**Fable** ran nothing and said so. Its contributions that survive: the rAF trace of the strip's rising
edge as the M09 instrument (monotone, per-frame step bounded by the curve's prediction, settle ≤ rung +
2 frames, exactly 1 frame under reduce); the content-band floor (the scrollport gives up ~102–108 px
while the crib is open: 1280×800 608 → ≈502 in the foot arm, ≈441 in the sticky arm; 1280×720 528 →
≈422 / ≈361); the coarse-cell π census (390×844, 430×932, 1280×800 `hasTouch`: zero delta in the
strip's tags + computed paint properties, since the fold is `v-if="!mobile"` and the legend is
`display: none` there); the a11y 3.4 row restated for the move (`.keyboard-legend` `innerText`
non-empty in webkit while CLOSED; `aria-controls` resolves); the 200 rung read from `MOTION`
(`chromeLeaveMs` on main; MOT-LADDER's rung name when its publisher lands); the honest note that the
owner's sentence says "scroll" and both designs say "no scroll" (a ballot, §5).

## 2 · Refusals (a constraint forbids)

- **Fable's ONE lid around crib + verbs.** `HandDrawnOutline` re-bakes on resize; a frame that grows by
  ~102 px over 200 ms regenerates `generateRectBoilFrames` ~12 times × `frameCount` poses, in an
  animation whose WebKit long-frame rate is already the open red (8 vs 3). Its grain is sampled by arc
  length from the top-left corner, so the right, bottom and left sides CRAWL for the length of the rung:
  a beat on a `:pose="0"` frame, against law 37's "one static path per frame, no beat". Holding the
  closed path during the tween and re-baking at settle would show the verbs' frame under a crib rising
  above it and then SNAP to the big frame: a discontinuity, M09's forbidden shape. A morphing `d` is a
  new mechanic the mark does not demand. Refused. **The edge (M18, TAPE/RULE's row) frames the
  fixed-height verbs row; the crib rises above the edge on the strip's own paper.** Gate: the edge's
  path `d` byte-identical closed vs open (0 re-bakes on open).
- **Fable's scroll-after-settle fallback (§6).** Two clocks (the UA's smooth scroll 207–406 ms and the
  200 ms grow) under M09, and it strands the crib behind a B8 foot. Opus's form works in the sticky arm
  main has today, so nothing is left for a fallback to cover. Dead (it survives only as the alt arm of
  ballot 2, on the owner's word).
- **Fable's `grid minmax(0,1fr) auto` card and `#card-foot`.** Not G-INFO's to require: TAPE/RULE's B8
  form. The crib travels with the bar wherever the bar goes (it is the bar's first row); G-INFO binds
  no card grid.
- **A visible name over the crib.** Both lanes cut it (an eyebrow; a11y 3.4 needs exactly one node
  named "keyboard shortcuts", the `<dl>`). Not a ballot.
- **Opus's M1 (layout step + WAAPI transform slide, split grounds, fade via `pseudoElement`).** Not
  refused, DEFERRED: a new mechanism with an unbuilt picture and unverified WebKit `pseudoElement`
  support. M2 (the landed `grid-template-rows 0fr → 1fr` at 200 ms `--ease-drawOn`, moved not re-timed)
  is the prototype; the rate gate (G6) is READ on a quiet box with the HEAD control in the same run.
  If G6 is RED there, M1 is MOT-VERB's pass-5 escalation row on `useFlipGlide`, not a block on Row A.

## 3 · The apotheosis

**Press the "i" and the key crib unfolds out of the strip, directly above the "i" and the verbs,
on the strip's own paper. The panel does not scroll (scrollTop Δ 0 from the top and from the end),
the verbs and the "i" do not move (rect Δ 0.00), the scroll range grows by exactly what the crib
covers so everything under it stays reachable by wheel and by Tab, and closing plays the same clock
in reverse. PRM is a cut. The strip's drawn edge (M18) frames the verbs row, whose height never
changes; the crib rises above that edge. The "i"'s CSS ring dies with the edge's landing (one hand
per strip); its replacement form is the owner's ballot 1.**

Form, against main:

| piece | closed | opening | open |
|---|---|---|---|
| `#keys-fold .legend-fold` | first child of `.action-bar`, `grid-column: 1 / -1`, in flow, `grid-template-rows: 0fr`, `clip-path: inset(0)` (never `overflow: hidden` / `display: none`) | `0fr → 1fr`, `200ms var(--ease-drawOn)` verbatim from main; the bar grows UPWARD from its pinned bottom (sticky arm) or the foot grows and the scrollport shrinks (B8 arm); the bar's `::before` fade rides the crib's top edge for free (it is anchored at the bar's top) | `1fr`; `<dl>` two columns, gap `0.15rem 0.75rem`, margin-bottom `0.5rem` unchanged; `--action-bar-h` publisher follows (121 → 223/227) so `scroll-padding-bottom` still parks nothing under the strip |
| `.action-verbs` + "i" | row 2 of the bar; height 56.03 (1280) unchanged | rect Δ 0.00 every frame | unchanged |
| `toggleKeys()` | `keysOpen = !keysOpen` and nothing else | no `nextTick`, no `scrollIntoView` | — |
| the "i" | ballot 1 (default: a fifth `.icon-btn`, glyph "i" in `--font-hand` at `--icon-verb`, sublabel `keys`, hover note "what each key does"; the CSS ring and the `1fr auto` trailing track die) | — | `aria-expanded="true"`: glyph + sublabel `--color-foreground`, the house's seeded scribble underline under `keys` (a non-colour cue, 1.4.1) |
| coarse rail / dock / landscape <1024 | no "i", no crib (`v-if="!mobile"`, `(hover: hover) and (pointer: fine)` gates kept) | π identity: zero DOM + paint delta | — |
| PRM | `transition: none` verbatim | full height on the press frame | 1.000 visible |

Tokens: nothing new (`--color-card`, `--ink-press-quiet`, `--ink-press-rule`, `--color-muted-foreground`,
`--color-foreground`, `--type-caption`, `--icon-verb`, `--ease-drawOn`). Copy: `aria-label="what the
keys do"` unchanged; `keys` / "what each key does" are the only new strings (ballot 1's default arm),
`check-copy-register` bare. Filters: the crib and the underline mint none; 9/9. The 200 ms literal at
`:2291` moves with its rule in the prototype (a rung is not a licence to re-time); MOT-LADDER's charter
kills the literal when its publisher names the rung.

## 4 · The prototype brief (the smallest runnable build that proves it)

Fresh worktree off main `1e6cfbbf`. Two ports from the band the prototyper's prompt names (4250–4260):
the prototype tree and the HEAD control (main, read-only, `.mts` config outside the main tree, private
cacheDir, `--strictPort`, 127.0.0.1). Never touch 3000/3001 or 4230–4249. Kill by recorded PID before
returning. ≤2 workflows on the box while it runs (stall law); every Playwright chunk in
`run_in_background` writing a log, chunked by project, polled ~60 s.

BUILD (source, `web/frontend/src/games/shared/GameControlPanel.vue` + `src/pencil/chrome/KeyboardLegend.vue`):
1. Move the `<div v-if="!mobile" id="keys-fold" class="legend-fold">` block (:1219–1227) to be the
   FIRST child of `.action-bar` (:1245), before `.action-verbs`; add `.legend-fold { grid-column: 1 / -1 }`.
   Keep `:2287–2306` (`0fr`/`1fr`, `clip-path`, `200ms var(--ease-drawOn)`, PRM `none`) verbatim.
2. `toggleKeys()` (:148–156) = the flip alone. Delete the `nextTick → scrollIntoView` and rewrite
   :143–146 to say what is true (the crib opens inside the strip; nothing scrolls).
3. Ballot 1 default arm (Row B): the "i" becomes the fifth `.icon-btn` in `.action-verbs` (glyph "i",
   `--font-hand`, `--icon-verb`; sublabel `keys`; `SheetWashiLabel` note "what each key does", a seed
   apart from 23/43/37/71); the `.info-glyph` border/radius rules (:2328–2345) and the `1fr auto`
   trailing track die; open state = `--color-foreground` + the scribble underline (`scribbleUnderline.ts`).
   Keep the `(hover: hover) and (pointer: fine)` display gate and `v-if="!mobile"`.
   Ballot 1 alt arm (Fable's ring): a second commit or a query flag on the same tree that keeps the
   trailing track and replaces the CSS ring with `HandDrawnOutline :stroke-width="1.5" :outset="2"
   :radius="14" :pose="0"` on the 28 px glyph box. FRAME it at 2× both themes; do not measure further.
4. `KeyboardLegend.vue:63` comment: "inside the strip, above the verbs".
5. Do NOT build M18's edge, the slab widening, or `#card-foot` (TAPE/RULE's rows). Do NOT touch
   `scene.css:264`. Do NOT re-time or re-curve anything.

MEASURE (instrument: fork Opus's `opus-probe/probe.mjs` rAF sampler + `aa.mjs`; run the SAME script
against the control port for every row):
- Cells: chromium + webkit · 1280×800, 1024×768, 1440×900, 1280×720 fine · light (dark at 1280×800) ·
  scrolled to the top AND to the end · pointer click AND keyboard Enter · PRM at 1280×800. π-only
  cells: 1728×1117 fine; 1280×800 `hasTouch`; 390×844 and 430×932 `hasTouch` with the dock sheet
  SETTLED (poll the pose, ~700 ms).
- Per press: crib `<dl>` painted-visible fraction over 1.2 s (`paintedExtent` differencing, not rects);
  panel scrollTop before/after; `scrollIntoView` calls hooked; verbs + "i" rects per frame; the fold's
  top edge per frame (the trace); `--action-bar-h` computed; frames > 16.7 ms and > 25 ms per open,
  n ≥ 8 presses per engine, on the prototype AND the control in the same run; Tab walk over the card
  body with the crib open (focusables whose box enters the strip), with the publisher blinded as the
  negative control; card width + board-left vs the control; coarse cells: the strip's tag list +
  computed paint properties vs the control; painted AA at 2× both themes (dd, kbd strokes, "keys" at
  rest and open); the wells' outset flank ink beside the OPEN crib at the leak pose (a coupling
  number for TAPE/RULE, not a gate here); the content band (scrollport clientHeight − open bar height
  in the sticky arm) at every fine rung.
- Mechanical: `npm run lint:copy` (bare), a11y 3.4 (`e2e/a11y.spec.ts:475–514`) both engines, filter
  census on the served dist both engines, a source grep for `scrollIntoView` in `toggleKeys`.
- Evidence: numbers and text first; per-frame JSON summarised (min/median/max, the discontinuity if any),
  never banked whole. At most FOUR crops ≤150 KB, each naming engine · theme · viewport · pointer class:
  (1) chromium · light · 1280×800 · fine, open from the top, Row B; (2) webkit · dark · 1280×800 · fine,
  open from the end; (3) the ring alt arm at 2×, either engine, light, the strip only; (4) chromium ·
  light · 1024×768 · fine, open (Row B density).

SUCCESS = every born-RED gate in §5 GREEN on the prototype and its HEAD reading reproduced on the control.

## 5 · Gates (born RED on main unless marked; each names its reading at `1e6cfbbf`)

| # | gate | main | source |
|---|---|---|---|
| G1 | both engines, 1280×800 · 1024×768 · 1440×900 · 1280×720 fine, top + end, click + Enter: ≤ 700 ms after the press the crib `<dl>` painted-visible fraction ≥ 0.99 and its bottom ≥ 0 px above the verbs' row top | RED 0.001–0.004 | census; Opus 1.000 |
| G2 | no scroll: panel scrollTop Δ = 0.00 ± 0.5 from the top and from the end; `scrollIntoView` calls per press = 0 | RED +504…+615, 1 call | census; Opus |
| G3 | one clock: verbs + "i" rect Δ ≤ 0.5 px on every frame; the fold's top-edge trace monotone, max per-frame step ≤ 1.35× the drawOn prediction, settle ≤ 200 ms + 2 frames; PRM settles in 1 frame with 0 intermediate heights | control (0.00–0.36); trace n/a | Fable's instrument; Opus's rect row |
| G4 | π vs the HEAD control: card width and board-left ± 0.01 at every fine rung incl. 1024×768 and 1728×1117; coarse cells (1280×800 `hasTouch`, 390×844, 430×932 settled): strip tag list + computed paint properties zero delta; bar height 64.81 / 66.77 unchanged | control; 1024/1728/coarse UNMEASURED by Opus | both |
| G5 | reachability: Tab walk with the crib open, 0 focusables whose box enters the strip; `scroll-padding-bottom` = published strip height ± 1; negative control (publisher blinded) ≥ 1 | control 0/16; ablation 6/16 | Opus |
| G6 | rate: WebKit frames > 16.7 ms per open ≤ the control's median + 1 over n ≥ 8 presses, same box, same run; the leading edge monotone | control 3; **Opus read 8 (RED)** | Opus; re-read required |
| G7 | source: no `scrollIntoView` in `toggleKeys`; `#keys-fold` a child of `.action-bar`; comment :143–146 rewritten | RED | both |
| G8 | one hand: computed `border-*-width` 0 on every `.action-bar` descendant except `kbd` (named exemption: a keycap is a glyph box, not chrome; the chair may overrule) | RED 1.5 px ring | both |
| G9 | a11y 3.4 (`a11y.spec.ts:475–514`) green both engines: exactly one node named /keyboard shortcuts/, k g h p d in `innerText` while CLOSED; `aria-controls` resolves | control | Fable's restatement |
| G10 | painted AA at 2× both themes both engines: dd ≥ 4.5, kbd strokes ≥ 3.0, `keys` ≥ 4.5 at rest and open | unread on main | Opus's instrument |
| G11 | filter census 9/9 on the served dist both engines | control | law |
| G12 | `check-copy-register` bare exit 0 with `keys` / "what each key does" | n/a | law |
| G13 | content band with the crib open ≥ 400 px at 1280×800, 1024×768, 1440×900 fine (sticky arm: scrollport clientHeight − open bar height); 1280×720 REPORTED (arithmetic ≈ 361 sticky / ≈ 422 foot) | form absent | Fable's floor, re-scoped |
| G14 | Row B density: min gap between verb boxes ≥ 4 px at 1024×768 fine; no hover note overlaps a verb box | control 10.4 px; arithmetic 4.93 | Opus, unmeasured |
| G15 | coupling (TAPE/RULE's gate, read here as a number): M18's edge path `d` byte-identical closed vs open; wells' outset flank ink beside the open crib reported | n/a (no edge) | Opus Row C |

## 6 · Owning families (pass-5 charter rows)

- **CTRL-FACE (§10 leader, 79):** Row A (the placement, deletions 1–2 and 4 of §4, the `toggleKeys`
  flip), the e2e spec carrying G1/G2/G3/G5/G7/G9 both engines with the publisher-blinded negative
  control (a NEW file: main's e2e has no row touching `.info-btn` / `#keys-fold`), G10, G12, G13, and
  ballot 1's default arm (Row B) with G8/G14.
- **CTRL-TAPE / CTRL-RULE (B8's default carriers, M18's edge):** the fold travels with the bar into
  `#card-foot`; G1–G5 re-read in the foot arm; the edge frames the fixed-height verbs row (G15's `d`
  stillness); the slab covers the wells' 4 px outset along the crib's flanks, landed with or before Row A
  (the leak is 2.6× taller beside an open crib, Opus crop c1); §6.1's inset below the verbs; the
  `scene.css:264` `var(--action-bar-h, 0px)` fallback is their registration-block row.
- **MOT-VERB / MOT-LADDER (§13):** the rung's home (`MOTION.chromeLeaveMs` = 200 on main; the literal at
  `:2291` dies when LADDER's publisher names it; no re-time, no re-curve); the G3 trace as the section's
  M09 instrument for this site; G6's re-read; if G6 is RED on a quiet box, M1 (one layout step + a
  `useFlipGlide` transform slide with split grounds and a riding fade) is MOT-VERB's escalation row.
- **MRK-ABS:** G-ABS-3's `.info-btn` dark row (2.92) loses its subject when the ring dies; its
  replacement reads the open "i" painted (Opus: 15.84 dark).
- **Chair:** whether law 37 reaches the 7 `kbd` caps (G8's exemption); the order of TAPE/RULE's
  slab-cover row relative to Row A.

## 7 · Ballots (the owner's, at the re-look; both arms framed by the prototype)

1. **The "i" once its ring dies.** (a) DEFAULT: a fifth verb in the strip's own grammar (glyph "i" in
   the hand at `--icon-verb`, sublabel `keys`, scribble underline when open; the trailing track dies;
   costs density, G14). (b) The "i" keeps its trailing track and wears a DRAWN 28 px ring
   (`HandDrawnOutline` stroke 1.5 / outset 2 / radius 14 / pose 0; two drawn hands in one strip once
   M18's edge lands; unseen at 2× until the prototype frames it).
2. **"Scroll" vs "no scroll".** The owner's word is "scroll". (a) DEFAULT: no scroll; the crib arrives
   where the "i" is (G2 Δ 0). (b) The literal reading: the crib stays in the scroll body and the panel
   scrolls to its SETTLED height (the census's counterfactual c3: 1.000 visible, 8 px above the bar;
   two clocks under M09; strands the crib behind a B8 foot). (b) is booked only on the owner's word.

## 8 · Gaps (this adjudication's own)

- Opus's readings came from a DOM move in a Playwright page on main, not a source build; the prototype
  is the first source build. Its numbers are the expected values, not proof.
- G6's 8-vs-3 was read headless during the pass-4 lanes' load; the re-read must be on a quiet box with
  the control in the same run, or it decides nothing.
- 1024×768, 1728×1117 and every coarse cell are unmeasured for π; Row B's density is arithmetic.
- No dist/preview read; no real Safari or iOS (M19).
- The content-band floor at 1280×720 is a reported number, not a threshold; the owner sees it.
- The B8 foot arm is unbuilt anywhere on main; G1–G5 in that arm are TAPE/RULE's re-read.
