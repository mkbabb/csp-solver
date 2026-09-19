# T9-W7 pass 2 · RESEARCH · CTRL-TAPE — the taped case

Section §10 (§1 §2 §8 §14 §15 inside) · M01 M03 M04 M05 M12 M13. Read-only on the product.
Nothing closes here (U-10).

    SERVERS   127.0.0.1:4230 = HEAD (main tree, read-only) · 127.0.0.1:4232 = the pass-1 build
              (worktree `wf_e58b4764-0fc-37`, 17 files uncommitted). Charter port 4230; 4231 was
              held by another lane, so the second server took 4232 — both in band, both
              `--strictPort`, both on a private `cacheDir` under the scratchpad. BOTH KILLED.
    PROBES    `probe/r2-tape.mjs` → `readings/r2-tape.json` (the gallery census · the pin band ·
              the occlusion predicate at five scroll states, 2 engines × 2 trees × 5 cells)
              `probe/r2-attrib.mjs` → `readings/r2-attrib.json` (why the deck moved)
    CROPS     ZERO banked. Every figure below is a number or a file:line.
    GATE RUN  `check-theme-selectors.mjs` on the pass-1 build — **exit 0** (`data-released` has
              its writer at `GameControlPanel.vue:692`; CTRL-COST's trap does not bite here).

---

## 0 · THE HEADLINE, IN FOUR NUMBERS

| | HEAD | pass-1 build | both engines |
|---|---|---|---|
| worst tape-over-control at the **DOCK** (390×844), `new game` ∩ `size` | 0 | **0.782 / 1807.3px²** | chromium 0.782 · webkit 0.782 |
| worst at the rail (1440×900), `new game` ∩ `9×9` | 0.034 / 358.6px² | **0.223 / 2320.1px²** | 0.223 / 2317.4 webkit |
| the deck's staging band height (390) | 192.00 | **167.98** | −24.02, both |
| the deck's first dealt card `y` (390 / 1280) | 151.84 / 149.41 | **163.84 / 161.41** | +12.00, both |

Two of those four are surfaces no gate in the estate visits. That is the research finding.

---

## 1 · §2.5 IS NOT A TAPE LAW, IT IS AN ARITHMETIC — and the arithmetic is closed-form

`e2e/viewport-law.spec.ts:381–503` runs at **1440×900 ONLY** and censuses `.washi-label`
against `INTERACTIVE`. Its one exemption (`:419–431`, the chair's own W2 ruling) is:

```
liveTop = card.top + card.clientTop + getComputedStyle(card).paddingTop      // ONLY while
                                                                            // [data-fold-above]
```

So the gate's law, restated as a inequality a designer can hold in one hand:

    (pinned tape's bottom)  ≤  card.top + padding-top          … while scrolled
    (any tape's bottom)     ≤  (its well's first control's top) … at rest, where there is NO exemption

and the pinned tape's bottom is spelled by three terms this family moved, all three in the same
direction:

    pinned bottom − card.top  =  --washi-tag-top + --card-pad-t  +  tapeHeight
                              =  (0.15rem→0.6rem)               +  (14px→25.888px rung)

MEASURED (`readings/r2-tape.json`, field `belowExemptBand` = tape.bottom − liveTop):

| cell | padding-top | HEAD | pass-1 | Δ |
|---|---|---|---|---|
| rail 1440×900, scrolled | **20px** (`p-5`) | **+5.44** | **+22.66** | +17.22 |
| rail 1440×900, at rest | 20px | +14.61 | +35.94 | +21.33 |
| dock 390×844, scrolled | **6px** (`py-1.5`) | +18.84 | **+36.65** | +17.81 |

webkit within 0.05px of chromium at every row. The card's padding is a Tailwind utility on
`GameScene.vue:196` — `p-5` on the rail, `px-2 py-1.5` on the dock — and `GameControlPanel.vue:638`
republishes it as `--card-pad-t`, which `--washi-tag-top` then cancels
(`GameControlPanel.vue:1500`). **One number, three readers**: the fold sentinel's solid colour
stop (`scene.css:318`), the pin's own offset, and §2.5's exemption line. That is the seam to
design on.

**The exempt band needed by the pass-1 build is 41.3px (2.58rem) on the rail and 42.7px on the
dock; it has 20px and 6px.** HEAD is inside its band on the dock (18.84 < …) and 5.44px outside
it on the rail — see §2.

### 1.1 · The disease is general, and the first well is only where a crop found it

`.tray-well:first-child { margin-top: 2rem }` (the pass-1 cure) addresses the AT-REST clamp of
well 1. The scrolled overlaps are a different pose of the same disease and they are **not**
first-well-only:

    chromium|proto|rail-1440   frac 0.75 + 1.00   `checking` ∩ `Off`   0.212 / 1074.8px²
    webkit  |proto|rail-1440   frac 0.75 + 1.00   `checking` ∩ `Off`   0.212 / 1075.2px²
    chromium|proto|rail-1440   frac 1.00          `players`  ∩ `Live`  0.090 /  940.8px²
    webkit  |proto|rail-1440   frac 1.00          `players`  ∩ `Live`  0.090 /  941.5px²

Those four reproduce the pass-1 critic's §C to the tenth of a pixel, on an instrument written
here, from the other side. And `checking ∩ Off` is CONSTANT across two scroll states with the
tape UNPINNED (`position: sticky` but at its natural offset, `top` 405.29 then 266.29): it is the
well's own tape lying 9.3px into the well's own first chip **at every scroll offset**. A reserve
on `:first-child` cannot see it. Four wells at `GameControlPanel.vue:761, 940, 998, 1033`.

### 1.2 · The dock is 3.7× worse than the rail and NO gate visits it

| cell | scroll | tape ∩ control | frac | px² | engines |
|---|---|---|---|---|---|
| **dock 390×844** | 0.25 | `new game` ∩ **`size`** | **0.782** | 1807.3 / 1807.1 | both |
| dock 390×844 | 0.25 | `new game` ∩ `levelEasy` | 0.292 | 1215.7 / 1215.5 | both |
| dock 390×844 | 0.50 | `new game` ∩ `4×4` | 0.464 | 1224.3 / 1224.8 | both |
| dock 390×844 | 0.75 | `new game` ∩ `4×4` | 0.188 / 0.204 | 495.0 / 538.6 | both |
| dock 390×844 | 1.00 | `players` ∩ `Off` | 0.094 / 0.098 | 247.2 / 263.5 | both |

78.2% of the `size` tab buried by the `new game` tape, both engines, and §2.5's `test.use`
viewport is 1440×900. **The estate's own §2.5 cell is the one where the disease is mildest.**

### 1.3 · §2.5 is green at HEAD by SCROLL-STATE LUCK, not by geometry

At HEAD, the same predicate at the same five states finds real coverage the gate never sees:

    chromium|head|rail-1440  frac 0.25  `new game` ∩ `9×9`   gate 358.6px² (0.034) · raw 1573.3 (0.151)
    chromium|head|rail-1440  frac 0.50  `new game` ∩ `Easy`  gate 358.6px² (0.034) · raw  921.1 (0.088)
    chromium|head|rail-1280  frac 0.50  `new game` ∩ `Easy`  gate 317.5px² (0.031) · raw 1508.2 (0.148)

§2.5 asserts `overlaps === []`; 358.6px² is 717× its own 0.5px² noise floor. It returns `[]` at
HEAD because its hover walk's Playwright auto-scroll never parks the card at those offsets, and
because its settle loop **forgives any overlap that reads clear twice in a row**. This is a
gate-that-cannot-fail row against a LANDED W2 instrument, and it is why "green at HEAD, red under
the patch" understates the case: the patch did not create the species, it multiplied it 6.6×
(0.034 → 0.223) at the identical scroll state.

→ propose as a MOVED r0/W2 row under `pass2/<stage>/CTRL-TAPE/instruments/`: §2.5 takes an
explicit scroll sweep (`scrollTop ∈ {0, ¼, ½, ¾, 1}` of range) beside its hover walk, and runs at
390×844 as well as 1440×900. Never re-cut in place, never re-worded to pass.

### 1.4 · The predicate the charter grafts, sharpened by a measurement

CTRL-RULE's critic pairs coverage with `elementFromPoint`. My run shows **the hit test is not a
garnish, it is the sign bit**. At HEAD, rail-1440, `frac 0`:

    `marks` (.zone-row-label) ∩ Clear/Fill/Solve/Share   0.199 each, 516.8–519.9px²
    hitIsTarget: TRUE   hitWas: "icon-sublabel"

That is the sticky ACTION BAR painting over the label — the control on top of the tape, which is
not occlusion at all. Every real occlusion in the build reads `hitIsTarget: false` with
`hitWas: "washi-label washi-tag"`. **The predicate is:**

    occludes(tape, control) ⟺ area(tape ∩ control) > 0.5px²
                              ∧ elementFromPoint(midpoint of the intersection) ⊄ control

Banked and runnable: `probe/r2-tape.mjs`, field `hits[].hitIsTarget`.

---

## 2 · THE GALLERY — the pi this family moves, and it is NOT the class the charter names

The charter's row 3 suspects `.zone-row-label, .section-heading`. **Measured: that suspicion is
clean, and the leak is one component over.**

**`.section-heading` cannot reach the deck.** The build's rule lives in `GameControlPanel.vue`'s
`<style scoped>` (`:1435`), so Vue compiles it to `.section-heading[data-v-GCP]`; StagingBand's
`.section-heading` (`StagingBand.vue:140,154`) carries StagingBand's own scope id. And the two
global moves are absorbed by StagingBand's own unlayered overrides:

| deck reading, 390 / 1280, both engines | HEAD | pass-1 | Δ |
|---|---|---|---|
| `size` / `level` glyph x | 17.59 / 396.00 | 17.59 / 396.00 | **0.00** |
| their font-size | 14 / 16px | 14 / 16px | **0.00** |
| their padding-left | 0 / 12px | 0 / 12px | **0.00** |

`--type-group-title` 1.272rem → 1.618rem is eaten by `.staging-axis-label { font-size:
var(--type-small) }` (`StagingBand.vue:315–319`); `--type-option` 22→20 is eaten by
`.staging-axis :deep(.ctrl-btn) { font-size: 1rem }` (`StagingBand.vue:292`). CTRL-RULE's +12.00px
was THEIR diff (they folded typography.css's ≥768 `.section-heading` arm into the base,
`typography.css:376–382`); CTRL-TAPE leaves that arm standing and is clean on it.

### 2.1 · The leak is `SheetWashiLabel`, and the mechanism is INLINE → BLOCK

`StagingBand.vue:130` renders `<SheetWashiLabel text="new game" :seed="13" anchor="tag" />` — the
deck's own slip tape, the same component the four wells use. The build changes that component
(`SheetWashiLabel.vue:93` `<span>` → `<component :is="anchor==='tag' ? 'h2' : 'span'">`, `:164`
the `.washi-tag` rung and leading), so the deck is re-cut by construction.

`readings/r2-attrib.json` — the attribution, both engines:

| | the CARD's tape | the DECK's tape |
|---|---|---|
| parent | `.outline-container.tray-well` | `.outline-container` |
| parent `display` | **flex** | **block** |
| HEAD tape `display` | **block** (flex BLOCKIFIES the span) | **inline** |
| HEAD vertical margins | apply | **INERT** (a non-replaced inline box drops them) |
| build tape `display` | block | **block** |
| build vertical margins | apply | **apply, for the first time** |

So the `<h2>` swap is layout-neutral in the card (flex had already blockified the span) and, on
the one surface outside it, switches on a **−31.71px** margin pull that had never been live.
Everything else follows:

| deck, 390×844 | HEAD | pass-1 | Δ | webkit |
|---|---|---|---|---|
| tape tagName | SPAN | **H2** | — | same |
| tape font-size | 12.179px | **25.888px** | ×2.13 | same |
| tape painted box | 57.31 × 17.63 | **369.09 × 41.06** | **×6.44 wide** | 369.09 × 41.05 |
| `margin-top` | −18.9085px (inert) | **−31.7056px (live)** | — | −31.703125 |
| staging band height | 192.00 | **167.98** | **−24.02** | −24.03 |
| band `y` | 582.44 | 594.44 | +12.00 | +12.01 |
| **first dealt card `y`** | **151.84** | **163.84** | **+12.00** | +12.02 |
| at 1280×800: band h / card y | 136.00 / 149.41 | 111.98 / 161.41 | −24.02 / **+12.00** | identical |

The tape is **369.09px wide** because a block-level `<h2>` fills its line where an inline span
shrink-wrapped, and `align-self: flex-start` (`SheetWashiLabel.vue:169`) is inert outside a flex
parent. The six-point tear polygon is authored in **percentages**
(`polygon(2.33522% 0%, 96.1916% 8.21832%, …)`), so at 369px the torn ends stretch to ~8.6px and
~14px of travel — **the tape stops reading as torn paper on the one surface where it is the only
tape.** No frame was banked for it in pass 1 and no golden covers `?view=gallery`.

### 2.2 · The a11y half, measured against the tree and not the DOM

DOM headings on the deck route go **3 → 10** (the hidden controls card mints seven). But the card
is `visibility: hidden` there (`readings` in `/tmp` reproduction; `.controls-card` computed
`visibility: hidden`, `#controls-drawer` visible), so **the accessibility tree moves by exactly
one node**:

    ariaSnapshot, ?view=gallery, 390×844, both engines
      HEAD   - heading "sudoku" [level=1]
      PROTO  - heading "sudoku" [level=1]
             - heading "new game" [level=2]      ← NEW

That single heading is arguably right (the slip already carries `role="group"
aria-labelledby=zoneId` pointing at that very tape, `StagingBand.vue:131–134`) — but it is a W3-
shaped change made silently by a §10 family on a surface §10 does not claim. **Declare it and gate
it, or scope the `<h2>` swap to the card.**

### 2.3 · The three exits, priced

| exit | what it costs | what it leaves |
|---|---|---|
| **A · scope the promotion to the card** — `<component :is>` takes a prop (`heading?: boolean`), the four wells pass it, StagingBand does not | one prop, ~4 lines | the deck byte-identical; the tape's own class shared with no semantic split |
| **B · own the deck** — keep the swap, give `.washi-tag` `width: max-content` unconditionally (so block and inline shrink-wrap alike) and declare the band's −24.02 / +12.00 with a frame and a golden | 1 declaration + a declared delta + a deck frame | one component, one law, the deck gains a heading it can defend |
| **C · re-seed the deck's tape** (charter row 4's twin) | — | does not touch the leak; the leak is `display`, not the seed |

**B's one declaration is the cheap one and it is already half-written**: `align-self: flex-start`
exists precisely to shrink-wrap in the card. `width: max-content` is the same intent stated so it
survives a non-flex parent — and it is the line that also restores the tear's geometry.

---

## 3 · THE SEAM — the masked fallback, the stale publisher, and the missing second term

Three `--sheet-chrome` sites, and the build re-cut ONE:

| site | value | regime |
|---|---|---|
| `scene.css:468` | `12rem` → build: `max(12rem, calc(var(--masthead-foot, 0px) + 8px))` | <1024, both orientations |
| **`scene.css:597`** | **`4rem`, untouched** | <1024 landscape, ≤500 tall, ≥2:1 — **844×390** |
| consumers | `:474` (`100dvh − chrome`), `:512` (`… − 1.5rem`) | |

1. **The fallback masks.** `var(--masthead-foot, 0px)` returns the 12rem the mark says had gone
   NEGATIVE if the publisher never fires. The loud form is `calc(var(--masthead-foot) + 8px)`
   with NO fallback: an absent custom property makes the declaration invalid at computed-value
   time and the seam fails visibly instead of silently. Gate: at <1024, assert
   `getComputedStyle(documentElement).getPropertyValue('--masthead-foot')` is a non-empty px, and
   that `--sheet-chrome` ≠ `192px`. Born-RED by deleting the publisher.
2. **The publisher is stale by 7.00px** (pass-1 critic: published 221.73 vs wordmark foot 214.73
   chromium; 221.42 / 215.02 webkit). `App.vue` observes `mastheadEl` (the `<h1>`) while reading
   `wordmarkEl()`'s box; the wordmark rescales INSIDE the `<h1>` via `--logo-scale`, so no resize
   fires and the mount-time SHUT pose stands. One-line cure: observe the wordmark, not its
   container — `useResizeObserver(() => wordmarkEl(), …)`. Gate: `|published − measured| ≤ 0.05px`
   after the drawer settles, both poses.
3. **The second term is arithmetic, and it recovers ~27px.** The mark is about the CASE's stroke,
   not the sheet's top. Pass 1 measured `--sheet-chrome` 229.72, wordmark foot 214.73, case stroke
   249.73 → the case sits **20.01px** below the sheet's top. Want `caseY ≥ foot + 8`:

        caseY = sheetChrome + caseOffset  ⟹  sheetChrome ≥ foot + 8 − caseOffset
        --case-offset: <published, the case's own top less the sheet's top>
        --sheet-chrome: max(12rem, calc(var(--masthead-foot) + 8px - var(--case-offset)))

   At 390: 214.73 + 8 − 20.01 = **202.72** vs the shipped 229.72 → **the card gets 27.00px back**,
   and the clearance lands on **8.00**, not 35.00. The pass-1 gap 1 (38px lost at 390, card
   clientHeight 590 vs 628) closes to ~11px, which is the voice's honest price.
4. **844×390 has never been measured.** `scene.css:597` keeps a 4rem literal, so the seam law is
   spelled in one of three arms. Measure the case stroke against the wordmark foot there before
   claiming M03a.

---

## 4 · M04 TERM 2 — the `#card-foot` berth, and what it closes on the way

CTRL-RULE's graft, read from its worktree (`wf_e58b4764-0fc-38`):

    GameScene.vue  +10   <div id="card-foot" class="card-foot" /> — a sibling of .controls-card,
                         INSIDE the HandDrawnOutline case, OUTSIDE the scrollport
    scene.css            .card-foot { padding-inline: var(--card-pad-x, 0px) }
                         ≥1024:  max-height: calc(min(42rem,85vw,100dvh-10rem) - 2rem - var(--card-foot-h,0px))
                         <1024:  max-height: calc(100dvh - var(--sheet-chrome) - 1.5rem - var(--card-foot-h,0px))
    GameControlPanel     the bar teleported to #card-foot; --card-foot-h published from its box
    measured (their critic, reproduced by them) — bar top − card bottom = 0.00px, inCard = false,
    burial 0.0% at every scroll state against 37.1% worst

**Three of this family's open rows close on it at once**, which is the strongest reason to take it:

- **M04 term 2** — 0.874 worst dock burial → 0.00 by construction.
- **Charter row 9's union key dies with its subject.** `@media (min-width: 1024px),
  (max-width: 1023.98px)` at `GameControlPanel.vue:2166` is literally every width, and it is
  correct in substance: `overflow-y: auto` is declared at exactly two sites — `scene.css:132`
  (≥1024) and `scene.css:513` (<1024, unscoped by orientation since W2 §2.2) — so the card is a
  scrollport everywhere. With the bar below the scrollport there is no sticky rule and no key at
  all. If the berth is NOT taken, the honest restatement is to delete the query and declare
  `.action-bar { position: sticky; bottom: 0 }` unconditionally, citing those two lines.
- **The `data-under-bar` fade** (`SheetWashiLabel.vue:190`) exists only because tapes slide under
  a sticky bar inside the port. My readings show it firing hard: at the rail, `frac 0`, the
  `pencils` / `checking` / `players` tapes are all at `opacity 0`. Outside the port it is dead
  weight — but `check-theme-selectors.mjs` will RED the moment its writer goes, so writer and
  selector must die in the same commit (CTRL-COST's §3 trap, measured).

**The collision to price:** CTRL-RULE also DELETES `scene.css:156`'s `padding-bottom: 3.5rem`
(the W2 §2.5 note berth). CTRL-TAPE keeps its rail hover tapes (`v-if="!mobile"` on every
`SheetWashiLabel` in the bar, `GameControlPanel.vue:1258/1274/1295/1313`), so it must keep the
berth AND subtract `--card-foot-h`. Two independent terms, not one.

---

## 5 · THE RING — the graft as written LOWERS this family's measured number

`--ring-ink` does not exist at HEAD; CTRL-RULE mints it in `index.css` as
`color-mix(in srgb, var(--color-foreground) 50%, transparent)`. The chair (§6.1) makes it binding
on every §10 lane and forbids re-minting. The build currently authors
`outline: 2px dashed currentColor; outline-offset: 3px` — DrawerTab's own authored ring
(`DrawerTab.vue:151–154`) promoted through `:deep()` — and its critic measured **worst 4.59:1
painted** (webkit light, chip) against WebKit's UA default of **2.15:1**.

Analytic composite (the reader CTRL-TABS proved engine-independent; webkit's extreme-pixel
sampler runs ~3× hot):

| ground | `--ring-ink` composite | verdict |
|---|---|---|
| light, bare card `#FDFDFB` | **3.67:1** | clears 1.4.11's 3:1 by 0.67 |
| dark, card `#131211` | **4.70:1** | clear |
| light, a SELECTED chip's crayon fill | **not measured — the tight arm** | must be read |

The ring's ink is fixed at L 0.2306; a DARKER ground drives the ratio down, and the only darker
grounds in the card are the selected chips' crayon fills. **Take the token, keep the dashed idiom,
and measure the ring on all four grounds including the selected chip — the graft is a contrast
REDUCTION from 4.59 and could land under 3:1 where currentColor never could.** Report which of
§6's candidate values survives; §6 reconciles at pass 3.

---

## 6 · THE ESTATE GATES PASS 1 NEVER RAN — two are RED BY READING

`e2e/zone-grammar.spec.ts` asserts the card's rendered names **as strings**:

    :21   NAME_SELECTOR = ".section-heading, .washi-tag, .zone-row-label"
    :64-68  expect(eyebrow texts).toEqual(["Size", "Level"])        ← build renames to size / level
    :82-85  expect(caption texts).toEqual(["marks", "candidates"])  ← build renames candidates → what fits
    :246    expect(.controls-card .section-heading).toHaveLength(2) ← HOLDS (build keeps 2)
    :620    the same lock on #controls-drawer                       ← HOLDS

Two assertions go RED under the build, and they are RED for the right reason — their SUBJECT
moved (the copy ruling at pass-1 §C·4, and B1's `candidates`). That is a MOVED row: re-cut with
the rename in the same commit, with the reason in the diff, never re-worded to pass.

A third, softer finding: `census()`'s `rank()` (`:33–38`) assigns rank **by CLASS** —
`section-heading` → "eyebrow", `washi-tag` → "tape", `zone-row-label` → "caption". This family's
entire claim is that those three are ONE tuple. The gate cannot see the claim, and it cannot see
a regression against it either. Propose an instrument diff: rank by the RENDERED tuple
(face · px · weight · case), so "one voice" is a measurement rather than a class list.

Unrun and needed: `zone-grammar`, `font-census` (`:369` reads `.zone-row-label` first innerText —
`marks`, unchanged, HOLDS), `filter-census`, the goldens off a built dist.
**W8 has the main tree's `dist` FROZEN at `index-9rZPzI5DEcpe.js` — never `npm run build` in the
main tree while W8 runs. Build in the worktree; it is a separate checkout and writes its own
`web/frontend/dist`.**

`scripts/check-font-coverage.mjs:118–122` extracts row-caption strings by regex on
`class="…zone-row-label…"` — the build's `<h2 class="tape-host">` wrapper keeps the span and its
class, so the extractor still matches. No change needed.

---

## 7 · THE TWO r0 ROWS TO RE-AIM (proposed diffs, never re-cut in place)

`r0/r6-idiom-history/law-probe.mjs` prints to stdout and banks no file, so no OUT re-pointing is
needed — copy it, patch the copy under `pass2/<stage>/CTRL-TAPE/instruments/`, report MOVED.

**L3** (`:75–83`) — `const admitted = (g.match(/since:\s*"/g) ?? []).length; ok: admitted === 2`.
A count pinned to a moment. The build rightly strikes the `candidates` admission and the row reds
while `check-copy-register` itself exits 0. Read the gate's EXIT:

```js
const { status } = spawnSync("node", ["scripts/check-copy-register.mjs"], { cwd: ROOT });
return { ok: status === 0, detail: `check-copy-register exits ${status} · ${admitted} ADMITTED standing` };
```

**R3** (`:171–186`) — `const bar = /\.action-bar\s*\{([\s\S]*?)\n\}/.exec(p)?.[1]` then
`/border|HandDrawnOutline/.test(bar)`. It reads the CSS BLOCK; the build draws the edge in the
TEMPLATE (`<HandDrawnOutline class="bar-frame" :stroke-width="1.5" :pose="0">` at `inset: 0`
inside `.action-bar`). The predicate must accept either spelling:

```js
const tplEdge = /class="action-bar"[\s\S]{0,400}?<HandDrawnOutline/.test(p)
             && /\.bar-frame\s*\{[\s\S]*?position:\s*absolute/.test(p);
const hasEdge = /border|HandDrawnOutline/.test(bar) || tplEdge;
```

Two instruments, one mark (R7 I2 reads GREEN, R6 R3 reads RED), and the disagreement was
unremarked in pass 1. It is the instrument that is wrong.

---

## 8 · THE COMMENTS THAT CONTRADICT THE LANE'S OWN NUMBERS (charter row 6)

| file:line (worktree) | what it says | what was measured |
|---|---|---|
| `SheetWashiLabel.vue` `.washi-tag[data-released]` note | "published by one `IntersectionObserver` at threshold 0.5 per well" | `publishFold` publishes it — `GameControlPanel.vue:692`, `toggleAttribute`, confirmed by `check-theme-selectors`' own writer table |
| `SheetWashiLabel.vue` leading note | 1.2 "buys … the ~7px of top clearance the dock card's first tape needs" | ablated INERT, 1.04 → 1.04; `--washi-tag-top` is what bought it (pass-1 README §C·3) |
| `App.vue` observer note | "The observer is the wordmark's OWN box (`logoMenu.$el`…), never the `<h1>`'s" | the code is `useResizeObserver(mastheadEl, …)` — it observes the `<h1>`, which is exactly why the foot is 7.00px stale |

The source is what the next hand reads; all three are one-line rewrites to the measurements.

---

## 9 · SKETCHES

### 9.1 · The pin band as reserved paper — the top twin of the note berth

```
   ┌ case (stroke 3) ═══════════════════════════════════════════════════╗
   │▒▒▒▒▒▒▒▒▒▒▒▒▒ padding-top ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ ← §2.5's liveTop
   │   ┏[ new game ]━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓       │   AND the sentinel's
   │   ┃   ▓ size ▓        ▓ level ▓                             ┃       │   SOLID colour stop
   │   ┃    4×4    9×9    16×16                                  ┃       │   AND --washi-tag-top's
   │   ┃            ╔══════╗                                     ┃       │   own cancellation:
   │   ┃            ║ deal ║  dealt ⊪                            ┃       │   ONE number, three
   │   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛       │   readers
   │                                                                     │
   │   the law: a PINNED tape's bottom never leaves the ▒ band            │
   │   0.6rem + tapeH ≤ padding-top   →  9.6 + 31.7 = 41.3px needed       │
   │   have: 20px (rail p-5) · 6px (dock py-1.5)                          │
   │   AT REST there is NO exemption — the clearance must be geometric    │
   └─────────────────────────────────────────────────────────────────────┘
```
Growing `padding-top` to 2.6rem serves BOTH poses at once and makes
`.tray-well:first-child { margin-top: 2rem }` (+26.40px) redundant — one reserve replacing two,
net ≈ −1px on the seal instead of +26.40.

### 9.2 · Why the deck moved, in one picture

```
   THE CARD                              THE DECK
   .tray-well  display:flex              .outline-container  display:block
      └ <span class=washi-tag>              └ <span class=washi-tag>
        BLOCKIFIED by flex                   a true INLINE box
        margin-top −18.91  APPLIES           margin-top −18.91  INERT
        width shrink-wraps (align-self)      width shrink-wraps (inline)
        57.77 × 17.6                         57.31 × 17.63
                                     ↓ <component :is="'h2'">
        still block · still 108.23           BLOCK for the first time
        margins still apply                  margin-top −31.71 GOES LIVE
        Δ layout = 0                         Δ band −24.02 · Δ card y +12.00
                                             width 57.31 → 369.09 (tear stretches)
```

### 9.3 · The bar's two homes, and what each one costs

```
   TODAY (sticky, inside the port)          THE BERTH (#card-foot, outside it)
   ┌ case ───────────────────────┐          ┌ case ───────────────────────┐
   │ ┌ card (scrollport) ──────┐ │          │ ┌ card (scrollport) ──────┐ │
   │ │  … wells scroll …       │ │          │ │  … wells scroll …       │ │
   │ │ ▓▓ bar sticky bottom ▓▓ │ │ ← floats │ │  (no bar, no key)       │ │
   │ │   burial 0.874 dock     │ │   over   │ └─────────────────────────┘ │
   │ └─────────────────────────┘ │          │ ▓▓ bar ▓▓  gap 0.00px       │ ← covers nothing
   │   padding-bottom 3.5rem     │          │   padding-bottom 3.5rem     │   by construction
   └─────────────────────────────┘          └─────────────────────────────┘
   sticky key = every width (a lie)         no key at all · cap less --card-foot-h
   data-under-bar fade needed               fade + its writer die together
```

---

## 10 · RISKS, RANKED

1. **The gallery.** −24.02px of band and +12.00px of card travel on a surface with no golden and
   no frame, from a component edit, in both engines. Exit A or B in §2.3, in the same commit,
   with the deck measured before and after.
2. **§2.5's cell.** Curing 1440×900 and calling it closed leaves 0.782 at the dock. Any cure must
   be measured at 390×844 too, and the gate proposed as a MOVED diff that visits both.
3. **The ring graft can lower a number it was minted to raise.** 4.59:1 (currentColor) → 3.67:1
   on bare card, unmeasured on a selected chip's fill. Measure before taking.
4. **Growing `padding-top`** to serve the pin band costs the iPad coarse seal (re-priced to
   1283.5). It is paid for only if `.tray-well:first-child`'s 2rem (+26.40px) goes with it —
   prove the swap by ablation in the same six-term table pass 1 used.
5. **`--sheet-chrome` has three arms and the build re-cut one.** `scene.css:597`'s 4rem landscape
   literal is unmeasured; a seam law that holds at 390 and not at 844×390 is not a law.
6. **The berth deletes a berth.** Taking CTRL-RULE's `#card-foot` without keeping
   `padding-bottom: 3.5rem` re-opens the hover-note collision W2 §2.5 priced (16.9 / 57.4 / 23.6 /
   17.4% at head).
7. **`data-under-bar`'s selector and its writer must die together** or `check-theme-selectors`
   reds (it is GREEN today — measured, exit 0).
8. **Two zone-grammar assertions are RED by reading** and will be discovered by CI, not by the
   lane, unless the rename and the gate land in one commit.
9. **The two ranks are still thin** (12px inset + one crossed stroke). The fresh-reader test is
   the only instrument for it: hand `pass1/prototype/CTRL-TAPE/frames/p1-dock390-dark-chromium.png`
   to another lane's agent with one question — "which of these eight names are groups?" — record
   the answer verbatim, score 8/8, and hand it to the owner (U-10). Do not score it yourself.
10. **`level Easy` in the tree.** `<h2 class="mobile-heading-head">` wraps the `<button>`, which
    holds both the `.section-heading` span and the `.heading-value` span, so the heading's name is
    the concatenation (`GameControlPanel.vue:789–812`). A heading cannot live inside a button
    (flow content in a phrasing-only element), so the only structural exit is to make the `<h2>`
    a SIBLING of the button and wire `aria-labelledby` — the build's own
    `.tape-host { display: contents }` proves the shape. Otherwise book it as W3's row with the
    reading.
