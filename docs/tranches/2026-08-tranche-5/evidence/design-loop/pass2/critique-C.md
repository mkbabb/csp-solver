# LANE C — F2 NARROWED · ADVERSARIAL CRITIQUE (pass 2)

Non-author. Read-only against the lane's real worktree
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_6e1b18f4-0f2-3`
(HEAD `32198688`, 13 modified + 1 untracked, nothing committed), its raw JSON in
`pass2/out/`, its rig in `pass2/rig/`, and `pass2/measure/RESULTS.md`. Every number below was
re-derived by me from the diff or the banked JSON, not read off the report.

**Verdict up front.** Lane C closed the blocker that killed pass-1 F2 — the coarse-regime
inversion — and closed it convincingly, on both engines and then on real glass. That is a real
kill and it deserves saying first. But its second declared blocker is not closed, its ink verdict
substitutes a metric the work order named, two of its nineteen gates cannot fail, five carry no
negative control at all, its §8 ledger's rows do not sum to its own totals, one of its own probes
returned 0 for its headline primitive across 20 cells without being noticed, and its contrast
table has no artifact on disk. **Honest convergence: 62%.**

---

## 0 · THE HEADLINE — THE COARSE GATE IS REAL; I RE-DERIVED IT FROM THE RAW JSON

This is the one thing that had to be true and it is:

| cell | base | f2type | Δ | source |
|---|---:|---:|---:|---|
| 390×844 coarse `mobileCard.scrollHeight` | 619 | 586 | **−33** | `out/{base,f2type}-chromium.json`, identical in `-webkit` |
| 375×812 coarse | 619 | 586 | −33 | same |
| 1280×800 coarse `controlsCard` | 1138 | 1116 | −22 | same |
| 393×699 coarse, **MobileSafari on glass** | 617 | 585 | **−32** | `measure/RESULTS.md` §3 M3 |
| min coarse tap target | 43.2 (ch) / 43.7 (wk) | 44.0 | floor closed | `minTargetPx`, worst `On` → `Size` |

`liveFilterNodes: 26` in **all 20 cells, both builds, both engines** — G8 verified, not asserted.
`regimeOk: true` on every banked cell; `out/negctrl-harness.json` reproduces the pass-1 defect on
demand (452 px, 4/4 witnesses false, same build). The base column reproduces the pass-1 critique's
independent numbers (1026/1138/476/619) to the pixel. **This is the best-calibrated instrument in
the pass and the report's headline is honest.**

The mark-4 grep gate is likewise TRUE on the real diff, which I ran myself rather than trusting
the lane's script (which, note, targets **Lane A's** worktree — `rig/gate-mark4.sh:4` cds to
`wf_6e1b18f4-0f2-1` and greps Lane A's two new files):

```
git diff | grep '^+' | grep -c 'filter:'                          → 0
grep -c 'filter:' src/games/shared/CheckStatus.vue (untracked)    → 0
```

Zero added `filter:` lines including the untracked file. `HandDrawnOutline` is filterless by
construction (pre-baked pose siblings, `HandDrawnOutline.vue` template) and `:pose` supplied ⇒
`beatFrame = null` ⇒ enrols no beat — both claims verified in source, not taken on the comment's
word.

---

## 1 · THE WORK ORDER, ITEM BY ITEM (registry §1 F2 — closure of every numbered item is the bar)

### Item 1 — "Re-measure EVERYTHING at pointer:coarse, both gates, both regimes" — **CLOSED, 95%**

5 cells × 2 engines × regime witness, plus device confirmation within 1 px of prediction. The well
chrome was **priced rather than chosen** (0.75rem/0.55rem cost 122 px and put the coarse desktop
card UP 9 px; the shipped 0.35/0.5 is the measured floor) — that is the discipline the registry
asked for and it is the strongest methodological move in the lane.

Deduction: "EVERYTHING" is **one build of two**. `dist-f2pen` exists, is shipped alongside, and was
never height-gated — see gap G-C2, where I show it costs 12 css px per mount.

### Item 2 — "The settle measured on the BOOTED perf-rig-iphone16 during motion — no WebKit paint timeline, no settle" — **NOT CLOSED, 45%**

The literal bar is unmet, three ways, and the lane's own §9.1 concedes the row is blocking:

1. **No paint timeline exists.** `RESULTS.md` §0: the screen was locked all session ⇒ no Web
   Inspector ⇒ "every 'paint count / raster area / idle paints = 0' threshold … is NOT MEASURABLE
   this pass." The substitute is rAF inter-frame gaps — a jank detector, not a painter census. The
   work order's sentence is "no WebKit paint timeline, no settle."
2. **Not the mandated rig.** Measured on an iPad Pro 13 sim at 1032×1248 portrait, because the
   iPhone 16 at 393 px has no drawer and no glide at all. This is structural, not a lapse — the
   settle is a ≥1024 feature and the mandated device can never enter its regime — but it means the
   rig mandate is unsatisfiable for this row and nobody said so.
3. **The choreography was never positively observed on real WebKit.** `RESULTS` M1-c banks
   `is-taping` in **0 frames** under Reduce Motion and calls T3 met. There is no motion-ON
   `is-taping` frame count on the device to make that zero mean anything — a probe that never fires
   also reports 0. Headless WebKit caught the class in **1** frame of 34 (`out/settle-webkit.json`:
   `tapingFramesSeen: 1`, all three tapes reporting the same `settledAtMs: 282`, `intermediateSamples:
   [0,0,0]` — three identical numbers from one sample). Chromium is the only engine where the settle
   has ever been seen to animate (`settle-chromium.json`: 16 taping frames, `[86.4, 113.3, 139.6]`,
   `[4,4,3]` intermediates — that part is clean).

Credited: the T1 delta (−1.0 ms), the `.control-panel-filtered` mutation count of 0 on device, and
above all the **~280 ms build-independent WebKit stall at drawer-open** (274–284 ms, σ≈4, n=4),
which is the largest and most campaign-relevant number anyone produced this pass and which the lane
correctly refuses to charge to itself. Also credited: the lane instructed its own measurer to retire
T1 if base and head came back indistinguishable, and the measurer did exactly that. That is the loop
working.

### Item 3 — "Fix the die cascade properly … ink weight measured as **rendered stroke mass** vs the headings it commits" — **PARTIAL, 65%**

Cascade: **closed.** `.icon-btn.deal-btn` (specificity, not source order) is in the diff at
`GameControlPanel.vue:1034`-ish; base renders the die at 17.97 px in a 44 px box
(`out/base-chromium.json`, `desktop_1280x800_fine`), head at 28. Verified.

Ink: **the metric was substituted.** The work order says *stroke mass*. By stroke mass, from the
lane's own `out/ink-f2type.json`:

| target | massCssPx² | areaCssPx² | density |
|---|---:|---:|---:|
| `deal_die` | **194.71** | 841 | 0.23153 |
| `heading_difficulty` | **1431.85** | 7104 | 0.20155 |

The die puts **7.35× less ink on the paper** than the heading it commits. G4 passes only under
density — mass normalised by bounding box — and §10 markets the instrument as answering "does this
glyph put less ink on the paper than the heading it commits," which by its own numbers is *yes*.
Worse, **the bar moved with the treatment**: `heading_difficulty` measures 476 device px wide in
base and 444 in head, because the lane's own well padding narrowed the rail column, so the same
untouched heading's density rose 0.19243 → 0.20155 (+4.7%) with no change to its ink. A threshold
derived from an element the change resizes is not a control.

The verdict survives (3.46× mass gain swamps a 4.7% denominator drift) — but the framing does not,
and §4's own concession ("heavier, not un-orphaned") is the honest reading.

### Item 4 — "A11y to contract: label-in-name … **real roving radiogroup or honest plain buttons** … checkArmed named to AT" — **PARTIAL, 60%**

Closed: label-in-name on 8 controls with a **planted negative control that actually fails**
(`out/a11y-f2type.json` → `negControl.containsVisible: false` on pass-1's own markup); `role="status"`
resolves, `statusChanged: true`, sr-only sentence distinct from the visible line; `aria-labelledby`
resolves on all three zones with the tape visible. These are real closures.

Not closed, and this is the substantive one: **the selectors announce no selected state.**
`OptionSelector.vue`'s template carries no `role`, no `aria-pressed`, no `aria-checked`, no
`aria-current`; selection is `font-bold` plus a scribble underline. The lane's own probe records
`tabindex: null` on all 8. So a screen-reader user hears *"pencils, group → marks, group → normal
button, corner button, center button"* and is never told which is active. The work order offered two
outs — a real roving radiogroup, or **honest** plain buttons. Mute buttons are not honest buttons;
they are buttons with the state deleted. G11 discharges the row by counting `role=radio` to zero,
which is satisfied by writing no code (§2 below). And Lane C **added three new named `role="group"`
wrappers around these mute selectors**, which increases the announced structure while the state stays
unannounced — the a11y equivalent of putting a label on a blank dial.

### Item 5 — "LOC honest: … it pays its 427 lines in legibility **measured on device**, or it goes typographic" — **PARTIAL, 65%**

The pen is now ~42 code lines, not 427 — a genuine and large reduction, both renderings built, shot
on both engines, and `ask_stale` reached through the **real** `useAssists` in the built bundle
(`out/bakeoff-type-chromium.json` shows `isMarking: false` with the stale sentence while `selected`
still reads `Ask` — pass-1's vanilla-JS-reimplementation offense is genuinely retired).

But: **"measured on device" did not happen.** `RESULTS.md` §3 M2: NOT RUN, no cold readers. The lane
nonetheless ships `CHECK_RENDERING = "type"` on the strength of its own Chromium-only ink probe —
and that probe's headline comparison is arithmetically wrong (gap G-C1 below).

And the ledger, re-derived with the lane's own stripper (`rig/loc.py`, which I ran):

| file | report | actual |
|---|---:|---:|
| `GameControlPanel.vue` raw | +349 / −53 | **+363 / −53** |
| `GameControlPanel.vue` code-only | 757 → 969 (+212) | **757 → 975 (+218)** |
| plumbing (5 games + 2 relays + 2 tests) | +12 | **+11** (raw **+13**) |
| **total code-only** | **+255** | **+255 ✓** |
| **total raw net** | **+376** | **+376 ✓** |

The totals are right; the rows are not, and they are wrong in the direction that flatters — the
largest file is understated by 6 code lines and 14 raw. Neither column sums to its own stated total
(rows give +250 code-only and +361 raw). On the one item the work order titled "LOC honest," the
ledger does not reconcile with itself.

Also: **zero new tests.** `CheckStatus.vue` is 168 raw / 108 code lines with a six-branch state
machine (`text` × 3 modes × 2 marking values, plus `spoken`) and no `.test.ts` anywhere in `src`.
G17's "unit suite 307/307" is the **pre-existing T4 gate count** (MEMORY.md: "unit 307/29") — the two
`+1` test-file lines are prop plumbing to keep the old suite mounting. And no `vue-tsc` or `vitest`
log is banked in `pass2/`; both claims are unevidenced on disk.

---

## 2 · THE FAILURE-MODE CHECKLIST

### Vacuous convergence — **CLEAN, and notably so**
§9.6 refuses mark 1 outright ("not addressed and is not claimed") where pass 1 claimed it at zero
artifacts. §9.5 refuses to call Deal cured. §7 refuses to attribute the stall to either build. The
lane declines several wins it could have taken. Best row in the dossier.

### Spec-cites-itself — **FOUND, two**
- **G14 (contrast) cites §5, and §5 cites nothing.** `rig/contrast.mjs:56` writes to stdout only;
  there is **no contrast artifact anywhere in `pass2/`** (I grepped every JSON/txt/log for 17.36,
  8.96, 19.45, 15.84, 5.25 — zero hits). The report even narrates a parser bug it fixed mid-pass,
  which is exactly the situation where the corrected output should be banked. The negative-control
  cell for G14 reads "§5" — the assertion pointing at itself.
- **G4's reference moved with the treatment** (item 3 above): the threshold is a measurement of an
  element the change resizes.

### Gates that cannot fail — **FOUND, two live + five uncontrolled**
- **G9 — `useRasterStack` consumers = 3, unchanged.** This is the *verbatim* offense pass 1 named
  ("a tautology for a design that by construction writes no raster code … a true statement, not a
  gate," f2-critique §3.3). Recommitted unchanged, negative control "—".
- **G5 — "die overflows its control: 0 px in every cell."** Overflow is **0 in base too**
  (`railDieOverflowPx: 0`, `mobDieOverflowPx: 0` in all five base cells, both engines). The shipped
  defect was *shrink*, not overflow; the offered control (base's 17.97 px die) does not exercise the
  gate it is attached to. Nothing here could ever have gone red.
- **G11** discharges the radiogroup row by counting an absence (see item 4).
- Registry §4 order 3 binds: *"every gate paired with a negative control that has been shown able to
  fail."* **G9, G11, G12, G14, G17 carry no control at all** — 5 of 19, plus G5's and G11's
  non-exercising ones. Seven of nineteen.

### Elegant-reduction — **FOUND, one, and it is the headline**
"**Six become two**" is a count of `.section-heading` elements, not of names on the card. Rendered,
the card carries: `SIZE`, `DIFFICULTY` (eyebrows) + `new game`, `pencils`, `teacher's` (tapes) +
`marks`, `candidates`, `check` (row labels) = **eight visible names where six stood**. G3 measures
the class, not the phenomenon the owner complained about, and is satisfiable by renaming. The lane's
rank defence is real (three pressure rungs, and §5's ladder is monotone as far as I can check it) —
but the gate as written is a proxy that the change controls, and the sentence "six become two" is not
true of what a player sees.

Also in class: `.zone-row :deep(.ctrl-btn) { min-width/min-height: 2.75rem }` closes the 44 px floor
**only inside the two new compartments**. The Size/Difficulty chips get no floor and clear 44 only by
having longer labels; `minTargetPx.worst` moves `On` → `Size` at exactly 44.0, i.e. the new floor is
one label-length from failing again.

### Legacy aliases — **CLEAN**
`AssistSettings.vue` and `PencilModeToggle.vue` are deleted outright; `grep -rn` over `src` and `e2e`
finds only three prose comments referencing the old names, no imports, no shims. The same-value
re-emit seam is preserved verbatim and documented as load-bearing.

### Masked fallbacks — **FOUND, one latent + one live instrument**
- **Latent:** `rig/bakeoff.mjs:26-28` — the board edit that makes `ask_stale` *be* stale is
  `.click().catch(() => {})` then `.press("3").catch(() => {})`. Had either missed, `ask_stale`
  would have silently shot `ask_armed` and the whole experiment would have compared a state to
  itself. It did not miss — I verified `isMarking: false` with the stale sentence in the banked JSON
  — so this is a hazard, not a defect. But it is the exact shape of the thing the lane's own §6 says
  the rig exists to catch.
- **Live:** `rig/gates.mjs:69-70` counts `.zone-tag`; the shipped class is **`.washi-tag`**. So
  `zoneTagsRail`/`zoneTagsMobile` report **0 on the f2type build in all 20 cells, both engines** — a
  dead probe returning a plausible-looking zero for the lane's own headline primitive, unnoticed. The
  "instrument is not blind" discipline the measurer applied on device (`.tray-well` 6 vs 0) was never
  applied here.

### Unverified gestalt — **FOUND, three**
- **The ink verdict's slots are not the same slot** (gap G-C1). The report's §3 table says "ink mass
  (same slot)."
- **Research open Q5 remains open by the lane's own admission** — three frozen `:pose="0"` frames
  inside one boiling 3 px frame have been screenshotted, never watched. M4 banked 10 s of video and
  explicitly left it unadjudicated. Fine as routing; it means the zone grammar's central visual claim
  is still unread.
- **Dark tape reads struck-through on real glass** (`RESULTS` M5) — the lane predicted the failure
  mode and routed it to Lane D correctly, but the artifact it built does not currently read as
  designed in dark. That is a live visual defect on a shipped surface, routed, not cured.

### Consumer-less substrate — **CLEAN**
`proactiveCheck` is a pre-existing `useAssists` computed (`useAssists.ts`, `live || (on-demand &&
checkArmed)`) now wired through 5 games + 2 relays + 2 test mounts; every game passes it; the prop is
required, so a miss is a type error. `SheetWashiLabel anchor="tag"` has three consumers per mount.
Nothing built without a caller.

---

## 3 · GAPS I FOUND THAT THE LANE DID NOT

### G-C1 (major) — the pen-vs-type ink comparison is not a comparison

`out/ink-f2type.json` vs `out/ink-f2pen.json`, `check_status` target:

| build | wDev × hDev | areaCssPx² | massCssPx² | density |
|---|---|---:|---:|---:|
| TYPE | 444 × **34** | **3774** | 251.08 | 0.06653 |
| PEN  | 444 × **58** | **6438** | 170.89 | 0.02654 |

The slots differ by **1.71×** in area. The report's §3 table is headed "ink mass (**same slot**)" and
its verdict — "the sentence puts 47% more ink on the paper at **2.5× the density**" — is the ratio of
two densities computed over different denominators. Normalised to a common area the ratio is 1.47×,
not 2.5×; and PEN's own glyph density (0.06527) is within **2%** of TYPE's whole-line density
(0.06653). The lane pre-rules the bake-off (`CHECK_RENDERING = "type"`) on this number while M2 is
unrun. Its conclusion may well be right — the `ask_stale` argument (the pen says `put away`, carrying
the state but not the reason) is genuinely the better argument and needs no ink at all. The ink
number should be withdrawn, not leaned on.

### G-C2 (major) — the coarse gate was never run on the build that is 12 px taller

The same JSON says the PEN status line occupies **29 css px** against TYPE's **17** — +12 css px per
mount. The coarse height gate (−33 px, the lane's whole survival argument) was run on `dist-f2type`
only; `dist-f2pen` has an ink run and a bake-off run and **no height cell anywhere in `pass2/out/`**.
If the blind read picks the pen, the headline number is roughly −21, not −33, and §8's "if the pen
loses M2, CheckStatus sheds ~42 code lines" prices the LOC of that branch while omitting its height.
Both dists were built; gating one of them was a choice.

### G-C3 (major) — the ink baseline is contaminated on one of its four targets

`rig/inkmass.mjs:23` — `heading_size` is `.controls-card .section-heading:not([class*=crayon])`,
first match. In **base** that first match is the `New game` heading (`.section-heading.new-game-heading`,
non-crayon, earlier in DOM); in **head** that heading is deleted, so it matches `SIZE`. The two columns
measure **different elements under one label**, which is why mass "drops" 1389.88 → 628.57 (−55%) on an
element nobody touched. Head's 628.57/1431.85 = 0.44 ≈ 4 glyphs / 10 glyphs is the *correct* reading;
base's near-parity is the contaminated one. Not load-bearing (G4 uses `heading_difficulty`) — but this
is precisely the **"uncontaminated before-panes"** defect the registry made a standing harness mandate
(§1 F5 salvage, "with the two defects named"), reproduced and unnoticed inside the lane's own
calibration.

### G-C4 (minor) — the ink probe is Chromium-only

All three `ink-*.json` carry `"engine": "chromium"`. The second named harness mandate is "≥1 WebKit
run." The height gates and the bake-off honour it; the measurement that decides the pen does not, in a
campaign whose entire subject is Safari.

### G-C5 (minor) — G15/G16 have one arm

`out/blast-f2type.json` banks `nth4: "Share board link"`, `firstCtrlBtnText: "4×4"`,
`firstCtrlBtnFontPx: 20`. There is **no `blast-base.json`**. The report says both were "measured on
the dist, not reasoned"; one of the two was. (Both hold — I read
`e2e/share-truth.spec.ts:57` and `e2e/visual-regression.spec.ts:150` and the couplings survive — but
"identical to base" is inference here, not measurement.)

### G-C6 (minor) — six new outline mounts, 18 never-painting pose nodes, unpriced

Each well is a `HandDrawnOutline` rendering `BOIL_CONFIG.frameCount = 4` pose `<g>`s of which one is
opacity 1, plus a `ResizeObserver` and a `generateRectBoilFrames` grain bake per resize. Three wells ×
two mounts = 6 mounts / 24 paths / 18 dead (the `display:none` twin collapses to 0×0 and renders none,
so ~12 live paths and 9 dead at any width). The registry credited F4 for *deleting* five
never-painting outline mounts; Lane C adds six of the same class and the parsimony ledger counts only
source lines. `liveFilterNodes: 26 → 26` correctly shows no filter cost — DOM and layout cost is
simply not on the ledger.

### G-C7 (minor) — the cascade fix is double-owned

`.icon-btn.deal-btn` is Lane D's standalone ship, replicated here. §8 counts its lines but the lane
banks its benefit in G4/G5 and in the fine-desktop numbers. Registry §1 F4 item 5 named this exact
class of accounting ("the 419-LOC wrapper deletion is NOT F4's to claim"); the mirror-image applies.
Two lanes now carry the same edit to the same declaration in the same sheet.

---

## 4 · PASS-1'S NAMED OFFENSES — RECOMMITTED?

| pass-1 offense (f2-critique §3, §4) | pass-2 status |
|---|---|
| Height gates in a regime no phone is in | **Cured**, with a reproducible negative control. The lane's best work. |
| Mark 1 claimed at zero artifact | **Cured** — refused outright (§9.6) |
| D4 verified against a vanilla-JS reimplementation | **Cured** — real composable through the built bundle |
| Die: 56 px glyph escaping a 44 px box (masked fallback) | **Cured** by specificity |
| Ink weight never measured | **Partly** — measured, but as density; by the named metric (stroke mass) the die still loses 7.35× |
| `useRasterStack = 3` tautology | **RECOMMITTED verbatim** as G9 |
| Settle unmeasured on WebKit | **Still open** — no paint timeline exists this session |
| Four a11y defects, sighted-only verdict | **Mostly cured**; one new hole (selection state unannounced) opened under three new named groups |
| Tab-toggle's 83 lines deleted and unpayable | **Cured** — retained, and the reason is stated |
| Contaminated before-pane (F5's mandate) | **RECOMMITTED** in `heading_size` (G-C3) |

Two of ten recommitted, one of them verbatim.

---

## 5 · GAPS, BY SEVERITY

**BLOCKING (2)**
1. **The WebKit settle is not measured.** No paint timeline was obtainable, the mandated device
   cannot enter the drawer regime, and the tape animation has never been positively observed on real
   WebKit (1 frame of 34 headless; 0 frames on device under PRM with no motion-ON counterpart). The
   registry's own sentence — "No WebKit paint timeline, no settle" — is unmet. The lane says so; it
   is still open.
2. **The pen/type decision is pre-ruled on a broken number** (G-C1) **and the losing branch was never
   height-gated** (G-C2). The lane ships `"type"`, so the artifact is coherent — but the decision the
   work order made binding (a device blind read) has not happened and the evidence offered in its
   place does not support its own claim.

**MAJOR (4)**
3. Ink weight measured as density, not the stroke mass the work order names; the reference's box
   shrank because of the lane's own padding (item 3).
4. Selection state unannounced on 8 controls now wrapped in 3 new named groups; the row is discharged
   by counting an absence (item 4).
5. §8's LOC rows disagree with §8's own totals; the largest file is understated (item 5). Zero new
   tests for a 108-code-line state machine; G17 is the pre-existing T4 count.
6. Contaminated ink baseline (G-C3) — the named harness defect, reproduced.

**MINOR (6)**
7. `.zone-tag` vs `.washi-tag` — a dead probe reporting 0 for the headline primitive across 20 cells.
8. G14 contrast: no artifact on disk; G5, G9, G11 cannot fail; 5 of 19 gates carry no control.
9. "Six become two" counts classes, not names; the card gains two visible names.
10. Ink probe Chromium-only; `blast-base.json` absent.
11. Six new outline mounts / 18 dead pose nodes unpriced; cascade fix double-owned with Lane D.
12. Dark tape reads struck-through on real glass (routed to Lane D, not cured); Q5 unwatched.

---

## 6 · STRENGTHS — WHAT SHOULD SURVIVE REGARDLESS OF THE VERDICT

1. **The regime witness** (three observables asserted per cell against what the cell claims, with the
   pass-1 harness reproducible as an on-demand negative control). This is the pattern that turned a
   fatal pass-1 error into a closed row and it should be estate-wide.
2. **Pricing chrome instead of choosing it** — 0.75/0.55 rem measured, rejected at +9 px, and the
   rejection reported. Deletion currency held honestly.
3. **`SheetWashiLabel anchor="tag"`** — +14 code lines on a shared primitive, `role="tooltip"` dropped
   so the visible text can legally be the accessible name, lower case so it is chimera-free by
   construction. Zero raster, zero beat. Portable.
4. **The `ask_stale` diagnosis.** A state the app has carried for a tranche and never shown, reached
   the way a player reaches it, through the shipped composable. This is the best product finding in
   the lane and it needs no ink measurement to stand.
5. **§6 and §7's self-incrimination** — three defects the rig caught in the author's own work,
   including "the settle silently did not run," and a campaign-level stall the lane explicitly
   refuses to charge to itself. §0's correction of its own witness, and §5's admission that the first
   contrast parser was wrong, are the same instinct.
6. **The ~280 ms WebKit drawer-open stall**, confirmed on device, build-independent, σ≈4 ms over four
   runs. Upstream of every family in this loop and the most valuable single output of the session.

---

**Honest convergence: 62%.** Item 1 closed (95%), item 2 open (45%), items 3/4/5 partial
(65/60/65). Pass 1's fatal blocker is dead; the second is not; and the lane's rigor is uneven — the
height instrument is the best in the pass while the ink instrument, which decides the family's other
open question, is contaminated on one target, single-engine, and arithmetically misread on the
comparison it is used for.
