# PASS-2 REGISTRY — convergent design loop, T4-P1 design refinement · 2026-07-31

Agglomerated from: `pass1-registry.md`, `laneA-report.md` / `laneB-report.md` / `lane-c-report.md`
/ `laneD-report.md`, `measure/RESULTS.md`, `critique-{A,B,C,D}.md` + structured verdicts.
Percentages are the critiques' own, verbatim — a % is a position report, never a settlement.
Every gap is enumerated open or closed by a pass-3 work order. Nothing is averaged.

Session facts that bound everything below: the measurement screen was LOCKED all session (no Web
Inspector, no desktop Safari, no sim rotation — RESULTS §0); the ~280ms WebKit main-thread stall
at drawer-open is real, on-device, build-independent (274–284ms, σ≈4ms, both builds — the
largest number of the session and it belongs to no family); the Playwright-WebKit carousel
defect does NOT reproduce on real MobileSafari (RESULTS M5) — headless-WebKit snap indices join
the standing traps ledger.

---

## 1 · ROUTES

### F4 — THE DEALER'S RITUAL (Lane A) · **ADVANCE, center repaired before anything else** (52%)
The architecture held: GATE-1 (the pass — a negative control run against a build patched back to
pass-1's exact defective shape, failing with the ledger on disk), the reactive bridge live at
every seam, the listbox hoist closing four defects in one move, the TTL deleted not tuned. The
delivered center did not: a cross-game `deal` destroys the TARGET game's saved board with no
guard (`attemptDeal` gates on the MOUNTED board's dirty flag — pass-1's safety inversion
half-cured, and the half that loses work is open, one unmodified `d` keystroke deep); the safe
verb silently discards the staged pair (`attemptSelect` emits bare `select` — the split
transaction reproduced inside the control built to fuse it); cross-game truth is falsified on
cold start (`staging-ledger-v1` has no backfill, so the whole installed base sees `start` on
games with saved boards, and `board:` counts GIVENS); and mark 4 is breached by composition —
StagingBand mounts OptionSelectors whose `@media (hover:hover) .ctrl-btn:hover
{ filter:url(#wobble-heart) }` puts 6–7 hover-filtered surfaces into a picker that had zero,
invisible to the donated grep gate.
T1's falsification is BANKED AS A RULING, not a defect: the everyday re-deal belongs to the
drawer (2 taps vs 3 + a 1240ms fold, confirmed a tie-at-best on glass with the 442-vs-0px scroll
the only cold-path discriminator); the picker owns the cross-game switch (one tap and one whole
board generation cheaper, `generatesThrownAway: 1` killed). The strip is dead as an F4
deliverable — its question transfers to the adjudication row.
**Pass-3 work order (binding, ordered):**
1. Target-board guard: `attemptDeal` consults the TARGET id's ledger row (`board && userMoves`),
   not `props.dirty`; the `d` hotkey routes through the same ribbon; `aria-keyshortcuts` added.
2. Fuse the safe verb: `resume`/`start` honours the staged pair or the chips visibly snap to the
   saved board on selection — no verb under the chip rows may silently ignore them; same-id
   `setGame` no-op cut re-cut so a chip change + `resume` is never a silent nothing.
3. Cold-start truth: `canRestore` consults the ledger; backfill or lazily seed rows from the five
   persisted boards on first gallery open; `board` flag counts user moves, not givens; the
   cold-ledger-against-warm-storage cell measured explicitly.
4. Mark-4 cure at the composition level: the band's OptionSelectors drop the hover filter (prop
   it off, or fence it out of the gallery) — then re-run the RENDERED filter census (§4 order 3).
5. Rig debt: `useStagingBridge` unit tests (the pass-1 computed-over-module-state defect is a
   five-line vitest); `gallery-deal.spec.ts` written AND run; `dealStaged`'s discarded `false`
   return handled at its call site; single-tree evidence — every gate and shot retaken on the
   final tree in one run; `f4-spec.md` re-cut (the §4b/§6.3 kenken-Safari claim is refuted by
   M5 and must go); M4 blind read executed with real cold readers; verb ink measured with Lane
   C's inkmass instrument, not asserted; band a11y — the 8 tab stops named, grouped, and bound
   to the active card with a live region.
**Blocking gaps open: 4** (target-board destruction · half-fused safe verb · cold-start falsity ·
mark-4 composition breach). 13 gaps total: 4 blocking / 6 major / 3 minor.

### F1 — CADENCE STRATA (Lane B) · **ADVANCE — lead lane** (62%)
The strip deletion is RATIFIED — the best zero-LOC ruling of the loop, earned four ways
(unaffordable at 1024–1279 with a closed-form bound anyone can re-derive; no user; motivated
only by an overflow now cured in the card; item 3 answered in its strongest form). The ticket is
real: card overflow 448–486 → 0 at every viewport both engines, 6 eyebrows → 2 wells + washi,
Deal dominant at 1.52–1.54× by measured rendered ink with a control that fails loudly on the
shipped card (0.07×), heading chimera ended in the card for zero bytes and device-confirmed
(G5). The mobile ruling (in-flow, tray dead on cost + keypad occlusion) stands. What failed
failed on glass: chip separation 1.6px against the lane's own ≥6px threshold in every row of
every regime (px-1.5 + 0.1rem gap), with the guarding e2e assertion LOOSENED in the same diff
(19→17) — a masked fallback; and idle long-frames roughly DOUBLE against base (8/9/7 vs 4/4/3,
mean −1.4 fps), the only lane moving against base, traced to "no painter" being false — each
posed outline still mounts frameCount=4 `boil-pose` siblings carrying `will-change:opacity`
(+8 permanently promoted layers) + 2 ResizeObservers inside a filtered panel.
**Pass-3 work order:**
1. Separation cured and gated: chip gap ≥6px restored (re-price px/gap), a separation assertion
   ADDED to e2e, the ≥19 font floor restored or the change argued on its own row — never
   loosened in the diff that needs it.
2. The idle regression cured at the primitive: `HandDrawnOutline :pose` prunes its sibling pose
   nodes (or strips `will-change` when posed) so a frozen outline mints zero promoted layers —
   this is F2's primitive too; fix once, both lanes inherit. Re-measure idle long-frames vs base
   on the rig; expected back to base ±1.
3. Deal keypad clearance: +8.9px of scroll headroom (padding-bottom on the card foot) so the
   commit verb fully clears the 296px band at max scroll; re-run the G4 cell.
4. Orphan purge (the §2 "no legacy aliases" made true): `.section-heading` rung
   typography.css:245-269, `.mobile-heading-btn` index.css:681, the stale AssistSettings
   comment; the aria-hidden h2 question decided honestly (headings for AT or real removal, not
   both); `role="tooltip"` off the permanent washi name (adopt C's `anchor="tag"`).
5. Ledger + evidence recut on the final tree (−192, not −202; ink table from one run); washi
   rung folded into the dominance table (380.0 above every selected option — G6's lesson is ALL
   rungs); the DOM-order claim backed by an actual per-element dump; G6 glide poses captured on
   the landscape rig once rotation exists; dark washi lands when D ships `--sheet-washi-neutral`.
**Blocking gaps open: 2** (chip separation w/ masked assertion · idle long-frame regression).
18 total: 2 blocking / 7 major / 9 minor. Mark 3 remains conceded — carried by F3, below.

### F2 — PENCIL-CASE TRAY (Lane C) · **ADVANCE, narrowed again — zone grammar only** (62%)
Pass-1's fatal coarse inversion is genuinely closed: −33px at every coarse cell, both engines,
confirmed on glass within 1px, with the regime witness (three observables + `regimeOk` refusing
its own numbers + the pass-1 harness reproducible as the negative control) — the pattern of the
pass, adopted estate-wide. The zone grammar, `anchor="tag"`, the priced chrome, the ask_stale
diagnosis (reached through the shipped composable — pass-1's D4 offense retired), and 8-of-10
pass-1 offenses cured. Not closed: the WebKit settle (screen locked, wrong sim, tape never
positively observed animating — the literal bar "no WebKit paint timeline, no settle" unmet,
conceded §9.1); and the pen verdict, pre-ruled on a broken comparison (1.71× different slot
areas under a "same slot" header; normalised the densities are within 2%; the PEN branch's +12px
height never gated) with M2 unrun.
**Narrowing: the pen DEMOTES to a decision row, not a build.** `CHECK_RENDERING="type"` stands;
either M2 runs with corrected same-slot artifacts early in pass 3 and the pen wins outright, or
the pen branch (~42 code lines) deletes at pass-3 close. No further pen drafting.
**Pass-3 work order:**
1. The settle on the mandated rig with an unlocked session — Web Inspector paint timeline over
   the glide, motion-ON counterpart to the PRM zero, tape observed animating or the settle
   re-primitived. Rig precondition below (§6).
2. Instrument integrity: inkmass baseline decontaminated (heading_size selects the same element
   in both panes; references pinned so the denominator can't move with the treatment — the
   heading-density bar rose +4.7% from the lane's own padding); the `.zone-tag`→`.washi-tag`
   dead probe fixed; contrast artifacts BANKED not narrated; item-3 answered in the metric the
   order names (stroke mass vs the heading — by mass the die is still 7.35× lighter; either the
   order's metric is met or the density substitution is argued to the adjudicator openly).
3. Item 4 honestly: selection state announced (`aria-pressed` on the plain buttons or a real
   radiogroup) — an absence is not a discharge; G11 given a control that can fail.
4. The rendered-name census: "six become two" re-gated on names-on-the-card (currently eight),
   not `.section-heading` count; the 44px floor extended to the Size/Difficulty chips.
5. `CheckStatus` unit tests (six-branch machine, zero coverage); vue-tsc/vitest logs banked;
   uncontrolled gates (G9/G12/G14/G17) get controls or get struck; the six new outline mounts
   priced (inherits B's pose-prune from F1 order 2); WebKit ink run.
**Blocking gaps open: 2** (settle unmet · pen comparison broken + M2 unrun). 12 total:
2 blocking / 4 major / 6 minor.

### F3 — ONE SHEET, EVERY WIDTH · **RE-ENTERS as CARRIER — both triggers fired** (banked at 34%)
Ruling under §2, charter there. Not a competing family: it carries the winner's grammar.

### F5 — THE PROPORTION LEDGER · **stays RETIRED, salvage flowing** (—)
Salvage confirmed productive: the ladder is live in B and C, the font finding device-confirmed
(G5), the cascade bug shipped by D, the harness discipline visible in every lane. G6's lesson
recommitted twice this pass (B's washi rung, D's estate-register inversion) — the lesson is now
a standing gate clause, §4 order 4.

---

## 2 · ADJUDICATION CLAUSE — STATUS AND RULINGS

**The clause's condition is NOT met.** Lane A is not green on its center (three blocking defects
in the delivered fused transaction + the mark-4 breach); Lane B's center stands but its own G2
failed on glass. The WHERE-staging-lives adjudication is therefore NOT drawn this pass — and it
partially self-resolved: Lane A's own T1 falsification split the question. **Standing ruling:
the everyday re-deal lives in the drawer; the picker owns the cross-game switch.** What remains
for adjudication is only the residue — whether the drawer's staged zone is the everyday deal's
permanent home or a strip ever earns a place — and it is deferred to pass-3 close, both centers
repaired.

**Pre-drawn pass-3 adjudication protocol** (executes only if A closes blockers 1–3 and B closes
its 2): both artifacts built at ONE HEAD, served on adjacent ports, the SAME booted device, the
same session, cells interleaved A-B-A-B to split drift; four transactions measured — same-game
re-deal (drawer warm AND cold), cross-game switch, never-played start — in gestures, scroll px,
deal-tap→board ms; M4/M2-class blind read with ≥4 uninstructed readers on captioned-free crops
of BOTH artifacts; verb ink by the inkmass instrument, same clip discipline; every gate re-run
on the final tree after the last edit, single evidence set. The adjudicator is not an author of
either lane.

**F3 re-entry: BOTH triggers fire.**
- Trigger (a): the pass-2 winner's <1024 answer failed on the booted rig — Lane B's own
  thresholds: chip separation 1.6px vs ≥6px (G2), Deal −8.9px under the keypad at max scroll
  (G4), G6 glide unmeasured on its own build.
- Trigger (b): the owner's ALL-mobile mark survives pass 2 uncured by every lane's own account —
  B concedes mark 3 (−4.8%); C's −33px is a card trim, not co-visibility (best stack 1.632–1.665
  viewports against the 1,072px case); A's mobile cells are gallery-only.
**F3 carrier charter (first line: the six pass-1 blockers — ≥1024 handler leak, inert dead-end,
peek/drag D7, pane scroll, m1 regression, item-2 reproduction):** the sheet substrate carries
Lane B's ticket grammar (and C's wells where they compose) as content — reveal-order doctrine
stays dead, content order is the ticket's; consumes its own banked assets (`--vv-height` anchor —
proven NECESSARY by B's G4 control, the fixed tray 100% occluded; channel split;
run()-per-release; drawerGlide ≡ vaul); keypad band is 296px MEASURED, not the 336 pass 1
assumed; and NO new sheet motion ships until the ~280ms drawer-open stall is attributed —
the stall is upstream of any carrier.

---

## 3 · CONVERGENCE TABLE

Marks: 1 = picker/NEW-GAME hierarchy · 2 = drawer/animation grammar · 3 = mobile wholesale ·
5 = weight-by-rank + Check naturalization. Mark 4 is the standing constraint — violations
charged where found: **Lane A (hover-filter by composition, open), Lane D ship 1 (filtered
subtree box +2.6×, priced not cured), Lane B (grain-static Deal box growth, disclosed).**
Cells: ● evidenced cure · ◐ partial/unmeasured · ○ no artifact · ✗ regressed/refuted.

| family (lane) | m1 | m2 | m3 | m5 | % | open gaps (never averaged) |
|---|---|---|---|---|---|---|
| F4 ritual (A) | ◐ fusion real, verb model undecided (M4 unrun), cold-start ✗ | ◐ zero new beats, but mark-4 breached by composition | ◐ gallery cells green on glass; cold path only | ○ Check untouched | 52 | 13 = 4 blocking (target-board destruction · half-fused verb · cold-start falsity · mark-4 breach) + 6 major + 3 minor |
| F1 strata (B) | ◐ NEW-GAME eyebrow→washi; Deal 1.52× measured; chips fail separation | ◐ strip deleted (hazard moot by construction); G6 own-build unrun; idle long-frames ✗ 2× | ✗ conceded (−4.8%); G4 −8.9px | ◐ rank monotone over printed rungs; washi rung omitted; option chimeras remain | 62 | 18 = 2 blocking (separation+masked assertion · idle regression) + 7 major + 9 minor |
| F2 tray (C) | ○ not claimed (honest) | ◐ settle unmet (locked screen, wrong sim); tapes never watched | ◐ −33px coarse ● on glass; co-visibility unmet | ◐ die ×3.46 density, mass metric substituted; pen undecided; selection unannounced | 62 | 12 = 2 blocking (settle · pen/M2) + 4 major + 6 minor |
| F3 sheet | re-enters as carrier — no pass-2 artifact; six pass-1 blockers ARE the charter | | | | 34 (banked) | 6 blocking, unchanged since pass 1 |
| F5 ledger (D ships) | — | — | — | ladder live in B+C; G6 recommitted ×2 | retired | salvage tracked under Lane D §5 |

The campaign row rides outside the table: **~280ms WebKit drawer-open stall** — pass-3 owns its
attribution (FLIP forced layout + three-pass stroke filter hypothesis) the moment Web Inspector
exists. It is a T4-P1 deliverable in its own right.

---

## 4 · CROSS-POLLINATION REGISTER (pass-2 grafts — each row names the exposing gap)

| donor → recipient | asset | exposing gap |
|---|---|---|
| C → all | the regime witness (3 observables + `regimeOk` + reproducible pass-1 harness as control) | A's evidence warmed by the rig mounting games first; D shipped with zero device rows; B assumed the 336px keypad it faulted pass 1 for assuming |
| C → A, B | inkmass instrument (rendered stroke mass + density, DPR2 clip, pinned references) | A's verb dominance asserted by CSS ink weight with M4 unrun; B's washi rung silently omitted from its dominance table |
| A → all | GATE-1 pattern: negative control = the build patched back to the exact prior defect | B's separation gate loosened instead of failing; C's G5/G9/G11 cannot fail; D's `--self-test` ownership case demonstrated unfalsifiable |
| D → all | TDZ boot-cycle rule (eager scene → game → registry closes a cycle; lazy scenes don't) | A's bridge and any lane touching `registry.ts` — sudokuGame.options is live in A's blast radius |
| B → C, A | effective-opacity instrument (product over ancestor chain, motion-immune, control that held) | C's settle probes and A's fold measurements have no motion-immune opacity witness |
| C → B | `SheetWashiLabel anchor="tag"` (visible tape IS the accessible name; no tooltip role) | B's permanent washi carries `role="tooltip"` on a name that never hides |
| B+F1§2 → C | pose-prune on `HandDrawnOutline :pose` (no `will-change` layers, no sibling pose nodes) | B's idle 2× regression AND C's six unpriced mounts (24 pose paths, ~18 never painting) — one primitive fix, two lanes inherit |
| RESULTS → A | M5: the carousel defect is Playwright-WebKit-only | A's §4b/§6.3 production claim is stale; headless-WebKit snap indices → traps ledger |
| D → B, C | `--ink-press-*` tokens + `lint:ink` (once its self-test is cured) | B and C each hand-roll graphite stops the estate register doesn't see; G6 inversions relocate across the theme boundary (D's own --color-muted-foreground finding) |

**Gate re-cut, binding on every pass-3 lane (order 3 upgraded):** the mark-4 GREP gate is
retired as sole witness — three lanes proved it structurally blind (composition import, class
acquisition, filtered-box growth). Its successor is a **rendered filter census**: in the built
DOM, per regime, count live filtered surfaces AND their union raster area; threshold = zero new
surfaces and area growth ≤ 0 against base; negative control = an injected filtered node must
fire. The grep stays as a cheap pre-filter only.

---

## 5 · LANE D DISPOSITION (58%) — ships, severally

The lane's arithmetic failed audit where its engineering mostly didn't: headline ledger
+146/−514 (net −368) against a re-derived +503/−494 (**net +9**, sign inverted); "18 tests out,
18 in" is 18 out / 10 in (299/28 corroborates the −8, not the claim). All restated below.

| # | ship | disposition |
|---|---|---|
| 1 | `.deal-btn` cascade | **DONE-pending-team-lead-commit, two conditions**: (i) reconcile with Lane C's competing fix (D moves the block, C bumps specificity `.icon-btn.deal-btn` — order-proof; the team lead picks ONE, C's is the stronger argument, D's tree is main); (ii) book the +10.4px filtered-box growth and card-height price in blast-radius; the order comment gains its second bound (must also stay ABOVE the coarse block). Both-engine verification and the coarse negative control are genuine. |
| 2 | font decision row | **DONE — owner decision row open** (A / B / B2 / C priced, rendered, validated to 0.9%; device-confirmed by G5). One fix before it goes to the owner: the table sums 9/50 = 18.0%, not 6/41 = 14.6% — state the BOARD SIZE exclusion or include it. |
| 3 | 419-LOC wrapper deletion | **OPEN.** The deletion, TDZ finding, and knip/boot verification are sound; blocked on: an equality gate for the SudokuGame.vue:47-63 ↔ sudoku/game.ts:29-45 hand copy (unit test or lint rule — a prose comment guards nothing); honest test accounting (10 in, net −8, the +47 scene wiring uncovered); R3b (TDZ on real Safari) run once the rig allows. |
| 4 | AA closures | **OPEN.** The three rungs, the two forced closures, and the ±0.02 re-derivations stand; blocked on: `--self-test` ownership case made falsifiable (it exits 0 with sources() sabotaged AND a live reintroduction present — demonstrated); the `color-mix(… var(--grid-line-color) …)` alias evasion closed; sources() covering .ts; closure 3 (armed sublabel) actually gated; the phantom citation index.css:215 (`inkPressure.test.ts` does not exist) deleted or the test written; the estate-register inversion (muted-foreground crossing the ladder between themes) at least ledgered; `.legend-sep`'s opacity-carried 2.877 named. `lint:ink` into CI = team-lead row, standing. |
| 5 | blast-radius map | **OPEN — refresh mandatory before any pass-3 lane moves**: it predates every lane report and all device rows; it must carry A's surfaces (useStagingBridge, StagingBand), B's ticket, C's wells, the G2/G4 device failures, the 280ms stall, and its own inbound `--sheet-washi-neutral` dark row (routed to D by C's M5, estate-wide). |

Nothing from Lane D commits until ships 3–5's blockers clear; ships 1–2 may commit ahead on
their stated conditions. LOC ledger of record for the pass: **net +9**.

---

## 6 · RIG PRECONDITIONS FOR PASS 3 (owner/team-lead rows, blocking the settle + adjudication)

1. An UNLOCKED session on the rig box (or the owner runs the Web Inspector cells): the settle,
   every paint/raster threshold, and the 280ms attribution are foreclosed until then.
2. Sim rotation (GUI) or a landscape-capable device for B's G6 and the ≥lg coarse cells.
3. ≥4 uninstructed cold readers for the two blind reads (A-M4, C-M2) — no self-grading.
4. All pass-3 evidence single-tree: gates and shots retaken after the final edit, one run, one
   artifact set (the named offense: A's 05:53:45 edit after its 05:53:11 gate).

---

## 7 · EARNED-100% LEDGER POSITION

Pass 2 of ≥3 complete. **Zero families at 100%.** Pass 2 was not a clean pass for any family
(every lane carries ≥2 blocking or ≥4 major gaps), so under the convergence law — zero gaps +
fresh NON-AUTHOR audit + two consecutive clean passes — **the earliest any family can claim 100%
is pass 4**: pass 3 must be its first clean pass, pass 4 its second, each with a fresh non-author
audit. What pass 3 must close for that clock to start, per family: F4 — its 4 blocking + the
spec re-cut + tests; F1 — its 2 blocking + the orphan purge + final-tree ledger; F2 — the settle
+ the pen decision executed + instrument decontamination; F3 — the six blockers, first line;
Lane D is infrastructure and gates the others' commits, not a family. No gap is priced into any
score above; this document is the pass-2 audit of record.
