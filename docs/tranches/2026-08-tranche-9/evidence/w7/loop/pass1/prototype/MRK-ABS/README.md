# MRK-ABS · pass 1 (PROTOTYPE) — One visible hand, RUNNING

§5 the wobble law · §6 focus rings. The synthesis spec
(`../../synthesize/MRK-ABS.md`) was applied as a **~40-line product diff in a throwaway git
worktree** at `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-36`
(branch `worktree-wf_e58b4764-0fc-36`, **never committed**), served with
`npx vite --host 127.0.0.1 --port 4239 --strictPort` from that worktree's `web/frontend`, and
measured on that running surface in chromium + webkit at 1280×800, 393×699 dpr3, 390×844 dpr3
and 900×500 dpr2. The main tree's `src/` was never touched; only this evidence directory was
written there.

**Verdict: DEVELOP, with two adjustments and one measured cost.** Every born-RED gate flips
GREEN on the real surface in both engines; every guard the family had to keep held; the π check
is perfect (max |Δ| **0.000 px** over 757/872/856 numeric census leaves per cell, six cells).
Three of the spec's own predicted numbers are wrong — the ring÷grid row at all three sizes —
because the spec scored against r0's **single-sample** grid σ. Re-derived over n = 16/48/96
rules, the law still lands inside the band at every size, by a different margin than promised.

---

## 0 · The diff (10 files, +112 −27)

```
 src/assets/index.css                             | 60 ++++++++++++++---
 src/games/shared/DrawerTab.vue                   |  6 +--
 src/games/shared/gameCell.css                    |  7 +--
 src/pencil/celestial/DarkModeToggle.vue          |  4 +-
 src/pencil/chrome/GameGallery/GameCard.vue       |  8 ++-
 src/pencil/chrome/GameGallery/GameGallery.vue    |  4 +-
 src/pencil/chrome/GameGallery/StagingBand.vue    |  4 +-
 src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue |  7 +--
 src/pencil/config/pencilConfig.ts                | 24 ++++++++
 src/pencil/grid/gridPaths.ts                     | 15 ++++--
```

Exactly the spec's plan, in its order. What DIED: `gridPaths.ts:52`'s `boardSize >= 16 ? 2 : 4`;
`index.css:445`'s `@apply … outline-ring/50`; `HandwrittenLogo.vue:544`; `DrawerTab.vue:151`;
`gameCell.css:242-244`'s false modality comment; `index.css:219-222`'s false dark-mode comment.
What was BORN: two numbers in `DEFAULT_BOIL_CONFIG` (`ringSigmaUnits 1.75`, `ringK 0.3241`), the
`@layer base` focus block with its two named exemptions and its `forced-colors` arm, and one
alias line in `.dark`. Nothing new is mounted; no component gained a node; no rendered string
changed, so the woff2 subsets are untouched.

One line the spec did not name and the diff needed: `gridPaths.ts` now imports `BOIL_CONFIG` as a
**value** where it previously imported only the `GrainConfig` **type**. No new chunk (the grid
components already pull `pencilConfig`); build verified below.

---

## 1 · The gates, on the running surface

| gate | at HEAD | prototype, chromium | prototype, webkit | verdict |
|---|---|---|---|---|
| **G-ABS-1** ring σ ÷ grid σ ∈ [0.5, 2.0], same size, n ≥ 24 | 0.146 / 0.073 / 0.067 | **0.668 / 0.803 / 0.707** | identical to 3 dp | **GREEN** |
| **G-ABS-2** one σ_units constant per size, within 5% | k 0.318/0.323/0.227 (30% split) | σ_units **1.715 / 1.756 / 1.823** | identical | **GREEN as ±5% of target · AMBER as a spread (6.1%)** |
| **G-ABS-3** every tab stop's ring ≥ 3:1 from painted bytes | WebKit UA 1.78–2.15; logo 2.70; deck 2.70 | 4.19–4.33 light · 7.70–7.86 dark; board 3.68/6.53 | identical | **GREEN** |
| **G-ABS-4** one outline colour per theme; `outline-style: auto` nowhere | 5 colours, 6 UA stops | 107 stops, 26 painted, **1 colour**, **0 auto** | identical | **GREEN** |
| **G-ABS-5** `.dark` computes a different focus ink | absent | `#3a7bc4` → `#6aabeb` (= `--color-crayon-blue`) | identical | **GREEN** |

Guards that had to stay green, all green in both engines:

| guard | reading |
|---|---|
| clearance — no ring leaves its own cell (MA-C) | **0 / 16**, **0 / 81**, **0 / 256** at 1280×800 AND 393×699 |
| toggle ring painted > 0 px | 1820 / 1868 changed px (chromium / webkit), light; 1847 / 1861 dark |
| `spoken-gallery.spec.ts` §3.7 one owner + WHOLE | **16 / 16 passed**; scrollport `outline-style: none`; reach 5, air 9.6, **headroom 4.6**, WHOLE |
| budget 9/9/9 + ghost filter `none` + population | **9 / 9 / 9**; `.cell-ghost-path` filter `none`; **16 / 81 / 256** paths, peer washes 7/20/39 — unmoved |
| forced-colors outline solid | `2px solid …` at `outline-offset: -2px` survives (chromium; PW-WebKit has no forced-colors emulation — skipped, as at HEAD) |
| phone trace 0 frames > 33 ms | see §4 — chromium 0/0; **webkit is flaky at this n on this machine**, not regressed |

`logs/abs-wobble-*.json`, `logs/focus-proto-*.json`, `logs/focuslaw-*.json`,
`logs/darkarm-*.json`, `logs/deckring-token-*.json`, `logs/deckowner-*.json`,
`logs/budget-*.json`, `logs/forcedcolors-chromium.json`.

---

## 2 · §5 — the wobble, re-derived over every cell

`probe/abs-wobble.probe.ts` widens r0's R3-a from ONE ring to **every** ring on the board, takes
σ with r0's own instrument (33-sample `getPointAtLength` walk, RMS perpendicular residual, scaled
by the element's own svg px-per-unit) and scores each size against **that size's own** grid σ
measured with the same instrument over every `path.cell-line`.

### 1280×800, both engines identical to 3 dp

| board | n rings | ring σ px | σ in board units | n grid rules | grid σ px | **ring ÷ grid** | spec predicted |
|---|---|---|---|---|---|---|---|
| 4×4 | 16 | 0.543 | **1.715** (−2.0% of 1.75) | 16 | 0.813 | **0.668** | 0.54 |
| 9×9 | 81 | 0.859 | **1.756** (+0.3%) | 48 | 1.070 | **0.803** | 0.59 |
| 16×16 | 256 | 0.892 | **1.823** (+4.2%) | 96 | 1.262 | **0.707** | 1.36 |

Phone (393×699), same geometry at a smaller scale: ring σ 0.481 / 0.493 / 0.512 px against grid
0.721 / 0.614 / 0.725 — ratios **0.667 / 0.803 / 0.706**, i.e. the ratio row is viewport-invariant
to 3 dp, which is the whole point of stating the target in board units. σ_units is identical at
both viewports by construction.

**Where the spec's numbers moved, and why.** The spec's ratio column came from r0's per-size grid
σ table (1.031 / 1.443 / 0.631), which is **one sampled rule per board**. Over 16 / 48 / 96 rules
the same instrument reads **0.813 / 1.070 / 1.262**, and 16×16 turns out to be the board with the
*most* wander in its rules, not the least. So the predicted 0.54 / 0.59 / 1.36 ±0.1 is wrong at
all three sizes; the gate it serves (∈ [0.5, 2.0]) is green at all three with room on both sides.
r0's own single-sample figures are not wrong readings — they are n = 1 readings, and this is the
"n ≥ 24" the gate asked for.

**G-ABS-2, read two ways, because the gate's wording admits two.** Each size is within 5% of the
declared 1.75 (−2.0 / +0.3 / +4.2). The *spread between sizes* is (1.823 − 1.715) / 1.765 =
**6.1%**, over the 5% the gate names and over the 4.2% the synthesis predicted from the pure
library sweep. The two figures measure different windows: the synthesis fitted k over a whole
edge, this samples r0's own 0.02–0.22 window so that the ring and the grid are read by one
instrument. The residual is **monotone with board size** (smaller cells run hotter), so a refit of
`ringK` on r0's window — or a gate worded as ±5% of target — closes it. A per-size table is still
refused and still unnecessary.

**Dispersion the mean hides.** Per-cell σ_units CV is **0.32 / 0.33 / 0.34**; the extremes at
16×16 are 0.421 and 3.569 units (0.21–1.75 px). One cell's ring is not 1.75; the *hand* is.

### The eye — `frames/ring-9x9-1280-light-chromium.png`, `frames/ring-16x16-1280-light-chromium.png`

Said plainly, because the family asked to be killed by a crop:

- **9×9 reads as a hand-drawn square.** Four corners, four wandering edges, obviously drawn, and
  it sits inside its cell with the grid rule visibly outside it. This is the claim delivered.
- **16×16 reads as a soft lozenge.** The corners are gone — at 39.75 px of cell the 7-unit stroke
  is ~3.4 px wide with `stroke-linejoin: round`, so the wander rounds the corners off before it
  bows the sides. It is unmistakably hand-made and it is no longer a *square*. It is better than
  HEAD's CAD rect and worse than 9×9, exactly as pass-1 research predicted for the floor rung.
- The dark phone crop (`frames/ring-9x9-phone-dark-webkit.png`) shows the dark arm on the board:
  the ring is `#6aabeb` at 6.53:1 on the dark card, and it reads as the same hand at 0.49 px σ.

### Clearance — green, and thin at 16×16

`probe/abs-wobble.probe.ts` MA-C, from the DOM (geometry bbox + half the tier-2 stroke against the
cell's own margin, `cellPx × 0.15/1.3`):

| board | margin px | min headroom px, desktop | min headroom px, phone | crossing |
|---|---|---|---|---|
| 4×4 | 11.885 | 9.071 | 8.036 | 0 / 16 |
| 9×9 | 8.153 | 3.809 | 2.186 | 0 / 81 |
| **16×16** | 4.587 | **0.233** | **0.134** | **0 / 256** |

The guard holds at every cell at both viewports in both engines, with **0.23 px** to spare at the
tightest rung. That is real headroom, not a rounding artefact, but there is no room in it for a
heavier stroke, a sixth segment, or a larger target.

### The price of the pinned segment count — `logs/dbytes-*.json`

Resident ghost `d` bytes, read off the running DOM: 4×4 **6,664 B** (417 B/cell), 9×9 **49,864 B**
(616 B/cell), 16×16 **114,263 B** (446 B/cell), 17 nodes per path at every size. The synthesis
priced 16×16 at 114 KB; measured, 111.6 KiB. Generated once per deal into the existing
`cellRects` LRU; the cache key did not change.

### Modality — `logs/click-*.json`, `logs/phone-*.json`

A mouse click, a click with the pointer moved away, an arrow key and a phone tap all paint tier 2
(`rgb(58,123,196)`, 7 px, 0.9) in both engines, exactly as at HEAD. The comment now says so. No
behaviour changed; one false sentence died.

### The wash — `logs/wash-*.json`

Unchanged and unspendable: **1.08:1** light, **1.10:1** dark against the neighbouring cell, both
engines. The spec's concession is the right call, and r0's R3-a fails ONLY on its wash clause
(see §5).

---

## 3 · §6 — the focus law, from painted bytes

`probe/token-ring.probe.ts` (r0's ratio method: the pixel that moved furthest inside the ring's own
annulus, scored against that same pixel before focus).

| subject | indicator | light chromium | light webkit | dark chromium | dark webkit |
|---|---|---|---|---|---|
| `.ctrl-btn` | token | **4.29** | 4.29 | **7.70** | 7.70 |
| `.icon-btn` | token | 4.29 | 4.29 | 7.70 | 7.70 |
| `.drawer-tab` | token (rule deleted) | 4.19 | 4.19 | 7.86 | 7.86 |
| `.logo-trigger` | token (rule deleted) | **4.19** (was 2.70) | 4.19 | 7.86 | 7.86 |
| `.sun-moon-toggle` | token ink, 54 px ornament offset | 4.33 | 4.33 | 7.86 | 7.86 |
| `.attribution-trigger` | token | 4.19 | 4.19 | 7.86 | 7.86 |
| `.game-card.is-center` | token pair | **4.19** (was 2.70), reach 5, headroom 4.6 | same | — | — |
| `.game-cell` | house hand | 3.68 | 3.69 | **6.53** (was 3.76) | 6.53 |

The UA default is gone from the whole tab order: `outline-style: auto` = **0** at 107 stops in
both engines and both themes. The 26 painted stops all compute ONE colour — `rgb(58,123,196)`
light, `rgb(106,171,235)` dark. The 81 unpainted stops are the cell inputs, which is the exemption.

**Two honest caveats on the table.**
1. `.info-btn`'s row reads 17.78 / 14.31 because the washi tooltip a focused icon button reveals
   lands inside the annulus and moves more pixels than the ring does. Its *outline* computes the
   token like every other stop; the ratio in that row describes a tooltip.
2. `masthead-link` (`footer a, header a`) returned **0 found** on the board route in both engines,
   at HEAD and here. The masthead's links were never in this probe's reach and remain unmeasured
   from painted bytes. Their computed outline IS in the 107-stop census (one colour, no `auto`).

### The deck — `logs/deckring-token-*.json`, `logs/deckowner-*.json`

`.gallery-viewport` computes `outline-style: none`; exactly **one** `.game-card` carries a ring;
the active card's ring is `2px solid rgb(58,123,196)` at `outline-offset: 3px`, reach **5 px**
against air `[9.6, 713.6, 24, 24]`, **headroom 4.6 px**, WHOLE, in both engines. The token spends
less air than the 4 px offset it replaces. `e2e/spoken-gallery.spec.ts` is **16/16** on this tree.

### The estate's own floors — run on a scratch config, both engines

`e2e/access.spec.ts` 2.1 / 2.2 / 2.3 and `e2e/a11y.spec.ts` 3.1–3.6 (including **3.5**, zero
unnamed image nodes on a dealt board): **42 / 42 passed**. Config:
`web/frontend/pw-mrkabs-scratch.config.ts` in the worktree (untracked; a copy of the estate's
default minus `webServer` and `globalSetup`, pointed at 127.0.0.1:4239).

### The specificity trap, cleared by construction

The spec's `@layer base` authoring at (0,1,0) does what it promised: the toggle's own
`.sun-moon-toggle:focus-visible` still wins, keeps its 54 px ornament offset, and paints
**1820–1868 changed pixels** in both engines and both themes. The `:is()/:not()` sweep that buried
it to zero was never written.

---

## 4 · Motion, and the one thing the spec got wrong about it

The spec says outlines "appear same-frame, PRM identical". **They do not, on the controls.**
Tailwind v4's `transition-colors` property list includes `outline-color`, and
`GameControlPanel.vue:190` puts `transition-colors duration-250` on the control buttons. Measured
(`logs/focuslaw-*.json`): a same-frame census of the tab order reads **4 distinct outline colours**
(the ring fading up from each button's own `currentColor`); the same census after a 400 ms settle
reads **1**. Nothing *moves*, no keyframe was added, and the end state is the law — but the token's
colour takes ~250 ms to arrive on every `.ctrl-btn`, and that is a motion fact the spec should
either declare or kill (one line: `transition-property` on those buttons, or
`transition: outline-color 0s`).

Frames, `probe/wash-forced-frames.probe.ts` MA-6 (9×9) and `probe/cost.probe.ts` MA-E (16×16), at
393×699 dpr3 with 24 arrow presses:

| arm | chromium | webkit |
|---|---|---|
| 9×9 (MA-6) | median 8.3, p95 10.0, max 10.3, **0 > 33** | median 17.0, p95 19–26, max 27–48, **0 / 1 / 0 / 2 over four runs** |
| 16×16 (MA-E) | median 8.3, p95 10.0, max 10.3, **0 > 33** | median 17.0, p95 21.0, max 26.0, **0 > 33** |

The webkit 9×9 arm is **noise on this machine**, not a regression, and the reason is structural:
at 9×9 the ring's segment count was already 4, so the prototype's `d` strings there have the same
17 nodes as HEAD's — only the displacement scalar moved. Four consecutive runs gave 2 / 1 / 0 / 0
frames over 33 ms with medians 17 / 17 / 17 / 16 against HEAD's median 17.0. **Gap: no HEAD control
was taken with this probe at this n on this machine at this hour**, so "unchanged" here rests on
the mechanism plus four samples, not on a paired measurement. Pass 3 should run both arms
back-to-back against a HEAD server on the same box.

---

## 5 · The instruments re-run unchanged, and what they say now

| instrument | at HEAD | now |
|---|---|---|
| r0 `wobble.probe.ts` **R3-a** | ring σ 0.092 (7.9× below the floor); wash 0 | ring σ **0.755** vs floor 0.722 → `ringInBand: true`; **the test still fails, on its wash clause alone** (`washInBand: false`) |
| r0 `wobble.probe.ts` **R3-a2** | grid÷ring 7.5 (4×4) / 8.2 (16×16) | **2.08** / **0.82** |
| r0 `budget.probe.ts` **R3-h** | 9/9/9, filter `none`, 16/81/256 | identical, both engines |
| r0 `click.probe.ts` **R3-j** | tier 2 on click / click-no-hover / key | identical |
| r0 `mobile.probe.ts` **R3-i** | ring, wash, meter, note at 393×699 | identical; the phone ring now paints `rgb(106,171,235)` (the dark arm) |
| R6 `hue-census.mjs` | 29 token rows | **byte-identical** (`diff` exit 0) — the dark arm is an ALIAS, so it mints no hex row |
| R6 `law-probe.mjs` | 6 GREEN, 3 born-RED | **R1 flips RED → GREEN**; L1–L6 hold; R2 / R3 still RED (other families' work) |
| r0 R1 `census.spec.ts` + `chrome2.spec.ts` | the controls estate, 3 cells × 2 engines | **see §6** |

R3-a's ring half is cured and its wash half is unsatisfiable at 1.08:1 — which is precisely the
"wash clause struck" the spec asks for. **The spec must land that strike in the same commit**, or
the family ships a red instrument.

---

## 6 · The π check — every surface this family does not claim

`probe/pi-delta.mjs` pairs every leaf of r0's R1 controls census with this prototype's re-run of
the same instrument at the same three cells in both engines.

| cell | engine | numeric leaves paired | leaves added/removed | **max &#124;Δ&#124; px** | heading voices |
|---|---|---|---|---|---|
| 1280×800 | chromium | 757 | 0 / 0 | **0.000** | 8 → 8 |
| 1280×800 | webkit | 757 | 0 / 0 | **0.000** | 8 → 8 |
| 390×844 | chromium | 872 | 0 / 0 | **0.000** | 8 → 8 |
| 390×844 | webkit | 872 | 0 / 0 | **0.000** | 8 → 8 |
| 900×500 | chromium | 856 | 0 / 0 | **0.000** | 8 → 8 |
| 900×500 | webkit | 856 | 0 / 0 | **0.000** | 8 → 8 |

Per surface (`buttons`, `chrome`, `mobileTabs`, `optionGroups`, `acts`, `headings`) the maximum is
0.000 px in every cell. **Not one box moved.** The heading census is unchanged at 8 voices — this
family touches no heading.

45–50 **string** leaves changed per cell, and **every one of them is an `outline` key on an
unfocused element** (verified: zero non-outline keys differ). At HEAD the `*` rule painted an
`outline-color` onto every element in the document (`oklab(0.144… / 0.5)`, style `none`); with the
sweep deleted those elements fall back to `currentColor`, still at style `none`. Nothing paints;
the change is the sweep's death, visible only in a computed-style census.

---

## 7 · Build, types, units, lints

| gate | result |
|---|---|
| `vue-tsc -b --force` | **0 errors** |
| `vitest run` | **66 files / 810 tests passed** |
| `vite build` | clean, 4.16 s; `dist/assets/index-BZiOXf93WhIN.js` 215.36 kB (gzip 74.36) |
| dist CSS | the token lands (`--focus-ring: 2px solid var(--color-focus-sketch)`, `:focus-visible{outline:var(--focus-ring);outline-offset:var(--focus-offset)}`, `.dark{--color-focus-sketch:var(--color-crayon-blue)}`); `outline-color:var(--color-ring)` count **0** in every emitted sheet |
| `npm run lint` (prettier) | clean |
| `npm run lint:eslint` | clean |
| `npm run lint:copy` (M16) | **0 em dashes, 0 unadmitted jargon**; 2 admitted, unchanged — the diff mints **zero rendered strings**, so the woff2 subsets are untouched and `check-font-coverage` has nothing to price |
| `npm run lint:theme-tokens` | 0 unreferenced `@theme` tokens |
| `npm run lint:theme-selectors` | clean |
| `npm run lint:ink` | clean |
| `npm run lint:motion` | clean, 34 specs |

---

## 8 · Gaps, every one of them

1. **G-ABS-2 is 6.1% as a spread**, not the 4.2% the synthesis predicted, and the gate's wording
   ("within 5% across the three boards") reads as a spread. Each size is within 5% of the 1.75
   target; the residual is monotone in board size. **Cure: refit `ringK` on r0's own sampling
   window, or word the gate as ±5% of target.** Decide before it lands, not after.
3. **The spec's ring÷grid row (0.54 / 0.59 / 1.36) is wrong at all three sizes.** It was computed
   against r0's n = 1 grid σ. The corrected row is 0.668 / 0.803 / 0.707. The spec's §1.2 table and
   its §4 success criterion both need rewriting to the widened denominators.
4. **16×16 has 0.233 px of clearance and no more.** Green today; any later change to the stroke
   (7 units), the segments (4), the target (1.75) or the ghost's 15% pad reds MA-C. That number
   belongs in the cure's own comment, and MA-C must land **before** the cure.
5. **16×16 is a lozenge, not a square** (`frames/ring-16x16-1280-light-chromium.png`). The family
   survives its crop; it does not win it. If the owner wants a square at 16×16 the levers are
   pass-1's two — draw the ring at 0.86 × cellSize, or take the stroke from 7 to 5 units at that
   size — and both are unpriced here.
6. **`transition-colors` fades the token in over 250 ms** on the control buttons (§4). Undeclared
   by the spec; a one-line decision, not a redesign.
7. **The `cellRects` LRU key still has no ring term.** `ringSigmaUnits` / `ringK` live in the
   *reactive* `BOIL_CONFIG`, but they are read inside a memoized factory keyed on
   `["cellRects", boardSize, subgridSize, viewBoxSize, seed]`. A cache hit never re-reads them, so
   a live mutation (or `resetBoilConfig()`) would leave stale geometry. Latent today —
   `FilterTuner.vue` exposes no slider for either — and cheap to close: either add both to the key,
   or move them out of the reactive object into a plain frozen const, which is what a generate-time
   geometry constant wants to be anyway. **I recommend the latter; it deletes rather than adds.**
8. **No paired HEAD control for the phone frame trace** on this machine at this hour (§4). The
   webkit 9×9 arm's over-33 count is 2/1/0/0 across four runs and the mechanism says it cannot have
   moved at 9×9, but that is an argument plus samples, not a measurement.
9. **`masthead-link` is still unmeasured from painted bytes** (0 found by `footer a, header a` on
   the board route, at HEAD and here). It is inside the 107-stop computed census; it is not in the
   ratio table.
10. **Forced-colors was read in chromium only.** PW-WebKit has no forced-colors emulation, so that
    arm skips in the second engine here exactly as it did at HEAD.
11. **`gridPaths.ts` now imports a runtime value from `pencilConfig`** where it imported a type. No
    new chunk and the build is clean, but it is a new module edge and it should be named in the
    cure's commit message.
12. **The chrome composite does not resolve the tongue's or the deck card's ring** at the scale it
    was banked at (`frames/chrome-composite-light-chromium.png`, downscaled to fit the 150 KB cap).
    The `.ctrl-btn` pill and the toggle's 54 px circle read clearly; the other two panels are
    carried by their numbers, not by that crop.
13. **And then the hard part.** The graded law's *argument* — that a built rect on the chrome and a
    drawn ring on the board are one system — is not something a probe can return. What this pass
    can say is that they share one ink, one weight class and one floor, measured. Whether a reader
    experiences the `.ctrl-btn`'s CAD pill (visible in the composite's first panel) as the same
    hand that drew the 9×9 ring is the owner's call at the re-look. U-10.

---

## 9 · Files

Code: the worktree above (`git -C <worktree> diff --stat` is §0; **nothing committed**), plus
`web/frontend/pw-mrkabs-scratch.config.ts` there, untracked.

Evidence, all under this directory:

- `probe/pw.config.ts`, `probe/package.json` — the scratch config, port 4239, both engines.
- `probe/abs-wobble.probe.ts` — **new**, G-ABS-1 / G-ABS-2 / MA-C over every cell at three sizes
  and two viewports.
- `probe/focus-law.probe.ts` — **new**, G-ABS-4 (107-stop computed census, same-frame vs settled),
  G-ABS-5, and the deck's one-owner arm.
- `probe/cost.probe.ts` — **new**, MA-D resident `d` bytes per size, MA-E the phone at 16×16.
- `probe/pi-delta.mjs` — **new**, the π check against r0's R1 census.
- `probe/crops.probe.ts`, `probe/compose.mjs` — the four frames.
- `probe/scout.probe.ts` — the reconnaissance that settled how to focus a button in each engine.
- Re-run UNCHANGED from r0 (`wobble`, `budget`, `click`, `mobile`, `marks2`) and from pass-1
  research (`token-ring` with its overlay removed because the token is now in the product,
  `wash-forced-frames`, `clearance.mjs`, `k-constant.mjs`), plus r0's R1 `census`/`chrome2` copied
  as `r1census.probe.ts` / `r1chrome2.probe.ts` (port and output dir repointed, logic untouched),
  and R6's `hue-census.mjs` / `law-probe.mjs` repointed at the worktree by `FE_ROOT`.
- `logs/*.json` — every reading above. The six raw R1 census re-runs (496 KB) were PRUNED after the diff was taken; `logs/pi-delta.json` carries their verdict and `probe/r1census.probe.ts` regenerates them.
- `frames/` — four crops, 180 KB total, each ≤ 150 KB: `ring-9x9-1280-light-chromium.png` (22.7 KB),
  `ring-16x16-1280-light-chromium.png` (32.4 KB), `ring-9x9-phone-dark-webkit.png` (63.0 KB),
  `chrome-composite-light-chromium.png` (59.1 KB).

U-10: nothing here closes. The owner sees the crops at the re-look.
