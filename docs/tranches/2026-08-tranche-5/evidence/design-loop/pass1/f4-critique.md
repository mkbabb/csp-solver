# F4 "dealer's ritual" — ADVERSARIAL CRITIQUE (pass 1, non-author)

Read: `charter-f4.md`, `f4-research.md`, `f4-spec.md`, `f4-proto/MANIFEST.md` + every file under
`f4-proto/code/`, both mocks' templates, both measure harnesses, `results.json`,
`results-panel.json`, and four screenshots. Verified read-only against
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend` at `32198688`.
No dev server, no ports.

**Verdict: 55% converged.** The subtraction half is real, measured and honest. The half that
decides the family — the re-deal bypass — is written but never executed, and as written it
cannot render. The parsimony claim inverts under audit. The a11y contract the spec asserts is
broken by construction, and the harness couldn't have caught it.

---

## 1 · Real-code spot checks (12 of the spec/dossier's file→change claims)

| # | claim | verdict |
|---|---|---|
| 1 | `GameGallery.vue:216-224` select emits a bare id; `:219` arms only on `card.id !== currentId` | **TRUE**, verbatim |
| 2 | guard ribbon is the `@click.stop` precedent for in-card buttons | **FALSE** — the ribbon renders at gallery level, a sibling **outside** `role="listbox"` (`:370-400`, comment: "An overlay outside the scroll viewport"). It is not precedent for buttons inside `role="option"` |
| 3 | `GameCard.vue:230-231` `inert`+`@click.stop`; `:85-88`/`:276` `rangeLine` is the sole `range` consumer | **TRUE**; cards are `role="option"` `:aria-selected` under `aria-activedescendant` (`GameGallery.vue:324-328`) |
| 4 | M20 "`range`: 5 producers, 1 consumer, **0 tests**" | **FALSE** — `registry.test.ts:142,143,164`, plus `:54-66,108` for `options`. The prototype caught it (§5.4) and priced −12; **the spec was never corrected** |
| 5 | `GameControlPanel.vue:256-274` two-tap arm, `isCoarse`-fenced | **TRUE**, verbatim |
| 6 | `:582-586` peek divider = "spatial prophylaxis, Deal a full divider from the play tools" | **TRUE** — and see §4.6: F4 moves the everyday deal from a divider away to directly under the board |
| 7 | `GameBoard.vue:748` `.board-margin`, `pointer-events:none`, `≥1024` absolute z-50 (`:812-830`) | **TRUE**; the margin already hosts `DifficultyTally` + `MarginNote` + `SolverErrorNote` |
| 8 | `HandDrawnOutline` (`src/pencil/grid/`, not `chrome/`) ResizeObserver → regenerate 4 pose paths; `:pose` enrols no beat | **TRUE** |
| 9 | `OptionSelector`'s only filter is `:hover` fenced to `@media (hover:hover)`; `.ctrl-btn` = `px-3 py-1.5`, no coarse min-height | **TRUE** — 36px targets confirmed in the real CSS |
| 10 | `useGameState.ts:471-479` deal seam; `pendingSize` staged, `difficulty` live | **TRUE** |
| 11 | `sudoku/ControlPanel/ControlPanel.vue` is a pure relay | **TRUE** — its only content is the 17-line `sections` computed (`:59-75`). See §3 |
| 12 | "`src/games/sudoku/ControlPanel/` DELETE −213" | **IMPRECISE** — `constants.ts` can't die: `registry.ts:25,26,30` and four `game.ts` files import it. The MANIFEST's −213/−206 (vue+test only) is right; the spec's inventory row reads as a directory delete |

Also verified: `gallery-guard.spec.ts:139-152` asserts `.gallery-guard` count 0 **and**
`.game-gallery` count 0 for dirty+same-game Enter — F4 keeps Enter=visit, so it does ship green
(D3 holds). `eslint.config.js` `pencilMayNotImportGames` confirmed. `pencilConfig.ts:142,149,155`
= 440/520/200 confirmed. Only global single-letter keys today are `g` (App.vue:359) and `k`
(`useAnswerKeyPeek.ts:60`) — `d` is free.

## 2 · Numbers re-derived

- **Card box @375**: `min(78vw,22rem)` = 292.5 − 2×0.6rem slot padding = **273.3px**; face =
  273.3 − 2×0.9rem = **244.5px**. Matches `results.json.afterChipTap` (273.3 / 244.5). ✓
- **LOC**: re-summed every diff independently (`grep -c '^+' − 1`): measured rows total
  **+462 gross** before the wrapper deletions, **+43** after them, **+14** with the projected
  rows. The MANIFEST's table reproduces exactly. ✓ (The spec's −400 is falsified by its own lane.)
- **Choreography**: 200 + 520 + 520 = **1240ms** per picker round-trip. ✓
- **T5 rows**: the bench counts 15→9; the spec says 25→14. Two taxonomies, neither reconciled —
  only the percentages (−30.7% mobile card, −40/−45% rail) are transferable, as §3.2 admits.
- **Headline card delta (+53.1%)** compares two *mid-transform* snapshots: `mount` band cardW
  255.8 vs `noBand` cardW 249 (settled = 273.3), i.e. different scale phases. Layout-truth delta
  is column **426.8 → 597.8 = +40%**. Directionally right, headline overstated.

## 3 · The parsimony claim inverts

T7 (net ≤ −350) **fails**: +14 gross / −139 code-only, by the lane's own count. Worse under audit:
**419 of the 843 deleted lines are F4-independent.** `sudoku/ControlPanel/ControlPanel.vue` and
its futoshiki twin contain nothing but a `sections` computed; `KillerGame.vue:34` already proves
the wrapper is unnecessary today. Moving those 17 lines into the scene deletes both wrappers and
both tests **without any of F4**. Netting that out, F4's *attributable* cost is **+433 gross**
(+180 code-only) — an addition of roughly a `GameControlPanel`-and-a-half, against a shared
constraint that says a family wins partly on net-LOC. F4 is the most expensive family to build
that is currently claiming to be the cheapest.

## 4 · Defects the prototype's own code carries

**4.1 (BLOCKING) The re-deal strip does not render.** Two independent failures stack:
- `useStagingBridge.ts` holds `quickAxis`/`current` as plain module `let`s with plain getters —
  **not refs**. `RedealStrip.vue` does `const axis = computed(() => readQuickAxis())` and
  `v-if="axis"`. A computed over non-reactive state evaluates once and never invalidates:
  `setQuickAxis` can never turn the strip on, and a game switch can never update its chips.
  The stated model is `useDirtyBoard.ts` — whose whole trick is that `dirty` **is a `ref`**
  (`:23`, `watch(..., {immediate:true})`). The bridge copies the shape and drops the reactivity.
- `setQuickAxis` is called from exactly one place: `readStagedSeed()`, called from
  `enterGallery()` (`App.vue.diff`). On boot, on `?game=` deep links, and on the
  `?view=gallery` boot path (`useGameGallery.ts:44-50` sets `view` directly, never through
  `enterGallery`), it is never called at all.

So in the ordinary first run the strip's axis is null, the strip renders nothing — **and F4 has
already deleted the drawer's Deal**. The app ships with no deal affordance outside a 1240ms
gallery round-trip. §5.9's "T1 is only half-verified" understates it: T1 is contradicted by the
artifact. The strip was never mounted in Vue — the slice-2 bench is a static HTML mock of a
panel, not this component.

**4.2 (BLOCKING) The visible verb destroys; the safe verb has no affordance.** Looking at
`shot-desktop-safari-1440x900-band.png` and `shot-iphone16-portrait-375x667-band.png` as the
non-author reader falsifier (d) was handed to: the centered card's dominant element is a
full-width framed **Deal**. "Visit" — the non-destructive verb that restores your saved board —
has *no mark at all*: it's an unlabelled click on the card body. A user who wants to resume
futoshiki centers its card and sees exactly one button, which wipes futoshiki. Blind read: fails.
The two-verb split is the spec's load-bearing move ("this is what dissolves every guard
contradiction") and the reading it depends on is inverted — the discoverable act is the
destructive one.

**4.3 (BLOCKING) Focusable controls inside `role="option"`.** `code/f4/GameCard.vue` keeps
`role="option"` on the card root and puts six `OptionSelector` buttons plus a tabbable
`<button class="card-stamp">` inside it. The gallery is an `aria-activedescendant` listbox
(`GameGallery.vue:324-328`): DOM focus stays on the viewport, options carry no tab stops. Tabbing
into the stamp moves focus out of the listbox while `aria-activedescendant` still points at a
card; APG's listbox pattern doesn't permit interactive descendants of `option`. Screen-reader
users get no staging at all — the option's accessible name is `ariaLabel` (unchanged), so `d`
deals at settings they were never told. The prototype's a11y probe checked
`stampIsButton: true, stampTabbable: true` and scored it a pass; the mock has **zero**
`role="option"` (grepped), so the harness structurally could not detect the violation. T8's
"listbox contracts hold" is asserted, never tested.

**4.4 (MAJOR) The dirty cross-game deal escapes the ribbon.** `attemptDeal` checks `props.dirty`
only — never `card.id !== currentId`, never `guardIndex`. Dealing futoshiki's card while a dirty
sudoku board is live announces "deal a new futoshiki board? press again to confirm" and abandons
the sudoku marks with no mention of them; the ribbon's own words ("your marks aren't saved")
never appear. The stamp also stays live while the ribbon is armed on the same card
(`GameCard.vue` stamp has `:disabled="busy"` only), so a user mid-keep/leave decision can deal
through an open `alertdialog`. D3's "exactly two confirm idioms, one per verb" holds only if the
deal verb can't also perform a switch — it can.

**4.5 (MAJOR) Cross-game chips lie.** `chipsFor()` overlays the mounted board's real pair only
when `card.id === props.currentId`; every other card shows `staging[].default`. A futoshiki card
reading "board size 4×4" over a persisted 6×6 board is a card whose two verbs disagree: body
restores 6×6, stamp wipes it to 4×4 at a size the user was shown but never chose. Open Q3 was
answered with "registry defaults" and the truthfulness cost was never priced.

**4.6 (MAJOR) The prophylaxis is deleted and inverted.** The peek divider existed so Deal sat a
full divider from the play tools (`GameControlPanel.vue:582-586`, verbatim). F4 deletes the
staged zone and re-homes the everyday deal into `.board-margin` — at ≥1024 an absolute z-50
overlay **directly under the board square**, at <1024 in flow immediately below it. The
compensation is the ported arm, which only fires when the board is dirty. A pristine board's deal
is one unconfirmed tap at the board's own edge, sharing a flex column with `DifficultyTally`,
`MarginNote` and `SolverErrorNote` — competition in that host is unmeasured.

**4.7 (MAJOR) The flank void, and what pays for it.** D5's reservation is right for the bake gate
and wrong on the page: `shot-desktop-safari-1440x900-band.png` shows futoshiki and thermo as
cards with ~40% of their paper blank below the name. It doesn't read quiet, it reads unfinished —
and at 1440 the flanks are not "mostly cropped". The reservation also mounts a `HandDrawnOutline`
stamp frame on all five cards: mount bakes go **5 → 10**, five of them baking four pose paths
each for a stamp that `visibility:hidden` guarantees will never paint. That is exactly the
mount-time CPU T4-P1 is chasing, spent on invisible geometry — and it falsifies the spec's T6
("zero new bakes"; the MANIFEST's narrower "zero new *enrolments*" is the true claim).

**4.8 (MAJOR) Mark coverage is thinner than claimed.**
- *Deal weight*: cured in the picker (56px framed stamp, Fraunces). Re-instated everywhere else —
  the strip's deal is the 28px `DiceIcon` + `icon-sublabel`, the exact affordance problem-brief 1
  names, visible in `shot-panel-mobile-375-coarse.png` panel D.
- *Drawer grammar*: **untouched by refusal.** Panels B/C2 in the bench shot are three identical
  display-caps + `OptionSelector` stanzas (MARKS/CHECK/CANDIDATES) with identical weight — the
  defect verbatim, now with fewer instances. The peek divider survives as a separator that
  separates nothing (the f4 file's own comment: "It no longer separates two zones").
- *CHECK integration*: **zero coverage.** The charter's "the drawer loses its most contrived
  half" mis-identifies the half — the owner's "contrived, not naturally integrated" is on
  CHECK/CANDIDATES (`AssistSettings.vue`), which survive intact and, post-excision, *dominate*
  the remaining panel.
- *Mobile geography*: card −30.7% (measured, honest), but the strip adds 48.1px in flow above it,
  so the column improves ~176px, not 224; on the bench's own absolutes the stacked column is
  still ~1050px against 667. No thumb geography is introduced; mobile stays a compressed desktop
  with a shorter card.
- *Picker hierarchy*: center weight improves; the pips stay generic dots and `nameViewBox` stays
  an estimate (problem-brief 7's other two clauses), and the flanks get worse (4.7).

**4.9 (MINOR, real) Dead safety mechanism.** `busy` is declared and documented on both
`GameGallery` and `GameCard` ("a deal is in flight: the stamps go inert") and **App never passes
it** — `App.vue.diff` binds `:staged` and `@deal` only. Double-deal is unguarded.

**4.10 (MINOR) The handoff isn't id-keyed.** Documented as safe "by construction", but the arm is
consumed by whichever `useGameState` sets up next. Deal kenken → slow lazy chunk → `g`, deal
sudoku → kenken resolves and consumes sudoku's pair. Sizes are bare numbers with per-game meaning
(sudoku 3 = 9×9; kenken 4-6 = side length), so the mis-seed produces a wrong-size board inside
the 10s TTL. Two lines of id-keying closes it.

**4.11 (MINOR) Inherited-but-promoted tap targets.** 35.8px chips (`results.json`) on the card
*and* the strip, against the estate's own ≥44 coarse convention (`.icon-btn`, the peek surface).
F4 makes chips the primary staging control on touch. The fix (§5.2, one rule in
`OptionSelector.vue`) is right and unpriced in the spec.

## 5 · Failure-mode checklist

| row | finding |
|---|---|
| **vacuous convergence** | Partly avoided — falsifiers (a)(c) and the drawer bench are artifacts that could have failed, and (c) did force `@click.stop`. But the family's deciding claim (T1, "2 taps, 0ms, both regimes") is asserted "by construction" for `RedealStrip.vue`, which was never mounted and, per §4.1, cannot render. The one component that decides the family is the one with no executed artifact. |
| **spec-cites-itself** | Dossier→real-line traceability is clean (12/12 spot checks land, one wrong: M20). The circularity is temporal: the prototype falsified six spec claims (T5 absolutes, T6 "zero new bakes", T7 −400, M20, slice-2 `#margin` hosting, card 340→535) and **the spec still states all six**. The document of record now cites a world its own evidence disproved. |
| **gates that cannot fail** | Falsifier (b) ran with no negative control — the `?band=0` regime executes **0 snaps** (`results.json`, `bakesPerSnap: []`), so the instrument was never shown capable of a non-zero, and the "reservation is load-bearing" conclusion is unearned (the counterfactual active-card-only band was never built). The a11y "gate" asserts `stampIsButton`/`stampTabbable` — it certifies the §4.3 violation as a pass. |
| **elegant-reduction trap** | "The drawer's staged zone dissolves" is the easy half and it's done well. Deferred: the strip's wiring (broken), cross-game staging truth (defaults), the two-verb read ("NOT headless-decidable"), the listbox model, the flank void ("CRITIQUE owns the call"). Three of the four hard parts were handed forward rather than decided. |
| **legacy aliases** | Clean on `range` — replaced, not aliased, with the pencil twin updated in lockstep. Two residues: the peek divider kept as a separator of nothing, and `ControlPanel/constants.ts` surviving directories the spec lists as DELETE. |
| **masked fallbacks** | Three. (i) The strip "renders NOTHING" when axis/source is absent — documented as a feature, and it's the mask that hides §4.1. (ii) `void dealStaged(pair)` in `App.vue` discards the `false` return: a picker deal on an unregistered board is a silent no-op after a 520ms fold. (iii) `consumeStagedHandoff` expiring past TTL silently deals the game's default instead of the staged pair, with no signal. |
| **unverified gestalt** | The composition *was* rendered and shot — genuinely more than most lanes. But: the mock has no `role="option"`, no live board face, so the band's coexistence with `isLive`/Teleport (the charter's explicit question) was never rendered; the strip was never rendered in a real `.board-margin` beside `MarginNote`/`DifficultyTally`; and nothing was measured in the built app on real Safari. The one composition that *was* looked at shows a defect the lane flagged and left open (flank void). |
| **consumer-less substrate** | Five flank stamp outlines baking 4 pose paths each that `visibility:hidden` guarantees never paint. `busy` prop with no producer (§4.9). The `quick`-axis publish seam whose only consumer can't observe it (§4.1). `StagingAxis.quick` is registry data whose sole reader is a component that never renders. |

## 6 · Shared constraints

- **Soul**: honored — HandDrawnOutline, OptionSelector, DiceIcon, washi grammar; no imported
  vocabulary. Two blemishes: the stamp's frame nests inside the card's frame (two hand-drawn
  rectangles, similar stroke weight, ~12px apart — visible in both band shots), and the stamp's
  sublabel renders the literal keyboard hint `"d"` on touch.
- **Parsimony**: **violated** (§3).
- **No new live-filter surfaces**: **honored, and this is the family's best work.** `grep '^+' |
  grep 'filter:'` = 0, independently reproduced. `:pose` reuse adds no beat enrolments; chip boil
  is a bounded 4-frame burst instead of the 150ms beat (§5.8 — a trap correctly avoided);
  `DiceIcon`'s `playing` animations are `500ms/250ms … forwards`, bounded.
- **Safari-first**: **not satisfied.** All evidence is Playwright WebKit 26.5 against a
  standalone mock; `perf-rig-iphone16` is Shutdown; no built-dist run. This campaign's premise is
  that the owner's word overrules a green Playwright-WebKit battery, so a Playwright-WebKit
  battery is the one form of Safari evidence already discounted here. Honestly disclosed (§2.3).
- **a11y contracts**: aria-live announce and `Escape`-disarms are good; `inert`-at-rest holds;
  `aria-expanded` untouched. `errorCheckMode` stays a manual prop+emit ✓. The listbox contract
  is broken (§4.3).
- **Refusals**: honored in letter (drawer staging excised, live tools untouched, no new drawer
  mechanics). Broken in spirit on the family's own thesis — F4 exists because "new-game staging
  is split across two surfaces with no connective tissue", and it ships staging on the picker
  card **and** on the board-margin strip. The amputation isn't healed; it's re-cut along a
  different line.

## 7 · Strengths worth cross-pollinating

1. **The mark-4 discipline is exemplary and transferable**: frame anything drawn in
   `HandDrawnOutline :pose` (zero enrolments), drive chip scribbles with a bounded burst never the
   live beat, keep `filter:` out of the diff and prove it by grep. Every family should adopt the
   grep as a gate.
2. **Snap-invariant card box**: any family that varies gallery card height on snap re-bakes
   `HandDrawnOutline`'s 4 pose paths per gesture. Reserve the box (but reserve it with CSS
   `min-height`, not five mounted outline instances — §4.7).
3. **The proportionality law**, correctly applied: ceremony for the game switch, near-zero for the
   routine re-deal. The bypass idea is right even though this implementation of it doesn't run.
4. **`useStagingBridge`'s handoff-seeds-before-init**: consuming the one-shot *before*
   `useGameState`'s init and ANDing `canRestore` with `!handoff` is the correct answer to the
   lazy-game problem — one solver dispatch, no resurrected board. Reusable by any family needing
   picker→game transport. Make the module state refs first.
5. **Two inherited defects discovered here, both shippable independently of F4**: (a) the Fraunces
   subset has no uppercase, so today's `.section-heading` SIZE/DIFFICULTY/MARKS/CHECK all render
   in the Georgia fallback — with the trap that `document.fonts.check()` returns true regardless;
   (b) `.crayon-*` is scoped inside `GameControlPanel.vue`, so `difficultyOptions`' `colorClass`
   has been inert inside `OptionSelector` since it was written, with an AA ledger already
   verified for the cure (green-ink 4.95 / orange 4.91 / red 4.98 on `--color-card`).
6. **The 419-LOC wrapper deletion** is real and available today, F4 or no F4 — hand it to whichever
   family ships, or ship it standalone.
7. **Intellectual honesty as method**: the dossier contradicts its own charter with cited lines
   (C1-C7), and the prototype contradicts its own spec with numbers (§4, §5). That is the loop
   working. The gap is that nothing propagated back into the spec.

## 8 · What would move F4 to converged

1. Make the bridge reactive (`ref`s), publish the quick axis at boot and on every game change (not
   only `enterGallery`), then measure the strip in the **built app** on a real device — T1 stands
   or falls there.
2. Decide the two-verb read with a mark on the visit verb, or drop the stamp from the card and let
   the picker stage-then-select. As drawn, the card teaches "the button wipes your board".
3. Resolve the listbox: staging outside the `option` (a band under the deck bound to the active
   card) or an explicit non-listbox model. `T8` needs an executed a11y assertion, not a shape probe.
4. Route the deal verb through the ribbon when it also switches games; disable the stamp while the
   ribbon is armed.
5. Reserve the flank band with CSS, not five invisible outline instances; then re-shoot the deck at
   1440 and look at it.
6. Re-price the family with the wrapper deletions netted out, and state the honest number.
