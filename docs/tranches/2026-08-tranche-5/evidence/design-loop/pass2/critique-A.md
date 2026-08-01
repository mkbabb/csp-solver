# ADVERSARIAL CRITIQUE — PASS-2 LANE A (F4 prime) · non-author audit · 2026-07-31

Read: `pass1-registry.md` §1 F4 (the binding work order), `pass2/laneA-report.md`, the real diffs in
`.claude/worktrees/wf_6e1b18f4-0f2-1`, `laneA-shots/` (22 files), `rig/` (results JSON, gate script,
`added.txt`), `laneA-MEASURE-REQUESTS.md`, `pass2/measure/RESULTS.md` §1.
Everything below was re-derived from the tree, not from the report.

**Verdict: 52%.** Item-by-item fractions average 60%; two charges (a mark-4 breach by composition
that the lane's own donated gate structurally cannot see, and a red-gate stale spec) take it to 52.
The bridge blocker is genuinely dead and its negative control is the best instrument anyone built
this pass. The delivered artifact then carries two new blocking defects in the family's own center,
and the lane's deliverable (the strip) was not built.

---

## 0 · WHAT SURVIVES AUDIT — stated first, because it is real

1. **GATE-1 is a model negative control.** `rig/negative.mjs` runs against a build patched back to
   pass-1's exact defective shape (module `let` read through a `computed`) and the gate **FAILS**:
   `{"activePick":["4×4","Easy"],"kenkenSubline":"size · 4×4 / 5×5 / 6×6","safeVerb":"start"}` with
   `{kenken: 6, HARD}` already on disk. The bug was reproduced and then killed. Nothing else in
   pass 2 has a control this honest.
2. **The reactive bridge is really fixed and really running.** Every seam is a `ref`; `watch(scene,
   …, {immediate:true})` covers boot, deep link, and `?view=gallery` — the entries pass-1's
   `enterGallery`-only publish missed. `App.vue:114` confirms `scene` is the mounted id.
3. **The listbox hoist is four defects in one move, measured:** `stagingControlsInsideOption 0`,
   `bandOutsideListbox true`, 0 stamp frames mounted, flank cards byte-unchanged. Verified in the
   template — `StagingBand` is a sibling of `.gallery-viewport`, after `.gallery-pips`.
4. **No TTL.** Pass-1's 10 s arm with a silent default-deal fallback was *deleted*, not tuned;
   `consumeHandoff` clears unconditionally, so a mis-routed arm cannot outlive one mount. Correct.
5. **§4a is the pass's most valuable self-incrimination.** The lane reports its own headline claim
   (T1) falsified and then draws the consequence — nothing excised, the drawer's staged zone stays.
   That is the loop working.
6. **Parsimony is reported as a cost**: +727 net / +507 code-only, no offsetting deletion, the
   419-LOC wrapper deletion netted OUT to Lane D. Pass-1's spec claimed ~+180 code-only; the lane
   says so in plain words.
7. Volunteered against interest, unprompted: §4c (reservation decorative), §6.5 (`randomDifficulty`),
   §6.6 (ribbon clips the size row), §6.7 (no e2e). RESULTS §4.2 later confirmed §4c independently.

Spot-checks that came back clean: the `default` values do mirror the shipped constants
(`kenkenUrlState.ts:38` = 4, futoshiki `useUrlState.ts:16` = 5, thermo/killer `DEFAULT_SIZE` = 3
matching `sudokuStaging.default = 3`); `randomDifficulty` is sudoku-only; `#wobble-heart` is defined
and `SvgFilters` is mounted at `App.vue:430` outside `<main>`, so no dangling filter reference; the
`:deep()` scoped-CSS rules are proven rendered, not asserted — RESULTS M3 measures chips at
**44.0×44.0** on glass, which is `@media (pointer:coarse) .staging-axis :deep(.ctrl-btn)` firing
through a real Vue scoped-CSS compile. That closes pass-1's `::v-slotted` class of offense.

---

## 1 · THE CHARGE — mark 4 is breached by composition, and the lane's own gate cannot see it

`StagingBand.vue:70-86` mounts two `OptionSelector`s. `OptionSelector.vue:75-79`:

```css
@media (hover: hover) {
  .ctrl-btn:hover { filter: url(#wobble-heart); }
}
```

`git show HEAD:…/GameGallery.vue | grep -c 'ctrl-btn'` → **0**. The picker had **zero**
hover-filtered surfaces before this diff. It now has **6** (sudoku/thermo/killer/kenken) or **7**
(futoshiki) per active card, on every hover-capable pointer — which is precisely the desktop regime
the owner's mark names. The report's §5 sentence **"Zero new live-filter surfaces"** is false on the
estate's own definition of the term.

The gate passes because the `filter:` line lives in the donor component, not in the diff. This is
the checklist's *gates-that-cannot-fail* mode in its purest form, and the irony is exact: the
cross-pollination register donates this gate **F4 → all** with the citation "F1 and F2 both shipped
filter hazards their rigs couldn't see." The donor has now shipped one its own gate cannot see.

The gate's stated negative control is `'flex' 12 ← the grep fires`. That proves the *grep runs*. It
does not prove the *constraint can be violated and caught* — and here it demonstrably cannot be. A
control able to fail would mount a component with a live filter and require the gate to go red.

Nothing in this lane or in RESULTS looked for it: M2 counted `d`/`transform`/`points` mutations over
five snaps and never touched a hover. The estate has documented history on exactly this surface —
`GameControlPanel.vue:794` ("the b1 node-1006 finding"), T4-WM §2's touch fence — so the hazard is
known, priced, and newly imported into the picker unremarked.

**Second-order, unrun:** `.ctrl-btn` carries Tailwind `transition-all duration-150`. The band
rebinds 6–7 chips on every carousel snap (RESULTS M2 recorded 24 mutations, `childList` on
DIV/BUTTON plus `style` on BUTTON), so each snap can run up to seven concurrent 150 ms
all-property transitions inside `.game-gallery`. `e2e/gallery.spec.ts` §7 asserts
`document.getAnimations()` filtered to `.game-gallery` is **0** after the `g` cut. That may still
hold; **the lane never ran it.**

---

## 2 · TWO BLOCKING DEFECTS IN THE DELIVERED CENTER

### 2a · A cross-game `deal` destroys the TARGET game's saved board with no guard

`attemptDeal` (`GameGallery.vue`) gates on `props.dirty`. `App.vue:210-214,480` binds that to
`useBoardDirty()` — the **mounted** board's one dirty flag. So:

> sudoku mounted and pristine · kenken holds an in-progress board · arrow to kenken · press `deal`

→ `props.dirty` is false → **no ribbon** → `stageHandoff` → `useGameState` computes
`canRestore = !staged && …` → false → kenken deals fresh → `saveBoardState()` overwrites. The
kenken board is gone, silently, with no confirmation on any pointer.

At the instant this happens the band is rendering `activeSaved.board === true` and the card beneath
it is printing **"6×6 hard · in progress"**. The datum needed to guard is on screen. The report's
claim — *"A deal is guarded on **any** dirty board, same game or different, on **every** pointer"* —
is true only of the *outgoing* board. The *incoming* half is unguarded.

Pass 1's named blocker was "the two-verb safety inversion — the only visible affordance is the
destructive one." Half of it was cured. The half that actually loses work was not.

The `d` hotkey (`onKeydown case "d"`) does the same thing from one unmodified keystroke, with no
`aria-keyshortcuts`, no visible hint (deliberately), and no confirmation on a pristine board.

### 2b · The safe verb silently throws the staged pair away — the transaction is half-fused

`@resume="attemptSelect"` → `emit("select", card.id)` → `onGallerySelect` → `setGame`. No pair
travels. Consequences:

- **Never-played game:** user sets `6×6` + `Hard` on the chips, presses **`start`**, and gets that
  game's own default board. The two chip rows they just used are discarded without a word.
- **Current game:** `App.vue:125-128` — `setGame` with the same id is an explicit *no-op cut*.
  Changing chips and pressing `resume` is a silent nothing.

Both verbs sit under the same two chip rows, same size, same family, safe-first — and exactly one of
them honours the slip. F4's whole center is *the split transaction fused*; this is the split
transaction reproduced inside the fused control. It is a design defect, not a measurement gap, and
no instrument in the lane or in RESULTS probes it.

---

## 3 · CROSS-GAME TRUTH (work order 4) IS FALSIFIED ON COLD START

`LEDGER_KEY = "staging-ledger-v1"` is a **brand-new store with no backfill**. Every existing user
lands with an empty ledger while their five per-game boards sit on disk untouched. Therefore, on
first load after deploy, for every game:

| what the band shows | what the app does |
|---|---|
| card sub-line = the range line (`size · 4×4 / 9×9 / 16×16`) | a restorable board exists |
| chips = registry `default` | the real saved settings are different |
| safe verb = **`start`** | pressing it **resumes** (`canRestore` is true — the ledger is not one of its terms) |

The verb model's own distinction — *"`start` when the game has never been played"* — is false for
the entire installed base on first load. Every measured cell in the report and in RESULTS was warmed
by the rig mounting the games first; the cold-ledger-against-warm-storage case is never exercised
and never mentioned.

Compounding: `publishStagedLedger` writes `board: Object.values(values.value).some(v => v !== 0)` —
true of every dealt puzzle's **givens**. The lane's own capture proves it: immediately after a fresh
picker deal with zero user moves, `cardSublines` reads **`"6×6 hard · in progress"`**. The predicate
means "has been dealt here once", not "in progress", and after a game's first visit `start` is
unreachable for it forever — so `blind-B` (the `start` crop the verb model's read depends on) is a
one-shot transient state.

Work order 4 says *"chips reflect the persisted board **for every game** or say 'new'."* Neither
branch holds cold.

---

## 4 · MASKED FALLBACK — a guard written and then discarded

`useStagingBridge.ts:74-81`:

```ts
/** … `false` = no game mounted to deal into (the caller then has nothing to await —
 *  never a silent success). */
export async function dealStaged(pair: StagedPair): Promise<boolean> { … }
```

The only call site, `App.vue`: `if (sameGame) await dealStaged(pair);` — return **discarded**. If
the source is unregistered the deal is a no-op, `dealBusy` resets in `finally`, the picker unfolds,
and the user sees the old board with no signal. The comment names the failure it prevents; the code
does not read the value that would prevent it. That is the checklist's masked fallback, with its own
documentation as the confession.

---

## 5 · GATE + LEDGER INTEGRITY — the gate ran against a tree that no longer exists

Re-derived from mtimes:

```
05:49:20 / 05:50:52   rig/results-{webkit,chromium}.json      ← every headless number
05:49:25 – 05:52:07   laneA-shots/*.png (22, incl. blind-A/B) ← every shot, incl. the verb crops
05:53:11              rig/added.txt  (mark-4 gate + LOC ledger)
05:53:45              GameGallery.vue  LAST EDIT              ← 34 s AFTER the gate
05:56:55              dist/ rebuilt                            ← never re-measured headlessly
~05:56                laneA-report.md written
```

Re-derived on the true tree:

| | report | actual |
|---|---:|---:|
| `GameGallery.vue` added | 122 | **128** |
| total added (tracked + both new files in full) | 739 | **745** |
| removed | 12 | 12 ✓ |
| `filter:` in added lines | 0 | **0** ✓ (I re-ran it) |

So the *outcome* of the mark-4 grep survives re-derivation — but the gate and the ledger were both
computed from a stale snapshot, and the report's phrasing **"Mark-4 gate, over the same 739 added
lines"** names a basis that was never the diff. Six added lines of the lane's most-edited file were
never greppped and never shot. The device measurements in RESULTS (06:03–06:34) used the 05:56:55
build; every headless number and every shot in the report used the pre-05:53:45 build. **The two
evidence sets are of different artifacts**, and neither was retaken.

This matters most for the blind-read crops: `blind-A-*.png` / `blind-B-*.png` — the artifacts the
whole verb model is meant to be adjudicated on — are renders of a build that no longer exists.

---

## 6 · MEASURE-REQUESTS vs RESULTS — confirmed, refuted, not run

| row | request | RESULTS | net |
|---|---|---|---|
| **M1** re-deal on glass | picker must not lose in wall-clock | 3 gestures vs **3** (not 3-vs-2), 442 px scroll vs 0, 263 ms vs 101 ms; threshold met by **+1 ms** | **non-discriminating.** RESULTS says so itself: "both totals are instrumentation-bound … the total wall-clock does not discriminate." And its own negative control — drawer already open and in view — **the drawer wins** (2 gestures, ~500 ms less). T1 neither stands nor falls. |
| **M2** band paint cost | idle paints 0/s; per-snap regens 0 | `bandPathDChanged false`, 0 `d`/`transform`/`points` mutations — **but the negative control CANNOT FAIL** (`--staging-reserve: 0px` leaves the box byte-identical at 393) | claim true, **untested by its own control**. Paints not measurable at all (screen locked, no Web Inspector). |
| **M3** coarse targets | ≥44 on glass | chips + verbs **44.0×44.0**, verbs 29.4 px above the viewport foot | **confirmed** |
| **M4** blind read | the deciding instrument for the verb model | **NOT RUN** — no uninstructed readers | **work-order item 2's deciding row is open** |
| **M5** WebKit carousel | reproduce on real Safari | **DOES NOT REPRODUCE.** `ArrowRight`×4 → 1→2→3→4; `End` held at +2200 ms; picker opened while playing kenken → index 4, `kenken, 5 of 5` | **refuted** |
| **M6** screens | hairline work at 3× | crisp, no low-res bite | **confirmed** |

**M5's refutation costs the lane twice.** First, §4b and §6.3 assert *"open the picker on your
current game is broken for kenken on Safari, today, in production"* — that claim is now dead, and
the report was never re-cut. Second, the lane used that defect to justify reduced coverage: *"It is
why WebKit's desktop cross-game row targets futoshiki and its kenken coverage runs at 375."* With
the defect established as a Playwright-WebKit artifact, the substitution loses its warrant — the
WebKit desktop kenken cross-game cell is simply **unmeasured**, and a coverage gap was booked as an
upstream defect.

---

## 7 · CHECKLIST SWEEP

- **vacuous convergence** — not the lane's habit. §4a, §4c, §6.1–6.7 are self-incriminating and
  RESULTS independently confirmed §4c. Clean.
- **spec-cites-itself** — no. Every load-bearing claim traces to a rig JSON key I could open. The
  one exception: the desktop *same-game band = 3 taps* row in §4a's table has no labelled cell in
  `results-*.json` (the JSON's `taps: 3` is the **375 coarse kenken** cell); it is a construction
  from M1b's tap decomposition, presented in a table of measurements.
- **gates that cannot fail** — **two.** (i) the mark-4 grep, §1, structurally blind to composition;
  (ii) `--staging-reserve`, vacuous at 320 headless and vacuous on device (RESULTS §4.2). The lane
  disclosed (ii) itself and did not disclose (i).
- **elegant-reduction** — no. The lane refused the seductive reduction: it did **not** excise the
  drawer's staged zone on the strength of a claim its own numbers had just falsified.
- **legacy aliases** — none. `guardIntent` keys copy only; `.guard-keep`/`.guard-leave` are
  untouched as act hooks. `GalleryStaging` duplicating `CardStaging` is forced by the
  `pencil ↛ games` ESLint boundary and follows the shipped `GalleryCard`/`GameCard` precedent.
- **masked fallbacks** — **one**, §4 (`dealStaged`'s discarded return).
- **unverified gestalt** — **yes.** The report asserts rank: *"`deal` carries the heavier border …
  it is louder than `resume`; it is not alone."* `.staging-deal` is 60% foreground border + an 8%
  fill against `.staging-safe`'s 30% border — so the **destructive verb is still the loudest ink on
  the slip**, asserted by eye, with the one instrument that would settle it (M4) not run. The
  registry's standing lesson from F1/F5 is "dominant by ink weight **measured**, not asserted." No
  contrast row anywhere in the lane either: `.staging-axis-label` is new 0.9 rem
  `--color-muted-foreground` text on `bg-card`, unmeasured, while F5's three sub-AA closures are in
  flight in Lane D.
- **consumer-less substrate** — no. Every export of `useStagingBridge` has a live caller; the band
  has one mount and it renders.

## 8 · COVERAGE — 403 new lines, zero tests

`useStagingBridge.ts` is 150 lines of pure TS — the id-keyed handoff, the ledger's
parse/validate/persist, the identity-guarded clear — with **no unit test**. The single defect that
killed pass 1 (a `computed` over non-reactive module state) is a five-line vitest away and was
instead re-proved by a headless browser rig. The ledger's only test row, `registry.test.ts` +10, is
a **fixture edit forced by making `staging` required** — it tests nothing new.

`vitest 307/307` is consistent with adding no tests. No e2e was written (§6.7, honest) and **none
was run** (not stated). *"`gallery-guard.spec.ts` needs no edit"* is an assertion about a suite the
lane never executed; I read the spec and it looks survivable (the select-intent copy and aria-label
are byte-identical through the ternaries), but "looks survivable" is not the bar the rig mandate
sets. The LOC ledger enumerates its test row honestly; the coverage behind that row is nil.

## 9 · A11Y — one break closed, a quieter one opened

The listbox contract is genuinely restored (`stagingControlsInsideOption 0`). In its place:
**8 new tab stops** (`bandTabStops 8`) sitting outside the listbox with no `role`, no group label,
no `aria-controls`/`aria-describedby` binding them to the active option, and no live region. For a
screen-reader user with DOM focus on the viewport, arrowing between cards silently mutates eight
controls elsewhere in the DOM, with no announcement that the band exists or which card owns it.
`aria-label` on the two verbs interpolates `name`, which is right; the chips inherit
`OptionSelector`'s plain buttons and the `.staging-axis-label` span is **not** associated to them.

The 81 board inputs inside `role="option"` are correctly disclaimed as Wave C2's, not this lane's.

---

## 10 · CONVERGENCE ARITHMETIC — against the lane's OWN work order (registry §1 F4)

| # | work order | closed with evidence | frac |
|---|---|---|---:|
| 1 | reactive bridge **+ strip** in the built app on the rig; T1 decided on-device | bridge ● (GATE-1 with a failing control); **strip NOT BUILT** ✗; T1 measured but non-discriminating ◐ | **0.55** |
| 2 | verb model **decided by a blind read on device**; ribbon routing; inert while armed; `busy` bound | ribbon ●, inert ● (`verbsInert [true,true]`), `busy` ●; **blind read NOT RUN** ✗; ink rank asserted, and the CSS keeps the destructive verb loudest | **0.60** |
| 3 | band outside the listbox; CSS reservation; active-card binding; re-shoot 1440 | outside ●, binding ●, shots ● (stale build); reservation built but **decorative** — control vacuous on device | **0.75** |
| 4 | cross-game truth: persisted per game **or "new"**; sizes id-keyed | id-keying ● (36/49 cells, 1 dispatch, both engines); **cold ledger falsifies both branches** ✗; `board` predicate counts givens ✗ | **0.50** |
| 5 | parsimony honest, wrapper netted OUT; **spec of record re-cut** | parsimony ● and reported as a cost; arithmetic 6 lines short, gate stale; **`pass1/f4-spec.md` untouched at 03:12** ✗ | **0.60** |

Mean **60%**. Charges:

- **−5** mark-4 breached by composition (§1). Registry §2: *"Mark 4 is the standing engineering
  constraint — no lane; violations are charged where found."* Aggravated: the breach is invisible to
  the gate this lane donated estate-wide.
- **−3** redirect order 4 red gate: *"prototype falsifications propagate back into the spec
  same-pass … A stale spec is a red gate."* `f4-spec.md` still carries pass-1's numbers; the report
  is a report, not a spec of record. §4b/§6.3 are additionally stale against RESULTS M5.

**52%.**

## 11 · WHAT PASS 3 MUST CHARTER (ordered)

1. Guard the **incoming** board: `attemptDeal` must arm on `activeSaved?.board`, not only
   `props.dirty`. The datum is already bound. Same for `d`.
2. Make `resume`/`start` carry the staged pair, or remove the chips from the never-played case. One
   of the two verbs currently discards the slip in silence.
3. Backfill or interrogate the ledger on cold start — or stop letting the verb claim "never played"
   from an absence. Test cold-ledger-against-warm-storage explicitly.
4. Re-cut the mark-4 gate so it can fail: mount a live-filtered component and require red. Then
   rule on the 6–7 hover-filter surfaces the band imports into the picker on desktop.
5. Re-run the gate, the LOC ledger, the rig, and the shots on **one** build, and stamp the build
   into every artifact.
6. Unit-test `useStagingBridge` (handoff keying, ledger codec, identity clear) and write
   `gallery-deal.spec.ts`. Run the e2e suite before claiming a spec needs no edit.
7. Build the strip, or formally strike it from the charter — it is a named Lane A deliverable and it
   does not exist. T1 came back a tie on device, so the question it was gated behind is still open.
8. Run M4 (the blind read) with cold readers, on re-shot crops. Measure the two verbs' ink mass
   while you are there.
