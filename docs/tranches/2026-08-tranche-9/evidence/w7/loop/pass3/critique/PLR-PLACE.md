# PASS-3 CRITIQUE · PLR-PLACE · The seating chart

Adversarial. I did not write the spec or the prototype. Base `74a2b5d9`; prototype worktree
`.claude/worktrees/wf_f72f3b5a-83a-53`, branch `worktree-wf_f72f3b5a-83a-53`, working tree read
(`git diff --stat` = 11 files, +267/−58, 8 untracked paths — matches the return).

**CONVERGENCE: 62%. VERDICT: ADVANCE.** Three behaviours contradict the design's own sentences and
I measured all three in both engines; three landed gates do not test what they are named for; four
gates were not run at all; the substrate everything green rides on is a stand-in this lane wrote
itself. Nothing here is a constraint violation and nothing is a missing primitive, which is why it
is not RETIRE or BLOCK — but 100% is nowhere near.

## 0 · What I ran myself

Servers: prototype `127.0.0.1:4246`, HEAD control (the MAIN tree at `74a2b5d9`, read-only)
`127.0.0.1:4247`, each on a private `cacheDir` from a two-line scratch config; both killed before
this was written; nothing in 4230–4249 is mine at the fold. Probe + readings banked at
`critique/PLR-PLACE-probe/` (`critic.spec.ts`, `critic-readings.txt`, the two vite configs, 28 KB).
Six rows × chromium + webkit, **12 passed**, against the prototype's own dev tree. No frames banked
by this lane (the family's four are cited below instead).

| row | chromium | webkit |
|---|---|---|
| C1 query at N=4 (3 dots), peer row vs SELF row | see §1.2 | identical |
| C2 Hidden → Shown, what the wire carries | see §1.3 | identical |
| C3 `<filter>` count shut / open solo / open live | 15 / 15 / 15 | 15 / 15 / 15 |
| C4 pitch at 4×4 and 16×16 | 42.656 / 170.656 | identical |
| C5 π vs HEAD, solo, regime witnessed | 0.00 everywhere | identical |
| C6 first-paint latency of the dots | **804 ms empty** | **812 ms empty** |

`lint:copy` run by me in the worktree: **exit 0**, 0 em/en dashes, 0 unadmitted jargon, 0 admitted,
self-test colours all as required — and `check-copy-register.mjs` walks all of `src/`, so
`lobbyCopy.ts` IS inside the gate the return claims without replaying `COPY_SOURCES`. That claim
holds.

## 1 · Three measured contradictions

### 1.1 THE CHART OPENS EMPTY FOR 800 ms (both engines, C6)

`PlayerLobby.vue` starts `settled` at `{}` and its watch arms a full `WASH.placeSettleMs` timer for
**every** peer the first time `open` goes true. I held a 3-peer room perfectly still for 2 s — every
`cur` long since sent and long since settled — then pressed the sign: **0 dots at open, 804 ms
(chromium) / 812 ms (webkit) before the first dot paints.** The file's own header says the opposite:

> "What is NOT damped is the FIRST reading: the sheet opens on where the room is now, because
> everything in `peerCursors` at that moment has already been still long enough to be sent."

That sentence is false as built. It is also the load-bearing one: the whole family is a thing you
press to find out where everyone is, and for the first 0.8 s of every cold open it shows an empty
board with the names listed under it. Re-open after a close reads 2 dots at 60 ms, because `settled`
survives `stopTimers()` — so the second open shows possibly-stale cells immediately and the first
open shows nothing at all, two different behaviours from one press. Frame 1 and frame 3 are both
post-settle crops, so the unverified-gestalt tell applies: the state a reader meets first was never
looked at.

Closable in one line — seed `settled` from `peerCursors` inside the `open` watch before arming any
timer — but it must then be re-measured, and `e2e/player-place.spec.ts` needs the row.

### 1.2 HOVERING YOUR OWN ROW DIMS EVERY DOT AND ANSWERS NOTHING (both engines, C1)

`PlayerLobby.vue` puts `:data-peer="p.id"` and `@mouseenter="query(p.id)"` on **every** row including
your own, and `PlaceChart.vue` dims `queried !== null && queried !== p.id`. Your id matches no dot.

```
before      ["1","1","1"]
on a peer   ["1","0.55","0.55"]      correct
on SELF     ["0.55","0.55","0.55"]   every dot quiet, nothing bright
```

A question with no answer, in the one affordance the family adds to the sheet. The self ring is not
in the dim rule so it stays at 1, which reads as an accident rather than a rule. Closable: exclude
`p.self` from the handler, or say in the design that the self row queries the ring and give the ring
the state.

### 1.3 `Shown` NEVER PUTS YOUR CELL BACK ON THE WIRE (both engines, C2)

`setShareCursor(on)` returns at `if (on) return;`. After `Hidden` → `Shown` the tap on the room's own
channel carries **exactly the same one frame** it carried after Hidden (`[{p:null,…}]`) — nothing new.
Meanwhile A's own sheet paints `.chart-self` = 1 immediately (`selfPos` reads local `lastCell`), and
B's sheet draws **0 dots** for A. So:

> `selfPos`'s comment: "`Hidden` puts it out with your dot: the chart you read is the chart the room
> reads, never a private one."

Shown inverts it. Your chart and the room's chart disagree until your next focus change, which may
never come if you are reading rather than typing. This is the masked-fallback tell: the off switch
was cured for the two-nulls defect and the on switch was left as an early return. Closable:
`setShareCursor(true)` republishes `lastCell.value` (and sets `curSent`).

## 2 · Three gates that do not test their own name

- **G16.** The landed row (`e2e/player-place.spec.ts:221-236`) builds a room of **two**, so the chart
  holds exactly **one** dot, hovers row `.nth(1)` — that dot's row — and asserts
  `dimmed.every(o => o === "1")`. The 0.55, the family's one query affordance, is asserted **nowhere
  at any N**. My C1 is the first measurement of it in a gate-shaped form. The mechanism does work
  (frame 3 and C1 both show it); the gate is the problem.
- **G4.** `setTimeout(…, 6000)` at `:294-313`. The return, the README §8/§11 and the spec's
  success numbers all say **60 s**; it is **6 s**. Separately, the observed subtree
  `[data-player-mark]` is the button — `.lobby-state`, the chart and the `is-live` class all live
  outside it — so no `cur`-driven mutation could enter the observer's scope even if one existed.
  Re-scope to `.player-sign` and run the stated duration, or restate the number.
- **G14.** Tests 9×9 only and skips its own dot assertion when no dot is drawn
  (`if (read.dotPx !== null)`). The spec asks 4×4 / 9×9 / 16×16. I measured the two it skips: **42.656
  and 170.656**, i.e. `10.667·N` to 0.01 at both — so the claim is TRUE and the gate still does not
  hold it.
- **G24** (fourth, same family): reconciles counts at N=2 and asserts nothing about the three
  qualifiers, which are this pass's own delta; the spec's `(2,0) 664 N=6` arm was never run.

## 3 · What is genuinely earned (I reproduced it)

- **π is real.** C5, prototype vs the MAIN tree at `74a2b5d9`, SOLO, regime witnessed by `matchMedia`
  on both sides in one `browser.newContext()`: `.controls-card`, `.action-bar`, `.board-wrapper`,
  `.page-root` and `.tray-well` all read **0.00 on all four rect components** at 390×844 coarse and
  1280×800 fine, both engines. Pass 2's `+32.83` is dead by construction and not by argument, and
  the P1 seal's own scene is untouched. This is the pass's best work.
- **The pitch is held**, and further than the lane measured: 42.656 at 4×4, 170.656 at 16×16, square.
- **filterBudget:** 15 → 15 → 15 through shut / open solo / open live, both engines (C3), on top of
  the estate's own `filter-census.spec.ts` 12/12 against the BUILT dist. Pass 2's 6/6 dev-server row
  is properly retired. The chart mints zero live filters — pose 0 and pre-baked paths, correctly.
- **The lap law.** Seven arms, one `evaluate` each, regime witnessed first, **delta 0.00**, and the
  `+4.7` residual NAMED (`.lobby-rows { gap: 0.1rem }`, 1.60 a seam) and deleted rather than modelled.
  The `(1.6+S)·m` term struck by measurement is the right kind of finding.
- **Painted AA, both themes, every row from bytes** with the sheet lapping the wordmark by 7,317.1 px²
  — and two of the spec's own projections corrected against it (subgrid 3.52 → 7.57, ring 7.52 → 7.46).
  A family that reports its own table wrong in its own favour is rare; this one reported it wrong
  against itself.
- **G5's two-nulls cure** with the mechanism named (the chip press is itself a focus move), and the
  `curSent` seam is the right shape.
- **G22** (the specificity cure — a media query adds no specificity, so `.player-lobby.is-open` had to
  be named) and **G23** (the ring rule pass 2 promised twice and never wrote).
- No consumer-less substrate: `useBoardShape`, `lastCell` and `shareCursor` each have exactly one
  writer and one reader, and the write sites are commented as such.
- Not a generic default: the chart is the board's own `generateGridBoilFrames` paths at pose 0, the
  ring is `gameCell.css`'s existing peer-cursor idiom, the chips are the estate's `OptionSelector`.
  No cream-and-terracotta, no eyebrow, no arrow, no invented switch.

## 4 · Constraints, checked

| constraint | reading |
|---|---|
| π on unclaimed surfaces | **CLEAR** — C5, 0.00, both regimes, both engines, control named |
| `filterBudget` 9 | **CLEAR** — dist census 12/12 both engines; `<filter>` 15/15/15 reproduced |
| AA both themes | **CLEAR on the table** — all seven rows painted, every floor cleared. **NOT MEASURED:** the focus ring's own contrast (G23 asserts style/width/offset only) |
| M16 plain copy | **CLEAR** — `lint:copy` 0 verified by me, `LOBBY_COPY` inside the gate's walk. One register note: `no colour yet` is the only British spelling in any rendered string in the estate (`grep -iE '(aria-label\|text=\|label:)[^,;]*colou?r'` → 0 other hits) |
| W2 landed mechanics | **RESPECTED** — no new mechanic; `your cell` uses `OptionSelector` inside the existing `.tray-well`, tap floor via `--tap-floor`, dock and tab untouched |
| decided history (r0/R6) | laws 14/25/32/33/36 cited and the numbers check out against `r0/r6-idiom-history/R6-census.md`. **Law 33 is strained, not met** — see §5 |
| chair §6.9/§6.12 | obeyed in intent, unmet in fact: the substrate was written HERE, not taken from PLR-SELF |
| the record | nothing under `r0/`, `pass1/`, `pass2/` touched by the lane or by me; r0 I3 reported MOVED, hue rows 127-128 UNCHANGED (the substrate keeps `.player-swatch`, so the moot withdrawal is right) |

## 5 · The rest of what is open

- **The substrate is a STAND-IN.** `App.vue`, `AttributionCard.vue`, the head slot, `lastHeard` /
  `PRESENCE_QUIET_MS` / `quietMs`, `MOTION.presenceInkMs` and the document-`focusin` leave were
  written by THIS lane because PLR-SELF's pass-3 worktree did not exist. Every GREEN above rides it.
  Honestly declared, and it is still the largest single uncertainty in the return.
- **G19 RED:** live `.players-well` 143.50 vs HEAD's 88.47 = **+55.03 unpaid**. Solo is π so the seal
  is safe; the room is not. The paying hunk is PLR-SELF's stripped roster move — this family cannot
  close it alone and says so.
- **G1 not run at all.** The WebKit rate replay at 700 and 800 with the `PLC_SLOW=1` control. Owed
  since pass 1, where the reading was 40.6 at 700 — **0.6 over the ≤40 floor**. `placeSettleMs` 700
  is in the tree; nothing measures it. This is the number that decides whether the constant is right.
- **G20 not measured.** The gate this pass minted. The coarse attribution tape falls back to
  `focusedPos` and `@pointerdown.prevent` keeps the cell focused, so the tape stays up under the
  sheet on a phone; the painted-box lap, the `elementFromPoint` ownership reading outside any inert
  subtree, and the dismissing tap are all unmeasured.
- **G9 not run** — `your cell` at 390 and at 1023 inside the well.
- **The dismissal is never asserted.** The lap is reported at seven arms; nothing shows that a tap in
  the lapped region dismisses the sheet and hits no control.
- **The sheet says the count twice.** The button's `aria-label` is `2 other players` and the first
  child of the sheet it opens is `<p class="lobby-state">2 other players</p>`. A screen reader hears
  the name, then the same sentence again, on every open. R6 law 33 ("one name per act") is cited by
  `PlayerSign` in its own defence and is untested against this repetition; the `<p>` is also the one
  element in the shut sheet that stays live and reactive.
- **`lobbyStrings` has no derive in `check-font-coverage`.** Two strings are declared; the eight the
  sheet actually renders (`no other players`, `1 other player`, `other players`, `you`, `and N more`,
  `N seconds ago`, `no cell shown`, `no colour yet`) reach the woff2 gate only incidentally. The
  4,312 B / 46-codepoint reading was never asked to cover them.
- **16×16 measured at the desk only** (353.56, +74.65); the spec asks (5,0) and (2,0) at 844.
- **The desk `gridTop` law is unwritten** — `0.5·vh − 200.27` is exact at 390 wide and reads 124.45
  against the law's 199.73 at 1280. The desk laps are a table, not a law.
- **Five estate roster specs and `zone-grammar.spec.ts` were not re-run.** The argument (room-only row,
  roster hunk stripped) is sound and is still an argument.
- **AND THEN THE HARD PART, the lane's own words:** at 390×664 the sheet laps the board by **127.69 px**
  with two rows on it, and the chart is 96 of the 211.67. The law says so exactly and nothing in this
  design makes it smaller. This is the reason the family exists and the family has not addressed it.

## 6 · Failure-mode checklist

| tell | hit |
|---|---|
| vacuous convergence | no |
| spec cites itself | no |
| **gates that cannot fail** | **YES** — G16 (one dot, asserts every dot is "1"), G4 (6 s over a subtree with no `cur`-driven binding, cited as 60 s), G14 (conditional dot assertion, 9×9 only), G24 (counts only) |
| **the elegant-reduction trap** | **YES** — 390×664's 127.69 lap, admitted by the lane |
| legacy aliases | no |
| **masked fallbacks** | **YES** — `settled` at `{}` hides the cold start (§1.1); `setShareCursor`'s `if (on) return` hides the republish (§1.3) |
| **unverified gestalt** | **YES** — the 800 ms empty chart every reader meets first is in no frame and no number; the self-row query state was never looked at |
| consumer-less substrate | no |
| the generic default | no |
| **the pixel it did not declare (π)** | **no** — verified 0.00 by me, both regimes, both engines |
| **the constraint it forgot** | **PARTIAL** — R6 law 33 against the doubled count; M16 register on `no colour yet`; the focus ring's own contrast |

## 7 · Cross-pollination

1. **The regime-witnessed π census** (`matchMedia` asserted on BOTH pages of one
   `browser.newContext()` before any rect is read) is the instrument that killed pass 2's `+32.83`.
   Every §10/§11/§13 lane with a phone number should be running it, not a viewport size.
2. **"Re-derive every AA row from PAINTED bytes."** This family's `color-mix` projection erred low by
   2× on a 1px line and high on a 2px stroke, in opposite directions. Any lane quoting a token's
   ratio for a hairline or a stroke is quoting a number the paint does not produce.
3. **Name the residual before you model it.** `+4.7` was `gap: 0.1rem` × the seam count; deleting the
   gap made the closed form exact at seven arms. Any lane carrying a "residual" term in a height law
   should go looking for a 1.6 px seam first.
4. **The specificity cure for PRM blocks** — a media query adds no specificity, so a
   `@media (prefers-reduced-motion)` block must name the `.is-open` state as well as the base. Worth
   a wave-wide grep; PLR-PLACE found it on the one surface it owns.
5. **`@pointerdown.prevent` as the focus-seam cure**, with the finding that WebKit hands
   `relatedTarget: null` for a press AND a Tab alike, so `@focusout` cannot tell them apart and a
   document `focusin` bound only while open is the portable form. Any disclosure over a focusable
   surface in this wave wants both halves.
