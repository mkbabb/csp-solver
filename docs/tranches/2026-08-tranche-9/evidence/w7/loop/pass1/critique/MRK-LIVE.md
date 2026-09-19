# PASS-1 CRITIQUE · MRK-LIVE · The living mark

Adversarial read by a lane that wrote neither the spec nor the prototype. Everything below was
either recomputed from the token bytes or re-measured on the prototype's own source, served from
its worktree on `127.0.0.1:4240`, in **both engines**.

- Diff read: `git -C .claude/worktrees/wf_e58b4764-0fc-44 diff` (16 files, +279/−88) plus the
  untracked `src/pencil/chrome/FocusRing.vue` (222 lines), read whole.
- My probes: `critique/MRK-LIVE/probe/` · my logs: `critique/MRK-LIVE/logs/`.
- Frames looked at: all ten of the prototype's crops.

**Convergence: 72.** It runs, both engines, and seven born-RED gates are green. It also ships a
regression on three tiers its own §5 declares STILL, and three of its gates pass only by being
re-read after the fact.

**Verdict: ADVANCE.** No missing primitive, no violated house constraint. The one real defect is
a selector scope, closable in a line.

---

## 1 · What I re-measured myself

| what | my result | agrees? |
|---|---|---|
| G-LIVE-3, one ring owner (chromium, 16 consecutive tab stops) | exactly one `.focus-ring`, `errPx` **0.00** at every stop, every stop's own `outline-style` `none`; `.cell-native-input` carries no ring (the declared exemption) | yes |
| G-LIVE-2, the revolution (both engines) | 4 swaps, final pose 0, **0** swaps after 700ms. Chromium 116/238/366/491ms; WebKit 40/175/290/430ms | yes, with §2.2 |
| G-LIVE-5, painted contrast, recomputed from the token and the sampled ground bytes | #3a7bc4 → **4.290** on light card (253,253,252), **4.19** on light page, **4.285** on dark card (19,18,17), **4.378** on dark page (17,15,14) | yes, to 2 dp |
| R6 hue census (`hue-census.mjs`, run against the worktree) | byte-identical to `hue-census-HEAD.txt` | yes |
| M16 (`check-copy-register.mjs`) | 0 em dashes, 0 unadmitted jargon, the 2 standing admissions unchanged | yes |
| motion contract / theme tokens | 34 specs 34 declaring; 0 unreferenced `@theme` tokens | yes |
| **the cascade's reach at poses 1–3** | **the conflict ring, the peer cursor and the hover ring all compute `opacity: 0`**, both engines | **no — see §2.1** |

`logs/D-deckstops-*.json`, `logs/C-revolution-*.json`, `logs/A-cascade-*.json`,
`logs/cascade-reach-*.json`, `logs/B2-rebake-*.json`.

---

## 2 · The open gaps

### 2.1 The living mark turns off every other mark on the board · CONFIRMED, both engines

`data-mark-pose` is written on the **grid** (`GameBoard.vue:1045`), and `gameCell.css`'s swap
rules hang off it as descendant selectors:

```css
[data-mark-pose="1"] .cell-ghost-path:nth-of-type(1) { opacity: 0 }   /* …2, …3 alike */
```

Every cell that is not living has exactly one ghost path, and that path is `nth-of-type(1)`. So
at poses 1, 2 and 3 the rule reaches it too. Measured on the real prototype board, cell 40
focused, both engines (`logs/A-cascade-*.json`):

| tier | ink | pose 0 | poses 1–3 |
|---|---|---|---|
| 3 conflict (`.is-invalid`) | `rgb(232,49,91)` | 1 | **0** |
| 4 peer cursor (`.is-peer-cursor`) | `rgb(37,99,235)` | 1 | **0** |
| 1 hover (`.cell-ghost.is-active`) | `rgb(38,38,38)` | 1 | **0** |

The wrapper stays at 1 in every row, so this is the path itself going out, not the ghost gate.
§5's tier table says conflict, peer cursor and hover are **still**. What ships is: for three of
every four beats, for the 500ms after each landing and *continuously while a reader holds an
arrow key*, every teacher-red conflict ring and every peer's pencil on the board strobes at 8Hz.

The crops could not show it: they frame the living cell alone, at poses 0 and 2. No estate spec
asserts a non-owning cell's ghost, so 472 green says nothing about it either.

**Closable by:** scoping the swap to the cell that is living (write the pose on the living cell,
or gate the rules behind `.game-cell:has(input:focus-visible)`), plus one gate that samples a
conflicting cell's `.cell-ghost-path` opacity at each of the four poses.

### 2.2 The revolution starts inside the draw-on, at an arbitrary phase

§5 and the tier table both say "ghost-draw-on 180ms **then** one revolution". The pose rides the
free-running shared beat, so the first step lands wherever the beat happens to be: I measured
**40ms** (WebKit) and **116ms** (chromium); the prototype measured 48 and 64. All four are inside
the 180ms draw-on, and the visible revolution is 375–500ms long depending on phase. Either the
sentence changes, or the pose aligns to the landing.

### 2.3 The spec's own settle arithmetic is wrong, and the gate cannot tell

§5 predicts "markSettleBeats 4 → ~6 swaps, last ~618ms". What ships is 4 swaps, last ~430–491ms.
G-LIVE-2's floor ("≥4 swaps within 700ms") admits both, so the gate cannot distinguish the design
that was specified from the design that was built. One of the two numbers is wrong and neither
the prototype's deltas nor its gaps names the divergence.

### 2.4 Two of the six deleted rings have no stop in any walk

`.staging-btn .staging-face` and `.guard-btn .guard-face` lost their bespoke rings at source.
Neither appears in `ring-owner-{chromium,webkit}.json` (13 / 7 stops) nor in my own 16-stop walk:
both live in gallery and armed-ribbon states the walk never enters (`present: {stagingBtns: 0,
guardBtns: 0}` from `/`). G-LIVE-3's "≥7 tab stops" does not require them. Nothing yet shows the
drawn ring lands on the two controls whose rings this family deleted.

### 2.5 The deck's fallback is a masked one: no activedescendant, no indicator at all

`FocusRing.fromDocument()` takes the `aria-activedescendant` target when the attribute is there.
When it is absent or stale, the fallback is `take(activeElement)` — the scrollport — which is in
`EXEMPT`, so `el` becomes `null` and no ring is drawn. The UA outline is already suppressed in
`@layer base`, `.gallery-viewport`'s own `outline: none` stays by ruling, and `GameCard`'s rule is
deleted. A deck holding keyboard focus before its first activedescendant is written has **zero**
focus indicator. Closable with a gate that focuses the scrollport with the attribute removed.

### 2.6 G-LIVE-5 never measured the one stop the ring does not own

The four contrast rows are `.ctrl-btn`, `.logo-trigger`, `.drawer-tab`, `.sun-moon-toggle`. The
board cell — the drawn ring's declared exemption, and the stop where this ink is *not* a 2.5px
full-opacity stroke but stroke-opacity 0.9 over an 0.08 fill — is absent. The only figure the
estate has for it is the pre-existing comment's light-mode 3.60:1; there is no dark arm measured
anywhere. "One mark for focus, ≥3:1 everywhere" is asserted at the one place the mark changes
form.

### 2.7 The instrument that would catch an undeclared pixel was excluded from the run

`probe/estate.config.ts` `testIgnore`s `visual-golden`, `filter-census`, `wordmark-integrity`,
`theme-bake-freshness`, `theme-quadrants` and `throttled-void`. Those are dist-bound by the golden
discipline, so excluding them from a dev-server run is correct — but the return says "the whole
default e2e suite 472 passed / 0 failed", and the two specs that would have caught a pi drift or a
filter-census move are exactly the two that did not run. The sentence needs the exclusion in it,
and pi needs a dist run before this folds.

### 2.8 Three gates pass only by being re-read

- G-LIVE-3: "exactly one `.focus-ring` visible" — at `.cell-native-input` there are zero.
- G-LIVE-6: "every stop computes `outline-style: solid`" — 11 of 12 (`allSolid: false` in the
  lane's own `ring-forcedcolors.json`).
- G-LIVE-1: "σ_t inside the grid's own σ_t band" — the mark and the band come from the same
  generator at the same `cellBoil`, so short of passing a wrong scalar the gate cannot go red.

Each exemption is defensible; none is written into the gate's own sentence, which is what makes
the gate able to fail next time.

### 2.9 Two focus suppressions survive the "six bespoke rules die" census

`.gallery-guard:focus { outline: none }` (the lane names it) and **`index.css:766
.sudoku-cell:focus-within { outline: 1px solid color-mix(in srgb, var(--color-ring) 30%,
transparent) }`**, which nobody names. The second is a seventh focus-on-outline rule; it sits
board-side, under the board's exemption, but it is not part of the one mark and it is not in the
census.

### 2.10 Carried forward from the lane's own gaps, unresolved

R6's **R1 row stays permanently red** because this family refutes its law with numbers rather
than satisfying it (one value, flattest of five, 4.19–4.38 on four grounds); the
`spoken-gallery.spec.ts` re-base is a **W3-owned instrument decision**, not a fix; the **rAF
burst** is the loop §6 refused, bounded rather than absent; the **WebKit phone trace** is not
clean on a loaded box; the **armed verb** is measured but undecided (U-10).

### 2.11 Minor, named for completeness

- The ring recomputes its four poses on every position change although the geometry depends only
  on width and height. Measured: a 40px pure translation writes **0** `d` attributes in both
  engines (`logs/B2-rebake-*.json`), so the cost is compute, never paint. Keying `frames` on w/h
  would make it free.
- `generateCellFrames` shares the cap-24 boil LRU with `cellRects` and the grid's `BoilFrames`.
  Twenty-four keyboard steps evict the grid's own entries; the next invalidation pays a full
  regeneration that used to be a hit.
- `HandDrawnOutline` prunes a posed instance to one node until its first pose change, so the
  armed verb permanently expands to four `will-change: opacity` siblings after the first arm.
  Three promoted layers, not a filter — outside the budget the probe counts.

---

## 3 · Strengths, earned

1. **It runs**, and the numbers survive an outsider's re-run: my 16-stop walk reproduces one ring
   at 0.00px on every stop, and my revolution trace reproduces 4 swaps to pose 0 with nothing
   after 700ms, both engines.
2. **The contrast ruling is arithmetic, not taste.** I recomputed the four ratios from the token
   and the sampled grounds and got 4.290 / 4.19 / 4.285 / 4.378. "One value, both themes, flattest
   of five" is the correct reading of those numbers, and it is worth more than the law it breaks.
3. **Pose 0 is `generateCellRects`' own output**, so the σ-over-space guard and the resting board
   are structurally unmoved rather than asserted unmoved. That is the right way to make a motion
   family safe.
4. **+3 paths, never +N².** The population is 19 / 84 / 259 at 4×4 / 9×9 / 16×16, and the swap is
   an attribute write rather than N² renders — the prop form was tried, measured, and abandoned on
   evidence.
5. **`useMarkPose` is one seven-line primitive with three consumers** (selection, chrome ring,
   armed verb) and inherits PRM whole from the library's beat clear.
6. **Target-taking by `aria-activedescendant`** beats the spec's provide/inject: it needed zero
   edits in `GameGallery`, it generalises to any such surface, and it makes the ring and the AX
   truth the same object by construction.
7. **The forced-colors block was measured into existence** — the `3px none` failure was found,
   root-caused to a scoped `:focus` pair beating a (0,1,0) restoration, and cured by deleting the
   pair. No `!important` anywhere in the result.
8. **Decided history holds where it can be checked**: hue census byte-identical, copy register
   0/0, motion contract 34/34, theme tokens 0 unreferenced, W2's mechanics untouched.
9. **The gap list is honest** — eight of them, including the one that reverses the spec's own
   refusal of rAF, and including the shared-scratchpad accident.

---

## 4 · Cross-pollination

- `useMarkPose(landed)` — the one-shot sibling of `useBeatFrame`. Any family that wants one
  revolution (MOT-VERB, PLR-PLACE's landings, NOTE-ERASE) should take it instead of minting a
  timer. Its `landed`-identity contract (a re-measure is not a landing) is the reusable part.
- **Taking the target from the accessibility tree.** Reading `aria-activedescendant` with a
  MutationObserver, rather than asking each surface to hand over a ref, is the general answer for
  anything that must paint on the AX-named owner.
- **Register a custom property you intend to read in JS.** An unregistered property carrying a
  `calc()` reaches `getComputedStyle` as an unresolved token stream and parses NaN; `@property
  { syntax: "<length>" }` also hands every non-declaring host the house default for free. PAL-*
  and CTRL-COST read tokens in JS.
- **"Pose 0 IS the shipped artifact, byte for byte"** as the way any motion family makes its
  still-frame guard structurally true. MRK-ABS and MOT-LADDER should adopt the phrasing and the
  test.
- **Painted-bytes contrast over four grounds × two themes** (`ring.probe.ts`) is the right shape
  for every accent family: it is what let this one refuse a dark arm on evidence.
- **The PRM negative control beside every perf trace** — the control failing in one sample is what
  made the WebKit long-frame reading readable instead of alarming.

---

## 5 · Housekeeping

- `critique/MRK-LIVE/node_modules` is a symlink into the prototype worktree's `node_modules`, made
  so the probes resolve `@playwright/test` from `docs/`. Delete it or recreate it as needed.
- My dev server ran on `127.0.0.1:4240` against the prototype worktree. The whole 4230–4249 band
  was held by concurrent lanes for most of this pass; `4238` is now a *different* family's server,
  so the prototype's restart instruction needs a port re-check before anyone believes what it
  serves.
- Evidence added here: 8 small JSON logs and 3 probe files. No frames, no crops, nothing near the
  wave's cap.
