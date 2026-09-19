# PASS-1 CRITIQUE · PLR-PLACE · The seating chart

Adversarial. This lane did not write the spec or the prototype. Everything below was read off
**this lane's own server** — the prototype worktree `wf_e58b4764-0fc-48` on
`127.0.0.1:4248 --strictPort`, scratch config, no `webServer` — in **both engines**, plus the
worktree's own estate gates. Probes and logs:
`critique/PLR-PLACE/probe/critic{,2,3,4,5,6}.spec.ts` · `critique/PLR-PLACE/logs/*.json`.

**Convergence: 55%. Verdict: ADVANCE, conditioned.** The size-boundary split is the right call
and its numbers survive re-measurement. The family's ONE MEMORABLE THING does not exist on the
running surface, and three of its gates read the instrument rather than the product.

---

## 1 · What I re-measured, and what held

| claim | this lane's reading | verdict |
|---|---|---|
| `filterBudget` 9 with the sign mounted and the chart open | **9** solo and in a room of two, sheet open, **both engines** (`critic-*.json` `c1`, `p0.budget`) | HOLDS |
| dots ≥ 3:1 at 96px | painted bytes of the live `.place-chart`, dpr 1, my own decode: peer dot **5.59** light / **10.57** dark against the sheet's own ground | HOLDS |
| chart frame, subgrid ≥ 3:1 | frame **12.74** light / **10.89** dark; subgrid rule **3.48** light / **4.32** dark | HOLDS |
| π on unclaimed surfaces, **webkit arm** (the prototype's gap 19) | twelve selectors, HEAD `:4243` against the prototype `:4248`, desk 1280×800 and phone 390×844: **0.00 on every one, both engines** (`critic4-*.json`) | HOLDS — gap CLOSED |
| estate gates | `vue-tsc -b` **exit 0** · `vitest run` **810/810 in 66 files** · `check-copy-register` 0 em dashes / 0 unadmitted jargon · `check-live-regions` 0 born speaking · `check-font-coverage` OK | HOLD |
| the 24px kill | not re-derived here; the 96px arm's numbers above are consistent with it | ACCEPTED |

The π control deserves one line: `:4243` is a server this lane did not start. I fingerprinted
it — `player-swatch` present, `data-player-mark` absent, `headDisclosures` absent, `your cell`
absent — which is consistent with HEAD and with nothing else in flight that I can name. The
prototype's **+32.83px `.controls-card` / `.action-bar` delta did NOT reproduce** in my phone
census (drawer shut, 390×844): 0.00. So the one declared π delta is condition-dependent and the
condition is unwritten.

---

## 2 · The refutations (measured, both engines)

### 2.1 THE RING IS AN INSTRUMENT ARTIFACT — the one memorable thing never paints

`.chart-self` is **absent from the DOM in every arm I ran with a real press**: solo, in a room,
before and after focusing a cell, light and dark, mouse and keyboard, **chromium and webkit**
(`critic2-chromium.json` `r1.ring: 0`, `r1.ringAttrs: null`; `critic3-*.json` `a4`, `b4`).

The mechanism is a two-line chain the spec never traced:

```
GameBoard.vue:474-476   onGridFocusout → noteFocus(null)
useSession.ts:983-989   noteFocus(null) → selfCursor.value = null   (the ring's ONLY source)
```

Pressing the head's sign takes focus out of the grid. So the act of opening the chart deletes
your own place on it, before the sheet has finished opening.

The prototype's own G2/G3 rig did not see this because it opens the sheet with `el.click()`
**inside `page.evaluate`** (`prototype/.../probe/place-paint.spec.ts:156-162`) — a programmatic
click moves no focus. I ran both openings against the same page, same room, same cell
(`critic5-*.json`):

| opening | `.chart-self` | activeElement |
|---|---|---|
| `el.click()` from `page.evaluate` (the prototype's rig) | **1** | the cell's own input |
| a real press (`locator.click()`) | **0** | `.player-sign-btn` (chromium) / none (webkit) |

So the banked ring ratios — **3.63 / 3.68 / 5.23 / 5.18** — are readings of a state a reader
cannot reach, in both engines. The frames inherit it: every crop of the chart was taken off the
same rig. "YOU ARE A RING at your own cell" is, on the running product, an empty claim.

### 2.2 Opening your own chart tells the room you looked away

The same `noteFocus(null)` goes out **on the wire**. Measured from the peer's page
(`critic3-*.json`): the peer sees your ghost (`a2: 1`), you press the sign, the peer's ghost
count goes to **0** (`a6`, and `b3`/`b5` for the keyboard path) — both engines.

Two consequences the spec does not carry: (a) every other reader's seating chart loses your dot
for as long as you are reading yours, so the chart is systematically wrong about whoever is
looking at it; (b) G5's opt-out signature — "one `cur {p:null}`, then silence" — is not
distinguishable on the wire from simply opening the sheet, which weakens the gate to "a null was
sent", which was already true.

### 2.3 Enter does not open the sheet — either engine

`PlayerSign.vue` carries `@click.stop="toggle"` **and** `@keydown.enter.stop="toggle"`. A button
fires `click` as Enter's default action, so Enter toggles twice and nothing opens
(`critic-*.json`): `k1.enter.lobbyCount 0`, `k1.enter.ariaExpanded "false"` — chromium and
webkit. Space opens and closes correctly (`k2`); the mouse press opens (`k3`).

The idiom was copied from `AttributionCard`, where it is masked: on a fine pointer `focusin`
already opened the card, so the double toggle lands on an open card and is invisible
(`critic2-*.json` `x0/x1`: 1 → 1). PlayerSign deliberately has no hover/focus open, so the mask
is gone and the defect is bare. **r0 I3 and G6 both pressed with the mouse**, so no gate saw it.

### 2.4 The sheet is a disclosure with no way out but a tap elsewhere

With the sheet open (`critic-*.json` `e1`–`e4`, both engines): **Escape does not close it**;
tabbing on does not close it (focus lands on `.logo-trigger` with the sheet still open); there
are **0 focusable elements inside it**; the root element carries no role and no accessible name.
Only App.vue's outside click dismisses. The attribution card next door closes on `focusout`; this
one does not.

### 2.5 The phone lap is worse than declared, and it costs cells

My own readings (`critic4-*.json`, `critic6-*.json`, both engines, coarse, dpr 3), sheet **solo**
— state line + chart, **zero rows**, the smallest the sheet can ever be:

| viewport | grid top | sheet bottom | lap over the grid | board-group lap | cells whose tap the sheet takes |
|---|---|---|---|---|---|
| 390 × 844 | 221.7 / 221.4 | 216.8 | none | 73.3 / 73.0 | **0 of 81** |
| 390 × 664 | 131.7 / 131.4 | 216.8 | **85.1** | 163.3 / 163.0 | **12 of 81** |

And a tap on the sheet over one of those twelve cells does **nothing at all** — the sheet's
`@click.stop` swallows it without dismissing (`phone664.tapOnSheet: {before 1, after 1,
dismissed false}`, both engines). So on a short phone the sheet is a dead patch over the top-left
box of the board, with no affordance saying how to leave it.

The synthesis declared "~64px at four lines". The prototype measured 44.6–158.9 and said so.
Neither reading is the gate's: **G8 asks for ±4px and gets 4.6px out on the tall phone and ~95px
out on the short one. G8 is RED, and the record calls it "MEASURED".**

### 2.6 AA was measured on four grounds, none of which is the phone's

The four grounds are `--color-background` and `--color-card`, light and dark, on a clean rig. The
ground a phone reader actually gets is in the prototype's own frame
(`frames/sheet-phone-lap-webkit.png`): `--color-popover` at 80% over the wordmark and over the
board's digits, which read straight through the sheet. The chart's dots and rules on that ground
are unmeasured. The constraint is not satisfied where the family's own delta puts the surface.

---

## 3 · The failure-mode checklist

| item | hit | where |
|---|---|---|
| vacuous convergence | **HIT** | "attribution is claimed only to N=4" is implemented by *saying so* (`PlaceChart.vue` doc block); nothing changes at the fourth peer. "The head is still by construction" is true and also the only thing G4 can ever read. |
| gates that cannot fail | **HIT** | G1's offered cure for a 40.6 reading is "a gate at ≤45". G8 misses its own ±4px in both directions and is recorded as "MEASURED" rather than RED. |
| the elegant-reduction trap | **HIT** | past four peers the two readings "do not join" — the hard part is handed to the reader, and the spec's answer is a sentence. |
| unverified gestalt | **HIT ×3** | the ring (§2.1, never painted under a real press); the 16×16 chart (drawn, never screenshotted, "a density picture" asserted); the phone ground (§2.6). |
| masked fallbacks | **HIT** | `PlayerLobby.vue` dots: `p.ink["--color-user-ink"] ?? "var(--color-user-ink)"` — a peer whose ink map lacks the key paints in the ambient user ink, i.e. **your own blue**, and the row swatch inherits the same fallback. The one hue the design reserves for "me" is the default for "unknown". |
| consumer-less substrate | **HIT** | `useJoinWash`'s `arriving` / `departing` / `rowArmMs` now have no product reader; `knip` stays clean only because their own test imports them. |
| legacy aliases | clear | the roster keeps its element and `role="log"` deliberately, and loses its pixels. |
| the generic default | clear | nothing in the family reads as templated; the chart is the board's own paths at pose 0. |
| the pixel it did not declare | **HIT** | sign 53.1 × 47.8 against a declared 45.2 × 39.8; sheet at y 59.8 against 51.8; `closeAll` changed after the plan said it would not; a phone `.controls-card` +32.83 that did not reproduce with the drawer shut. |
| the constraint it forgot | **HIT** | AA on the phone's real ground (§2.6); **W2's landed mechanics** — the sheet hangs from the head over the board instead of using the dock/bottom-tab grammar the wave already landed, and nothing in the spec says why that grammar does not apply to a disclosure that covers the board. |
| spec-cites-itself | partial | §3.1's "the frame at 2 CSS px clears 3:1 at any size" is asserted and then proven by G3 on painted bytes; the ring's claim is asserted and "proven" by a rig that cannot reach the state (§2.1). |
| M16 / copy register | clear | `check-copy-register` 0 em dashes, 0 unadmitted jargon; the nine strings are plain and second-person. |
| filterBudget 9 | clear | verified independently, both engines, four scenes. |
| π on unclaimed surfaces | clear | verified independently, **including the webkit arm the prototype did not run**. |
| decided history (r0/R6) | clear | `hue-census.mjs` 29 rows and `law-probe.mjs` 9 rows unchanged; one box grammar (`HandDrawnOutline`) honoured; no first person. |

---

## 4 · Strengths worth keeping

1. **The split is earned, not asserted.** The 24px kill and the 96px pass are both numbers, and
   the 96px half re-measures true in my own decode (dot 5.59 / 10.57, frame 12.74 / 10.89).
2. **π and the budget genuinely hold.** Twelve selectors, two viewports, two engines, 0.00; nine
   filters with the chart open in every scene. A drawn board inside the head costs the page
   nothing, which was the live risk.
3. **The damping constant went to the estate's home** (`WASH.placeSettleMs`, beside
   `bootSuppressMs/coalesceMs/minGapMs`) with its measurement in its doc block, and the sweep arm
   (469.8 → 2.9 moves/min) is the strongest single number in the family.
4. **`useBoardShape`** is a clean seam: one write at `BoardHost`, no prop drill, and any future
   head surface that needs the board's geometry now has it.
5. **The record is candid.** Twenty-two gaps, the webkit rate miss reported rather than rounded,
   the negative controls run both ways. My refutations are things the instruments could not see,
   not things the record hid.

---

## 5 · Open gaps (each closable)

1. Make the ring reachable: keep the chart's `self` position off a value that survives leaving the
   grid (a `lastCell` that only the board's own focus writes and `clearCursors` clears), then
   re-run G2's ring arm with a REAL press, both engines.
2. Stop the sheet telling the room you looked away: the head's disclosure must not publish
   `cur {p:null}`, and G5 must be rewritten so its signature is distinguishable from opening the
   sheet.
3. Delete `@keydown.enter` from `PlayerSign` (the native click is the activation) and add an
   Enter arm to r0 I3 and G6 so the gate presses the way a reader does.
4. Give the sheet Escape-to-close and close-on-focus-leave, and either a role and accessible name
   or a written reason it has neither.
5. Re-cut G8 as a two-variable gate (viewport height × row count) with a pass band the design can
   actually hold, and state what the reader does when the sheet sits over the board's first box.
6. Make the sheet dismissible from itself on a coarse pointer — today twelve cells' taps land in a
   box that neither answers nor closes.
7. Measure the chart's contrast on the ground the phone gives it (popover 80% over the wordmark
   and the digits), or make the phone arm opaque.
8. Replace the `?? var(--color-user-ink)` fallback with something that cannot paint a peer in your
   own hue.
9. Take PLR-SELF's `headDisclosures` registry: two head disclosures still open together and
   overlap 151 of 169.1px.
10. Implement the sheet's declared 150ms, or delete the row from the motion table.
11. Settle `.player-swatch` once for both player families (three e2e sites read it; PLR-SELF keeps
    it, PLR-PLACE deletes it).
12. Prune `arriving` / `departing` / `rowArmMs`, or name the reader that keeps them.
13. Give the lobby's drawn strings a derive rule in `check-font-coverage`; today the gate cannot
    see four of them.
14. Screenshot and measure the 16×16 arm, or withdraw "a density picture" as a claim.
15. Resolve `shown` / `hidden` against the incumbent `Off` / `On`.
16. Say what a reader at N=15 does with fifteen dots and four names — the current answer is that
    the spec stops claiming, which is not a mechanism.
17. Fix the webkit rate miss (40.6 vs ≤40) by the settle, not by moving the gate.
18. Re-run the π phone arm with the drawer open and shut, and declare which one the +32.83 belongs
    to.
19. Nothing on real iOS, no landscape, no relay arm (owner's rig, M19).

---

## 6 · Verdict

**ADVANCE, conditioned** — not BLOCK: no missing primitive here is as hard as the problem (the
ring's cure is one non-focus-coupled value; the disclosure registry is already written next door;
the keyboard defect is a deleted handler). Not RETIRE: nothing is a rewording and no constraint I
could measure is violated outright — AA, π, the budget, the copy register and the decided history
all hold where they were measured.

But the percentage is refused at anything near the record's eleven-of-twelve. The family's own
memorable sentence — *you are the ring* — is not on the running product in either engine, its
contrast row is a reading of the instrument, Enter does not open the surface, and on a short phone
the sheet is a dead patch over the board. **55%.**

U-10 stands over all of it: if the owner disposes against the split, this is a KILL, and the
research said so first.
