# CTRL-TABS · pass 2 (RESEARCH) — the index tabs, under the blocking condition

Section §10 (§1 §2 §8 §14 §15 inside) · marks M01 M03 M04 M05 M12 M13
Researcher: Opus 5. READ-ONLY on every product file. Nothing closes here (U-10).

    WHAT I DID   read the chair's rulings, the charter, W7 §10/§1/§2/§8/§14/§15, the owner's
                 marks, r0's R1/R6/R7, and this family's whole pass-1 record (spec, prototype,
                 critique). Stood the pass-1 worktree's build on 127.0.0.1:4233 (charter port
                 4232 was held by another lane; next free in band, --strictPort, private vite
                 cacheDir) and ran four instruments across chromium AND webkit. Built a dist in
                 the worktree and ran the filter census against it. Killed both servers.
    HEADLINE     THE BLOCKING CONDITION IS CUREABLE AND THE CURE IS MEASURED — the 4.20 goes to
                 4.99 light / 6.30 dark in both engines by removing the 8% face, and the
                 redundancy it cost can only be bought back with a DRAWN cue, never a ground:
                 no graphite mix exists at any percentage that is both AA-safe under the red
                 word and ≥3:1 against the card. That is a proof, not a preference (§1).
    ALSO         the critique's 40.78px attribution is WRONG and the real mechanism is cheaper
                 to cure (§3); the short end has an exact law (vh ≥ 530 portrait, §4); the
                 seal-grade filter constant SURVIVES A BUILT DIST, 12/12 both engines (§6).

| instrument | what it answers | banked |
|---|---|---|
| `probe/guard-solve.mjs` | the whole cure space, analytically, off index.css's own tokens | `readings/guard-solve.json` |
| `probe/pass2.probe.mjs` (A) | six candidate cures on the real surface, 390×844, both themes, both engines | `readings/guard-surface.json` |
| `probe/pass2.probe.mjs` (B/D/E) | the live regions on the a11y tree · the floor's wrap and ink · the seam boxes | `readings/regions-floor-seam.json` |
| `probe/pass2.probe.mjs` (C) | the short end — a height sweep at four widths | `readings/short-end.json` |
| `probe/drop-attribution.mjs` | where the 40.78px actually comes from | `readings/drop-attribution.json` |
| built-dist census | `filter-census` against a real `vite build` | `readings/filter-census-built-dist.txt` |
| `instruments/` | L1 · L3 · R6 law 9 · R7 I3 · R1 ROW 2, proposed MOVED | `instruments/README.md` |

**Instrument validity.** The composite reader reproduces the critique's own figures to the
hundredth on the same surface — shipped guard reads **4.20 light / 5.26 dark**, `keep` 19.45 /
15.84, the face-against-card cue 1.19 / 1.20, chromium and webkit identical. Two readers agree
(analytic from tokens: 4.19 / 5.28), so the cure column below is a measurement, not a claim.
One trap banked: `color-mix()` computes to `color(srgb r g b / a)` with **0–1 floats**; read as
8-bit it lands the light arm within 0.02 by luck and inverts the dark arm entirely
(`probe/pass2.probe.mjs:36`). Any lane compositing computed colours owes that branch.

---

## 1 · THE BLOCKING CONDITION — cured, and the ground is proved impossible

### 1.1 What the six candidates read (390×844, chromium AND webkit, identical)

`.guard-go` is `--color-red-ink` at `--type-verb` (**14.00px**, weight 400) on
`color-mix(in srgb, --color-foreground 8%, transparent)` over `--color-card`
(`GameControlPanel.vue:2067,2071`).

| # | the candidate | `clear` light | `clear` dark | its marked/bare cue | verdict |
|---|---|---|---|---|---|
| C0 | **shipped** — red ink + 8% face + stroke 2.5 | **4.20 FAIL** | 5.26 | ground 1.19:1 | the blocked row |
| C1 | retire the red; keep face + stroke (HEAD's own grammar) | 16.38 | 13.21 | ground 1.19:1 | AA-clean, loses the tone |
| C2 | red on bare card; `keep` loses its DRAWN BOX | **4.99** | **6.30** | box vs no box, stroke 19.45:1 / 15.84:1 | **both halves cured** |
| C3 | red on bare card; the 8% face moves to `keep` | **4.99** | **6.30** | ground 1.19:1, inverted | AA-clean, cue unchanged |
| C4 | red on a 4% face | 4.59 | 5.81 | ground 1.09:1 | clears by 0.09 — fragile |
| C5 | red on bare card, nothing else changes | **4.99** | **6.30** | stroke 2.5 vs 2 alone | AA-clean, cue thin |

Geometry is invariant across all six: guard row **48.78**, `keep` 45.33×44, `clear` 47.98×44,
card 276.81 (webkit 276.80). No cure costs a pixel.

### 1.2 The proof the charter asked for: a GROUND can never carry the redundancy

`probe/guard-solve.mjs` sweeps the graphite mix 0–40% in both themes and asks two questions of
each percentage at once — does the red word still clear 4.5:1, and does the face itself clear
the 3:1 a non-text cue owes (1.4.11)?

| theme | highest mix the RED WORD survives | lowest mix the FACE survives | overlap |
|---|---|---|---|
| light | **4%** | none at ≤40% (34% reads 2.27) | **NONE** |
| dark | 13% | **36%** | **NONE** |

The two bands are disjoint in both themes. **No graphite ground is simultaneously AA-safe under
teacher-red and visible as a cue.** Four lanes found the symptom independently; this is the
mechanism, and it closes the charter's "if impossible inside the floor's row, RETIRE" question
in the family's favour: the floor's row is not what fails — the GROUND is, and the row has
another channel.

### 1.3 The channel that is left, with its numbers

The drawn box already exists on both verbs and is already per-verb:
`goDrawn.stroke` reads **rgb(208,42,82) @2.5px** and `keepDrawn.stroke` **rgb(10,10,10) @2px**
(dark: rgb(255,92,124) / rgb(237,236,233)). So the family has a form channel it is not spending.

| cue | its own contrast, light | dark | floor |
|---|---|---|---|
| a graphite drawn box on the card | **19.41** | **15.84** | ≥3:1 (1.4.11) ✓ |
| a red-ink drawn box on the card | 4.98 | 6.32 | ✓ |
| the 8% ground (today's cue) | 1.19 | 1.20 | ✗ |
| the two words' own luminance apart, in greyscale | 3.90 | **2.51** | dark fails 3:1 |

That last row matters: "the red one is obviously darker" is not true at night. A reader in
greyscale meets 2.51:1 between the verbs in dark mode, so the ink cannot be the non-colour cue
either. **The cue has to be drawn.** Recommended to the synthesizer, in order:

1. **C2 — one verb boxed, one bare.** Categorical, survives greyscale, and its cue clears its
   floor by 6×. It also reads correctly: the fenced thing is the one that acts.
2. **C2 + C3 together** — `keep` bare and the ribbon's default; the destructive verb boxed at
   2.5 on bare card. Three independent channels: word (`clear the board?` names the act), form
   (boxed vs bare), tone (red). Remove any one and the confirm still reads.
3. C5 alone only if the gallery's grammar may not move — and then the spec must say in writing
   that the non-colour cue is a 0.5px stroke difference, which is what the critique already
   convicted.

**What C2 costs.** `.guard-face` carries the focus ring (`outline: 2px solid var(--ring-ink);
outline-offset: 4px`, `:2079`) and the `min-inline-size`/`min-height` tap floor (`:2055`). A
bare `keep` keeps both on the BUTTON (`.guard-btn` already declares the same two, `:2037`), and
the ring moves to the button. `--ring-ink` measures **3.70:1 light / 4.67:1 dark** against the
card — over 1.4.11's 3:1 in both themes, and the same numbers the pass-1 A/B read (3.72 /
4.66–4.68). Per the chair's §6.1 this lane CONSUMES that token and never re-mints it; our
palette survives on it.

**What C2 owes the estate.** The gallery's ribbon is the same grammar in another file
(`GameGallery.vue:1035-1060`, CSS `:1399/:1414/:1459`) and §15 claims the confirm's FACE, so
both ends move in one commit or the house has two confirms. Note for the record: the gallery's
destructive verb is `--color-foreground` on the same 8% face (**16.38:1**) — **the 4.20 is not
inherited, this family minted it** by adding the red ink to a ground the estate tuned for
graphite. That is the honest sentence the spec owes.

---

## 2 · THE LIVE REGIONS — measured OFF the accessibility tree, both engines

`.tray[inert] { visibility: hidden }` (`GameControlPanel.vue:1392`). Role queries follow the
accessibility tree, so this is a measurement of what an AT can see, not of what Playwright can
click:

| state | `getByRole('log')` | `getByRole('status')` | invite button by role | invite in DOM |
|---|---|---|---|---|
| `players` tray hidden (default face) | **0** | 3 | **0** | 1 |
| `players` tray face up | 1 | 3 | 1 | 1 |

Identical in chromium and webkit. The three roster regions —
`.players-status` (`aria-live`, `:926`), `.players-roster` (`role="log"`, `:934`),
`.players-alone` (`aria-live`, `:970`) — all read `visibility: hidden` under `[inert]` while
another tab is up. The `status` count stays 3 in both states because the estate's three root-
level regions (`margin-note`, `board-voice`, `.copy-status` at `:1154`) are outside the trays.

**So the berth already exists**: `.copy-status` is an `sr-only role="status"` at the panel root,
outside the `HandDrawnOutline` that wraps the trays. The cure is to give the roster the same
berth. Two of the three are not simple hoists:

| node | what it is | cure |
|---|---|---|
| `.players-alone` | pure `sr-only`, no visible job | HOIST whole to the panel root |
| `.players-status` | visible `<p>` when `connectingLine` is set, `sr-only` otherwise | SPLIT: the `<p>` stays in the tray with no `aria-live`; its sentence is written into a root-level polite region |
| `.players-roster` | a VISIBLE `<ul>` of player rows AND the `role="log"` | SPLIT: the list stays and drops `role="log"`/`aria-live`; a root-level `role="log"` carries the arrival and departure sentences |

That split is W3's own landed idiom (one live-region site per voice, the visible thing separate
from the spoken thing — `e0e3f8a1`, "five sites, one live-region idiom"), so this is a graft,
not an invention. **`access.spec.ts` 2.3 also times out for a second, separate reason**: it
clicks `.controls-card button[aria-label="Play together on this board"]`, which is not visible
while the tray is down. The re-aim (raise the `players` tab first) is a test change and must
land in the same commit as the product cure, or the row greens on a test that no longer proves
the regression is gone. Keep both halves: the hoist proves the AT hears it, the re-aim proves a
reader can reach the invite.

---

## 3 · THE 40.78px — the critique's attribution does not reproduce

The critique names `--sheet-chrome: 12rem → max(12.6rem, calc(--masthead-foot + 8px))`
(`scene.css:452`) as the cause. Measured, sheet shut, 390×844 and 375×812:

- **putting `--sheet-chrome` back to 12rem moves the board 0.00px.** The token feeds only
  `max-height` on `.scene-controls` (`:458`) and on the card (`:496`), and the sheet is
  `position: fixed` — it cannot move a board in flow.
- **`--masthead-foot` is never published in the tree** (three mentions, all inside `scene.css`,
  two of them prose). The `max()` therefore resolves to `12.6rem + 8px` = **209.6px** against
  HEAD's 192 — a 17.6px change that spends itself entirely on the short end (§4), not on the
  board.
- **the playing block is CENTRED**: inserting a spacer of height H below the board moves the
  masthead up by exactly **H/2** (100 → −50.00, 200 → −100.00 at 390; identical at 375). So a
  band of height B removed below the board pushes the whole block DOWN by B/2.
- 40.78 × 2 = **81.56px of flow removed below the board**, and the only thing the diff deletes
  there is `#fold-tools` — HEAD's portrait ribbon, measured in r0 at **55.98px** tall
  (`r0/r1-controls/census-390x844-chromium.json`, `acts.foldTools`) inside a column whose gap is
  `1.25rem` = 20px (`scene.css:404`). That accounts for **75.98** of the 81.56; the residual
  5.58 needs a HEAD arm on one server to close, and the spec should either close it or state it.

**What this changes for the synthesizer.** The move is a consequence of §14's "one tool home",
not of the seam derivation, so the choices are real ones: (a) declare the drop and re-mint the
portrait goldens, (b) re-spend the band (the board's bottom edge now carries the tools —
reserving the same 81.56 keeps every portrait golden byte-identical), or (c) pin the board's y.
It also means `--sheet-chrome`'s +17.6px buys nothing on the board and costs 17.6px of short-end
headroom — it can go back to 12rem the moment the seam is satisfied another way, and the seam
gate is vacuous anyway (§7).

---

## 4 · THE SHORT END — an exact law, width-independent

Height sweep, widths 320 / 360 / 375 / 390, sheet up, every tray face up:

| viewport height | card client | card content | over |
|---|---|---|---|
| 400 | 166 | 296 | **130** |
| 440 | 206 | 296 | 90 |
| 480 | 246 | 296 | **50** (the 320×480 cell) |
| 520 | 286 | 296 | 10 |
| **560 and up** | 296 | 296 | **0 — FIT** |

The client height is `vh − 234` below the cap at EVERY width from 320 to 390, and 234 is the
card's own derivation: `--sheet-chrome` 209.6 + 1.5rem 24 = **233.6** (`scene.css:496`). So:

    the portrait card fits ⟺ vh ≥ 296 + 209.6 + 24 = 529.6  →  vh ≥ 530px

and the landscape arm, whose chrome is `--sheet-chrome: 4rem` (`scene.css:565`) over a 260px
tray, fits at **vh ≥ 348** — which is why 844×390 and 900×500 pass and 360×400 does not.
**Three levers, all priced**: every px off the tallest tray, every px off `--sheet-chrome`
(reverting it to 12rem buys 17.6 and moves nothing else, §3), and every px off the 1.5rem.
Reverting the chrome alone takes the floor to 512px, which is under every shipping phone's
portrait height (the iPhone 5's 568 is the oldest live rung) and under 320×480 by 32px.

The declaration to write is therefore small and honest: **the no-scroll law holds at vh ≥ 530
portrait / ≥ 348 landscape; below that the card keeps `overflow-y: auto` as the safety it has
always had.** State it, gate it at the two cells either side of the boundary, and the row is a
declared limit rather than an unpriced regression.

---

## 5 · THE 32 ESTATE ROWS — enumerated, classed, and all of one kind

`npx vitest run src/games/shared/GameControlPanel.test.ts` in the worktree: **23 failed, 11
passed (34)**. Every failure is "the subject moved", not a behaviour change:

| suite | rows | why | the re-aim |
|---|---|---|---|
| touch play tools | 5 | `no button[aria-label="Undo last move"] in the fold's play-verbs band` (×4) — the tools teleport to `#board-edge-tools` and a standalone mount has no berth | the harness mounts the berth, or the rows move to a scene-level spec |
| the copy acts | 5 | `Unable to get .icon-sublabel within <button class="icon-btn peek-chip">` — the chip renders `.peek-chip-word` alone now | re-aim at the chip's word + the root `role="status"` that still speaks |
| the zone grammar | 8 | wells, eyebrows, tapes: `expected [] to have a length of 4`, `expected [] to deeply equal ['Size','Level']` | re-aim at the tablist, the tab words and the row captions |
| the keys fold | 2 | `Unable to get button.info-btn` — the `i` retired into the desk's `keys` tab | re-aim at the tab, desk-only |
| hold-to-peek | 2 | `Unable to get .peek-hold-surface` — deleted with the `BoilDivider` | re-aim at the peek chip, which carries the same recognizer (`PEEK_HOLD_MS` 350 / `PEEK_SLOP_PX` 10, `:279-280`) |
| pending state | 1 | the solve/deal scribble hosts moved | re-aim |

Plus `e2e/zone-grammar.spec.ts` 9 rows (× 2 engines) — **9 + 23 = the charter's 32** — and
`access.spec.ts` 2.1 / 2.3 and `a11y.spec.ts` 3.4 beside them. Two of these are more than
book-keeping and the spec should say so: the play tools can no longer be asserted from a
GameControlPanel unit mount at all (they live in another component's berth), and the peek chip
lost its `.icon-sublabel`, which is the node five copy rows read the outcome from. The spoken
path survives (`.copy-status`, `:1154`); the VISIBLE one is gone and that is a copy decision,
not a re-aim.

---

## 6 · THE UNION AREA — CLOSED, on a built dist, both engines

The pass-1 caveat ("read on the dev server; the seal must re-derive it from the built dist") is
discharged. `npx vite build --outDir dist-pass2-ctrl-tabs` in the worktree (private cacheDir),
previewed on 127.0.0.1:4236, then:

    PLAYWRIGHT_BASE_URL=http://127.0.0.1:4236 npx playwright test \
      --config=playwright-throttle.config.ts --project=filter-census-chromium --project=filter-census-webkit

**12 passed (8.0s)** — G3.1 the exact-match census, G3.3 the coarse regime, G3.2 both arms,
G3.5 both hover regimes, chromium and webkit, with `FILTER_BUDGET_TOTAL` **5** and
`FILTER_BUDGET_UNION_AREA.coarse` **5702** (row 45572 unmoved). `filter-census` is one of six
specs that already ride the bundled-preview config (`playwright.config.ts:9-10`), and an
external `PLAYWRIGHT_BASE_URL` suppresses its build+preview (`playwright-throttle.config.ts:78`)
— so this is the estate's own route, not a lane invention. The seal can re-run it verbatim.

**One hazard the cure must carry.** `filter-census`'s counting rule is explicit that
"opacity-0 and **visibility-hidden** surfaces DO count" while `display: none` does not
(`e2e/filter-census.spec.ts:38-41`). The family's hidden trays are `visibility: hidden`, so the
three trays a reader cannot see are inside the census by construction. Nothing in them carries a
filter today; the moment one does, the budget grows silently by three. Name the mechanism in
`filterBudget.ts` where the count is declared.

---

## 7 · THE FLOOR, THE DESK, AND THE REST OF THE LIST

**The floor's ink, measured** (chromium, light, composited over each act's own ground):

| act | rung | ratio | ground vs card |
|---|---|---|---|
| `deal` — the declared primary | 14.00px | **4.66** | 1.00 |
| `clear` · `fill` · `solve` · `share` | 14.00px | **4.66** | 1.00 |
| `dealt ⊪` (the receipt) | 16px | 5.24 | 1.00 |
| **`peek`** — a hold-to-reveal convenience | 16px | **17.36** | 1.12 |

The primary reads identically to the four secondaries and the least consequential act is 3.7×
louder than all five. Three levers exist and none is a new token: the rung (`--type-act` is
already `--type-small`, 16px at 390 coarse, against `--type-verb`'s 14), the ink (the floor's
verbs write `--color-muted-foreground`; `--color-foreground` is 19.45), and the washi chip
(which is why `peek` shouts — it is the only act with a ground, at 1.12:1).

**The desk floor wraps, and the rail pin is why.** At 1280×800 the bar is **232.22 × 134.84**
with its acts on two rows (y 532/536/549 then 600/606); at 390 it is 374 × 79.17, one row. Six
acts at ~46px plus gaps need ~300px and the pinned 324.22 rail leaves the bar 232.22. The wrap
is not an accident of the desk — it is the price of §2.6's pin, and the two rows must be priced
together in the same ballot (§8).

**The remaining rows, each with the fact the synthesizer needs:**

| row | the fact |
|---|---|
| `--type-group-title` is consumer-less | exactly one consumer left: `.section-heading { font-size }` (`typography.css:373`); its only template is `StagingBand.vue:140,154`, where `.staging-axis-label` (`:315`, an UNLAYERED SFC rule) overrides the size with `--type-small` and always wins over the `@layer components` rule. Retiring the token and that one declaration moves no glyph. The CLASS stays — StagingBand still needs its family, weight, casing and tracking. |
| `keep` / `peek` in DEPARTURES | departures are "printed, never red" (`check-font-coverage.mjs:44-46`), so the two strings sit in the one bucket the gate cannot fail on. `keep` is authored in the template (`:1017`), `peek` in `.peek-chip-word` (`:1830`). Cheapest honest cure: give them the `TAB_WORD` treatment — one named constant each (or one `FLOOR_WORD` map) and one extractor, which also makes R6 law 33 (ONE NAME per act) auditable. The whole `.washi-tag` group is departures too: no live `.washi-tag` survives in the panel. |
| the seam gate is vacuous | 292.06 against a 6.00 floor because the card shrank ~400px, not because a seam was decided. Report it in the vacuous column beside I3, and note that its own cure (`--sheet-chrome` +17.6px) is what costs §4 its 17.6px of short end while moving the board 0.00px (§3). |
| the spec says `display: none` | what ships is `inert` + `visibility: hidden` in one grid cell (`:1392`), and the source comment at `:208` still says `display: none`. Both must be corrected, and the correction is load-bearing twice over: it is what keeps the 0.00px card-height spread, it is what kills the live regions (§2), and it is what puts hidden trays inside the filter census (§6). |
| I4 stays RED | W1 §1.5's row. `armFor(...)` exists for `deal` (`:626`) and `clear` (`:650`) only; `fill` and `solve` have no arming site yet (`:585` says as much in the tree). Report beside, never claim. |
| I3 vacuous · heading-voice population 4 | proposed re-cuts in `instruments/README.md` §2 and §3, both able to fail. |
| the desk's double frame | structural and confirmable from the source: `GameScene.vue:195-210` wraps `.controls-card` in a `HandDrawnOutline`, and the panel adds a second, `.case-body` at 2.5 (`GameControlPanel.vue:779`). Two nested drawn rectangles is the desk's frame; the asymmetric gutter is the absolute flank strip inside the pinned rail. |
| the raised tab's missing edge | NOT a three-sided path. It is a 10px card-coloured `::after` laid across the join (`:1352`, and the code says so at `:1350`: "PASS-2 OWES THE ONE-PATH FORM"). `HandDrawnOutline` cannot omit a side today. Either extend the generator or write the patch into the spec as the mechanism — a ground-coloured rectangle over two strokes is a thing `prefers-contrast: more` and any future card-ground change will find. |

---

## 8 · THE TWO W2 BALLOTS, written as rows W2 can rule on

**BALLOT A — the rail's pinned inline-size.** The family MINTS a layout mechanic: `.controls-card
{ inline-size: 324.22px }` at ≥1024 and `330px` at ≥1440 (`scene.css`, the diff's own hunk), the
flank strip absolute inside it. Measurements in hand: the desk board's left edge moves |Δ| 0.00px
chromium / 0.05px webkit at 1280 and 0.00px at 1440 against the 0.5px the goldens allow, where
every unpinned arm walked the board −26 to −205px. Cost, newly measured: the pin is what leaves
the desk bar 232.22px and wraps the floor to two rows (§7). W2 is asked to rule on a literal per
rung, and the spec should say plainly that a derived width is the right shape and a literal is
what the prototype could prove.

**BALLOT B — retiring W2 §2.6's sticky tag.** The family deletes a LANDED mechanic: the sticky
tag with its four `--washi-tag-*` terms and the `data-under-bar` dissolve, plus the bar's sticky
arm, `--action-bar-h`, `scroll-padding-bottom`, `#fold-tools` and the portraitDock Teleport. The
structural argument is sound (a card that does not scroll has nothing to stick to) and r0
corroborates the tag's own weakness: only **one of four** tags was painted at the default desk
scroll offset, which is the hierarchy complaint M03/M05 make. But deleting a landed W2 mechanic
is not "the voice on top of it". Ask; do not assume. Note for the ballot: `#fold-tools`'s
deletion is what moves the portrait board 40.78px (§3), so B carries a golden re-mint with it.

---

## 9 · SKETCHES

    A · THE FLOOR'S ROW, ARMED — the cure (C2), 390×844, 48.78px tall
    ┌──────────────────────────────────────────────────────────┐
    │  clear the board?        keep      ╔═══════╗             │   keep : bare word, fg 19.45:1
    │  ^ 19.45:1, --type-verb   ^        ║ clear ║             │   clear: red 4.99:1 on BARE card
    │                        45.33×44    ╚═══════╝ 47.98×44    │          in a 2.5 drawn box, 19.41:1
    └──────────────────────────────────────────────────────────┘
      three channels: the sentence names the act · one verb is drawn, one is not · one is red
      remove any one and the confirm still reads.   the 8% face is GONE — it cost 0.79 of AA
      and bought a 1.19:1 cue that no mix percentage in either theme can lift over 3:1.

    B · WHERE THE LIVE REGIONS GO
      .controls-card                                  .controls-card
      └ HandDrawnOutline (the case)                    └ HandDrawnOutline (the case)
        ├ tabs [new game][pencils][checking][players]    ├ tabs  …
        ├ .tray[inert] visibility:hidden   ← AT: 0       ├ .tray[inert]           ← pixels only
        │   ├ .players-status  aria-live   ✗             │   ├ <p> the line       (no aria-live)
        │   ├ .players-roster  role=log    ✗             │   └ <ul> the rows      (no role=log)
        │   └ .players-alone   aria-live   ✗             └ .action-bar (the floor)
        └ .action-bar (the floor)                      .copy-status   role=status  ← the berth
      .copy-status  role=status  ← already here        .roster-voice  role=log     ← hoisted
                                                        .roster-status aria-live    ← hoisted
      measured: getByRole('log') 0 → 1 when the tray is raised, both engines.

    C · THE SHORT END, AS ARITHMETIC
      vh ─────────────────────────────────────────────────────────────────
       │  --sheet-chrome 209.6            (12rem = 192 at HEAD; +17.6 buys the vacuous seam)
       │  + 1.5rem 24                     (the outline's outset + the card's padding)
       │  ────────────────── 233.6 of chrome before a single control
       │  + the tallest tray 296          (260 in landscape, where the chrome is 4rem)
       └─ = 529.6  →  PORTRAIT FITS AT vh ≥ 530;  LANDSCAPE AT vh ≥ 348
          320×480 over by 50 · 360×400 over by 130 · every width 320–390 reads the same law

---

## 10 · RISKS, in the order they can sink the family

1. **The gallery's ribbon must move with the card's.** C2 changes the house's one confirm. If
   §15's face is re-cut in one file only the estate has two confirms, which is the defect the
   ribbon was extended to prevent. One commit, two files, noted at both ends.
2. **The `visibility: hidden` tray is three couplings in one declaration** — the 0.00px height
   invariant, the live-region death, and the filter census's counting rule. Any future cure that
   swaps it for `display: none` fixes the second, breaks the first, and silently changes the
   third. Write the coupling down where the declaration lives.
3. **The 40.78 cure and BALLOT B are the same decision.** If W2 declines the retirement,
   `#fold-tools` returns and the board goes back; if W2 grants it, the portrait goldens re-mint.
   Pricing them apart will produce a golden re-mint nobody authorised.
4. **The short-end declaration is a product limit, not a test cell.** 530px portrait excludes no
   shipping phone, but the spec must say it in the product's own words and gate it at 520 and
   560 — a limit nobody can red is a limit nobody keeps.
5. **The peek chip's lost `.icon-sublabel` is a copy loss hiding inside a test re-aim.** Five
   rows read the outcome from it. The spoken path survives; decide the visible one deliberately.
6. **The raised tab's `::after` patch is the family's memorable thing held together by a ground
   colour.** It is the one place where the idea depends on two surfaces agreeing on a fill rather
   than on geometry, and the code already books it as pass-2's debt.
7. **`--masthead-foot` has no publisher.** The seam derivation reads a variable nothing writes,
   so it is a floor wearing a derivation's clothes. Either W2's publisher lands or the `max()`
   should be spelled as the constant it actually resolves to.
8. **A control that does not fire is not a control.** This lane's own L3′ staleness arm failed
   its negative control and says so in its header (`instruments/README.md`); pass-1's per
   dimension tap-floor control had to FORCE the flex terms for the same reason. Every new gate
   in the cure owes a control that fires.

## 11 · HOUSEKEEPING

Servers: 4233 (dev, the worktree's build) and 4236 (preview, the built dist) — **both killed**.
Charter port 4232 was held by another lane at start; the next free in band was taken with
`--strictPort`, per the charter. Private vite `cacheDir` at
`.claude/worktrees/wf_e58b4764-0fc-39/.vite-cache-pass2-ctrl-tabs` (scratch config in
`probe/vite.scratch.mts`, never a committed `vite.config.ts` change). Build output
`dist-pass2-ctrl-tabs/` lives in the worktree; the MAIN tree's `dist/` was never touched (W8
§8.1's pin is unharmed). No product file in any tree was written. **Zero crops banked** — every
claim above is a number or a source cite, which is cheaper than a PNG and harder to argue with.
