Worktree: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_6e1b18f4-0f2-1`

# LANE A — F4 PRIME, PASS 2

Blockers 1–3 closed **in the built app**, both engines. The center survives; one of its headline
claims does not, and the failure is reported at full strength below (§4). Nothing was deleted
this pass — deleting the drawer's staged zone before the re-deal question is settled would make
the everyday act worse by the lane's own measurements, and it would have made the tap comparison
unmeasurable.

Shots: `laneA-shots/` (22 files, chromium + webkit, 1440×900 · 375×667 coarse · 320×640 · 390×844).
Rig + raw results: `rig/rig.mjs`, `rig/negative.mjs`, `rig/results-{chromium,webkit}.json`.

---

## 1 · WHAT RUNS

Built dist, served on :4931, driven headless in **both** engines. `npm run build` = `vue-tsc -b
&& vite build`, green. `vitest` 307/307. `eslint .` clean (the `pencil ↛ games` boundary holds —
the band takes plain data through props). `prettier --check src/` clean.

**The order slip.** A band under the deck, bound to the ACTIVE card, a sibling of the listbox:
two axis lines (`size`, `level`) as chips in the estate's own `OptionSelector` grammar, and two
named verbs on the right — `resume`/`start` and `deal`. One `HandDrawnOutline` at `:pose="0"`,
frozen, enrolling no beat. `boilFrame: 0` on both selectors, so the scribble underlines are a
static raster.

| # | work order | state | evidence |
|---|---|---|---|
| 1 | reactive bridge: refs, publish on boot AND game-change, id-keyed handoff | **done, running** | §2 |
| 2 | verb model: safety inversion dies; cross-game deals through `guardIndex`; verbs inert while armed; `busy` bound | **done, running** | §3 |
| 3 | staging band outside `role="option"`, CSS `min-height`, bound to the active card | **done** (reservation measured decorative — §4c) | §3, §4c |
| 4 | cross-game truth: persisted per game or "new"; sizes id-keyed | **done, running** | §2 |
| 5 | honest parsimony, wrapper deletions netted OUT | **done — and it is a cost, not a saving** | §5 |

## 2 · THE BRIDGE (blocker 1) + CROSS-GAME TRUTH (order 4)

`src/games/shared/useStagingBridge.ts` (new, 150 lines). Every piece of state is a `ref`. Three
seams: App publishes the mounted id (`watch(scene, …, {immediate:true})` — boot, deep link,
`?view=gallery` boot, and every seam, which is precisely what pass-1's `enterGallery`-only
publish missed); the mounted game registers its live pair + its deal act; a one-shot **id-keyed**
handoff carries a cross-game deal into the incoming mount.

The handoff is consumed in `useGameState` **before** init and `canRestore` is ANDed with
`!staged` — one solver dispatch, no resurrected board. **No TTL, no clock**: any mount clears the
arm, so a mis-routed arm cannot outlive one mount. Pass-1's 10s TTL with a silent default-deal
fallback is gone rather than fixed.

**Cross-game truth** is one shared ledger (`staging-ledger-v1`, id-keyed) the mounted game writes
on `[pendingSize, difficulty, boardGeneration]`. Five games persist their boards under five keys
in five shapes; the picker cannot read them without importing five games, so the mounted game
publishes the row instead. A card with no row says "new" — it never dresses a registry default as
your saved board.

Measured, both engines:

```
ledger after a picker deal   {"sudoku":{"size":3,"difficulty":"HARD","board":true},
                              "kenken":{"size":6,"difficulty":"HARD","board":true}}
card sub-lines               ["9×9 hard · in progress", "size · 4×4 / 5×5 / 6×6 / 7×7",
                              "size · 4×4 / 9×9 / 16×16", "size · 4×4 / 9×9 / 16×16",
                              "6×6 hard · in progress"]
```

`3` means 9×9 for sudoku and `6` means 6×6 for kenken — the same bare number, two vocabularies.
That is why the handoff is keyed, and the id-keying is what the cross-game gate actually tests:

| gate | chromium | webkit |
|---|---|---|
| cross-game deal lands the RIGHT board | kenken 6×6 → **36 cells** | futoshiki 7×7 → **49 cells** |
| solver dispatches for that whole transaction | **1** | **1** |
| same-game kenken deal from the band (375, coarse) | 6×6, **1** dispatch | 6×6, **1** dispatch |

**GATE-1 negative control** (`rig/negative.mjs`, run against a build patched to pass-1's exact
shape — ledger as a plain module `let` read through a `computed`):

```
good build   {"activePick":["6×6","Hard"], "kenkenSubline":"6×6 hard · in progress",
              "safeVerb":"resume"}                                    GATE-1 PASS
defect build {"activePick":["4×4","Easy"], "kenkenSubline":"size · 4×4 / 5×5 / 6×6",
              "safeVerb":"start"}                                     GATE-1 FAIL
```

The defect build's ledger on disk already held `{kenken: 6, HARD}`. The picker could not see it.
That is the pass-1 bug, reproduced and then killed.

## 3 · THE VERB MODEL (blocker 2) + THE LISTBOX (blocker 3)

**The inversion dies by giving the safe verb a name.** Pass-1 put a 56px framed **Deal** on the
card and left "visit" an unlabelled click on the card body: the only discoverable act was the
destructive one. Here both acts are words of the same size, safe-first in reading order, and the
safe one *reports the state* — `resume` when a board is saved, `start` when the game has never
been played. The card's own sub-line says what is waiting there, so the band prints it once, not
twice. Blind-read artifact, no captions, both engines:
`blind-A-*.png` (resume | deal) · `blind-B-*.png` (start | deal). Reading protocol in
`laneA-MEASURE-REQUESTS.md` §M4 — this lane does not grade its own blind read.

**Cross-game deals route through the existing ribbon.** `guardIndex` gained a `guardIntent`:
one ribbon, two intents. `.guard-keep`/`.guard-leave` are untouched as act hooks, so
`gallery-guard.spec.ts` needs no edit; only the copy is keyed. Measured identically on both
engines with a dirty board:

```
ribbon  true   text "deal over this puzzle? your marks aren't saved"
leave   "deal" keep "keep"   aria-label "Deal a new board?"
band verbs while armed  [disabled, disabled]     keep → ribbon dismissed  true
```

A deal is guarded on **any** dirty board, same game or different, on **every** pointer — pass-1's
arm was `isCoarse`-fenced and checked `props.dirty` only, so a dirty sudoku could be abandoned by
dealing futoshiki with no mention of it. `busy` is now actually bound (`:busy="dealBusy"` from
App), which pass-1 documented on two components and never passed.

**The listbox break is closed by construction.** The band is a sibling of `.gallery-viewport`,
not a descendant of `role="option"`:

```
options 5 · bandOutsideListbox true · bandTabStops 8
stagingControlsInsideOption 0        ← the delta this lane is accountable for
focusableInsideOption 83 (of which boardInputsInsideOption 81)
```

Those 81 are Wave C2's live-face projection — the ONE real board teleported into the centered
card — a **pre-existing** condition, not this lane's. F4 pass-1 would have added six more; this
adds zero. The 81 remain an open estate question (§6).

Three other pass-1 defects die with the same move, and honestly they die by never being built:
five `HandDrawnOutline` stamp frames baking four pose paths each for boxes `visibility:hidden`
guaranteed would never paint (**0 mounted**), the flank void (the flank cards are byte-unchanged
from shipped), and five controls per axis instead of one.

## 4 · WHAT DID NOT SURVIVE MEASUREMENT

**(a) T1 is falsified for the everyday re-deal.** Measured in the same built app, same engine,
same session:

| transaction | today's drawer | the band | dispatches |
|---|---|---|---|
| same game, harder (1440, drawer at rest — staged zone IS visible) | **2 taps** | **3 taps** + a 1240ms fold | 1 vs 1 |
| kenken at 6×6 hard, from sudoku (1440) | 9 taps | **8 taps** | **2 vs 1** |
| futoshiki at 7×7 hard, from sudoku (webkit 1440) | 6 taps | **5 taps** | **2 vs 1** |

The picker LOSES the routine re-deal on desktop and wins the cross-game transaction by one tap
and one whole board generation — today's path deals a board at defaults on mount and the user
immediately throws it away (`generatesThrownAway: 1`, both engines). F4's proportionality law
holds in the direction the lane did not want: ceremony for the switch is right, and the picker is
ceremony, so the everyday re-deal does not belong in it. **This is the case for keeping the
drawer's staged zone**, and it is why nothing was excised this pass.

The mobile picture is different and unmeasured on device: today's staged zone starts at y=578.8
of a 667 viewport with the page scrolling to 1180, so its Deal control is below the fold — a
scroll the tap count does not price. `laneA-MEASURE-REQUESTS.md` §M1 is that row.

**(b) A shipped WebKit carousel defect, band-independent.** Found while driving the rig,
reproduced with `.staging-band` removed from the DOM before the gesture, Chromium correct on
every path:

- a 4th `ArrowRight` lands on card 2, not card 4;
- `End` lands on card 4 and reverts to card 2 within ~400ms;
- opening the picker while playing **kenken** centers **thermo**;
- native scroll-snap (the swipe) is correct on all five cards.

`useCarouselGlide`'s programmatic glide races WebKit's snap and `syncFromScroll` wins with a
stale index. Not in this lane's diff. It is why WebKit's desktop cross-game row targets futoshiki
and its kenken coverage runs at 375 (where the swipe works). §M5.

**(c) The CSS reservation buys 0px today.** The gate and its negative control, both engines:

```
1440  walk (5 cards)  slipH 112 constant · pipsTop 617.8 constant
      walkNeg         slipH 109.5 constant     ← the rule is live (it moved the box 2.5px)
320   walk / walkNeg  slipH 175.9 / 175.9      ← the 10.5rem reserve is BELOW content here: inert
```

The content height is already card-invariant, so the reserve prevents a shift that does not
occur. The negative control was shown able to change the box, so the instrument is not dead — but
the reservation is a cheap guarantee, not a measured cure, and it is reported as such. At 320 the
reserve is simply below the content and does nothing at all.

**(d) Not attempted this pass**: the `RedealStrip`. Given (a), re-homing the everyday deal from
the drawer to a board-margin strip would move it from a divider away to directly under the board
(the critique's §4.6), for an act that is already 2 taps. The strip is a live question for the
adjudicator, not a thing to build before (a) is confirmed on device.

## 5 · PARSIMONY, HONESTLY

Added lines counted over the tracked diff **plus both new files in full** (a `git diff` alone
silently exempts every untracked line):

```
total added 739 · code 507 · comment 175 · blank 58 · removed 12
```

| file | + | − |
|---|---|---|
| `games/shared/useStagingBridge.ts` (new) | 150 | — |
| `pencil/chrome/GameGallery/StagingBand.vue` (new) | 253 | — |
| `pencil/chrome/GameGallery/GameGallery.vue` | 122 | 9 |
| `games/registry.ts` | 66 | 3 |
| `App.vue` | 55 | — |
| `games/shared/useGameState.ts` | 52 | — |
| `pencil/chrome/GameGallery/types.ts` | 26 | — |
| `games/registry.test.ts` | 10 | — |
| `pencil/chrome/GameGallery/GameCard.vue` | 5 | — |

**F4-attributable this pass: +727 net, +507 code-only. There is no offsetting deletion.** The
419-LOC wrapper deletion is Lane D's and is netted OUT. The drawer's −324 excision is not claimed
because it did not happen and, per §4a, should not happen yet. Bundle: `index-*.js`
210,190 → 215,386 B (+5.2 kB raw, +1.7 kB gzip).

That is more expensive than pass-1's spec claimed and roughly what its critique predicted. The
family is buying a fused cross-game transaction and one fewer wasted board generation for ~500
lines of code. Whether that trade is worth it is the adjudicator's call, not this lane's.

**Mark-4 gate**, over the same 739 added lines:

```
'filter:'  0   ← PASS
'flex'    12   ← the grep fires (negative control)
'url(#'    0
```

Zero new live-filter surfaces, zero new beat enrolments, one new `HandDrawnOutline` instance at a
frozen pose. Coarse targets: chips and verbs both measured **44.0px** at `pointer: coarse` — the
critique's 35.8px chip finding, cured locally in the band rather than by widening every drawer.

## 6 · OPEN ITEMS

1. **The everyday re-deal has no picker answer** (§4a). Either the drawer's staged zone stays
   (the honest reading of the numbers) or a strip earns its place on device. Adjudicator's row.
2. **81 board inputs live inside `role="option"`** — Wave C2's live-face projection, shipped, not
   this lane's. Someone owns it; today nobody does.
3. **The WebKit programmatic-glide reversion** (§4b) — "open the picker on your current game"
   is broken for kenken on Safari, today, in production.
4. **Crayon tints dropped from the band's difficulty chips.** `colorClass` is scoped inside
   `GameControlPanel.vue` and inert anywhere else (F5's finding); adopting it needs the AA
   re-verify against `--color-card`. The band ships monochrome deliberately.
5. **Sudoku's first-deal difficulty is `randomDifficulty()`**, so its registry `default` is a
   staging seed, not a prediction. Unreachable in practice (sudoku is eager and always has a
   ledger row before the picker can open), and it is what `deal` will honour — but it is the one
   place in this diff where a stated default is not a claim about the game's own behaviour.
6. **The guard ribbon overlaps the band at 375** (`webkit-375-deal-ribbon.png`). It covers the
   verbs it disables, which reads correctly, and clips the size row, which does not. Polish.
7. **No e2e added.** `gallery-deal.spec.ts` (band deal, ribbon intent, `d` key, chip no-bubble)
   is unwritten; the rig is a scratchpad harness, not a suite row.
