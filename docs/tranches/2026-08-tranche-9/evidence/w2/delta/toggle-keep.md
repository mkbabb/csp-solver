# T9-W2 §2.4 — THE CELESTIAL'S KEEP: what the cure measured

The lane's record. Cure = `src/App.vue` + `src/pencil/celestial/DarkModeToggle.vue`, nothing
else. Design `../design/chosen-toggle-geometry.md`, ruling `../design/adjudication.md`.

RE-VERIFIED WHOLE 2026-08-28 after the session wall. Nothing in the cure moved; every number
below was re-measured against a fresh build of the working tree rather than carried forward, and
every figure the pre-wall pass banked came back identical.

## the artifacts

| | |
|---|---|
| HEAD | `4dd9ec9c` built to `web/frontend/dist-w2-before` (`index-DqFso1p1WUm8.js`), served 127.0.0.1:4244 |
| CURED | the working tree, rebuilt to `web/frontend/dist-w2-after` (`index-bbDpInn4isHj.js`), served 127.0.0.1:4243 |
| engines | chromium + webkit, every row in both |

Both are built dists behind `vite preview`, never the dev server, and both previews sit in the
lane's 4230-4260 band bound to 127.0.0.1. The HEAD artifact is provably pre-keep rather than
merely older: `--toggle-hit` appears in no stylesheet it ships.

## 1 · the row of record

`e2e/viewport-law.spec.ts:287` §2.4, unedited, against the cured dist — run bare, exit read
directly:

```
[W2-§2.4] toggle=[863.8,59.8,112.3,112.3] overlaps=[] thefts=[]
  ✓ [chromium]  ✓ [webkit]      2 passed        exit 0
```

RED against the HEAD dist in the same run shape, exit 1, `toggle=[807.7,3.7,224.6,224.6]` with
one overlap and one confirmed theft — the "4×4" button, `hit: BUTTON.sun-moon-toggle`, theme
flipped. That is `born-red-head.txt`'s row reproduced number for number, both engines.

The box reads 112.3 rather than 104 because the row's positive control leaves the pointer on the
toggle and `:hover` scales it 1.08 — 104 × 1.08, centred where the art has always been. The
census empties because the keep's bottom is 172.2 and the "4×4" button's top is 210.3.

The row is also green inside the full default suite (413 passed / 22 failed; every red belongs to
another lane's §2.2/§2.5/§2.6/§2.7 born-RED row, to the M17 seam this lane hands off in §6, or to
the multiplayer intermittents in §8).

## 2 · the lune-click census (the design's own instrument)

Every interactive element intersecting the frame, sampled at 2 CSS px. 1024×768, sudoku.

| | chromium HEAD | webkit HEAD | chromium CURED | webkit CURED |
|---|---|---|---|---|
| "4×4" flip (the circle) | 165 | 170 | **0** | **0** |
| "4×4" lune (the frame) | 230 | 225 | **0** | **0** |
| "4×4" own | 0 of 395 | 0 of 395 | **394 of 395** | **394 of 395** |

The one remaining point of 395 falls to a neighbouring box on the shared edge, not to the
celestial: the toggle and its frame own nothing.

The clicks, which are the sharp half. Both points sit inside the "4×4" button:

| point | HEAD | CURED |
|---|---|---|
| (920, 214) — inside the r=104 circle | `BUTTON.sun-moon-toggle`, theme FLIPS, 4×4 `aria-pressed="false"` | `BUTTON.ctrl-btn`, theme holds, 4×4 `aria-pressed="true"` |
| (844, 214) — a lune | `DIV.corner-right`, click swallowed, 4×4 `aria-pressed="false"` | `BUTTON.ctrl-btn`, theme holds, 4×4 `aria-pressed="true"` |

Identical in both engines.

THE FOUR CORNERS, 6px inside each corner of the frame. At HEAD all four land on
`DIV.corner-right` and are eaten. Under the keep each lands on whatever is under it:

| | NW (822,18) | NE (1018,18) | SW (822,214) | SE (1018,214) |
|---|---|---|---|---|
| HEAD | `DIV.corner-right` | `DIV.corner-right` | `DIV.corner-right` | `DIV.corner-right` |
| CURED | `H1.masthead` | `MAIN.main-content` | `BUTTON.ctrl-btn` | `MAIN.main-content` |

No corner moves the theme, and `aria-pressed` on the 4×4 button reports the truth throughout.
THE KEEP ITSELF STILL FIRES on both builds and in both engines — a cure that kills the control
is not a cure. The stances are read from the engine, not from the source:
`.corner-right` computes `pointer-events: none` and `.sun-moon-toggle` computes `auto`, in
chromium and webkit, and both read `auto` at HEAD.

## 3 · π — the ink does not move

The ornament's rect (`.toggle-rest.rest-sun`, `.rest-moon`, `svg.toggle-sun`, `.corner-right`),
HEAD == CURED at every rung, both engines — compared field by field, all four boxes, no
tolerance spent:

```
1024×768 [816,12,208,208]   1280×800 [1072,12,208,208]   1440×900 [1232,12,208,208]
 768×1024 [688,12,80,80]      844×390 [764,12,80,80]
 390×844 [326,0,64,64]        375×667 [311,0,64,64]
```

The button alone changes, and it is derived at every rung: 208 → 104, 80 → 44, 64 → 44 —
`border-radius` 50%, concentric with the art to 0.00px in both axes, never wider than it, never
under the 44px floor. `--toggle-hit` computes as `max(2.75rem, 13rem / 2)` on the desk, so the
floor and the half are both visible in the computed value rather than baked into a number.

AT INK LEVEL, not just at box level. The corner crops at 1024×768 (the frame's box, inflated 8px,
PRM-frozen, taken after all eight pose bitmaps resolve) are BYTE-IDENTICAL:

| crop | md5 |
|---|---|
| `pi-celestial-1024x768-{head,cured}-chromium.png` | `667859e2` both |
| `pi-celestial-1024x768-{head,cured}-webkit.png` | `5c407642` both |

GOLDENS 4/4 unmoved against the cured dist (`npm run test:golden`, exit 0), no re-baseline, no
bytes touched — `e2e/goldens/` is clean in the tree. The crest golden crops 72×72 from the
button's CENTRE, and that centre is [1176,116] before and after.

FILTER CENSUS unmoved: `filter-census` G3.1/G3.2/G3.3/G3.5 exact-match green in both engines
against the built dist (12 passed, exit 0), so the budget of 9 is intact. `filterBudget.ts:150`
still names `button.sun-moon-toggle svg.toggle-icon`, still two live bodies, still inside the
same button.

## 4 · the bake — the adjudication's binding risk, discharged

`useElementSize` moved off the button and onto `.toggle-rest.rest-sun`, whose box IS the pose
bitmaps' box. Measured at the golden's own cell (1280×800, DPR2, `reducedMotion: reduce`), all
eight bitmaps:

| | count | natural | CSS | `.rest-sun` box |
|---|---|---|---|---|
| HEAD | 8 | 416 | 208 | 208 |
| CURED | 8 | 416 | 208 | 208 |

Both engines. The half-resolution celestial the ruling warned about does not happen, and
`theme-bake-freshness` + `wordmark-integrity` (26 rows, exit 0) and `theme-quadrants` (28 rows,
exit 0) are green besides.

## 5 · the focus ring — a defect found, and cured inside the lane

The design's risk 4 expected the ring to shrink with the control and read as better a11y.
MEASURED, it read as no ring at all: at `outline-offset: 2px` the ring lands inside the art,
the rest stack is an absolutely-positioned descendant, and it paints over the button's outline.
The focused crop came back byte-identical to the unfocused one in chromium — an affordance
nobody can see.

The offset gives the bleed back — `calc(2px - var(--toggle-bleed))` — so the ring sits one
ornament-edge out, where it has always sat. Derived at every rung, and measured live at 1024×768
with `:focus-visible` genuinely armed by a Tab walk:

| | keep | outline-offset | ring box | focused crop |
|---|---|---|---|---|
| HEAD | 208 | 2px | 212 | `d33cf55b` |
| CURED | 104 | 54px | 212 | `d33cf55b` |

Chromium; the arithmetic repeats at the other rungs (44 + 2×20 = 84 = 80 + 4, and
44 + 2×12 = 68 = 64 + 4). WebKit's Tab walk reaches no button at all under Playwright — macOS
full keyboard access is off, so neither build arms `:focus-visible` and both crops are the rest
crop, identical. `focus-ring-1024x768-{head,cured}-{chromium,webkit}.png` bank all four.

This lane declares NO delta: nothing a reader can see has moved, focused or at rest.

## 6 · what this lane owes elsewhere

`e2e/masthead-alignment.spec.ts:35` boxes `.corner-right button`. That selector named the ink and
now names the CONTROL, so M17 reads 52 on the desk and reds a line that has not moved. MEASURED
against the cured dist: `head rule at 1280` expected < 0.5, received 52 — both themes, both
engines, four reds.

The seam is one word — `.corner-right` — and it is PROVED, not asserted. A scratch copy of the
spec with that single edit, run against the same cured preview, is 12/12 green in both engines,
and the file's own `SUPERSEDED_HEAD` control still bites inside the passing row (it is asserted
in the same test body). The spec is outside this lane's fence; the edit is the chair's to land.

## 7 · behaviour that changed, named rather than hidden

- The four lunes fall through to `.page-root`'s `closeAll` instead of being swallowed by
  `@click.stop`. That is the correct behaviour and no spec asserted the swallow. A click on the
  celestial itself still stops there: `@click.stop` rides the button's own bubbling click.
- The mobile keep is 44px where the ornament is 80 or 64. It is the floor, not a choice — half
  of those rungs is 40 and 32. `--tap-floor` is a token, so W7's M01 scale raises it once and
  the celestial grows with the toolbar instead of being its exception.

## 8 · reds this lane looked at and does not own

`multiplayer.spec.ts` "a deal is an epoch" and "undo skips a cell a peer has taken" go red
intermittently under load. The mechanism is peer propagation, not the celestial: the failure is
at `:328`, where B writes a digit and A never receives it, BEFORE any deal is clicked. Repeated
three times per row under one worker, the HEAD dist reds them exactly as the cured dist does
(epoch 3/3 red on both builds). Pre-existing, load-dependent, and outside this fence.

## 9 · the gates this lane ran

| gate | result |
|---|---|
| `viewport-law.spec.ts` §2.4, cured dist, both engines | 2 passed, exit 0 |
| `viewport-law.spec.ts` §2.4, HEAD dist, both engines | 2 failed, exit 1 (the instrument bites) |
| `npm run test:golden` against the cured dist | 4 passed, exit 0 — no re-baseline |
| `filter-census` chromium + webkit | 12 passed, exit 0 |
| `theme-bake-freshness` + `wordmark-integrity` | 26 passed, exit 0 |
| `theme-quadrants` chromium + webkit | 28 passed, exit 0 |
| `mobile-platform` + `affordances` + `visual-regression` | 68 passed, exit 0 |
| `npx vitest run` | 57 Test Files, 735 tests, exit 0 |
| `npx vue-tsc --noEmit` | exit 0 |
