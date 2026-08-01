# CRITIQUE A — non-author adversarial audit of pass-3 STAGE A (Lane A / F4)

Auditor is not an author of Lane A. Read-only; nothing in the repo was modified (`git status`
clean before and after).

**Artifact note, first.** The commissioned file `pass3/stageA-report.md` **does not exist**. The
stage's report of record is `pass3/laneA-report.md`, whose first line is literally
`# LANE A / STAGE A`, with `pass3/f4-spec.md` as its spec. Both were audited, together with the
three commits `7ad0f821 → 269039e8 → ca8bb001`, the rig at `rigA/`, and `measure/RESULTS.md` §4 +
`measure/out/A-*.json`. The bar is **pass2-registry §1, F4's five numbered orders**.

**Convergence: 70%** — an honest closed fraction of Lane A's own order, up from 52%. One blocking
gap, six major, eight minor. The lane's evidence discipline is genuinely the best of the pass; two
of its order clauses were dropped without appearing in either the struck table or the open list,
and one shipped safety was quietly removed.

---

## 1 · ORDER-BY-ORDER CLOSURE

| # | order (pass2-registry §1, F4) | verdict | closed |
|---|---|---|---|
| 1 | target-board guard · `d` through the ribbon · `aria-keyshortcuts` | **CLOSED, with a new hole on the same surface** (A1) | 0.75 |
| 2 | fuse the safe verb · same-id `setGame` no-op re-cut | **PART** — `start` fuses; `resume` substitutes a pre-print (disclosed); the `setGame` clause is untouched and unstruck (A4) | 0.50 |
| 3 | cold-start truth · ledger · `board` counts moves · the cold/warm cell | **CLOSED** — backfill real, two-field split correct, `canRestore` declined **with an argument on the page** | 0.85 |
| 4 | mark-4 at composition level + RENDERED census | **CLOSED on the artifact, weak as a gate** (A6, A15) | 0.85 |
| 5 | rig debt — 9 sub-items | **PART** — 5 done, 1 half (A5), 2 missing (A3 undisclosed, A7 disclosed), 1 over-generalised (A9) | 0.64 |

`(0.75 + 0.50 + 0.85 + 0.85 + 0.64) / 5 = 0.718` → **70%**, rounded down for the blocking row.

---

## 2 · BLOCKING

### A1 · A cross-game `deal` abandons the MOUNTED dirty board with **no ribbon** — the safety the verb beside it still enforces

`GameGallery.vue`, the two verbs of the same slip:

```
attemptSelect()  → guard if  props.dirty && currentId != null && card.id !== currentId
attemptDeal()    → guard if (target?.board === true && target.userMoves)
                          || (props.dirty && card.id === props.currentId)
```

Mounted sudoku with `undoDepth > 0`; step to a card whose ledger row is absent or clean; press
`deal`. `destroysWork` is `false` on **both** arms — the target has nothing, and the id differs —
so App runs `unfoldToBoard(select(); setGame(target, {cut:true}))` and sudoku unmounts. The
identical abandonment reached through `select` (or through `resume`, which routes into
`attemptSelect`) fires Wave D's *"leave this puzzle? your marks aren't saved"* ribbon.

Two verbs, one slip, one keystroke apart, different safety for the same loss. Lane A **added** the
unguarded one. It is disclosed nowhere: not in `laneA-report` §3 (what did not survive), not in
`f4-spec` §1 (struck) or §5 (open). It is also ungated — every deal row in
`gallery-deal.spec.ts` (`guard: …arms the ribbon`, `guard: the NEGATIVE control`, `deal: a
cross-game deal lands…`) mounts a **pristine** sudoku, so the cell that would red does not exist.

This is the lane's own center: the order that opened the pass was "the deal asks the card it is
dealing over." It now asks the target and stopped asking the card it is dealing *away from*.

Cure, one line: fold the source-dirty test into `attemptDeal`'s `destroysWork`, and give the
ribbon copy the two cases (A14).

---

## 3 · MAJOR

### A2 · `goldens 4 passed` does not reproduce — MEASURE's matched-pairs control refutes it
`laneA-report` §4 banks `goldens 4 passed · golden-bytes PASS` on `ca8bb001`, in the block headed
*"SINGLE TREE, ONE RUN, AFTER THE LAST EDIT."* `measure/RESULTS.md` §1 ran three rounds on head
and three on the **base dist `6800af04`** — the seal `ca8bb001` sits on top of — and `logo-light`
reds **3948 px, ratio 0.03, 3/3 on each arm**, deterministically. Confirmed in the raw:
`measure/gates-golden-BASE-r{1,2,3}.log` each carry
`Expected: e2e/goldens/logo-light-darwin.png` with a diff attachment. A subject that is red on
both sides of a commit cannot have been green in the middle. RESULTS names Lane B and F3 as having
recorded it non-deterministic; Lane A claimed it **passed**, which is the stronger error, and it
sits inside the lane's single-tree guarantee.

### A3 · Order 5's "verb ink measured with Lane C's inkmass instrument, **not asserted**" — dropped without a struck row
The verb model is decided on structure (`f4-spec` §3, `laneA-report` §2): glyph against no glyph.
That argument is good, and it is *not* the order. The order named an instrument and a measurement.
RESULTS §3.3's inkmass table measures the control panel's rungs and the **drawer's** Deal button —
`.staging-safe` and `.staging-deal` appear in no ink row anywhere in the pass. Neither
`f4-spec` §5 nor `laneA-report` §6 lists it open. A dropped order clause that is neither done nor
banked is the pass-2 "stale spec" offense in a new dress; the lane's own struck-claims table is
the mechanism that should have caught it.

### A4 · Order 2's second clause — "same-id `setGame` no-op cut re-cut" — untouched and unstruck
`App.vue:122-128` still reads `if (next === game.value) { if (opts?.cut) scene.value = next; return; }`,
last edited by `3781ec14` (T4-W12) — no pass-3 commit touches it. The clause appears in no struck
row and no open row. Whether the substance still matters after the divergence pre-print is
arguable; **not adjudicating it in either direction** is the defect.

### A5 · `dealStaged`'s `false` is "handled" into a fallback that cannot fire, behind a comment that says otherwise
`App.vue`, `onGalleryDeal`:

```
if (sameGame && !(await dealStaged(pair))) stageHandoff(payload.id, pair);
```

with the comment *"the incoming mount consumes it exactly as a cross-game deal would."* On the
`sameGame` path there **is no incoming mount** — `setGame(sameId, {cut:true})` is the no-op cut of
A4, `useGameState` does not re-run setup, `consumeHandoff` is never called. The arm sits in module
state until some unrelated later mount calls `consumeHandoff(otherId)`, which returns `null` and
clears it unconditionally. The deal is silently discarded; the rationale printed at the site is
false. Order 5 asked for the return to be *handled at its call site* — it is caught, not handled.

Compounding: **no e2e row exercises the same-game deal at all.** Every row in
`gallery-deal.spec.ts` targets kenken or futoshiki from a mounted sudoku, so the only path that
uses `registerStagingSource`/`dealStaged` in the running app — and the only path with this
fallback — is ungated end to end. `useStagingBridge.test.ts:107` tests `dealStaged` in isolation;
App's wiring around it has no test.

### A6 · The successor gate is blind to the defect class it replaced
Pass 2's mark-4 breach was `@media (hover:hover) .ctrl-btn:hover { filter: url(#wobble-heart) }`
acquired by composition. The registry §4 retired the grep **as sole witness**, keeping it "as a
cheap pre-filter only", and mandated a rendered census. `rigA/census.mjs` samples computed style
**at rest, with nothing hovered** — a `:hover`-scoped filter computes to `none` and is invisible
to it. Its negative control injects a resident filtered `div`, so the control cannot fail on the
hover case either. And `f4-spec` §2 B4 discards the surviving witness outright: *"Gated by the
RENDERED census, not by a grep."* Net: **no witness in this lane covers a re-introduced
hover-state filter in the gallery regime**, which is precisely the defect the order was written
for.

The live cure is real and I verified it independently: `.ctrl-btn:hover`'s wobble is gone at
source (`OptionSelector.vue:83-85` records the P1-W3 deletion; `SvgFilters.test.ts:34-37` names
the three dead hover clients). So this is gate power, not a live regression — but the order said
"re-run the RENDERED filter census", and the census as built cannot red on the thing it replaced.

### A7 · The M4 blind read is still unrun
Order 5 required it *executed with real cold readers*. It is banked as an owner row in both
artifacts (`f4-spec` §3, `laneA-report` §6.1) with the artifacts staged and the lane explicitly
refusing to self-grade — that is the honest disposition and it is exactly right. It is still an
order clause that did not close, for the third pass running (registry §6.3), and item 5 cannot be
called closed while it stands. Charged to the rig/owner row, not to the lane's judgement.

---

## 4 · MINOR

- **A8 · "isomorphic with `canRestore`" overstates the code.** `readPersistedBoard` reproduces
  only `Object.values(persisted.values).some(v => v !== 0)`; `useGameState.ts:820-826`'s
  `canRestore` also requires `initial.source ∈ {url+storage, storage-only, url-board}`. Practically
  unreachable — `setGame` strips `board/size/difficulty/board_size` on every switch — but the word
  is stronger than the implementation, in the file whose whole thesis is that one flag was made to
  carry two truths.
- **A9 · "8 tab stops" is sudoku-only.** 3 sizes + 3 levels + 2 verbs. Futoshiki's band is **9**
  (`boardSizeOptions` = 4/5/6/7). The e2e comment is honest at the site (`…on sudoku`);
  `laneA-report` §1 and RESULTS §4.2 state it as the band's contract, and all six MEASURE cells sit
  on the sudoku card (`ledgerRows: 1` in every cell of `A-band.json`).
- **A10 · `aria-keyshortcuts="d"` on `.staging-deal` advertises a shortcut with no handler there.**
  The only `case "d"` in `src/` is `GameGallery.vue:452`, inside `@keydown` bound to the
  `role="listbox"` viewport; the band is a **sibling**, so band-focused keydowns never reach it.
  Focus the deal button and `d` is dead. The gate is `toHaveAttribute('aria-keyshortcuts','d')` —
  an attribute assertion that cannot fail on this. The e2e row presses `d` only on
  `.gallery-viewport`.
- **A11 · `unionArea` is a sum, not a union.** `census.mjs` does
  `hits.reduce((n,h) => n + h.area, 0)` over per-element bounding boxes; overlaps double-count.
  Conservative for growth detection, so the verdict stands — but "union raster area" is printed
  verbatim in `f4-spec` §2 B4, `laneA-report` §1 and RESULTS §4.1.
- **A12 · `A-band.json`'s `liveRegionText` is a dead probe.** All six cells report
  `"a fresh 9×9 — singles only"` — the **board's** live region, never `.gallery-live`. Same class
  as the `.zone-tag`→`.washi-tag` dead probe charged to Lane C in pass 2. No report leans on it
  (the e2e row carries the claim), so it is a hygiene row, not a false claim.
- **A13 · "81 focusables inside `role=option` — unchanged, delta zero" has no base arm.**
  `A-band.json` holds head cells only. The zero-delta is sound *by construction* (the band is a
  sibling; `bandInsideOption: false` in 6/6) — but "unchanged" reads as a measured comparison and
  no base row exists in the banked artifact.
- **A14 · The ribbon's sub-line is not re-keyed to the intent.** The headline switches
  (`deal over this puzzle?` / `Deal a new board?`) but `your marks aren't saved` is unchanged,
  and on the deal intent the marks at risk are the **target's**, not the mounted board's.
- **A15 · The gallery-regime census has no consumer.** It is a one-off rig script; `filterBudget.ts`
  did not move and `filter-census.spec.ts` still visits the board scene only. Disclosed cleanly in
  both artifacts (§5.2 / §6.2) with the population derived and in hand, and routed to Lane-D-shaped
  infra — the right disposition, but the mark-4 cure for the picker regime is proven once and
  enforced never.

---

## 5 · FAILURE-MODE CHECKLIST

| mode | verdict |
|---|---|
| vacuous convergence | **no** — §3 concedes four claims outright, including one the order itself asked for |
| spec-cites-itself | **partial** — A9, A13: two contract claims restated across three documents from one measurement arm |
| gates that cannot fail | **YES** — A6 (census blind at rest to the hover class it replaced), A10 (attribute-only keyshortcut assertion) |
| elegant-reduction | no |
| legacy aliases | no |
| masked fallbacks | **YES** — A5, with a false rationale printed at the site |
| unverified gestalt | **partial** — the verb model is settled on structure with M4 unrun (A7) **and** the ordered ink measurement dropped (A3); the structural argument is good, but it is the only leg standing |
| consumer-less substrate | **partial** — A15 (census rig, disclosed); `busy` is bound and the band unmounts before it can gate anything |

**Named pass-2 offenses — recurrence check.**
- *Loosened assertions*: **INVERTED, and this is the pass's best row.** `ca8bb001` re-states
  `gallery.spec.ts`'s three live-region assertions as **exact strings**
  (`'futoshiki, 2 of 5. 5×5 easy, new game'`), in the same diff that extends the announcement,
  with the reason at the site. Never a regex. Do not lose this pattern.
- *Non-interleaved theme/gallery numbers*: n/a to this lane; MEASURE interleaved.
- *Grep-as-sole-filter-witness*: correctly replaced by a rendered census — but the pre-filter the
  registry kept was discarded, and the replacement is blind to the original class (A6).
- *Stale specs*: **RECURRED, in the form of silently dropped order clauses** — A3 and A4. The
  struck-claims table exists precisely to prevent this and was not applied to either.

---

## 6 · MARK 6 — COLLATERAL DAMAGE

- **A1** is the collateral row that matters: a shipped Wave-D safety no longer covers one of the
  two verbs in the new slip.
- **A14**: ribbon copy inherited across a new intent.
- `GameCard.vue`'s `rangeLine` now **replaces** the size-range line with the saved-board line for
  any card with a ledger row. Intentional, commented at the prop, and gated in both directions
  (`cold start: …the card keeps its range line`). No damage; noted because it silently changes what
  four of five cards say on a warm install.
- Bundle **+7,438 B raw / +2,379 B gzip**, no offsetting deletion and none claimed. Honest, and no
  size gate in the estate names a threshold it could cross.
- Nothing else moved: `filterBudget.ts` unmoved, board-scene census 9/9 identical in both engines,
  device census `filter` 17=17 and `will-change` 39=39 (RESULTS §7).

---

## 7 · STRENGTHS — do not regress these

1. **The tightened assertions** (above). The inverse of the pass-2 offense, done in the correct diff.
2. **GATE-1 executed four times, each control reding its own rows and no others**: `props.dirty`
   restored → two guard rows red; backfill removed → four rows red; verb un-fused → the `start` row;
   sublabel stripped → the `resume` row. The negative control (*"an untouched target board deals
   straight through"*) means the guard gate is not asserting a constant.
3. **The census is real and the raw matches to the byte.** `rigA/census.json`: 17/0/385,463 gallery
   and 9/0/90,183 board, base and treat, chromium and webkit, `controlFires: true` in all 8 —
   identical to every number printed in `f4-spec` §2 B4, `laneA-report` §1 and RESULTS §4.1. Built
   dist both sides, same counting rule as the shipped spec.
4. **The struck-claims table keeps its dead on the page** — the M5 kenken-Safari claim, the
   never-painting snap, the one-flag deviation, the declined `canRestore` — each with its
   refutation. Four of five deviations from the order are argued in the open. The two that are not
   (A3, A4) are the whole complaint.
5. **The `board`/`userMoves` split is the correct diagnosis**, and its 17 unit rows are written as
   the defects they catch (pass-2 `userMoves`, an overwriting backfill, a non-reactive holder).
6. **The listbox hoist is right on the merits** — APG forbids interactive descendants of `option`,
   and the activedescendant model gives them no tab stop; the band as sibling closes that plus the
   five-instance flank reservation.
7. **Arithmetic reconciles.** 313 + 17 = 330 vitest (verified: 17 `it(` in `useStagingBridge.test.ts`,
   0 new rows in `registry.test.ts` — the fixture only gained fields); 85 + 12 = 97 e2e (verified:
   12 `test(` in `gallery-deal.spec.ts`); 26 shots present in `shots-A/`; LOC ledger matches
   `--stat`. Nothing inflated.

---

## 8 · WHAT PASS 3 MUST CLOSE FOR STAGE A TO START ITS CLEAN-PASS CLOCK

1. **A1** — fold the source-dirty test into `attemptDeal`, re-key the ribbon sub-line, and add the
   two missing e2e cells (dirty source + clean target; same-game deal).
2. **A5** — either make the same-game `false` branch reach a mount or fail loudly; delete the false
   comment either way. Gate the same-game deal end to end.
3. **A3 / A4** — measure the verb ink with the inkmass instrument, or strike the clause on the page
   with an argument. Same for the `setGame` no-op. No third option.
4. **A2** — restate the goldens row against MEASURE's finding; `logo-light` is off its darwin
   baseline on the seal, not passing.
5. **A6** — add a hovered pass (or keep the grep as the registry ordered) so the census can red on
   the class it inherited.
6. **A7** — owner row, unchanged: ≥4 uninstructed cold readers.

Everything else in §4 is a one-line correction to a document.
