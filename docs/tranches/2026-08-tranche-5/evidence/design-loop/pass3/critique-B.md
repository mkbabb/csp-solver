# CRITIQUE B — non-author adversarial audit of pass-3 STAGE B (Lane B / F1)

Auditor: not an author of any pass-3 lane. Read-only against the repo; every claim below is
verified against `git show`, the built dists, the lane's own banked JSON, or the MEASURE lane's
banked logs. Where the report and the artifacts disagree, the artifact wins.

**The stage's report of record is `pass3/laneB-report.md`.** `pass3/stageB-report.md` does not
exist; nothing else in `pass3/` answers F1's order. Audited: `pass2-registry.md` §1 (F1's five
numbered orders), `laneB-report.md`, `pass3/measure/RESULTS.md`, `rigB/*.{mjs,json}`,
`measure/out/*`, `measure/gates-*.log`, and the two commits on MAIN.

**Convergence: 68%** — honest closed fraction of F1's own five-item order, deducted for the
evidence spine (§B2). Pass 2 banked 62%.

---

## 0 · WHAT THE DIFFS ACTUALLY ARE

Both commits exist on MAIN, unpushed, exactly as claimed:

| commit | files | verified |
|---|---|---|
| `a2865f29` | `OptionSelector.vue` (+19/−4 raw), `e2e/visual-regression.spec.ts` (+112/−4 raw) | one declaration `.ctrl-options { gap: 0.45rem }`, `.options-row` gives up `gap: 0.25rem`, one new e2e row |
| `18f92c26` | `SheetWashiLabel.vue` (+8/−2 raw) | `:role="anchor === 'tag' || persistent ? undefined : 'tooltip'"` |

The product diff is four lines of behaviour. The LOC ledger (§6: **+5 product / +84 gate**)
reproduces on an independent code-only count: template +4/−1, CSS +3/−1, washi +1/−1, spec
+85/−1. **The ledger is exact.** `dist-B1` and `dist-Bfinal` are byte-identical
(md5 `7aad1b5a43aba281b0d7aeaa7996364d`), so the lane's single-tree claim for its own artifacts
holds.

---

## 1 · BLOCKING

### B1 · The +65px column price erases a sibling lane's banked cure at the same cell — and the report names the wrong surface, which is what hides it

§1 books the price as *"+65px of **rail** scrollHeight (971 → 1036 at 1440 fine; 1070 → 1135 at
1280 coarse) into a card that is a clipped scroller by design."* Two things are wrong with that
sentence, and the lane's own JSON says so.

**(a) 1280×800 coarse is not the rail.** `rigB/out-B-final-chromium.json` records that cell with
`regime.mqCoarse: true`, `mqHover: false` — the iPad card, not a hover rail. The quoted numbers
are `panelH`, not `scrollH` (scrollH is 1110 → 1175). Calling a coarse iPad panel "rail
scrollHeight" is the naming that lets the row pass as a fine-pointer nicety.

**(b) It inverts Lane C's banked deliverable at that exact cell, and the report never says so.**
Chain, all three points from banked artifacts:

| tree | 1280×800 coarse `panelH` | source |
|---|---|---|
| P1 seal `6800af04` | 1098.25 | `measure/out/B-sep-base.txt`, `C-cells-chromium.json` |
| Lane C's close `573317aa` | **1070** | `rigB/out-B-head-chromium.json` (= `dist-B0`, `index-BHhvxaMKYRhj.js`) |
| Lane B's close | **1135** | `rigB/out-B-final-chromium.json` |

Lane C bought −27.89 at that cell and banked it as a coarse-regime deliverable. Lane B spends
+65 on the same surface, leaving the iPad card **36.8px taller than the seal** — C's cure gone
and inverted, inside the same pass, by a sibling. §1's price paragraph books a magnitude and
suppresses the fact; §9.1 repeats the framing ("the rail column costs +65px of scroll"). It took
the MEASURE lane (§2, "the sign inverted; the panel is now TALLER than base") to surface it.
**Mark 6 finding: collateral damage, real, and concealed by a surface name.**

The same +65 lands at `fine-1440x900`, where the lane's own raw shows Deal's headroom flipping
**+18.47 → −10.28** — a 28.75px movement of the commit verb at max scroll, unreported anywhere.
§1's "no layout moves" is true only of the card box (`clientH` 640 → 640); it is not true of the
verb inside it.

### B2 · §7's gates are entirely unbanked — including the GATE-1 runs the separation cure rests on

§7 asserts `vue-tsc 0 · vitest 313/30 · eslint · knip · prettier · font-coverage 28/13,788 B ·
lint:ink 0 · e2e 85/85 · built-dist 13/13 · golden:bytes PASS · build green`. **No log for any
of them exists anywhere under `pass3/`.** `find pass3 -name '*.log'` returns 37 files; the only
gate logs belong to the MEASURE lane (`measure/gates-*.log`) and to the stall lane. `rigB/`
holds four `.mjs`, thirteen `.json`, and three server logs. Nothing else.

§1 goes further: *"GATE-1, at the source: a build patched back to the exact prior defect → RED,
naming `rail column: column group "4×4" (n=3)`; restored → GREEN. **Both runs banked.**"* They
are not banked. The exact string that would appear in such a log ("keep their separation")
occurs in exactly two files on disk: `laneB-report.md` and `measure/gates-e2e-default.log` — the
non-author lane's run, not B's.

This breaks pass-2 §6 precondition 4 verbatim ("all pass-3 evidence single-tree: gates and shots
retaken after the final edit, one run, one artifact set"). Every number in §7 is narration. The
cure survives only because a non-author lane happened to re-run the suite.

*Mitigation, credited:* `measure/gates-e2e-default.log:83` shows the added row green at HEAD
(`✓ 76 … option chips keep their separation: ≥6px between neighbours, both axes (2.0s)`, inside
101/101), and `measure/out/B-sep-base.txt` shows the rig probe reading 4.00/0.00 on the untreated
seal. The gate is real and can produce sub-floor numbers. What is missing is B's own evidence of
it.

---

## 2 · MAJOR

### B3 · The idle witness cannot fail (gates-that-cannot-fail)

§2's temporal table is **0/0/0 long frames on both arms**. `rigB/idle.mjs` has no injected
control — nothing re-mounts the `will-change` siblings to show the probe would count them. Pass
2's own base read **4/4/3**; this base reads 0, so the instrument changed and the metric now has
zero dynamic range in both directions. Order 2's bar ("expected back to base ±1") is satisfied
by any instrument that reads zero everywhere. The structural half (promoted 8 → 8) is a live
number but also a null delta with no control. The load-bearing evidence for the pose prune is
MEASURE §7's device census (`will-change ≠ auto` 39 = 39 on real WebKit, `boil-pose` 8 → 20) —
which is not this lane's, and which the lane could not have taken.

### B4 · §7's golden bisect is unbanked narration, and the pass's only banked golden logs refute it

§7 prints a six-row bisect (`toggle-crest-dark` ✘ on `127fde0d`, ✓-then-✘✘✘✘ on an unchanged
dist, ✘ on HEAD; `logo-light` "1–2 reds per run" on base) and concludes *"a different pose of the
celestial stack, i.e. capture-timing, not ink."* No golden log exists for Lane B. The six banked
golden runs in the pass (`measure/gates-golden-{r1,r2,r3,BASE-r1,BASE-r2,BASE-r3}.log`) say:
`toggle-crest-dark` **✓ 3/3 on head and 3/3 on base**; `logo-light` **✘ 3/3 on both, 3948 px,
ratio 0.03, deterministically**. The subject is off its darwin baseline **on the seal**, not
flaking. B routed a property to the standing traps ledger that the evidence contradicts, and the
"capture-timing" diagnosis is read off a diff image with no timing instrument behind it. Nothing
was re-baselined — that part is right and is credited in §4 below.

### B5 · The dominance instrument's `sel_difficulty` reference is not pinned, and the report claims it is

`rigB/dominance.mjs` header: *"references pinned BY THEIR RENDERED TEXT."* The locator is
`.ctrl-btn.selected-item, { hasText: /^(easy|normal|hard)$/i }` — it resolves to whichever word
is selected, so the reference is a regex over three different words, not a pinned string.
Consequence, from the banked re-run of B's own script: B's table prints **426.72 · 418.08**;
`measure/out/B-dominance-head.txt` prints **553.29 · 392.39** — a 30% swing in the same engine,
and MEASURE records the locator landing on *"Normal"* in chromium and *"Easy"* in webkit. §5a
discloses contamination for `sel_check` and `caption_candidates` and not for this row, which is
the one that actually moved. (`sel_marks` carries the same hazard: `/^(normal|corner|center)$/i`
also matches a difficulty word, disambiguated only by `.nth(1)`.)

The headline survives — Deal at 191.62 ranks 8th either way — but the row printed as "2.23×
louder" is instrument, and the completeness claim that justifies the whole recut ("G6's lesson is
ALL rungs") is weakened by a rung that isn't stable.

### B6 · Order 4's aria-hidden h2 sub-item is never addressed

F1 order 4 reads: *"…the aria-hidden h2 question decided honestly (headings for AT or real
removal, not both)…"*. The report's §4 answers `.section-heading`, `.mobile-heading-btn`, the
AssistSettings comment and the washi role. The h2 question appears nowhere in the report — not
closed, not refused, not in §9's open list. `GameControlPanel.vue` still carries three `<h2>`
(429, 448, 674) and `aria-hidden="true"` at 481/579/705/803. Silent, and the §0 disposition table
prints order 4 as a single settled row.

### B7 · The per-element DOM-order dump ordered in item 5 is never delivered — and §3's refusal leans on exactly that claim

Order 5: *"the DOM-order claim backed by an actual per-element dump."* No dump appears in the
report or in `rigB/`. §3 then refuses order 3's cure with *"Deal sits above the peek divider, the
play tools and the legend on this tree"* — the assertion the dump was ordered to substantiate.
The refusal is probably right (the G4 headroom is +109 to +131 with a control reading −187 to
−273), but its premise is the one unfurnished item, and a refusal that rests on an
un-instrumented ordering claim is exactly the shape the order was written against.

### B8 · The washi role cure ships with no repo gate, and the a11y defect it diagnoses is left open

The change is correctly scoped — `persistent` has exactly two consumers, both the "hold to peek"
tape (`GameControlPanel.vue:505, 729`); `DrawerTab.vue` hand-rolls its own washi and is
untouched. But nothing in the repo would red if `role="tooltip"` came back:
`e2e/zone-grammar.spec.ts:110` asserts `role: null` for `.washi-tag` **wells** only;
`e2e/mobile-affordances.spec.ts:282` asserts the peek tape's **text**;
`GameControlPanel.test.ts:182` asserts the tag arm. The only witness for the persistent arm is
`rigB/orphan.mjs`, a scratchpad script that leaves with the session. A lane that added 84 lines
of gate for a 7px gap shipped an a11y semantic change ungated.

Worse, §4's own diagnosis — *"the surface it names is a bare `<div>` with **no accessible name at
all**"* (verified: `.peek-hold-surface` at `GameControlPanel.vue:496` carries no `aria-label`,
`role`, or `aria-labelledby`) — is stated and then not cured. Removing the role does not name the
surface. That open defect is not in §9.

---

## 3 · MINOR

- **B9.** Order 5's G6 landscape glide poses: not captured, and the stated precondition was met
  this session — MEASURE ran 844×390 in both engines (§6.1) and shot it (§8).
- **B10.** §4 cites the AssistSettings survivor at `GameControlPanel.vue:267`; it is at line 295.
- **B11.** §2 conflates two instruments in one sentence: "16 pose nodes live in the panel and 3
  paint." 16 is `poses.inPanel` from `measureB.mjs`; 3 is the document-wide painted delta (8→11)
  from `idle.mjs`.
- **B12.** §1's "the phone card is byte-identical" is argued with the 390 numbers only. The
  lane's raw carries the 375 cell too (580 → 580, unmoved), and printing it would have completed
  the claim on both phone cells. The omission is what let MEASURE §2 misattribute Lane C's 375
  shortfall to this lane — see §5 below.
- **B13.** `.ctrl-options` is a second class on the element that already carries the branch class
  (disclosed, §9.6). Its gap is now inherited by `StagingBand`'s two `OptionSelector`s, which
  landed at `269039e8` **after** B and were never in any blast radius. No harm found —
  `measure/out/A-band.json` shows a 382px band with 3 × 52.81 + 2 × 7.19 = 172.8 — but no
  consumer census exists and none was ordered.
- **B14.** §3's 296px keypad band is pass 2's banked constant. MEASURE §6.4 records that the sim
  keypad would not rise this session, so the G4 verdict is headless arithmetic against a banked
  band. B does not say so; MEASURE does.
- **B15.** "frontend-design invoked before the visual work; its calibration here was restraint —
  the deliverable is *air*, not a look" is unfalsifiable and carries no artifact.

---

## 4 · FAILURE-MODE CHECKLIST, AND THE NAMED PASS-2 OFFENSES

| mode | verdict |
|---|---|
| vacuous convergence | **PRESENT.** Three order sub-items (aria-hidden h2, DOM-order dump, G6 landscape) are absent from §0's five-row disposition table, which reads as five settled rows. |
| spec-cites-itself | **MILD.** The 296px band cites "registry §2 / F3 charter", which cites pass 2's measurement; not circular, but a gated verdict rides a constant that could not be re-taken. |
| gates that cannot fail | **PRESENT — the idle probe** (§B3). Not present in the separation gate: it carries a vacuity guard (≥3 paired groups), a regime assertion before any coarse number is banked, and a live in-run control that fires. |
| elegant-reduction | **NOT AN OFFENSE HERE.** Three of five orders were refuted or discharged rather than built, and each refusal is argued on rendered or measured evidence. Two are correct refutations verifiable in source. |
| legacy aliases | **ACCEPTABLE.** One extra class hook, disclosed with its own fold-away condition. |
| masked fallbacks | **NONE FOUND — and this is provable.** `visual-regression.spec.ts:153` reads `toBeGreaterThanOrEqual(19)`; `git log -S 'toBeGreaterThanOrEqual(19)'` returns `d0565631` (T3-W7) as its last touch, and `git log -S 'toBeGreaterThanOrEqual(17)'` returns nothing. Pass 2's signature offense did not recur, and the diff adds 85 gate lines while removing one. |
| unverified gestalt | **PRESENT ×3** — the golden "capture-timing, not ink" diagnosis (§B4), the "Deal is not last" DOM ordering (§B7), the frontend-design restraint claim (§B15). |
| consumer-less substrate | **PRESENT** — the washi role cure has no repo consumer that would red (§B8). |

Named pass-2 offenses, recurrence check:

- **loosened assertions** — did NOT recur (above, with the `git log -S` witness).
- **non-interleaved numbers** — PARTIAL. `idle.mjs` interleaves base-head-base-head correctly;
  `dominance.mjs` is single-run per engine, uninterleaved, and its one unstable row is the row
  that moved 30% on re-run.
- **grep-as-sole-filter-witness** — did NOT recur, and was inverted: `orphan.mjs` opens with
  *"because a grep cannot tell a dead rule from a live one"* and answers a grep-shaped order
  with a rendered census. Both refusals verify independently in source
  (`GameControlPanel.vue:425` applies `.mobile-heading-btn`, `index.css:767` floors it at coarse;
  `.section-heading` is applied at 430/450/675 and its typography rung is live).
- **stale specs** — did NOT recur. §0 re-derives the order against HEAD instead of replaying it,
  and voids pass 2's own −202/−192 ledger rather than massaging it.

---

## 5 · A CORRECTION THE REGISTRY MUST CARRY: MEASURE §2's 375×812 charge is misattributed

MEASURE §2 charges Lane B: *"375×812 … RED — 21.34px of the cure is gone"*, and §9.1 routes it as
*"Lane B bought 7.19px of separation at every cell and paid 21.34px at 375 … the 375 half is
unbooked."* **Lane B's own banked raw refutes this.**

`rigB/out-B-head-chromium.json` is Lane C's close — same bundle hash as `dist-B0`
(`index-BHhvxaMKYRhj.js`), `minGap: 4` (pre-B), and it reproduces C's other two banked numbers
exactly (390 coarse 558 ≡ C's −32.55; 1280 coarse 1070 ≡ C's −27.89). Its 375×812 `panelH` is
**580**. `out-B-final-chromium.json` is **580**. **Lane B moved that cell by zero.**

The −21.34 is Lane C's banked 375 figure not reproducing: `lane-c-report.md:55` claims
590.84 → **558.27**; two independent instruments (B's rig at C's close, MEASURE's rig at HEAD:
579.61) both read ~580. MEASURE's attribution run (`out/attrib-BA-chromium.json`) carries only a
B-close arm and an A-close arm, so it can separate A from B and can never separate B from C — it
was used to make a claim it structurally cannot support.

Route the 375 row to **Lane C**, keep the 1280-coarse row on **Lane B** (§B1), and note that the
pass has no C-close arm in its single-tree evidence set.

---

## 6 · WHAT THIS STAGE DID WELL

1. **The separation cure is the cleanest deliverable in the pass.** One declaration, both axes,
   7.19px at five cells in two engines, reproduced by a non-author lane
   (`measure/out/B-sep-head.txt`) and confirmed on real MobileSafari at 393×699
   (RESULTS §6.2) — the lane's only on-glass number, and it is the one that matters.
2. **The gate is the addition pass 2 owed, not a loosening.** Vacuity guard, regime witness
   before any coarse number is banked, a live in-run negative control, and per-group failure
   naming. Green at HEAD in the pass's only banked e2e log.
3. **The defect was found to be bigger than the order knew** — the column axis sat at exactly
   0.00px, two 44px coarse targets sharing an edge, in the *shipped* estate, not in pass 2's
   unlanded diff. The lane re-derived rather than replayed.
4. **The orphan purge was refused on rendered evidence** against a grep-shaped order — the exact
   inversion of pass 2's own grep offense, and both refusals hold under independent inspection.
5. **The dominance recut refutes F1's own central pass-2 number** (Deal 8th of 13 by mass, its
   "dominant at 1.52–1.54×" dead) and prints the mass/density disagreement instead of resolving
   it. G6's lesson applied against its own author is the rarest move in the loop.
6. **The LOC ledger is exact and reproduces independently** (+5 / +84); pass 2's figure is voided
   with a reason, not corrected into plausibility.
7. **Nothing was re-baselined on the goldens**, and the lane said so plainly — the diagnosis is
   wrong (§B4) but the discipline was right.
8. **Single-tree discipline on its own artifacts is real** — `dist-B1` ≡ `dist-Bfinal`, byte for
   byte.

---

## 7 · CONVERGENCE ARITHMETIC (F1's own five orders, nothing averaged into a verdict)

| order | closed | why not 1.0 |
|---|---|---|
| 1 · separation ≥6px + ADDED gate + ≥19 floor | **0.80** | cure and gate real and independently reproduced; GATE-1 runs unbanked; price mis-surfaced and C's cure inversion unnamed (B1) |
| 2 · idle cured at the primitive, re-measured | **0.70** | cure verified (C's); the temporal witness has zero dynamic range and no control (B3) |
| 3 · Deal keypad clearance, G4 re-run | **0.85** | refuted on evidence with a live control; DOM-order premise asserted (B7); headless-only against a banked band (B14) |
| 4 · orphan purge + washi role | **0.70** | two refusals correct and rendered; aria-hidden h2 never addressed (B6); role cure ungated and its named defect left open (B8) |
| 5 · ledger + evidence recut | **0.55** | ledger exact and washi rung folded in (self-refuting, credited); DOM dump and G6 landscape not delivered; the dominance reference is not pinned (B5) |

Mean 0.72, minus the §B2 evidence spine — a stage whose entire gate line is unverifiable from the
record cannot claim its orders closed at face value. **68%.**

**Blocking open: 2** (column-price collateral concealed by a surface name · gates and GATE-1
unbanked). **15 gaps total: 2 blocking / 6 major / 7 minor.**

Under the convergence law this is **not a clean pass** for F1, so the 100% clock does not start;
the earliest F1 can claim 100% remains pass 5 unless pass 4 is clean. The two pass-2 blockers
(chip separation with its masked assertion · idle long-frame regression) are both genuinely
closed — the first with the best gate of the pass, the second by a sibling lane and witnessed on
a device by a third. What replaced them is smaller and different in kind: a booked price that
quietly undoes a sibling's banked cure, and an evidence spine that exists only because someone
else re-ran the suite.
