# PASS-2 RESEARCH · PLR-PLACE · The seating chart

T9-W7 §11 (icon · lobby) · §12 · mark M14. Read-only on the product. Everything numbered below
was measured this pass off **HEAD on this lane's own `127.0.0.1:4243`** (scratch vite config,
private `cacheDir`, `--strictPort`, killed before this return), in **both engines**, or computed
from used values that server handed back. Nothing is re-read from pass 1 without saying so.

> The charter's worktree `.claude/worktrees/wf_e58b4764-0fc-48` **no longer exists** (only
> `wf_e58b4764-0fc-34` survives). The pass-1 prototype could not be re-served, so every reading
> here is HEAD's — which turned out to be the stronger ground: three of the family's fifteen rows
> are HEAD defects the family inherits, not defects the family introduced, and that only shows
> when HEAD is the subject.

Probes: `probe/place-r2.spec.ts` (arms A–E) · `probe/place-r2b.spec.ts` (F–H) ·
`probe/place-r2c.spec.ts` (I) · `probe/ground-maths.mjs` · `probe/chart-maths.mjs`.
Logs: `logs/r2*-{chromium,webkit}.json`, `logs/{ground,chart}-maths.txt`. Two crops.

**To re-run.** `npx vite --config probe/vite.scratch.config.mjs --host 127.0.0.1 --port 4243
--strictPort` from `web/frontend`, then the specs with `probe/pw.config.ts`. The specs must be
copied somewhere Node can resolve `@playwright/test` from (a scratch dir; `testDir` and the specs'
`OUT` are absolute for that reason) — a spec sitting under `docs/` cannot resolve the estate's
`node_modules`, which is why the copies here are the record rather than the run.

---

## 0 · THE HEADLINE — the retire trigger dies to one modifier, measured both engines

The trigger: *the self ring must paint under a REAL press in both engines without the sheet's
opening publishing `cur {p:null}` to the room.* Both halves have the same mechanism and the
pointer half has a one-token cure that **this lane auditioned on the running product**.

The chain, at HEAD, cited:

```
GameBoard.vue:456-459   onCellFocus(pos)   → focusedPos = pos ; noteFocus(pos)
GameBoard.vue:471-477   onGridFocusout(e)  → if (!relatedTarget || !grid.contains(relatedTarget))
                                              unitFocused = false ; noteFocus(null)
useSession.ts:935-949   noteFocus(null)    → wire.send("cur", { p: null, … })     ← the room hears it
useSession.ts:966-977   clearCursors()     → the only thing that empties the ghosts
```

**Arm A (`logs/r2-*.json`), on HEAD's own head button (`.attribution-trigger`), a real
`locator.click()` with a cell focused:**

| arm | `relatedTarget` the predicate sees | `noteFocus(null)` fires? | activeElement after |
|---|---|---|---|
| A1 mouse press, chromium | `attribution-trigger` | **yes** | the button |
| A1 mouse press, webkit | **`null`** | **yes** | `BODY` |
| A3 Tab off the cell, chromium | `drawer-tab` | **yes** | the drawer tab |
| A3 Tab off the cell, webkit | **`null`** | **yes** | `BODY` |
| A2 mouse press with `pointerdown` **preventDefault** | *(focusout never fires at all)* | **no** | **the cell, still** |

Two rulings fall straight out:

1. **The `relatedTarget`-sniffing cure is DEAD.** WebKit hands `relatedTarget: null` on a real
   press *and on Tab*. Any "don't null when focus went to a head disclosure" test reads `null`
   in WebKit and cannot tell the two apart. Measured, both arms, do not propose it.
2. **`@pointerdown.prevent` on the sign cures the pointer half whole**, in both engines, with no
   new state and no wire change: the grid's `focusout` never fires, so `noteFocus(null)` never
   runs, so the room never hears `{p:null}` — and the reader's own cell **keeps focus**, so the
   ring paints from the live cursor the family already reads.

**Arm I (`logs/r2c-*.json`) audits the cost of that modifier in isolation** (a bare injected
button, no hover to confound it), both engines identical:

| | clicks fired | `aria-expanded` moved | focused cell kept focus |
|---|---|---|---|
| mouse press, `pointerdown` prevented | **1** | false → true | **yes** (`INPUT.cell-native-input`) |
| Enter on the button | +1 | true → false | — |
| Space on the button | +1 | false → true | — |
| control, no preventDefault | 1 | — | **no** (chromium `BUTTON`, webkit `BODY`) |

So the modifier costs nothing: one click, `aria-expanded` intact, the whole keyboard path
untouched. **This is the cheapest row in the family and it is the one the family lives on.**

### What the modifier does NOT cure, and what must join it

A **keyboard** reader who Tabs to the sign genuinely leaves the grid, in both engines, and
*should* — that is an honest "looked away", and it is the same thing the deck's own seam already
publishes on purpose (`App.vue:609`, "your ghost goes quiet while you browse", T8-W3). So the
second half stands: **a self position that survives leaving the grid.**

The estate already holds one. `GameBoard.vue:453/457` writes `focusedPos` on every cell focus and
**`onGridFocusout` never clears it** — only `unitFocused` goes false (`:475`). `focusedPos` is
exactly "the last cell the board's own focus wrote", it is already not focus-coupled, and it is
already local to `GameBoard`. The family needs it lifted to the session beside `clearCursors`, not
invented:

* write it where `noteFocus(pos)` is already called (`GameBoard.vue:458`) — one call site, one
  direction, never from the wire;
* clear it in `clearCursors()` (`useSession.ts:966-977`), which is already the one place a board
  change empties the ghosts, so the ring dies with the board like everything else;
* the chart reads THAT, never `peerCursors`, never anything a `focusout` can reach.

**The two halves together are: one template modifier and one ref moved up one level.** No new
message kind, no `shareCursor` plumbing needed for the trigger itself, and G5's opt-out signature
becomes distinguishable again for free — after the modifier, opening the sheet puts **nothing**
on the wire, so "one `cur {p:null}` then silence" means the control and only the control.

---

## 1 · Three of the fifteen rows are HEAD's, not the family's

### 1.1 The twelve stolen cells are the incumbent's (charter row 5)

Arm C, 390×664, coarse, dpr 3, real press, **both engines identical**: HEAD's own mobile
attribution card — `256 × 151` at `(0, 44)`, `pointer-events: auto`, `inert: false` — takes
`document.elementFromPoint` at the centre of **12 of 81 cells**, indices
`[0,1,2,3,4,5,9,10,11,12,13,14]` (the first two rows, first six columns). A real tap on cell 0:

| | chromium | webkit |
|---|---|---|
| card open before the tap | true | true |
| card open after | **true** | **true** |
| dismissed | **false** | **false** |
| what the tap actually hit | **`A`** — the GitHub link | `BODY` |

So the pass-1 prototype's "12 of 81, and a tap does nothing" is **not a number the family
introduced**: it is the head-disclosure grammar's, at HEAD, today, and on chromium it is worse
than "nothing" — the tap lands on an outbound link. The prototype's sheet (bottom 216.8) and the
incumbent card (bottom 195) steal the *same twelve*, because the grid's row-2 centres sit at
y 232.3 and both bottoms clear it.

Arithmetic that pins it: grid top 131.73, cell pitch **40.22** (constant at every height, arm B),
so row centres are 151.8 / 192.1 / 232.3; the 256px sheet width reaches column 5's centre
(x ≈ 235) and not column 6's (x ≈ 275). **12 = 2 rows × 6 columns**, and it is a width fact as
much as a height fact.

**This is the cells-stolen probe the charter told this lane to bank for the wave**
(`probe/place-r2.spec.ts` arm C). Two things make it honest and both are in it: it opens with a
REAL press, and it reads `elementFromPoint` rather than geometry, so `pointer-events: none`
correctly reads as *not stolen* — the trap it must never fall into is `inert`, which blinds
`elementFromPoint` entirely; the probe records `inert` alongside the count so a future reading
cannot silently mean "nothing is there".

### 1.2 The +32.83px is the POINTER REGIME, not the drawer and not the row (charter row 15)

Arm F, `.controls-card` at 390×844 on HEAD, nothing else changed:

| | chromium | webkit | `.ctrl-btn` chip |
|---|---|---|---|
| coarse (`isMobile`, `hasTouch`, dpr 3) | **628.00** | **627.98** | 60.00 × 44.00 |
| fine (viewport only, no mobile emulation) | **595.17** | **595.16** | 52.81 × 36.00 |
| Δ | **+32.83** | **+32.82** | +7.19 × +8.00 |

`.action-bar` y: 1399.23 coarse / 1370.23 fine.

The prototype's π census banked `.controls-card` h **595.17 → 628.00** and `.action-bar`
y **1370.23 → 1403.06**, and called the delta the `your cell` row's height. **595.17 and 628.00
are HEAD's own fine and coarse readings of the same element.** The delta is the `--tap-floor`
growth under `@media (pointer: coarse)` (`index.css:821-849`) on four chip rows; the critique's
re-run read 0.00 because both of *its* pages were in the same regime.

Answer to row 15: **neither drawer condition owns it.** Drawer state cannot own it — arm D shows
`.controls-card` keeps height **628 in both states** (shut it is parked at `y = 844` with
`visibility: hidden`; `#controls-drawer` and `.play-controls` are identical, only `.drawer-tab`
re-poses 92×48 → 44×92 and `.play-controls` gains `inert: true`). A **π rect census that compares
two pages in different pointer regimes measures the emulation** — this belongs beside the
programmatic-click trap as the second instrument law this family hands the wave.

### 1.3 Enter's double toggle is inherited, and the mask is measurable (charter row 2)

Arm A4, on HEAD's `AttributionCard` (the idiom `PlayerSign` copied): with the card already open
(a fine pointer's `focusin` opened it), Enter leaves it **open**, `aria-expanded="true"`; Space
then closes it. That is the mask the critique named, reproduced: the double toggle lands on an
already-open card and is invisible. `PlayerSign` has no hover-open, so the same two handlers
(`@click.stop` + `@keydown.enter.stop`, `AttributionCard.vue:48-49`) leave it bare.

The cure is a deletion. The Enter arm belongs at
`r0/r5-player-mark/instruments.spec.ts:88` — today I3 presses `mark.first().click()` and only
that; the arm is a `keyboard.press("Enter")` after a `focus()`, asserting `[data-lobby]` count 1
and `aria-expanded="true"`. Same for G6. **Both r0 instruments are mouse-only and the record is
frozen**, so per §7 this is proposed as a diff under `pass2/<stage>/PLR-PLACE/instruments/` with
the r0 row reported **MOVED** — never re-cut in place.

---

## 2 · The numbers the spec must hit

### 2.1 AA on the ground the phone actually gives (charter row 6) — MEASURED, and one ink fails

The sheet's ground is `color-mix(in srgb, var(--color-popover) 80%, transparent)`
(`AttributionCard.vue:169`), i.e. `0.8·popover + 0.2·(whatever is behind)`. Arm H verifies the
model on real bytes: the darkest board pixel under the card's padding band reads
**rgb(10,10,10) shut → rgb(204,203,203) open** (chromium) and **rgb(10,10,10) → rgb(203,203,203)**
(webkit); the model predicts rgb(204,204,204). **±1, both engines.** So the table below is
measurement, not prediction (`logs/ground-maths.txt`, used values from arm G).

| ink | clean bg (pass 1's ground) | **sheet 80% over a board digit** | **sheet 80% over the wordmark** |
|---|---|---|---|
| **LIGHT** — ground rgb | 251,250,249 (L .9572) | 209.2,208.4,208.4 (L .6347) | **203.6,202.8,202.8 (L .5970)** |
| names · graphite | 14.52 | 9.87 | **9.33** ✓ |
| state line / qualifier · `--ink-press-quiet` | 5.20 | 4.32 | **4.20 — FAILS 4.5:1** |
| subgrid rule · `--ink-press-rule` | 3.52 | 3.10 | **3.04** — clears 3:1 by 0.04 |
| your ring · `--color-user-ink` | 4.96 | 3.37 | **3.18** — clears 1.4.11 by 0.18 |
| worst peer dot over 40 indices | 5.23 | 3.56 | **3.36** |
| **DARK** — ground rgb | 17,15,14 (L .0049) | 56.2,54.2,51.8 | **61.8,60.0,58.6 (L .0456)** |
| names · graphite | 12.25 | 7.69 | **7.04** ✓ |
| `--ink-press-quiet` | 6.11 | 4.48 | **4.20 — FAILS 4.5:1** |
| `--ink-press-rule` | 4.37 | 3.49 | **3.30** |
| your ring | 7.52 | 4.72 | **4.32** |
| worst peer dot | 9.71 | 6.10 | **5.58** |

Three readings:

1. **`--ink-press-quiet` reads 4.20:1 in BOTH themes on the lapped ground** and the state line and
   qualifiers are `--type-tag` — small text, so 4.5:1 binds. This is the family's one outright
   contrast failure and it is the same number light and dark, which makes it unarguable.
2. **The ring loses 1.78 and the dots lose 1.87** against the clean-ground figures pass 1 banked.
   Both still clear 3:1, but the ring's margin on the phone is **0.18**, which is inside any
   re-measurement's noise. Pass 1 already reported chromium painting the 1.5px ring at 3.63 on a
   clean ground; 1.5px on this ground is not defensible. **Stroke 2** (the estate's own
   `HandDrawnOutline :stroke-width="2"` keep width, R6 law 37) is the same idiom and buys the
   margin back.
3. **The estate-legal cure for all of it is already law.** R6 law 44: *"`prefers-reduced-transparency`
   / `prefers-contrast: more` turn every sheet OPAQUE — the fallback IS pure pencil, and a surface
   that shows content through it must then render the complete content."* Extending that to
   `(pointer: coarse)` — the phone arm is opaque — returns every row to the clean column
   (quiet 5.20 / 6.11, rule 3.52 / 4.37, ring 4.96 / 7.52, dots 5.23 / 9.71) and costs one rule.
   Raising `--ink-press-quiet` on the sheet instead would open-code the ramp, which R6 law 24
   forbids.

### 2.2 G8, re-cut as viewport-height × row-count (charter row 4) — the law is LINEAR and measured

Arm B, 390 wide, coarse, eight heights, both engines. The grid never resizes and the page never
scrolls: **grid height 362.00 and cell pitch 40.22 at every height, `scrollY` 0, `scrollHeight`
== viewport height.** The board group takes the slack at exactly half rate:

| vh | 568 | 600 | 664 | 700 | 740 | 800 | 844 | 932 |
|---|---|---|---|---|---|---|---|---|
| grid top, chromium | 86.22 | 99.73 | 131.73 | 149.73 | 169.73 | 199.73 | 221.73 | 265.73 |
| grid top, webkit | 85.63 | 99.42 | 131.42 | 149.42 | 169.42 | 199.42 | 221.42 | 265.42 |
| board-group top | 8.00 | 21.52 | 53.52 | 71.52 | 91.52 | 121.52 | 143.52 | 187.52 |

```
gridTop(vh) = 0.5 · vh − 200.27          for vh ≥ ~592      (webkit −200.58; a 0.31px engine gap)
gridTop(vh) = 86.22                      for vh <  592      (the board group hits its y = 8 floor)
```

With pass 1's own sheet geometry (bottom **216.8** at zero rows, **+24.0** per row — measured, not
the synthesis's 22.4):

```
lap(vh, L) = 216.8 + 24.0·L − gridTop(vh) = 417.07 + 24.0·L − 0.5·vh
```

It reproduces pass 1 to ≤1.5px (664/L0: 85.1 vs 85.1 · 664/L2: 133.1 vs 134.6 · 844/L2: 43.1 vs
44.6). The zero-lap condition is the number the gate should be written against:

| rows L | 0 | 1 | 2 | 3 | 5 |
|---|---|---|---|---|---|
| **vh needed for zero lap** | 834.2 | 882.2 | 930.2 | 978.2 | 1074.2 |

**A 390-wide phone cannot hold this sheet without lapping the board once it has two rows** (930.2
needed; iPhone 13 is 664, the 844 class is 844). So the gate cannot be "no lap": it must be a
two-variable assertion that the MEASURED lap equals the law above ±4px at (at least) 664 and 844
× L ∈ {0, 2, 5} — twelve readings, all of which the arithmetic already predicts, and any one that
misses means the sheet's own height model moved.

### 2.3 The 16×16 arm, measured by arithmetic rather than a screenshot (charter row 12)

`generateGridBoilFrames(boardSize, subgridSize, viewBoxSize, …)` (`gridPaths.ts:421`) is the chart's
source and takes the box, so "a 96px chart" fixes the pitch at 96/N:

| board | pitch | r | dot width | **gap between adjacent dots** | r/pitch |
|---|---|---|---|---|---|
| 4×4 | 24.000 | 9 | 18.00 | 6.000 | 0.375 |
| 9×9 | 10.667 | 4 | 8.00 | **2.667** | 0.375 |
| 16×16 (pass 1) | 6.000 | 2.5 | 5.00 | **1.000** | 0.417 |

A 1.000px gap is the whole finding: at 16×16 pass 1's dots are proportionally **bigger** than at
9×9 (0.417 vs 0.375) on a pitch 44% smaller, so two peers on adjacent cells paint two 5px discs
1px apart. "A density picture" is true and it is not a seating chart. The screenshot would show
it; the number says it and costs no crop.

**Hold the PITCH, not the box** — chart = 10.667·N — and the 9×9 dot and gap survive at every size:

| board | chart box | dot | gap | fits the 224px sheet interior? |
|---|---|---|---|---|
| 4×4 | 42.7 | 8.00 | 2.667 | yes |
| 9×9 | 96.0 | 8.00 | 2.667 | yes |
| 16×16 | **170.7** | 8.00 | 2.667 | yes (224 − 170.7 = 53.3 spare) |

The cost is height: +74.7px of sheet at 16×16, which by §2.2 pushes the zero-lap threshold from
930.2 to 1004.9 at two rows. That trade is the synthesizer's; the numbers for both sides are here.

### 2.4 Attribution past four (charter row 8) — the rank, in oklab

The walk is `oklch(var(--peer-ink-l) 0.11 (i·137.5°))` (R6 law 22), `--peer-ink-l` **0.5** light /
**0.8** dark (read off `.page-root`, arm G). Closest pair, oklab ΔE, identical at both lightnesses:

| N | 2 | 3 | **4** | 6 | 10 | **15** | 20 |
|---|---|---|---|---|---|---|---|
| closest ΔE | .2050 | .1486 | **.0973** | .0616 | .0382 | **.0240** | .0240 |
| hue apart | 137.5° | 85.0° | **52.5°** | 32.5° | 20.0° | **12.5°** | 12.5° |

**The closest pair at N=4 is 4.05× further apart than at N=15**, and the walk's minimum separation
is already at its floor by N=15 (it does not get worse at 20). "Claimed only to four" is therefore
a defensible line and 52.5° is the number that defends it — but the spec still owes a mechanism,
not a sentence, because at N=15 a reader has fifteen dots and four names. Three mechanisms the
estate can already pay for, in ascending cost:

1. **Hover/press a row → its dot alone keeps full opacity, the rest drop to the rule's pressure.**
   One CSS state on the chart, no new ink, and it is the estate's own "one hover affordance"
   grammar (R6 law 14) rather than a new one. Attribution becomes a query instead of a claim, and
   the claim-to-four can then be dropped entirely.
2. **The chart shows only the settled dots and the rows show everyone** — already true; say it.
3. Re-hue past four. **Refused**: it re-litigates R6 law 22 (a formula, not a palette).

### 2.5 The unknown-peer fallback (charter row 7) — the estate already decided this

`PlayerLobby.vue` paints `p.ink["--color-user-ink"] ?? "var(--color-user-ink)"`. Eleven lines of
`BoardHost.vue:75-79` say the opposite, in the shipped code, with its reason:

> *"A peer whose row has gone (`ink` absent) has had their cursor cleared by the session already;
> skipping is the belt to that brace."* — and it `continue`s.

**No ink, no dot.** That is the landed decision and the fallback contradicts it; the cure is to
match `BoardHost`, not to mint a neutral. A neutral would also have to be a hue this family has
not got: `--color-peer-cursor-ink` resolves EMPTY on `.page-root` in both themes (arm G) because
it is bound per-cell by `BoardHost`, so there is no ambient "peer grey" to fall back to.

---

## 3 · The primitives to reuse, by name

| need | the primitive, cited | why it is the right one |
|---|---|---|
| the sheet's 150ms (row 10) | **`.hover-card` / `.hover-card.is-open`**, `AttributionCard.vue:163-209` | The estate's disclosure does NOT use `v-if`. It stays mounted at `opacity 0; visibility: hidden; pointer-events: none` and transitions `opacity/transform 150ms var(--ease-standard)` with `visibility 0s linear 150ms` on close — the delayed `visibility` is documented at `:173-179` as the UI-6 / WCAG 2.4.7 cure that also pulls the contents out of the tab order. Taking this rule verbatim implements the declared 150ms **and** gives the sheet its closed-state tab-order and pointer-transparency for free. The chart's "do no work while shut" stays satisfiable by `v-if`-ing the CHART inside the mounted pose box. |
| Escape, role, name (row 3) | **`GameScene.vue:169-176`** — `role="region" aria-label="controls"` + `@keydown.escape.stop="closeDrawer"` + `:inert` when shut, with the comment *"Not a modal — same landmark, same `aria-expanded`/`aria-controls` on the same button, Esc closes from within"* | W2's landed grammar for exactly this shape: a big surface over the board that is not a modal. The lobby sheet takes it whole. **Caveat from §0:** after `@pointerdown.prevent` a mouse-opened sheet leaves focus in the grid, so an Escape bound ON the sheet never hears the key. |
| a window-scoped Escape with one owner | **`GameGallery.vue:696-721`** — `onWindowEscape`, bound on mount, unbound on unmount, honouring `e.defaultPrevented`, with the one-owner rule written out at `:703-706` | The only binding that works for a mouse-opened sheet. The estate has already decided how a second Escape owner declares itself; follow that paragraph rather than inventing a stance. |
| close on focus-leave | **`useHoverCard.onHoverLeave`** + the wrapper's `@focusout` (`AttributionCard.vue:41`, `useHoverCard.ts:52-57`), 150ms | Already handles the touch re-entry bug (`useHoverCard.ts:31-40`): cancel the pending close BEFORE the coarse gate, or a tap inside the sheet shuts it 150ms later. Do not re-derive that ordering. |
| two head disclosures (row 9) | **PLR-SELF's `headDisclosures`** — `pass1/prototype/PLR-SELF/patch-tracked.diff:630-648`, an `InjectionKey<{register, claim}>` provided by `AttributionCard`, with `closeAll` emptying the set | Written, next door, with its own doc block. Take it; do not re-derive. `App.vue:334-337`'s `closeAll` already calls the two cards' exposed `close`. |
| the drawn frame | **`HandDrawnOutline`** at `:pose="0"` (`pencil/grid/HandDrawnOutline.vue`; R6 law 37, ✓ law-probe L5) | One box grammar; pose 0 enrols no beat and mints no filter, which is what keeps `filterBudget` at 9. |
| the chart's geometry | **`generateGridBoilFrames(size, subgrid, viewBox)`** `gridPaths.ts:421` → `.frame[0]` / `.subgridLines[*][0]`; the consumer pattern is `PosterBoard.vue:104,158` | Already memoized through the shared boil LRU; frame 0 is the base path, so no beat. |
| the damping constant | **`WASH`** `useJoinWash.ts:101-104` (`bootSuppressMs 1200`, `coalesceMs 400`, `minGapMs 4000`) | R6 law 4 — no timing constant outside `pencilConfig`/the estate's own home; `placeSettleMs` sits here beside its three siblings, as pass 1 had it. |
| the option row | **`OptionSelector`** (`pencil/chrome/OptionSelector/OptionSelector.vue`), `aria-pressed` per chip (`:51`), Fira Code at `--type-option` (`:105-106`) | The shipped grammar for `candidates` (`GameControlPanel.vue:483-486`). |
| the row caption | **`.zone-row-label`** — the two shipped ones are `marks` (`:959`) and `candidates` (`:980`), both lowercase | The derive `zoneRowLabels` already reads this class's static text. |

---

## 4 · Copy and the cut

### 4.1 `shown`/`hidden` vs `Off`/`On` (charter row 14) — the estate has two registers and both are consistent

Measured at HEAD: **every** option chip in the card is Capitalised —
`Normal/Corner/Center` (`GameControlPanel.vue:473-477`), `Off/Ask/Live` (`:478-482`),
`Off/On` (`:483-486`). **Every** row caption is lowercase — `marks`, `candidates`. Two registers,
split by ROLE, both already whole.

So the proposal writes itself: **the caption stays lowercase (`your cell`), the chips take the
capital.** Lowercase chips would be the only lowercase pair in five rows. Between `Shown/Hidden`
and the incumbent `Off/On`, the measured argument is that `candidates` — the one other two-state
row — already says `Off/On`, so `Off/On` changes no register at all and mints no string; against
it, "your cell: Off" reads worse in plain English (M16) than "your cell: Hidden". This lane's
recommendation: **`Shown`/`Hidden`**, and say in the diff that it is a deliberate second two-state
vocabulary because the state is a *visibility*, not a *feature*.

Note the chips are **Fira Code, not Patrick Hand** (`OptionSelector.vue:105`), so capitals cost the
subset nothing.

### 4.2 The Patrick Hand cut, decoded

`src/assets/fonts/patrickhand-subset.woff2` — **46 codepoints**, 4,312 B:

```
 !'-.0123456789?CRSabcdefghiklmnopqrstuvwyz×—…
```

No `j`, no `v`, no `x`; no comma, no colon; uppercase is `{C,R,S}` only (R6 law 29). **Digits are
in**, so the sign's numeral, `and N more`, `N seconds ago` and `N other players` all draw. Every
one of the family's nine strings clears the cut — checked character by character. Peer slugs are
already guarded by check 5 of `check-font-coverage.mjs:524-565`, which compares
`playerIdentity.ts`'s `WRITEABLE` regex to this cmap **in both directions**.

### 4.3 The lobby derive (charter row 12)

`scripts/check-font-coverage.mjs` requires every corpus group to name a `derive` (`:446-455`: a
group with no derive is a hard problem, *"the T8 trap re-armed"*), and check 3 requires
DERIVED ⊆ DECLARED. The four extractors are `specHeadings`, `cardNames`, `cardAxisLabels`,
`washiTapes`, `zoneRowLabels` (`:96-126`), all regexes over static authored constructs.

Two of the family's strings already derive for free if authored in shipped constructs: `your cell`
as a `.zone-row-label` span (`zoneRowLabels` reads `class="…zone-row-label…">TEXT<`, which is why
pass 1's edit worked) and the hint tape as a static `<SheetWashiLabel text="…">`.

The rest — the state line, `you`, `N seconds ago`, `and N more` — are interpolated and no regex
can read them. The estate's mechanism for that is **the pinned bound census**
(`BOUND_TAPES`, `:128-145`, check 4 at `:494-521`), which today only covers
`<SheetWashiLabel :text="expr">`. The cheapest estate-shaped answer:

1. author the lobby's strings as a single `const LOBBY_COPY = { … }` in `PlayerLobby.vue`, and
2. add a `lobbyStrings` extractor shaped exactly like `cardNames`
   (`grab(pick(/PlayerLobby\.vue$/), /:\s*"([^"]+)"/g)`), with a new corpus group
   `where: ".lobby-*"`, `derive: ["lobbyStrings"]`;
3. the interpolated fragments then declare as their **static halves** (`other players`,
   `seconds ago`, `and`, `more`), which is what the constant holds anyway.

That keeps the derive mechanical and does not widen the pinned census, which is the part of the
gate that rots.

---

## 5 · The constraints this family collides with

| constraint | where | the collision, stated |
|---|---|---|
| `filterBudget` **exactly 9** | R6 law 9 ✓ L1; `pencil/config/filterBudget.ts` | Not at risk: the chart is `frame[0]` geometry and `HandDrawnOutline :pose="0"`, both filter-free. Pass 1 measured 9 in six scenes, both engines. **Poll to the settled 9** — a cold phone census reads 21. |
| π on unclaimed surfaces | wave gate spine | §1.2 retires the family's one declared π delta as a census artifact. **Re-run the census with both pages in the same pointer regime**, or the reading is the emulation's. |
| R6 law 44 — sheets go opaque under reduced transparency / more contrast | index.css | §2.1 wants that arm extended to `(pointer: coarse)`. That is an extension of a landed law, not a new mechanic — say so explicitly. |
| R6 law 24 — ink pressure is a named ramp | `--ink-press-*`; `check-ink-pressure` | Forbids the other cure for §2.1 (a heavier quiet ink on the sheet only). |
| R6 law 22 — the peer walk is a formula | `playerIdentity.ts` ✓ L6 | Forbids re-hueing past four (§2.4). |
| R6 law 4 — no timing constant outside the config | `pencilConfig` / `WASH` | `placeSettleMs` and `presenceInkMs` both land in their homes; pass 1 already did this and also found `presenceInkMs` orphaning `cardStepMs`'s doc block — do not repeat that insertion point. |
| R6 law 37 — one box grammar | `HandDrawnOutline` ✓ L5 | The sign and the sheet's edge; the chart's frame is grid geometry, which is the other admitted drawn edge. |
| R6 law 14 — exactly one hover affordance | ✓ promoted on next bite | §2.4's mechanism 1 (press a row, dim the other dots) must be ONE affordance, not a second on top of the row's own. |
| W2's landed mechanics | `GameScene.vue:47-180` | The dock, the bottom tab and the tap-floor token are landed and the sheet **ignores all three while covering the board**. The reason is stateable and should be stated: the dock/tab grammar is the CONTROLS surface's (a region that owns the board's bottom edge); the lobby is a DISCLOSURE hanging from the head, and M14 fences multiplayer *controls* into the well precisely so the head surface is not a control. What the sheet does take from W2 is the a11y half — region, name, `aria-expanded`/`aria-controls`, Esc from within — which is exactly `GameScene.vue:169-176`. |
| `--tap-floor` | `index.css:821-849`; token on `.page-root`, `2.75rem` | Reads EMPTY from `documentElement` — a probe that reads it from `:root` measures nothing. Coarse chips are 60×44; the sign must clear 44 in **both** dimensions. |
| `check-motion-contract` | `scripts/check-motion-contract.mjs:18-19,63` | **Every new `e2e/*.spec.ts` must carry a `PRM:` declaration inside its first 20 lines** or the gate reds by name. This is the exact trap that took the CI cure at `7b0610cc`. |
| `check-live-regions` | 3 → 3 in the well; roster keeps `role="log"` | The chart is `aria-hidden`; the rows are the readable list. |
| M16 / `check-copy-register` | R6 law 31 ✓ L3 | Nine strings, plain, no em dash, no first person (law 36). |
| U-10 | R6 law 46 | Nothing here closes a mark. If the owner disposes against the size split, the family is a KILL and the research said so first. |
| M19 | R6 law 45 | No `osascript`, no Safari.app; PW-WebKit only. |

---

## 6 · Sketches

### 6.1 The seam, before and after

```
          BEFORE (HEAD)                              AFTER (one modifier + one lift)

  reader presses the sign                     reader presses the sign
        │                                           │  @pointerdown.prevent
        ▼                                           ▼
  pointerdown moves focus ──► grid focusout    (no focus move, no focusout)
        │                          │                │
        │                          ▼                ▼
        │                   noteFocus(null)    the cell KEEPS focus
        │                          │                │
        ▼                          ▼                ▼
   sheet opens            wire: cur {p:null}   sheet opens · wire SILENT
        │                          │                │
        ▼                          ▼                ▼
  chart: self = null      every peer's ghost   chart: self = the live cell
   ◦ NEVER PAINTS          of you 1 ──► 0       ● THE RING PAINTS

  keyboard Tab to the sign is UNCHANGED and should be: that is an honest "looked away",
  the same one App.vue:609 publishes when the deck opens. The chart survives it by reading
  a lastCell that only GameBoard.vue:458 writes and only clearCursors() clears.
```

### 6.2 The lap, as the law of two variables

```
   390 wide, coarse.  gridTop(vh) = 0.5·vh − 200.27   (vh ≥ 592; pinned at 86.22 below)
   sheet bottom = 216.8 + 24.0·L

   vh 664 ─┬─ 131.7 ── grid top ─────────┐        vh 844 ─┬─ 221.7 ── grid top ──┐
           │  ░░░░░ 12 of 81 cells ░░░░░ │                │                      │
   sheet ──┴─ 216.8 (L=0)  lap  85.1     │        sheet ──┴─ 216.8 (L=0) no lap  │
              264.8 (L=2)  lap 133.1     │                   264.8 (L=2) lap 43.1│
              336.8 (L=5)  lap 205.1     │                   336.8 (L=5) lap115.1│

   zero lap needs vh ≥ 834.2 + 48·L      →  L=0: 834.2   L=2: 930.2   L=5: 1074.2
   NO 390-wide phone in the 664 or 844 class holds two rows without lapping the board.
```

### 6.3 The chart at three sizes, pitch held

```
   4×4  42.7px      9×9  96px               16×16  170.7px
   ┌──────┐         ┌──────────────┐        ┌────────────────────────┐
   │ ●    │         │  ●      ●    │        │ ●   ●        ●      ●  │   dot 8.00px at EVERY size
   │    ◉ │         │     ◉        │        │        ◉   ●           │   gap 2.667px at EVERY size
   └──────┘         │  ●        ●  │        │  ●        ●      ●   ● │   ◉ = you, a ring
                    └──────────────┘        └────────────────────────┘

   pass 1's fixed 96px box instead:  16×16 pitch 6.0, dot 5.0, GAP 1.0px
   ┌──────────────┐    two peers on adjacent cells are one 11px smudge.
   │ ●●    ●  ●●  │    "a density picture" is exactly right, and it is not a seating chart.
   └──────────────┘
```

---

## 7 · Risks, ranked

1. **The modifier moves a focus behaviour, and focus behaviours have a blast radius.**
   `@pointerdown.prevent` means the sign is never focused by mouse. Everything measured says that
   is free (arm I: click fires, `aria-expanded` moves, Enter and Space untouched, both engines) —
   but it means **Escape cannot be bound on the sheet** for a mouse-opened sheet, and it means a
   mouse reader who then wants to Tab *into* the sheet starts from the grid. Both are answerable
   (§3: the window binding, `GameGallery.vue:696-721`), and both must be answered in the same diff
   or row 3 lands half-cured.
2. **`focusedPos` lifted to the session is a new module-level ref in a file that owns the wire.**
   The discipline that makes it safe is one-directional: written only at `GameBoard.vue:458`,
   cleared only in `clearCursors()`, read only by the chart. If anything else writes it, the ring
   becomes a second cursor with different rules from `peerCursors`, and the family has minted a
   mechanic W2 did not land.
3. **The opaque phone arm is a visible change to a surface pass 1 declared byte-identical to the
   @mbabb card.** §3.2 of the synthesis says "the @mbabb card's pose byte-for-byte"; §2.1 breaks
   that on the coarse arm. That is the right trade and it must be *declared* as a delta, not
   slipped in — and it changes what a crop of the sheet looks like, so any pass-1 frame reused as
   a comparison is stale.
4. **The 16×16 chart at held pitch adds 74.7px of lap** (§2.3). The size split the family lives on
   was argued at 96px; a 170.7px chart re-opens it. Either the spec caps the chart and states the
   16×16 arm is a density picture with a *mechanism* for reading it, or it pays the height and
   re-runs §2.2's twelve readings.
5. **The theft is inherited, so curing it is scope.** §1.1 shows HEAD already steals the same
   twelve cells and swallows the tap. A cure that makes the lobby sheet dismissible-from-itself
   while the incumbent card stays a dead patch leaves the product with two head disclosures
   obeying different rules — which is the same defect shape the `headDisclosures` registry exists
   to close. Propose it as ONE head-disclosure rule for both, or say plainly that the family fixes
   its own and books the incumbent.
6. **`--ink-press-quiet` at 4.20:1 is a real AA failure and the opaque arm is the only estate-legal
   cure this lane found.** If the opaque arm is refused, the state line and qualifiers have to move
   off the quiet ramp to graphite, which flattens the sheet's only typographic rank.
7. **`arriving` / `departing` / `rowArmMs` are NOT orphaned at HEAD** — `GameControlPanel.vue:78,
   1125, 1143-1144, 1161, 1723-1752` read all three. They are orphaned only *by this family's own
   deletion of the roster's pixels*. So charter row 11's second half is not a prune the estate
   owes; it is a consequence this family must own, and it is coupled to the `.player-swatch`
   settlement — if the section keeps the roster's pixels (PLR-SELF's side), nothing is orphaned.
8. **G1's webkit 40.6** is the one row this lane could not re-derive: the banked traces belong to
   the pass-1 research worktree, which is gone. The cure named in the charter (settle, not the
   gate) is right and the arithmetic is unavailable here — the synthesizer should carry it as
   "re-run the replay at `placeSettleMs` 800 and report, with the SLOW arm as the control", never
   as a prediction.

---

## 8 · Couplings this lane states and does not resolve

* **`.player-swatch`.** Three e2e sites read it: `e2e/join-language.spec.ts:175`,
  `e2e/multiplayer.spec.ts:193` and `:580`; it is authored at `GameControlPanel.vue:1149` and
  `:1168` with CSS at `:1682`. The chair's §7 already ruled: *the swatch stays until the
  instruments that read it are re-pointed in the same diff.* **This lane's side: delete it, and
  re-point all three in the same diff** — the swatch and the chart's dot are the same mark at the
  same radius, and keeping both is two names for one thing. But the deletion is not free until
  those three lines move, and the ruling makes that a condition rather than a preference.
* **F1.** This lane stays on "the board keeps your blue" (`useSession.ts:537` untouched). I2 is
  RED by ruling and the record should keep saying so.
* **The focus-ring token (§6.1).** Struck from this family's charter; the lobby reads it and never
  writes it. Nothing in the chart depends on which value §6's leader ships — the ring on the chart
  is `--color-user-ink`, a different mark on a different surface, and §2.1 is its own reading.
