# CTRL-COST · THE CONSEQUENCE LADDER — pass-2 RESEARCH

Section §10 (§15 at its centre; §1 §2 §8 §14 inside) · M01 M03 M04 M05 M12 M13 · read-only on
the product. Everything numbered below was measured by this lane, in this lane's own probes,
against the **pass-1 worktree** (`wf_e58b4764-0fc-40`, the standing diff) served at
**127.0.0.1:4235** — the charter's **4233 was already held** when the lane opened
(`readings/ports.txt`), so the lane took the next free port in the band under `--strictPort`,
with a private `cacheDir`, and verified the served tree in-probe (four `.cost-band` names, zero
`.action-bar`, zero `.tray-well`, five `.act-face`). Both engines everywhere. Server killed.

    probes     probe/lane2.mjs  heads · tapes · sentinels · fold · AA · scroll · desk tier 3
               probe/lane3.mjs  intrinsic names · OCCLUSION PREDICATE · timestamped keyboard · seam
               probe/lane4.mjs  pointer-vs-keyboard control · Escape's real reach · AA arms
               probe/lane5.mjs  the ring spend list · the `no` answer's own hit box
               probe/fraunces-cmap.mjs   a COPY of `check-font-coverage.mjs`, re-pointed (§7)
    readings   readings/lane2.json · lane3.json · lane4.json · lane5.json · fraunces-cmap.txt
    frames     none — every row below is a number (the wave's cap is text-first)

---

## 0 · The five things pass 2 did not know

1. **The second Enter DOES deal** — measured cleanly, both engines, and the whole keyboard
   dialogue is worse than "Escape is inert": **Escape closes the sheet and leaves the verb
   armed.**
2. **The sticky head paints over its own band's controls**: 71.5 % of each size chip at
   scrollTop 58 and 63.3 % of each level chip at scrollTop 116, and `elementFromPoint` at the
   chip's centre returns `section-heading` — both engines. The family's I3′ is green at all five
   states and has no instrument for this.
3. **The head CAN hold the berth**, but only one rank down: head 37.45 px + 4 px of air against a
   tape of 51.98 px as shipped and **39.39 px at `--type-tag`** — clearance **2.06 px**, zero
   added height.
4. **The `no` answer is 12.67 × 18.19 px** — 3.3 % of a 73.59 × 96.16 face whose other 96.7 %
   deals. It fails the pointer class too, not only the keyboard one.
5. **The AA ladder is analytic and validated**: 8 % → 4.20, 4 % → 4.59, bare card → 4.99 (the
   model reproduces two measured points to 0.01 in both engines).

---

## 1 · The ask: what a keyboard and an AT actually get (charter row 1)

Dock 390 × 844 coarse, board dirtied by `fill`, both engines, every read after a rAF + 400 ms
(`lane4.json`). The pointer path is measured beside the keyboard path as the control.

| path | press 1 | press 2 | board |
|---|---|---|---|
| pointer (tap · tap) | `armed = true` | `armed = false` | **dealt** |
| keyboard (Enter · Enter) | `armed = true`, focus stays on `.deal-btn` | `armed = false` | **dealt** |

**So a keyboard reader can ARM and can DEAL, and has no way to say no.** The three exits a
pointer has are all pointer-only: `pressedNo()` reads `e.target.closest('.act-answer')`
(`GameControlPanel.vue:508-511`), `disarmElsewhere` is bound `@pointerdown.capture`
(`:576`, `:736`), and the third is the 4,000 ms lapse (`MOTION.confirmWindowMs`,
`pencilConfig.ts` diff).

**Escape is not inert — it is worse than inert.** With the face armed and focus on `.deal-btn`
(`lane4.json` → `escape`, both engines):

    before Escape   armed true · sheet open · .drawer-case top 216
    after  Escape   armed TRUE · .drawer-case top 844 (the sheet is SHUT) · focus on .drawer-tab

The key is consumed by `GameScene.vue:176` — `@keydown.escape.stop="closeDrawer"` on
`#controls-drawer`. The reader who reaches for the universal cancel loses the whole card and
leaves a destructive verb armed behind it.

**Tab away does not disarm** (`lane3.json`): chromium moves focus to `Clear the board` with the
deal face still armed; PW-WebKit's Tab reaches text fields only (the pass's own banked trap), so
webkit's row is `focus: null` and the claim is chromium-measured, keyboard-真-unmeasured in
webkit — say so in the spec rather than claiming both engines.

**Nothing is spoken.** Six live regions exist in the card at that moment; the only non-empty one
holds `20 squares filled` from the fill (`lane3.json` → `spoken`). `no` is
`aria-hidden="true"`, `visibility: visible` — drawn, hit-testable, absent from the tree.

**And the drawn answer fails the thumb as well** (`lane5.json`, both engines):

    the `no` line          12.67 × 18.19 px   (3.3 % of the face)
    the face it sits in    73.59 × 96.16 px   (the other 96.7 % DEALS)
    tap floor              44 × 44            (`--tap-floor`, index.css:829-851)

`no` is a `<span>`, so G10's 28-target census never looked at it.

### What the cures cost, named

| cure | mechanism | where it lands | cost |
|---|---|---|---|
| **E1 · Escape disarms first** | a bubble-phase handler INSIDE `#controls-drawer` runs before the region's: `@keydown.esc="onEsc"` on the card wrap (the twin of `disarmElsewhere` on the same node, `:736`), `e.stopPropagation()` ONLY when something is armed | `GameControlPanel.vue` wrap | 6 lines; second Escape still closes the sheet, because nothing is armed then |
| **E2 · the name carries the instruction** | `aria-label` when armed: `press again to deal a new board. press escape to keep this one.` (M16: plain, lower case, no dash) | the two `:aria-label` bindings (`:1037`, `:1076`) | one string each |
| **E3 · the outcome is spoken** | `useLiveRegion()` utterance (`composables/useLiveRegion.ts`), one `askLine` region beside `copyLine` (`:370`): at the arm and at the disarm | one `sr-only` node | ACC-SIX's graft (one literal, two carriers) + a `check-live-regions` row |
| **E4 · Tab-away** | `@focusout` on the armed face, disarm when `relatedTarget` is outside it | the two act buttons | chromium-provable; state the webkit limit |
| **E5 · `no`** | either give it a real 44 × 44 box (the face grows, and the zero-reflow promise pays for the growth once) **or delete it** and let the name + region + `disarmElsewhere` + the window be the answer | `.act-answer` (`:1425-1452`, template `:1066`, `:1099`) | deletion also retires the 23.19 px reservation and the `aria-hidden` decoy |

The born-RED gate the section needs (beside G6): *with focus on an armed tier-3 face, Escape
disarms, the sheet stays open (`.drawer-case` top unchanged), a region speaks, and a following
Enter does not deal* — RED at HEAD and RED on the pass-1 diff, in both engines.

---

## 2 · The berth (charter row 2) — the head can hold it, one rank down

Measured at the dock, both engines (`lane2.json` `heads`/`tape`/`tapeCensus`, `lane3.json`
`names`):

    .cost-band-head      37.45 px tall (webkit 37.44) · padding-block 4 / 2.4 · margin-bottom 4
    the name             25.888 px Fraunces 800 at EVERY width (ROW 3 deleted)
    air under the head   4.00 px to the band's first control
    head + air           41.45 px  ← the berth's true height budget

| band | name width | head width | RIGHT SLACK |
|---|---|---|---|
| `looking` | 102.88 | 374 | **271.13** |
| `writing` | 101.27 | 374 | **272.73** |
| `starting over` | 176.50 | 374 | **197.50** |
| `players` | 101.38 | 374 | **272.63** |

(The slack is 0 as it ships because the `<h2>` is `flex: 1 1 auto` — `:1285-1288`. The numbers
above are the intrinsic widths read with `flex: 0 1 auto`, which is the one declaration the
berth needs.)

| tape (the card's four `wide` notes) | as shipped | at `--type-tag` rank |
|---|---|---|
| `normal writes a digit. corner and center write small pencil marks` | 51.98 × 240.48 | **39.39** × 240.36 |
| `show every digit that still fits in a cell` | 32.85 × 237.88 | **22.25** × 201.25 |
| `when your mistakes get checked` | 33.57 × 206.53 | **22.83** × 173.78 |
| `share this board and everyone writes on the same grid` | 53.61 × 240.80 | **41.02** × 240.59 |

**The finding: at the tag rank every note but one fits the 41.45 px budget, and the worst
(39.39) clears by 2.06 px.** `share this board…` at 41.02 clears by 0.43 px — too thin to ship
on, so it is a copy row (48 chars → ≤ 42) or the cap goes to 2 lines by rule. The line budget is
measurable: 41 characters measured 201.25 px at the tag rank → **4.91 px/char**, so
`starting over`'s 197.5 px of slack is **40 characters a line**, the other three bands' 271 px is
**55**.

Four berths were costed; only one is free:

| berth | height cost at the dock | verdict |
|---|---|---|
| **B1 · the head's right slack, note at `--type-tag`** | **0 px** (fits 37.45 + 4 with 2.06 to spare) | the candidate |
| B2 · the head reserves the shipped 51.98 px tape | +14.53 × 4 = **+58 px** → 744 → 802 > the 760 ceiling | refuted by arithmetic |
| B3 · restore `scene.css`'s 3.5 rem foot berth | +40 px → 784 > 760 | refuted |
| B4 · CTRL-RULE's `#card-foot` (outside the scrollport) | 0 px inside the port, `--card-foot-h` off the cap | the charter reserves it to RULE; name it as the fallback, do not build it |

Two mechanics the berth must respect, both landed and both measured here: the tape is
`position: absolute` inside its own button, so it can never resolve against a SIBLING sticky head
by CSS alone — the note has to become **one node per band, living in the head**, driven by which
control is hovered or focused (which is also what cures the critic's third reading: the note is
1.5 to 3 bands away from its verb today, −181.2 / −249.9 / −318.1 px). And the card's own fade
sentinels are **38 px** tall (`::before` and `::after`, `lane2.json` `sentinels`), which is the
one strip where W2 §2.3 already rules that a pinned tape reads on paper.

---

## 3 · The new RED nobody has measured: the pinned head occludes its own controls

`lane3.json` → `occlusion`, the graft predicate (area **and** `elementFromPoint`), dock 390,
both engines, identical to 0.1 px²:

| scrollTop | control | box | covered | covered frac | centre hits |
|---|---|---|---|---|---|
| 58 | `4×4` | 60 × 44 | 1887.2 px² | **0.715** | `section-heading` |
| 58 | `9×9` | 60 × 44 | 1887.2 px² | **0.715** | `section-heading` |
| 58 | `16×16` | 84 × 44 | 2642.1 px² | **0.715** | `section-heading` |
| 116 (bottom) | `Easy` | 72 × 44 | 2004.8 px² | **0.633** | `section-heading` |
| 116 | `Medium` | 96 × 44 | 2673.0 px² | **0.633** | `section-heading` |
| 116 | `Hard` | 72 × 44 | 2004.8 px² | **0.633** | `section-heading` |

This is CTRL-RULE's species (its pinned head cut `Normal` 38.8 %) at **nearly twice the
coverage**, inside the family whose whole argument is that the name must stay on screen. Every
gate reads green through it: I3′ asks only which band owns the port, the tap floor reads boxes,
`access` reads focus. The section's own graft is the instrument.

Three cures, none of them new mechanics:

* **C1** — `scroll-padding-top` is already 2.4 rem = 38.4 px ≈ the head's 37.45, so the KEYBOARD
  path is clear; the defect is the pointer/scroll path only. Making the band's first row start
  below the pinned head costs `scroll-margin-top` on the row, not height.
* **C2** — the head is opaque (`background: var(--color-card)`, `:1282`) at z 35 over the 38 px
  fade sentinel at z 30. Dropping the head's own paper and letting the sentinel do the
  dissolving would leave the name over live ink — the lie the estate deleted twice. Not this.
* **C3** — the head pins to the sentinel's own band (`top: calc(-1 * var(--card-pad-t))`, the
  lane the pinned TAPES held at HEAD, `SheetWashiLabel.vue:170-181`) so that whatever it covers
  is already inside the strip the fade owns. That is the mechanism W2 landed for exactly this,
  and it is one declaration; it must be re-measured with this predicate afterwards.

---

## 4 · The gates, run bare (charter rows 3 · 4 · 7)

    node scripts/check-theme-selectors.mjs     EXIT 1   1 UNWRITTEN ATTRIBUTES
    node scripts/check-font-coverage.mjs       EXIT 1   Fraunces · .section-heading: "players" misses "p"
    npx prettier --check src scripts           EXIT 1   src/games/shared/GameControlPanel.vue · scripts/check-font-coverage.mjs
    node scripts/check-copy-register.mjs       EXIT 0   0 em dashes · 0 unadmitted · 0 admitted
    node scripts/check-live-regions.mjs        EXIT 0   10 regions, none born speaking
    vitest run GameControlPanel{,.liveRegions}.test.ts  15 failed / 28 passed (43) — every failure in the first file

(Exit codes read BARE. Piped through `tail` they all print 0 — the estate's own banked trap, and
it bit this lane once.)

**`[data-under-bar]`** (`SheetWashiLabel.vue:190`, comment `:183-189`): its writer is the fold
measure pass at `GameControlPanel.vue:676-680` at HEAD, which iterates `.washi-tag` and compares
each tape's bottom against `bar.getBoundingClientRect().top - BAR_FADE_PX`. The bar is gone, so
the writer is gone and the rule cannot match. `ALLOWLIST` in the gate is **empty** (`[]`,
`check-theme-selectors.mjs:73`) and check 3 reds a stale entry, so **delete the rule with its
comment** — an allowlist entry would have to claim a writer that will never land. Gallery census
for the shared class: `StagingBand.vue:130` is the only other `anchor="tag"` consumer and
`data-under-bar` was never written outside the card's own `querySelectorAll`, so the deletion is
π on the gallery.

**The two other orphans**: `html.theme-turning .action-bar` (`index.css:665`, inside the
`prefers-reduced-motion: no-preference` theme-turn set) and the `.mobile-heading-btn` tap-floor
block (`index.css:831` min-height, `:848` min-width, with its T5-W3 reason at `:841-847`). Both
name classes this diff deletes; neither is gated, both are W6's *the dead die census-zero*.

---

## 5 · `players` misses a `p` (charter row 7)

Measured off the shipped subsets (`readings/fraunces-cmap.txt`, the gate's own `cmapCodepoints`
in a re-pointed copy):

    fraunces-subset.woff2     14,636 B   cmap 30    BCDLMNSabcdefghiklmnorstuvwyz + space
                                                    missing a–z:  j p q x
    patrickhand-subset.woff2   4,312 B   cmap 46    holds p (missing only j, x)

So the hand paints `players` and the display face cannot. The source TTFs are **not in this
tree** (`find` over the repo returns only the OFL texts), so a re-cut needs the network and the
P5 recipe; the honest byte estimate from the shipped file is **≈ 488 B per glyph** (14,636 / 30),
i.e. ~+3 % on that file, and it is an estimate, not a measurement.

Fourth-band candidates the cut ALREADY draws (tested letter by letter):
`together` · `guests` · `room` · `the room` · `others` · `hands` · `who else` · `sharing` ·
`everyone` · `visitors` · `this board` · `all hands` · `one board`. RED with `players`:
`people`, `company`.

The voice argument for the synthesizer: three of the four names are gerunds (`looking`,
`writing`, `starting over`), so **`sharing`** is the only candidate that keeps one register AND
is true of all four acts in the band (play together · share · who is here · leave). Its width is
close to `players`' 101.38 px, so the head's slack is unchanged. It is a copy ruling → U-10, with
`together` as the stated fallback.

---

## 6 · AA on the asked word (charter row 8)

The composite reader (CTRL-TABS' critic's, graft §3.6) reproduces the shipped ground exactly:
`color-mix(fg 8 %)` over `--color-card` computes (233.6, 233.6, 232.6) in both engines, and the
red word over it reads **4.20** (`lane2.json`, `lane4.json`; the prototype's painted-bytes number
was 4.22, the critic's 4.22 — same class, same verdict).

The analytic ladder, validated against two measured points to 0.01:

| ground | painted ground | `--color-red-ink` #d02a52 on it | verdict |
|---|---|---|---|
| 8 % (as specced) | 233.6 233.6 232.6 | **4.20** measured | RED |
| 6 % | 238.4 238.4 237.5 | 4.39 analytic | RED |
| **4 % (cure B)** | 243.3 243.3 242.3 | **4.59** analytic (4.57 painted, pass 1) | passes by 0.09 |
| **0 % — bare card (cure A while asking, or cure C always)** | 253 253 252 | **4.99** measured | passes by 0.49 |

`sure?` is `--type-caption` at weight 600 (14 px at the coarse floor), so the large-text
exemption does not apply and 4.5 : 1 is the floor. The `no` line reads **16.38** on the 8 %
ground (full ink, the cure the prototype already applied).

Cure A (the ground clears only while the face ASKS) is the one that keeps the ladder's rest-state
weight AND clears by 0.49; its price is the spec's sentence "the red is the only signal that
changes when the face arms" becoming two signals. Cure C is the chair's candidate wave law
(coupling §6.4 — four families measured the same class), and it costs the ladder one of its two
tier-3 markers, leaving stroke 2.5 vs 2.0 to carry the weight alone.

**Instrument trap, banked**: an injected `color-mix()` `!important` serializes as `oklab(…)` in
BOTH engines, and the pass-1 reader parses only `rgb()`/`color(srgb …)` — so a cure arm applied
that way reads as NO GROUND and every arm returns the bare-card number (probe 2 and probe 3 both
produced a false 4.99 for the 4 % arm). `probe/lane4.mjs` carries an oklab/oklch parser; the
graft should take it. Second trap: `page.addStyleTag` has **no `id` option** — the tags this lane
"removed" by id were never removed, so arms accumulate silently.

---

## 7 · The rest of the charter, measured

**Row 5 · the fine-pointer tier 3.** At 1280 × 800 fine, a dirty board, both engines: one press
on `deal` **acts** (`boardChanged: true`, `armed: false`) while the face still draws
`stroke-width 2.5` and the 8 % ground `rgb(246,246,244)`. The desk therefore wears the asking
face and does not ask. Either the arm drops `isCoarse` (`GameControlPanel.vue:524`, `:564`) or
the taxonomy says in writing that `starting over` asks **on coarse only** and that the heavy box
is weight, not a question — T4-WU/U3's own ruling, which is where `isCoarse` came from.

**Row 6 · the gallery re-rank does not exist.** `StagingBand.vue:311-315` gives
`.staging-axis-label` its own `font-family: var(--font-hand)` and `font-size: var(--type-small)`,
and those declarations are UNLAYERED while `.section-heading` lives in `@layer components`
(`typography.css:366-372`) — an unlayered rule beats a layered one whatever the specificity, so
the staging label never resolves `--type-group-title` at all. The critic's byte-identical
geometry at 390 and 1280 is explained at source. The token's consumers are exactly two
(`typography.css:368` is the only `font-size` reader; `StagingBand` and the card are the only
`.section-heading` nodes in `src/`), so the ROW-3 census closes at two, one of them overridden.

**Row 11 · the seam is `--sheet-chrome`'s, by construction** (`lane3.json` → seam, both engines):

| cell | `--sheet-chrome` | `.drawer-case` top | wordmark foot | seam | card h | card scrollH |
|---|---|---|---|---|---|---|
| 390 × 844 | 12 rem | **216** | 212.52 / 212.80 | +3.48 / +3.20 | 628 | 744 |
| 375 × 812 | 12 rem | **216** | 204.02 / 204.31 | +11.98 / +11.69 | 596 | **768** |
| 430 × 932 | 12 rem | **216** | 236.52 / 236.81 | **−20.52 / −20.81** | 716 | 744 |

The case top is **216 at every height** because the cap is `100dvh − 12rem − 1.5rem` and the
sheet is bottom-anchored: `dvh − (dvh − 216) = 216`. The masthead's foot scales with the
viewport. So the seam goes negative for ANY card on any cell whose wordmark foot exceeds 216 —
it is not this family's growth, and no card height can cure it. Ballot text for W2 §2.5: publish
`--masthead-foot` (CTRL-TAPE built the publisher; coupling §6.5) and derive the cap, or raise
`--sheet-chrome` to clear the tallest masthead (−20.5 px off every card), or declare 430 out of
scope. A second number for that ballot: at **375 × 812 the card is 768 px** against a 596 port —
above the 760 the family wrote as its dock ceiling at 390.

**Row 11 · `--fold-tools-h`.** Published **66 px**; the fallback literal is `3.5rem` = **56 px**
(`scene.css:585`). The publisher reads `fold.getBoundingClientRect().height`
(`GameControlPanel.vue:634-637`) on the same element that carries `min-height:
var(--fold-tools-h)`, so the measurement includes the floor it set: across a shrink-and-restore
resize sequence the published value stayed **66 px** while the row's content was reduced to
nothing, and with the min-height neutralised the row measures **0** while the sheet is up (the
verbs have teleported out). The value is monotone non-decreasing by construction. Cure: measure
the CONTENT (`.play-controls` box plus the fold's own padding) or neutralise the floor for the
measure frame; and either re-spell the literal at the measured rank or add the pairing gate the
`BAR_FADE_PX` comment models (`:659`).

**Row 11 · I3′ cannot be stressed with a roster.** Eight injected roster rows changed the card's
`scrollHeight` by **0** — `.players-roster` is capped (`max-height: 7.5rem; overflow-y: auto`,
`:1467-1476`), so `players` can never exceed ≈ 0.38 of the port while `looking` holds 0.32–0.495
at the dock's five states. The handover state is a SHORT PORT, not a long roster: at 900 × 500
the port is 284 px against a `looking` band of 361 px, so the bottom states must hand over. Stress
I3′ there and at 844 × 390.

**Row 9 · the unit battery, row by row** (run in the worktree; `GameControlPanel.liveRegions.test.ts`
passes whole):

| failing row | why it fails | the re-cut |
|---|---|---|
| `renders tappable undo / redo / hint … IN the fold band` | `expected 'undo' to be 'Undo'` | the sublabels are lower case now — re-cut the strings, and the fold's row is empty by design while the sheet is up |
| `renders a Fill button …` | `expected 'fill' to be 'Fill'` | same |
| `four wells, each a group named by its own visible tape` | `.tray-well` → `[]` | four `.cost-band`s named by their own `<h2>` |
| `the mobile tab is a heading WRAPPING a button` | `[]` | retires with `showTabs` |
| `six co-equal eyebrows become two` | got `['looking','writing',…]` vs `['Size','Level']` | the four band names |
| the three `drawn === announced` rows | `expected 4 to be 2` / `to be 1` | the counts move to 4 |
| `the checking well says one thing: its chips` | `undefined.findAll` | address the `looking` band's `checking` row |
| `a still press … still peeks` | `Target cannot be null` — `.peek-hold-surface` | the divider's new home |
| the five copy-act rows | `shareBtn` is `undefined`: `.action-verbs button.icon-btn` | **T9-W1/W3's SPOKEN contract** — re-address to the `players` band's share button |

**Row 10 · step 7 is bigger than the record says.** The dead grammar has **22 hits across SIX
spec files**, not 17 across five: `zone-grammar` 12, `viewport-law` 4, `font-census` 2, `access`
2, `join-language` 1, and **`share-truth.spec.ts:54`** — `.controls-card .action-verbs
button.icon-btn`, the same address the five unit rows use, missed by the pass-1 count.

**Row 10 · step 8 is a graft, not a build.** CTRL-TAPE's landscape quick set is already written:
`useMediaQuery("(max-width: 1023.98px) and (orientation: landscape)")` → a `quickBerth` computed
→ `<Teleport defer :to="quickBerth" :disabled="!portraitDock && !landscapeFlank">`, with
`#quick-set` inside a `HandDrawnOutline` on the tongue's flank (`DrawerTab.vue`, 48 × 92 per
tongue) and portrait REFUSED on a number (a strip there repeats two of the ribbon's three acts
and spends 184 of the board's 274 px of free edge). CTRL-COST's contribution is the FACE grammar
on that row (bare · bare · boxed at stroke 2, glyph at `--icon-tool` over the word) and the law
that the quick set is **tier 2 only** — never a tier-3 act one tap from a tool.

**Row 11 · the goldens.** The four are `cell-light`, `grid-corner-light`, `logo-light`,
`toggle-crest-dark` (`e2e/goldens/`, `snapshotPathTemplate` `{arg}-{platform}`), chromium only,
and none of them frames the controls card. **The run is fenced**: the MAIN tree's `dist` is W8
§8.1's frozen artifact (`index-9rZPzI5DEcpe.js`) and must not be rebuilt, `playwright-golden.config.ts`
spawns `npm run dev` on **:3000** unless `PLAYWRIGHT_BASE_URL` is set, and `npm run build` runs
`prebuild: npm run wasm`, which would write through the worktree's **symlinked** `node_modules`
into the shared wasm artifact. The safe recipe: `npx vite build` in the worktree, preview it on a
port in the lane's band, and pass `PLAYWRIGHT_BASE_URL`.

**The `--ring-ink` spend list** (`lane5.json`, both engines): the dock card holds **23** focusable
controls; **5** carry the authored ring (the boxed faces, `index.css:896-903`, currently a local
45 % mix) and **18** fall back to the UA ring — `4×4 · 9×9 · 16×16 · Easy · Medium · Hard ·
Normal · Corner · Center · Off · On · Off · Ask · Live · Undo last move · Redo move · Play
together · Share board link`. Consume `--ring-ink` (fg 50 %, §3.5) on all 23 and re-point the 45 %
literal to it; §6 owns the token, this lane only reads it.

---

## 8 · Three sketches

**A · the berth that costs nothing** (dock, numbers measured)

    ┌ .cost-band-head · sticky top:0 · z35 · opaque card ────────────────── 37.45 ┐
    │ looking                                    ┆ show every digit that still  │
    │ 25.888 Fraunces 800 · 102.88 wide          ┆ fits in a cell               │
    └────────────────────────────────────────────┴──────────────────────────────┘
      ├──────────── name ────────────┤├──── right slack 271.13 ────┤   note @ --type-tag
                                                                       22.25 tall, 201.25 wide
      ─ 4.00 px of air ──────────────────────────────────────────────────────────
    ┌ the band's first control ───────────────────────────────────────────────────
      budget = head 37.45 + air 4.00 = 41.45      worst note at tag rank = 39.39
      clearance = 2.06 px                          `starting over` slack = 197.50 (40 chars/line)

**B · the RED the pinned head is drawing right now** (scrollTop 116)

    port top ─────────────────────────────────────────────────────────
    ┌ looking ──── pinned head, opaque, z35 ────────────────────────┐
    │ looking                                                        │  elementFromPoint at each
    ╞════════════════════════════════════════════════════════════════╡  chip's CENTRE returns
    │▒▒▒ Easy ▒▒▒│▒▒▒▒ Medium ▒▒▒▒│▒▒▒ Hard ▒▒▒│   63.3 % covered     │  `section-heading`
    └────────────────────────────────────────────────────────────────┘
      2004.8 px²      2673.0 px²      2004.8 px²     (58 px up: 71.5 % of the size chips)

**C · the ask, and the two answers a reader cannot reach**

                    ┌ .act-face  73.59 × 96.16 ─────────┐
       press 1  →   │   🎲                              │
       (pointer     │  ┌ 1×1 grid ──┐  deal → sure?     │   Δ[0,0,0,0] — the centre HOLDS
        or Enter)   │  └────────────┘  30.81 × 14       │
                    │        no   12.67 × 18.19  ← 3.3 %│   tap floor 44 × 44 · aria-hidden
                    └───────────────────────────────────┘
       press 2  →   DEALS — pointer AND keyboard, both engines
       Escape   →   closes the sheet (case top 216 → 844), the face stays ARMED
       Tab      →   focus leaves, the face stays ARMED
       4,000 ms →   the only exit a keyboard reader has

---

## 9 · Risks the synthesizer must price

1. **The head's berth changes the note's OWNER.** One note node per band in the head, driven by
   hover/focus, is a new wiring (not a new mechanic): the `aria-describedby` target ids move with
   it (`playersHintId` at `:1120-1131`), and `check-live-regions` must not see a region born
   speaking.
2. **A note in the head must not cover the NAME.** The cap is the slack, per band, and
   `starting over` is the binding one at 197.50 px.
3. **Deleting `no`** retires a drawn affordance the owner has seen; keeping it means a 44 × 44
   box inside a face that promises zero reflow. Either way it is U-10, and the record must show
   both numbers (12.67 × 18.19 today; 44 × 44 floor).
4. **Escape's ordering** is load-bearing: stop propagation only when armed, or the drawer loses
   its own Escape and W2's `@keydown.escape.stop` row silently changes meaning.
5. **The occlusion cure may move the pin**, and the pin is W2 §2.6's landed mechanism — a
   `top` change is a re-measure of I3′, the fade sentinels and the seam, not a one-liner.
6. **The golden run can damage W8**: never `npm run build` in the main tree while §8.1 is in
   flight, and never let `playwright-golden.config.ts` fall back to :3000.
7. **The AA cure interacts with the ladder's weight**: bare card (4.99) deletes one of tier 3's
   two markers; 4 % (4.59) keeps both and clears by 0.09, which is not a margin the estate has
   accepted before.
8. **The composite reader is blind to `oklab(…)`** and `addStyleTag` has no `id` — two ways this
   lane produced a false GREEN before it produced a true number.
9. **PW-WebKit's Tab reaches text fields only**, so every Tab-away row is chromium-measured; say
   so rather than claiming both engines.
10. **The 4,000 ms window shadows every keyboard measurement** — probe 2's first keyboard read
    was confounded by it. Every arm/answer reading must carry its own elapsed ms.
