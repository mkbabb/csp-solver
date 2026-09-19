# PASS-2 RESEARCH · PLR-SELF · Your mark, in your ink

T9-W7 §11 · §12 · M14. Read-only on product files. Every number below was taken on this lane's
own server — `127.0.0.1:4241`, `--strictPort`, private vite `cacheDir`, serving the pass-1
PROTOTYPE worktree `wf_e58b4764-0fc-46` — **both engines**, and the server is killed. Probes and
their raw lines are in `probe/`. U-10: this proposes; the owner disposes.

Chair's rulings read first (`../../CHAIR-RULINGS.md`). §6.1 binds this lane too: the mark's
focus-ring is not this family's to mint — see §6 below. §7's housekeeping is obeyed throughout;
nothing under `loop/r0/` or `loop/pass1/` was written.

---

## 0 · The one-line verdict

The family's sentence is TRUE and now it is also SEEN (`mark-and-self-row.png`). What pass 1 did
not know is that the mark's inversion is **two rules, not one** — hover AND focus-visible, so the
colour is off for every reader who is actually operating the control — and that the sheet's
neighbour is **the wordmark, not the board**: at six lines the sheet laps it by 12.2px on a fine
phone and 63.0px on a coarse one, and 19.9% of the desk sheet's box sits over it.

## 1 · What I measured myself

| # | reading | chromium | webkit |
|---|---|---|---|
| A | mark ink at rest, live, pointer parked away | `oklch(0.5 0.11 0)` | same |
| A | mark ink solo (room of one, after a peer leaves) | `color(srgb 0.15 0.15 0.15 / 0.68)`, label `no other players` | same |
| **F** | mark ink **hovered**, live | **`rgb(38,38,38)`** | **`rgb(38,38,38)`** |
| **F** | mark ink **:focus-visible**, live, settled | **`rgb(38,38,38)`**, outline `dashed 2px rgb(38,38,38)` | *rig cannot Tab — see §3* |
| F | the 400ms presence ink, sampled mid-flight | 10 intermediate frames, `t≈309→690ms`, oklab ramp **with alpha 0.686→1.0** | 6 frames, same ramp |
| L | Enter ×2 on a focused mark | `expanded false · false` | `false · false` |
| L | Space, then Escape, then Space | `true` → **`true`** → `false` | identical |
| L | focus stays on the mark through all five keys | yes | yes |
| **B** | `.attribution-trigger`, **coarse pointer**, Enter | **does not open** (`false`) | **does not open** (`false`) |
| B | …the same trigger, Space | opens (`true`) | opens (`true`) |
| C | a real press on the mark → the wire | `cur {p:null}` sent, activeElement `player-mark` | `cur {p:null}` sent, activeElement **empty** |
| H | desk sheet, six lines | (0, 51.8) 256 × 162.7, bottom **214.4** | identical |
| H | desk wordmark box | (129.9, 5.5) → (512.3, 117.5) | (129.8, 5.8) → (510.4, 117.8) |
| H | desk sun (`.corner-right`) left edge | **1072** (816px clear of the sheet) | 1072 |
| H | phone-fine sheet bottom / wordmark top | **186.5 / 174.3 — laps by 12.2** | 186.5 / 174.6 |
| H | phone-coarse sheet bottom / wordmark top | **206.5 / 143.5 — laps by 63.0** | 206.5 / 143.8 |
| H | phone sun left edge | 326 (70px clear) | 326 |
| N | quiet rung glyph CORE inside the sheet, vs its own paper | `rgb(107,107,107)` on 252 → **5.19:1** | 5.15–5.19 |
| N | pixels inside the sheet darker than 100 (i.e. a glyph over the bleed) | **0**, sudoku and futoshiki | 0 |
| N | wordmark bleed painted inside the state line's own box | 1,156 px of 4,180 (**27.7%**), sudoku · 1,048 (25.1%), futoshiki | same |
| G | wordmark bleed painted inside the whole desk sheet | 3,275 px of 36,864 (**8.9%**) | same |
| E | live-region roll, **playing** view | 6 (`board-voice · copy-status · margin-note · players-alone · players-roster · players-status`) | — |
| E | live-region roll, **gallery** view | **8** (+ `gallery-live · gallery-guard-live`) | — |
| E | the deck's own self swatch, in a room | `--color-user-ink: oklch(var(--peer-ink-l) 0.11 0.0deg)`, painted `oklch(0.5 0.11 0)` | — |
| H | mark accessible name vs sheet rows | `1 other player` over **2** rows | same |

`probe/r2-self.spec.ts` (A · B · C · D · E) · `r2-live.spec.ts` (F · G) · `r2-bounds.spec.ts` (H)
· `r2-aa.spec.ts` (J · K) · `r2-keys.spec.ts` (L · M) · `r2-ground.spec.ts` (N) ·
`r2-crop.spec.ts` (the frame). Config `probe/r2.config.ts`, vite `probe/vite.r2.config.mts`.

---

## 2 · The eleven rows, closed or scoped

### R1 · The keyboard — the defect is confirmed, and the gate has a rig constraint

`PlayerMark.vue:106` `@keydown.enter.stop="toggle"` on a `<button>`. `.stop` is
`stopPropagation`, **not** `preventDefault`, so the native activation click still fires: one
Enter runs `toggle` twice and nets zero. Measured off a programmatic focus (row L) so the claim
finally holds on both engines: `enter-1 false · enter-2 false · space true · escape true ·
space false`, focus never leaves the mark.

**Cure: delete the line.** `@click.stop` is the whole contract a button needs.

**Escape**: nothing listens. `App.vue:773 onGlobalKeydown` answers exactly `g`/`G`. The estate
already has the right idiom one file over — `GameGallery.vue:708 onWindowEscape`, bound on the
WINDOW, honouring `defaultPrevented`, with its one-owner-per-key rule written out at `:696-706`.
Bind the sheet's dismissal the same way, in `PlayerMark`, and return focus to the mark.

**The rig constraint the gate must carry** (new, and it is why pass 1's webkit row was thin):

- WebKit in this rig **will not Tab to a `<button>`** — 30 hops, `isActive: false` (row A).
  macOS full-keyboard-access is off by default and Playwright inherits it.
- A programmatic `el.focus()` **does not** set `:focus-visible` on either engine
  (row J: `focusVisible: false`, outline `none`, chromium AND webkit).

So a born-RED keyboard gate splits in two, and the split must be written down or the gate is the
next I3:

1. **the key contract** — `el.focus()`, then real `Enter/Enter/Space/Escape/Space`, asserting
   `aria-expanded` and that focus stays. Runs on BOTH engines. Red at HEAD-of-prototype today.
2. **the tab route + the ring** — `page.keyboard.press("Tab")` until `activeElement` is the mark,
   then read `:focus-visible` and the outline. **Chromium only**, with the WebKit skip carrying
   its reason inline (the estate's own `loud test.skip` idiom, CH-65's precedent).

### R2 · The hover lift — it is TWO rules, and the second one is new

`.player-mark:hover` (`PlayerMark.vue:144`) and `.player-mark:focus-visible`
(`PlayerMark.vue:149`) both set `color: var(--color-pencil-graphite)`. Both are (0,2,0); both are
declared AFTER `.player-mark.is-live` (`:136`), also (0,2,0). Later wins. Pass 1 caught the hover
arm. The focus arm is the same defect for a keyboard reader, and it is worse: the ring is
`outline: 2px dashed currentColor`, so **the ring paints graphite too** — measured
`rgb(38,38,38)` on a live mark, chromium.

**The cure that costs one binding, not a specificity war.** The lift is already a PRESSURE step
and nothing else: at rest the mark is graphite at 68% (`--ink-press-quiet`), hovered it is
graphite at 100%. The 400ms transition proves the estate already reads it that way — row F's
mid-flight samples travel `alpha 0.686 → 1.0` alongside the hue. So bind the identity once and
let the states spend only the alpha:

```css
.player-mark            { --mark-ink: var(--color-pencil-graphite);
                          color: color-mix(in srgb, var(--mark-ink) 68%, transparent); }
.player-mark.is-live    { --mark-ink: var(--color-user-ink); }
@media (hover: hover) { .player-mark:hover { color: var(--mark-ink); } }
.player-mark:focus-visible          { color: var(--mark-ink); }
```

No `.is-live` in the hover or focus selector, so no ordering trap can come back; one law —
**the lift raises pressure, never changes hue** — and it reads the same solo and live.

THE PRICE, and it must be measured before it is chosen: a live mark now RESTS at 68% alpha. The
40-index band is declared at `index.css:154-162` (worst 5.26:1 on background light, 9.56:1 dark)
for the OPAQUE ink; at 68% over the head's paper the icon is a 1.4.11 non-text mark needing ≥3:1,
not 4.5. That is ACC-FIVE's 40-index sweep with one new arm, and it is the first thing the
synthesizer should ask for. Two fallbacks if the band does not survive: keep the live mark opaque
and spend the lift on `--peer-ink-l` instead (one number per theme), or make the lift a POSE —
`generateRectBoilFrames(…, boilAmount>0, 2)[1]` is a second pre-baked path at zero filter cost
(`gridPaths.ts:213`), which is the house's own path-swap idiom rather than a new mechanism.

### R3 · The frame · TAKEN

`mark-and-self-row.png` (9,736 B, desk 1280, light, four at the table, sheet open, pointer parked
at (900, 740)): the stub beside `@mbabb` and the `dirty-coyote you` row are one rose. Mark colour
read in the same scene: `oklch(0.5 0.11 0)`. The claim is no longer only arithmetic.
The frame also shows the ground problem — `sud` runs straight through the sheet.

### R4 · The gallery deck's self swatch — declare it, do not scope it

`GameCard.vue:365` `.game-card-swatch`, CSS `:616-621` `background: var(--color-user-ink)`, bound
`:style="p.ink"` from `session?.players`. Measured on the deck with a room: style
`--color-user-ink: oklch(var(--peer-ink-l) 0.11 0.0deg)`, painted `oklch(0.5 0.11 0)`. At HEAD
self's ink is `{}`, so the same dot inherits `#2563eb` from `index.css:151`.

**Recommend DECLARE, not scope.** The deck's swatch row is the roster's echo (`GameCard.vue`'s
own comment: "the table, echoed beside the range"), so a self dot that disagrees with the head's
mark would be the F1 lie in miniature. One DELTA line in the spec, one frame, and the π claim
becomes "one surface moved, declared" rather than "the wave does not claim the deck".

### R5 · "Six" is a VIEW's roll, not the document's

Measured (row E): **playing = 6** · **gallery = 8**. The two extra are
`GameGallery.vue:1068 .gallery-live` and `:1074 .gallery-guard-live`. Two more are conditional
and were not mounted in either arm: `SolverErrorNote.vue:43` (`role="alert"`, `v-if`) and
`AnswerKeyLaminate.vue:204` (`sr-only role="status"`).

So the false comment is false twice over: `GameControlPanel.vue` would ship "three", and "six" is
only right if the view is named. **G6 pins the ROLL AND ITS VIEW**: the six playing-view nodes by
class, in order, plus an assertion that entering the deck adds exactly the two gallery nodes and
removes none. An expectation re-derived from the tree under test cannot fail (pass-1 critique §4);
a literal six-node roll can.

### R6 · The orphaned substrate — confirmed, and the reader to name

In the prototype, `arriving` and `departing` have **zero** remaining uses in
`GameControlPanel.vue` (comments only, at `:1100 :1103 :1139-1140`); at HEAD they are read at
`:1125 :1143 :1144 :1161`. The 740ms hold and the join/rejoin classification still run.

The honest reader is the one this family just built: **the sheet is where an arrival is now
visible**, so `arriving` belongs on the lobby row (a draw-in on a row that just appeared) or it
goes. Recommend: name the sheet as the reader and take the class with it, or delete both exports
plus the 740ms hold in the cure's own commit and re-aim `e2e/join-language-prm.spec.ts:97` (which
asserts `not.toContain('is-arriving')` and now passes vacuously). Not both, not neither.

### R7 · `BoardHost.vue:77` — restate by id

`if (!ink) continue`, with the comment at `:74-76` claiming it is the belt that keeps your own
cursor out of the ghost tier. With F1, self's ink is always defined, so that arm is dead;
`peerCursors` is keyed by the wire's `from` and never holds this page, which is the brace doing
all the work. **Restate by id** — `if (id === session.selfId.value) continue;` beside the ink
guard — so the comment and the code say the same thing and the guard survives any future keying
change. One line, and it is the cheapest row in the family.

### R8 · The copy gate — hand-checked clean, and the hole has a number

The five strings — `no other players` · `1 other player` · `N other players` · `you` ·
`N seconds ago` · `and N more` — carry no em/en dash and hit none of the 25 lexicon entries
(`check-copy-register.mjs:90-119`). M16-clean by hand, both clauses.

The gate did not read them, and the reason is structural, not local:

- `rendered()` (`:287-333`) reads template text nodes, `RENDERED_ATTRS`, `COPY_KEYS` and
  `NARRATION_CALLS` (`useLiveRegion` only). A computed template literal in `<script setup>` is
  none of those.
- `RENDERED_ATTRS`' regex is `(?<![:\w-])${attr}="…"` — the lookbehind **excludes a bound
  attribute by construction**. Measured across `src/`: **18 bound `:aria-label` against 22
  literal ones** — the jargon arm reads 55% of this estate's accessible names, and every
  accessible name this family writes is in the other 45%.

**The arm to propose (MOVED, banked under `instruments/`)**: `COPY_SOURCES`, the exact-match
sibling of `NARRATION_CALLS` — a declared list of identifiers whose initializer is copy
(`stateLine`, `qualifier`, `overflow`), every string literal in that initializer read as rendered
copy, and a declared name that leaves the tree REDS, the way admissions already close both ways
(`LEDGER.md`, "an exact-match census that reds in both directions"). Second row, estate-wide and
not this family's to land: a bound `:aria-label` whose expression is not a declared copy source
should RED, because today it is simply invisible.

### R9 · G8's successor — three bounds, and the third one is the finding

Pass 1 retired the desk-board bound correctly and proposed two successors. Both are right and
**both are the wrong pair**, because neither is the nearest neighbour:

| bound | desk 1280 | phone fine | phone coarse |
|---|---|---|---|
| sheet right vs the **sun** | 256 < **1072** (816 clear) | 256 < **326** (70 clear) | 256 < 326 |
| sheet bottom vs the **board** | n/a (a head disclosure floats — `@mbabb` has since T6.2) | — | 206.5 / 209.3 < **221.7** (12.4 clear) |
| sheet vs the **WORDMARK** | overlaps x[129.9, 256] × y[51.8, 117.5] = 126.1 × 65.7 = **19.9% of the sheet's box** | bottom **186.5 > 174.3 — laps by 12.2** | bottom **206.5 > 143.5 — laps by 63.0** |

Pass 1's "the sun starts at 326" is the PHONE sun; on the desk it is at 1072. And the wordmark —
which no pass-1 gate names — is under the sheet at every viewport and every count the design
supports.

### R10 · The sheet's real ground — the graft, taken, and honestly narrowed

PLR-COUNT's critic handed me "measure your sheet against the wordmark bleed (204 light / 61
dark), not the modal paper". Done, and the answer is more interesting than either side expected.

- The bleed is real and dense: **rgb(204,203,203)**, 3,275 px = 8.9% of the desk sheet's box,
  27.7% of the state line's own box. Reproduced on both engines and on two games.
- **Every quiet-rung glyph still lands on paper.** The glyph CORE is `rgb(107,107,107)` against
  its own paper `252` → **5.19:1**, sudoku AND futoshiki, and **zero** pixels inside the sheet
  are darker than 100 — which is what a glyph composited over the bleed would be.
  (A 2nd-percentile sampler reads 4.38 here and is WRONG: with a quarter of the box at 204 the
  percentile lands on anti-aliased edges. `probe/r2-keys.spec.ts` banks that misreading and
  `r2-ground.spec.ts` corrects it. Stated so nobody re-derives the bad number.)
- The hazard is arithmetic and it is one stroke away: `--ink-press-quiet` is 68% graphite, so
  over the bleed it composites to `204 − 0.68×(204−38) = 91`, and 91 against a local ground of
  204 is **4.23:1** — under the 4.5 AA floor.

So the family's AA claim is **true today by stroke luck**: the wordmark is a different set of
strokes per game (`sudoku` 382.4 wide, `futoshiki` 473.8) and the slugs are 3–13 characters, so
which glyph sits on which stroke is not a designed fact.

**The cure the estate has already written**: `PlayerLobby.vue:82-86` already drops the
translucency to `var(--color-popover)` under `prefers-reduced-transparency: reduce` and
`prefers-contrast: more`. Make that the DEFAULT for the lobby. The @mbabb card holds two lines
and a border; this holds a LIST down the page, and a list needs a ground it can be measured
against. It costs the "byte-for-byte the @mbabb pose" line and buys a reading that no game's
wordmark and no future slug can move. If the pose must be kept, the alternative is a gate that
asserts no quiet-rung pixel composites below 100 — which is a gate against luck, and luck is not
a design.

### R11 · r0's I3 — choose `:visible`, and say why it is not a re-wording

`r0/r5-player-mark/instruments.spec.ts:88-95`: `getByRole("dialog").or(locator("[data-lobby]"))`
resolves **two** nodes (the estate mounts `AttributionCard` twice — desk `hidden md:flex`, mobile
`md:hidden`), so the line throws a strict-mode violation. It can neither pass nor fail: it is not
a gate.

**Choose `[data-lobby]:visible`.** Reasons, in order:

1. One lobby for two marks needs shared state or a `Teleport` — a NEW mechanism, and the
   charter's constraint is explicit that W2's landed grammar is what this wave designs on top of.
2. Two head instances are the estate's own decided shape, written at `App.vue:804-807` (DOM order
   is tab order; the badge paints left of the celestial at every width). The instrument met the
   estate, not this family.
3. `:visible` is what the assertion always meant. Pass 1's own `quiet.spec.ts` ran that row GREEN
   on both engines (`lobbies: 2, visible: 1`).
4. It does not weaken: pair it with `expect(page.locator("[data-lobby]")).toHaveCount(2)` and an
   assertion that exactly one is visible, so the twin's state is now ASSERTED where before it was
   merely fatal.

Fixing a strict-mode throw is not re-wording a gate to pass (§7) — the row could not pass either.
Bank the diff under `instruments/` and report the r0 row **MOVED**.

### R12 · Two unit rows, five e2e specs

`GameControlPanel.liveRegions.test.ts:209` (the roster loses `sr-only` when it holds rows) and
`:221` (the roster is `tabindex="0"` when it holds rows) are exactly what the unconditional
`sr-only` roster retires. Re-cut both to the new law **in the cure's own commit**: `:209` becomes
"the roster is `sr-only` in every state"; `:221` becomes "the roster is never a tab stop — its
office is the log, its rows are read in the head". The five roster-touching e2e specs are
`join-language`, `join-language-prm` (see R6), `multiplayer`, `presence`, `session-substrate`.

### R13 · The 400ms ink · CLOSED, and M01's bill

**Mid-flight, both engines** (row F). Chromium: quiet through `t=265`, first motion `t=309`
(`oklab(0.276 0.0031 … / 0.686)`), arrived `t=714`. WebKit: first motion `t=341`, arrived `t=758`.
Ten and six intermediate frames respectively. The transition interpolates in oklab and carries the
ALPHA (0.686 → 1.0) as well as the hue — which is the measurement that licenses R2's cure.

**M01's bill, derived from measured line boxes.** `.lobby-row` and `.lobby-state` are
`line-height: 1.35`, measured 21.6px at 16px and 19.0px at 14.048px. The worst coarse pose is
state + 5 rows, h 165.3, bottom **209.3**, against a board top of **221.7** — 12.4px of headroom.
A one-rung raise (rows 16→18, state/qualifier/overflow 14→16) spends `1×2×1.35 + 5×2×1.35 =`
**16.2px**, landing the sheet at 225.5 — **3.8px INSIDE the board**, and 82px inside the coarse
wordmark. M01 and the six-line budget cannot both be honoured: either the compression drops to
five lines at coarse, or the state line does not take the raise.

### R14 · The palette demand → PAL-TIN

`r0/r5-player-mark/instruments-family-law.txt`, exit RED, **37 collisions in the first 16
indices**. The row to hand over, with its number: **peer index 0 (h = 0.0°) vs
`--color-solver-ink-1` #c2286e (h = 359.0°) — 1.0° apart, against a 12° law.** Index 0 is not a
random index: `inkCursor` starts at 0 and `mint` (`useSession.ts:536`) hands it to the first id it
sees, so **the host always wears it** — and with F1 the host wears it on the mark, on the self
row, and on the deck's swatch. Second-worst for this family's own surfaces: index 10 (h=295°) vs
`--color-solver-ink-2` #c4b5fd at **1.4°**, index 11 (h=72.5°) vs `--color-solver-ink-5` #92600a
at **0.2°**. Handed to PAL-TIN; this lane takes whatever lands and re-runs the family law bare.

---

## 3 · The grafts, taken

| graft | what it yielded here |
|---|---|
| PLR-COUNT · `useTallyStrokes` + the SET RULE | **Not applicable as built** — the stub is a FILLED path (`PlayerStub.vue`, `fill="currentColor"`, no stroke), so there is nothing to draw in and nothing to un-draw. The SET RULE still binds if R2's cure becomes a pose swap: re-arming the lift must never un-draw the rest pose. |
| PLR-PLACE · the FOCUSOUT SEAM | **Confirmed on my mark, both engines.** `GameBoard.vue:471-477 onGridFocusout → noteFocus(null)` → `useSession.ts:935`. A real press on the mark sends `cur {p:null}` on the wire: chromium (`active: player-mark`) and webkit (`active: ""` — WebKit does not focus a button on press, and the seam fires anyway because the cell input blurs). See §4. |
| PLR-COUNT · the popover's real ground | **Taken and narrowed** — R10. |
| ACC-FIVE · the 40-index sweep | **Requested with a new arm**: the band at 68% alpha, against the head's paper, 1.4.11 non-text ≥3:1. R2's cure is conditional on it. |
| the Enter double-toggle as a chronic row | **CH-70**, drafted below. |

## 4 · The focusout seam — measured, and it is a SUBSTRATE row, not a cure here

Measured (row C, both engines): focus a cell → `cur {p:0}`. Press the mark → `cur {p:null}`. So
opening your own roster tells the room you looked away and erases your own ghost on every other
board, for as long as you are reading it.

**And the estate has already ruled on this exact class, deliberately.** `App.vue:607-609`:

> Your ghost goes quiet while you browse (T8-W3): browsing the deck is not an act on the board,
> and a cursor left sitting on a cell would tell the room you were still there.

That is the same act with the same verdict — so the seam is the estate's decided law, not this
family's defect, and PLR-PLACE's framing of it as a bug is one step too strong. What is genuinely
new is that the deck UNMOUNTS the board while the mark leaves it visible: you are still looking at
the board, and the wire says you are not.

**Recommend: book it, do not cure it here.** One substrate row for all three PLR families — "a
head disclosure is not leaving the board" — whose cure is a single predicate at the ONE seam
(`onGridFocusout` ignores a `relatedTarget` inside the head), not three local patches. A family
that cures it alone would move a pixel on the other two families' surfaces, which is exactly what
§7 forbids. This lane's own gate stays honest by ASSERTING the seam rather than curing it, so the
day it changes, something red says so.

## 5 · The couplings, stated

- **F1** — this lane is on "colour on your own hand means someone else is here", with
  ACC-GRAPHITE. The claim is now measured end to end and cold: solo the mark is
  `color(srgb 0.15 0.15 0.15 / 0.68)` with the label `no other players`; two at the table and it
  is `oklch(0.5 0.11 0)` with `1 other player`, and the self row and the deck's swatch are the
  same `oklch(0.5 0.11 0)`. The guard that makes it safe is `authorInk` (`useSession.ts:402-413`),
  which skips the author **by id**, not by the emptiness of their ink, so no board digit moves.
- **`.player-swatch`** — this lane KEEPS it, per §7's ruling, and names the three reads that must
  be re-pointed in the same diff the day it goes: `e2e/join-language.spec.ts:175`
  (`getComputedStyle(peer.querySelector('.player-swatch')).backgroundColor`),
  `e2e/multiplayer.spec.ts:193`, `e2e/multiplayer.spec.ts:580`. Markup at
  `GameControlPanel.vue:1149` and `:1168`, CSS at `:1682-1688`. Six sites, three of them
  instruments — a two-line job once, an archaeology dig if it is done piecemeal.
- **§6.1, the focus ring** — the mark currently mints its own: `outline: 2px dashed currentColor`
  at `PlayerMark.vue:149-153`, measured `dashed 2px rgb(38,38,38)` live. Per the chair, §6 owns
  the token; this lane **reads, never writes**. Stated for §6's leader: on a live mark
  `currentColor` is the player's own walk ink at `--peer-ink-l` — so whichever value §6 ships must
  hold against a ring that is one of 40 hues at L 0.5 / 0.8, not against one colour. If §6's token
  is a fixed ink, this mark adopts it and R2's cure only needs the `color` half.
- **The count seam** — the mark's accessible name reads `1 other player` over a sheet of **2**
  rows (row F), and `3 other players` over 4 rows plus `and 2 more` counting the remainder of
  EVERYONE (row G). Three lines, three populations. Not wrong, but undeclared; PLR-COUNT's critic
  found the same seam one surface over. Declare once, in the spec: **the state line counts others,
  the list shows everyone, the overflow counts the remainder of the list.**

## 6 · A chronic row, drafted · CH-70

> **CH-70 · BUILD → T9-W7 §11** — `@keydown.enter` beside a native button activation is a
> double-toggle that nets zero. `.stop` is `stopPropagation`, not `preventDefault`, so Enter runs
> the handler AND the synthesised click. Two sites: `AttributionCard.vue:49`
> (`.attribution-trigger`) and, in the §11 prototype, `PlayerMark.vue:106`. On the attribution
> card the defect is MASKED on a fine pointer by the wrapper's `@focusin="onHoverEnter"` — but
> `useHoverCard.ts:48` stands the focus-open down on a coarse pointer, and `:47`'s comment cites
> that very path as the reason the handler exists. **Measured 2026-09-18, both engines, coarse
> viewport: focus the trigger → `aria-expanded false`; Enter → `false`; Space → `true`.** The
> comment is refuted by its own code. Owner = §11's lane at landing. Trigger/re-entry = any new
> `@keydown.enter` on a `<button>`; a grep of `src/` for `keydown.enter` is the one-line probe,
> and it must read 0 after the cure.

## 7 · Three sketches

**S1 — the lift is pressure, never hue** (R2's cure, one binding, four states)

```
            solo                     live (room ≥ 2)
          --mark-ink = graphite    --mark-ink = --color-user-ink
        ┌──────────────────────┬──────────────────────────────┐
  rest  │  ▪ 68%   quiet grey  │  ▪ 68%   quiet rose          │
        ├──────────────────────┼──────────────────────────────┤
 hover  │  ■ 100%  full grey   │  ■ 100%  full rose           │
  /     │          + ring      │          + ring              │
 focus  │                      │  ← the sentence SURVIVES     │
        └──────────────────────┴──────────────────────────────┘
          today: rest ▪rose  →  hover/focus ■GREY.  The one
          sentence is off exactly when the control is in use.
```

**S2 — what is actually under the sheet** (desk 1280, six lines, measured)

```
 x0        76   120        130                    256          512
  ├─────────┼────┼──────────┼──────────────────────┼────────────┤
  │ @mbabb  │ ▪  │                                              │  y 12
  ├─────────┴────┘                                              │  y 51.8  ← sheet top
  │ 3 other players ·········· ╱▓▓▓╲ ▓▓▓  ╱▓▓╲                  │  y 69.8  27.7% bleed
  │ ▪ dirty-coyote  you        ▓ s ▓ ▓u▓  ▓d▓  ← the WORDMARK   │  y 91.1
  │ ▪ grim-lemming             ╲▓▓▓╱ ▓▓▓  ╲▓▓╱     bleeds at    │  y 112.7
  ├────────────────────────────────────── 204,203,203 ──────────┤  y 117.5  ← wordmark bottom
  │ ▪ corresponding-bobolink        (clean paper 252 below)     │  y 134.3
  │ ▪ electrical-whitefish                                      │  y 155.9
  │ and 2 more                                                  │  y 177+
  └─────────────────────────────────────────────────────────────┘  y 214.4  ← sheet bottom
        19.9% of the sheet's box is over the wordmark's box.
        glyph over paper 107/252 = 5.19:1   ·   glyph over bleed 91/204 = 4.23:1
        today ZERO glyphs land on bleed. That is stroke luck, not design.
```

**S3 — the phone, where the lap is not theoretical**

```
        fine (390×844)                    coarse (390×844, dpr3)
   0 ┌──────────────┐ mark 39.8      0 ┌──────────────┐ mark 44
     │ ▪ sheet      │                  │ ▪ sheet      │
     │   6 lines    │                  │   6 lines    │
 174 │═══╤══════════│ ← wordmark   143 │══════════════│ ← wordmark top 143.5
 186 └───┴──────────┘ sheet 186.5      │   sheet      │
     laps by 12.2px                206 └──────────────┘ sheet 206.5
                                       laps by 63.0px
 221 ─ ─ ─ ─ ─ ─ ─ ─  board top    221 ─ ─ ─ ─ ─ ─ ─ ─  board top 221.7
     G8's proposed bound looks at THIS line. The wordmark is 78px nearer.
```

## 8 · Risks, ranked

1. **R2's cure trades a specificity bug for an AA bill.** 68%-alpha live ink has never been
   measured over 40 indices on the head's paper. If it fails the 3:1 non-text floor on any index,
   the cure must fall back to the `--peer-ink-l` step or the pose swap. **Ask ACC-FIVE first.**
2. **The lobby's opaque ground departs from "the @mbabb card's pose, byte-for-byte"** — the
   family's own stated idiom, and a visible change the owner disposes at the re-look (U-10).
   The alternative is a gate against stroke luck.
3. **The wordmark lap is a LAYOUT row, not only a contrast row.** On a coarse phone the six-line
   sheet covers 63px of the game's own name. No pass-1 gate names it; a cure that only raises the
   ground leaves the sheet sitting on the wordmark.
4. **M01 and the six-line budget are in direct conflict** (R13: 16.2px spent against 12.4px
   held). Whichever gives, it is a design decision, not a repair.
5. **The keyboard gate can become the next I3** if it is written as one test. WebKit cannot Tab
   to a button in this rig and neither engine sets `:focus-visible` on a programmatic focus — a
   single gate spanning both is either vacuous or flaky.
6. **`e2e/join-language-prm.spec.ts:97` passes vacuously today.** Whatever R6 chooses, that spec
   must be re-aimed in the same commit or the estate keeps a green test that asserts nothing.
7. **Index 0 is the host's**, and it sits 1.0° from `--color-solver-ink-1`. If PAL-TIN re-walks
   the palette, every number in §1 that reads `oklch(0.5 0.11 0)` re-mints — including the frame.
8. **The focusout seam is shared.** A local cure here moves PLR-COUNT's and PLR-PLACE's surfaces.

## 9 · Instruments proposed (MOVED — diffs under `instruments/`)

| r0 row | what moved | proposal |
|---|---|---|
| **I3** | the subject: the head now carries a mark, and the estate carries two lobby nodes | `[data-lobby]:visible`, plus `toHaveCount(2)` on the pair and exactly one visible. R11. |
| — | `check-copy-register.mjs` | `COPY_SOURCES`, the exact-match sibling of `NARRATION_CALLS`; and a RED on a bound `:aria-label` whose expression is not a declared copy source. R8. |
| — | **new, born-RED** | the key contract (both engines, programmatic focus) + the tab route and ring (chromium, loud skip on webkit). R1. |
| — | **new, born-RED** | the sheet clears the WORDMARK at every supported count, fine and coarse. R9. |
| — | **new, born-RED** | no pixel inside the sheet is darker than 100 — i.e. no quiet-rung glyph composites over the bleed. Only if the translucent ground is KEPT. R10. |

## 10 · Prior art — BACKGROUND ONLY (the verdict is the codebase's)

- **WordPress Gutenberg, "Show own presence in collaborative editing sessions" (PR #76413)** ships
  the OPPOSITE of F1: the current user's border takes the admin accent, deliberately held out of
  the collaborator palette, so you can always find yourself. Worth naming because it is a real
  shipped counter-position and F1 should be chosen against it, not in ignorance of it. The
  estate's answer is stronger for THIS product: the mark is in the head with nothing beside it to
  be confused with, and a fixed accent would make the mark say only "a feature exists" — the
  sentence §11 is built on is precisely that the colour ARRIVES.
- The same PR hides the cursor LINE for the current user and renders only the badge, to avoid
  doubling the native caret. That is `BoardHost.vue:74-77`'s reasoning arrived at independently —
  an argument for R7's RESTATE rather than a deletion.
- **WCAG**: hover is out of scope for 1.4.11 (`w3c/wcag` issue #400, discussion #3865), while a
  custom FOCUS indicator must clear 3:1. So R2's two arms are not one row: the hover inversion is
  a design defect, the focus inversion is also a conformance surface, and a ring drawn in
  `currentColor` must clear 3:1 against whichever of the 40 inks it inherits.
- `contrast-color()` (Rupert, 2026-01) is the algorithmic version of R2's "lift is pressure"; not
  proposed — the estate's `color-mix` ladder already is the house's mechanism and adding a second
  one would be a third name for a colour that has two (`index.css:145-148`'s own rule).

Sources: [Gutenberg #76413](https://github.com/WordPress/gutenberg/pull/76413) ·
[Gutenberg #75652](https://github.com/WordPress/gutenberg/pull/75652) ·
[w3c/wcag #400](https://github.com/w3c/wcag/issues/400) ·
[w3c/wcag discussion #3865](https://github.com/w3c/wcag/discussions/3865) ·
[WebAIM contrast](https://webaim.org/articles/contrast/) ·
[contrast-color()](https://daverupert.com/2026/01/algorithmic-hover-states-with-contrast-color/)

## 11 · Housekeeping

- Server: `127.0.0.1:4241`, `--strictPort`, `probe/vite.r2.config.mts` with
  `cacheDir: <worktree>/.vite-cache`. **Killed before this return** (no listener on 4241).
- Crops: **2**, 21,225 B total — `mark-and-self-row.png` (9,736 B) and `sheet-desk-6line.png`
  (11,489 B). Under the four-crop cap.
- Nothing written under `loop/r0/` or `loop/pass1/`. No product file touched on any tree. The
  pass-1 worktree was served, not edited (`git status` in it is unchanged from the pass-1 diff).
- Playwright resolves its own modules from the main tree: run with
  `NODE_PATH=<repo>/web/frontend/node_modules`, from the worktree's `web/frontend`. A config
  outside `web/frontend` must be `.mts`, or vite bundles it CJS and `@tailwindcss/vite`'s default
  export is not a function. Two traps worth a line in the next lane's charter.
