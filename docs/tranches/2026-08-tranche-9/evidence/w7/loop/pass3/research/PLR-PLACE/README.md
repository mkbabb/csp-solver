# PASS-3 RESEARCH · PLR-PLACE · The seating chart (§11, M14)

Read-only lane. No product file edited, no server started, no port taken, nothing committed.
Every number below is either read off a file at the named line, banked in `pass2/` (cited with
its file), or DERIVED from source and checked against banked readings — derivations are labelled
as such and carry their residual. Base for every file:line: **`74a2b5d9`** (the W7 execution
fold) on the main tree; prototype lines cite the pass-2 worktree
`.claude/worktrees/wf_8630d340-e56-54` (untracked new files + `git diff`), which is the pass-2
record and is not edited here.

Read first: `pass3/CHAIR-RULINGS.md`, then `pass2/charters/PLR-PLACE.md`. The chair moved the
base and moved this family's scope (§6.9 · §6.12); §2 below is the consequence.

---

## 1 · THE HEADLINE: the +4.7 residual is NAMED, and the two banked row censuses are both right

The charter's item 4 ("name the lap law's +4.7 term in the sheet's furniture or drop to a
table") closes on paper, with a closed form that fits **every** banked arm. Two readings that
looked contradictory are one variable apart.

### 1.1 · The variable is the POINTER REGIME, through the type scale

`typography.css:103-105` — `@media (max-width: 1023.98px) and (pointer: coarse)` raises
`--type-caption` 12→14px min and `--type-small` 14→16px min. At 390 wide:

| token | fine (`hasTouch:false`) | coarse (`hasTouch:true`) |
|---|---|---|
| `--type-caption` (`--type-tag`, `typography.css:31,123`) | `clamp(12, 11.36+0.21vw, 16)` → **12.179px** | `clamp(14, …, 16)` → **14.000px** |
| `--type-small` (`typography.css:32`) | `clamp(14, 12.8+0.25vw, 20)` → **14.000px** | `clamp(16, …, 20)` → **16.000px** |

The lobby's rows set `font-size` and no `line-height`, so they inherit the estate's body leading
**1.5** (`--type-leading-body`, `typography.css:53`). `.pl-row` carries `min-height: 1.4rem` =
22.40px (`PlayerLobby.vue:276`). So a row's height is `max(22.40, font-size × 1.5)`:

| row | fine 390 | coarse 390 |
|---|---|---|
| a NAMED row (`.pl-name`, `--type-small`) | max(22.40, 21.00) = **22.39** | max(22.40, 24.00) = **24.00** |
| `.pl-more` (`--type-tag`, `PlayerLobby.vue:300-304`) | max(22.40, 18.27) = **22.39** | max(22.40, 21.00) = **22.39** |
| `.lobby-state` (`--type-tag`, no min-height, `:256-261`) | **18.27** | **21.00** |

### 1.2 · The sheet's height, closed form, derived from the box

`.player-lobby` (`PlayerLobby.vue:218-243`): `padding: 1rem` (32), `border: 2px` (4),
`display:flex; flex-direction:column; gap: 0.5rem` (8 between each of the three children);
children = `.lobby-state`, `PlaceChart` (`v-if="open"`, box = `10.667 · N` CSS px —
`PlaceChart.vue:43-44`), `ul.lobby-rows` (`gap: 0.1rem` = 1.60, `:263-270`).

```
H(r, m) = 36 + state + 8 + 10.667·N + 8  +  24.00·r + 22.39·m + 1.60·(r+m−1)     [coarse]
                                            22.39·(r+m)        + 1.60·(r+m−1)     [fine]
          └──────────── base ────────────┘   └──── ul.lobby-rows ─────┘   (0 when r+m = 0)
```

r = named rows drawn, m = 1 when the `and N more` line is drawn. At 9×9 coarse the base is
`36 + 21.00 + 8 + 96 + 8 = ` **169.00** — the banked reading to the hundredth
(`pass2/prototype/PLR-PLACE/logs/phone2-chromium-844-L0.json`).

**Checked against all six banked arms, zero fitted parameters:**

| arm (source) | regime | r, m | model | measured | Δ |
|---|---|---|---|---|---|
| `phone2-*-664-L0` / `844-L0` | coarse | 0,0 | 169.00 | 169.00 | 0.00 |
| `phone2-chromium-664-L2` (= `-L5`) | coarse | 1,1 | 216.99 | 216.98 | −0.01 |
| `phone2-chromium-844-L2` | coarse | 4,0 | 269.80 | 269.78 | −0.02 |
| `phone2-chromium-844-L5` | coarse | 4,1 | 293.79 | 293.77 | −0.02 |
| `critique/PLR-PLACE/logs/crit-CD-{chromium,webkit}.json` | **fine** | 4,1 | 284.62 | **284.58** | −0.04 |

The critic's row census (`crit-scene.spec.ts:143-145`, `hasTouch:false, isMobile:false`) read
**every** row 22.39 including `and 4 more`, and it was right — in the fine regime every row is
floor-bound. The prototype's lap probe ran the `iPhone 13` descriptor (coarse), where a named
row clears the floor at 24.00 and `.pl-more` does not. Neither reading refutes the other.

### 1.3 · The lap law, exact

Grid top is `0.5·vh − 200.27` (131.73 @664, 221.73 @844 — 90.00px for 180px of viewport, twice,
`logs/lap-law-correction.md`). Sheet top `y = 47.75`. So

```
lap(vh, r, m) = max(0,  417.02 − 0.5·vh  +  24.00·r + 22.39·m + 1.60·(r+m−1))     [coarse]
```

| arm | model | measured | Δ |
|---|---|---|---|
| 664 × (0,0) | 85.02 | 85.02 | 0.00 |
| 664 × (1,1) | 133.01 | 133.00 | −0.01 |
| 844 × (4,0) | 95.82 | 95.80 | −0.02 |
| 844 × (4,1) | 119.81 | 119.78 | −0.03 |
| 844 × (0,0) | max(0, −4.98) = 0 | 0 | 0.00 |

**The +4.73 / +4.71 residual is therefore two named terms of the sheet's own furniture:**

```
residual = 1.60·(r+m−1)   −   1.61·m
           the .lobby-rows       .pl-more is 22.39 where the law charges 24.00
           gap: 0.1rem           (its --type-tag text never reaches the 1.4rem floor)
```

844×(4,0): 3 × 1.60 = **+4.80** (measured +4.73) · 844×(4,1): 4×1.60 − 1.61 = **+4.79**
(measured +4.71) · 664×(1,1): 1.60 − 1.61 = **−0.01** (measured −0.07). The gap DOES accumulate;
the critic's refutation of that candidate failed only because a 22.39 row plus a 1.60 gap is the
23.99/row the law already predicted, so the row census could not separate them.

**The cure is one line, and it restores the law AS WRITTEN.** `.lobby-rows { gap: 0 }` +
`.pl-row { min-height: 1.5rem }` (24px) makes every row 24.00 in both regimes and
`lap = 417.02 − 0.5vh + 24·n` exact — which is the form the spec wrote before the
implementation added a gap and a short row. The alternative the charter allows (drop to a
measured table) is strictly worse: the table would need a regime column.

**The law generalises across board sizes**: base = `73.00 + 10.667·N` coarse. 4×4 → 115.67 ·
9×9 → 169.00 · 16×16 → **243.67**. The 16×16 sheet is 74.67px taller, which is 74.67px more lap
on a phone, and no arm has ever measured it.

### 1.4 · What this costs elsewhere — READ THIS BEFORE ANY π CLAIM

The critic's π census ran at 390×844 with `hasTouch:false, isMobile:false`
(`crit-pi.spec.ts:56,64-67`). **That is not a phone.** The `+32.83` on `.controls-card` and
`.action-bar` is a fine-regime number for a coarse-regime surface: at coarse every chip in the
new `your cell` row takes `--tap-floor` 44px (`index.css:829-851`) and every caption is 1.8px
taller. The delta is HEAD-vs-prototype in one regime so its SIGN is safe; its MAGNITUDE is not
the shipped one. Pass 3's phone π arm reads `hasTouch: true` (both engines support it;
`isMobile` brings the meta-viewport in and is the thing the estate's own coarse gates set —
`zone-grammar.spec.ts:545-550`, `visual-regression.spec.ts:824-826`), declared once for both
pages, control `74a2b5d9`.

---

## 2 · THE SCOPE MOVED: the chair reseated this family (§6.9 · §6.12, coupling 12)

`pass3/CHAIR-RULINGS.md` §6.9/§6.12: the disclosure substrate — `@pointerdown.prevent`, the
opaque ground, `LOBBY_COPY`, `COPY_SOURCES`, the head registry, the roster out of the well — is
seated **ONCE under PLR-SELF**; `.player-swatch` is re-pointed once under PLR-SELF **with every
estate read moved in the same diff**; PLR-COUNT and PLR-PLACE "replay their centres (tally,
chart) on top of it and strip their own copies, naming the files stripped."

So of the pass-2 diff's 14 tracked + 6 new files, these hunks are **PLR-SELF's now** and must be
dropped from PLR-PLACE's pass-3 diff, named as stripped:

| file | hunk | why it leaves |
|---|---|---|
| `e2e/join-language.spec.ts` (`:168-180` of the diff) | the `.player-swatch` → `.pl-swatch circle` re-point | §6.9 — one re-point, under PLR-SELF |
| `e2e/multiplayer.spec.ts` (`lobbySwatchInks`, `:210`, `:595`) | same | §6.9 |
| `scripts/check-copy-register.mjs` | `COPY_SOURCES` | §6.12 substrate — and see §4.3, it may die outright |
| `src/App.vue`, `AttributionCard.vue` | the `#mark` slot + `closeAll` registry | §6.12 head registry |
| `PlayerSign.vue` | `@pointerdown.prevent`, the Escape binding, `@focusout` | §6.12 seam |
| `PlayerLobby.vue` | the opaque ground (`--color-popover`), `LOBBY_COPY` | §6.12 |
| `GameControlPanel.vue` | the roster out of the well (`sr-only` + the deleted CSS) | §6.12 |

**What is irreducibly PLR-PLACE's** and must be the whole of its pass-3 diff:

1. `PlaceChart.vue` — the pitch law (`PITCH = 32/3`, `PlaceChart.vue:43`), the dot, the ring,
   the one-state query, `data-peer`.
2. `useBoardShape.ts` + the one `watchEffect` write at `BoardHost.vue:108`.
3. `lastCell` in `useSession.ts` + the one write at `GameBoard.vue:457-460`.
4. `shareCursor` / `setShareCursor` + the `noteFocus` early return (`useSession.ts` diff), and
   the `your cell` zone row in `GameControlPanel.vue` — **the whole of the π cost**.
5. The sheet's furniture: `.lobby-rows`, `.pl-row`, `.pl-swatch`, `.pl-name`, `.pl-qualifier`,
   `.pl-more`, the chart's `v-if`, `ROWS`/`slots`, the settle timer (`WASH.placeSettleMs`).
6. Its own gate, `e2e/player-place.spec.ts`.

A synthesizer that writes the substrate again is writing a merge conflict the chair has already
ruled on.

---

## 3 · THE ESTATE, MEASURED (file:line facts at `74a2b5d9`)

### 3.1 · Surfaces this family touches

| surface | file:line | fact |
|---|---|---|
| the well's roster | `GameControlPanel.vue:1131-1180` | `ul.players-roster` `role="log"` `aria-label="who's on this board"`, `:tabindex="rosterRows.length ? 0 : undefined"`, rows `.player-row > .player-row-cells > .player-swatch + .player-name` |
| roster CSS | `GameControlPanel.vue:1649-1780` | scrollport `max-height: 7.5rem`, the `0fr↔1fr` fold, `.player-swatch` 0.7rem disc, six keyframes + a PRM lock — all of it deleted by the prototype |
| the zone row grammar | `GameControlPanel.vue` (`.zone-row` / `.zone-row-label` / `.zone-hint`) | the census's caption rank; `zone-row-stacked` when `!mobile` |
| the head corner | `App.vue:807-825` | two `AttributionCard`s (desktop `corner-left`, mobile `mobile-attribution`), both with a `ref` into `closeAll()` |
| the board's focus spine | `GameBoard.vue:457-460`, `:469-489` | `onCellFocus` (the one `lastCell` write site) and `onGridFocusout` |
| the tap floor | `index.css:821-851` | `--tap-floor` on `.page-root`; the coarse `min-height`/`min-width` arm names `.ctrl-btn`, `.mobile-heading-btn`, `.attribution-trigger`, `.error-note-retry` — **and no head mark** |
| the sheet's ground | `index.css:137` / `:366` | `--color-popover` `hsl(48 10% 98.5%)` / `hsl(24 7% 6.5%)` — opaque at the token |
| the peer-cursor ring idiom | `gameCell.css:229-241` | the ring the chart's `.chart-self` re-uses |

### 3.2 · The fold moved two things under this family's feet

1. **`GameBoard.vue:472-489` — `onGridFocusout` gained `if (isCoarse.value) pointedPos.value = null;`** (pick 3C-4b) and the coarse attribution tape now falls back to
   `unitFocused ? focusedPos : null` (`:517-522`). The seam's `@pointerdown.prevent` means a
   press on the sign does **not** fire the grid's `focusout` — so on a phone the tape stays up
   over the focused cell while the sheet opens over the board. Nobody has measured whether the
   sheet laps the tape. New row for the gate list (§5, G20).
2. **`GameControlPanel.test.ts:328-332` and `zone-grammar.spec.ts:84-87` now read
   `["marks", "what fits"]`** (pick B1b renamed `candidates`). The pass-2 diff adds `"your cell"`
   after `"candidates"`; the replay resolves TOWARD the fold →
   **`["marks", "what fits", "your cell"]`**, and `check-font-coverage.mjs`'s `zoneRowLabels`
   corpus group (`strings: ["marks", "candidates"]` in the prototype's hunk) takes the same
   correction.

### 3.3 · Primitives to reuse (named, with their site)

| primitive | site | what it gives |
|---|---|---|
| `generateGridBoilFrames(size, subgrid, VIEWBOX)` | `@pencil/grid/gridPaths` (used `PlaceChart.vue:48`) | the board's own frame + subgrid paths with the grain already baked in; pose 0 enrols no beat → **zero filter budget** |
| `HandDrawnOutline :pose="0"` | `@pencil/grid/HandDrawnOutline.vue` (`PlayerSign.vue:97-102`) | the estate's one box grammar, strokes `currentColor` |
| `SheetWashiLabel` | `@pencil/sheet/SheetWashiLabel.vue` | the zone hint's tape; `aria-hidden`, no role, not a `.washi-tag` (so the three-tape census cannot see it) |
| `mediaRef(q, default)` / `useCoarsePointer` | `@games/shared/useCoarsePointer` | `ROWS` and the hover-query fence, as refs |
| `OptionSelector` | the `your cell` chips | W2's landed option grammar with `aria-pressed` — never a new switch |
| `useLiveRegion` | `@/composables/useLiveRegion` | the six-region order the gate reads (`GameControlPanel.vue:443`) |
| `useJoinWash` `WASH` | `useJoinWash.ts:102-115` | the estate's one home for damping constants (`placeSettleMs`) |
| `claimHeadDisclosure` | PLR-COUNT's pass-2 (`critique/PLR-COUNT.md:151-152`) | one Set at the anchor for two popovers on one head corner — **graft, take it** |
| geometry at one origin, slot as `transform` | PLR-COUNT (`critique/PLR-COUNT.md:147-148`) | a middle departure moves transforms, not `d` — **graft for the dots** |
| the height law's FORM | PLR-SELF (`critique/PLR-SELF.md:36-40`, `H = 57.36 + 21.6r + 18.96m`) | two coefficients, one per row KIND — §1.2 is the same law for this sheet, and PLR-SELF's 21.6 = 16×1.35 / 18.96 = 14×1.354 independently corroborate the coarse type scale |
| the luminance sampler | PLR-SELF (`critique/PLR-SELF.md:42-52`) | canvas paint + WCAG 2.x against `--color-popover`; the `--ink-press-quiet` alpha voids a naive ratio |
| the boot-frame sampler | CTRL-TAPE's critic, `pass2/critique/CTRL-TAPE/probe/crit2.mjs §B` | only if the sign publishes from a ResizeObserver — **it does not**: `useBoardShape.ts` is a plain module ref written once per board. Graft NOT NEEDED; say so. |

---

## 4 · THE GATES — what is landed, what reds, what must be born-RED

### 4.1 · A THIRD landed estate gate reds, and no one in this family has run it

**`e2e/visual-regression.spec.ts:790-870` — "the iPad coarse card stays under the P1 seal".**
`PANEL_H` (`:782-788`) = `.controls-card .control-panel-wrap` bounding height at **1280×800,
`hasTouch:true, isMobile:true`**, asserted `≤ SEAL = 1227.5` (`:821, :851`) with an in-page
negative control that must break it (`:855-867`).

Its own comment (`:800-820`) prices the card: base **1142.38 chromium / 1142.34 webkit** with
the players well ablated, plus mark 13's **+82.42 / +82.43** for the well ⇒ shipped ≈ **1224.8**,
i.e. **~2.7px of headroom under the seal**. The `your cell` row is a fourth zone row in that
well, at the one cell where `!mobile` makes it `zone-row-stacked` (label over hint over a
44px-floored chip pair). It will not fit in 2.7px. *Arithmetic from the spec's own comment, not
a measurement — but the gate is landed, it is unrun by this family in two passes, and the
headroom is the gate's own number.*

Chair §6.4 and §6.1 bind the answer: no golden is re-minted in the loop, and a seal is re-priced
only as a DECLARED delta with its ablation. So the pass-3 options are (a) declare the re-price
with an in-page ablation of the `your cell` row at that exact cell, both engines, or (b) **move
the control** — which is the charter's own item 1 alternative and is now the cheaper branch.

### 4.2 · The two `zone-grammar` reds (charter item 3)

`zone-grammar.spec.ts:55` (`NAME_SELECTOR = ".section-heading, .washi-tag, .zone-row-label"`,
`:22`; rank → `caption` for a `.zone-row-label`, `:36-40`) and `:548`
(`countAt(names,"caption")`, coarse regime). Re-cut in the same diff as the row that reds them:
`["marks","what fits","your cell"]` and `3`. The unit twins are `GameControlPanel.test.ts:328`
and `:411` (`four hint tapes` → five). The e2e half also needs `check-font-coverage.mjs`'s
`zoneRowLabels` group to read `["marks","what fits","your cell"]`.

### 4.3 · The copy gate: `COPY_SOURCES` may be deletable outright

The fold's G17 grammar discovers spoken copy BY NAME (`check-copy-register.mjs:388-420`):
`SPOKEN_SUFFIXES` = Label · Text · Caption · Heading · Sublabel · Placeholder · Title · Note ·
**Line** · Word · Name · Message · Sentence · Announce · Announcement, with a SCREAMING_SNAKE
arm `(?:[A-Z0-9$]+_)*(?:LABEL|…|LINE|…)S?` and an optional plural `s`/`S`.

`LOBBY_COPY` does **not** match (`COPY` is not a suffix). **`LOBBY_LINES` does**
(`LOBBY_` + `LINES`), and the fold's own header states the rule it would satisfy ("a table of
sentences is named for what it holds, and an author writes that in the plural",
`check-copy-register.mjs:405-411`). Renaming the constant deletes the prototype's whole 13-line
`COPY_SOURCES` hunk from a gate file three lanes are patching (coupling 12) and buys the same
coverage from a mechanism the fold already proved with six planted reds. Verify with
`npm run lint:copy` (`--self-test`) and one planted dash inside the constant.

### 4.4 · `N other players` (charter item 8)

`lobbyCopy.ts:25` composes the one lobby string that VARIES as a template literal outside the
constant. Both gates miss it: `check-copy-register`'s `COPY_SOURCES` arm reads only literals
between the constant's braces, and `check-font-coverage`'s `lobbyStrings` derive is
`/^\s*\w+:\s*"([^"]*)"/gm` (prototype hunk) — a double-quoted value on its own line. Cure:
`others: "N other players"` inside the constant + `stateLine` doing `.replace("N", …)` like
`moreLine`/`quietLine` already do (`:29-36`). The derive's `N → 0123456789` substitution then
covers the digits, and the cut already carries every digit (`index.css:94-96`, read by
PLR-SELF's critic).

### 4.5 · The five roster specs (charter item 6) — what actually happens

| spec:line | selector | on the prototype |
|---|---|---|
| `join-language-prm.spec.ts:85-97` | `.controls-card .player-row` → `.player-name` `animationName`/`clipPath` | **passes vacuously** — the classes and keyframes are deleted, so `'none'` is trivially true on an `sr-only` list. Re-aim at the sign's PRM arm (`presence-ink-ms` → 0s) and at the OPEN sheet's computed duration. |
| `presence.spec.ts:48` | `.controls-card .players-roster .player-row` | survives (rows kept, clipped) |
| `session-substrate.spec.ts:29, 206, 225` | same + `.player-name` `allInnerTexts()` | survives — `sr-only` is a 1px clip, not `display:none`, so `innerText` still returns |
| `access.spec.ts:370` | same, `toHaveCount` | survives |
| `follow-still-authorship.spec.ts:71` | same, `toHaveCount(2)` | survives |
| `multiplayer.spec.ts:379` | `.players-roster` `toBeVisible()` | survives on Playwright's definition (non-empty 1px box) — **but it is now a gate asserting a clipped box is visible**, which is a lie with a green light. PLR-SELF's critic booked it; it is §11's leader's row, not this lane's. |

### 4.6 · `join-language.spec.ts:175` throws, precisely (charter item 13)

The prototype's re-point finds the first row whose `.pl-qualifier` text is not `you`
(`join-language.spec.ts` diff, `:172-176`). `.pl-more` carries class `pl-row`
(`PlayerLobby.vue:209`), holds no `.pl-qualifier` (so `?? ''` ≠ `'you'` → it MATCHES) and no
`.pl-swatch` — so `row.querySelector('.pl-swatch circle')!` is `null` and `getComputedStyle`
**throws** rather than failing. Re-cut the predicate to require the swatch:
`.find(r => !r.classList.contains('pl-more') && r.querySelector('.pl-swatch circle') && …)`.
(This selector is PLR-SELF's to land under §6.9; PLR-PLACE supplies the shape.)

A sibling of the same defect, unbooked: `multiplayer.spec.ts`'s `lobbySwatchInks` asserts
`new Set(swatches).size === 4` while the sheet draws `slots = tall ? 5 : 2` rows on
`(min-height: 800px)` (`PlayerLobby.vue:44, 140-146`). The e2e viewport is **exactly 800**, so
the gate sits on the boundary of its own media query: 799 gives 1 named row + `and 3 more` and
the assertion reds for a reason that has nothing to do with ink.

### 4.7 · PRM (charter item 2), with the specificity arithmetic

`PlayerLobby.vue:306-310` `@media (prefers-reduced-motion: reduce) { .player-lobby { … } }` is
(0,1,0); `.player-lobby.is-open` (`:245-254`) re-declares the whole `transition` shorthand at
(0,2,0). A media query adds no specificity, so the open sheet computes `0.15s, 0.15s, 0s` under
reduce (`crit-CD-*.json` `dur`). Cure: `.player-lobby, .player-lobby.is-open` in the reduce
block. Born-RED row: assert the computed `transition-duration` of the **OPEN** state under
`reducedMotion: "reduce"`, both engines, and delete the second selector to watch it red.
The estate's PRM route law is `check-motion-contract.mjs:13-28`: the new spec's head carries
`// PRM: frozen — emulateMedia({reducedMotion:'reduce'}) before goto` **and an actual
`emulateMedia` call in the file** — a `test.use` route reds check 3 (CH-65's own lesson).

### 4.8 · The r0 rows that moved — there are TWO, not one (charter item 12)

`r0/r2-accent-family/probe/hue-census.probe.ts:127-128` pins two authorship rows:

```
{ job: "authorship", site: "roster name",   selector: ".player-row .player-name", prop: "color" }
{ job: "authorship", site: "roster swatch", selector: ".player-swatch",           prop: "background-color" }
```

Both appear in all four `r0/r2-accent-family/census/census-*.json`. The prototype deletes
`.player-swatch` **and** the `:style="p.ink"` on the row **and** the `.player-row { color: var(--color-user-ink) }` rule, so the roster-name row loses its ink too. Only the swatch has ever
been reported. Propose ONE instrument diff under
`pass3/<stage>/PLR-PLACE/instruments/` re-pointing both rows at
`[data-lobby] .pl-row .pl-swatch circle` (`fill`) and `[data-lobby] .pl-name` (`color`), and
report **two** rows MOVED. Never re-cut r0 in place.

### 4.9 · `:focus-visible` (charter item 7)

`grep focus-visible` over the three new components: zero hits. The estate's dashed idiom exists
at `DrawerTab.vue:152` (`outline: 2px dashed currentColor`). Registry-v2 §2 ruling 4:
**`--ring-ink` has one minter** — MRK-LIVE (§6's leader) mints it in `index.css` beside
`--focus-ring-outset`, and every consumer writes `var(--ring-ink, currentColor)` (CTRL-FACE's
form). So the sign's rule is
`.player-sign-btn:focus-visible { outline: 2px dashed var(--ring-ink, currentColor); outline-offset: 3px }`.
Graft (CTRL-RULE, registry §3.4): a ring authored in a `<style scoped>` block compiles to
`:focus-visible[data-v-x]` and cannot match a CHILD component's control — here the button is in
the sign's own template so scoped is sound, and the gate counts CONTROLS, not rules.
Note the tension to declare: chair §6.5 strikes `var(--x, fallback)` for **measured** tokens
published by JS; `--ring-ink` is a minted CSS token whose sanctioned consumer form carries the
fallback (ruling 4). `--tap-floor`'s fallback at `PlayerSign.vue:143-144` matches the estate's
own precedent at `index.css:834, 849` and its stated reason (`:825-827`). Say which law governs
rather than leaving both cited.

---

## 5 · THE GATE LIST A SYNTHESIZER CAN WRITE DOWN (`e2e/player-place.spec.ts`)

One file, in `e2e/`, inside `tsconfig.e2e.json` and `lint:motion`'s census, with the `PRM:` line.
Every row born-RED with the deletion that reds it named.

| id | asserts | born-RED by |
|---|---|---|
| G2 self-ring | `.chart-self` count 1 after a REAL mouse press and after focus+Enter, both engines | delete `@pointerdown.prevent` (mouse arm) / `lastCell` (keyboard arm) |
| G3 seam | 0 new `cur` frames on the press; the ghost 1→1; `document.activeElement` (not `.closest()`) names the same cell before and after | same |
| **G20 tape × sheet (NEW)** | at 390 coarse with a peer-authored cell focused, the open sheet's box does not lap the attribution tape's painted box | the fold's `hoveredPos` fallback (`GameBoard.vue:517-522`) |
| **G21 press twice (NEW, graft)** | press the sign, press it again: it closes; read the BOARD both times (CTRL-COST's WebKit pre-click blur law, registry §3.5) | `@focusout` close racing `@pointerdown.prevent` |
| G22 PRM-open | computed `transition-duration` of `.player-lobby.is-open` under reduce = `0s, 0s, 0s`, both engines | drop `.is-open` from the reduce selector |
| G23 focus ring | the sign's `:focus-visible` outline style/width/offset, keyboard-focused | delete the rule |
| G8′ lap law | the closed form of §1.3 at ≥3 arms per regime, `max(0, …)` comparison, with the regime WITNESSED first (`matchMedia('(pointer: coarse)')`, the estate's own idiom at `zone-grammar.spec.ts:559-565`) | change `gap` or the rung |
| G7 budget | `filterBudget` exact-match, shut / open solo / open live, **off the built dist** — the estate's own titles say "built dist" (`filter-census.spec.ts:20, 300`) and pass 2's 6/6 was a dev server | any live filter |
| G1 rate | ≤40 moves/min/peer at 700 and at 800, **WebKit**, with the SLOW control completing | `WASH.placeSettleMs` → 0 |
| G24 count↔chart | the state line's count and the drawn dots reconcile: a peer with no ink, a peer at `p:null`, a peer on `Hidden` each carry a qualifier a reader can tell apart | delete the qualifier |

`WASH.placeSettleMs` is a module constant (`useJoinWash.ts:115`), so the 800 arm needs a tree
whose constant IS 800 — a re-run, not a page flag (the prototype's own recipe,
`prototype/PLR-PLACE/README.md:354-357`). Run it in the background with its log polled
(STALL LAW); the SLOW control is behind `PLC_SLOW=1`.

---

## 6 · SKETCHES

### 6.1 · The sheet's furniture, as the height law reads it

```
 ┌──────────────────────────────── .player-lobby ─────────────────────────────┐
 │ border 2                                                                   │
 │  padding 16                                                                │
 │   ┌──────────────────────────────────────────────────────────────────────┐ │
 │   │ .lobby-state   "4 other players"      h = --type-tag × 1.5           │ │   21.00 coarse
 │   └──────────────────────────────────────────────────────────────────────┘ │   18.27 fine
 │                              gap 0.5rem = 8                                │
 │   ┌───────────── svg.place-chart ─────────────┐                            │
 │   │ frame (2px·U)  · subgrid rules (1.25px·U) │   side = 10.667 · N        │   96.00 @ 9×9
 │   │  ·  ·  ◉  ·     ◉ = peer dot r4           │   (42.67 / 96 / 170.67)    │
 │   │  ·  ◎  ·  ·     ◎ = .chart-self ring w2   │                            │
 │   └───────────────────────────────────────────┘                            │
 │                              gap 0.5rem = 8                                │
 │   ┌───────────── ul.lobby-rows  (gap 0.1rem = 1.60) ────────────────────┐   │
 │   │ ● continental-rooster            you        .pl-row  max(22.4, 1.5·small) │ 24.00 coarse
 │   │ ● classic-leopon        41 seconds ago                                │ │ 22.39 fine
 │   │   and 4 more                                .pl-more  max(22.4, 1.5·tag)  │ 22.39 BOTH
 │   └──────────────────────────────────────────────────────────────────────┘ │
 └────────────────────────────────────────────────────────────────────────────┘
        H = 36 + state + 8 + 10.667N + 8 + Σrows + 1.60·(n−1)
        the +4.7 the law was missing = 1.60·(n−1) − 1.61·m
```

### 6.2 · The lap, and what the law is indexed on

```
   vh 664, coarse, room of 6                    vh 844, coarse, room of 5
   ┌─ head ─────────────────┐ y 47.75           ┌─ head ─────────────────┐ y 47.75
   │  [2] @mbabb            │                   │  [5] @mbabb            │
   │ ┌────────────────────┐ │                   │ ┌────────────────────┐ │
   │ │ sheet   ROWS = 2   │ │ H 216.98          │ │ sheet   ROWS = 5   │ │ H 293.77
   │ │ 1 named + and N more│ │                  │ │ 4 named + and N more│ │
   │ └────────────────────┘ │ bottom 264.73     │ └────────────────────┘ │ bottom 341.52
   ├────────────────────────┤ grid top 131.73   ├────────────────────────┤ grid top 221.73
   │▒▒▒▒ lap 133.00 ▒▒▒▒▒▒▒▒│ 18 cells          │▒▒▒▒ lap 119.78 ▒▒▒▒▒▒▒▒│ 18 cells
   │        the board       │ every tap         │        the board       │ every tap
   └────────────────────────┘ dismissed         └────────────────────────┘ dismissed
       grid top = 0.5·vh − 200.27  (90.00 px per 180 px of viewport, twice, to 0.01)
       ROWS = (min-height: 800px) ? 5 : 2  — so the law is indexed on DRAWN rows, not the room
```

### 6.3 · Where the +32.83 lands, and what it collides with

```
  390 × 844, the card                          1280 × 800 COARSE — the iPad cell
  ┌──────────────── .controls-card ──┐          ┌──── .control-panel-wrap ────┐
  │ …                                │          │  base (well ablated) 1142.38 │
  │ ┌ .zone-row  marks      h 44 ──┐ │          │  + players well       82.42  │
  │ ┌ .zone-row  what fits  h 44 ──┐ │          │  ────────────────────────────│
  │ ┌ .zone-row  your cell  h 44 ──┐ │ ← NEW    │  = 1224.80   SEAL 1227.5     │
  │ │  tape + [Shown][Hidden]      │ │          │    headroom      2.70 px     │
  │ └──────────────────────────────┘ │          │  + your cell (stacked, 44px  │
  │ …                                │          │    floored chips)   ≫ 2.70   │
  │ [ action bar ]  y 1370.23 → 1403 │ +32.83   │  visual-regression:851 REDS  │
  └──────────────────────────────────┘          └──────────────────────────────┘
   the invite verb (R5 F8: 111 px below a 664 fold) moves 32.83 further down
   — and 32.83 is a FINE-regime reading of a COARSE-regime surface (§1.4)
```

---

## 7 · RISKS, ranked by what they cost if ignored

1. **The P1 seal (§4.1).** A landed gate with ~2.7px of headroom, unrun for two passes, against a
   row that costs ≥44. If it reds at the fold instead of here, the family's whole `your cell`
   control is re-designed at the worst moment.
2. **The regime (§1.4).** Every phone number this family owns — +32.83, the lap law, the row
   census, G19's 53.13 × 47.75 — was taken in one of two regimes and none of them says which in
   its own file. A pass-3 number that does not declare `hasTouch` is not a number.
3. **Scope (§2).** Replaying the substrate re-opens six files the chair gave to PLR-SELF and
   guarantees a conflict at the §11 fold.
4. **`sr-only` gates that pass (§4.5).** Four roster specs and `multiplayer:379` go green over a
   clipped list. Green here means "nobody is watching this surface any more", which is exactly
   the state the copy gate's G17 repairs existed to end.
5. **The 16×16 sheet.** Base 243.67 px (§1.3) — 74.67 more than 9×9, on the viewport where the
   lap already eats 18 cells. Never measured at any row count.
6. **The subgrid rule's 4:1 model error** (`prototype/README.md:200`, spec 3.52/4.37 vs painted
   7.6–8.0). ACC-FIVE's critic banked the mechanism (registry §3.11): a 1px antialiased line
   never reaches its token, so every `color-mix` projection in the AA table is suspect in the
   same direction. Re-derive the other eight readings from painted bytes, not from the model.
7. **`e2e/player-place.spec.ts` still not existing.** Everything above is provable and enforced by
   nothing until it does. It is also the only place the `PRM:` contract can live.
8. **The `and N more` remainder vs the spoken roster** (prototype gap 12): at 664 a room of six
   draws two rows; the `sr-only` log holds every name; nothing asserts the two agree.
9. **T7-W2 A4** (chair §6.7): §11's leader writes the disposition; PLR-PLACE inherits it and must
   NOT carry the retirement in a test comment again.

## 8 · PRIOR ART (background only — the verdict is in §§1-4, from this codebase)

Collaborative editors converge on three moves this family already makes differently: stacked
avatar/facepile for "who", a coloured caret or cell halo for "where", and a presence dot for
"active". The literature's own accessibility note is the one this design answers head-on —
functional avatars need a real accessible name, not a decorative glyph — and the estate's answer
is stronger than the pattern's: the drawn chart is `aria-hidden` and the naming is carried by the
`role="log"` roster and the sign's own accessible name, so nothing is said twice. Nothing in the
prior art prices a disclosure against a focus seam, which is this family's actual problem.
Sources consulted (background): setproduct.com avatar-UI survey; WordPress/gutenberg PR #75652
(collaborator button / list popover / block highlight); intent-hq PR #2454 (workspace presence
dots + member rows); arXiv 2405.04873 (organising large groups — minimise-until-interacting).

---

## 9 · WHAT I DID NOT DO

No server, no browser, no crop (0 of this family's 4). The three numbers this research could not
produce without one are named for the prototype: the P1-seal re-price at 1280×800 coarse (§4.1),
the coarse π at 390×844 against `74a2b5d9` (§1.4), and WebKit's 800 ms rate arm (§5). The closed
forms in §1 are derived from source and checked against six banked readings; they are a
PREDICTION until the prototype re-measures the per-row boxes and the sheet in one frame, in a
declared regime — which is a single `evaluate` on an already-open sheet.
